import { useEffect, useState, useRef } from "react";

// 로그인용
import { useAgent } from "../../contexts/AgentContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

import "../../styles/layout.css";
import "../../styles/transition.css";
import "./computerScreen.css";
import Window from "../../components/Window";
import Buttons from "../../components/Buttons";

// Sound
import error from "../../assets/sounds/error sound.mp3";
import shutdown from "../../assets/sounds/shut down.mp3";
import Submits from "../../components/Submits";

function ComputerScreen({ onNext }) {
  const [fadeIn, setFadeIn] = useState("");
  // windowIndices: defaultWindows의 인덱스들을 저장 (예: [0, 1, 1, ...])
  const [windowIndices, setWindowIndices] = useState([]);
  const [clickDisabled, setClickDisabled] = useState(false);

  //로그인용
  const { setAgent } = useAgent();
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  async function handleLoginSubmit(e) {
    e.preventDefault();
    const hashed = password;

    const q = query(collection(db, "agents"), where("agentId", "==", hashed));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // 로그인 성공
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

  // 기본 창 목록 (인덱스 기반)
  const defaultWindows = [
    {
      title: "UglyWorld in_BUG",
      content: (
        <>
          <span>요원이십니까?</span>
          <div>
            <Buttons onClick={handleClick}>예</Buttons>
            <Buttons onClick={handleClose}>아니오</Buttons>
          </div>
        </>
      ),
    },
    {
      title: "UglyWorld in_BUG",
      content: (
        <>
          <span>요원 코드를 입력해주세요.</span>
          <form onSubmit={handleLoginSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <Submits value="로그인" />
          </form>
          {loginError && (
            <p style={{ color: "red", fontSize: "1.7vh" }}>{loginError}</p>
          )}
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

  // 초기 fade-in 효과와 첫 창(인덱스 0) 표시
  useEffect(() => {
    const fadeTimeout = setTimeout(() => {
      setFadeIn("fade-in");
    }, 50);

    const initTimeout = setTimeout(() => {
      setWindowIndices([0]); // 첫 창: defaultWindows[0]
      se_error.play();
    }, 1000);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(initTimeout);
    };
  }, []);

  // windowIndices 업데이트 시, 마지막 창(인덱스가 defaultWindows의 마지막)에 도달하면 자동 삭제 시퀀스를 실행
  useEffect(() => {
    if (
      !clickDisabled &&
      windowIndices.length > 0 &&
      windowIndices[windowIndices.length - 1] === defaultWindows.length - 1
    ) {
      setClickDisabled(true);
      se_error.play();
      setTimeout(() => {
        // 마지막 창부터 하나씩 제거 (배열의 마지막 요소 제거)
        setWindowIndices((prev) => prev.slice(0, -1));
        const removalInterval = setInterval(() => {
          setWindowIndices((prev) => {
            if (prev.length > 0) {
              return prev.slice(0, -1);
            } else {
              clearInterval(removalInterval);
              setTimeout(() => {
                se_shutdown.play();
                onNext && onNext();
              }, 300);
              return [];
            }
          });
        }, 50);
      }, 1000);
    }
  }, [windowIndices, clickDisabled, defaultWindows.length, onNext]);

  // handleClick: "예" 버튼 등에서 호출, 창 추가 (마지막 창에 도달하면 자동 삭제로 전환)
  function handleClick() {
    if (clickDisabled) return;
    const lastIndex = windowIndices[windowIndices.length - 1] ?? -1;
    if (lastIndex < defaultWindows.length - 1) {
      setWindowIndices((prev) => [...prev, lastIndex + 1]);
      se_error.play();
    }
  }

  // handleClose: x 버튼 클릭 시 호출. 단, 마지막 창(최상단)에서만 동작하도록 함.
  function handleClose() {
    if (clickDisabled) return;
    se_error.play();
    if (windowIndices.length > 0) {
      // 마지막 창의 인덱스를 그대로 추가하여 복제 효과를 줌.
      const lastIndex = windowIndices[windowIndices.length - 1];
      setWindowIndices((prev) => [...prev, lastIndex]);
    }
  }

  return (
    <div className={`mobile computer-screen pre-fade ${fadeIn}`}>
      <div className="screen" ref={screenRef}>
        {windowIndices.map((idx, i) => {
          const win = defaultWindows[idx];
          if (!win) return null;
          const isLast = i === windowIndices.length - 1;
          return (
            <Window
              key={i}
              title={win.title}
              parentRef={screenRef}
              // onClose prop은 가장 마지막 창에서만 활성화됨
              onClose={isLast ? handleClose : undefined}
              // active-window 클래스는 CSS에서 별도의 스타일(예: 색 변경)을 줄 수 있음
              isActive={isLast ? "active" : "inactive"}
            >
              {win.content}
            </Window>
          );
        })}
      </div>
    </div>
  );
}

export default ComputerScreen;
