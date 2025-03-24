//import styles from "./App.module.css";
import BugFound from "./BugFound";
import { useState } from "react";
import ComputerScreen from "./ComputerScreen";

// styles
import "./styles/transition.css";

function App() {
  const [screen, setScreen] = useState("bugFound");

  let currentScreen;

  switch (screen) {
    case "bugFound":
      currentScreen = <BugFound onNext={() => setScreen("computerScreen")} />;
      break;
    case "computerScreen":
      currentScreen = <ComputerScreen onNext={() => setScreen("bugFound")} />;
      break;
    default:
      currentScreen = <div>404</div>;
  }

  return <div className="fade-in">{currentScreen}</div>;
}

export default App;
