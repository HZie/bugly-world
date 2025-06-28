import { useEffect, useState, useRef } from "react";

import Window from "../../components/Window";
import Buttons from "../../components/Buttons";
import Submits from "../../components/Submits";
import "./afterUrdy.css";
import "../../styles/global.css";
import "../../styles/layout.css";
import "../../styles/typography.css";

import mouseClick from "../../assets/sounds/mouse_click.ogg";
import error from "../../assets/sounds/error sound.ogg";

import oneone from "../../assets/images/arts/1.png";
import onetwo from "../../assets/images/arts/2.png";
import onethree from "../../assets/images/arts/3.png";
import onefour from "../../assets/images/arts/4.png";

function AfterUrdy({ onNext }) {
  const screenRef = useRef(null);
  const [fadeIn, setFadeIn] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [clickDisabled, setClickDisabled] = useState(false);
  const [answer, setAnswer] = useState("");

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
          <span>
            ‘어디’의 이름을 찾았습니다! BUG의 세계도 편안해지는 모습을
            보이는군요.
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
          <span>
            ‘어디’는 어디로 튈지 모르는 무의식이자 솔직함과 동심입니다.
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
          <span>자아가 있는 누구에게나 존재하는 5살 요정이죠.</span>
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
          <span>
            ‘어디’는 어른이 되어버린 의식 자아가 현실을 버티지 못할 때,
            상상놀이를 시작합니다.
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
          <span>
            세상을 향한 날카로운 반항과 번뜩이는 자신감으로 불안을 쫓는 놀이를
            하며 UglyWorld에서의 하루 추억을 남기죠.
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
          <span>
            당신 맘속 세계에도 불안이 멈추지 않는다면, ‘어디’를 잊어버려 오류가
            난건 아닐까요?
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
          <span>
            오류를 생겼다 해도, 요원님은 ‘어디’와 함께 치료할 수 있는 능력이
            있음을 잊지 마시길 바랍니다.
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
          <span>BUG 세계의 모든 문제가 해결 되었습니다.</span>{" "}
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
          <span>다시 원래 세계로 돌아가 봅시다.</span>
          <div className="story-buttons">
            <Buttons onClick={handleBefore}>이전</Buttons>
            <Buttons onClick={onNext}>원래 세계로</Buttons>
          </div>
        </>
      ),
    },
    {
      title: "UglyWorld in_BUG",
      content: (
        <>
          <span>
            아참! 돌아가기 전에 포토 존에서 인증사진을 찍는 것도 잊지 맙시다.
          </span>
          <div className="story-buttons">
            <Buttons onClick={handleBefore}>이전</Buttons>
            <Buttons onClick={handleClick}>다음</Buttons>
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
    <div className={`after-urdy fade-in ${fadeIn}`} ref={screenRef}>
      <Window
        title={defaultWindows[currentIndex].title}
        parentRef={screenRef}
        onClose={handleClose}
        isActive="active"
      >
        <div className="after-urdy__window-content">
          {defaultWindows[currentIndex].content}
        </div>
      </Window>
    </div>
  );
}
export default AfterUrdy;
