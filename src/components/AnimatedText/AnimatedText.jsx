import { useState, useEffect, useMemo, useRef, Children, cloneElement, isValidElement } from "react";
import styles from "./AnimatedText.module.css";

/**
 * Composant qui anime le texte lettre par lettre de manière aléatoire
 * @param {React.ReactNode} children - Le contenu JSX à animer
 * @param {string} animationKey - Une clé pour forcer la réanimation lors du changement de contenu
 */
export default function AnimatedText({ children, animationKey }) {
  const [visibleLetters, setVisibleLetters] = useState(new Set());
  const containerRef = useRef(null);
  const letterKeysRef = useMemo(() => new Map(), []);

  // Fonction récursive pour traiter les enfants et remplacer le texte par des lettres individuelles
  const processChildren = (children, parentKey = "root") => {
    return Children.map(children, (child, index) => {
      const key = `${parentKey}-${index}`;

      // Si c'est un nœud texte, le diviser en lettres
      if (typeof child === "string" || typeof child === "number") {
        const text = String(child);
        return text.split("").map((char, charIndex) => {
          const letterKey = `${key}-char-${charIndex}`;
          letterKeysRef.set(letterKey, true);
          // Pour les espaces, utiliser un non-breaking space et un style spécial
          const isSpace = char === " ";
          return (
            <span 
              key={letterKey} 
              className={`${styles.letter} ${isSpace ? styles.space : ""}`} 
              data-letter-key={letterKey}
            >
              {isSpace ? "\u00A0" : char}
            </span>
          );
        });
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
    letterKeysRef.clear();
    return processChildren(children);
  }, [children, animationKey]);

  // Réinitialiser l'animation quand le contenu change
  useEffect(() => {
    setVisibleLetters(new Set());

    const letterKeys = Array.from(letterKeysRef.keys());
    
    if (letterKeys.length === 0) return;

    // Mélanger aléatoirement l'ordre d'apparition
    const shuffledKeys = [...letterKeys].sort(() => Math.random() - 0.5);

    // Créer les timeouts pour révéler chaque lettre
    const timeouts = shuffledKeys.map((letterKey) => {
      // Délai aléatoire entre 0 et 1000ms
      const delay = Math.random() * 500;
      
      return setTimeout(() => {
        setVisibleLetters((prev) => {
          const next = new Set(prev);
          next.add(letterKey);
          return next;
        });
      }, delay);
    });

    // Nettoyer les timeouts au démontage ou changement de contenu
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [processedContent, animationKey]);

  // Appliquer les classes visibles aux lettres
  useEffect(() => {
    if (!containerRef.current) return;
    
    const letters = containerRef.current.querySelectorAll(`[data-letter-key]`);
    letters.forEach((letter) => {
      const key = letter.getAttribute("data-letter-key");
      if (visibleLetters.has(key)) {
        letter.classList.add(styles.visible);
      } else {
        letter.classList.remove(styles.visible);
      }
    });
  }, [visibleLetters]);

  return <div ref={containerRef} className={styles.container}>{processedContent}</div>;
}
