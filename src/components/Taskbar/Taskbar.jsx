// Taskbar.jsx
import styles from "./Taskbar.module.css";
import { useEffect, useState } from "react";
import AudioVisualizer from "../AudioVisualizer/AudioVisualizer";
import VolumeControl from "../VolumeControl/VolumeControl";


export default function Taskbar() {
  const batteryLevel = 78; // en pourcentage
  const [now, setNow] = useState(new Date());
  const time = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short" });


  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.taskbar}>
      {/* Zone gauche : logo / nom OS */}
      <div className={styles.leftArea}>
        <div className={styles.osBadge}>OS-Portfolio</div>
      </div>

      {/* Zone centrale (vide pour l’instant) */}
      <div className={styles.centerArea}>
      </div>

      {/* Zone droite : infos système */}
      <div className={styles.rightArea}>
        <AudioVisualizer />
        <VolumeControl />
        <div className={styles.divider}></div>
        <div className={styles.systemItem}>{date}</div>
        <div className={styles.divider}></div>
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

        <div className={styles.divider}></div>

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
