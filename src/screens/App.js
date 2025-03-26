import { useRef, useState } from "react";

// screens
import BugFound from "./BugFound/BugFound";
import ComputerScreen from "./ComputerScreen/ComputerScreen";
import StartScreen from "./StartScreen/StartScreen";

// styles
import "../styles/transition.css";
import VaccineScreen from "./VaccineScreen/VaccineScreen";

function App() {
  const [screen, setScreen] = useState("startScreen");
  const audioRef = useRef(null);

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
      currentScreen = <VaccineScreen onNext={() => setScreen("startScreen")} />;
      break;
    default:
      currentScreen = <div>404</div>;
  }

  return (
    <div className="mobile">
      <div className="corner-text">UglyWorld in_BUG</div>
      {currentScreen}
    </div>
  );
}

export default App;
