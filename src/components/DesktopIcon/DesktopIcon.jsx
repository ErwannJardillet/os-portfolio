import styles from "./DesktopIcon.module.css";

export default function DesktopIcon({ label, onOpen }) {
  return (
    <div
      className={styles.icon}
      onDoubleClick={onOpen}
    >
      <div className={styles.iconImage}>
        {/* Placeholder icône */}
        <span className={styles.iconLetter}>
          {label[0]}
        </span>
      </div>

      <span className={styles.iconLabel}>{label}</span>
    </div>
  );
}
