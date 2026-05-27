import { LinearGradient } from "expo-linear-gradient";
import { Bot, Droplets, Flame, Plus, Utensils, Wheat } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { GameCard } from "../../components/GameCard";
import { ProgressBar } from "../../components/ProgressBar";
import { colors } from "../../constants/theme";
import { useUserProfile } from "../../context/UserProfileContext";
import { generateAIPlan } from "../../services/ai";
import { fetchLatestAIPlan, saveAIPlan } from "../../services/aiPlanService";
import { calculateDailyTargets } from "../../services/fitnessCalculations";
import { AIPlanResponse } from "../../types/ai";

const meals = [
  {
    id: "breakfast",
    name: "Café da manhã",
    description: "Ovos, pão integral e fruta",
    protein: "28g proteína",
  },
  {
    id: "lunch",
    name: "Almoço",
    description: "Arroz, feijão, frango e salada",
    protein: "42g proteína",
  },
  {
    id: "dinner",
    name: "Jantar",
    description: "Carne magra, legumes e batata",
    protein: "38g proteína",
  },
];

export default function DietScreen() {
  const { profile } = useUserProfile();
  const [aiPlan, setAiPlan] = useState<AIPlanResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);

  const targets = calculateDailyTargets(
    profile.weightKg,
    profile.heightCm,
    profile.age,
    profile.goal
  );

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
              <Text style={styles.statValue}>{targets.proteinGrams}g</Text>
              <Text style={styles.statLabel}>Proteína</Text>
              <ProgressBar progress={72} />
            </GameCard>
          </View>

          <View style={styles.statItem}>
            <GameCard>
              <Wheat color={colors.primary} size={24} />
              <Text style={styles.statValue}>{targets.carbsGrams}g</Text>
              <Text style={styles.statLabel}>Carboidratos</Text>
              <ProgressBar progress={55} />
            </GameCard>
          </View>

          <View style={styles.statItem}>
            <GameCard>
              <Droplets color={colors.secondary} size={24} />
              <Text style={styles.statValue}>{(targets.waterMl / 1000).toFixed(1)}L</Text>
              <Text style={styles.statLabel}>Água</Text>
              <ProgressBar progress={60} />
            </GameCard>
          </View>

          <View style={styles.statItem}>
            <GameCard>
              <Flame color={colors.warning} size={24} />
              <Text style={styles.statValue}>{targets.calories}</Text>
              <Text style={styles.statLabel}>Calorias</Text>
              <ProgressBar progress={68} />
            </GameCard>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Refeições de hoje</Text>

            <Pressable style={styles.addButton}>
              <Plus color={colors.text} size={18} />
            </Pressable>
          </View>

          {meals.map((meal) => (
            <GameCard key={meal.id}>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text style={styles.text}>{meal.description}</Text>
              <Text style={styles.protein}>{meal.protein}</Text>
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
});