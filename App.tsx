import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SpaceHomeScreen } from './src/screens/SpaceHomeScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <SpaceHomeScreen />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
