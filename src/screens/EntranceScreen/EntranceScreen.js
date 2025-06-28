import { useEffect, useState, useRef } from "react";

import Window from "../../components/Window";
import Buttons from "../../components/Buttons";
import Submits from "../../components/Submits";
import "./entranceScreen.css";
import "../../styles/global.css";
import "../../styles/layout.css";
import "../../styles/typography.css";

import mouseClick from "../../assets/sounds/mouse_click.ogg";
import error from "../../assets/sounds/error sound.ogg";

function EntranceScreen({ onNext }) {
  const screenRef = useRef(null);
  const [fadeIn, setFadeIn] = useState("");
  const [windowIndices, setWindowIndices] = useState([]);
  const [clickDisabled, setClickDisabled] = useState(false);
  const [answer, setAnswer] = useState("");

  const errorSound = new Audio(error);

  useEffect(() => {
    const fadeTimeout = setTimeout(() => {
      setFadeIn("fade-in");
    }, 50);

    const initTimeout = setTimeout(() => {
      errorSound.play();

      setWindowIndices([0]); // 첫 창
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
            [스크린존에서 통로로
            <br />
            이동해 주세요]
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
          <span>안녕하세요, 요원님!</span>
          <div className="entrance__story-buttons">
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
            저는 요원님을 돕는
            <br /> ㅈ ㅇ입니다.
          </span>
          <div className="entrance__story-buttons">
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
            요원님은 현재 <br />
            00년 01월 01일, <br />
            UglyWorld 안의 BUG 세계에 <br />
            들어오셨습니다.
          </span>
          <div className="entrance__story-buttons">
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
            밀레니엄 버그는 요원님이 <br />
            사시는 세계에서는 <br /> 다행히 나타나지 않았지만,
            <br />
            UglyWorld에서는 <br />
            시스템 오류들이 나타나
            <br />
            ‘BUG’라는 새로운 영역을
            <br />
            탄생시켰습니다.
          </span>
          <div className="entrance__story-buttons">
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
            작은 시스템 오류들은 현재 <br />
            모순을 일으켜 사회문제까지 <br />
            뒤얽힌 혼란을 주고 있습니다.
          </span>
          <div className="entrance__story-buttons">
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
            요원님은 핵심 오류들을
            <br />볼 수 있는 능력을 얻어
            <br />
            세상을 치료해주세요.
          </span>
          <div className="entrance__story-buttons">
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
            요원님을 믿습니다.
            <br />
            행운을 빕니다!
          </span>
          <div className="entrance__story-buttons">
            <Buttons onClick={onNext}>이동</Buttons>
          </div>
        </>
      ),
    },
  ];

  function handleAnswerSubmit(e) {
    new Audio(mouseClick).play();
    e.preventDefault();
    const normalized = answer.trim().toLowerCase();
    if (normalized.includes("3") && normalized.includes("4")) {
      handleClick();
    } else {
      console.log("정답이 아닙니다.");
    }
  }

  function handleClick() {
    if (clickDisabled) return;
    errorSound.play();
    const lastIndex = windowIndices[windowIndices.length - 1] ?? -1;
    if (lastIndex < defaultWindows.length - 1) {
      setWindowIndices((prev) => [...prev, lastIndex + 1]);
    }
  }

  function handleBefore() {
    if (clickDisabled) return;
    if (windowIndices.length > 1) {
      setWindowIndices((prev) => {
        const newIndices = [...prev];
        newIndices.pop(); // remove current
        return newIndices;
      });
    }
  }

  function handleClose() {
    if (clickDisabled) return;
    if (windowIndices.length > 0) {
      const lastIndex = windowIndices[windowIndices.length - 1];
      setWindowIndices((prev) => [...prev, lastIndex]);
    }
  }

  return (
    <div className={`entranceScreen fade-in ${fadeIn}`} ref={screenRef}>
      {windowIndices.map((idx, i) => {
        const win = defaultWindows[idx];
        if (!win) return null;
        const isLast = i === windowIndices.length - 1;
        return (
          <Window
            key={i}
            title={win.title}
            parentRef={screenRef}
            onClose={isLast ? handleClose : undefined}
            isActive={isLast ? "active" : "inactive"}
          >
            <div className="window-content">{win.content}</div>
          </Window>
        );
      })}
    </div>
  );
}
export default EntranceScreen;
