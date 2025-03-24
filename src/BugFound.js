import { useEffect, useState, useRef } from "react";
import backgroundImage from "./assets/urdy.png";

// styles
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/typography.css";

//sound
import bgm from "./assets/sounds/opening bgm.mp3";
import start from "./assets/sounds/computer start.mp3";

function BugFound({ onNext }) {
  // 시간 표시
  const [time, setTime] = useState(new Date());
  // 클릭 여부
  const [clickedOnce, setClickedOnce] = useState(false);

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
  const audioRef = useRef(null);
  const se_bgm = new Audio(bgm);
  const se_start = new Audio(start);

  const handleClick = () => {
    if (!clickedOnce) {
      // 첫번째 클릭
      const se_bgm = new Audio(bgm);
      se_bgm.loop = true;
      se_bgm.play();
      audioRef.current = se_bgm;
      setClickedOnce(true);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const se_start = new Audio(start);
      se_start.play(se_start);
      onNext();
    }
  };

  return (
    <div
      className="mobile"
      onClick={handleClick}
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
