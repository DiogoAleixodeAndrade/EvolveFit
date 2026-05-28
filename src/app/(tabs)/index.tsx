import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { GameCard } from "../../components/GameCard";
import { MissionCard } from "../../components/MissionCard";
import { ProgressBar } from "../../components/ProgressBar";
import { colors } from "../../constants/theme";
import { useProgress } from "../../context/ProgressContext";
import { aiAssistants, playerStats } from "../../data/dashboard";
import { getXPByAction } from "../../services/fitnessCalculations";
import { unlockAchievement } from "../../services/achievementService";
import { getHunterRank, getRankColor } from "../../services/rankSystem";
import {
  fetchWeeklyGoals,
  WeeklyGoals,
} from "../../services/weeklyGoalService";
import {
  fetchWeeklySummary,
  WeeklySummary,
} from "../../services/weeklySummaryService";

export default function DashboardScreen() {
  const {
    missions,
    totalXP,
    level,
    levelProgress,
    xpInsideLevel,
    currentStreak,
    isLoadingProgress,
    completeMission,
  } = useProgress();

  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null);
  const [isLoadingWeeklySummary, setIsLoadingWeeklySummary] = useState(true);
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoals | null>(null);

  const hunterRank = getHunterRank(totalXP);
  const rankColor = getRankColor(hunterRank);

  const glow = useSharedValue(0.4);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
  }));

  async function loadWeeklySummary() {
    try {
      setIsLoadingWeeklySummary(true);
      const [summary, goals] = await Promise.all([
        fetchWeeklySummary(),
        fetchWeeklyGoals(),
      ]);

      setWeeklySummary(summary);
      setWeeklyGoals(goals);
      if (summary.mealsCount >= goals.mealsGoal) {
        await unlockAchievement(
          "weekly_meals_goal",
          "Mestre das refeições",
          "Você bateu sua meta semanal de refeições."
        );
      }

      if (summary.workoutsCount >= goals.workoutsGoal) {
        await unlockAchievement(
          "weekly_workouts_goal",
          "Guerreiro da semana",
          "Você bateu sua meta semanal de treinos."
        );
      }

      if (summary.runsCount >= goals.runsGoal) {
        await unlockAchievement(
          "weekly_runs_goal",
          "Corredor disciplinado",
          "Você bateu sua meta semanal de corridas."
        );
      }

      if (summary.runDistanceKm >= goals.distanceKmGoal) {
        await unlockAchievement(
          "weekly_distance_goal",
          "Caçador de quilômetros",
          "Você bateu sua meta semanal de distância."
        );
      }
    } catch (error) {
      console.log("Erro ao carregar resumo semanal:", error);
    } finally {
      setIsLoadingWeeklySummary(false);
    }
  }

  useEffect(() => {
    glow.value = withRepeat(withTiming(1, { duration: 1200 }), -1, true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWeeklySummary();
    }, [])
  );

  if (isLoadingProgress) {
    return (
      <LinearGradient colors={["#050816", "#0B1026", "#111C44"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.secondary} size="large" />
          <Text style={styles.loadingText}>Carregando sistema...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#050816", "#0B1026", "#111C44"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.welcome}>Bem-vindo, Caçador</Text>

          <Text style={[styles.title, { color: rankColor }]}>
            {hunterRank}-RANK · LEVEL {level}
          </Text>

          <Text style={styles.subtitle}>Sistema de evolução ativado</Text>
        </View>

        <Animated.View entering={FadeInDown.duration(600)} style={styles.xpAnimatedWrapper}>
          <Animated.View style={[styles.glow, glowStyle]} />

          <GameCard>
            <View style={styles.xpHeader}>
              <Text style={styles.xpLabel}>XP DO NÍVEL</Text>
              <Text style={styles.xpValue}>{xpInsideLevel} / 500</Text>
            </View>

            <ProgressBar progress={levelProgress} />
          </GameCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(180).duration(600)}>
          <GameCard>
            <View style={styles.rankSystemCard}>
              <Text style={styles.rankSystemLabel}>RANK DO CAÇADOR</Text>

              <Text style={[styles.rankSystemValue, { color: rankColor }]}>
                {hunterRank}-RANK
              </Text>

              <Text style={styles.rankSystemText}>
                Continue completando missões para evoluir seu rank e desbloquear conquistas.
              </Text>
            </View>
          </GameCard>
        </Animated.View>

        <GameCard>
          <Text style={styles.sectionTitle}>Resumo semanal</Text>

          {isLoadingWeeklySummary && (
            <Text style={styles.assistantDescription}>Carregando resumo...</Text>
          )}

          {!isLoadingWeeklySummary && weeklySummary && (
            <View style={styles.weeklyGrid}>
              <Text style={styles.weeklyItem}>🍽️ Refeições: {weeklySummary.mealsCount}</Text>
              <Text style={styles.weeklyItem}>
                💧 Água: {(weeklySummary.waterMl / 1000).toFixed(1)}L
              </Text>
              <Text style={styles.weeklyItem}>🏋️ Treinos: {weeklySummary.workoutsCount}</Text>
              <Text style={styles.weeklyItem}>🏃 Corridas: {weeklySummary.runsCount}</Text>
              <Text style={styles.weeklyItem}>
                📍 Km: {weeklySummary.runDistanceKm.toFixed(1)}
              </Text>
              <Text style={styles.weeklyItem}>
                ⚖️ Peso:{" "}
                {weeklySummary.latestWeightKg
                  ? `${weeklySummary.latestWeightKg}kg`
                  : "Sem registro"}
              </Text>
            </View>
          )}
        </GameCard>

        {weeklySummary && weeklyGoals && (
          <GameCard>
            <Text style={styles.sectionTitle}>Metas semanais</Text>

            <WeeklyGoalProgress
              label="🍽️ Refeições"
              current={weeklySummary.mealsCount}
              goal={weeklyGoals.mealsGoal}
            />

            <WeeklyGoalProgress
              label="💧 Água"
              current={Number((weeklySummary.waterMl / 1000).toFixed(1))}
              goal={weeklyGoals.waterLitersGoal}
              suffix="L"
            />

            <WeeklyGoalProgress
              label="🏋️ Treinos"
              current={weeklySummary.workoutsCount}
              goal={weeklyGoals.workoutsGoal}
            />

            <WeeklyGoalProgress
              label="🏃 Corridas"
              current={weeklySummary.runsCount}
              goal={weeklyGoals.runsGoal}
            />

            <WeeklyGoalProgress
              label="📍 Km"
              current={Number(weeklySummary.runDistanceKm.toFixed(1))}
              goal={weeklyGoals.distanceKmGoal}
              suffix="km"
            />
          </GameCard>
        )}

        <View style={styles.grid}>
          {playerStats.map((stat, index) => {
            const Icon = stat.icon;

            const value =
              stat.id === "xp"
                ? String(totalXP)
                : stat.id === "level"
                  ? String(level)
                  : stat.id === "missions"
                    ? String(missions.filter((mission) => mission.completed).length)
                    : stat.id === "streak"
                      ? String(currentStreak)
                      : stat.id === "rank"
                        ? hunterRank
                        : stat.value;

            return (
              <Animated.View
                key={stat.id}
                entering={FadeInRight.delay(index * 120).duration(500)}
                style={styles.gridItem}
              >
                <GameCard>
                  <Icon color={stat.iconColor} size={24} />
                  <Text style={styles.statValue}>{value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </GameCard>
              </Animated.View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Missões diárias</Text>

          {missions.map((mission, index) => (
            <Animated.View
              key={mission.id}
              entering={FadeInDown.delay(index * 100).duration(500)}
            >
              <Pressable onPress={() => completeMission(mission.id)}>
                <MissionCard
                  icon={
                    <Text style={[styles.missionIcon, mission.completed && styles.missionIconDone]}>
                      {mission.completed ? "✓" : "○"}
                    </Text>
                  }
                  title={mission.completed ? `${mission.title} concluída` : mission.title}
                  xp={`+${getXPByAction(mission.xpAction)} XP`}
                />
              </Pressable>
            </Animated.View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assistentes IA</Text>

          {aiAssistants.map((assistant) => {
            const Icon = assistant.icon;

            return (
              <GameCard key={assistant.id}>
                <View style={styles.assistantContent}>
                  <Icon color={colors.secondary} size={24} />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.assistantTitle}>{assistant.title}</Text>
                    <Text style={styles.assistantDescription}>{assistant.description}</Text>
                  </View>
                </View>
              </GameCard>
            );
          })}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function WeeklyGoalProgress({
  label,
  current,
  goal,
  suffix = "",
}: {
  label: string;
  current: number;
  goal: number;
  suffix?: string;
}) {
  const progress = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

  return (
    <View style={styles.weeklyGoalBox}>
      <View style={styles.weeklyGoalHeader}>
        <Text style={styles.weeklyItem}>{label}</Text>
        <Text style={styles.weeklyItem}>
          {current}/{goal}
          {suffix}
        </Text>
      </View>

      <ProgressBar progress={progress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: colors.textMuted,
    marginTop: 14,
    fontWeight: "700",
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
  header: {
    marginBottom: 8,
  },
  welcome: {
    color: colors.textMuted,
    fontSize: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    marginTop: 6,
    letterSpacing: 1,
  },
  subtitle: {
    color: colors.secondary,
    fontSize: 14,
    marginTop: 6,
    fontWeight: "700",
  },
  xpAnimatedWrapper: {
    position: "relative",
  },
  glow: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 24,
    backgroundColor: "rgba(0,229,255,0.22)",
  },
  xpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  xpLabel: {
    color: colors.textMuted,
    fontWeight: "800",
    fontSize: 12,
  },
  xpValue: {
    color: colors.text,
    fontWeight: "900",
  },
  rankSystemCard: {
    alignItems: "center",
    paddingVertical: 10,
  },
  rankSystemLabel: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },
  rankSystemValue: {
    fontSize: 42,
    fontWeight: "900",
    marginTop: 8,
  },
  rankSystemText: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  weeklyGrid: {
    marginTop: 12,
    gap: 8,
  },
  weeklyItem: {
    color: colors.textMuted,
    fontWeight: "800",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridItem: {
    width: "48%",
  },
  section: {
    marginTop: 10,
    gap: 10,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 4,
  },
  statValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 10,
  },
  statLabel: {
    color: colors.textMuted,
    marginTop: 4,
  },
  missionIcon: {
    color: colors.secondary,
    fontSize: 22,
    fontWeight: "900",
  },
  missionIconDone: {
    color: colors.success,
  },
  assistantContent: {
    flexDirection: "row",
    gap: 14,
  },
  assistantTitle: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 16,
  },
  assistantDescription: {
    color: colors.textMuted,
    marginTop: 4,
    lineHeight: 20,
  },
  weeklyGoalBox: {
    marginTop: 12,
    gap: 8,
  },
  weeklyGoalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
});