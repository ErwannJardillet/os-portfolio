/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioCtx = createContext(null);

const AUDIO_FILES = ['/audio/ambient.mp3', '/audio/ambient1.mp3', '/audio/music.mp3'];
const DEFAULT_VOLUME = 0.2;

export function AudioProvider({ children }) {
  const [isPlaying, setIsPlaying]   = useState(false);
  const [isMuted,   setIsMuted]     = useState(false);
  const [volume,    setVolumeState] = useState(() => {
    const saved = localStorage.getItem('audioVolume');
    return saved ? parseFloat(saved) : DEFAULT_VOLUME;
  });
  const [analyser, setAnalyser] = useState(null);

  // Refs — survivent aux re-renders sans déclencher d'effets
  const audioRef   = useRef(null); // HTMLAudioElement
  const ctxRef     = useRef(null); // AudioContext (Web Audio)
  const gainRef    = useRef(null); // GainNode (volume)
  const wantPlay   = useRef(false);// true = l'utilisateur veut jouer mais le navigateur bloque

  // ─── Construction du graph Web Audio (une seule fois) ──────────────────────
  // Appelé juste avant le premier play() pour que l'AudioContext soit créé
  // dans un contexte favorable (après que le navigateur ait accepté play()).
  const buildGraph = () => {
    if (ctxRef.current) return; // déjà construit

    const Klass = window.AudioContext || window.webkitAudioContext;
    const ctx   = new Klass();
    ctxRef.current = ctx;

    const gain = ctx.createGain();
    gain.gain.value = DEFAULT_VOLUME;
    gainRef.current = gain;

    const node = ctx.createAnalyser();
    node.fftSize = 2048;
    node.smoothingTimeConstant = 0.05;
    setAnalyser(node);

    const source = ctx.createMediaElementSource(audioRef.current);
    source.connect(gain);
    gain.connect(node);
    node.connect(ctx.destination);
  };

  // ─── Tentative de lecture ───────────────────────────────────────────────────
  // Retourne true si la lecture a démarré ET que l'AudioContext est actif.
  // Retourne false si bloqué par le navigateur, ou si l'AudioContext reste
  // suspended malgré resume() (autoplay policy sans gesture utilisateur).
  const tryPlay = async () => {
    const audio = audioRef.current;
    if (!audio?.src) return false;

    try {
      buildGraph();

      if (ctxRef.current.state === 'suspended') {
        await ctxRef.current.resume();
      }

      await audio.play();

      // Vérification critique : audio.play() peut réussir sans erreur
      // même si l'AudioContext reste suspendu (son routé dans le silence).
      // Chrome suspend l'AudioContext dès sa création sans gesture utilisateur,
      // et resume() resolve sans changer l'état dans ce cas.
      if (ctxRef.current.state === 'suspended') {
        // L'audio HTMLElement joue mais passe par un graph silencieux.
        // On annule et on laisse wantPlay=true pour retry au prochain clic.
        audio.pause();
        audio.currentTime = 0;
        return false;
      }

      wantPlay.current = false;
      setIsPlaying(true);
      return true;
    } catch {
      // NotAllowedError = autoplay bloqué, AbortError = audio pas prêt, etc.
      return false;
    }
  };

  // ─── Initialisation au montage ─────────────────────────────────────────────
  useEffect(() => {
    const audio = new Audio();
    audio.loop   = true;
    audio.volume = 1; // le volume est géré par le GainNode, pas ici
    audioRef.current = audio;

    // Chargement du premier fichier audio disponible
    (async () => {
      for (const file of AUDIO_FILES) {
        const ok = await new Promise(resolve => {
          audio.src = file;
          audio.oncanplaythrough = () => resolve(true);
          audio.onerror          = () => resolve(false);
          audio.load();
        });
        if (ok) break;
        audio.src = '';
      }

      // Si play() a été demandé pendant le chargement, on réessaie maintenant
      if (wantPlay.current) {
        tryPlay();
      }
    })();

    // Handler de déblocage : au premier clic ou touche, on réessaie si en attente
    const unlock = async () => {
      if (!wantPlay.current) return;
      const ok = await tryPlay();
      if (ok) {
        window.removeEventListener('click',   unlock);
        window.removeEventListener('keydown', unlock);
      }
    };
    window.addEventListener('click',   unlock);
    window.addEventListener('keydown', unlock);

    return () => {
      window.removeEventListener('click',   unlock);
      window.removeEventListener('keydown', unlock);
      audio.pause();
      ctxRef.current?.close();
    };
  }, []);

  // ─── Sync volume / mute → GainNode ─────────────────────────────────────────
  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = isMuted ? 0 : volume;
    }
    localStorage.setItem('audioVolume', String(volume));
  }, [volume, isMuted]);

  // ─── API publique ───────────────────────────────────────────────────────────
  const play = async () => {
    wantPlay.current = true;
    await tryPlay();
    // Si tryPlay() retourne false, wantPlay reste à true
    // → le handler unlock() prendra le relais au prochain clic
  };

  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const togglePlayPause = () => (isPlaying ? pause() : play());

  const setVolume = (v) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (clamped > 0) setIsMuted(false);
  };

  const toggleMute = () => setIsMuted(m => !m);

  return (
    <AudioCtx.Provider value={{ volume, isPlaying, isMuted, analyser, setVolume, toggleMute, play, pause, togglePlayPause }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
}
