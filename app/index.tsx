import { Redirect } from 'expo-router';

export default function IndexScreen() {
  // Directly redirect to home since there's no authentication
  return <Redirect href="/(home)" />;
}