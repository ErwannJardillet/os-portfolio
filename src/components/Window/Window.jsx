// Window.jsx
import { useState, useRef } from "react";
import styles from "./Window.module.css";

export default function Window({
  id,
  title = "PlaceHolder",
  children = "PlaceHolder",
  initialTop = "100",   // en px pour le moment
  initialLeft = "100",  // en px pour le moment
  width = "400px",
  height = "260px",
  onClose,
  onFocus,
  zIndex,
}) {
  // Position locale de la fenêtre
  const [position, setPosition] = useState({
    top: parseInt(initialTop, 10),
    left: parseInt(initialLeft, 10),
  });

  // Décalage entre la souris et le coin de la fenêtre
  const dragOffset = useRef({ x: 0, y: 0 });

  function onDrag(e) {
    setPosition({
      top: e.clientY - dragOffset.current.y,
      left: e.clientX - dragOffset.current.x,
    });
  }

  function startDrag(e) {
    // Mettre la fenêtre au premier plan
    onFocus && onFocus(id);

    dragOffset.current = {
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    };

    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopDrag);
  }

  function stopDrag() {
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", stopDrag);
  }

  // Style de base de la fenêtre
  const style = {
    top: position.top,
    left: position.left,
    zIndex,
  };

  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={styles.window}
      style={style}
    >
      <div
        className={styles.titleBar}
        onMouseDown={startDrag}
      >
        <div className={styles.title}>{title}</div>
        <div className={styles.actions}>
          <span
            className={styles.dot}
            onClick={() => onClose && onClose(id)}
          />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
      </div>

      <div className={styles.content}>{children}</div>
    </div>
  );
}
