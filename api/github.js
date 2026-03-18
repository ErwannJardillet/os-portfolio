/**
 * Proxy serverless Vercel → GitHub API
 *
 * Le token GitHub est lu côté serveur depuis GITHUB_TOKEN (variable Vercel, jamais exposée au client).
 * Le client appelle GET /api/github et reçoit les repos formatés.
 *
 * Variables d'environnement à configurer dans le dashboard Vercel :
 *   GITHUB_USERNAME  — votre login GitHub
 *   GITHUB_TOKEN     — token GitHub (scope: read:user, public_repo)
 */

const REST_API = "https://api.github.com";
const GRAPHQL_API = "https://api.github.com/graphql";
const REPO_TO_EXCLUDE = "os-portfolio";

const LANGUAGE_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#2b7489",
  Python: "#3572A5",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#2c3e50",
  Go: "#00ADD8",
  Rust: "#dea584",
  C: "#555555",
  "C++": "#f34b7d",
};

export default async function handler(req, res) {
  const username = process.env.GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;

  if (!username) {
    return res.status(500).json({ error: "GITHUB_USERNAME non configuré sur le serveur." });
  }

  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");

  const headers = {
    Accept: "application/vnd.github.v3+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    // GraphQL (repos épinglés) — seulement si token disponible
    if (token) {
      const query = `
        query {
          user(login: "${username}") {
            pinnedItems(first: 6, types: REPOSITORY) {
              nodes {
                ... on Repository {
                  name description url stargazerCount forkCount updatedAt
                  languages(first: 5) { nodes { name color } }
                  repositoryTopics(first: 5) { nodes { topic { name } } }
                }
              }
            }
          }
        }
      `;

      const gqlRes = await fetch(GRAPHQL_API, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const gqlData = await gqlRes.json();

      if (!gqlData.errors && gqlData.data?.user) {
        const repos = (gqlData.data.user.pinnedItems.nodes || [])
          .filter((r) => r.name !== REPO_TO_EXCLUDE)
          .map((r) => ({
            name: r.name,
            description: r.description || "Aucune description disponible",
            url: r.url,
            stars: r.stargazerCount || 0,
            forks: r.forkCount || 0,
            updatedAt: r.updatedAt,
            languages: (r.languages?.nodes || []).map((l) => ({ name: l.name, color: l.color })),
            topics: (r.repositoryTopics?.nodes || []).map((n) => n.topic.name),
          }));

        if (repos.length > 0) return res.status(200).json(repos);
      }
    }

    // Fallback REST (pas de token ou GraphQL vide)
    const reposRes = await fetch(
      `${REST_API}/users/${username}/repos?sort=stars&per_page=7&type=public`,
      { headers }
    );

    if (!reposRes.ok) {
      return res.status(reposRes.status).json({ error: `GitHub API: ${reposRes.status}` });
    }

    const reposData = await reposRes.json();
    const filtered = reposData.filter((r) => r.name !== REPO_TO_EXCLUDE).slice(0, 6);

    const repos = await Promise.all(
      filtered.map(async (repo) => {
        const langRes = await fetch(repo.languages_url, { headers });
        const langData = langRes.ok ? await langRes.json() : {};

        return {
          name: repo.name,
          description: repo.description || "Aucune description disponible",
          url: repo.html_url,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          updatedAt: repo.updated_at,
          languages: Object.keys(langData)
            .slice(0, 5)
            .map((lang) => ({ name: lang, color: LANGUAGE_COLORS[lang] || "#586e75" })),
          topics: [],
        };
      })
    );

    return res.status(200).json(repos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
