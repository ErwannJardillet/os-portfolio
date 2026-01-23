import { useState } from "react";
import Desktop from "./components/Desktop/Desktop.jsx";
import BootScreen from "./components/BootScreen/BootScreen.jsx";
import MobileBlock from "./components/MobileBlock/MobileBlock.jsx";
import { useIsMobile } from "./hooks/useIsMobile";
import { AudioProvider } from "./contexts/AudioContext";
import "./App.css";

export default function App() {
    const [isBooting, setIsBooting] = useState(true);
    const isMobile = useIsMobile();

    const handleBootComplete = () => {
        setIsBooting(false);
    };

    // Si mobile détecté, ne rendre que le message de blocage
    if (isMobile) {
        return <MobileBlock />;
    }

    return (
        <AudioProvider>
            {isBooting && <BootScreen onBootComplete={handleBootComplete} />}
            <div className={isBooting ? "desktop-hidden" : "desktop-visible"}>
                <Desktop />
            </div>
        </AudioProvider>
    );
}