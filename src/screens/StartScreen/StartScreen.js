import { useState } from "react";
import logo from "../../assets/images/uglyworld_logo.png";
import "./startScreen.css";
import "../../styles/transition.css";
import bgm from "../../assets/sounds/opening bgm.mp3";

function StartScreen({ onNext, audioRef, onEnterFullScreen }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = async () => {
    if (clicked) return; // 중복 클릭 방지

    if (onEnterFullScreen) {
      await onEnterFullScreen();
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(bgm);
      audioRef.current.loop = true;
      audioRef.current.play();
    }
    setClicked(true);
    console.log(clicked);
    setTimeout(() => {
      onNext();
    }, 600); // 애니메이션 끝난 뒤 전환
  };

  return (
    <div
      className={`mobile start-screen ${clicked ? "fade-out" : ""}`}
      onClick={handleClick}
    >
      <div className={`logo-wrapper ${clicked ? "glitch-out" : ""}`}>
        <img src={logo} className="logo" alt="uglyworld logo" />
      </div>
    </div>
  );
}

export default StartScreen;
