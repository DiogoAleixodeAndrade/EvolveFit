import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { GameCard } from "../components/GameCard";
import { colors } from "../constants/theme";
import {
  fetchWeeklyGoals,
  upsertWeeklyGoals,
  WeeklyGoals,
} from "../services/weeklyGoalService";

export default function WeeklyGoalsScreen() {
  const [goals, setGoals] = useState<WeeklyGoals | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  async function loadGoals() {
    try {
      setIsLoading(true);
      const data = await fetchWeeklyGoals();
      setGoals(data);
    } catch (error) {
      console.log("Erro ao carregar metas:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    if (!goals) return;

    try {
      setIsSaving(true);
      await upsertWeeklyGoals(goals);
      Alert.alert("Metas salvas", "Suas metas semanais foram atualizadas.");
      router.back();
    } catch (error) {
      Alert.alert(
        "Erro ao salvar",
        error instanceof Error ? error.message : "Não foi possível salvar as metas."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function updateGoal(key: keyof WeeklyGoals, value: string) {
    if (!goals) return;

    setGoals({
      ...goals,
      [key]: Number(value),
    });
  }

  useFocusEffect(
    useCallback(() => {
      loadGoals();
    }, [])
  );

  return (
    <LinearGradient colors={["#050816", "#0B1026", "#111C44"]} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Metas Semanais</Text>
          <Text style={styles.subtitle}>
            Ajuste suas metas de refeições, água, treino e corrida.
          </Text>

          {isLoading && (
            <GameCard>
              <ActivityIndicator color={colors.secondary} />
              <Text style={styles.loadingText}>Carregando metas...</Text>
            </GameCard>
          )}

          {!isLoading && goals && (
            <GameCard>
              <GoalInput
                label="Refeições na semana"
                value={String(goals.mealsGoal)}
                onChangeText={(value) => updateGoal("mealsGoal", value)}
              />

              <GoalInput
                label="Água na semana em litros"
                value={String(goals.waterLitersGoal)}
                onChangeText={(value) => updateGoal("waterLitersGoal", value)}
              />

              <GoalInput
                label="Treinos na semana"
                value={String(goals.workoutsGoal)}
                onChangeText={(value) => updateGoal("workoutsGoal", value)}
              />

              <GoalInput
                label="Corridas na semana"
                value={String(goals.runsGoal)}
                onChangeText={(value) => updateGoal("runsGoal", value)}
              />

              <GoalInput
                label="Distância semanal em km"
                value={String(goals.distanceKmGoal)}
                onChangeText={(value) => updateGoal("distanceKmGoal", value)}
              />

              <Pressable
                style={[styles.button, isSaving && styles.buttonDisabled]}
                onPress={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color={colors.text} />
                ) : (
                  <Text style={styles.buttonText}>SALVAR METAS</Text>
                )}
              </Pressable>
            </GameCard>
          )}

          <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
            <Text style={styles.secondaryButtonText}>VOLTAR</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

function GoalInput({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    width: "100%",
    maxWidth: Platform.OS === "web" ? 720 : "100%",
    alignSelf: "center",
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
  loadingText: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "700",
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    color: colors.text,
    fontWeight: "800",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  button: {
    marginTop: 10,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.text,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  secondaryButton: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  secondaryButtonText: {
    color: colors.textMuted,
    fontWeight: "900",
  },
});