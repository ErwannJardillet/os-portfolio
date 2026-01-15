import { useState, useEffect } from "react";
import styles from "./BootScreen.module.css";

const BOOT_MESSAGES = [
  "Initializing system...",
  "Loading modules...",
  "Starting desktop environment...",
  "Ready"
];

const BOOT_DURATION = 4500; // 4.5 secondes
const MESSAGE_INTERVAL = BOOT_DURATION / BOOT_MESSAGES.length;

export default function BootScreen({ onBootComplete }) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Animation des messages
    const messageTimers = BOOT_MESSAGES.map((_, index) => {
      return setTimeout(() => {
        setCurrentMessageIndex(index);
        setDisplayedMessages((prev) => [...prev, BOOT_MESSAGES[index]]);
      }, index * MESSAGE_INTERVAL);
    });

    // Animation de la barre de progression
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2; // Incrément de 2% pour atteindre 100% en ~2.5s
      });
    }, BOOT_DURATION / 200); // 200 étapes sur la durée totale

    // Fade-out et callback à la fin
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        if (onBootComplete) {
          onBootComplete();
        }
      }, 300); // Délai pour l'animation de fade-out
    }, BOOT_DURATION);

    return () => {
      messageTimers.forEach(timer => clearTimeout(timer));
      clearInterval(progressInterval);
      clearTimeout(fadeOutTimer);
    };
  }, [onBootComplete]);

  return (
    <div className={`${styles.bootScreen} ${isFadingOut ? styles.fadeOut : ''}`}>
      <div className={styles.bootContent}>
        <div className={styles.messages}>
          {displayedMessages.map((message, index) => (
            <div
              key={index}
              className={styles.message}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {message}
            </div>
          ))}
          {currentMessageIndex < BOOT_MESSAGES.length - 1 && (
            <div className={styles.message}>
              <span className={styles.cursor}>_</span>
            </div>
          )}
        </div>
        
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className={styles.progressText}>{Math.round(progress)}%</div>
        </div>
      </div>
    </div>
  );
}
