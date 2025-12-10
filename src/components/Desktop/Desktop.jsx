import styles from "./Desktop.module.css";
import Window from "../Window/Window";
import { windowsConfig } from "./windowsConfig";
import { useState } from "react";


export default function Desktop() {

  const [windows, setWindows] = useState(
    windowsConfig.map((win, index) => ({
      ...win,
      zIndex: index + 1,  // chaque fenêtre a un z-index initial
    }))
  );


  function handleClose(id) {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }

  function handleFocus(id) {
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map(w => w.zIndex)); // trouve le plus haut z-index actuel

      return prev.map((w) =>
        w.id === id
          ? { ...w, zIndex: maxZ + 1 }    // la fenêtre cliquée passe au-dessus
          : w
      );
    });
  }





  return (
    <div className={styles.desktop}>
      {windows.map((win) => (
        <Window
          key={win.id}
          title={win.title}
          id={win.id}
          initialTop={win.initialTop}
          initialLeft={win.initialLeft}
          width={win.width}
          onClose={handleClose}
          onFocus={handleFocus}
          zIndex={win.zIndex}
        >
          <p>{win.content}</p>
        </Window>
      ))}
    </div>
  );
}
