import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import { colors } from "../constants/theme";

export function AppLoadingScreen() {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(withTiming(1.08, { duration: 900 }), -1, true);
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <LinearGradient colors={["#050816", "#0B1026", "#111C44"]} style={styles.container}>
      <Animated.View entering={FadeIn.duration(500)} style={styles.content}>
        <Animated.View style={animatedLogoStyle}>
          <Image
            source={require("../../assets/images/evolvefit-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        <View style={styles.loadingBar}>
          <View style={styles.loadingFill} />
        </View>

        <Text style={styles.text}>Carregando sistema...</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    width: 240,
    height: 180,
  },
  loadingBar: {
    width: 220,
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
    overflow: "hidden",
    marginTop: 18,
  },
  loadingFill: {
    width: "65%",
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.secondary,
  },
  text: {
    color: colors.textMuted,
    marginTop: 14,
    fontWeight: "800",
  },
});