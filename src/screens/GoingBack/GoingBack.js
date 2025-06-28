import { useEffect, useState, useRef } from "react";

import { useAgent } from "../../contexts/AgentContext";

import "./goingBack.css";
import "../../styles/global.css";
import "../../styles/layout.css";
import "../../styles/typography.css";
import warning from "../../assets/sounds/warning.ogg";
import chasing from "../../assets/sounds/chasing.ogg";
import computerStart from "../../assets/sounds/computer start.ogg";
import ding from "../../assets/sounds/elevator-ding.ogg";

const chasingAudio = new Audio(chasing);

const TARGET_TIME = new Date();

const dingAudio = new Audio(ding);
let dingUnlocked = false;
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

  // Ref to prevent audio from playing multiple times
  const audioPlayedRef = useRef(false);

  useEffect(() => {
    if (!visible) return;

    const startTimestamp = performance.now();
    const initialTime = new Date(time.getTime());

    audioPlayedRef.current = false; // reset on each effect run

    // 점점 빠르게 시간 흐름이 가속되는 tick 함수
    const tick = (now) => {
      const elapsed = now - startTimestamp;
      // 프레임마다 속도가 증가하도록 가속 로직 적용
      // 예: 시간 흐름 = elapsed^가속도계수 (2 이상이면 점점 더 빠름)
      // 또는, 누적된 시간에 대해 지수적으로 증가
      // 아래는 1.015^(elapsed/10)로 가속 (튜닝 가능)
      const acceleration = 1.03; // 가속 계수 (조정 가능)
      const power = elapsed / 10; // 분모가 작을수록 더 빠름
      const acceleratedElapsed = (Math.pow(acceleration, power) - 1) * 1000; // 0에서 시작, 점점 빨라짐
      const nextTime = new Date(initialTime.getTime() + acceleratedElapsed);

      if (!audioPlayedRef.current) {
        chasingAudio.play();
        audioPlayedRef.current = true;
      }

      if (nextTime >= TARGET_TIME) {
        chasingAudio.pause();
        chasingAudio.currentTime = 0;
        if (!dingUnlocked) {
          dingAudio
            .play()
            .then(() => {
              dingUnlocked = true;
            })
            .catch(() => {});
        } else {
          if (!dingAudio.paused) {
            dingAudio.pause();
            dingAudio.currentTime = 0;
          }
          dingAudio.play().catch(() => {});
        }
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
      if (!dingAudio.paused) {
        dingAudio.pause();
        dingAudio.currentTime = 0;
      }
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
    if (!dingUnlocked) {
      dingAudio
        .play()
        .then(() => {
          dingUnlocked = true;
        })
        .catch(() => {});
    }

    if (accessGranted) {
      if (!dingAudio.paused) {
        dingAudio.pause();
        dingAudio.currentTime = 0;
      }
      dingAudio.play().catch(() => {});
      chasingAudio.pause();
      chasingAudio.currentTime = 0;
      computerStartAudio.pause();
      computerStartAudio.currentTime = 0;

      computerStartAudio.play();
    }
    onNext();
  };

  return (
    <div
      className="going-back"
      onClick={(e) => {
        if (accessGranted) handleClick(e);
        else e.stopPropagation();
      }}
      style={{ pointerEvents: accessGranted ? "auto" : "none" }}
    >
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
