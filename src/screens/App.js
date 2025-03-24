import { useRef, useState } from "react";

// screens
import BugFound from "./BugFound/BugFound";
import ComputerScreen from "./ComputerScreen/ComputerScreen";
import StartScreen from "./StartScreen/StartScreen";

// styles
import "../styles/transition.css";

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
        <ComputerScreen onNext={() => setScreen("startScreen")} />
      );
      break;
    default:
      currentScreen = <div>404</div>;
  }

  return <div>{currentScreen}</div>;
}

export default App;
