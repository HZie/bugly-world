import { useEffect, useState, useRef } from "react";

import Window from "../../components/Window";
import Buttons from "../../components/Buttons";
import Submits from "../../components/Submits";
import "./beforeCredit.css";
import "../../styles/global.css";
import "../../styles/layout.css";
import "../../styles/typography.css";

import mouseClick from "../../assets/sounds/mouse_click.ogg";
import error from "../../assets/sounds/error sound.ogg";
import home from "../../assets/images/arts/19.png";
function BeforeCredit({ onNext }) {
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
          <img className="one_arts" src={home} alt="home arts" />
          <span>집으로 돌아왔습니다.</span>
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
          <img className="one_arts" src={home} alt="2100 atlantis" />
          <span>시간을 보니…어? 벌써 해가 저물 시간입니다!</span>
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
          <img className="one_arts" src={home} alt="2100 atlantis" />
          <span>
            DAY는 가고 이제 NIGHT 놀이동산을 맞이해야 할 때입니다. 그럼 다음
            5번째 놀이동산을 기다리며,
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
          <img className="one_arts" src={home} alt="2100 atlantis" />
          <span>With the Dream of UglyWorld </span>
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
    <div className={`before-credit fade-in ${fadeIn}`} ref={screenRef}>
      <Window
        title={defaultWindows[currentIndex].title}
        parentRef={screenRef}
        onClose={handleClose}
        isActive="active"
      >
        <div className="before-credit__window-content">
          {defaultWindows[currentIndex].content}
        </div>
      </Window>
    </div>
  );
}
export default BeforeCredit;
