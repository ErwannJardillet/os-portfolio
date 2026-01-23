import { useIsMobile } from "../../hooks/useIsMobile";
import WallpaperShaderGradient from "../Wallpaper/WallpaperShaderGradient.jsx";
import styles from "./MobileBlock.module.css";

export default function MobileBlock() {
    const isMobile = useIsMobile();

    // Si ce n'est pas mobile, ne rien afficher
    if (!isMobile) {
        return null;
    }

    return (
        <div className={styles.mobileBlock}>
            <WallpaperShaderGradient />
            <div className={styles.content}>
                <div className={styles.icon}>💻</div>
                <h1 className={styles.title}>Accès non disponible</h1>
                <p className={styles.message}>
                    Ce site nécessite un ordinateur pour une meilleure expérience.
                    <br />
                    Veuillez consulter ce portfolio depuis un PC.
                </p>
            </div>
        </div>
    );
}
