import { useState, useEffect } from "react";

const GITHUB_REST_API_URL = "https://api.github.com";
const GITHUB_GRAPHQL_API_URL = "https://api.github.com/graphql";
const REPO_TO_EXCLUDE = "os-portfolio";

/**
 * Hook personnalisé pour récupérer les repos GitHub
 * Utilise GraphQL avec token si disponible, sinon utilise l'API REST sans token
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

        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/20425fee-131b-46b5-a3ae-b90e1e9591f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useGitHubRepos.js:18',message:'fetchRepos started',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion

        // Récupérer le nom d'utilisateur depuis les variables d'environnement
        const username = import.meta.env.VITE_GITHUB_USERNAME;
        const token = import.meta.env.VITE_GITHUB_TOKEN;

        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/20425fee-131b-46b5-a3ae-b90e1e9591f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useGitHubRepos.js:25',message:'env vars check',data:{hasUsername:!!username,usernameLength:username?.length||0,hasToken:!!token,tokenLength:token?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion

        if (!username) {
          throw new Error(
            "VITE_GITHUB_USERNAME n'est pas défini dans les variables d'environnement"
          );
        }

        // Vérifier si on a un token valide pour utiliser GraphQL
        const hasValidToken = token && token !== "votre_token_github" && token.trim() !== "";

        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/20425fee-131b-46b5-a3ae-b90e1e9591f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useGitHubRepos.js:34',message:'token validation',data:{hasValidToken},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion

        let formattedRepos = [];

        if (hasValidToken) {
          // Essayer GraphQL avec token pour obtenir les repos épinglés
          try {
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
              Authorization: `Bearer ${token}`,
            };

            const response = await fetch(GITHUB_GRAPHQL_API_URL, {
              method: "POST",
              headers,
              body: JSON.stringify({ query }),
            });

            const data = await response.json();

            if (data.errors) {
              throw new Error(data.errors.map((e) => e.message).join(", "));
            }

            if (!response.ok) {
              throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
            }

            const pinnedRepos =
              data.data?.user?.pinnedItems?.nodes?.filter(
                (repo) => repo.name !== REPO_TO_EXCLUDE
              ) || [];

            formattedRepos = pinnedRepos.map((repo) => ({
              name: repo.name,
              description: repo.description || "Aucune description disponible",
              url: repo.url,
              stars: repo.stargazerCount || 0,
              forks: repo.forkCount || 0,
              updatedAt: repo.updatedAt,
              languages: (repo.languages?.nodes || []).map((lang) => ({
                name: lang.name,
                color: lang.color,
              })),
              topics: (repo.repositoryTopics?.nodes || []).map((node) => node.topic.name),
            }));
          } catch (graphqlError) {
            console.warn("Erreur GraphQL, passage à l'API REST:", graphqlError);
            // Si GraphQL échoue, on laisse formattedRepos vide pour utiliser REST
            formattedRepos = [];
          }
        }

        // Si pas de token ou GraphQL a échoué ou retourné vide, utiliser l'API REST sans token
        if (!hasValidToken || formattedRepos.length === 0) {
          try {
            const headers = {
              Accept: "application/vnd.github.v3+json",
            };

            // Récupérer les repos publics (triés par popularité)
            // #region agent log
            fetch('http://127.0.0.1:7244/ingest/20425fee-131b-46b5-a3ae-b90e1e9591f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useGitHubRepos.js:127',message:'REST API fetch start',data:{url:`${GITHUB_REST_API_URL}/users/${username}/repos?sort=stars&per_page=6&type=public`},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            // #endregion

            const reposResponse = await fetch(
              `${GITHUB_REST_API_URL}/users/${username}/repos?sort=stars&per_page=6&type=public`,
              { headers }
            );

            // #region agent log
            fetch('http://127.0.0.1:7244/ingest/20425fee-131b-46b5-a3ae-b90e1e9591f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useGitHubRepos.js:132',message:'REST API response',data:{ok:reposResponse.ok,status:reposResponse.status,statusText:reposResponse.statusText},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            // #endregion

            if (!reposResponse.ok) {
              const errorText = await reposResponse.text().catch(() => "");
              if (reposResponse.status === 403) {
                throw new Error(
                  "Limite de requêtes GitHub dépassée. Attendez un peu ou ajoutez un token GitHub dans .env comme VITE_GITHUB_TOKEN."
                );
              }
              throw new Error(
                `Erreur HTTP: ${reposResponse.status} ${reposResponse.statusText}. ${errorText}`
              );
            }

            const reposData = await reposResponse.json();
            
            // #region agent log
            fetch('http://127.0.0.1:7244/ingest/20425fee-131b-46b5-a3ae-b90e1e9591f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useGitHubRepos.js:144',message:'REST API data received',data:{isArray:Array.isArray(reposData),reposCount:Array.isArray(reposData)?reposData.length:0,firstRepoName:Array.isArray(reposData)&&reposData[0]?reposData[0].name:null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
            // #endregion
            
            if (!Array.isArray(reposData)) {
              throw new Error("La réponse de l'API GitHub n'est pas un tableau valide");
            }

          // Filtrer le repo à exclure et récupérer les détails pour chaque repo
          const filteredRepos = reposData
            .filter((repo) => repo.name !== REPO_TO_EXCLUDE)
            .slice(0, 6);

          // #region agent log
          fetch('http://127.0.0.1:7244/ingest/20425fee-131b-46b5-a3ae-b90e1e9591f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useGitHubRepos.js:152',message:'filtered repos',data:{filteredCount:filteredRepos.length,repoNames:filteredRepos.map(r=>r.name)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
          // #endregion

          // Récupérer les langages et topics pour chaque repo
          formattedRepos = await Promise.all(
            filteredRepos.map(async (repo) => {
              // Récupérer les langages
              const languagesResponse = await fetch(repo.languages_url, { headers });
              const languagesData = languagesResponse.ok ? await languagesResponse.json() : {};
              
              // Récupérer les topics (nécessite un token, sinon on utilise les topics de base)
              let topics = [];
              if (hasValidToken) {
                try {
                  const topicsResponse = await fetch(
                    `${GITHUB_REST_API_URL}/repos/${username}/${repo.name}/topics`,
                    {
                      headers: {
                        ...headers,
                        Accept: "application/vnd.github.mercy-preview+json",
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  if (topicsResponse.ok) {
                    const topicsData = await topicsResponse.json();
                    topics = topicsData.names || [];
                  }
                } catch (e) {
                  // Ignorer les erreurs de topics
                }
              }

              // Créer une palette de couleurs pour les langages (approximation)
              const languageColors = {
                JavaScript: "#f1e05a",
                TypeScript: "#2b7489",
                Python: "#3572A5",
                Java: "#b07219",
                HTML: "#e34c26",
                CSS: "#563d7c",
                Vue: "#2c3e50",
                React: "#61dafb",
                Go: "#00ADD8",
                Rust: "#dea584",
                C: "#555555",
                "C++": "#f34b7d",
              };

              const languages = Object.keys(languagesData)
                .slice(0, 5)
                .map((lang) => ({
                  name: lang,
                  color: languageColors[lang] || "#586e75",
                }));

              return {
                name: repo.name,
                description: repo.description || "Aucune description disponible",
                url: repo.html_url,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                updatedAt: repo.updated_at,
                languages,
                topics,
              };
            })
          );
          } catch (restError) {
            console.error("Erreur lors de la récupération via API REST:", restError);
            // Si REST échoue aussi et qu'on n'a pas déjà de repos depuis GraphQL, propager l'erreur
            if (formattedRepos.length === 0) {
              throw restError;
            }
            // Sinon, on garde les repos GraphQL même si REST a échoué
          }
        }

        // S'assurer que tous les repos ont le bon format
        const validatedRepos = formattedRepos.map((repo) => ({
          name: repo.name || "Sans nom",
          description: repo.description || "Aucune description disponible",
          url: repo.url || "#",
          stars: typeof repo.stars === "number" ? repo.stars : 0,
          forks: typeof repo.forks === "number" ? repo.forks : 0,
          updatedAt: repo.updatedAt || new Date().toISOString(),
          languages: Array.isArray(repo.languages) ? repo.languages : [],
          topics: Array.isArray(repo.topics) ? repo.topics : [],
        }));

        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/20425fee-131b-46b5-a3ae-b90e1e9591f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useGitHubRepos.js:242',message:'before setRepos',data:{validatedReposCount:validatedRepos.length,firstRepo:validatedRepos[0]?{name:validatedRepos[0].name,hasUrl:!!validatedRepos[0].url,hasDescription:!!validatedRepos[0].description,languagesCount:validatedRepos[0]?.languages?.length||0}:null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion

        setRepos(validatedRepos);
      } catch (err) {
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/20425fee-131b-46b5-a3ae-b90e1e9591f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useGitHubRepos.js:243',message:'error caught',data:{errorMessage:err.message,errorName:err.name,errorStack:err.stack?.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        console.error("Erreur lors de la récupération des repos GitHub:", err);
        setError(err.message || "Une erreur est survenue");
      } finally {
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/20425fee-131b-46b5-a3ae-b90e1e9591f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useGitHubRepos.js:247',message:'finally block',data:{loading:false},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  return { repos, loading, error };
}
