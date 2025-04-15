import { useEffect, useState } from "react";

import { useAgent } from "../../contexts/AgentContext";

import "./accessGrantedScreen.css";
import "../../styles/global.css";
import "../../styles/layout.css";
import "../../styles/typography.css";

const TARGET_TIME = new Date("2000-01-01T00:00:00");

function AccessGrantScreen({ onNext }) {
  const { agent } = useAgent();
  // 시간 표시
  const [time, setTime] = useState(TARGET_TIME);

  // 날짜 포맷: YYYY-MM-DD
  const year = time.getFullYear();
  const month = String(time.getMonth() + 1).padStart(2, "0");
  const day = String(time.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  // 시간 포맷: HH:MM:ss
  const hh = String(time.getHours()).padStart(2, "0");
  const mm = String(time.getMinutes()).padStart(2, "0");
  const ss = String(time.getSeconds()).padStart(2, "0");

  const hoursMinutes = `${hh}:${mm}`; // HH:MM
  const seconds = ss; // ss

  const handleClick = () => {
    onNext();
  };

  return (
    <div className="accessGrantedScreen" onClick={handleClick}>
      <div className="bg-layer" />
      <div className="overlay">
        <div className="warning">버그 추적 중</div>
        <div className="date">{formattedDate}</div>
        <div className="time">
          <span className="hoursMinutes">{hoursMinutes}</span>
          <span className="seconds"> {seconds}</span>
        </div>
      </div>
      <div className="access__message">요원에게 권한을 부여합니다.</div>
    </div>
  );
}

export default AccessGrantScreen;
