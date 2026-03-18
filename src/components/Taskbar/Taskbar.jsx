// Taskbar.jsx
import styles from "./Taskbar.module.css";
import { useEffect, useState } from "react";
import AudioVisualizer from "../AudioVisualizer/AudioVisualizer";
import VolumeControl from "../VolumeControl/VolumeControl";


export default function Taskbar() {
  const [now, setNow] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [isCharging, setIsCharging] = useState(false);
  const time = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const dateDay = now.toLocaleDateString("fr-FR", { weekday: "short" });
  const dateRest = now.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!('getBattery' in navigator)) return;
    let battery;
    const updateLevel = () => setBatteryLevel(Math.round(battery.level * 100));
    const updateCharging = () => setIsCharging(battery.charging);
    navigator.getBattery().then((b) => {
      battery = b;
      updateLevel();
      updateCharging();
      b.addEventListener('levelchange', updateLevel);
      b.addEventListener('chargingchange', updateCharging);
    });
    return () => {
      if (battery) {
        battery.removeEventListener('levelchange', updateLevel);
        battery.removeEventListener('chargingchange', updateCharging);
      }
    };
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
        <div className={`${styles.systemItem} ${styles.dateItem}`}>
          <span className={styles.dateDay}>{dateDay}</span>
          <span className={styles.dateRest}>{dateRest}</span>
        </div>
        <div className={styles.divider}></div>
        <div className={`${styles.systemItem} ${styles.timeItem}`}>{time}</div>

        {batteryLevel !== null && (
          <div className={styles.systemItem}>
            <div className={styles.battery}>
              <div className={styles.batteryBody}>
                <div
                  className={styles.batteryLevel}
                  style={{
                    width: `${batteryLevel}%`,
                    background: batteryLevel <= 20
                      ? 'linear-gradient(to right, #ff4b4b, #ff8a4b)'
                      : isCharging
                      ? 'linear-gradient(to right, #4bf0ff, #4baaff)'
                      : undefined,
                  }}
                />
              </div>
              <div className={styles.batteryTip} />
            </div>
          </div>
        )}

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
