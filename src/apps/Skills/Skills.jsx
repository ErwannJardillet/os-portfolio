import { useState } from "react";
import styles from "./Skills.module.css";

const sections = [
  {
    id: "langages",
    title: "Langages et frameworks",
    content: (
      <div className={styles.skillsGrid}>
        <div className={styles.skillCategory}>
          <h3>Langages de programmation</h3>
          <ul>
            <li>HTML5</li>
            <li>CSS3</li>
            <li>JavaScript (ES6+)</li>
            <li>PHP</li>
            <li>Python</li>
            <li>Java</li>
            <li>C</li>
            <li>SQL</li>
          </ul>
        </div>
        <div className={styles.skillCategory}>
          <h3>Frameworks & bibliothèques</h3>
          <ul>
            <li>Symfony</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "environnements",
    title: "Environnements et outils",
    content: (
      <div className={styles.skillsGrid}>
        <div className={styles.skillCategory}>
          <h3>Environnements système</h3>
          <ul>
            <li>Windows 10</li>
            <li>Linux</li>
          </ul>
        </div>
        <div className={styles.skillCategory}>
          <h3>Outils de développement</h3>
          <ul>
            <li>Visual Studio Code</li>
            <li>IntelliJ IDEA</li>
            <li>Git & GitHub</li>
            <li>Docker</li>
            <li>MySQL</li>
            <li>Figma</li>
            <li>Microsoft Office</li>
            <li>LibreOffice</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "methodes",
    title: "Ingénierie et méthodologies",
    content: (
      <div className={styles.skillsGrid}>
        <div className={styles.skillCategory}>
          <h3>Ingénierie logicielle</h3>
          <ul>
            <li>Développement d'applications</li>
            <li>Conception de sites web</li>
            <li>Design d'interfaces utilisateur</li>
            <li>Analyse et collecte d'exigences</li>
            <li>Rédaction de spécifications techniques</li>
            <li>Documentation technique</li>
          </ul>
        </div>
        <div className={styles.skillCategory}>
          <h3>Méthodologies</h3>
          <ul>
            <li>Méthode Agile (Scrum)</li>
            <li>Cycle en V</li>
            <li>Gestion de sprints</li>
            <li>Rétrospectives d'équipe</li>
            <li>Comptabilité générale</li>
          </ul>
        </div>
      </div>
    ),
  },
];

export default function Skills() {
  const [currentSection, setCurrentSection] = useState(0);

  const goToPrevious = () => {
    setCurrentSection((prev) => (prev > 0 ? prev - 1 : sections.length - 1));
  };

  const goToNext = () => {
    setCurrentSection((prev) => (prev < sections.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className={styles.skills}>
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



