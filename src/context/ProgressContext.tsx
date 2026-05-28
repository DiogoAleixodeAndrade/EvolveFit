import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { initialDailyMissions } from "../data/missions";
import { unlockAchievement } from "../services/achievementService";
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
import { fetchStreak, registerDailyActivity } from "../services/streakService";
import { DailyMission } from "../types/missions";

type ProgressContextData = {
  missions: DailyMission[];
  totalXP: number;
  level: number;
  levelProgress: number;
  xpInsideLevel: number;
  currentStreak: number;
  bestStreak: number;
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
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  const level = calculateLevelFromXP(totalXP);
  const levelProgress = calculateCurrentLevelProgress(totalXP);
  const xpInsideLevel = totalXP % 500;

  async function reloadProgress() {
    try {
      setIsLoadingProgress(true);

      const [xpFromSupabase, missionsFromSupabase, streakFromSupabase] =
        await Promise.all([
          fetchTotalXP(),
          fetchTodayMissions(),
          fetchStreak(),
        ]);

      setTotalXP(xpFromSupabase);
      setMissions(missionsFromSupabase);
      setCurrentStreak(streakFromSupabase.currentStreak);
      setBestStreak(streakFromSupabase.bestStreak);
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

      if (newTotalXP >= 500) {
        await unlockAchievement(
          "level_2_reached",
          "Primeira evolução",
          "Você passou dos 500 XP e avançou no sistema."
        );
      }

      if (newTotalXP >= 1500) {
        await unlockAchievement(
          "xp_1500",
          "Caçador em ascensão",
          "Você acumulou mais de 1500 XP."
        );
      }

      if (newTotalXP >= 3000) {
        await unlockAchievement(
          "xp_3000",
          "Evolução avançada",
          "Você acumulou mais de 3000 XP."
        );
      }

      if (newTotalXP >= 5000) {
        await unlockAchievement(
          "xp_5000",
          "Rank superior",
          "Você acumulou mais de 5000 XP."
        );
      }

      if (newTotalXP >= 10000) {
        await unlockAchievement(
          "xp_10000",
          "Caçador lendário",
          "Você acumulou mais de 10000 XP."
        );
      }

      const newStreak = await registerDailyActivity();

      if (newStreak.currentStreak >= 3) {
        await unlockAchievement(
          "streak_3",
          "Disciplina inicial",
          "Você manteve uma sequência de 3 dias ativos."
        );
      }

      if (newStreak.currentStreak >= 7) {
        await unlockAchievement(
          "streak_7",
          "Semana de caçador",
          "Você manteve uma sequência de 7 dias ativos."
        );
      }

      setCurrentStreak(newStreak.currentStreak);
      setBestStreak(newStreak.bestStreak);
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
        currentStreak,
        bestStreak,
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