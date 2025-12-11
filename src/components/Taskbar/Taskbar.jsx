// Taskbar.jsx
import styles from "./Taskbar.module.css";

export default function Taskbar() {
  // Pour l’instant : valeurs statiques
  const time = "14:35";
  const date = "Mar 10 Déc";
  const batteryLevel = 78; // en pourcentage
  const wifiStrength = 3;  // sur 3

  return (
    <div className={styles.taskbar}>
      {/* Zone gauche : logo / nom OS */}
      <div className={styles.leftArea}>
        <div className={styles.osBadge}>OS-Portfolio</div>
      </div>

      {/* Zone centrale (vide pour l’instant) */}
      <div className={styles.centerArea}>{/* plus tard : notifs, musique... */}</div>

      {/* Zone droite : infos système */}
      <div className={styles.rightArea}>
        <div className={styles.systemItem}>{date}</div>
        <div className={styles.systemItem}>{time}</div>

        <div className={styles.systemItem}>
          <div className={styles.battery}>
            <div className={styles.batteryBody}>
              <div
                className={styles.batteryLevel}
                style={{ width: `${batteryLevel}%` }}
              />
            </div>
            <div className={styles.batteryTip} />
          </div>
        </div>

        <div className={styles.systemItem}>
          <div className={styles.wifiBars}>
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </div>
        </div>
      </div>
    </div>
  );
}
