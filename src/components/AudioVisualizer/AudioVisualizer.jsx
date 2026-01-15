import { useEffect, useRef, useState } from 'react';
import { useAudio } from '../../contexts/AudioContext';
import styles from './AudioVisualizer.module.css';

export default function AudioVisualizer() {
  const animationFrameRef = useRef(null);
  const { analyser, isPlaying } = useAudio();
  const [heights, setHeights] = useState([0, 0, 0, 0]);

  useEffect(() => {
    let frequencyDataArray = null;
    let bufferLength = 0;

    // Initialiser les arrays de données si l'analyser est disponible
    if (analyser) {
      bufferLength = analyser.frequencyBinCount;
      frequencyDataArray = new Uint8Array(bufferLength);
    }

    const updateHeights = () => {
      if (!isPlaying || !analyser || !frequencyDataArray) {
        setHeights([0, 0, 0, 0]);
        animationFrameRef.current = requestAnimationFrame(updateHeights);
        return;
      }

      // Réinitialiser si l'analyser a changé
      if (bufferLength !== analyser.frequencyBinCount) {
        bufferLength = analyser.frequencyBinCount;
        frequencyDataArray = new Uint8Array(bufferLength);
      }

      // Obtenir les données fréquentielles
      analyser.getByteFrequencyData(frequencyDataArray);

      // Les basses fréquences sont dans les premiers indices du tableau
      // On divise les basses fréquences en 4 groupes pour les 4 rectangles
      // Utiliser environ 20% du buffer pour les basses fréquences (plus réactif)
      const bassRange = Math.max(4, Math.floor(bufferLength * 0.2));
      const groupSize = Math.floor(bassRange / 4);

      const newHeights = [];
      for (let i = 0; i < 4; i++) {
        const startIdx = i * groupSize;
        const endIdx = Math.min(startIdx + groupSize, bassRange);
        
        // Calculer la moyenne des fréquences dans ce groupe avec pondération
        let sum = 0;
        let count = 0;
        for (let j = startIdx; j < endIdx; j++) {
          // Pondérer davantage les premières fréquences (basses plus profondes)
          const weight = 1 + (1 - j / bassRange) * 0.01; // Plus de poids pour les basses
          sum += frequencyDataArray[j] * weight;
          count += weight;
        }
        
        const avg = count > 0 ? sum / count : 0;
        // Normaliser entre 0 et 100% avec forte amplification pour les basses
        const normalized = Math.min(100, (avg / 255) * 100 * 0.5); // Amplification 2.2x pour plus de réactivité
        newHeights.push(normalized);
      }

      setHeights(newHeights);
      animationFrameRef.current = requestAnimationFrame(updateHeights);
    };

    updateHeights();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyser, isPlaying]);

  return (
    <div className={styles.visualizerContainer}>
      {heights.map((height, index) => (
        <div
          key={index}
          className={styles.bar}
          style={{ height: `${Math.max(2, height)}px` }}
        />
      ))}
    </div>
  );
}
