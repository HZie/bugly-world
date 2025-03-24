import { useEffect, useState, useRef } from "react";
import backgroundImage from "../../assets/images/urdy.png";

// styles
import "../../styles/global.css";
import "../../styles/layout.css";
import "../../styles/typography.css";
import "./bugFound.css";

//sound
import start from "../../assets/sounds/computer start.mp3";

function BugFound({ onNext, audioRef }) {
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

  // 소리
  const se_start = new Audio(start);

  const handleClick = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null; // 다음 재생 대비
    }

    const se_start = new Audio(start);
    se_start.play(se_start);
    onNext();
  };

  return (
    <div className="mobile bug-screen" onClick={handleClick}>
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
