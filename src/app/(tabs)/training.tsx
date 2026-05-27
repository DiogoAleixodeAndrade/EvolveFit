import { LinearGradient } from "expo-linear-gradient";
import { Bot, Dumbbell, Flame, Repeat, Timer, Trophy } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { GameCard } from "../../components/GameCard";
import { ProgressBar } from "../../components/ProgressBar";
import { colors } from "../../constants/theme";
import { useUserProfile } from "../../context/UserProfileContext";
import { generateAIPlan } from "../../services/ai";
import { fetchLatestAIPlan, saveAIPlan } from "../../services/aiPlanService";
import { calculateCaloriesByExercise } from "../../services/fitnessCalculations";
import { AIPlanResponse } from "../../types/ai";

const exercises = [
  {
    id: "bench",
    name: "Supino reto",
    sets: "4 séries",
    reps: "8–10 reps",
    rest: "90s descanso",
  },
  {
    id: "row",
    name: "Remada curvada",
    sets: "4 séries",
    reps: "8–10 reps",
    rest: "90s descanso",
  },
  {
    id: "squat",
    name: "Agachamento livre",
    sets: "5 séries",
    reps: "5 reps",
    rest: "120s descanso",
  },
];

export default function TrainingScreen() {
  const { profile } = useUserProfile();
  const [aiPlan, setAiPlan] = useState<AIPlanResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);

  const workoutDurationMinutes = 60;

  const workoutCalories = calculateCaloriesByExercise(
    profile.weightKg,
    workoutDurationMinutes,
    "weight_training"
  );

  async function loadLatestPlan() {
    try {
      setIsLoadingPlan(true);
      const latestPlan = await fetchLatestAIPlan("training");
      setAiPlan(latestPlan);
    } catch (error) {
      console.log("Erro ao carregar treino IA:", error);
    } finally {
      setIsLoadingPlan(false);
    }
  }

  async function handleGeneratePlan() {
    setIsGenerating(true);

    try {
      const plan = await generateAIPlan({
        type: "training",
        name: profile.name,
        age: profile.age,
        heightCm: profile.heightCm,
        weightKg: profile.weightKg,
        goal: profile.goal,
        trainingLevel: profile.trainingLevel,
      });

      setAiPlan(plan);
      await saveAIPlan("training", plan);
    } catch (error) {
      console.log("Erro ao gerar treino IA:", error);
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
          <Text style={styles.title}>Treino IA</Text>
          <Text style={styles.subtitle}>
            Musculação, força, hipertrofia e progressão de carga.
          </Text>
        </View>

        <GameCard>
          <View style={styles.aiHeader}>
            <Bot color={colors.secondary} size={26} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Personal IA</Text>
              <Text style={styles.text}>
                Base atual: {profile.weightKg}kg, nível {profile.trainingLevel}, idade{" "}
                {profile.age} anos.
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
              <Text style={styles.buttonText}>GERAR TREINO</Text>
            )}
          </Pressable>
        </GameCard>

        {isLoadingPlan && (
          <GameCard>
            <ActivityIndicator color={colors.secondary} />
            <Text style={styles.loadingPlanText}>Carregando último treino...</Text>
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
              <Dumbbell color={colors.secondary} size={24} />
              <Text style={styles.statValue}>3/5</Text>
              <Text style={styles.statLabel}>Treinos</Text>
              <ProgressBar progress={60} />
            </GameCard>
          </View>

          <View style={styles.statItem}>
            <GameCard>
              <Flame color={colors.warning} size={24} />
              <Text style={styles.statValue}>{workoutCalories}</Text>
              <Text style={styles.statLabel}>Kcal</Text>
              <ProgressBar progress={70} />
            </GameCard>
          </View>

          <View style={styles.statItem}>
            <GameCard>
              <Trophy color={colors.success} size={24} />
              <Text style={styles.statValue}>+80</Text>
              <Text style={styles.statLabel}>XP hoje</Text>
              <ProgressBar progress={80} />
            </GameCard>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Treino de hoje</Text>

          {exercises.map((exercise) => (
            <GameCard key={exercise.id}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>

              <View style={styles.exerciseInfo}>
                <View style={styles.infoItem}>
                  <Repeat color={colors.secondary} size={18} />
                  <Text style={styles.infoText}>{exercise.sets}</Text>
                </View>

                <View style={styles.infoItem}>
                  <Dumbbell color={colors.secondary} size={18} />
                  <Text style={styles.infoText}>{exercise.reps}</Text>
                </View>

                <View style={styles.infoItem}>
                  <Timer color={colors.secondary} size={18} />
                  <Text style={styles.infoText}>{exercise.rest}</Text>
                </View>
              </View>
            </GameCard>
          ))}
        </View>

        <Text style={styles.warning}>
          O treino precisa ser adaptado caso exista dor, lesão ou limitação física.
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
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 4,
  },
  exerciseName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
  },
  exerciseInfo: {
    marginTop: 12,
    gap: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    color: colors.textMuted,
    fontWeight: "700",
  },
  warning: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    opacity: 0.8,
  },
});