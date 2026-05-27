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
import { useUserProfile } from "../context/UserProfileContext";
import { FitnessGoal } from "../types/fitness";

export default function EditProfileScreen() {
  const { profile, updateProfile } = useUserProfile();

  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(String(profile.age));
  const [heightCm, setHeightCm] = useState(String(profile.heightCm));
  const [weightKg, setWeightKg] = useState(String(profile.weightKg));
  const [goal, setGoal] = useState<FitnessGoal>(profile.goal);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (!name || !age || !heightCm || !weightKg) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    try {
      setIsSaving(true);

      await updateProfile({
        ...profile,
        name,
        age: Number(age),
        heightCm: Number(heightCm),
        weightKg: Number(weightKg),
        goal,
      });

      router.back();
    } catch (error) {
      Alert.alert(
        "Erro ao salvar",
        error instanceof Error ? error.message : "Não foi possível salvar o perfil."
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
          <Text style={styles.title}>Editar Perfil</Text>
          <Text style={styles.subtitle}>
            Ajuste seus dados para melhorar os cálculos de dieta, treino e corrida.
          </Text>

          <View style={styles.card}>
            <TextInput
              placeholder="Nome"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

            <TextInput
              placeholder="Idade"
              placeholderTextColor={colors.textMuted}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              placeholder="Altura em cm"
              placeholderTextColor={colors.textMuted}
              value={heightCm}
              onChangeText={setHeightCm}
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              placeholder="Peso em kg"
              placeholderTextColor={colors.textMuted}
              value={weightKg}
              onChangeText={setWeightKg}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <Text style={styles.sectionTitle}>Objetivo</Text>

          <View style={styles.options}>
            <OptionButton
              label="Emagrecer"
              active={goal === "lose_weight"}
              onPress={() => setGoal("lose_weight")}
            />

            <OptionButton
              label="Ganhar massa"
              active={goal === "gain_muscle"}
              onPress={() => setGoal("gain_muscle")}
            />

            <OptionButton
              label="Performance"
              active={goal === "performance"}
              onPress={() => setGoal("performance")}
            />

            <OptionButton
              label="Saúde"
              active={goal === "health"}
              onPress={() => setGoal("health")}
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
              <Text style={styles.buttonText}>SALVAR PERFIL</Text>
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

type OptionButtonProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function OptionButton({ label, active, onPress }: OptionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.optionButton, active && styles.optionButtonActive]}
    >
      <Text style={[styles.optionText, active && styles.optionTextActive]}>{label}</Text>
    </Pressable>
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
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 28,
    marginBottom: 14,
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  optionButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.secondary,
  },
  optionText: {
    color: colors.textMuted,
    fontWeight: "700",
  },
  optionTextActive: {
    color: colors.text,
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