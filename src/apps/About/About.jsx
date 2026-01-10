import styles from "./About.module.css";

export default function About() {
  return (
    <div className={styles.about}>
      <h2>Profil</h2>
      <section>
        <h3>Présentation</h3>
        <p>
          Étudiant en Licence Professionnelle Métiers de l'Informatique — Applications Web 
          à l'Université de Limoges, je me spécialise dans le développement web et les 
          technologies numériques. Ma passion pour l'informatique se traduit par une approche 
          rigoureuse et une volonté constante d'approfondir mes connaissances techniques.
        </p>
        <p>
          Mon parcours académique, allant du Baccalauréat mention bien jusqu'à la Licence Pro, 
          m'a permis d'acquérir une solide base théorique et pratique dans le domaine du 
          développement logiciel et web.
        </p>
      </section>
      
      <section>
        <h3>Parcours académique</h3>
        <ul>
          <li>
            <strong>2025 — 2026</strong><br />
            Licence Professionnelle MI AW — Développement Web<br />
            <em>Université de Limoges</em>
          </li>
          <li>
            <strong>2024 — 2025</strong><br />
            BUT 2 Informatique<br />
            <em>IUT de Valence</em>
          </li>
          <li>
            <strong>2023 — 2024</strong><br />
            BUT 1 Informatique<br />
            <em>IUT de Valence</em>
          </li>
          <li>
            <strong>2023</strong><br />
            Baccalauréat mention bien<br />
            <em>Lycée Marie-Rivier, Bourg-Saint-Andéol (07)</em>
          </li>
        </ul>
      </section>

      <section>
        <h3>Maîtrise linguistique</h3>
        <ul>
          <li>
            <strong>Anglais</strong> — Niveau avancé (B2)<br />
            <em>Communication professionnelle et technique</em>
          </li>
          <li>
            <strong>Espagnol</strong> — Niveau intermédiaire (A2 — B1)<br />
            <em>Communication courante</em>
          </li>
        </ul>
      </section>
    </div>
  );
}



