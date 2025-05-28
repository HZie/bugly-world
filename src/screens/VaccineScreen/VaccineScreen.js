import { useEffect, useState, useRef } from "react";

import { useAgent } from "../../contexts/AgentContext";

import "./vaccineScreen.css";
import "../../styles/global.css";
import "../../styles/layout.css";
import "../../styles/typography.css";
import warning from "../../assets/sounds/warning.ogg";
import chasing from "../../assets/sounds/chasing.ogg";
import computerStart from "../../assets/sounds/computer start.ogg";

const chasingAudio = new Audio(chasing);

const TARGET_TIME = new Date("2000-01-01T00:00:00");

const warningAudio = new Audio(warning);
const computerStartAudio = new Audio(computerStart);
computerStartAudio.loop = false;

function VaccineScreen({ onNext }) {
  const { agent } = useAgent();
  //console.log(agent);
  // 시간 표시
  const [time, setTime] = useState(new Date());
  // 시간 팍 뜨게 하기
  const [visible, setVisible] = useState(false);
  const [bgOpacity, setBgOpacity] = useState(0);
  const [accessGranted, setAccessGranted] = useState(false);
  const [flashOverlay, setFlashOverlay] = useState(false);
  const audioPlayedRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const startTimestamp = performance.now();
    const initialTime = new Date();

    audioPlayedRef.current = false; // reset on each effect run

    const tick = (now) => {
      const elapsed = now - startTimestamp;

      const acceleration = 1.03;
      const power = elapsed / 10;
      const acceleratedElapsed = (Math.pow(acceleration, power) - 1) * 1000;
      const nextTime = new Date(initialTime.getTime() - acceleratedElapsed);

      if (!audioPlayedRef.current) {
        chasingAudio.play();
        audioPlayedRef.current = true;
      }

      const progress = elapsed / 13000;
      setBgOpacity(Math.min(progress, 0.9));

      if (nextTime <= TARGET_TIME) {
        chasingAudio.pause();
        chasingAudio.currentTime = 0;
        warningAudio.play();
        setTime(TARGET_TIME);
        setAccessGranted(true);
        setFlashOverlay(true);
        return;
      }

      setTime(nextTime);
      requestAnimationFrame(tick);
    };

    const frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      warningAudio.pause();
      warningAudio.currentTime = 0;
    };
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
      onNext();
    }
  };

  return (
    <div className="vaccineScreen" onClick={handleClick}>
      <div className="bg-layer" style={{ opacity: bgOpacity }} />
      <div className={`bug-hunting ${visible ? "visible" : "hidden"}`}>
        <div
          className={`overlay ${flashOverlay ? "flash" : ""}`}
          style={{ backgroundColor: `rgba(255, 20, 0,${bgOpacity * 0.8})` }}
        >
          <div className="warning">버그 추적 중</div>
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
        {accessGranted && (
          <div className="access__message">
            요원에게 권한을 부여합니다.
            <br />
            웜홀로 입장해주십시오.
          </div>
        )}
      </div>
    </div>
  );
}

export default VaccineScreen;
