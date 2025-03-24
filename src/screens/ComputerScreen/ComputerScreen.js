import { useEffect, useState } from "react";
import "../../styles/layout.css";
import "../../styles/transition.css";
import "./computerScreen.css";

function ComputerScreen({ onNext }) {
  const [fadeIn, setFadeIn] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFadeIn("fade-in");
    }, 50);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`mobile computer-screen pre-fade ${fadeIn}`}
      onClick={onNext}
    ></div>
  );
}

export default ComputerScreen;
