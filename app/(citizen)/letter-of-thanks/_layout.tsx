import { Stack } from 'expo-router/stack';

export default function LetterOfThanksLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
    </Stack>
  );
}