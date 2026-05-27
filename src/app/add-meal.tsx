import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { useProgress } from "../context/ProgressContext";
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
import { createMeal } from "../services/mealService";

export default function AddMealScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [proteinGrams, setProteinGrams] = useState("");
  const [carbsGrams, setCarbsGrams] = useState("");
  const [calories, setCalories] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { completeMission } = useProgress();

  async function handleSave() {
    if (!name || !proteinGrams || !carbsGrams || !calories) {
      Alert.alert("Atenção", "Preencha nome, proteína, carboidratos e calorias.");
      return;
    }

    try {
      setIsSaving(true);

      await createMeal({
  name,
  description,
  proteinGrams: Number(proteinGrams),
  carbsGrams: Number(carbsGrams),
  calories: Number(calories),
});

await completeMission("meal");

router.back();
    } catch (error) {
      Alert.alert(
        "Erro ao salvar",
        error instanceof Error ? error.message : "Não foi possível salvar a refeição."
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
          <Text style={styles.title}>Nova Refeição</Text>
          <Text style={styles.subtitle}>Registre os macros da sua refeição.</Text>

          <View style={styles.card}>
            <TextInput
              placeholder="Nome da refeição"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

            <TextInput
              placeholder="Descrição"
              placeholderTextColor={colors.textMuted}
              value={description}
              onChangeText={setDescription}
              style={styles.input}
            />

            <TextInput
              placeholder="Proteína em gramas"
              placeholderTextColor={colors.textMuted}
              value={proteinGrams}
              onChangeText={setProteinGrams}
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              placeholder="Carboidratos em gramas"
              placeholderTextColor={colors.textMuted}
              value={carbsGrams}
              onChangeText={setCarbsGrams}
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              placeholder="Calorias"
              placeholderTextColor={colors.textMuted}
              value={calories}
              onChangeText={setCalories}
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
              <Text style={styles.buttonText}>SALVAR REFEIÇÃO</Text>
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