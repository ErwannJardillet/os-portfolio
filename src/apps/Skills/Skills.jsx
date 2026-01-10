import styles from "./Skills.module.css";

export default function Skills() {
  return (
    <div className={styles.skills}>
      <h2>Expertise technique</h2>
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
        <div className={styles.skillCategory}>
          <h3>Frameworks & bibliothèques</h3>
          <ul>
            <li>Symfony</li>
          </ul>
        </div>
      </div>
    </div>
  );
}



