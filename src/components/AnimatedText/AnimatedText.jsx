import { useState, useEffect, useMemo, useRef, Children, cloneElement, isValidElement } from "react";
import styles from "./AnimatedText.module.css";

/**
 * Composant qui anime le texte mot par mot de manière aléatoire
 * @param {React.ReactNode} children - Le contenu JSX à animer
 * @param {string} animationKey - Une clé pour forcer la réanimation lors du changement de contenu
 */
export default function AnimatedText({ children, animationKey }) {
  const [visibleWords, setVisibleWords] = useState(new Set());
  const containerRef = useRef(null);
  const wordKeysRef = useMemo(() => new Map(), []);

  // Fonction récursive pour traiter les enfants et remplacer le texte par des mots individuels
  const processChildren = (children, parentKey = "root") => {
    return Children.map(children, (child, index) => {
      const key = `${parentKey}-${index}`;

      // Si c'est un nœud texte, le diviser en mots
      if (typeof child === "string" || typeof child === "number") {
        const text = String(child);
        // Diviser le texte en mots et espaces en préservant les espaces
        const wordsAndSpaces = text.split(/(\s+)/);
        
        return wordsAndSpaces.map((segment, segmentIndex) => {
          // Ignorer les segments vides
          if (segment.length === 0) return null;
          
          const wordKey = `${key}-word-${segmentIndex}`;
          const isSpace = /^\s+$/.test(segment);
          
          // Pour les espaces, les rendre directement visibles
          if (isSpace) {
            return (
              <span key={wordKey} className={styles.space}>
                {segment}
              </span>
            );
          }
          
          // Pour les mots, les envelopper dans un span animable
          wordKeysRef.set(wordKey, true);
          return (
            <span 
              key={wordKey} 
              className={styles.word} 
              data-word-key={wordKey}
            >
              {segment}
            </span>
          );
        }).filter(Boolean);
      }

      // Si c'est un élément React valide, cloner et traiter ses enfants
      if (isValidElement(child)) {
        const childChildren = child.props?.children;
        const processedChildren = processChildren(childChildren, key);

        return cloneElement(child, {
          key: child.key || key,
          ...child.props,
          children: processedChildren,
        });
      }

      // Si c'est un tableau ou fragment, traiter récursivement
      if (Array.isArray(child)) {
        return processChildren(child, key);
      }

      return child;
    });
  };

  const processedContent = useMemo(() => {
    wordKeysRef.clear();
    return processChildren(children);
  }, [children, animationKey]);

  // Réinitialiser l'animation quand le contenu change
  useEffect(() => {
    setVisibleWords(new Set());

    const wordKeys = Array.from(wordKeysRef.keys());
    
    if (wordKeys.length === 0) return;

    // Mélanger aléatoirement l'ordre d'apparition
    const shuffledKeys = [...wordKeys].sort(() => Math.random() - 0.5);

    // Créer les timeouts pour révéler chaque mot
    const timeouts = shuffledKeys.map((wordKey) => {
      // Délai aléatoire entre 0 et 500ms
      const delay = Math.random() * 500;
      
      return setTimeout(() => {
        setVisibleWords((prev) => {
          const next = new Set(prev);
          next.add(wordKey);
          return next;
        });
      }, delay);
    });

    // Nettoyer les timeouts au démontage ou changement de contenu
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [processedContent, animationKey]);

  // Appliquer les classes visibles aux mots
  useEffect(() => {
    if (!containerRef.current) return;
    
    const words = containerRef.current.querySelectorAll(`[data-word-key]`);
    words.forEach((word) => {
      const key = word.getAttribute("data-word-key");
      if (visibleWords.has(key)) {
        word.classList.add(styles.visible);
      } else {
        word.classList.remove(styles.visible);
      }
    });
  }, [visibleWords]);

  return <div ref={containerRef} className={styles.container}>{processedContent}</div>;
}
