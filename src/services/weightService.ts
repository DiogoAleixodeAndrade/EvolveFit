import { getCurrentUserId } from "./profileService";
import { supabase } from "./supabase";

export type WeightLog = {
  id: string;
  weightKg: number;
  logDate: string;
  createdAt: string;
};

export async function fetchWeightLogs(): Promise<WeightLog[]> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("weight_logs")
    .select("*")
    .eq("user_id", userId)
    .order("log_date", { ascending: true });

  if (error) {
    throw error;
  }

  return data.map((log) => ({
    id: log.id,
    weightKg: Number(log.weight_kg),
    logDate: log.log_date,
    createdAt: log.created_at,
  }));
}

export async function createWeightLog(weightKg: number) {
  const userId = await getCurrentUserId();

  const { error } = await supabase.from("weight_logs").insert({
    user_id: userId,
    weight_kg: weightKg,
  });

  if (error) {
    throw error;
  }
}

export async function deleteWeightLog(weightLogId: string) {
  const { error } = await supabase
    .from("weight_logs")
    .delete()
    .eq("id", weightLogId);

  if (error) {
    throw error;
  }
}