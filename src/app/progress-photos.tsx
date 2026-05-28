import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Camera, Trash2 } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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
  deleteProgressPhoto,
  fetchProgressPhotos,
  ProgressPhoto,
  uploadProgressPhoto,
} from "../services/progressPhotoService";

export default function ProgressPhotosScreen() {
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  async function loadPhotos() {
    try {
      setIsLoading(true);
      const photosFromSupabase = await fetchProgressPhotos();
      setPhotos(photosFromSupabase);
    } catch (error) {
      console.log("Erro ao carregar fotos:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permissão necessária", "Permita acesso às fotos para continuar.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: true,
    });

    if (result.canceled) {
      return;
    }

    try {
      setIsUploading(true);

      await uploadProgressPhoto(result.assets[0].uri, note);
      setNote("");
      await loadPhotos();
    } catch (error) {
      Alert.alert(
        "Erro ao enviar foto",
        error instanceof Error ? error.message : "Não foi possível enviar a foto."
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(photo: ProgressPhoto) {
    try {
      await deleteProgressPhoto(photo);
      await loadPhotos();
    } catch (error) {
      Alert.alert(
        "Erro ao apagar",
        error instanceof Error ? error.message : "Não foi possível apagar a foto."
      );
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadPhotos();
    }, [])
  );

  return (
    <LinearGradient colors={["#050816", "#0B1026", "#111C44"]} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Fotos de Evolução</Text>
          <Text style={styles.subtitle}>
            Registre sua evolução visual ao longo do tempo.
          </Text>

          <GameCard>
            <TextInput
              placeholder="Observação da foto"
              placeholderTextColor={colors.textMuted}
              value={note}
              onChangeText={setNote}
              style={styles.input}
            />

            <Pressable
              style={[styles.button, isUploading && styles.buttonDisabled]}
              onPress={handlePickImage}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <>
                  <Camera color={colors.text} size={18} />
                  <Text style={styles.buttonText}>ESCOLHER FOTO</Text>
                </>
              )}
            </Pressable>
          </GameCard>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Galeria</Text>

            {isLoading && (
              <GameCard>
                <ActivityIndicator color={colors.secondary} />
                <Text style={styles.loadingText}>Carregando fotos...</Text>
              </GameCard>
            )}

            {!isLoading && photos.length === 0 && (
              <GameCard>
                <Text style={styles.text}>Nenhuma foto registrada ainda.</Text>
              </GameCard>
            )}

            {!isLoading &&
              photos.map((photo) => (
                <GameCard key={photo.id}>
                  {photo.signedUrl && (
                    <Image source={{ uri: photo.signedUrl }} style={styles.photo} />
                  )}

                  <View style={styles.photoFooter}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.photoDate}>{photo.photoDate}</Text>
                      <Text style={styles.text}>{photo.note || "Sem observação"}</Text>
                    </View>

                    <Pressable
                      onPress={() => handleDelete(photo)}
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
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
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
  photo: {
    width: "100%",
    height: 280,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  photoFooter: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  photoDate: {
    color: colors.text,
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