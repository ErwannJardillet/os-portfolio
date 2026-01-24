import { useState } from "react";
import styles from "./About.module.css";
import AnimatedText from "../../components/AnimatedText/AnimatedText";

const sections = [
  {
    id: "presentation",
    title: "Présentation",
    content: (
      <>
        <p>
          Je suis étudiant en licence pro MI AW, et passionné par
          le développement et le design web. J’aime concevoir des interfaces,
          comprendre comment les choses fonctionnent et transformer des idées en
          projets concrets.
        </p>
        <p>
          En parallèle de mes études, je me forme en autodidacte à travers
          plusieurs projets personnels. Ces projets me permettent
          d’expérimenter, de tester de nouvelles choses et de progresser pas à
          pas. Je fais encore des erreurs, je n’ai pas toujours les meilleures
          pratiques ni des connaissances parfaites, mais chaque difficulté est
          pour moi une occasion d’apprendre.
        </p>
        <p>
          Motivé et curieux, je cherche constamment à m’améliorer et à donner le
          meilleur de moi-même dans chaque projet. Mon objectif est de continuer
          à évoluer, aussi bien techniquement que créativement, et de construire
          des expériences web à la fois utiles et bien pensées.
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
          <strong>2025 — 2026</strong>
          <br />
          Licence Professionnelle MI AW — Développement Web
          <br />
          <em>Université de Limoges</em>
        </li>
        <li>
          <strong>2024 — 2025</strong>
          <br />
          BUT 2 Informatique
          <br />
          <em>IUT de Valence</em>
        </li>
        <li>
          <strong>2023 — 2024</strong>
          <br />
          BUT 1 Informatique
          <br />
          <em>IUT de Valence</em>
        </li>
        <li>
          <strong>2023</strong>
          <br />
          Baccalauréat mention bien
          <br />
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
          <strong>Anglais</strong> — Niveau avancé (B2)
          <br />
          <em>Communication professionnelle et technique</em>
        </li>
        <li>
          <strong>Espagnol</strong> — Niveau intermédiaire (A2 — B1)
          <br />
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
      <h3 className={styles.title}>{sections[currentSection].title}</h3>
      <section className={styles.section}>
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
              className={`${styles.dot} ${
                index === currentSection ? styles.active : ""
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
