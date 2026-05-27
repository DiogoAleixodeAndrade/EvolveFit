import { createContext, ReactNode, useContext, useState } from "react";
import { initialDailyMissions } from "../data/missions";
import {
  calculateCurrentLevelProgress,
  calculateLevelFromXP,
  getXPByAction,
} from "../services/fitnessCalculations";
import { DailyMission } from "../types/missions";

type ProgressContextData = {
  missions: DailyMission[];
  totalXP: number;
  level: number;
  levelProgress: number;
  xpInsideLevel: number;
  completeMission: (missionId: string) => void;
};

const ProgressContext = createContext<ProgressContextData | undefined>(undefined);

type ProgressProviderProps = {
  children: ReactNode;
};

export function ProgressProvider({ children }: ProgressProviderProps) {
  const [missions, setMissions] = useState<DailyMission[]>(initialDailyMissions);
  const [totalXP, setTotalXP] = useState(1120);

  const level = calculateLevelFromXP(totalXP);
  const levelProgress = calculateCurrentLevelProgress(totalXP);
  const xpInsideLevel = totalXP % 500;

  function completeMission(missionId: string) {
    setMissions((currentMissions) =>
      currentMissions.map((mission) => {
        if (mission.id !== missionId || mission.completed) {
          return mission;
        }

        setTotalXP((currentXP) => currentXP + getXPByAction(mission.xpAction));

        return {
          ...mission,
          completed: true,
        };
      })
    );
  }

  return (
    <ProgressContext.Provider
      value={{
        missions,
        totalXP,
        level,
        levelProgress,
        xpInsideLevel,
        completeMission,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);

  if (!context) {
    throw new Error("useProgress precisa estar dentro de ProgressProvider");
  }

  return context;
}