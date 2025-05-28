import { useEffect, useState } from "react";

import { useAgent } from "../../contexts/AgentContext";

import "./goingBack.css";
import "../../styles/global.css";
import "../../styles/layout.css";
import "../../styles/typography.css";
import warning from "../../assets/sounds/warning.mp3";
import chasing from "../../assets/sounds/chasing.mp3";
import computerStart from "../../assets/sounds/computer start.mp3";

const chasingAudio = new Audio(chasing);

const TARGET_TIME = new Date();

const warningAudio = new Audio(warning);
const computerStartAudio = new Audio(computerStart);
computerStartAudio.loop = false;

function GoingBack({ onNext }) {
  const { agent } = useAgent();
  //console.log(agent);
  // 시간 표시
  const [time, setTime] = useState(new Date("2000-01-01T00:00:00"));
  // 시간 팍 뜨게 하기
  const [visible, setVisible] = useState(false);
  const [bgOpacity, setBgOpacity] = useState(0);
  const [accessGranted, setAccessGranted] = useState(false);
  const [flashOverlay, setFlashOverlay] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 800);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    if (!visible) return;

    let frame = 1;
    let delay = 300; // 시작 간격 (ms)
    let timeoutId;

    const tick = () => {
      chasingAudio.play();

      setTime((prev) => {
        const next = new Date(prev.getTime() + 1000 * frame); // 1초 감소
        if (next >= TARGET_TIME) {
          //warningAudio.play();

          clearTimeout(timeoutId);
          setAccessGranted(true);
          setFlashOverlay(true);
          // setTimeout(() => setFlashOverlay(false), 1000);
          return TARGET_TIME;
        }

        return next;
      });
      // 호출 간격 줄이기 (더 빠르게 감소)
      frame = frame * 1.01;
      delay = delay / frame;
      timeoutId = setTimeout(tick, delay);
    };
    timeoutId = setTimeout(tick, delay);

    return () => {
      clearTimeout(timeoutId);
      warningAudio.pause();
      warningAudio.currentTime = 0;
    };
  }, [visible, onNext]);

  useEffect(() => {
    if (!visible) return;

    const start = Date.now();
    const fixedDuration = 13000; // 💡 5초 동안 opacity 0 → 1

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - start;
      const progress = elapsed / fixedDuration;

      setBgOpacity(Math.min(progress, 0.9));

      if (progress >= 1) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [visible]);

  /*
  useEffect(() => {
    // 1초마다 현재 시간 업데이트
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  */

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
    // Attempt to unlock warningAudio on mobile
    warningAudio
      .play()
      .then(() => {
        warningAudio.pause();
        warningAudio.currentTime = 0;
      })
      .catch(() => {});

    if (accessGranted) {
      warningAudio.pause();
      warningAudio.currentTime = 0;
      chasingAudio.pause();
      chasingAudio.currentTime = 0;
      computerStartAudio.pause();
      computerStartAudio.currentTime = 0;

      computerStartAudio.play();
    }
    onNext();
  };

  return (
    <div className="going-back" onClick={handleClick}>
      <div className="bg-layer" style={{ opacity: bgOpacity }} />
      <div className={`bug-hunting ${visible ? "visible" : "hidden"}`}>
        <div
          className={`overlay ${flashOverlay ? "flash" : ""}`}
          style={{ backgroundColor: `rgba(255, 20, 0,${bgOpacity * 0.8})` }}
        >
          <div className="warning">
            원래 시간대로
            <br />
            돌아갑니다.
          </div>
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
      </div>
    </div>
  );
}

export default GoingBack;
