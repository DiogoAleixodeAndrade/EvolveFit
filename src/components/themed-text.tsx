import { Text, TextProps, StyleSheet } from "react-native";
import { colors } from "../constants/theme";

export type ThemedTextProps = TextProps & {
  type?: "default" | "title" | "subtitle" | "link" | "code";
};

export function ThemedText({
  style,
  type = "default",
  ...rest
}: ThemedTextProps) {
  return <Text style={[styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: {
    color: colors.text,
    fontSize: 16,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "900",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
  },
  link: {
    color: colors.secondary,
    fontWeight: "800",
  },
  code: {
    color: colors.text,
    fontFamily: "monospace",
    fontSize: 12,
  },
});