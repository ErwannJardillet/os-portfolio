import { useState, useEffect } from "react";
import Desktop from "./components/Desktop/Desktop.jsx";
import BootScreen from "./components/BootScreen/BootScreen.jsx";
import MobileView from "./components/MobileView/MobileView.jsx";
import { AudioProvider } from "./contexts/AudioContext";
import { useIsMobile } from "./hooks/useIsMobile";
import "./App.css";

export default function App() {
    const isMobile = useIsMobile();
    const [isBooting, setIsBooting] = useState(true);
    const [shouldOpenIntroduction, setShouldOpenIntroduction] = useState(false);

    const handleBootComplete = () => {
        setIsBooting(false);
    };

    // Ouvrir la fenêtre d'introduction 2 secondes après la fin du boot
    useEffect(() => {
        if (!isBooting) {
            const timer = setTimeout(() => {
                setShouldOpenIntroduction(true);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [isBooting]);

    return (
        <AudioProvider>
            {isBooting && <BootScreen onBootComplete={handleBootComplete} />}
            <div className={isBooting ? "desktop-hidden" : "desktop-visible"}>
                {isMobile
                    ? <MobileView />
                    : <Desktop shouldOpenIntroduction={shouldOpenIntroduction} />
                }
            </div>
        </AudioProvider>
    );
}