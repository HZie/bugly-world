import { useEffect, useState, useRef } from "react";

import Window from "../../components/Window";
import Buttons from "../../components/Buttons";
import Submits from "../../components/Submits";
import "./firstQuiz.css";
import "../../styles/global.css";
import "../../styles/layout.css";
import "../../styles/typography.css";

import mouseClick from "../../assets/sounds/mouse_click.ogg";
import error from "../../assets/sounds/error sound.ogg";

import oneone from "../../assets/images/arts/1.png";
import onetwo from "../../assets/images/arts/2.png";
import onethree from "../../assets/images/arts/3.png";
import onefour from "../../assets/images/arts/4.png";

function FirstQuiz({ onNext }) {
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
          <img className="one_arts" src={oneone} alt="2100 atlantis" />
          <span>
            [화면에 보이는 작품 앞으로
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
          <img className="one_arts" src={oneone} alt="2100 atlantis" />
          <span>
            요원님의 위치를 추적해 보니,
            <br />
            과거의 2000년이 아닌
            <br />
            2100년으로 오셨군요!
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
          <img className="one_arts" src={oneone} alt="2100 atlantis" />
          <span>
            현재 섬들의 이름은 <br />
            ‘2100 ATLANTIS’로
            <br />
            물에 잠긴 세계에 와 계십니다.
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
          <img className="one_arts" src={oneone} alt="2100 atlantis" />
          <span>
            엄청난 버그의 기운이
            <br />
            느껴지는데요?
            <br />
            그러나 요원님은 아직
            <br />
            오류들을 볼 수 있는
            <br />
            능력이 없습니다.
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
            그러나 제가 드리는 <br />
            첫번째 문제를 푸시면
            <br />
            능력을 얻으실 수 있습니다.
            <br />
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
          <img className="one_arts" src={onetwo} alt="2100 atlantis" />

          <span>
            [화면에 보이는 작품 앞으로
            <br />
            이동해 주세요]
            <br />
          </span>
          <div className="story-buttons">
            <Buttons onClick={handleBefore}>이전</Buttons>
            <Buttons onClick={handleClick}>다음</Buttons>
          </div>
        </>
      ),
    },
    {
      title: "Level 0",
      content: (
        <>
          <img className="one_arts" src={onetwo} alt="2100 atlantis" />
          <span>
            UglyWorld에는 사람 모양의
            <br />섬 2개가 있다.
            <br />그 섬은 음과 양을 나눠 가지며,
            <br />
            밝게 빛나는 자신들을
            <br />
            뽐내곤 하지.
            <br />두 섬은 다른 시간에 살지만,
            <br />
            서로를 마주 보며
            <br />
            같은 바다 위에 떠 존재한다. <br />그 두 섬의 심장을 찾아
            <br />더 밝게 꽃을 피우게 해다오.
            <br /> <br />
            문제: 위에서 말하는 섬이 그려진
            <br />
            작품 번호 2개를 적으세요.
            <br />
          </span>
          <form onSubmit={handleAnswerSubmit}>
            <input
              value={answer}
              className="computer-input"
              onChange={(e) => {
                setAnswer(e.target.value);
              }}
            />
            <Submits value="정답" />
          </form>
        </>
      ),
    },
    {
      title: "UglyWorld in_BUG",
      content: (
        <>
          <img className="one_arts" src={onethree} alt="2100 atlantis" />
          <span>
            [화면에 보이는 작품 앞으로
            <br />
            이동해 주세요]
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
          <img className="one_arts" src={onethree} alt="2100 atlantis" />
          <span>
            당신의 잠재력으로
            <br />
            파도가 휘몰아치고 있습니다.
            <br />
            요원님은 이제
            <br />
            오류가 무엇인지
            <br />볼 수 있는 능력이 있습니다.
          </span>{" "}
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
          <img className="one_arts" src={onethree} alt="2100 atlantis" />
          <span>
            Potential이라는 작품 안에
            <br />
            세상의 네모난 오류들이
            <br />
            보이시죠?
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
            그 특별한 능력으로
            <br />
            핵심 오류를 찾아
            <br />
            세상을 치료해 주세요.
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
          {" "}
          <img className="one_arts" src={onefour} alt="2100 atlantis" />
          <span>
            [화면에 보이는 작품 앞으로
            <br />
            이동해 주세요]
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
          {" "}
          <img className="one_arts" src={onefour} alt="2100 atlantis" />
          <span>이제 바다를 벗어나야겠습니다.</span>
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
          <img className="one_arts" src={onefour} alt="2100 atlantis" />
          <span>
            바다에 다양한 에너지들이
            <br />
            모여있는 모습이
            <br />
            보이시나요?
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
          <img className="one_arts" src={onefour} alt="2100 atlantis" />
          <span>
            가운데의 투명한 UglyWorld 섬<br />
            ‘SOMEWEHRE WAVE’는
            <br />
            주변 에너지들을 모아
            <br />
            원하는 곳으로
            <br />
            순간이동을 시켜주는
            <br />
            포털 역할을 하고 있습니다.
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
          <img className="one_arts" src={onefour} alt="2100 atlantis" />
          <span>
            그럼 포털을 타고
            <br />
            이동해 보겠습니다.
          </span>
          <div className="story-buttons">
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
    <div className={`first-quiz fade-in ${fadeIn}`} ref={screenRef}>
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
            <div className="first-quiz__window-content">{win.content}</div>
          </Window>
        );
      })}
    </div>
  );
}
export default FirstQuiz;
