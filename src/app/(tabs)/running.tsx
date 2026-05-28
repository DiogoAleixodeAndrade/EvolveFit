import { LinearGradient } from "expo-linear-gradient";
import { Bot, Clock, Flame, Footprints, Gauge, Map, Trophy } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { GameCard } from "../../components/GameCard";
import { ProgressBar } from "../../components/ProgressBar";
import { colors } from "../../constants/theme";
import { useUserProfile } from "../../context/UserProfileContext";
import { generateAIPlan } from "../../services/ai";
import { fetchLatestAIPlan, saveAIPlan } from "../../services/aiPlanService";
import { calculateRunningCaloriesByDistance } from "../../services/fitnessCalculations";
import { AIPlanResponse } from "../../types/ai";
import { router, useFocusEffect } from "expo-router";
import { Plus, Trash2 } from "lucide-react-native";
import { useCallback } from "react";
import { deleteRun, fetchTodayRuns, Run } from "../../services/runService";

const runs = [
  {
    id: "easy",
    name: "Corrida leve",
    distance: "3 km",
    pace: "7:00/km",
    time: "21 min",
  },
  {
    id: "interval",
    name: "Intervalado",
    distance: "6 tiros",
    pace: "forte",
    time: "25 min",
  },
  {
    id: "long",
    name: "Longão",
    distance: "5 km",
    pace: "confortável",
    time: "40 min",
  },
];

export default function RunningScreen() {
  const { profile } = useUserProfile();
  const [aiPlan, setAiPlan] = useState<AIPlanResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);

  const [runsLogged, setRunsLogged] = useState<Run[]>([]);
  const [isLoadingRuns, setIsLoadingRuns] = useState(true);

  const weeklyDistanceKm = 12;

  const weeklyCalories = calculateRunningCaloriesByDistance(
    profile.weightKg,
    weeklyDistanceKm
  );

  const loggedDistanceKm = runsLogged.reduce((total, run) => total + run.distanceKm, 0);
const loggedCalories = runsLogged.reduce((total, run) => total + run.calories, 0);
const loggedDuration = runsLogged.reduce((total, run) => total + run.durationMinutes, 0);

const averagePace =
  loggedDistanceKm > 0
    ? loggedDuration / loggedDistanceKm
    : 0;

const averagePaceText =
  averagePace > 0
    ? `${Math.floor(averagePace)}:${String(Math.round((averagePace % 1) * 60)).padStart(2, "0")}`
    : "--:--";

  async function loadLatestPlan() {
    try {
      setIsLoadingPlan(true);
      const latestPlan = await fetchLatestAIPlan("running");
      setAiPlan(latestPlan);
    } catch (error) {
      console.log("Erro ao carregar plano de corrida:", error);
    } finally {
      setIsLoadingPlan(false);
    }
  }

  async function loadRuns() {
  try {
    setIsLoadingRuns(true);
    const runsFromSupabase = await fetchTodayRuns();
    setRunsLogged(runsFromSupabase);
  } catch (error) {
    console.log("Erro ao carregar corridas:", error);
  } finally {
    setIsLoadingRuns(false);
  }
}

