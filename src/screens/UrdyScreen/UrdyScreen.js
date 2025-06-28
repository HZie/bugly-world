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
import start from "../../assets/sounds/computer start.ogg";
import bugSound from "../../assets/sounds/opening bgm.ogg";
import error from "../../assets/sounds/error sound.ogg";

import urdy from "../../assets/images/arts/18.png";

function UrdyScreen({ onNext, audioRef = { current: null } }) {
  const screenRef = useRef(null);
  const [windowIndices, setWindowIndices] = useState([0]);
  const windowIdRef = useRef(1);
  const [answer, setAnswer] = useState("");
  const [isWrong, setIsWrong] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const bugAudioRef = useRef(new Audio(bugSound));

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

  const handleBefore = (index) => {
    setWindowIndices((prev) => prev.filter((i) => i !== index));
  };

  const handleClose = (index) => {
    setSkipped(true);
    new Audio(error).play();
    setWindowIndices((prev) => [...prev, windowIdRef.current++]);
  };

  const handleNext = () => {
    setWindowIndices((prev) => [...prev, windowIdRef.current++]);
  };

  const defaultWindows = [
    {
      title: "UglyWorld in_BUG",
      content: (
        <>
          <img className="one_arts" src={urdy} alt="urdy" />
          <span>
            [화면에 보이는 그림 앞으로
            <br />
            이동해 주세요]
          </span>
          <div>
            <Buttons onClick={handleNext}>다음</Buttons>
          </div>
        </>
      ),
    },
    {
      title: "UglyWorld in_BUG",
      content: (
        <>
          <img className="one_arts" src={urdy} alt="urdy" />
          <span>
            BUG를 만든 핵심 오류를 찾았습니다. 그것은 저의 다른 그림자
            자아였습니다.
          </span>
          <div className="urdy__story-buttons">
            <Buttons onClick={handleBefore}>이전</Buttons>
            <Buttons onClick={handleNext}>다음</Buttons>
          </div>
        </>
      ),
    },
    {
      title: "UglyWorld in_BUG",
      content: (
        <>
          <img className="one_arts" src={urdy} alt="urdy" />
          <span>
            존재를 잊어버려 이쪽저쪽으로 날뛰며 BUG 세계를 점점 더 불안하게
            만들고 있습니다.
          </span>
          <div className="urdy__story-buttons">
            <Buttons onClick={handleBefore}>이전</Buttons>
            <Buttons onClick={handleNext}>다음</Buttons>
          </div>
        </>
      ),
    },
    {
      title: "UglyWorld in_BUG",
      content: (
        <>
          <img className="one_arts" src={urdy} alt="urdy" />
          <span>이 존재의 이름을 찾아주세요. </span>
          <div className="urdy__story-buttons">
            <Buttons onClick={handleBefore}>이전</Buttons>
            <Buttons onClick={handleNext}>다음</Buttons>
          </div>
        </>
      ),
    },
    {
      title: "Final Mission",
      content: (
        <>
          <p>
            어디로 튈지 모른다는 뜻의
            <br />이 버그의 이름은 무엇인가요?
          </p>
          {isWrong && (
            <p style={{ color: "red" }}>오답입니다. 다시 시도해주세요.</p>
          )}
          {skipped && <p style={{ color: "red" }}>건너뛸 수 없습니다.</p>}
          <input
            type="text"
            value={answer}
            className="urdy-input"
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="정답을 입력하세요"
          />
          <div style={{ marginTop: "10px" }}>
            <Buttons
              onClick={() => {
                if (
                  answer.trim() === "어디" ||
                  answer.toLowerCase().trim() === "urdy"
                ) {
                  setWindowIndices([]);

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
                setWindowIndices((prev) => [...prev, windowIdRef.current++]);
              }}
              style={{ marginLeft: "10px" }}
            >
              건너뛰기
            </Buttons>
          </div>
        </>
      ),
    },
  ];

  useEffect(() => {
    bugAudioRef.current.loop = true;
    bugAudioRef.current.play();
    return () => {
      bugAudioRef.current.pause();
      bugAudioRef.current.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    new Audio(error).play();
  }, []);
  return (
    <div
      className="urdy-screen background-glitch"
      onClick={handleClick}
      ref={screenRef}
    >
      {windowIndices.map((index) => {
        const windowData = defaultWindows[index];
        return (
          <Window
            key={index}
            title={windowData.title}
            onClose={() => handleClose(index)}
            parentRef={screenRef}
            className="quiz-window-urdy"
          >
            <div className="quiz-content">{windowData.content}</div>
          </Window>
        );
      })}
    </div>
  );
}

export default UrdyScreen;
