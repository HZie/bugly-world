import { useEffect, useRef, useState } from "react";

// screens
import BugFound from "./BugFound/BugFound";
import ComputerScreen from "./ComputerScreen/ComputerScreen";
import StartScreen from "./StartScreen/StartScreen";
import "../styles/transition.css";
import VaccineScreen from "./VaccineScreen/VaccineScreen";
import EntranceScreen from "./EntranceScreen/EntranceScreen";
import FirstQuiz from "./FirstQuiz/FirstQuiz";
import MainScreen from "./MainScreen/MainScreen";
import UrdyScreen from "./UrdyScreen/UrdyScreen";
import AfterUrdy from "./AfterUrdy/AfterUrdy";
import BeforeCredit from "./BeforeCredit/BeforeCredit";
import CreditScreen from "./CreditScreen/CreditScreen";
import GoingBack from "./GoingBack/GoingBack";
import LastScreen from "./LastScreen/LastScreen";
//import AccessGrantedScreen from "./AccessGrantedScreen/AccessGrantedScreen";
//import EntranceScreen from "./EntranceScreen/EntranceScreen";

import map1 from "../assets/images/map-1.png";
import map2 from "../assets/images/map-2.png";
import map3 from "../assets/images/map-3.png";
import map4 from "../assets/images/map-4.png";

function App() {
  const [screen, setScreen] = useState("startScreen");
  const [mapVisible, setMapVisible] = useState(false);
  const [map, setMap] = useState(map1);
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
    if (screen == null) setScreen("startScreen");
    localStorage.setItem("lastScreen", screen);
  }, [screen]);

  useEffect(() => {
    if (screen === "entranceScreen") {
      setMap(map2);
    } else if (
      screen === "startScreen" ||
      screen === "bugFound" ||
      screen === "computerScreen" ||
      screen === "vaccineScreen"
    ) {
      setMap(map1);
    } else if (
      screen === "urdyScreen" ||
      screen === "afterUrdy" ||
      screen === "goingBack" ||
      screen === "beforeCredit" ||
      screen === "creditScreen" ||
      screen === "lastScreen"
    ) {
      setMap(map4);
    } else {
      setMap(map3);
    }
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
      currentScreen = (
        <VaccineScreen onNext={() => setScreen("entranceScreen")} />
      );
      break;
    case "entranceScreen":
      currentScreen = <EntranceScreen onNext={() => setScreen("firstQuiz")} />;
      break;
    case "firstQuiz":
      currentScreen = <FirstQuiz onNext={() => setScreen("mainScreen")} />;
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
      currentScreen = <UrdyScreen onNext={() => setScreen("afterUrdy")} />;
      break;
    case "afterUrdy":
      currentScreen = <AfterUrdy onNext={() => setScreen("goingBack")} />;
      break;
    case "goingBack":
      currentScreen = <GoingBack onNext={() => setScreen("beforeCredit")} />;
      break;
    case "beforeCredit":
      currentScreen = <BeforeCredit onNext={() => setScreen("creditScreen")} />;
      break;
    case "creditScreen":
      currentScreen = <CreditScreen onNext={() => setScreen("lastScreen")} />;
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
      <div className="corner-text" onClick={() => setScreen("startScreen")}>
        <span>UglyWorld in_BUG</span>
      </div>
      <div className="map-container">
        <div
          onClick={() => {
            setMapVisible((prev) => !prev);
          }}
          className="map-text"
        >
          map
        </div>
        {mapVisible && <img className="map-image" src={map} alt="Map" />}
      </div>
      {currentScreen}
    </div>
  );
}

export default App;