async function handleDeleteRun(runId: string) {
  try {
    await deleteRun(runId);
    await loadRuns();
  } catch (error) {
    console.log("Erro ao apagar corrida:", error);
  }
}

  async function handleGeneratePlan() {
    setIsGenerating(true);

    try {
      const plan = await generateAIPlan({
        type: "running",
        name: profile.name,
        age: profile.age,
        heightCm: profile.heightCm,
        weightKg: profile.weightKg,
        goal: profile.goal,
        trainingLevel: profile.trainingLevel,
      });

      setAiPlan(plan);
      await saveAIPlan("running", plan);
    } catch (error) {
      console.log("Erro ao gerar plano de corrida:", error);
    } finally {
      setIsGenerating(false);
    }
  }

  useFocusEffect(
  useCallback(() => {
    loadRuns();
  }, [])
);

  useEffect(() => {
    loadLatestPlan();
  }, []);

  return (
    <LinearGradient colors={["#050816", "#0B1026", "#111C44"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <Text style={styles.title}>Corrida IA</Text>
          <Text style={styles.subtitle}>
            Planos de corrida, pace, distância e evolução cardiovascular.
          </Text>
        </View>

        <GameCard>
          <View style={styles.aiHeader}>
            <Bot color={colors.secondary} size={26} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Corredor IA</Text>
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
              <Text style={styles.buttonText}>GERAR PLANO DE CORRIDA</Text>
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
              <Map color={colors.secondary} size={24} />
              <Text style={styles.statValue}>{loggedDistanceKm.toFixed(1)} km</Text>
              <Text style={styles.statLabel}>Semana</Text>
              <ProgressBar progress={48} />
            </GameCard>
          </View>

          <View style={styles.statItem}>
            <GameCard>
              <Gauge color={colors.secondary} size={24} />
              <Text style={styles.statValue}>{averagePaceText}</Text>
              <Text style={styles.statLabel}>Pace médio</Text>
              <ProgressBar progress={62} />
            </GameCard>
          </View>

          <View style={styles.statItem}>
            <GameCard>
              <Flame color={colors.warning} size={24} />
              <Text style={styles.statValue}>{loggedCalories}</Text>
              <Text style={styles.statLabel}>Kcal</Text>
              <ProgressBar progress={70} />
            </GameCard>
          </View>

          <View style={styles.statItem}>
            <GameCard>
              <Trophy color={colors.success} size={24} />
              <Text style={styles.statValue}>+60</Text>
              <Text style={styles.statLabel}>XP hoje</Text>
              <ProgressBar progress={60} />
            </GameCard>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plano da semana</Text>

          <View style={styles.sectionHeader}>
  <Text style={styles.sectionTitle}>Corridas de hoje</Text>

  <Pressable style={styles.addButton} onPress={() => router.push("/add-run" as any)}>
    <Plus color={colors.text} size={18} />
  </Pressable>
</View>

{isLoadingRuns && (
  <GameCard>
    <ActivityIndicator color={colors.secondary} />
    <Text style={styles.loadingPlanText}>Carregando corridas...</Text>
  </GameCard>
)}

{!isLoadingRuns && runsLogged.length === 0 && (
  <GameCard>
    <Text style={styles.text}>Nenhuma corrida registrada hoje.</Text>
  </GameCard>
)}

{!isLoadingRuns &&
  runsLogged.map((run) => (
    <GameCard key={run.id}>
      <View style={styles.runHeader}>
        <Text style={styles.runName}>{run.title}</Text>

        <Pressable onPress={() => handleDeleteRun(run.id)} style={styles.deleteButton}>
          <Trash2 color={colors.danger} size={18} />
        </Pressable>
      </View>

      <Text style={styles.text}>
        {run.distanceKm} km · {run.durationMinutes} min · {run.calories} kcal
      </Text>
    </GameCard>
  ))}

<Text style={styles.sectionTitle}>Sugestão da semana</Text>

          {runs.map((run) => (
            <GameCard key={run.id}>
              <Text style={styles.runName}>{run.name}</Text>

              <View style={styles.runInfo}>
                <View style={styles.infoItem}>
                  <Footprints color={colors.secondary} size={18} />
                  <Text style={styles.infoText}>{run.distance}</Text>
                </View>

                <View style={styles.infoItem}>
                  <Gauge color={colors.secondary} size={18} />
                  <Text style={styles.infoText}>{run.pace}</Text>
                </View>

                <View style={styles.infoItem}>
                  <Clock color={colors.secondary} size={18} />
                  <Text style={styles.infoText}>{run.time}</Text>
                </View>
              </View>
            </GameCard>
          ))}
        </View>

        <Text style={styles.warning}>
          Aumente volume e intensidade aos poucos. Em caso de dor, pare e procure orientação.
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
  width: "100%",
  maxWidth: Platform.OS === "web" ? 720 : "100%",
  alignSelf: "center",
  padding: 20,
  paddingTop: 60,
  paddingBottom: 40,
  gap: 14,
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
  runName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
  },
  runInfo: {
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
  sectionHeader: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
},
addButton: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: colors.primary,
  alignItems: "center",
  justifyContent: "center",
},
runHeader: {
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
});