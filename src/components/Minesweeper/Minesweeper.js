import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState, useRef } from "react";
import Window from "../Window";
import Buttons from "../Buttons";
import "./minesweeper.css";
import quizData from "../../assets/data/quizzes.json";

function Minesweeper({ level = 1, onCorrect, onClose }) {
  const mineOrderRef = useRef([]);
  const [flagIndex, setFlagIndex] = useState(0);

  const [grid, setGrid] = useState([]);
  const [mineCount, setMineCount] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [skippedFlags, setSkippedFlags] = useState([]);
  const [resetKey, setResetKey] = useState(0);
  const [gameState, setGameState] = useState("angry"); // "angry" or "cool"

  const handleSubmitanswer = async () => {
    const dirs = [-1, 0, 1];
    try {
      const data = quizData[level];
      if (data) {
        const correctAnswer = data.answer;

        if (quizAnswer.trim() === correctAnswer) {
          setGrid((prev) => {
            const newGrid = prev.map((r) => r.map((c) => ({ ...c })));
            // clear current flagged
            const [cx, cy] = mineOrderRef.current[flagIndex];
            newGrid[cx][cy].cleared = true;
            newGrid[cx][cy].revealed = true;
            newGrid[cx][cy].flagged = false;
            // reveal neighbors
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
            // flag next mine if exists
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
          // advance flagIndex
          setFlagIndex((i) => i + 1);
          setQuizOpen(false);
          onCorrect && onCorrect();
        } else {
          setWrongAttempts((prev) => {
            const next = prev + 1;
            if (next >= 3) setShowHint(true);
            return next;
          });
          alert("틀렸습니다!");
        }
      } else {
        alert("문제 데이터를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("정답 확인 중 오류:", error);
    } finally {
      setQuizAnswer("");
    }
  };

  useEffect(() => {
    const size = 5 + level * 2; // grid size increases with level (7 to 13)
    const mines = level; // mine count equals level for now
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

    // Build a fixed random order of mine coords
    const allCells = [];
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        allCells.push([i, j]);
      }
    }
    const shuffled = allCells.sort(() => 0.5 - Math.random()).slice(0, mines);
    mineOrderRef.current = shuffled;
    setFlagIndex(0);

    // Place mines
    mineOrderRef.current.forEach(([x, y]) => {
      newGrid[x][y].mine = true;
    });

    // Calculate adjacent mines
    const dirs2 = [-1, 0, 1];
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (newGrid[x][y].mine) continue;
        let count = 0;
        dirs2.forEach((dx) => {
          dirs2.forEach((dy) => {
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

    // Flag the first mine in order and reveal its neighbors
    const [fx, fy] = mineOrderRef.current[0];
    newGrid[fx][fy].flagged = true;
    const dirs = [-1, 0, 1];
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
  }, [level, resetKey]);

  const onCellClick = (row, col) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r) => r.map((c) => ({ ...c })));
      const clicked = newGrid[row][col];
      if (clicked.cleared) return newGrid;
      if (clicked.flagged && !clicked.cleared) {
        // Only flagged cells open quiz; no reveal for others
        setQuizOpen(true);
      }
      // All other clicks do nothing (don't reveal)
      return newGrid;
    });
  };

  // automatically switch to cool state when every mine is cleared
  useEffect(() => {
    if (grid.length === 0) return;
    const allCleared = grid.every((row) =>
      row.every((cell) => !cell.mine || cell.cleared)
    );
    if (allCleared) {
      setGameState("cool");
    }
  }, [grid]);

  return (
    <div className="minesweeper">
      <p>
        Level: {level}{" "}
        <div
          className="minesweeper-center-icon"
          onClick={() => {
            if (gameState === "angry") {
              // reset game
              setResetKey((k) => k + 1);
              setWrongAttempts(0);
              setShowHint(false);
              setQuizOpen(false);
            } else {
              // close window
              onClose && onClose();
            }
          }}
        >
          {gameState === "angry" ? "😡" : "😎"}
        </div>{" "}
        Mines: {mineCount}
      </p>
      <div className="minesweeper-wrapper">
        <div className="minesweeper-grid" style={{ "--cols": grid.length }}>
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`minesweeper-cell ${
                  cell.revealed ? "revealed" : ""
                } ${cell.flagged ? "flagged" : ""}`}
                onClick={() => onCellClick(rowIndex, colIndex)}
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
                  ? "❌"
                  : cell.flagged
                  ? ""
                  : ""}
              </div>
            ))
          )}
        </div>
      </div>
      {quizOpen && (
        <Window title="퀴즈" onClose={() => setQuizOpen(false)}>
          <p>{quizData[level]?.question}</p>
          <input
            type="text"
            placeholder="정답을 입력하세요"
            value={quizAnswer}
            onChange={(e) => setQuizAnswer(e.target.value)}
          />
          {showHint && <p className="hint">힌트: {quizData[level]?.hint}</p>}
          <Buttons onClick={handleSubmitanswer}>제출</Buttons>
          {wrongAttempts >= 3 && (
            <Buttons
              onClick={() => {
                setQuizOpen(false);
                setGrid((prevGrid) => {
                  const newGrid = prevGrid.map((r) => r.map((c) => ({ ...c })));
                  for (let i = 0; i < newGrid.length; i++) {
                    for (let j = 0; j < newGrid[i].length; j++) {
                      const cell = newGrid[i][j];
                      if (cell.flagged && !cell.cleared) {
                        cell.revealed = true;
                        cell.flagged = false;
                        cell.cleared = true;
                        setSkippedFlags((prev) => [...prev, `${i}-${j}`]);
                        return newGrid;
                      }
                    }
                  }
                  return newGrid;
                });
              }}
            >
              퀴즈 넘어가기
            </Buttons>
          )}
        </Window>
      )}
    </div>
  );
}

export default Minesweeper;
