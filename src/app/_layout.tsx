import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ProgressProvider } from "../context/ProgressContext";
import { UserProfileProvider } from "../context/UserProfileContext";

export default function RootLayout() {
  return (
    <UserProfileProvider>
      <ProgressProvider>
        <StatusBar style="light" />

        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: "#050816",
            },
          }}
        />
      </ProgressProvider>
    </UserProfileProvider>
  );
}