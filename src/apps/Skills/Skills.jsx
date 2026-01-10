import styles from "./Skills.module.css";

export default function Skills() {
  return (
    <div className={styles.skills}>
      <h2>Compétences</h2>
      <p>Contenu placeholder pour la section Skills.</p>
      <p>Cette section présentera vos compétences techniques et professionnelles.</p>
      <div className={styles.skillsGrid}>
        <div className={styles.skillCategory}>
          <h3>Frontend</h3>
          <ul>
            <li>React</li>
            <li>JavaScript</li>
            <li>CSS</li>
          </ul>
        </div>
        <div className={styles.skillCategory}>
          <h3>Backend</h3>
          <ul>
            <li>Node.js</li>
            <li>Python</li>
            <li>Base de données</li>
          </ul>
        </div>
        <div className={styles.skillCategory}>
          <h3>Outils</h3>
          <ul>
            <li>Git</li>
            <li>Docker</li>
            <li>CI/CD</li>
          </ul>
        </div>
      </div>
    </div>
  );
}



