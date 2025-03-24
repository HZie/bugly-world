import { useEffect, useState } from "react";
import "./styles/layout.css";
import "./styles/transition.css";

function ComputerScreen({ onNext }) {
  const [fadeIn, setFadeIn] = useState("");
  // 시간

  useEffect(() => {
    setFadeIn("fade-in");
  }, []);

  return (
    <div
      className={`mobile ${fadeIn}`}
      onClick={onNext}
      style={{ backgroundColor: "#005FBD" }}
    ></div>
  );
}

export default ComputerScreen;
