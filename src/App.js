import { useEffect, useState } from "react";
import styles from "./App.module.css";
import backgroundImage from "./assets/urdy.png";

function App() {
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
      className={styles.mobile}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={styles.overlay}>
        <div className={styles.warning}>밀레니엄 버그 발견</div>
        <div className={styles.date}>{formattedDate}</div>
        <div className={styles.time}>
          <span className={styles.hoursMinutes}>{hoursMinutes}</span>
          <span className={styles.seconds}> {seconds}</span>
        </div>
      </div>
      <div className={styles.bug}>
        <span className={styles.bugTitle}>VIRUS</span>
        <span className={styles.bugName}>URDY</span>
      </div>
    </div>
  );
}

export default App;
