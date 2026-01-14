import { useState } from "react";
import styles from "./About.module.css";

const sections = [
  {
    id: "presentation",
    title: "Présentation",
    content: (
      <>
        <p>
          Étudiant en Licence Professionnelle Métiers de l'Informatique — Applications Web 
          à l'Université de Limoges, je me spécialise dans le développement web et les 
          technologies numériques. Ma passion pour l'informatique se traduit par une approche 
          rigoureuse et une volonté constante d'approfondir mes connaissances techniques.
        </p>
        <p>
          Mon parcours académique, allant du Baccalauréat mention bien jusqu'à la Licence Pro, 
          m'a permis d'acquérir une solide base théorique et pratique dans le domaine du 
          développement logiciel et web.
        </p>
      </>
    ),
  },
  {
    id: "parcours",
    title: "Parcours académique",
    content: (
      <ul>
        <li>
          <strong>2025 — 2026</strong><br />
          Licence Professionnelle MI AW — Développement Web<br />
          <em>Université de Limoges</em>
        </li>
        <li>
          <strong>2024 — 2025</strong><br />
          BUT 2 Informatique<br />
          <em>IUT de Valence</em>
        </li>
        <li>
          <strong>2023 — 2024</strong><br />
          BUT 1 Informatique<br />
          <em>IUT de Valence</em>
        </li>
        <li>
          <strong>2023</strong><br />
          Baccalauréat mention bien<br />
          <em>Lycée Marie-Rivier, Bourg-Saint-Andéol (07)</em>
        </li>
      </ul>
    ),
  },
  {
    id: "langues",
    title: "Maîtrise linguistique",
    content: (
      <ul>
        <li>
          <strong>Anglais</strong> — Niveau avancé (B2)<br />
          <em>Communication professionnelle et technique</em>
        </li>
        <li>
          <strong>Espagnol</strong> — Niveau intermédiaire (A2 — B1)<br />
          <em>Communication courante</em>
        </li>
      </ul>
    ),
  },
];

export default function About() {
  const [currentSection, setCurrentSection] = useState(0);

  const goToPrevious = () => {
    setCurrentSection((prev) => (prev > 0 ? prev - 1 : sections.length - 1));
  };

  const goToNext = () => {
    setCurrentSection((prev) => (prev < sections.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className={styles.about}>
      <section className={styles.section}>
        <h3>{sections[currentSection].title}</h3>
        {sections[currentSection].content}
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
              className={`${styles.dot} ${index === currentSection ? styles.active : ""}`}
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



