import { useEffect, useState } from "react";

import { useAgent } from "../../contexts/AgentContext";

import "./entranceScreen.css";
import "../../styles/global.css";
import "../../styles/layout.css";
import "../../styles/typography.css";
import entranceVideo from "../../assets/images/entrance.mp4";

function EntranceScreen({ onNext }) {
  const { agent } = useAgent();

  const handleClick = () => {
    onNext();
  };

  return (
    <div className="entranceScreen" onClick={handleClick}>
      <video muted autoPlay onEnded={onNext}>
        <source src={entranceVideo} type="video/mp4" />
      </video>
    </div>
  );
}
export default EntranceScreen;
