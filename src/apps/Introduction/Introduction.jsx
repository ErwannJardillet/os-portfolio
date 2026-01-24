import styles from "./Introduction.module.css";
import { useState } from "react";
import AnimatedText from "../../components/AnimatedText/AnimatedText";

const sections = [
  {
    id: "titre",
    title: "",
    content: (
      <>
        <h1>
          Ewann Jardillet
        </h1>
        <div className={styles.middleContent}>
          <div className={styles.middleContentItem}> </div>
            <p>
              OS
            </p>
          <div className={styles.middleContentItem}> </div>
        </div>
        <h1>Portfolio</h1>
      </>
    ),
  },
  {
    id: "bureau",
    title: "App",
    content: (
      <>
        <p>
          Ce portfolio est conçu comme un système d'exploitation (OS-like), 
          offrant une expérience immersive et interactive pour découvrir mon travail.
        </p>
        <p>
          Sur le bureau, vous trouverez des apps représentant les 
          rubriques de mon portfolio. Vous pouvez les ouvrir en double-cliquant dessus.
        </p>
        <p>
          Explorez librement les différentes sections pour en apprendre plus 
          sur mes compétences, mes projets et mes expériences.
        </p>
      </>
    ),
  },
  {
    id: "fenetre",
    title: "Fenêtre",
    content: (
      <>
        <p>
          Les fenêtres qui s'ouvrent sont entièrement interactives : vous pouvez 
          les déplacer (et meme les lancer •_• ) en les faisant glisser, et 
          les fermer en cliquant sur le bouton de fermeture (×) situé en haut 
          à droite de chaque fenêtre.
        </p>
      </>
    ),
  },
];

export default function Introduction() {
  const [currentSection, setCurrentSection] = useState(0);

  const goToPrevious = () => {
    setCurrentSection((prev) => (prev > 0 ? prev - 1 : sections.length - 1));
  };

  const goToNext = () => {
    setCurrentSection((prev) => (prev < sections.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className={styles.introduction}>
      <section
        className={styles.section}
        data-section-id={sections[currentSection].id}
      >
        <h3>{sections[currentSection].title}</h3>
        <AnimatedText animationKey={currentSection}>
          {sections[currentSection].content}
        </AnimatedText>
      </section>

      <div className={styles.navigation}>
        <button
          className={styles.navButton}
          onClick={goToPrevious}
          aria-label="Section précédente"
        >
          &lt;
        </button>
        <div className={styles.dots}>
          {sections.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${index === currentSection ? styles.active : ""
                }`}
            />
          ))}
        </div>
        <button
          className={styles.navButton}
          onClick={goToNext}
          aria-label="Section suivante"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
