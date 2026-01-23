import { useState } from "react";
import styles from "./Projects.module.css";
import AnimatedText from "../../components/AnimatedText/AnimatedText";

const sections = [
  {
    id: "project1",
    title: "Refonte et sécurisation d'une application web",
    content: (
      <div className={styles.projectCard}>
        <div className={styles.projectMeta}>
          <strong>2024</strong> — <em>IUT de Valence</em>
          <span className={styles.projectType}>Projet académique</span>
        </div>
        <ul>
          <li>Audit complet de l'application existante et identification des axes d'amélioration</li>
          <li>Conception et implémentation d'une nouvelle interface utilisateur</li>
          <li>Développement backend en PHP avec le framework Symfony</li>
          <li>Correction et prévention des vulnérabilités de sécurité</li>
          <li>Rédaction d'une documentation technique complète pour les développeurs</li>
        </ul>
      </div>
    ),
  },
  {
    id: "project2",
    title: "Gestion de la réception des dons",
    content: (
      <div className={styles.projectCard}>
        <div className={styles.projectMeta}>
          <strong>2023</strong> — <em>Institut Mines-Télécom Paris</em>
        </div>
        <ul>
          <li>Administration et traitement des données de donateurs</li>
          <li>Automatisation de la génération des reçus fiscaux</li>
          <li>Consolidation de données provenant de sources multiples</li>
          <li>Optimisation des processus de saisie et de traitement</li>
          <li>Assurance de la conformité et de la précision des documents générés</li>
        </ul>
      </div>
    ),
  },
  {
    id: "project3",
    title: "Développement web et support client",
    content: (
      <div className={styles.projectCard}>
        <div className={styles.projectMeta}>
          <strong>2022</strong> — <em>KE-Booking, Grenoble</em>
        </div>
        <ul>
          <li>Implémentation de nouvelles fonctionnalités sur la plateforme web</li>
          <li>Interface client : analyse des besoins et recueil des retours utilisateurs</li>
          <li>Résolution proactive des problèmes techniques rencontrés par les clients</li>
          <li>Collaboration étroite avec l'équipe de développement</li>
          <li>Amélioration continue de l'expérience utilisateur</li>
        </ul>
      </div>
    ),
  },
];

export default function Projects() {
  const [currentSection, setCurrentSection] = useState(0);

  const goToPrevious = () => {
    setCurrentSection((prev) => (prev > 0 ? prev - 1 : sections.length - 1));
  };

  const goToNext = () => {
    setCurrentSection((prev) => (prev < sections.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className={styles.projects}>
      <section className={styles.section}>
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



