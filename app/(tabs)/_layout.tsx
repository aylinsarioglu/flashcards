import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, Text, View, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cardRadius, getShadow, type ThemeColors } from '../../constants/theme';
import { spacing as dsSpacing } from '../../constants/spacing';
import { useTheme } from '../../storage/ThemeContext';

type TabIconName = keyof typeof Ionicons.glyphMap;

type TabConfig = {
  name: string;
  title: string;
  icon: TabIconName;
};

const TABS: TabConfig[] = [
  { name: 'index', title: 'Home', icon: 'home' },
  { name: 'study', title: 'Study', icon: 'book' },
  { name: 'add-card', title: 'Add Card', icon: 'add-circle' },
  { name: 'cards', title: 'Manage Cards', icon: 'albums' },
  { name: 'settings', title: 'Settings', icon: 'settings' },
];

const TAB_BAR_INSET = dsSpacing[16];

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
        width: 52,
        height: 36,
      }}>
      {focused ? (
        <View
          style={{
            position: 'absolute',
            width: 52,
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

export default function TabsLayout() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, dsSpacing[8]);
  const tabBarHeight = 62 + bottomInset;
  const contentBottomPadding = tabBarHeight + dsSpacing[24];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarHideOnKeyboard: true,
        sceneStyle: {
          paddingBottom: contentBottomPadding,
        },
        tabBarStyle: {
          position: 'absolute',
          left: TAB_BAR_INSET,
          right: TAB_BAR_INSET,
          bottom: bottomInset,
          height: tabBarHeight - bottomInset,
          paddingTop: dsSpacing[8],
          paddingBottom: dsSpacing[8],
          backgroundColor: colors.card,
          borderTopWidth: 0,
          borderRadius: cardRadius,
          borderWidth: 1,
          borderColor: colors.border,
          ...(Platform.OS === 'ios'
            ? getShadow('elevated', isDark)
            : { elevation: 12 }),
        },
        tabBarLabel: ({ focused, color, children }) => (
          <Text
            numberOfLines={1}
            style={{
              fontSize: 10,
              fontWeight: focused ? '700' : '600',
              color,
              marginTop: 2,
              maxWidth: 72,
              textAlign: 'center',
            }}>
            {children}
          </Text>
        ),
        tabBarItemStyle: {
          paddingVertical: dsSpacing[4],
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
