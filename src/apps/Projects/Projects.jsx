import styles from "./Projects.module.css";

export default function Projects() {
  return (
    <div className={styles.projects}>
      <h2>Projets</h2>
      <p>Contenu placeholder pour la section Projects.</p>
      <p>Cette section présentera vos projets et réalisations.</p>
      <div className={styles.projectList}>
        <div className={styles.projectCard}>
          <h3>Projet 1</h3>
          <p>Description du projet placeholder...</p>
        </div>
        <div className={styles.projectCard}>
          <h3>Projet 2</h3>
          <p>Description du projet placeholder...</p>
        </div>
      </div>
    </div>
  );
}



