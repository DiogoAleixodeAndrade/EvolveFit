import { getCurrentUserId } from "./profileService";
import { supabase } from "./supabase";

export type Run = {
  id: string;
  title: string;
  distanceKm: number;
  durationMinutes: number;
  calories: number;
  runDate: string;
};

export type CreateRunInput = {
  title: string;
  distanceKm: number;
  durationMinutes: number;
  calories: number;
};

export async function fetchTodayRuns(): Promise<Run[]> {
  const userId = await getCurrentUserId();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("runs")
    .select("*")
    .eq("user_id", userId)
    .eq("run_date", today)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map((run) => ({
    id: run.id,
    title: run.title,
    distanceKm: Number(run.distance_km),
    durationMinutes: run.duration_minutes,
    calories: run.calories,
    runDate: run.run_date,
  }));
}

export async function createRun(input: CreateRunInput) {
  const userId = await getCurrentUserId();

  const { error } = await supabase.from("runs").insert({
    user_id: userId,
    title: input.title,
    distance_km: input.distanceKm,
    duration_minutes: input.durationMinutes,
    calories: input.calories,
  });

  if (error) {
    throw error;
  }
}

export async function deleteRun(runId: string) {
  const { error } = await supabase.from("runs").delete().eq("id", runId);

  if (error) {
    throw error;
  }
}