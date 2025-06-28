import { useEffect, useState, useRef } from "react";
import { useAgent } from "../../contexts/AgentContext";

import "../../styles/layout.css";
import "../../styles/transition.css";
import "./mainScreen.css";
import Window from "../../components/Window";
import Buttons from "../../components/Buttons";
import quizData from "../../assets/data/quizzes.json";
import storyData from "../../assets/data/stories.json";

import urdyIcon from "../../assets/images/urdy_icon.png";

// Sound
import error from "../../assets/sounds/error sound.ogg";
import portion from "../../assets/sounds/portion.ogg";
import success from "../../assets/sounds/complete.ogg";
import warning from "../../assets/sounds/warning.ogg";
import computerStart from "../../assets/sounds/computer start.ogg";
import hmm from "../../assets/sounds/hmm.ogg";
import mouseClick from "../../assets/sounds/mouse_click.ogg";

// folder
import activatedImg from "../../assets/images/activated-folder.png";
import inactivatedImg from "../../assets/images/inactivated-folder.png";

// images
import img1 from "../../assets/images/arts/5.png";
import img2 from "../../assets/images/arts/6.png";
import img3 from "../../assets/images/arts/7.png";
import img4 from "../../assets/images/arts/8.png";
import img5 from "../../assets/images/arts/9.png";
import img6 from "../../assets/images/arts/10.png";
import img7 from "../../assets/images/arts/11.png";
import img8 from "../../assets/images/arts/12.png";
import img9 from "../../assets/images/arts/13.png";
import img10 from "../../assets/images/arts/14.png";
import img11 from "../../assets/images/arts/15.png";
import img12 from "../../assets/images/arts/16.png";
import img13 from "../../assets/images/arts/17.png";

