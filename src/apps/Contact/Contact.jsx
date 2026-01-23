import { useState } from "react";
import styles from "./Contact.module.css";
import AnimatedText from "../../components/AnimatedText/AnimatedText";

const sections = [
  {
    id: "introduction",
    title: "Coordonnées",
    content: (
      <>
        <p>
          Je suis disponible pour discuter de projets, opportunités professionnelles 
          ou collaborations. N'hésitez pas à me contacter via les moyens ci-dessous.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Moyens de contact",
    content: (
      <div className={styles.contactInfo}>
        <div className={styles.contactItem}>
          <strong>Courrier électronique</strong>
          <a href="mailto:jardillete@gmail.com">jardillete@gmail.com</a>
        </div>
        <div className={styles.contactItem}>
          <strong>Téléphone</strong>
          <a href="tel:0660170608">+33 6 60 17 06 08</a>
        </div>
      </div>
    ),
  },
  {
    id: "adresse",
    title: "Adresse postale",
    content: (
      <div className={styles.contactInfo}>
        <div className={styles.contactItem}>
          <p>
            100, rue Des Moulins<br />
            26000 Valence<br />
            France
          </p>
        </div>
      </div>
    ),
  },
];

export default function Contact() {
  const [currentSection, setCurrentSection] = useState(0);

  const goToPrevious = () => {
    setCurrentSection((prev) => (prev > 0 ? prev - 1 : sections.length - 1));
  };

  const goToNext = () => {
    setCurrentSection((prev) => (prev < sections.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className={styles.contact}>
      <section className={styles.section}>
        <h3>{sections[currentSection].title}</h3>
        <AnimatedText animationKey={currentSection}>
          {sections[currentSection].content}
        </AnimatedText>
      </section>
      
      <div className={styles.navigation}>
        <button 
          className={styles.navButton}
          onClick={goToPrevious}
          aria-label="Section précédente"
        >
          &lt;
        </button>
        <div className={styles.dots}>
          {sections.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${index === currentSection ? styles.active : ""}`}
            />
          ))}
        </div>
        <button 
          className={styles.navButton}
          onClick={goToNext}
          aria-label="Section suivante"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}



