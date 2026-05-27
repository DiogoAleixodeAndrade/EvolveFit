export type FitnessGoal = "lose_weight" | "gain_muscle" | "performance" | "health";

export type TrainingLevel = "beginner" | "intermediate" | "advanced";

export type UserFitnessProfile = {
  name: string;
  age: number;
  heightCm: number;
  weightKg: number;
  goal: FitnessGoal;
  trainingLevel: TrainingLevel;
};

export type DailyTargets = {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  waterMl: number;
};

export type XPAction =
  | "meal_logged"
  | "water_goal_completed"
  | "workout_completed"
  | "run_completed"
  | "daily_goals_completed";