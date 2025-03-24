import { useEffect, useState } from "react";
import backgroundImage from "./assets/urdy.png";

// styles
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/typography.css";
import "./styles/bugFound.css";

function BugFound() {
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
  const formattedDate = time.toISOString().split("T")[0];

  // 시간 포맷: HH:MM:ss
  const timeParts = time.toTimeString().split(" ")[0].split(":");
  const hoursMinutes = `${timeParts[0]}:${timeParts[1]}`; // HH:MM
  const seconds = timeParts[2]; // ss

  return (
    <div
      className="mobile"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="overlay">
        <div className="warning">밀레니엄 버그 발견</div>
        <div className="date">{formattedDate}</div>
        <div className="time">
          <span className="hoursMinutes">{hoursMinutes}</span>
          <span className="seconds"> {seconds}</span>
        </div>
      </div>
      <div className="bug">
        <span className="bugTitle">VIRUS</span>
        <span className="bugName">URDY</span>
      </div>
    </div>
  );
}

export default BugFound;
