import { useEffect, useState } from "react";

// styles
import "../../styles/global.css";
import "../../styles/layout.css";
import "../../styles/typography.css";
import "../../styles/transition.css";
import "./bugFound.css";

//sound
import start from "../../assets/sounds/computer start.ogg";

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
    <div className="bug-screen background-glitch" onClick={handleClick}>
      <div className="overlay">
        <div className="warning">밀레니엄 버그 발견</div>
        <div className="date time-mono">
          {formattedDate.split("").map((char, i) => (
            <span key={i}>{char}</span>
          ))}
        </div>
        <div className="time">
          <span className="hoursMinutes time-mono">
            {hoursMinutes.split("").map((char, i) => (
              <span key={i}>{char}</span>
            ))}
          </span>
          <span className="seconds time-mono">
            {" "}
            {seconds.split("").map((char, i) => (
              <span key={i}>{char}</span>
            ))}
          </span>
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
