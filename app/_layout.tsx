import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { Platform, View } from 'react-native';

import { CardsProvider } from '../storage/CardsContext';
import { ThemeProvider } from '../storage/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <CardsProvider>
        <View style={{ flex: 1, ...(Platform.OS === 'web' ? { minHeight: '100vh' as unknown as number } : {}) }}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade',
              animationDuration: 240,
            }}>
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false, animation: 'fade' }}
            />
            <Stack.Screen
              name="edit-card"
              options={{
                headerShown: false,
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="statistics"
              options={{
                headerShown: false,
                animation: 'fade',
                animationDuration: 240,
              }}
            />
          </Stack>
        </View>
      </CardsProvider>
    </ThemeProvider>
  );
}
