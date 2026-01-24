import { useState, useEffect } from "react";

const GITHUB_API_URL = "https://api.github.com/graphql";
const REPO_TO_EXCLUDE = "os-portfolio";

/**
 * Hook personnalisé pour récupérer les repos GitHub épinglés
 * @returns {Object} { repos, loading, error }
 */
export function useGitHubRepos() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer le nom d'utilisateur depuis les variables d'environnement
        const username = import.meta.env.VITE_GITHUB_USERNAME;
        const token = import.meta.env.VITE_GITHUB_TOKEN;

        if (!username) {
          throw new Error(
            "VITE_GITHUB_USERNAME n'est pas défini dans les variables d'environnement"
          );
        }

        // Requête GraphQL pour récupérer les repos épinglés
        const query = `
          query {
            user(login: "${username}") {
              pinnedItems(first: 6, types: REPOSITORY) {
                nodes {
                  ... on Repository {
                    name
                    description
                    url
                    stargazerCount
                    forkCount
                    updatedAt
                    languages(first: 5) {
                      nodes {
                        name
                        color
                      }
                    }
                    repositoryTopics(first: 5) {
                      nodes {
                        topic {
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `;

        const headers = {
          "Content-Type": "application/json",
        };

        // Ajouter le token si disponible (optionnel mais recommandé pour augmenter les limites)
        // Ignorer les tokens qui sont des placeholders ou invalides
        if (token && token !== "votre_token_github" && token.trim() !== "") {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(GITHUB_API_URL, {
          method: "POST",
          headers,
          body: JSON.stringify({ query }),
        });

        let data;
        try {
          data = await response.json();
        } catch (parseError) {
          // Si la réponse n'est pas du JSON valide
          const errorText = await response.text().catch(() => "");
          if (errorText.includes("rate limit") || response.status === 403) {
            throw new Error(
              "Limite de requêtes GitHub dépassée. Veuillez créer un token GitHub et l'ajouter dans .env comme VITE_GITHUB_TOKEN pour augmenter la limite."
            );
          }
          throw new Error(
            `Erreur HTTP: ${response.status} ${response.statusText}`
          );
        }

        // Vérifier les erreurs GraphQL d'abord
        if (data.errors) {
          const errorMessages = data.errors.map((e) => e.message);
          // Détecter spécifiquement les erreurs de rate limit
          if (errorMessages.some((msg) => msg.toLowerCase().includes("rate limit"))) {
            throw new Error(
              "Limite de requêtes GitHub dépassée. Veuillez créer un token GitHub et l'ajouter dans .env comme VITE_GITHUB_TOKEN pour augmenter la limite."
            );
          }
          throw new Error(
            errorMessages.join(", ") ||
              "Erreur lors de la récupération des repos"
          );
        }

        if (!response.ok) {
          // Vérifier si c'est une erreur de rate limit côté HTTP
          if (response.status === 403) {
            throw new Error(
              "Limite de requêtes GitHub dépassée. Veuillez créer un token GitHub et l'ajouter dans .env comme VITE_GITHUB_TOKEN pour augmenter la limite."
            );
          }
          throw new Error(
            data.message ||
              `Erreur HTTP: ${response.status} ${response.statusText}`
          );
        }

        // Extraire les repos et filtrer celui à exclure
        const pinnedRepos =
          data.data?.user?.pinnedItems?.nodes?.filter(
            (repo) => repo.name !== REPO_TO_EXCLUDE
          ) || [];

        // Transformer les données pour un format plus pratique
        const formattedRepos = pinnedRepos.map((repo) => ({
          name: repo.name,
          description: repo.description || "Aucune description disponible",
          url: repo.url,
          stars: repo.stargazerCount,
          forks: repo.forkCount,
          updatedAt: repo.updatedAt,
          languages: repo.languages.nodes.map((lang) => ({
            name: lang.name,
            color: lang.color,
          })),
          topics: repo.repositoryTopics.nodes.map((node) => node.topic.name),
        }));

        setRepos(formattedRepos);
      } catch (err) {
        console.error("Erreur lors de la récupération des repos GitHub:", err);
        setError(err.message || "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  return { repos, loading, error };
}
