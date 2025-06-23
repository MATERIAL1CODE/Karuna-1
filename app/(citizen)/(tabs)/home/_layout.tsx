import { Stack } from 'expo-router/stack';

export default function HomeTabLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="report" />
      <Stack.Screen name="donate" />
    </Stack>
  );
}