import { useEffect, useState, useRef } from "react";
import "../../styles/layout.css";
import "../../styles/transition.css";
import "./computerScreen.css";
import Window from "../../components/Window";

// Sound
import error from "../../assets/sounds/error sound.mp3";
import shutdown from "../../assets/sounds/shut down.mp3";

function ComputerScreen({ onNext }) {
  const [fadeIn, setFadeIn] = useState("");
  const [visibleCount, setVisibleCount] = useState(0);
  const [clickDisabled, setClickDisabled] = useState(false);
  const se_error = new Audio(error);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFadeIn("fade-in");
    }, 50);

    return () => clearTimeout(timeout);
  }, []);

  // 창 데이터 배열 (필요한 만큼 추가)
  const windows = [
    {
      title: "UglyWorld in_BUG",
      content: (
        <>
          디버깅 요원이십니까? <br />예 / 아니오
        </>
      ),
    },
    {
      title: "UglyWorld in_BUG",
      content: (
        <>
          <div className="start-label">START</div>
          <div className="vaccinate-label">VACCINATE</div>
        </>
      ),
    },
    {
      title: "UglyWorld in_BUG",
      content: (
        <>
          백신 프로그램을 가동합니다. <br />
          강제종료하지 마세요 (잠금화면 포함)
        </>
      ),
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleCount(visibleCount + 1);
      se_error.play();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 클릭할 때마다 한 개씩 창을 표시
  const handleClick = () => {
    if (clickDisabled) return;
    if (visibleCount < windows.length - 1) {
      setVisibleCount(visibleCount + 1);
      se_error.play();
    } else {
      setVisibleCount(visibleCount + 1);
      setClickDisabled(true);
      se_error.play();
      // 모든 창이 보이면, 자동으로 하나씩 제거하는 타이머 시작
      const removeInterval = setInterval(() => {
        setVisibleCount((prevCount) => {
          if (prevCount > 0) {
            return prevCount - 1;
          } else {
            clearInterval(removeInterval);
            // 모든 창이 사라진 후 600ms 딜레이 후 다음 화면 전환
            setTimeout(() => {
              const se_shutdown = new Audio(shutdown);
              se_shutdown.play();
              onNext && onNext();
            }, 100);
            return 0;
          }
        });
      }, 1000); // 1초마다 창 하나씩 제거
    }
  };

  const screenRef = useRef(null);

  return (
    <div className={`mobile computer-screen pre-fade ${fadeIn}`}>
      <div className="screen" ref={screenRef}>
        {windows.slice(0, visibleCount).map((win, index) => (
          <Window
            key={index}
            title={win.title}
            parentRef={screenRef}
            onClick={handleClick}
          >
            {win.content}
          </Window>
        ))}
      </div>
    </div>
  );
}

export default ComputerScreen;
