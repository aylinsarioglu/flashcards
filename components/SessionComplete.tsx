import { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppButton from './AppButton';
import AppCard from './AppCard';
import {
  SessionCompleteActions,
  SessionCompleteAnimation,
  SessionCompleteHero,
  SessionCompleteStats,
} from './animations';
import { getShadow } from '../constants/theme';
import { radius } from '../constants/radius';
import { spacing as dsSpacing } from '../constants/spacing';
import { typography as dsTypography } from '../constants/typography';
import { useTheme } from '../storage/ThemeContext';

type SessionCompleteProps = {
  cardsReviewed: number;
  accuracyPercent: number;
  onStudyAgain: () => void;
  onBackHome: () => void;
};

function AnimatedSuccessCheck() {
  const { colors, isDark } = useTheme();
  const ringScale = useRef(new Animated.Value(0.85)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(ringOpacity, {
          toValue: 1,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(ringScale, {
          toValue: 1,
          friction: 7,
          tension: 90,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(checkOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(checkScale, {
          toValue: 1,
          friction: 6,
          tension: 120,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [checkOpacity, checkScale, ringOpacity, ringScale]);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: 168,
          height: 168,
          borderRadius: 84,
          backgroundColor: colors.successSoft + '55',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Animated.View
          style={{
            width: 132,
            height: 132,
            borderRadius: 66,
            backgroundColor: colors.successSoft,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: ringOpacity,
            transform: [{ scale: ringScale }],
            ...getShadow('soft', isDark),
          }}>
          <Animated.View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: colors.success,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: checkOpacity,
              transform: [{ scale: checkScale }],
            }}>
            <Ionicons name="checkmark" size={52} color={colors.onPrimary} />
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
}

type ResultStatProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  accent: string;
};

function ResultStat({ icon, label, value, accent }: ResultStatProps) {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surfaceElevated,
        borderRadius: radius[16],
        paddingVertical: dsSpacing[16],
        paddingHorizontal: dsSpacing[12],
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.borderLight,
        ...getShadow('soft', isDark),
      }}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: accent + '18',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: dsSpacing[8],
        }}>
        <Ionicons name={icon} size={18} color={accent} />
      </View>
      <Text
        style={[
          dsTypography.title,
          {
            color: colors.text,
            fontSize: 22,
            textAlign: 'center',
          },
        ]}>
        {value}
      </Text>
      <Text
        style={[
          dsTypography.caption,
          {
            color: colors.muted,
            textAlign: 'center',
            marginTop: dsSpacing[4],
          },
        ]}>
        {label}
      </Text>
    </View>
  );
}

export default function SessionComplete({
  cardsReviewed,
  accuracyPercent,
  onStudyAgain,
  onBackHome,
}: SessionCompleteProps) {
  const { colors } = useTheme();
  const cardLabel = cardsReviewed === 1 ? 'card' : 'cards';

  return (
    <SessionCompleteAnimation style={{ width: '100%' }}>
      <AppCard accentColor={colors.success} style={{ alignItems: 'center' }}>
        <SessionCompleteHero>
          <AnimatedSuccessCheck />
        </SessionCompleteHero>

        <Text
          style={[
            dsTypography.heading,
            {
              color: colors.text,
              textAlign: 'center',
              marginTop: dsSpacing[24],
              fontSize: 28,
            },
          ]}>
          Session Complete!
        </Text>
        <Text
          style={[
            dsTypography.body,
            {
              color: colors.muted,
              textAlign: 'center',
              marginTop: dsSpacing[8],
              marginBottom: dsSpacing[32],
              paddingHorizontal: dsSpacing[8],
            },
          ]}>
          You reviewed {cardsReviewed} {cardLabel}. Keep the momentum going!
        </Text>

        <SessionCompleteStats>
          <View
            style={{
              flexDirection: 'row',
              gap: dsSpacing[12],
              width: '100%',
              marginBottom: dsSpacing[32],
            }}>
            <ResultStat
              icon="layers-outline"
              label="Cards Reviewed"
              value={cardsReviewed}
              accent={colors.primary}
            />
            <ResultStat
              icon="analytics-outline"
              label="Accuracy"
              value={`${accuracyPercent}%`}
              accent={colors.success}
            />
            <ResultStat
              icon="time-outline"
              label="Study Time"
              value="— min"
              accent={colors.secondary}
            />
          </View>
        </SessionCompleteStats>

        <SessionCompleteActions>
          <View style={{ width: '100%', gap: dsSpacing[12] }}>
            <AppButton title="Study Again" onPress={onStudyAgain} />
            <AppButton title="Back Home" variant="outline" onPress={onBackHome} />
          </View>
        </SessionCompleteActions>
      </AppCard>
    </SessionCompleteAnimation>
  );
}
