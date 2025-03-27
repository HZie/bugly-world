import { useEffect, useState, useRef } from "react";
import "../../styles/layout.css";
import "../../styles/transition.css";
import "./computerScreen.css";
import Window from "../../components/Window";
import Buttons from "../../components/Buttons";

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

      // 1) 첫 번째 창만 천천히 제거
      setTimeout(() => {
        setVisibleCount((prevCount) => {
          // 혹시 아직 창이 남아있다면 하나 제거
          if (prevCount > 0) {
            se_error.play();
            return prevCount - 1;
          }
          return 0;
        });

        // 2) 그 다음부터는 빠른 간격으로 제거
        const removeInterval = setInterval(() => {
          setVisibleCount((prevCount) => {
            if (prevCount > 0) {
              //se_error.play();
              return prevCount - 1;
            } else {
              clearInterval(removeInterval);
              // 모든 창이 사라진 후 처리
              setTimeout(() => {
                const se_shutdown = new Audio(shutdown);
                se_shutdown.play();
                onNext && onNext();
              }, 300);
              return 0;
            }
          });
        }, 50); // 빠른 간격 (100ms)
      }, 1000); // 첫 번째 창 제거는 1초 후 (천천히)
    }
  };

  // 창 데이터 배열 (필요한 만큼 추가)
  const windows = [
    {
      title: "UglyWorld in_BUG",
      content: (
        <>
          <span>요원이십니까?</span>
          <div>
            <Buttons onClick={handleClick}>예</Buttons>
            <Buttons>아니오</Buttons>
          </div>
        </>
      ),
    },
    {
      title: "UglyWorld in_BUG",
      content: (
        <>
          <button className="vaccine-alert" onClick={handleClick}>
            <div className="vaccine-alert__start">START</div>
            <div className="vaccine-alert__vaccinate">VACCINATE</div>
          </button>
        </>
      ),
    },
    {
      title: "UglyWorld in_BUG",
      content: (
        <>
          백신 프로그램을 가동합니다. <br />
          강제종료하지 마세요.
          <br />
          (잠금화면 포함)
        </>
      ),
    },
  ];

  const screenRef = useRef(null);

  return (
    <div className={`mobile computer-screen pre-fade ${fadeIn}`}>
      <div className="screen" ref={screenRef}>
        {windows.slice(0, visibleCount).map((win, index) => (
          <Window key={index} title={win.title} parentRef={screenRef}>
            {win.content}
          </Window>
        ))}
      </div>
    </div>
  );
}

export default ComputerScreen;
