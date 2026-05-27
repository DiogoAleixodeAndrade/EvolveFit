import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
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
import { colors } from "../constants/theme";
import { useProgress } from "../context/ProgressContext";
import { useUserProfile } from "../context/UserProfileContext";
import { calculateRunningCaloriesByDistance } from "../services/fitnessCalculations";
import { createRun } from "../services/runService";

export default function AddRunScreen() {
  const { profile } = useUserProfile();
  const { completeMission } = useProgress();

  const [title, setTitle] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (!title || !distanceKm || !durationMinutes) {
      Alert.alert("Atenção", "Preencha nome, distância e duração.");
      return;
    }

    try {
      setIsSaving(true);

      const calories = calculateRunningCaloriesByDistance(
        profile.weightKg,
        Number(distanceKm)
      );

      await createRun({
        title,
        distanceKm: Number(distanceKm),
        durationMinutes: Number(durationMinutes),
        calories,
      });

      await completeMission("running");

      router.back();
    } catch (error) {
      Alert.alert(
        "Erro ao salvar",
        error instanceof Error ? error.message : "Não foi possível salvar a corrida."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <LinearGradient colors={["#050816", "#0B1026", "#111C44"]} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Nova Corrida</Text>
          <Text style={styles.subtitle}>
            Registre distância, duração e ganhe XP pela missão de corrida.
          </Text>

          <View style={styles.card}>
            <TextInput
              placeholder="Nome da corrida"
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />

            <TextInput
              placeholder="Distância em km"
              placeholderTextColor={colors.textMuted}
              value={distanceKm}
              onChangeText={setDistanceKm}
              keyboardType="decimal-pad"
              style={styles.input}
            />

            <TextInput
              placeholder="Duração em minutos"
              placeholderTextColor={colors.textMuted}
              value={durationMinutes}
              onChangeText={setDurationMinutes}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <Pressable
            style={[styles.button, isSaving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <Text style={styles.buttonText}>SALVAR CORRIDA</Text>
            )}
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
            <Text style={styles.secondaryButtonText}>VOLTAR</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "900",
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    marginTop: 28,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 24,
    padding: 16,
    gap: 12,
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
    marginTop: 34,
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.text,
    fontWeight: "900",
    letterSpacing: 1,
  },
  secondaryButton: {
    marginTop: 14,
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