import { supabase } from "./supabase";
import { UserFitnessProfile } from "../types/fitness";

export async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error("Usuário não autenticado.");
  }

  return data.user.id;
}

export async function fetchProfile(): Promise<UserFitnessProfile | null> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    return null;
  }

  return {
    name: data.name,
    age: data.age,
    heightCm: data.height_cm,
    weightKg: Number(data.weight_kg),
    goal: data.goal,
    trainingLevel: data.training_level,
  };
}

export async function upsertProfile(profile: UserFitnessProfile) {
  const userId = await getCurrentUserId();

  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    name: profile.name,
    age: profile.age,
    height_cm: profile.heightCm,
    weight_kg: profile.weightKg,
    goal: profile.goal,
    training_level: profile.trainingLevel,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw error;
  }
}