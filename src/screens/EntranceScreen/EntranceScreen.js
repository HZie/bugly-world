import { useEffect, useState } from "react";

import { useAgent } from "../../contexts/AgentContext";

import "./entranceScreen.css";
import "../../styles/global.css";
import "../../styles/layout.css";
import "../../styles/typography.css";

function EntranceScreen({ onNext }) {
  const { agent } = useAgent();

  return (
    <div className="entranceScreen">
      <div>helo</div>
    </div>
  );
}
export default EntranceScreen;
