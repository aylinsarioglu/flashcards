import { Stack } from 'expo-router';

import { CardsProvider } from '../storage/CardsContext';

export default function RootLayout() {
  return (
    <CardsProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </CardsProvider>
  );
}
