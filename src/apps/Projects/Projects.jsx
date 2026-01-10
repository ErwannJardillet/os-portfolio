import styles from "./Projects.module.css";

export default function Projects() {
  return (
    <div className={styles.projects}>
      <h2>Réalisations professionnelles</h2>
      <div className={styles.projectList}>
        <div className={styles.projectCard}>
          <h3>Refonte et sécurisation d'une application web</h3>
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
        
        <div className={styles.projectCard}>
          <h3>Gestion de la réception des dons</h3>
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
        
        <div className={styles.projectCard}>
          <h3>Développement web et support client</h3>
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
      </div>
    </div>
  );
}



