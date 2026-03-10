import { useState, useEffect } from "react";
import Desktop from "./components/Desktop/Desktop.jsx";
import BootScreen from "./components/BootScreen/BootScreen.jsx";
import { AudioProvider } from "./contexts/AudioContext";
import "./App.css";

export default function App() {
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
            }, 2000); // 2 secondes

            return () => clearTimeout(timer);
        }
    }, [isBooting]);

    return (
        <AudioProvider>
            {isBooting && <BootScreen onBootComplete={handleBootComplete} />}
            <div className={isBooting ? "desktop-hidden" : "desktop-visible"}>
                <Desktop shouldOpenIntroduction={shouldOpenIntroduction} />
            </div>
        </AudioProvider>
    );
}