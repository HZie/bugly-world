import { useEffect, useState, useRef } from "react";
import Window from "../../components/Window";

// styles
import "../../styles/global.css";
import "../../styles/layout.css";
import "../../styles/typography.css";
import "../../styles/transition.css";
import "./urdyScreen.css";
import Buttons from "../../components/Buttons";

//sound
import start from "../../assets/sounds/computer start.mp3";
import bugSound from "../../assets/sounds/opening bgm.mp3";
import error from "../../assets/sounds/error sound.mp3";

function UrdyScreen({ onNext, audioRef = { current: null } }) {
  const screenRef = useRef(null);
  const [quizWindows, setQuizWindows] = useState([0]);
  const windowIdRef = useRef(1);
  const [answer, setAnswer] = useState("");
  const [isWrong, setIsWrong] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const bugAudioRef = useRef(new Audio(bugSound));
  useEffect(() => {
    bugAudioRef.current.loop = true;
    bugAudioRef.current.play();
    return () => {
      bugAudioRef.current.pause();
      bugAudioRef.current.currentTime = 0;
    };
  }, []);

  const handleClick = () => {
    if (audioRef?.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null; // 다음 재생 대비
    }

    //const se_start = new Audio(start);
    //se_start.play(se_start);
    //onNext();
  };
  useEffect(() => {
    new Audio(error).play();
  }, []);

  return (
    <div
      className="urdy-screen background-glitch"
      onClick={handleClick}
      ref={screenRef}
    >
      {quizWindows.map((id) => (
        <Window
          key={id}
          title="Quiz"
          onClose={() => {
            setSkipped(true);
            new Audio(error).play();
            setQuizWindows((prev) => [...prev, windowIdRef.current++]);
          }}
          parentRef={screenRef}
          className="quiz-window-urdy"
        >
          <div className="quiz-content">
            <p>Q. 버그가 많은 세상을 무엇이라고 부르나요?</p>
            {isWrong && (
              <p style={{ color: "red" }}>오답입니다. 다시 시도해주세요.</p>
            )}
            {skipped && <p style={{ color: "red" }}>건너뛸 수 없습니다.</p>}
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="정답을 입력하세요"
            />
            <div style={{ marginTop: "10px" }}>
              <Buttons
                onClick={() => {
                  if (answer.trim() === "UglyWorld") {
                    setQuizWindows([]);

                    // Stop all audio
                    if (audioRef?.current) {
                      audioRef.current.pause();
                      audioRef.current.currentTime = 0;
                    }
                    if (bugAudioRef?.current) {
                      bugAudioRef.current.pause();
                      bugAudioRef.current.currentTime = 0;
                    }
                    const audios = document.querySelectorAll("audio");
                    audios.forEach((audio) => {
                      audio.pause();
                      audio.currentTime = 0;
                    });

                    onNext();
                  } else {
                    setIsWrong(true);
                  }
                }}
              >
                제출
              </Buttons>
              <Buttons
                onClick={() => {
                  setSkipped(true);
                  new Audio(error).play();
                  setQuizWindows((prev) => [...prev, windowIdRef.current++]);
                }}
                style={{ marginLeft: "10px" }}
              >
                건너뛰기
              </Buttons>
            </div>
          </div>
        </Window>
      ))}
    </div>
  );
}

export default UrdyScreen;
