import 'react-native-reanimated';
import { Stack } from 'expo-router';

import { CardsProvider } from '../storage/CardsContext';
import { ThemeProvider } from '../storage/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <CardsProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
            animationDuration: 280,
          }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="edit-card"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
        </Stack>
      </CardsProvider>
    </ThemeProvider>
  );
}
