import { Stack } from 'expo-router/stack';

export default function ActivityTabLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="letter-of-thanks" />
      <Stack.Screen name="live-mission-view" />
    </Stack>
  );
}