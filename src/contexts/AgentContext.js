// src/contexts/AgentContext.js
import { createContext, useContext, useEffect, useState } from "react";

const AgentContext = createContext(null);
export const useAgent = () => useContext(AgentContext);

export const AgentProvider = ({ children }) => {
  const [agent, setAgentState] = useState(null); // 예: { id, progress, passwordHash }

  // 실제 호출되는 setAgent 함수: localStorage에도 저장
  const setAgent = (data) => {
    setAgentState(data);
    localStorage.setItem("agentData", JSON.stringify(data));
  };

  // 새로고침 시 복구
  useEffect(() => {
    const stored = localStorage.getItem("agentData");
    if (stored) {
      setAgentState(JSON.parse(stored));
    }
  }, []);
  return (
    <AgentContext.Provider value={{ agent, setAgent }}>
      {children}
    </AgentContext.Provider>
  );
};
