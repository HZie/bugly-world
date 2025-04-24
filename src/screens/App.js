import { useEffect, useRef, useState } from "react";

// screens
import BugFound from "./BugFound/BugFound";
import ComputerScreen from "./ComputerScreen/ComputerScreen";
import StartScreen from "./StartScreen/StartScreen";

// styles
import "../styles/transition.css";
import VaccineScreen from "./VaccineScreen/VaccineScreen";
import MainScreen from "./MainScreen/MainScreen";
//import AccessGrantedScreen from "./AccessGrantedScreen/AccessGrantedScreen";
//import EntranceScreen from "./EntranceScreen/EntranceScreen";

function App() {
  const [screen, setScreen] = useState("startScreen");
  const audioRef = useRef(null);

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
    localStorage.setItem("lastScreen", screen);
  }, [screen]);

  let currentScreen;

  switch (screen) {
    case "startScreen":
      currentScreen = (
        <StartScreen onNext={() => setScreen("bugFound")} audioRef={audioRef} />
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
      currentScreen = <MainScreen onNext={() => setScreen("startScreen")} />;
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
    default:
      currentScreen = <div>404</div>;
      console.log("hello world");
  }

  return (
    <div className="mobile">
      <div className="corner-text">UglyWorld in_BUG</div>
      {currentScreen}
    </div>
  );
}

export default App;
