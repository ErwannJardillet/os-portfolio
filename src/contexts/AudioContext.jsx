import { createContext, useContext, useState, useEffect, useRef } from 'react';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('audioVolume');
    return saved ? parseFloat(saved) : 0.5;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioContextRef = useRef(null);
  const audioElementRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const gainNodeRef = useRef(null);

  useEffect(() => {
    // Initialiser l'AudioContext
    const initAudio = async () => {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;

        // Créer l'élément audio
        const audio = new Audio();
        audio.loop = true;
        audio.crossOrigin = 'anonymous';
        audioElementRef.current = audio;

        // Créer l'analyser avec une meilleure réactivité
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 2048; // Plus de détails pour une meilleure visualisation
        analyser.smoothingTimeConstant = 0.05; // Plus réactif (0.3 au lieu de 0.8)
        analyserRef.current = analyser;

        // Créer le gain node pour le volume
        const gainNode = ctx.createGain();
        gainNode.gain.value = isMuted ? 0 : volume;
        gainNodeRef.current = gainNode;

        // Connecter : audio -> gain -> analyser -> destination
        const source = ctx.createMediaElementSource(audio);
        source.connect(gainNode);
        gainNode.connect(analyser);
        analyser.connect(ctx.destination);
        sourceRef.current = source;

        // Charger le premier fichier audio disponible
        const audioFiles = ['/audio/ambient1.mp3', '/audio/ambient.mp3', '/audio/music.mp3'];
        let fileLoaded = false;
        for (const file of audioFiles) {
          try {
            audio.src = file;
            await new Promise((resolve, reject) => {
              audio.oncanplaythrough = resolve;
              audio.onerror = reject;
              audio.load();
            });
            fileLoaded = true;
            break;
          } catch (e) {
            console.log(`Fichier ${file} non trouvé, essai suivant...`);
          }
        }
        if (!fileLoaded) {
          console.warn('Aucun fichier audio trouvé. Placez un fichier dans /public/audio/');
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation audio:', error);
      }
    };

    initAudio();

    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    }
    localStorage.setItem('audioVolume', volume.toString());
  }, [volume, isMuted]);

  const play = async () => {
    if (audioContextRef.current && audioElementRef.current) {
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      try {
        await audioElementRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Erreur lors de la lecture:', error);
      }
    }
  };

  const pause = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const setVolumeValue = (newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    if (clampedVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const value = {
    volume,
    isPlaying,
    isMuted,
    analyser: analyserRef.current,
    audioContext: audioContextRef.current,
    setVolume: setVolumeValue,
    toggleMute,
    play,
    pause,
    togglePlayPause,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
}
