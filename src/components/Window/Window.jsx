// Window.jsx
import styles from "./Window.module.css";

export default function Window({
    title = "PlaceHolder",
    children = "PlaceHolder",
    initialTop = "50%",
    initialLeft = "50%",
    width = "100px",
    height = "100px",
}) {

    const style = {
        top: initialTop,
        left: initialLeft,
    };

    if (width) style.width = width;
    if (height) style.height = height;

    return (
        <div className={styles.window} style={style}>
            <div className={styles.titleBar}>
                <div className={styles.title}>{title}</div>
                <div className={styles.actions}>
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                </div>
            </div>

            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
}
