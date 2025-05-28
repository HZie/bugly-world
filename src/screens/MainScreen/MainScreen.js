import { useEffect, useState, useRef } from "react";
import { useAgent } from "../../contexts/AgentContext";

import "../../styles/layout.css";
import "../../styles/transition.css";
import "./mainScreen.css";
import Window from "../../components/Window";
import Buttons from "../../components/Buttons";
import quizData from "../../assets/data/quizzes.json";

// Sound
import error from "../../assets/sounds/error sound.ogg";
import portion from "../../assets/sounds/portion.ogg";
import success from "../../assets/sounds/complete.ogg";
import warning from "../../assets/sounds/warning.ogg";

// folder
import activatedImg from "../../assets/images/activated-folder.png";
import inactivatedImg from "../../assets/images/inactivated-folder.png";

function MainScreen({ onNext }) {
  const [fadeIn, setFadeIn] = useState("");
  const [clickDisabled, setClickDisabled] = useState(false);
  const { setAgent, skippedCount, setSkippedCount } = useAgent();
  const [windows, setWindows] = useState([]);
  const [visibleFolderIndex, setVisibleFolderIndex] = useState(0);
  const [bugRemovalIndex, setBugRemovalIndex] = useState(0);
  const [solvedLevels, setSolvedLevels] = useState({});
  const [currentLevel, setCurrentLevel] = useState(1);
  const [minesweeperVisible, setMinesweeperVisible] = useState(false);
  const [grid, setGrid] = useState([]);
  const [mineCount, setMineCount] = useState(0);
  const [flagIndex, setFlagIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [quizVisible, setQuizVisible] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [showWrongMessage, setShowWrongMessage] = useState(false);
  const [gameState, setGameState] = useState("angry");
  const [skippedFlags, setSkippedFlags] = useState([]);
  const [skippedThisLevel, setSkippedThisLevel] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const mineOrderRef = useRef([]);
  const nextWindowId = useRef(0);
  // Overlay state
  const [showOverlay, setShowOverlay] = useState(false);
  // Ref for warning audio
  const warningAudioRef = useRef(null);

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

  const screenRef = useRef(null);

  const se_error = new Audio(error);

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
    if (!minesweeperVisible) return;

    const size = currentLevel + 2;
    const mines = currentLevel;
    setMineCount(mines);

    const newGrid = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => ({
        revealed: false,
        mine: false,
        flagged: false,
        cleared: false,
        adjacentMines: 0,
      }))
    );

    const allCells = [];
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        allCells.push([i, j]);
      }
    }
    const shuffled = allCells.sort(() => 0.5 - Math.random()).slice(0, mines);
    mineOrderRef.current = shuffled;
    setFlagIndex(0);

    mineOrderRef.current.forEach(([x, y]) => {
      newGrid[x][y].mine = true;
    });

    const dirs = [-1, 0, 1];
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (newGrid[x][y].mine) continue;
        let count = 0;
        dirs.forEach((dx) => {
          dirs.forEach((dy) => {
            if (dx === 0 && dy === 0) return;
            const nx = x + dx;
            const ny = y + dy;
            if (
              nx >= 0 &&
              ny >= 0 &&
              nx < size &&
              ny < size &&
              newGrid[nx][ny].mine
            ) {
              count++;
            }
          });
        });
        newGrid[x][y].adjacentMines = count;
      }
    }

    const [fx, fy] = mineOrderRef.current[0];
    newGrid[fx][fy].flagged = true;
    dirs.forEach((dx) =>
      dirs.forEach((dy) => {
        if (dx || dy) {
          const nx = fx + dx,
            ny = fy + dy;
          if (newGrid[nx]?.[ny] && !newGrid[nx][ny].mine) {
            newGrid[nx][ny].revealed = true;
          }
        }
      })
    );

    setGrid(newGrid);
  }, [minesweeperVisible, currentLevel]);

  function handleClose(id) {
    setWindows((prev) => prev.filter((win) => win.id !== id));
  }

  function handleMinesweeperSuccess(level, resultState) {
    setBugRemovalIndex((prev) =>
      level === 4
        ? bugCount
        : Math.min(prev + Math.floor(bugCount / 8), bugCount)
    );
    setVisibleFolderIndex((prev) => Math.max(prev, level));

    // If this level was skipped at any point, always record "hmm"
    const finalState = skippedThisLevel ? "hmm" : resultState;

    setSolvedLevels((prev) => {
      if (prev[level]) {
        setGameState(prev[level]); // restore previous state
        return prev;
      }
      setGameState(finalState);
      return {
        ...prev,
        [level]: finalState,
      };
    });

    // Update agent state after solvedLevels update
    const allStates = Object.values({ ...solvedLevels, [level]: finalState });
    if (allStates.includes("hmm")) {
      localStorage.setItem("quizState", "hmm");
    } else if (allStates.length === 4 && allStates.every((s) => s === "cool")) {
      localStorage.setItem("quizState", "cool");
    }
  }

  function onSuccess(state) {
    console.log("Minesweeper 성공!");
    handleMinesweeperSuccess(currentLevel, state);
    setTimeout(() => {
      setShowOverlay(true);
      new Audio(success).play();
    }, 50);
  }

  function handleFolderClick(label, level) {
    setShowOverlay(false);
    setCurrentLevel(level);
    setMinesweeperVisible(true);
    setSkippedThisLevel(false); // Reset skippedThisLevel when a new level starts
    setGameState("angry");
    se_error.play();
    // If opening a window here in the future, play error sound after setWindows
  }

  function handleMinesweeperClose() {
    setShowOverlay(false);
    setMinesweeperVisible(false);
  }

  const [quizOpen, setQuizOpen] = useState(false);

  function handleCellClick(row, col) {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r) => r.map((c) => ({ ...c })));
      const clickedCell = newGrid[row][col];

      if (clickedCell.flagged && !clickedCell.cleared) {
        const levelQuizzes = quizData.levels[currentLevel];
        if (levelQuizzes && levelQuizzes.length > 0) {
          setCurrentQuiz(levelQuizzes[flagIndex % levelQuizzes.length]);
          setShowWrongMessage(false);
          setWrongAttempts(0);
          setShowHint(false); // Reset state
          setQuizVisible(true); // 퀴즈 모달 열기
          if (wrongAttempts >= 3) setShowHint(true);
          se_error.play();
        } else {
          alert("퀴즈 데이터를 찾을 수 없습니다.");
        }
      }

      return newGrid;
    });
  }

  const handleSubmitanswer = async () => {
    const dirs = [-1, 0, 1];
    try {
      const levelQuizzes = quizData.levels[currentLevel]; // 레벨에 해당하는 퀴즈 배열 가져오기
      if (!levelQuizzes || levelQuizzes.length === 0) {
        alert("문제 데이터를 찾을 수 없습니다.");
        return;
      }

      const currentQuiz = levelQuizzes[flagIndex % levelQuizzes.length]; // 현재 퀴즈 선택
      const correctAnswer = currentQuiz.answer;

      if (quizAnswer.trim() === correctAnswer) {
        setShowWrongMessage(false);
        setGrid((prev) => {
          const newGrid = prev.map((r) => r.map((c) => ({ ...c })));
          const [cx, cy] = mineOrderRef.current[flagIndex];
          newGrid[cx][cy].cleared = true;
          newGrid[cx][cy].revealed = true;
          newGrid[cx][cy].flagged = false;
          newGrid[cx][cy].potion = true;
          new Audio(portion).play();

          dirs.forEach((dx) =>
            dirs.forEach((dy) => {
              if (dx || dy) {
                const nx = cx + dx,
                  ny = cy + dy;
                if (newGrid[nx]?.[ny] && !newGrid[nx][ny].mine) {
                  newGrid[nx][ny].revealed = true;
                }
              }
            })
          );

          const nextIndex = flagIndex + 1;
          if (nextIndex < mineOrderRef.current.length) {
            const [nx, ny] = mineOrderRef.current[nextIndex];
            newGrid[nx][ny].flagged = true;
            dirs.forEach((dx) =>
              dirs.forEach((dy) => {
                if (dx || dy) {
                  const rx = nx + dx,
                    ry = ny + dy;
                  if (newGrid[rx]?.[ry] && !newGrid[rx][ry].mine) {
                    newGrid[rx][ry].revealed = true;
                  }
                }
              })
            );
          }
          return newGrid;
        });
        setFlagIndex((i) => i + 1);
        if (flagIndex + 1 === mineOrderRef.current.length) {
          onSuccess("cool");
        }
        setQuizVisible(false); // 퀴즈 모달 자동 닫기
      } else {
        setShowWrongMessage(true);
        setWrongAttempts((prev) => {
          const next = prev + 1;
          if (next >= 3) setShowHint(true);
          return next;
        });
      }
    } catch (error) {
      console.error("정답 확인 중 오류:", error);
    } finally {
      setQuizAnswer("");
    }
  };

  // Play warning sound when all levels are solved
  useEffect(() => {
    if (Object.keys(solvedLevels).length === 4) {
      const audio = new Audio(warning);
      warningAudioRef.current = audio;
      audio.play();
    }
  }, [solvedLevels]);

  // Handler for final icon click: stops audio and proceeds
  function handleFinalIconClick() {
    if (warningAudioRef.current) {
      warningAudioRef.current.pause();
      warningAudioRef.current.currentTime = 0;
    }
    onNext();
  }

  return (
    <div className={`main-screen pre-fade ${fadeIn}`}>
      <div className="main-screen__bug-background">
        {bugs}
        <div className="main-screen__folders">
          {["시간여행", "우주여행", "지구여행", "바다여행"].map(
            (label, index) => {
              const isActive = index <= visibleFolderIndex;
              const status = solvedLevels[index + 1];
              return (
                <div key={index} className="folder-wrapper">
                  <button
                    className="folder-button"
                    onClick={() =>
                      isActive && !status && handleFolderClick(label, index + 1)
                    }
                    disabled={!isActive || status}
                  >
                    <img
                      src={isActive ? activatedImg : inactivatedImg}
                      alt={`${label} folder`}
                      className="folder-icon"
                    />
                    {status && (
                      <span className="cool-icon">
                        {status === "cool"
                          ? "😎"
                          : status === "hmm"
                          ? "😐"
                          : ""}
                      </span>
                    )}
                  </button>
                  <span>{label}</span>
                </div>
              );
            }
          )}
        </div>
        {Object.keys(solvedLevels).length === 4 && (
          <div className="final-icon" onClick={handleFinalIconClick}>
            ⚠️
          </div>
        )}
        {minesweeperVisible && (
          <Window
            title={`Minesweeper Level ${currentLevel}`}
            onClose={handleMinesweeperClose}
            parentRef={screenRef}
          >
            <div className="minesweeper">
              {showOverlay && (
                <div className="cured overlay">
                  <div className="cured-icon" onClick={handleMinesweeperClose}>
                    {gameState === "angry"
                      ? "😡"
                      : gameState === "cool"
                      ? skippedThisLevel
                        ? "😐"
                        : "😎"
                      : "😐"}
                  </div>
                  CURED
                </div>
              )}
              <span className="minesweeper-header">
                <div className="number">Lvl {currentLevel}</div>
                <div
                  className="minesweeper-icon"
                  onClick={() => {
                    if (gameState === "angry") {
                      setResetKey((k) => k + 1);
                      setWrongAttempts(0);
                      setShowHint(false);
                    } else if (gameState === "cool" || gameState === "hmm") {
                      handleMinesweeperClose();
                    }
                  }}
                >
                  {gameState === "angry"
                    ? "😡"
                    : gameState === "cool"
                    ? skippedThisLevel
                      ? "😐"
                      : "😎"
                    : "😐"}
                </div>
                <div className="number">0 0 {mineCount}</div>
              </span>
              <div className="minesweeper-wrapper">
                <div
                  className="minesweeper-grid"
                  style={{ "--cols": grid.length, "--rows": grid.length }}
                >
                  {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`minesweeper-cell 
              ${cell.revealed ? "revealed" : ""}
              ${cell.flagged ? "flagged" : ""}
              ${
                cell.revealed && (cell.cleared || cell.adjacentMines > 0)
                  ? "sunken"
                  : "raised"
              }`}
                        data-value={
                          cell.adjacentMines > 0 ? cell.adjacentMines : ""
                        }
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                      >
                        {cell.revealed
                          ? cell.cleared
                            ? "🧪"
                            : cell.mine
                            ? "💣"
                            : cell.adjacentMines > 0
                            ? cell.adjacentMines
                            : ""
                          : skippedFlags.includes(`${rowIndex}-${colIndex}`)
                          ? ""
                          : cell.flagged
                          ? ""
                          : ""}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </Window>
        )}
        {quizVisible && (
          <Window
            title="Quiz"
            onClose={() => setQuizVisible(false)}
            parentRef={screenRef}
          >
            <div className="quiz-content">
              <span>{currentQuiz.question}</span>
              {showWrongMessage && (
                <div style={{ color: "red", marginTop: "5px" }}>틀렸습니다</div>
              )}
              <input
                type="text"
                value={quizAnswer}
                onChange={(e) => setQuizAnswer(e.target.value)}
                className="quiz-answer-input"
                placeholder="정답을 입력하세요"
              />
              <div className="quiz-buttons">
                <Buttons onClick={handleSubmitanswer}>제출</Buttons>
                {wrongAttempts >= 3 && (
                  <>
                    <div className="quiz-hint">
                      힌트: {currentQuiz && currentQuiz.hint}
                    </div>
                    <Buttons
                      onClick={() => {
                        // 먼저 퀴즈 모달 닫기 상태 처리
                        setQuizVisible(false);
                        setQuizOpen(false);

                        let didSkip = false;
                        const updatedGrid = grid.map((row, i) =>
                          row.map((cell, j) => {
                            if (!didSkip && cell.flagged && !cell.cleared) {
                              didSkip = true;
                              setSkippedFlags((prev) => [...prev, `${i}-${j}`]);
                              setGameState("hmm");
                              setSkippedThisLevel(true);
                              new Audio(portion).play();
                              if (setSkippedCount)
                                setSkippedCount((prev) => prev + 1);
                              return {
                                ...cell,
                                flagged: false,
                                cleared: true,
                                revealed: true,
                              };
                            }
                            return cell;
                          })
                        );

                        // 다음 퀴즈로 넘어가기 및 flagging
                        const nextIndex = flagIndex + 1;
                        if (nextIndex < mineOrderRef.current.length) {
                          const [nx, ny] = mineOrderRef.current[nextIndex];
                          updatedGrid[nx][ny].flagged = true;
                          // Don't setCurrentQuiz, setWrongAttempts, setShowHint here (no preloading quiz)
                        } else {
                          onSuccess("hmm");
                          // setQuizVisible and setQuizOpen already called above
                        }

                        setGrid(updatedGrid);
                        setFlagIndex((i) => i + 1);
                        // If opening a window here, play error sound after setWindows
                      }}
                    >
                      퀴즈 넘어가기
                    </Buttons>
                  </>
                )}
                <Buttons
                  onClick={() => setQuizVisible(false)}
                  className="quiz-close-button"
                >
                  닫기
                </Buttons>
              </div>
            </div>
          </Window>
        )}
        <div className="main-screen__screen" ref={screenRef}>
          {windows.map(({ id, title, content }) => (
            <Window key={id} title={title} onClose={() => handleClose(id)}>
              {content}
            </Window>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainScreen;
