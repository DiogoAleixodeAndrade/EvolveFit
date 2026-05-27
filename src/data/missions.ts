import { DailyMission } from "../types/missions";

export const initialDailyMissions: DailyMission[] = [
  {
    id: "meal",
    title: "Registrar refeição",
    description: "Adicione pelo menos uma refeição hoje.",
    xpAction: "meal_logged",
    completed: false,
  },
  {
    id: "protein",
    title: "Bater meta de proteína",
    description: "Complete sua meta diária de proteína.",
    xpAction: "protein_goal_completed",
    completed: false,
  },
  {
    id: "water",
    title: "Meta de hidratação",
    description: "Complete sua ingestão diária de água.",
    xpAction: "water_goal_completed",
    completed: false,
  },
  {
    id: "workout",
    title: "Treino completo",
    description: "Finalize seu treino de musculação.",
    xpAction: "workout_completed",
    completed: false,
  },
  {
    id: "running",
    title: "Missão de corrida",
    description: "Complete sua corrida planejada.",
    xpAction: "run_completed",
    completed: false,
  },
];