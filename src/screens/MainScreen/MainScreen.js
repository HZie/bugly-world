import { useEffect, useState, useRef } from "react";
import Minesweeper from "../../components/Minesweeper/Minesweeper";

// 로그인용
import { useAgent } from "../../contexts/AgentContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { hashPassword } from "../../utils/hash";

import "../../styles/layout.css";
import "../../styles/transition.css";
import "./mainScreen.css";
import Window from "../../components/Window";
import Buttons from "../../components/Buttons";

// Sound
import error from "../../assets/sounds/error sound.mp3";
import shutdown from "../../assets/sounds/shut down.mp3";
import Submits from "../../components/Submits";

// folder
import activatedImg from "../../assets/images/activated-folder.png";
import inactivatedImg from "../../assets/images/inactivated-folder.png";

function MainScreen({ onNext }) {
  const [fadeIn, setFadeIn] = useState("");
  const [clickDisabled, setClickDisabled] = useState(false);
  const { setAgent } = useAgent();
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [windows, setWindows] = useState([]);
  const nextWindowId = useRef(0);

  const bugCount = 30;
  const bugs = Array.from({ length: bugCount }, (_, i) => {
    const top = Math.random() * 90; // % 기준
    const left = Math.random() * 90;
    const size = 1.5 + Math.random() * 1.5; // vh 단위 폰트 사이즈

    return (
      <span
        key={i}
        className="main-screen__bug-text"
        style={{
          top: `${top}%`,
          left: `${left}%`,
          fontSize: `${size}vh`,
        }}
      >
        BUG
      </span>
    );
  });

  async function handleLoginSubmit(e) {
    e.preventDefault();
    const hashed = await hashPassword(password);

    const q = query(
      collection(db, "agents"),
      where("passwordHash", "==", hashed)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();
      setAgent({
        id: doc.id,
        progress: data.progress ?? 0,
        passwordHash: hashed,
      });
      setLoginError("");
      handleClick();
    } else {
      setLoginError("요원코드가 올바르지 않습니다.");
      handleClose();
    }
  }

  const screenRef = useRef(null);

  const se_error = new Audio(error);
  const se_shutdown = new Audio(shutdown);

  function createWindowContent(label) {
    return {
      title: "UglyWorld in_BUG",
      content: <div>{label} 내용입니다.</div>,
    };
  }

  useEffect(() => {
    const fadeTimeout = setTimeout(() => {
      setFadeIn("fade-in");
    }, 50);

    return () => {
      clearTimeout(fadeTimeout);
    };
  }, []);

  useEffect(() => {
    if (
      !clickDisabled &&
      windows.length > 0 &&
      windows[windows.length - 1].title === "UglyWorld in_BUG"
    ) {
      setClickDisabled(true);
      se_error.play();
      setTimeout(() => {
        setWindows((prev) => prev.slice(0, -1));
        const removalInterval = setInterval(() => {
          setWindows((prev) => {
            if (prev.length > 0) {
              return prev.slice(0, -1);
            } else {
              clearInterval(removalInterval);
              setTimeout(() => {
                se_shutdown.play();
                //onNext && onNext();
              }, 300);
              return [];
            }
          });
        }, 50);
      }, 1000);
    }
  }, [windows, clickDisabled, onNext]);

  function handleClick() {
    if (clickDisabled) return;
    const id = nextWindowId.current++;
    const { title, content } = createWindowContent("첫 번째 창");
    setWindows((prev) => [...prev, { id, title, content }]);
    se_error.play();
  }

  function handleClose(id) {
    setWindows((prev) => prev.filter((win) => win.id !== id));
  }

  function handleFolderClick(label, level) {
    const id = nextWindowId.current++;
    setWindows((prev) => [
      ...prev,
      {
        id,
        title: "UglyWorld in_BUG",
        content: <Minesweeper level={level} parentRef={screenRef} />,
      },
    ]);
    se_error.play();
  }

  return (
    <div className={`mobile main-screen pre-fade ${fadeIn}`}>
      <div className="main-screen__bug-background">
        {bugs}
        <div className="main-screen__folders">
          {["프로그램 설치파일", "보안패치", "바이러스 샘플", "비밀 로그"].map(
            (label, index) => (
              <div key={index} className="folder-wrapper">
                <button
                  className="folder-button"
                  onClick={() => handleFolderClick(label, index + 1)}
                >
                  <img
                    src={activatedImg}
                    alt="activated folder"
                    className="folder-icon"
                  />
                </button>
                <span>{label}</span>
              </div>
            )
          )}
        </div>
        <div className="main-screen__screen" ref={screenRef}>
          {windows.map(({ id, title, content }) => (
            <Window
              key={id}
              title={title}
              parentRef={screenRef}
              onClose={() => handleClose(id)}
              isActive="active"
            >
              {content}
            </Window>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainScreen;
