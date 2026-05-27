import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { scheduleDailyReminders } from "../../services/notificationService";
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
} from "react-native";
import { colors } from "../../constants/theme";
import { signInWithGoogle } from "../../services/socialAuth";
import { supabase } from "../../services/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      Alert.alert("Erro ao entrar", error.message);
      return;
    }

    await scheduleDailyReminders();

    router.replace("/(tabs)" as any);
  }

  async function handleGoogleLogin() {
    try {
      setGoogleLoading(true);

      const result = await signInWithGoogle();

      if (result) {
        await scheduleDailyReminders();
        router.replace("/(tabs)" as any);
      }
    } catch (error) {
      Alert.alert(
        "Erro no Google",
        error instanceof Error ? error.message : "Não foi possível entrar."
      );
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <LinearGradient colors={["#050816", "#0B1026", "#111C44"]} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.logo}>EVOLVEFIT</Text>
          <Text style={styles.title}>Entrar no Sistema</Text>
          <Text style={styles.subtitle}>Acesse sua evolução fitness.</Text>

          <Pressable
            style={styles.socialButton}
            onPress={handleGoogleLogin}
            disabled={googleLoading || isLoading}
          >
            {googleLoading ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <>
                <Text style={styles.googleIcon}>G</Text>
                <Text style={styles.socialButtonText}>ENTRAR COM GOOGLE</Text>
              </>
            )}
          </Pressable>

          <Text style={styles.divider}>ou entre com e-mail</Text>

          <TextInput
            placeholder="E-mail"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />

          <TextInput
            placeholder="Senha"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <Pressable style={styles.button} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <Text style={styles.buttonText}>ENTRAR</Text>
            )}
          </Pressable>

          <Pressable onPress={() => router.push("/auth/register" as any)}>
            <Text style={styles.link}>Criar minha conta</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  logo: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 18,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "900",
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 8,
    marginBottom: 28,
  },
  socialButton: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    marginBottom: 12,
  },
  socialButtonText: {
    color: colors.text,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  googleIcon: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },
  divider: {
    color: colors.textMuted,
    textAlign: "center",
    marginVertical: 18,
    fontWeight: "700",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: colors.text,
    fontWeight: "900",
    letterSpacing: 1,
  },
  link: {
    color: colors.secondary,
    textAlign: "center",
    marginTop: 22,
    fontWeight: "800",
  },
});