import { useState } from "react";
import Desktop from "./components/Desktop/Desktop.jsx";
import BootScreen from "./components/BootScreen/BootScreen.jsx";
import "./App.css";

export default function App() {
    const [isBooting, setIsBooting] = useState(true);

    const handleBootComplete = () => {
        setIsBooting(false);
    };

    return (
        <>
            {isBooting && <BootScreen onBootComplete={handleBootComplete} />}
            <div className={isBooting ? "desktop-hidden" : "desktop-visible"}>
                <Desktop />
            </div>
        </>
    );
}