import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import {
  Platform,
  Pressable,
  Text,
  View,
  type ColorValue,
  type PressableProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cardRadius, getShadow, layout, spacing, type ThemeColors } from '../../constants/theme';
import { useTheme } from '../../storage/ThemeContext';

type TabIconName = keyof typeof Ionicons.glyphMap;

type AddTabButtonProps = {
  onPress?: PressableProps['onPress'];
  accessibilityState?: { selected?: boolean };
  colors: ThemeColors;
  isDark: boolean;
};

function TabIcon({
  name,
  color,
  size,
  focused,
  mutedColor,
}: {
  name: TabIconName;
  color: ColorValue;
  size: number;
  focused: boolean;
  mutedColor: string;
}) {
  const iconColor = typeof color === 'string' ? color : mutedColor;

  return (
    <Ionicons
      name={focused ? name : (`${name}-outline` as TabIconName)}
      size={size}
      color={iconColor}
    />
  );
}

function AddTabButton({
  onPress,
  accessibilityState,
  colors,
  isDark,
}: AddTabButtonProps) {
  const focused = accessibilityState?.selected;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={accessibilityState}
      style={({ pressed }) => ({
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        top: -12,
        opacity: pressed ? 0.9 : 1,
      })}>
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 4,
          borderColor: colors.card,
          ...getShadow('elevated', isDark),
        }}>
        <Ionicons
          name={focused ? 'add' : 'add-outline'}
          size={28}
          color={colors.onPrimary}
        />
      </View>
      <Text
        style={{
          fontSize: 11,
          fontWeight: '600',
          color: focused ? colors.primary : colors.muted,
          marginTop: 4,
        }}>
        Add Card
      </Text>
    </Pressable>
  );
}

export default function TabsLayout() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 8);
  const tabBarHeight = 64 + bottomInset;
  const contentBottomPadding = tabBarHeight + 24;

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
          paddingTop: 10,
          paddingBottom: 8,
          backgroundColor: colors.card,
          borderTopWidth: 0,
          borderRadius: cardRadius,
          borderWidth: 1,
          borderColor: colors.border,
          ...(Platform.OS === 'ios'
            ? getShadow('elevated', isDark)
            : { elevation: 12 }),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name="home"
              color={color}
              size={size}
              focused={focused}
              mutedColor={colors.muted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="study"
        options={{
          title: 'Study',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name="book"
              color={color}
              size={size}
              focused={focused}
              mutedColor={colors.muted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add-card"
        options={{
          title: 'Add Card',
          tabBarIcon: () => null,
          tabBarLabel: () => null,
          tabBarButton: (props) => (
            <AddTabButton
              onPress={props.onPress}
              accessibilityState={props.accessibilityState}
              colors={colors}
              isDark={isDark}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: 'Cards',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name="folder"
              color={color}
              size={size}
              focused={focused}
              mutedColor={colors.muted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name="settings"
              color={color}
              size={size}
              focused={focused}
              mutedColor={colors.muted}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const TAB_BAR_INSET = 16;
