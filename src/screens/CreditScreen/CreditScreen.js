import { useEffect, useState, useRef } from "react";

import Window from "../../components/Window";
import Buttons from "../../components/Buttons";
import Submits from "../../components/Submits";
import "./creditScreen.css";
import "../../styles/global.css";
import "../../styles/layout.css";
import "../../styles/typography.css";

import mouseClick from "../../assets/sounds/mouse_click.ogg";
import error from "../../assets/sounds/error sound.ogg";
import logo from "../../assets/images/arts/20.png";
function CreditScreen({ onNext }) {
  const screenRef = useRef(null);
  const [fadeIn, setFadeIn] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [clickDisabled, setClickDisabled] = useState(false);

  const errorSound = new Audio(error);

  useEffect(() => {
    const fadeTimeout = setTimeout(() => {
      setFadeIn("fade-in");
    }, 50);

    const initTimeout = setTimeout(() => {
      errorSound.play();

      setCurrentIndex(0); // 첫 창
    }, 1000);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(initTimeout);
    };
  }, []);

  const defaultWindows = [
    {
      title: "UglyWorld in_BUG",
      content: (
        <>
          <img className="one_arts" src={logo} alt="logo" />
          <span>
            SURREAL THEME PARK ARTIST
            <br />
            Juiee UglyWorld
          </span>
          <div>
            <Buttons onClick={handleClick}>다음</Buttons>
          </div>
        </>
      ),
    },
    {
      title: "UglyWorld in_BUG",
      content: (
        <>
          <img className="one_arts" src={logo} alt="logo" />
          <span>
            PROGRAMMER ARTIST
            <br />
            Jiyeon HAN
          </span>
          <div className="story-buttons">
            <Buttons onClick={handleBefore}>이전</Buttons>
            <Buttons onClick={handleClick}>다음</Buttons>
          </div>
        </>
      ),
    },
    {
      title: "UglyWorld in_BUG",
      content: (
        <>
          <img className="one_arts" src={logo} alt="logo" />
          <span>
            Thanks to,
            <br />
            KP Gallery ON
            <br />
            롯데백화점 일산점
          </span>
          <div className="story-buttons">
            <Buttons onClick={handleBefore}>이전</Buttons>
            <Buttons onClick={onNext}>확인</Buttons>
          </div>
        </>
      ),
    },
  ];

  function handleClick() {
    if (clickDisabled) return;
    errorSound.play();
    if (currentIndex < defaultWindows.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function handleBefore() {
    if (clickDisabled) return;
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  function handleClose() {
    if (clickDisabled) return;
    setClickDisabled(true);
  }

  return (
    <div className={`credit-screen fade-in ${fadeIn}`} ref={screenRef}>
      <Window
        title={defaultWindows[currentIndex].title}
        parentRef={screenRef}
        onClose={handleClose}
        isActive="active"
      >
        <div className="credit-screen__window-content">
          {defaultWindows[currentIndex].content}
        </div>
      </Window>
    </div>
  );
}
export default CreditScreen;
