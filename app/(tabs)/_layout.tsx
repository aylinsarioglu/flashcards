import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import {
  Platform,
  Text,
  View,
  useWindowDimensions,
  type ColorValue,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cardRadius, getShadow, layout, type ThemeColors } from '../../constants/theme';
import { spacing as dsSpacing } from '../../constants/spacing';
import { useTheme } from '../../storage/ThemeContext';

type TabIconName = keyof typeof Ionicons.glyphMap;

type TabConfig = {
  name: 'index' | 'study' | 'add-card' | 'cards' | 'statistics' | 'settings';
  title: string;
  icon: TabIconName;
};

const TABS: TabConfig[] = [
  { name: 'index', title: 'Home', icon: 'home' },
  { name: 'study', title: 'Study', icon: 'book' },
  { name: 'add-card', title: 'Add', icon: 'add-circle' },
  { name: 'cards', title: 'Cards', icon: 'albums' },
  { name: 'statistics', title: 'Stats', icon: 'stats-chart' },
  { name: 'settings', title: 'Settings', icon: 'settings' },
];

const TAB_BAR_INSET = dsSpacing[16];
const TAB_BAR_MAX_WIDTH = layout.maxWidth + dsSpacing[32];

function TabBarIcon({
  name,
  color,
  size,
  focused,
  mutedColor,
  colors,
}: {
  name: TabIconName;
  color: ColorValue;
  size: number;
  focused: boolean;
  mutedColor: string;
  colors: ThemeColors;
}) {
  const iconColor = typeof color === 'string' ? color : mutedColor;

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: Platform.OS === 'web' ? 48 : 52,
        height: 36,
      }}>
      {focused ? (
        <View
          style={{
            position: 'absolute',
            width: Platform.OS === 'web' ? 48 : 52,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.primarySoft,
          }}
        />
      ) : null}
      <Ionicons
        name={focused ? name : (`${name}-outline` as TabIconName)}
        size={size}
        color={iconColor}
      />
    </View>
  );
}

function getTabBarHorizontalInset(screenWidth: number) {
  if (Platform.OS === 'web' && screenWidth > TAB_BAR_MAX_WIDTH + TAB_BAR_INSET * 2) {
    return (screenWidth - TAB_BAR_MAX_WIDTH) / 2;
  }

  return TAB_BAR_INSET;
}

export default function TabsLayout() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  const bottomInset = Math.max(insets.bottom, dsSpacing[8]);
  const tabBarBodyHeight = 62;
  const tabBarHeight = tabBarBodyHeight + bottomInset;
  const contentBottomPadding = tabBarHeight + dsSpacing[24];
  const horizontalInset = getTabBarHorizontalInset(screenWidth);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarHideOnKeyboard: true,
        sceneStyle: {
          flex: 1,
          paddingBottom: contentBottomPadding,
          ...(Platform.OS === 'web'
            ? {
                minHeight: '100%' as unknown as number,
                width: '100%',
                maxWidth: layout.maxWidth,
                alignSelf: 'center',
              }
            : {}),
        },
        tabBarStyle: {
          position: 'absolute',
          left: horizontalInset,
          right: horizontalInset,
          bottom: bottomInset,
          height: tabBarBodyHeight,
          paddingTop: dsSpacing[8],
          paddingBottom: dsSpacing[8],
          backgroundColor: colors.card,
          borderTopWidth: 0,
          borderRadius: cardRadius,
          borderWidth: 1,
          borderColor: colors.border,
          maxWidth: TAB_BAR_MAX_WIDTH,
          alignSelf: 'center',
          ...(Platform.OS === 'ios'
            ? getShadow('elevated', isDark)
            : Platform.OS === 'web'
              ? { boxShadow: isDark ? '0 12px 40px rgba(0,0,0,0.35)' : '0 12px 40px rgba(26,29,46,0.12)' }
              : { elevation: 12 }),
        },
        tabBarLabel: ({ focused, color, children }) => (
          <Text
            numberOfLines={1}
            style={{
              fontSize: Platform.OS === 'web' ? 11 : 10,
              fontWeight: focused ? '700' : '600',
              color,
              marginTop: 2,
              maxWidth: Platform.OS === 'web' ? 64 : 72,
              textAlign: 'center',
            }}>
            {children}
          </Text>
        ),
        tabBarItemStyle: {
          paddingVertical: dsSpacing[4],
          minWidth: Platform.OS === 'web' ? 56 : undefined,
          paddingHorizontal: Platform.OS === 'web' ? dsSpacing[4] : undefined,
        },
      }}>
      {TABS.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, size, focused }) => (
              <TabBarIcon
                name={icon}
                color={color}
                size={size}
                focused={focused}
                mutedColor={colors.muted}
                colors={colors}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
