import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <div className={styles.contact}>
      <h2>Contact</h2>
      <p>Contenu placeholder pour la section Contact.</p>
      <p>Cette section contiendra vos informations de contact et un formulaire pour vous joindre.</p>
      <div className={styles.placeholder}>
        <p>📧 Email: votre.email@example.com</p>
        <p>💼 LinkedIn: linkedin.com/in/votre-profil</p>
        <p>🐙 GitHub: github.com/votre-username</p>
      </div>
    </div>
  );
}

