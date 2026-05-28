import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { Trash2 } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { unlockAchievement } from "../services/achievementService";
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
  createWeightLog,
  deleteWeightLog,
  fetchWeightLogs,
  WeightLog,
} from "../services/weightService";

export default function WeightHistoryScreen() {
  const [weight, setWeight] = useState("");
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  async function loadLogs() {
    try {
      setIsLoading(true);
      const logsFromSupabase = await fetchWeightLogs();
      setLogs(logsFromSupabase);
    } catch (error) {
      console.log("Erro ao carregar pesos:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    if (!weight) {
      Alert.alert("Atenção", "Digite seu peso atual.");
      return;
    }

    try {
      setIsSaving(true);
      await createWeightLog(Number(weight));
      await unlockAchievement(
        "first_weight_log",
        "Peso registrado",
        "Você registrou seu primeiro peso no sistema."
      );
      setWeight("");
      await loadLogs();
    } catch (error) {
      Alert.alert(
        "Erro ao salvar",
        error instanceof Error ? error.message : "Não foi possível salvar o peso."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteWeightLog(id);
      await loadLogs();
    } catch (error) {
      console.log("Erro ao apagar peso:", error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadLogs();
    }, [])
  );

  const screenWidth = Dimensions.get("window").width;

  const chartData = {
    labels: logs.map((item) =>
      new Date(item.logDate).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      })
    ),
    datasets: [
      {
        data:
          logs.length > 0
            ? logs.map((item) => item.weightKg)
            : [0],
      },
    ],
  };

  return (
    <LinearGradient colors={["#050816", "#0B1026", "#111C44"]} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Histórico de Peso</Text>
          <Text style={styles.subtitle}>
            Registre seu peso e acompanhe sua evolução.
          </Text>

          <GameCard>
            <TextInput
              placeholder="Peso atual em kg"
              placeholderTextColor={colors.textMuted}
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              style={styles.input}
            />

            <Pressable
              style={[styles.button, isSaving && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <Text style={styles.buttonText}>SALVAR PESO</Text>
              )}
            </Pressable>
          </GameCard>

          {logs.length > 1 && (
            <GameCard>
              <Text style={styles.sectionTitle}>
                Evolução do Peso
              </Text>

              <LineChart
                data={chartData}
                width={Math.min(screenWidth - 40, 680)}
                height={220}
                yAxisSuffix="kg"
                chartConfig={{
                  backgroundGradientFrom: "#0B1026",
                  backgroundGradientTo: "#0B1026",
                  decimalPlaces: 1,
                  color: (opacity = 1) =>
                    `rgba(0, 229, 255, ${opacity})`,
                  labelColor: (opacity = 1) =>
                    `rgba(255,255,255,${opacity})`,
                }}
                bezier
                style={{
                  marginTop: 12,
                  borderRadius: 16,
                }}
              />
            </GameCard>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Registros</Text>

            {isLoading && (
              <GameCard>
                <ActivityIndicator color={colors.secondary} />
                <Text style={styles.loadingText}>Carregando histórico...</Text>
              </GameCard>
            )}

            {!isLoading && logs.length === 0 && (
              <GameCard>
                <Text style={styles.text}>Nenhum peso registrado ainda.</Text>
              </GameCard>
            )}

            {!isLoading &&
              logs.map((log) => (
                <GameCard key={log.id}>
                  <View style={styles.logHeader}>
                    <View>
                      <Text style={styles.weightValue}>{log.weightKg} kg</Text>
                      <Text style={styles.text}>{log.logDate}</Text>
                    </View>

                    <Pressable
                      onPress={() => handleDelete(log.id)}
                      style={styles.deleteButton}
                    >
                      <Trash2 color={colors.danger} size={18} />
                    </Pressable>
                  </View>
                </GameCard>
              ))}
          </View>

          <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
            <Text style={styles.secondaryButtonText}>VOLTAR</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
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
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  button: {
    marginTop: 16,
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
  section: {
    gap: 10,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },
  loadingText: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "700",
  },
  text: {
    color: colors.textMuted,
    marginTop: 6,
  },
  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  weightValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(239,68,68,0.12)",
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