import { Redirect, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { loadOnboardingComplete } from '../storage/onboardingStorage';
import { useTheme } from '../storage/ThemeContext';

export default function Index() {
  const { colors } = useTheme();
  const [isComplete, setIsComplete] = useState<boolean | null>(null);

  useEffect(() => {
    loadOnboardingComplete().then(setIsComplete);
  }, []);

  if (isComplete === null) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
        }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isComplete) {
    return <Redirect href={'/onboarding' as Href} />;
  }

  return <Redirect href="/(tabs)" />;
}
