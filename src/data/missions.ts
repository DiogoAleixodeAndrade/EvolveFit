import { DailyMission } from "../types/missions";

export const initialDailyMissions: DailyMission[] = [
  {
    id: "meal",
    title: "Registrar refeições",
    description: "Registre pelo menos uma refeição hoje.",
    xpAction: "meal_logged",
    completed: false,
  },
  {
    id: "water",
    title: "Bater meta de água",
    description: "Complete sua meta diária de água.",
    xpAction: "water_goal_completed",
    completed: false,
  },
  {
    id: "workout",
    title: "Completar treino",
    description: "Finalize o treino do dia.",
    xpAction: "workout_completed",
    completed: false,
  },
  {
    id: "run",
    title: "Fazer cardio/corrida",
    description: "Complete sua missão cardiovascular.",
    xpAction: "run_completed",
    completed: false,
  },
];