const imageMap = {
  img1: img1,
  img2: img2,
  img3: img3,
  img4: img4,
  img5: img5,
  img6: img6,
  img7: img7,
  img8: img8,
  img9: img9,
  img10: img10,
  img11: img11,
  img12: img12,
  img13: img13,
};
function MainScreen({ onNext }) {
  const [fadeIn, setFadeIn] = useState("");
  //const [clickDisabled, setClickDisabled] = useState(false);
  const { setAgent, skippedCount, setSkippedCount } = useAgent();
  const [windows, setWindows] = useState([]);
  const [visibleFolderIndex, setVisibleFolderIndex] = useState(0);
  //const [bugRemovalIndex, setBugRemovalIndex] = useState(0);
  const [solvedLevels, setSolvedLevels] = useState({});
  const [currentLevel, setCurrentLevel] = useState(1);
  // New state for currentChapter
  const [currentChapter, setCurrentChapter] = useState(1);
  const [minesweeperVisible, setMinesweeperVisible] = useState(false);
  const [storyVisible, setStoryVisible] = useState(false);
  const [grid, setGrid] = useState([]);
  const [mineCount, setMineCount] = useState(0);
  const [flagIndex, setFlagIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [quizVisible, setQuizVisible] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentStory, setCurrentStory] = useState(null);
  const [storyIndex, setStoryIndex] = useState(0);
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

  // Toggle state for final icon
  const [finalIconToggle, setFinalIconToggle] = useState(true);

  useEffect(() => {
    if (Object.keys(solvedLevels).length !== 4) return;
    const interval = setInterval(() => {
      setFinalIconToggle((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, [solvedLevels]);

  // Play computer start audio once on mount
  useEffect(() => {
    const audio = new Audio(computerStart);
    audio.loop = false;
    audio.play();
  }, []);

  /*
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
*/
  const screenRef = useRef(null);

  const se_error = new Audio(error);

  /*
  function createWindowContent(label) {
    return {
      title: "UglyWorld in_BUG",
      content: <div>{label} 내용입니다.</div>,
    };
  }*/

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
    /*
    setBugRemovalIndex((prev) =>
      level === 4
        ? bugCount
        : Math.min(prev + Math.floor(bugCount / 8), bugCount)
    );*/
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
    // console.log("Minesweeper 성공!");
    handleMinesweeperSuccess(currentLevel, state);
    setTimeout(() => {
      setShowOverlay(true);
      if (state === "cool") {
        new Audio(success).play();
      } else {
        new Audio(hmm).play();
      }
    }, 50);
  }

  function handleFolderClick(label, level) {
    setShowOverlay(false);
    new Audio(mouseClick).play();
    setCurrentLevel(level);
    setMinesweeperVisible(true);
    setSkippedThisLevel(false); // Reset skippedThisLevel when a new level starts
    setGameState("angry");
    setStoryIndex(0);
    const storyList = storyData.chapters[currentChapter]?.[0];
    if (storyList) {
      setCurrentStory(storyList);
    }
    se_error.play();
    // If opening a window here in the future, play error sound after setWindows
  }

  function handleMinesweeperClose() {
    setShowOverlay(false);
    setMinesweeperVisible(false);
  }

  const [quizOpen, setQuizOpen] = useState(false);

  function handleCellClick(row, col) {
    new Audio(mouseClick).play();

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

          const storyList = storyData.chapters[currentChapter] || [];
          if (storyList.length > 0) {
            setStoryIndex(0);
            setCurrentStory(storyList[0]);
            setStoryVisible(true); // 스토리 먼저
          } else {
            setQuizVisible(true); // 스토리 없으면 바로 퀴즈
          }

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
      const normalizedUserAnswer = quizAnswer.trim().toLowerCase();
      const correctAnswers = Array.isArray(correctAnswer)
        ? correctAnswer
        : [correctAnswer];

      const isCorrect =
        normalizedUserAnswer !== "" &&
        correctAnswers.some(
          (ans) =>
            normalizedUserAnswer.includes(ans.toLowerCase()) ||
            ans.toLowerCase().includes(normalizedUserAnswer)
        );

      if (isCorrect) {
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
        setCurrentChapter((prev) => prev + 1);

        setQuizVisible(false);
      } else {
        setShowWrongMessage(true);
        setWrongAttempts((prev) => {
          const next = prev + 1;
          if (next >= 3) setShowHint(true);
          return next;
        });
      }
    } catch (error) {
      //// console.error("정답 확인 중 오류:", error);
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
    new Audio(mouseClick).play();
    if (warningAudioRef.current) {
      warningAudioRef.current.pause();
      warningAudioRef.current.currentTime = 0;
    }
    onNext();
  }

  // Handler for story back navigation
  function handleStoryBack() {
    if (storyIndex === 0) return;
    const stories = storyData.chapters[currentChapter] || [];
    const prevIndex = storyIndex - 1;
    setStoryIndex(prevIndex);
    setCurrentStory(stories[prevIndex]);
  }

  // Handler for story confirmation
  function handleStoryConfirm() {
    const stories = storyData.chapters[currentChapter] || [];
    const nextIndex = storyIndex + 1;
    if (nextIndex < stories.length) {
      setStoryIndex(nextIndex);
      setCurrentStory(stories[nextIndex]);
    } else {
      setStoryVisible(false);
      setQuizVisible(true);
    }

    // // console.log("Current Chapter:", currentChapter);
  }

  return (
    <div
      className={`main-screen pre-fade ${fadeIn} ${
        Object.keys(solvedLevels).length === 4 ? "bug_background" : ""
      } `}
    >
      <div className={"main-screen__bug-background"}>
        <div className="main-screen__folders">
          {["현대 문물", "SODA POP", "ZERO VIRUS", "두 자아"].map(
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
                          ? "😰"
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
            {finalIconToggle ? (
              "⚠️"
            ) : (
              <img src={urdyIcon} alt="URDY icon" className="urdy-icon" />
            )}
            <span className="final-icon__text">Error</span>
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
                        ? "😰"
                        : "😎"
                      : "😰"}
                  </div>
                  {gameState === "hmm" ? "Anyway CURED" : "CURED"}
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
                      ? "😰"
                      : "😎"
                    : "😰"}
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

        {storyVisible &&
          (storyData.chapters[currentChapter]?.length || 0) > 0 && (
            <Window
              title="UglyWolrd in_BUG"
              onClose={() => setStoryVisible(false)}
              parentRef={screenRef}
            >
              <img
                className="quizImage"
                src={imageMap[currentStory?.image]}
                alt="quiz image"
              />
              <br />
              <div className="story-content">
                <pre>{currentStory?.story}</pre>
                <div className="story-buttons">
                  {storyIndex > 0 && (
                    <Buttons onClick={handleStoryBack}>이전</Buttons>
                  )}
                  <Buttons onClick={handleStoryConfirm}>
                    {storyIndex + 1 <
                    (storyData.chapters[currentChapter]?.length || 0)
                      ? "다음"
                      : "문제"}
                  </Buttons>
                </div>
              </div>
            </Window>
          )}

        {quizVisible && (
          <Window
            title={`${currentQuiz?.title || currentLevel}`}
            onClose={() => setQuizVisible(false)}
            parentRef={screenRef}
          >
            <div className="quiz-content">
              <pre className="quiz-title">{currentQuiz.title} </pre>
              <img
                className="quizImage"
                src={imageMap[currentQuiz?.image]}
                alt="quiz image"
              />
              <br />
              <pre>{currentQuiz.question}</pre>
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
                <Buttons onClick={handleSubmitanswer}>정답</Buttons>
                {wrongAttempts >= 3 && (
                  <>
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
                          // Reveal adjacent cells
                          const dirs = [-1, 0, 1];
                          dirs.forEach((dx) =>
                            dirs.forEach((dy) => {
                              if (dx || dy) {
                                const rx = nx + dx,
                                  ry = ny + dy;
                                if (
                                  updatedGrid[rx]?.[ry] &&
                                  !updatedGrid[rx][ry].mine
                                ) {
                                  updatedGrid[rx][ry].revealed = true;
                                }
                              }
                            })
                          );
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
              </div>
            </div>
          </Window>
        )}
        <div className="main-screen__screen" ref={screenRef}>
          {windows.map(({ id, title, content }) => (
            <div
              key={id}
              onMouseDown={() => {
                setWindows((prev) => {
                  const idx = prev.findIndex((win) => win.id === id);
                  if (idx === -1) return prev;
                  const updated = [...prev];
                  const [win] = updated.splice(idx, 1);
                  return [...updated, win];
                });
              }}
            >
              <Window title={title} onClose={() => handleClose(id)}>
                {content}
              </Window>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainScreen;
