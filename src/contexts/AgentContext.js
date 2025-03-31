// src/contexts/AgentContext.js
import { createContext, useContext, useState } from "react";

const AgentContext = createContext(null);
export const useAgent = () => useContext(AgentContext);

export const AgentProvider = ({ children }) => {
  const [agent, setAgent] = useState(null); // 예: { id, progress, passwordHash }

  return (
    <AgentContext.Provider value={{ agent, setAgent }}>
      {children}
    </AgentContext.Provider>
  );
};
