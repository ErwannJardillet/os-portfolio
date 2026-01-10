import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <div className={styles.contact}>
      <h2>Coordonnées</h2>
      <p>
        Je suis disponible pour discuter de projets, opportunités professionnelles 
        ou collaborations. N'hésitez pas à me contacter via les moyens ci-dessous.
      </p>
      <div className={styles.contactInfo}>
        <div className={styles.contactItem}>
          <strong>Courrier électronique</strong>
          <a href="mailto:jardillete@gmail.com">jardillete@gmail.com</a>
        </div>
        <div className={styles.contactItem}>
          <strong>Téléphone</strong>
          <a href="tel:0660170608">+33 6 60 17 06 08</a>
        </div>
        <div className={styles.contactItem}>
          <strong>Adresse postale</strong>
          <p>
            100, rue Des Moulins<br />
            26000 Valence<br />
            France
          </p>
        </div>
      </div>
    </div>
  );
}



