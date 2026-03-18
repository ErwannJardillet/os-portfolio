import { useState, useEffect } from "react";
import styles from "./Projects.module.css";
import { useGitHubRepos } from "../../hooks/useGitHubRepos";
import AnimatedText from "../../components/AnimatedText/AnimatedText";

export default function Projects() {
  const { repos, loading, error } = useGitHubRepos();
  const [activeTab, setActiveTab] = useState(0);

  const safeActiveTab = repos.length > 0 ? Math.min(activeTab, repos.length - 1) : 0;
  const currentRepo = repos.length > 0 ? repos[safeActiveTab] : null;

  // Réinitialiser l'onglet actif si nécessaire
  useEffect(() => {
    if (repos.length > 0 && activeTab >= repos.length) {
      setActiveTab(0);
    }
  }, [repos.length, activeTab]);

  // Formatage de la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  if (loading) {
    return (
      <div className={styles.projects}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Chargement des projets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    // Déterminer le type d'erreur pour afficher un message approprié
    const isRateLimitError = error.includes("rate limit") || error.includes("Limite de requêtes");
    const isUsernameError = error.includes("VITE_GITHUB_USERNAME");

    return (
      <div className={styles.projects}>
        <div className={styles.error}>
          <h3 className={styles.title}>Erreur</h3>
          <p>{error}</p>
          {isRateLimitError && (
            <div className={styles.errorHint}>
              <p>
                <strong>Solution :</strong> Créez un token GitHub pour augmenter la limite :
              </p>
              <ol className={styles.errorSteps}>
                <li>Allez sur <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">https://github.com/settings/tokens</a></li>
                <li>Cliquez sur "Generate new token (classic)"</li>
                <li>Cochez la permission "public_repo" (read-only)</li>
                <li>Générez le token et copiez-le</li>
                <li>Ajoutez-le dans votre fichier .env : <code>VITE_GITHUB_TOKEN=votre_token</code></li>
                <li>Redémarrez le serveur de développement</li>
              </ol>
            </div>
          )}
          {isUsernameError && (
            <p className={styles.errorHint}>
              Assurez-vous que VITE_GITHUB_USERNAME est défini dans votre fichier .env
              et redémarrez le serveur de développement.
            </p>
          )}
          {!isRateLimitError && !isUsernameError && (
            <p className={styles.errorHint}>
              Vérifiez votre configuration dans le fichier .env et redémarrez le serveur de développement.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div className={styles.projects}>
        <div className={styles.empty}>
          <h3 className={styles.title}>Aucun projet trouvé</h3>
          <p>Aucun repository épinglé trouvé sur votre profil GitHub.</p>
        </div>
      </div>
    );
  }

  if (!currentRepo) {
    return (
      <div className={styles.projects}>
        <div className={styles.empty}>
          <h3 className={styles.title}>Erreur</h3>
          <p>Impossible de charger les informations du repository.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.projects}>
      {/* Barre d'onglets */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          {repos.map((repo, index) => (
            <button
              key={repo.name}
              className={`${styles.tab} ${
                index === activeTab ? styles.tabActive : ""
              }`}
              onClick={() => setActiveTab(index)}
              aria-label={`Onglet ${repo.name}`}
              aria-selected={index === activeTab}
            >
              {repo.name}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu de l'onglet actif */}
      <div className={styles.tabContent}>
        <AnimatedText animationKey={safeActiveTab}>
          <div className={styles.repoCard}>
            <div className={styles.repoHeader}>
              <h3 className={styles.repoTitle}>{currentRepo.name}</h3>
              <a
                href={currentRepo.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.repoLink}
                aria-label={`Voir ${currentRepo.name} sur GitHub`}
              >
                ↗ GitHub
              </a>
            </div>

            <p className={styles.repoDescription}>{currentRepo.description}</p>

            {/* Stats */}
            <div className={styles.repoStats}>
              <div className={styles.stat}>
                <span className={styles.statIcon}>⭐</span>
                <span>{currentRepo.stars}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statIcon}>🍴</span>
                <span>{currentRepo.forks}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statIcon}>🕒</span>
                <span>Mis à jour {formatDate(currentRepo.updatedAt)}</span>
              </div>
            </div>

            {/* Langages */}
            {currentRepo.languages.length > 0 && (
              <div className={styles.repoLanguages}>
                <h4 className={styles.sectionTitle}>Langages</h4>
                <div className={styles.languagesList}>
                  {currentRepo.languages.map((lang) => (
                    <span
                      key={lang.name}
                      className={styles.languageTag}
                      style={{ "--lang-color": lang.color }}
                    >
                      <span
                        className={styles.languageDot}
                        style={{ backgroundColor: lang.color }}
                      ></span>
                      {lang.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Topics */}
            {currentRepo.topics.length > 0 && (
              <div className={styles.repoTopics}>
                <h4 className={styles.sectionTitle}>Topics</h4>
                <div className={styles.topicsList}>
                  {currentRepo.topics.map((topic) => (
                    <span key={topic} className={styles.topicTag}>
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </AnimatedText>
      </div>
    </div>
  );
}
