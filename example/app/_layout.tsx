import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

function ThemedStatusBar() {
  const { isDark } = useTheme();
  return (
    <StatusBar style={isDark ? "light" : "dark"} />
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ThemedStatusBar />
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
