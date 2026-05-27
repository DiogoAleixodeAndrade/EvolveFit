import {
  DailyTargets,
  ExerciseType,
  FitnessGoal,
  XPAction,
} from "../types/fitness";

export function calculateDailyTargets(
  weightKg: number,
  heightCm: number,
  age: number,
  goal: FitnessGoal
): DailyTargets {
  const baseCalories =
    10 * weightKg +
    6.25 * heightCm -
    5 * age +
    5;

  let calories = Math.round(baseCalories * 1.5);

  if (goal === "lose_weight") {
    calories -= 400;
  }

  if (goal === "gain_muscle") {
    calories += 350;
  }

  if (goal === "performance") {
    calories += 250;
  }

  const proteinMultiplier =
    goal === "gain_muscle"
      ? 2.2
      : goal === "performance"
        ? 2
        : 1.8;

  const proteinGrams = Math.round(weightKg * proteinMultiplier);

  const carbsMultiplier =
    goal === "performance"
      ? 5
      : goal === "gain_muscle"
        ? 4
        : 3;

  const carbsGrams = Math.round(weightKg * carbsMultiplier);

  const waterMl = Math.round(weightKg * 45);

  return {
    calories,
    proteinGrams,
    carbsGrams,
    waterMl,
  };
}

export function calculateCaloriesByExercise(
  weightKg: number,
  durationMinutes: number,
  exerciseType: ExerciseType
) {
  const metMap: Record<ExerciseType, number> = {
    walking: 3.8,
    running: 9.8,
    cycling: 7.5,
    weight_training: 6,
  };

  const met = metMap[exerciseType];

  const calories =
    ((met * 3.5 * weightKg) / 200) *
    durationMinutes;

  return Math.round(calories);
}

export function calculateRunningCaloriesByDistance(
  weightKg: number,
  distanceKm: number
) {
  return Math.round(weightKg * distanceKm * 1.03);
}

const xpMap: Record<XPAction, number> = {
  meal_logged: 40,
  water_goal_completed: 30,
  protein_goal_completed: 50,
  workout_completed: 80,
  run_completed: 60,
  daily_goals_completed: 150,
};

export function getXPByAction(action: XPAction) {
  return xpMap[action];
}

export function calculateLevelFromXP(totalXP: number) {
  return Math.floor(totalXP / 500) + 1;
}

export function calculateCurrentLevelProgress(totalXP: number) {
  return (totalXP % 500) / 500 * 100;
}