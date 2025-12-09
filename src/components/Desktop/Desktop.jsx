import styles from "./Desktop.module.css";
import Window from "../Window/Window";
import { windowsConfig } from "./windowsConfig";


export default function Desktop() {
  return (
    <div className={styles.desktop}>
      {windowsConfig.map((win) => (
        <Window
          key={win.id}
          title={win.title}
          initialTop={win.initialTop}
          initialLeft={win.initialLeft}
          width={win.width}
        >
          <p>{win.content}</p>
        </Window>
      ))}
    </div>
  );
}
