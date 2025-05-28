import { useEffect, useRef, useState } from "react";
import "./window.css";

function Window({
  parentRef,
  title,
  children,
  onClick,
  onClose,
  isActive = "",
  className = "",
}) {
  const windowRef = useRef(null);
  const isDraggingRef = useRef(false);
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
    const headerHeight = 30; // assume header height is about 30px
    const maxTop = parentRect.height - windowRect.height - margin;
    const maxLeft = parentRect.width - windowRect.width - margin;
    const minTop = headerHeight; // to ensure header is visible

    // 음수 방지
    const safeTop = Math.max(0, maxTop);
    const safeLeft = Math.max(0, maxLeft);

    // 랜덤 배치 (부모 안)
    const randomTop = Math.floor(Math.random() * (safeTop - minTop)) + minTop;
    const randomLeft = margin + Math.floor(Math.random() * safeLeft);

    setPos({ top: randomTop, left: randomLeft });
    if (windowRef.current) {
      windowRef.current.style.top = `${randomTop}px`;
      windowRef.current.style.left = `${randomLeft}px`;
    }
  }, []);

  // Mouse event handlers for dragging
  const handleMouseDown = (e) => {
    // Debug logs for mouse down and initial position
    console.log("Mouse down triggered");
    console.log("windowRef.current:", windowRef.current);
    console.log("parentRef.current:", parentRef?.current);

    const windowEl = windowRef.current;
    const parentEl = parentRef?.current;

    if (windowEl && parentEl) {
      const parentRect = parentEl.getBoundingClientRect();
      const windowRect = windowEl.getBoundingClientRect();

      const offsetX = e.clientX - windowRect.left;
      const offsetY = e.clientY - windowRect.top;

      initialPos.current = {
        offsetX,
        offsetY,
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    e.preventDefault();
    isDraggingRef.current = true;
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (
      !isDraggingRef.current ||
      !dragStart ||
      !initialPos.current ||
      !windowRef.current ||
      !parentRef?.current
    )
      return;

    const parentRect = parentRef.current.getBoundingClientRect();
    const newLeft = e.clientX - parentRect.left - initialPos.current.offsetX;
    const newTop = e.clientY - parentRect.top - initialPos.current.offsetY;

    const clampedLeft = Math.max(
      0,
      Math.min(newLeft, parentRect.width - windowRef.current.offsetWidth)
    );
    const clampedTop = Math.max(
      0,
      Math.min(newTop, parentRect.height - windowRef.current.offsetHeight)
    );

    setPos({ top: clampedTop, left: clampedLeft });
    if (windowRef.current) {
      windowRef.current.style.top = `${clampedTop}px`;
      windowRef.current.style.left = `${clampedLeft}px`;
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    console.log("Drag ended");
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e) => {
    if (e.target.closest("input, textarea, [contenteditable=true]") !== null) {
      isDraggingRef.current = false;
      return;
    }

    if (e.touches.length === 1) {
      const windowEl = windowRef.current;
      const parentEl = parentRef?.current;

      if (windowEl && parentEl) {
        const parentRect = parentEl.getBoundingClientRect();
        const windowRect = windowEl.getBoundingClientRect();

        const offsetX = e.touches[0].clientX - windowRect.left;
        const offsetY = e.touches[0].clientY - windowRect.top;

        initialPos.current = {
          offsetX,
          offsetY,
        };

        isDraggingRef.current = true;
        setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });

        document.addEventListener("touchmove", handleTouchMove, {
          passive: false,
        });
        document.addEventListener("touchend", handleTouchEnd);
      }
    }
  };

  const handleTouchMove = (e) => {
    const isInput =
      e.target.closest("input, textarea, [contenteditable=true]") !== null;

    if (isInput) return;

    e.preventDefault();
    if (
      !isDraggingRef.current ||
      !dragStart ||
      !initialPos.current ||
      !windowRef.current ||
      !parentRef?.current
    )
      return;

    const parentRect = parentRef.current.getBoundingClientRect();
    const newLeft =
      e.touches[0].clientX - parentRect.left - initialPos.current.offsetX;
    const newTop =
      e.touches[0].clientY - parentRect.top - initialPos.current.offsetY;

    const clampedLeft = Math.max(
      0,
      Math.min(newLeft, parentRect.width - windowRef.current.offsetWidth)
    );
    const clampedTop = Math.max(
      0,
      Math.min(newTop, parentRect.height - windowRef.current.offsetHeight)
    );

    setPos({ top: clampedTop, left: clampedLeft });
    if (windowRef.current) {
      windowRef.current.style.top = `${clampedTop}px`;
      windowRef.current.style.left = `${clampedLeft}px`;
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    console.log("Touch drag ended");
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
  };

  return (
    <div
      ref={windowRef}
      className={`window ${isActive} ${className}`}
      style={{
        top: `${pos.top}px`,
        left: `${pos.left}px`,
        position: "absolute",
      }}
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
