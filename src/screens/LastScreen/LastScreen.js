import { useEffect, useState, useRef } from "react";

import { useAgent } from "../../contexts/AgentContext";

import "./lastScreen.css";
import "../../styles/global.css";
import "../../styles/layout.css";
import "../../styles/typography.css";
import Window from "../../components/Window";
import Buttons from "../../components/Buttons";
import Submits from "../../components/Submits";

import mouseClick from "../../assets/sounds/mouse_click.ogg";

import complete from "../../assets/sounds/complete.ogg";

import last_art from "../../assets/images/arts/21.png";

function LastScreen({ onNext }) {
  const quizState = localStorage.getItem("quizState");
  const agentData = localStorage.getItem("agentCode");

  const screenRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");

  const se_complete = new Audio(complete);

  useEffect(() => {
    se_complete.play();
    //localStorage.clear();
  }, []);

  const handleClick = () => {
    if (currentIndex < defaultWindows.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onNext();
    }
  };

  const handleBefore = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const defaultWindows = [
    {
      title: "Cookie Time",
      content: (
        <>
          <img className="one_arts" src={last_art} alt="time travel" />
          <span>COOKIE TIME!!</span>
          <div className="story-buttons">
            <Buttons onClick={handleClick}>다음</Buttons>
          </div>
        </>
      ),
    },
    {
      title: "Cookie Time",
      content: (
        <>
          <img className="one_arts" src={last_art} alt="time travel" />
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
      title: "Level 0",
      content: (
        <>
          <img className="one_arts" src={last_art} alt="time travel" />
          <span>
            가방과 핸드폰을 챙겨서 다음 여행을 위한 이곳으로 왔습니다.
            시간여행이 가능한 이곳은 어디일까요?
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
          <p>
            {agentData}요원의 실적: {quizState === "cool" ? "😎" : "😰"}
          </p>
          <p>
            이 화면을 관리자에게 보여주어
            <br />
            요원 리워드를 받으세요.
          </p>
          <div className="story-buttons">
            <Buttons onClick={handleBefore}>이전</Buttons>
            <Buttons onClick={handleClick}>처음으로</Buttons>
          </div>
        </>
      ),
    },
  ];

  function handleAnswerSubmit(e) {
    new Audio(mouseClick).play();
    e.preventDefault();
    const normalized = answer.trim().toLowerCase();
    if (normalized.includes("공항")) {
      handleClick();
    } else {
      console.log("정답이 아닙니다.");
    }
  }
  return (
    <div className="lastScreen" ref={screenRef}>
      <Window
        title={defaultWindows[currentIndex].title}
        onClose={handleClick}
        parentRef={screenRef}
      >
        {defaultWindows[currentIndex].content}
      </Window>
    </div>
  );
}

export default LastScreen;
