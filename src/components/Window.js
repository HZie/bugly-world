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

  // Drag state and offset
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const initialPos = useRef(null);

  useEffect(() => {
    if (!parentRef?.current || !windowRef.current) return;

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
  }, []);

  // Mouse event handlers for dragging
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    initialPos.current = { ...pos };
  };

  const handleMouseMove = (e) => {
    if (
      !isDragging ||
      !dragStart ||
      !initialPos.current ||
      !parentRef?.current ||
      !windowRef?.current
    )
      return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    const parentRect = parentRef.current.getBoundingClientRect();
    const newLeft = initialPos.current.left + dx;
    const newTop = initialPos.current.top + dy;

    const clampedLeft = Math.max(
      0,
      Math.min(newLeft, parentRect.width - windowRef.current.offsetWidth)
    );
    const clampedTop = Math.max(
      0,
      Math.min(newTop, parentRect.height - windowRef.current.offsetHeight)
    );

    setPos({ left: clampedLeft, top: clampedTop });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      initialPos.current = { ...pos };
    }
  };

  const handleTouchMove = (e) => {
    if (
      !isDragging ||
      !dragStart ||
      !initialPos.current ||
      !parentRef?.current ||
      !windowRef?.current
    )
      return;

    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;

    const parentRect = parentRef.current.getBoundingClientRect();
    const newLeft = initialPos.current.left + dx;
    const newTop = initialPos.current.top + dy;

    const clampedLeft = Math.max(
      0,
      Math.min(newLeft, parentRect.width - windowRef.current.offsetWidth)
    );
    const clampedTop = Math.max(
      0,
      Math.min(newTop, parentRect.height - windowRef.current.offsetHeight)
    );

    setPos({ left: clampedLeft, top: clampedTop });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  return (
    <div
      ref={windowRef}
      className={`window ${isActive}`}
      style={{ top: pos.top, left: pos.left, position: "absolute" }}
      onClick={onClick}
    >
      <div
        className="window-header"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
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
