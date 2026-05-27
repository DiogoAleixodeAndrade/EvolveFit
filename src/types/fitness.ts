export type FitnessGoal =
  | "lose_weight"
  | "gain_muscle"
  | "performance"
  | "health";

export type TrainingLevel =
  | "beginner"
  | "intermediate"
  | "advanced";

export type XPAction =
  | "meal_logged"
  | "water_goal_completed"
  | "protein_goal_completed"
  | "workout_completed"
  | "run_completed"
  | "daily_goals_completed";

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
  waterMl: number;
};

export type ExerciseType =
  | "walking"
  | "running"
  | "cycling"
  | "weight_training";