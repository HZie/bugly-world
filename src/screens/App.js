import { useEffect, useRef, useState } from "react";

// screens
import BugFound from "./BugFound/BugFound";
import ComputerScreen from "./ComputerScreen/ComputerScreen";
import StartScreen from "./StartScreen/StartScreen";
import "../styles/transition.css";
import VaccineScreen from "./VaccineScreen/VaccineScreen";
import MainScreen from "./MainScreen/MainScreen";
import UrdyScreen from "./UrdyScreen/UrdyScreen";
import GoingBack from "./GoingBack/GoingBack";
import LastScreen from "./LastScreen/LastScreen";
//import AccessGrantedScreen from "./AccessGrantedScreen/AccessGrantedScreen";
//import EntranceScreen from "./EntranceScreen/EntranceScreen";

function App() {
  const [screen, setScreen] = useState("startScreen");
  const audioRef = useRef(null);

  const handleEnterFullScreen = async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        await elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }
    } catch (err) {
      console.error("전체 화면 전환 오류:", err);
    }
  };

  // 저장된 화면 복구
  useEffect(() => {
    const savedScreen = localStorage.getItem("lastScreen");
    console.log(savedScreen);
    if (savedScreen == "null") {
      setScreen("startScreen");
    } else {
      setScreen(savedScreen);
    }
  }, []);

  useEffect(() => {
    const preloadAudio = (src) => {
      const audio = new Audio();
      audio.src = src;
      audio.preload = "auto";
      audio.load();
    };

    const preloadImage = (src) => {
      const img = new Image();
      img.src = src;
    };

    // 오디오 프리로드
    preloadAudio("/assets/sounds/warning.ogg");
    preloadAudio("/assets/sounds/error sound.ogg");
    preloadAudio("/assets/sounds/opening bgm.ogg");
    preloadAudio("/assets/sounds/computer start.ogg");
    preloadAudio("/assets/sounds/chasing.ogg");
    preloadAudio("/assets/sounds/complete.ogg");
    preloadAudio("/assets/sounds/mouse click.ogg");
    preloadAudio("/assets/sounds/portion.ogg");
    preloadAudio("/assets/sounds/shut down.ogg");

    // 이미지 프리로드 (예시)
    preloadImage("/assets/images/activated-folder.png");
    preloadImage("/assets/images/inactivated-folder.png");
    preloadImage("/assets/images/glitch-pattern.png");
    preloadImage("/assets/images/glitched-urdy.gif");
    preloadImage("/assets/images/urdy.png");
  }, []);

  useEffect(() => {
    localStorage.setItem("lastScreen", screen);
  }, [screen]);

  let currentScreen;

  switch (screen) {
    case "startScreen":
      currentScreen = (
        <StartScreen
          onNext={() => setScreen("bugFound")}
          audioRef={audioRef}
          onEnterFullScreen={handleEnterFullScreen}
        />
      );
      break;
    case "bugFound":
      currentScreen = (
        <BugFound
          onNext={() => setScreen("computerScreen")}
          audioRef={audioRef}
        />
      );
      break;
    case "computerScreen":
      currentScreen = (
        <ComputerScreen onNext={() => setScreen("vaccineScreen")} />
      );
      break;
    case "vaccineScreen":
      currentScreen = <VaccineScreen onNext={() => setScreen("mainScreen")} />;
      break;
    case "mainScreen":
      currentScreen = <MainScreen onNext={() => setScreen("urdyScreen")} />;
      break;
    /*
    case "accessGrantedScreen":
      break;
      currentScreen = (
        <AccessGrantedScreen onNext={() => setScreen("entranceScreen")} />
      );
      break;
      
    case "entranceScreen":
      currentScreen = (
        <EntranceScreen onNext={() => setScreen("startScreen")} />
      );
      break;
      */
    case "urdyScreen":
      currentScreen = <UrdyScreen onNext={() => setScreen("goingBack")} />;
      break;
    case "goingBack":
      currentScreen = <GoingBack onNext={() => setScreen("lastScreen")} />;
      break;
    case "lastScreen":
      currentScreen = <LastScreen onNext={() => setScreen("startScreen")} />;
      break;
    default:
      currentScreen = (
        <StartScreen
          onNext={() => setScreen("startScreen")}
          audioRef={audioRef}
        />
      );
  }

  return (
    <div className="mobile">
      <div
        className="corner-text"
        onClick={() => {
          setScreen("startScreen");
        }}
      >
        UglyWorld in_BUG
      </div>
      {currentScreen}
    </div>
  );
}

export default App;
