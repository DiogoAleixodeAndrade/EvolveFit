import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { Bot, Droplets, Flame, Plus, Trash2, Utensils, Wheat } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { GameCard } from "../../components/GameCard";
import { ProgressBar } from "../../components/ProgressBar";
import { colors } from "../../constants/theme";
import { useUserProfile } from "../../context/UserProfileContext";
import { useProgress } from "../../context/ProgressContext";
import { generateAIPlan } from "../../services/ai";
import { fetchLatestAIPlan, saveAIPlan } from "../../services/aiPlanService";
import { calculateDailyTargets } from "../../services/fitnessCalculations";
import { deleteMeal, fetchTodayMeals, Meal } from "../../services/mealService";
import { AIPlanResponse } from "../../types/ai";
import { addWater, fetchTodayWater } from "../../services/waterService";

export default function DietScreen() {
  const { profile } = useUserProfile();
  const { completeMission } = useProgress();

  const [aiPlan, setAiPlan] = useState<AIPlanResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);

  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoadingMeals, setIsLoadingMeals] = useState(true);

  const [waterConsumedMl, setWaterConsumedMl] = useState(0);
  const [isAddingWater, setIsAddingWater] = useState(false);

  const targets = calculateDailyTargets(
    profile.weightKg,
    profile.heightCm,
    profile.age,
    profile.goal
  );

  const consumedProtein = meals.reduce((total, meal) => total + meal.proteinGrams, 0);
  const consumedCarbs = meals.reduce((total, meal) => total + meal.carbsGrams, 0);
  const consumedCalories = meals.reduce((total, meal) => total + meal.calories, 0);

  const proteinProgress = Math.round((consumedProtein / targets.proteinGrams) * 100);
  const carbsProgress = Math.round((consumedCarbs / targets.carbsGrams) * 100);
  const caloriesProgress = Math.round((consumedCalories / targets.calories) * 100);

  useEffect(() => {
  if (
    consumedProtein >= targets.proteinGrams &&
    targets.proteinGrams > 0
  ) {
    completeMission("protein");
  }
}, [consumedProtein, targets.proteinGrams]);

  useEffect(() => {
  if (consumedProtein >= targets.proteinGrams && targets.proteinGrams > 0) {
    completeMission("protein");
  }
}, [consumedProtein, targets.proteinGrams]);
  
  async function loadLatestPlan() {
    try {
      setIsLoadingPlan(true);
      const latestPlan = await fetchLatestAIPlan("nutrition");
      setAiPlan(latestPlan);
    } catch (error) {
      console.log("Erro ao carregar plano alimentar:", error);
    } finally {
      setIsLoadingPlan(false);
    }
  }

  async function loadWater() {
  const totalWater = await fetchTodayWater();
  setWaterConsumedMl(totalWater);
} 

  async function handleAddWater(amountMl: number) {
  try {
    setIsAddingWater(true);

    await addWater(amountMl);

    const newTotal = waterConsumedMl + amountMl;
    setWaterConsumedMl(newTotal);

    if (newTotal >= targets.waterMl) {
      await completeMission("water");
    }
  } catch (error) {
    console.log("Erro ao registrar água:", error);
  } finally {
    setIsAddingWater(false);
  }
}

  async function handleDeleteMeal(mealId: string) {
  try {
    await deleteMeal(mealId);
    await loadMeals();
  } catch (error) {
    console.log("Erro ao apagar refeição:", error);
  }
}

  async function loadMeals() {
    try {
      setIsLoadingMeals(true);
      const mealsFromSupabase = await fetchTodayMeals();
      setMeals(mealsFromSupabase);
    } catch (error) {
      console.log("Erro ao carregar refeições:", error);
    } finally {
      setIsLoadingMeals(false);
    }
  }

  async function handleGeneratePlan() {
    setIsGenerating(true);

    try {
      const plan = await generateAIPlan({
        type: "nutrition",
        name: profile.name,
        age: profile.age,
        heightCm: profile.heightCm,
        weightKg: profile.weightKg,
        goal: profile.goal,
        trainingLevel: profile.trainingLevel,
      });

      setAiPlan(plan);
      await saveAIPlan("nutrition", plan);
    } catch (error) {
      console.log("Erro ao gerar plano alimentar:", error);
    } finally {
      setIsGenerating(false);
    }
  }

  useEffect(() => {
    loadLatestPlan();
  }, []);

  useFocusEffect(
  useCallback(() => {
    loadMeals();
    loadWater();
  }, [])
);

  return (
    <LinearGradient colors={["#050816", "#0B1026", "#111C44"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <Text style={styles.title}>Dieta IA</Text>
          <Text style={styles.subtitle}>
            Plano alimentar inteligente para sua evolução.
          </Text>
        </View>

        <GameCard>
          <View style={styles.aiHeader}>
            <Bot color={colors.secondary} size={26} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Nutricionista IA</Text>
              <Text style={styles.text}>
                Base atual: {profile.weightKg}kg, {profile.heightCm}cm, {profile.age} anos.
              </Text>
            </View>
          </View>

          <Pressable
            style={[styles.button, isGenerating && styles.buttonDisabled]}
            onPress={handleGeneratePlan}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <Text style={styles.buttonText}>GERAR PLANO ALIMENTAR</Text>
            )}
          </Pressable>
        </GameCard>

        {isLoadingPlan && (
          <GameCard>
            <ActivityIndicator color={colors.secondary} />
            <Text style={styles.loadingPlanText}>Carregando último plano...</Text>
          </GameCard>
        )}

        {!isLoadingPlan && aiPlan && (
          <GameCard>
            <Text style={styles.aiTitle}>{aiPlan.title}</Text>
            <Text style={styles.text}>{aiPlan.summary}</Text>

            <Text style={styles.aiSectionTitle}>Recomendações</Text>
            {aiPlan.recommendations.map((item) => (
              <Text key={item} style={styles.aiItem}>
                • {item}
              </Text>
            ))}

            <Text style={styles.aiSectionTitle}>Cuidados</Text>
            {aiPlan.warnings.map((item) => (
              <Text key={item} style={styles.aiWarning}>
                • {item}
              </Text>
            ))}
          </GameCard>
        )}

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <GameCard>
              <Utensils color={colors.secondary} size={24} />
              <Text style={styles.statValue}>{consumedProtein}g / {targets.proteinGrams}g</Text>
              <Text style={styles.statLabel}>Proteína</Text>
              <ProgressBar progress={Math.min(proteinProgress, 100)} />
            </GameCard>
          </View>

          <View style={styles.statItem}>
            <GameCard>
              <Wheat color={colors.primary} size={24} />
              <Text style={styles.statValue}>{consumedCarbs}g / {targets.carbsGrams}g</Text>
              <Text style={styles.statLabel}>Carboidratos</Text>
              <ProgressBar progress={Math.min(carbsProgress, 100)} />
            </GameCard>
          </View>

          <View style={styles.statItem}>
            <GameCard>
              <Droplets color={colors.secondary} size={24} />
              <Text style={styles.statValue}>
  {(waterConsumedMl / 1000).toFixed(1)}L / {(targets.waterMl / 1000).toFixed(1)}L
</Text>
<Text style={styles.statLabel}>Água</Text>
<ProgressBar progress={Math.min((waterConsumedMl / targets.waterMl) * 100, 100)} />

<View style={styles.waterButtons}>
  <Pressable
    style={styles.waterButton}
    onPress={() => handleAddWater(250)}
    disabled={isAddingWater}
  >
    <Text style={styles.waterButtonText}>+250ml</Text>
  </Pressable>

  <Pressable
    style={styles.waterButton}
    onPress={() => handleAddWater(500)}
    disabled={isAddingWater}
  >
    <Text style={styles.waterButtonText}>+500ml</Text>
  </Pressable>

  <Pressable
    style={styles.waterButton}
    onPress={() => handleAddWater(1000)}
    disabled={isAddingWater}
  >
    <Text style={styles.waterButtonText}>+1L</Text>
  </Pressable>
</View>
            </GameCard>
          </View>

          <View style={styles.statItem}>
            <GameCard>
              <Flame color={colors.warning} size={24} />
              <Text style={styles.statValue}>{consumedCalories} / {targets.calories}</Text>
              <Text style={styles.statLabel}>Calorias</Text>
              <ProgressBar progress={Math.min(caloriesProgress, 100)} />
            </GameCard>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Refeições de hoje</Text>

            <Pressable style={styles.addButton} onPress={() => router.push("/add-meal" as any)}>
              <Plus color={colors.text} size={18} />
            </Pressable>
          </View>

          {isLoadingMeals && (
            <GameCard>
              <ActivityIndicator color={colors.secondary} />
              <Text style={styles.loadingPlanText}>Carregando refeições...</Text>
            </GameCard>
          )}

          {!isLoadingMeals && meals.length === 0 && (
            <GameCard>
              <Text style={styles.text}>Nenhuma refeição registrada hoje.</Text>
            </GameCard>
          )}

          {!isLoadingMeals &&
            meals.map((meal) => (
              <GameCard key={meal.id}>
  <View style={styles.mealHeader}>
    <Text style={styles.mealName}>{meal.name}</Text>

    <Pressable onPress={() => handleDeleteMeal(meal.id)} style={styles.deleteButton}>
      <Trash2 color={colors.danger} size={18} />
    </Pressable>
  </View>

  <Text style={styles.text}>{meal.description || "Sem descrição"}</Text>

  <Text style={styles.protein}>
    {meal.proteinGrams}g proteína · {meal.carbsGrams}g carbo · {meal.calories} kcal
  </Text>
</GameCard>
            ))}
        </View>

        <Text style={styles.warning}>
          O EvolveFit ajuda na organização da rotina, mas não substitui acompanhamento
          com nutricionista ou médico.
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
    gap: 16,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "900",
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 8,
    lineHeight: 22,
  },
  aiHeader: {
    flexDirection: "row",
    gap: 14,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  text: {
    color: colors.textMuted,
    marginTop: 6,
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 18,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.text,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  loadingPlanText: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "700",
  },
  aiTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },
  aiSectionTitle: {
    color: colors.secondary,
    fontWeight: "900",
    marginTop: 16,
    marginBottom: 6,
  },
  aiItem: {
    color: colors.textMuted,
    lineHeight: 22,
  },
  aiWarning: {
    color: colors.warning,
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statItem: {
    width: "48%",
  },
  statValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 10,
  },
  statLabel: {
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: 12,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  mealName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
  },
  protein: {
    color: colors.success,
    fontWeight: "900",
    marginTop: 8,
  },
  warning: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    opacity: 0.8,
  },
  mealHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
},
deleteButton: {
  width: 36,
  height: 36,
  borderRadius: 18,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(239,68,68,0.12)",
},
waterButton: {
  flex: 1,
  backgroundColor: "rgba(0,229,255,0.16)",
  borderRadius: 12,
  paddingVertical: 10,
  alignItems: "center",
},git 
waterButtonText: {
  color: colors.secondary,
  fontWeight: "900",
},
waterButtons: {
  flexDirection: "row",
  gap: 8,
  marginTop: 12,
},
});