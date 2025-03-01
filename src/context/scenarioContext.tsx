"use client"
import React, { createContext, useContext, useState } from 'react';

type Scenario = {
  id: string;
  title: string;
};

type ScenarioContextType = {
  scenarios: Scenario[];
  addScenario: (title: string) => void;
};

const ScenarioContext = createContext<ScenarioContextType | undefined>(undefined);

export function ScenarioProvider({ children }: { children: React.ReactNode }) {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  const addScenario = (title: string) => {
    setScenarios([...scenarios, { 
      id: Date.now().toString(), 
      title 
    }]);
  };

  return (
    <ScenarioContext.Provider value={{ scenarios, addScenario }}>
      {children}
    </ScenarioContext.Provider>
  );
}

export function useScenarios() {
  const context = useContext(ScenarioContext);
  if (context === undefined) {
    throw new Error('useScenarios must be used within a ScenarioProvider');
  }
  return context;
}