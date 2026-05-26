export type FitnessGoal =
  | "lose_weight"
  | "gain_muscle"
  | "performance"
  | "health";

export type TrainingLevel = "beginner" | "intermediate" | "advanced";

export type UserProfile = {
  id: string;
  name: string;
  age: number;
  heightCm: number;
  weightKg: number;
  goal: FitnessGoal;
  trainingLevel: TrainingLevel;
  availableDays: number;
  xp: number;
  level: number;
};