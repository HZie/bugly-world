import { useMemo, useState } from "react";
import "./redirect26Screen.css";

// ✅ 네가 이미 쓰고 있는 이미지 경로 그대로 사용
import bgImg from "../../assets/images/redirect_background.jpg";
import windowImg from "../../assets/images/redirect_window.jpg";
import yesBtnImg from "../../assets/images/redirect_button.png";

// NOTE: 원하는 외부 사이트 URL로 바꿔주세요.
const DEFAULT_TARGET_URL = "https://www.juieeuglyworld.com/copy-of-inside-2";

export default function Redirect26Screen({
  targetUrl = DEFAULT_TARGET_URL,
  // ✅ 버튼 위치(윈도우 내부 기준, %). 필요하면 호출하는 곳에서 조절
  buttonX = 50,
  buttonY = 72,
}) {
  const [clicked, setClicked] = useState(false);

  const safeTargetUrl = useMemo(() => {
    if (!targetUrl || typeof targetUrl !== "string") return DEFAULT_TARGET_URL;
    return targetUrl;
  }, [targetUrl]);

  const handleYes = () => {
    setClicked(true);
    window.location.assign(safeTargetUrl);
  };

  return (
    <div
      className="redirect26-screen"
      style={{
        "--bg-url": `url(${bgImg})`,
        "--btn-x": `${buttonX}%`,
        "--btn-y": `${buttonY}%`,
      }}
    >
      <section className="redirect26-window" aria-label="Window">
        <img
          className="redirect26-window-img"
          src={windowImg}
          alt=""
          aria-hidden="true"
          draggable={false}
        />

        {/* 버튼을 창 위에 올리는 레이어 */}
        <div className="redirect26-overlay">
          <button
            type="button"
            className={`redirect26-yes ${clicked ? "is-clicked" : ""}`}
            onClick={handleYes}
            aria-label="YES"
          >
            <img
              className="redirect26-yes-img"
              src={yesBtnImg}
              alt="YES"
              draggable={false}
            />
          </button>
        </div>
      </section>
    </div>
  );
}
