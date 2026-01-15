import { useEffect } from 'react';
import { useAudio } from '../../contexts/AudioContext';

export default function AudioPlayer() {
  const { play } = useAudio();

  useEffect(() => {
    // Démarrer la lecture automatiquement au chargement
    const timer = setTimeout(() => {
      play();
    }, 1000); // Petit délai pour laisser l'audio se charger

    return () => clearTimeout(timer);
  }, [play]);

  // Ce composant ne rend rien, il gère juste la lecture
  return null;
}
