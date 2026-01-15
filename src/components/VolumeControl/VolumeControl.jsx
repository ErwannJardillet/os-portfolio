import { useState, useRef, useEffect } from 'react';
import { useAudio } from '../../contexts/AudioContext';
import styles from './VolumeControl.module.css';

export default function VolumeControl() {
  const { volume, isMuted, setVolume, toggleMute } = useAudio();
  const [showSlider, setShowSlider] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSlider(false);
      }
    };

    if (showSlider) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSlider]);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      );
    } else if (volume < 0.5) {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
        </svg>
      );
    } else {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      );
    }
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <button
        className={styles.iconButton}
        onClick={() => setShowSlider(!showSlider)}
        aria-label="Contrôle du volume"
      >
        {getVolumeIcon()}
      </button>
      
      {showSlider && (
        <div className={styles.sliderContainer}>
          <div className={styles.sliderWrapper}>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className={styles.slider}
              aria-label="Volume"
            />
            <div className={styles.volumeValue}>{Math.round((isMuted ? 0 : volume) * 100)}%</div>
          </div>
          <button
            className={styles.muteButton}
            onClick={toggleMute}
            aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
          >
            {isMuted ? '🔊' : '🔇'}
          </button>
        </div>
      )}
    </div>
  );
}
