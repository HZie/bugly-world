import { useEffect, useState } from "react";

import "./vaccineScreen.css";
import "../../styles/global.css";
import "../../styles/layout.css";
import "../../styles/typography.css";

function VaccineScreen({ onNext }) {
  // 시간 표시
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // 1초마다 현재 시간 업데이트
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

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
    <div className="vaccineScreen" onClick={handleClick}>
      <div className="bug-hunting">
        <div className="warning">버그 추적 중</div>
        <div className="date">{formattedDate}</div>
        <div className="time">
          <span className="hoursMinutes">{hoursMinutes}</span>
          <span className="seconds"> {seconds}</span>
        </div>
      </div>
    </div>
  );
}

export default VaccineScreen;
