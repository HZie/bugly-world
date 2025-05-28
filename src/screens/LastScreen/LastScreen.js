import { useEffect, useState, useRef } from "react";

import { useAgent } from "../../contexts/AgentContext";

import "./lastScreen.css";
import "../../styles/global.css";
import "../../styles/layout.css";
import "../../styles/typography.css";
import Window from "../../components/Window";

import complete from "../../assets/sounds/complete.mp3";
import computerStart from "../../assets/sounds/computer start.mp3";

const computerStartAudio = new Audio(computerStart);
computerStartAudio.loop = false;

function LastScreen() {
  const { agent } = useAgent();
  const quizState = localStorage.getItem("quizState");
  const agentData = localStorage.getItem("agentCode");

  const screenRef = useRef(null);

  const se_complete = new Audio(complete);
  se_complete.play();
  localStorage.clear();
  return (
    <div className="lastScreen" ref={screenRef}>
      <Window title="UglyWorld in_BUG" parentRef={screenRef}>
        <p>
          버그가 모두 사라졌습니다.
          <br />
          어디는 어디로 갔을까요?
        </p>
        <p>
          {agentData}요원의 실적: {quizState == "cool" ? "😎" : "😐"}
        </p>
        <p>
          이 화면을 관리자에게 보여주어
          <br />
          요원 리워드를 받으세요.
        </p>
      </Window>
    </div>
  );
}

export default LastScreen;
