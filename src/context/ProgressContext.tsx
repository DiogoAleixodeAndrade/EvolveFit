import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { initialDailyMissions } from "../data/missions";
import {
  calculateCurrentLevelProgress,
  calculateLevelFromXP,
  getXPByAction,
} from "../services/fitnessCalculations";
import {
  fetchTodayMissions,
  fetchTotalXP,
  markMissionAsCompleted,
  updateTotalXP,
} from "../services/progressService";
import { DailyMission } from "../types/missions";

type ProgressContextData = {
  missions: DailyMission[];
  totalXP: number;
  level: number;
  levelProgress: number;
  xpInsideLevel: number;
  isLoadingProgress: boolean;
  completeMission: (missionId: string) => Promise<void>;
  reloadProgress: () => Promise<void>;
};

const ProgressContext = createContext<ProgressContextData | undefined>(undefined);

type ProgressProviderProps = {
  children: ReactNode;
};

export function ProgressProvider({ children }: ProgressProviderProps) {
  const [missions, setMissions] = useState<DailyMission[]>(initialDailyMissions);
  const [totalXP, setTotalXP] = useState(0);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  const level = calculateLevelFromXP(totalXP);
  const levelProgress = calculateCurrentLevelProgress(totalXP);
  const xpInsideLevel = totalXP % 500;

  async function reloadProgress() {
    try {
      setIsLoadingProgress(true);

      const [xpFromSupabase, missionsFromSupabase] = await Promise.all([
        fetchTotalXP(),
        fetchTodayMissions(),
      ]);

      setTotalXP(xpFromSupabase);
      setMissions(missionsFromSupabase);
    } catch (error) {
      console.log("Erro ao carregar progresso:", error);
    } finally {
      setIsLoadingProgress(false);
    }
  }

  async function completeMission(missionId: string) {
    const missionToComplete = missions.find((mission) => mission.id === missionId);

    if (!missionToComplete || missionToComplete.completed) {
      return;
    }

    const xpToAdd = getXPByAction(missionToComplete.xpAction);
    const newTotalXP = totalXP + xpToAdd;

    setMissions((currentMissions) =>
      currentMissions.map((mission) =>
        mission.id === missionId
          ? {
              ...mission,
              completed: true,
            }
          : mission
      )
    );

    setTotalXP(newTotalXP);

    try {
      await markMissionAsCompleted(missionId);
      await updateTotalXP(newTotalXP);
    } catch (error) {
      console.log("Erro ao salvar missão:", error);
      await reloadProgress();
    }
  }

  useEffect(() => {
    reloadProgress();
  }, []);

  return (
    <ProgressContext.Provider
      value={{
        missions,
        totalXP,
        level,
        levelProgress,
        xpInsideLevel,
        isLoadingProgress,
        completeMission,
        reloadProgress,
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