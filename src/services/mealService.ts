import { getCurrentUserId } from "./profileService";
import { supabase } from "./supabase";

export type Meal = {
  id: string;
  name: string;
  description: string | null;
  proteinGrams: number;
  carbsGrams: number;
  calories: number;
  mealDate: string;
};

export type CreateMealInput = {
  name: string;
  description: string;
  proteinGrams: number;
  carbsGrams: number;
  calories: number;
};

export async function fetchTodayMeals(): Promise<Meal[]> {
  const userId = await getCurrentUserId();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", userId)
    .eq("meal_date", today)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map((meal) => ({
    id: meal.id,
    name: meal.name,
    description: meal.description,
    proteinGrams: Number(meal.protein_grams),
    carbsGrams: Number(meal.carbs_grams),
    calories: meal.calories,
    mealDate: meal.meal_date,
  }));
}

export async function createMeal(input: CreateMealInput) {
  const userId = await getCurrentUserId();

  const { error } = await supabase.from("meals").insert({
    user_id: userId,
    name: input.name,
    description: input.description,
    protein_grams: input.proteinGrams,
    carbs_grams: input.carbsGrams,
    calories: input.calories,
  });

  if (error) {
    throw error;
  }
}

export async function deleteMeal(mealId: string) {
  const { error } = await supabase.from("meals").delete().eq("id", mealId);

  if (error) {
    throw error;
  }
}