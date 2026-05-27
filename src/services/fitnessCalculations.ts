import { DailyTargets, FitnessGoal, XPAction } from "../types/fitness";

export function calculateWaterGoal(weightKg: number): number {
  return Math.round(weightKg * 35);
}

export function calculateProteinGoal(weightKg: number, goal: FitnessGoal): number {
  const multiplierByGoal = {
    lose_weight: 2,
    gain_muscle: 2.2,
    performance: 1.8,
    health: 1.6,
  };

  return Math.round(weightKg * multiplierByGoal[goal]);
}

export function calculateCalories(weightKg: number, heightCm: number, age: number, goal: FitnessGoal): number {
  const baseCalories = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;

  const activityMultiplier = 1.45;
  const maintenance = baseCalories * activityMultiplier;

  const caloriesByGoal = {
    lose_weight: maintenance - 400,
    gain_muscle: maintenance + 300,
    performance: maintenance + 150,
    health: maintenance,
  };

  return Math.round(caloriesByGoal[goal]);
}

export function calculateCarbsGoal(calories: number, proteinGrams: number, fatGrams: number): number {
  const proteinCalories = proteinGrams * 4;
  const fatCalories = fatGrams * 9;
  const remainingCalories = calories - proteinCalories - fatCalories;

  return Math.max(Math.round(remainingCalories / 4), 0);
}

export function calculateFatGoal(weightKg: number): number {
  return Math.round(weightKg * 0.8);
}

export function calculateDailyTargets(
  weightKg: number,
  heightCm: number,
  age: number,
  goal: FitnessGoal
): DailyTargets {
  const calories = calculateCalories(weightKg, heightCm, age, goal);
  const proteinGrams = calculateProteinGoal(weightKg, goal);
  const fatGrams = calculateFatGoal(weightKg);
  const carbsGrams = calculateCarbsGoal(calories, proteinGrams, fatGrams);
  const waterMl = calculateWaterGoal(weightKg);

  return {
    calories,
    proteinGrams,
    carbsGrams,
    fatGrams,
    waterMl,
  };
}

export function getXPByAction(action: XPAction): number {
  const xpMap = {
    meal_logged: 40,
    water_goal_completed: 30,
    workout_completed: 80,
    run_completed: 60,
    daily_goals_completed: 150,
  };

  return xpMap[action];
}

export function calculateLevelFromXP(totalXP: number): number {
  return Math.floor(totalXP / 500) + 1;
}

export function calculateCurrentLevelProgress(totalXP: number): number {
  const xpInsideCurrentLevel = totalXP % 500;
  return Math.round((xpInsideCurrentLevel / 500) * 100);
}

export type ExerciseType =
  | "weight_training"
  | "walking"
  | "running"
  | "cycling"
  | "hiit";

const metByExercise: Record<ExerciseType, number> = {
  weight_training: 5,
  walking: 3.5,
  running: 9.8,
  cycling: 7.5,
  hiit: 8,
};

export function calculateCaloriesByExercise(
  weightKg: number,
  durationMinutes: number,
  exerciseType: ExerciseType
): number {
  const met = metByExercise[exerciseType];

  return Math.round((met * 3.5 * weightKg * durationMinutes) / 200);
}

export function calculateRunningCaloriesByDistance(
  weightKg: number,
  distanceKm: number
): number {
  return Math.round(weightKg * distanceKm);
}