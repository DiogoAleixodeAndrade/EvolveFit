import { getCurrentUserId } from "./profileService";
import { supabase } from "./supabase";

export type Workout = {
  id: string;
  title: string;
  durationMinutes: number;
  calories: number;
  workoutDate: string;
  completed: boolean;
};

export type CreateWorkoutInput = {
  title: string;
  durationMinutes: number;
  calories: number;
};

export async function fetchTodayWorkouts(): Promise<Workout[]> {
  const userId = await getCurrentUserId();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", userId)
    .eq("workout_date", today)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map((workout) => ({
    id: workout.id,
    title: workout.title,
    durationMinutes: workout.duration_minutes,
    calories: workout.calories,
    workoutDate: workout.workout_date,
    completed: workout.completed,
  }));
}

export async function createWorkout(input: CreateWorkoutInput) {
  const userId = await getCurrentUserId();

  const { error } = await supabase.from("workouts").insert({
    user_id: userId,
    title: input.title,
    duration_minutes: input.durationMinutes,
    calories: input.calories,
  });

  if (error) {
    throw error;
  }
}

export async function completeWorkout(workoutId: string) {
  const { error } = await supabase
    .from("workouts")
    .update({ completed: true })
    .eq("id", workoutId);

  if (error) {
    throw error;
  }
}

export async function deleteWorkout(workoutId: string) {
  const { error } = await supabase
    .from("workouts")
    .delete()
    .eq("id", workoutId);

  if (error) {
    throw error;
  }
}