import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 1024; // Bloque téléphones et tablettes

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(() => {
        // Vérification initiale côté client uniquement
        if (typeof window !== "undefined") {
            return window.innerWidth < MOBILE_BREAKPOINT;
        }
        return false;
    });

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };

        // Écoute des changements de taille
        window.addEventListener("resize", checkScreenSize);

        return () => {
            window.removeEventListener("resize", checkScreenSize);
        };
    }, []);

    return isMobile;
}
