import { useEffect, useState } from "react";

import { useAgent } from "../../contexts/AgentContext";

import "./vaccineScreen.css";
import "../../styles/global.css";
import "../../styles/layout.css";
import "../../styles/typography.css";

const TARGET_TIME = new Date("2000-01-01T00:00:00");

function VaccineScreen({ onNext }) {
  const { agent } = useAgent();
  // 시간 표시
  const [time, setTime] = useState(new Date());
  // 시간 팍 뜨게 하기
  const [visible, setVisible] = useState(false);
  const [bgOpacity, setBgOpacity] = useState(0);

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
      setTime((prev) => {
        const next = new Date(prev.getTime() - 1000 * frame); // 1초 감소
        if (next <= TARGET_TIME) {
          //onNext && onNext();
          clearTimeout(timeoutId);
          return TARGET_TIME;
        }

        return next;
      });
      console.log("hi");
      // 호출 간격 줄이기
      frame = frame * 1.05;
      delay = delay / frame;
      timeoutId = setTimeout(tick, delay);
    };
    timeoutId = setTimeout(tick, delay);

    return () => clearTimeout(timeoutId);
  }, [visible, onNext]);

  useEffect(() => {
    if (!visible) return;

    const start = Date.now();
    const fixedDuration = 3500; // 💡 5초 동안 opacity 0 → 1

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - start;
      const progress = Math.min(elapsed / fixedDuration, 0.9);

      setBgOpacity(progress);

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
    onNext();
  };

  return (
    <div className="vaccineScreen" onClick={handleClick}>
      <div className="bg-layer" style={{ opacity: bgOpacity }} />
      <div className={`bug-hunting ${visible ? "visible" : "hidden"}`}>
        <div
          className="overlay"
          style={{ backgroundColor: `rgba(255, 20, 0,${bgOpacity * 0.5})` }}
        >
          <div className="warning">버그 추적 중</div>
          <div className="date">{formattedDate}</div>
          <div className="time">
            <span className="hoursMinutes">{hoursMinutes}</span>
            <span className="seconds"> {seconds}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VaccineScreen;
