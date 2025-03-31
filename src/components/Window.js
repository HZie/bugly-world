import { useEffect, useRef, useState } from "react";
import "./window.css";

function Window({
  parentRef,
  title,
  children,
  onClick,
  onClose,
  isActive = "",
}) {
  const windowRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (parentRef.current && windowRef.current) {
      const parentRect = parentRef.current.getBoundingClientRect();
      const windowRect = windowRef.current.getBoundingClientRect();

      // 안전 여유 (px)
      const margin = 20;
      const maxTop = parentRect.height - windowRect.height - margin;
      const maxLeft = parentRect.width - windowRect.width - margin;

      // 음수 방지
      const safeTop = Math.max(0, maxTop);
      const safeLeft = Math.max(0, maxLeft);

      // 랜덤 배치 (부모 안)
      const randomTop = margin + Math.floor(Math.random() * safeTop);
      const randomLeft = margin + Math.floor(Math.random() * safeLeft);

      setPos({ top: randomTop, left: randomLeft });
    }
  }, []);

  return (
    <div
      ref={windowRef}
      className={`window ${isActive}`}
      style={{ top: pos.top, left: pos.left, position: "absolute" }}
      onClick={onClick}
    >
      <div className="window-header">
        <span className="window-title">{title}</span>
        <button
          className="window-close"
          onClick={(e) => {
            e.stopPropagation();
            onClose && onClose();
          }}
        >
          X
        </button>
      </div>
      <div className="window-body">{children}</div>
    </div>
  );
}

export default Window;
