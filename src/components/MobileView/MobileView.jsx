import { useState, useEffect, lazy, Suspense } from "react";
import styles from "./MobileView.module.css";
import AudioVisualizer from "../AudioVisualizer/AudioVisualizer";
import VolumeControl from "../VolumeControl/VolumeControl";
import AudioPlayer from "../AudioPlayer/AudioPlayer";

const WallpaperShaderGradient = lazy(() => import("../Wallpaper/WallpaperShaderGradient.jsx"));
const About = lazy(() => import("../../apps/About/About"));
const Contact = lazy(() => import("../../apps/Contact/Contact"));
const Projects = lazy(() => import("../../apps/Projects/Projects"));
const Skills = lazy(() => import("../../apps/Skills/Skills"));

const APPS = [
  { id: "about",    label: "À propos",    icon: "/icons/about-icon.png",    component: About },
  { id: "projects", label: "Projets",     icon: "/icons/projects-icon.png", component: Projects },
  { id: "contact",  label: "Contact",     icon: "/icons/contact-icon.png",  component: Contact },
  { id: "skills",   label: "Compétences", icon: "/icons/skills-icon.png",   component: Skills },
];

export default function MobileView() {
  const [openApp, setOpenApp] = useState(null);
  const [now, setNow] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [isCharging, setIsCharging] = useState(false);

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

  // Bloquer le scroll du body quand un panel est ouvert
  useEffect(() => {
    document.body.style.overflow = openApp ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [openApp]);

  const time = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short" });

  const activeApp = APPS.find((a) => a.id === openApp);
  const AppComponent = activeApp?.component ?? null;

  return (
    <div className={styles.mobileView}>
      <Suspense fallback={null}>
        <WallpaperShaderGradient />
      </Suspense>

      {/* Barre de statut */}
      <div className={styles.statusBar}>
        <span className={styles.osBadge}>OS-Portfolio</span>
        <div className={styles.statusRight}>
          <AudioVisualizer />
          <VolumeControl />
          <span className={styles.date}>{dateStr}</span>
          <span className={styles.clock}>{time}</span>
          {batteryLevel !== null && (
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
          )}
        </div>
      </div>

      <AudioPlayer />

      {/* Grille d'icônes */}
      <div className={styles.appGrid}>
        {APPS.map((app) => (
          <button
            key={app.id}
            className={styles.appCard}
            onClick={() => setOpenApp(app.id)}
            aria-label={`Ouvrir ${app.label}`}
          >
            <div className={styles.appIconWrapper}>
              <img src={app.icon} alt="" className={styles.appIcon} draggable="false" />
            </div>
            <span className={styles.appLabel}>{app.label}</span>
          </button>
        ))}
      </div>

      {/* Panel slide-up */}
      {openApp && (
        <div className={styles.panelOverlay} onClick={() => setOpenApp(null)}>
          <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.panelHandle} />
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>{activeApp?.label}</span>
              <button
                className={styles.panelClose}
                onClick={() => setOpenApp(null)}
                aria-label="Fermer"
              >
                ×
              </button>
            </div>
            <div className={styles.panelContent}>
              <Suspense fallback={<div className={styles.loading}>Chargement…</div>}>
                {AppComponent && <AppComponent />}
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
