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
          }}
        />
      </CardsProvider>
    </ThemeProvider>
  );
}
