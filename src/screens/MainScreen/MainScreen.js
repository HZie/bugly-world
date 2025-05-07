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
  const { setAgent, skippedCount, setSkippedCount } = useAgent();
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [windows, setWindows] = useState([]);
  const nextWindowId = useRef(0);
  const [visibleFolderIndex, setVisibleFolderIndex] = useState(0);
  const [bugRemovalIndex, setBugRemovalIndex] = useState(0);
  const [solvedLevels, setSolvedLevels] = useState([]);

  const bugCount = 150;
  const bugDataRef = useRef(
    Array.from({ length: bugCount }, () => ({
      top: Math.random() * 90,
      left: Math.random() * 90,
      size: 1.5 + Math.random() * 1.5,
    }))
  );

  const bugs = bugDataRef.current
    .map((data, i) => {
      if (i < bugRemovalIndex) return null;
      return (
        <span
          key={i}
          className="main-screen__bug-text"
          style={{
            top: `${data.top}%`,
            left: `${data.left}%`,
            fontSize: `${data.size}vh`,
          }}
        >
          BUG
        </span>
      );
    })
    .filter(Boolean);

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

  function handleMinesweeperSuccess(level) {
    setBugRemovalIndex((prev) =>
      level === 4
        ? bugCount
        : Math.min(prev + Math.floor(bugCount / 8), bugCount)
    );
    setSolvedLevels((prev) => [...new Set([...prev, level])]);
    setVisibleFolderIndex((prev) => Math.max(prev, level));
  }

  function handleFolderClick(label, level) {
    const id = nextWindowId.current++;
    const isSolved = solvedLevels.includes(level);
    setWindows((prev) => [
      ...prev,
      {
        id,
        title: "Minesweeper",
        content: (
          <Minesweeper
            level={level}
            parentRef={screenRef}
            onSelfClose={() => handleClose(id)}
            onSuccess={() => handleMinesweeperSuccess(level)}
            onSkipSuccess={() => handleMinesweeperSuccess(level)}
            solved={isSolved}
            skippedCount={skippedCount}
            setSkippedCount={setSkippedCount}
          />
        ),
      },
    ]);
    se_error.play();
  }

  return (
    <div className={`mobile main-screen pre-fade ${fadeIn}`}>
      <div className="main-screen__bug-background">
        {bugs}
        <div className="main-screen__folders">
          {["시간여행", "우주여행", "지구여행", "바다여행"].map(
            (label, index) => {
              const isActive = index <= visibleFolderIndex;
              const isSolved = solvedLevels.includes(index + 1); // 해당 레벨이 해결되었는지 확인
              return (
                <div key={index} className="folder-wrapper">
                  <button
                    className="folder-button"
                    onClick={() =>
                      isActive && handleFolderClick(label, index + 1)
                    }
                    disabled={!isActive}
                  >
                    <img
                      src={isActive ? activatedImg : inactivatedImg}
                      alt={`${label} folder`}
                      className="folder-icon"
                    />
                    {isSolved && <span className="cool-icon">😎</span>}{" "}
                    {/* cool-icon 추가 */}
                  </button>
                  <span onClick={onNext}>{label}</span>
                </div>
              );
            }
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
