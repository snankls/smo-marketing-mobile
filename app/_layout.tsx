import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,

        // 🔥 ADD THIS
        animation: "slide_from_right",

        // Optional (makes it smoother)
        gestureEnabled: true,
        animationDuration: 250,
      }}
    />
  );
}
