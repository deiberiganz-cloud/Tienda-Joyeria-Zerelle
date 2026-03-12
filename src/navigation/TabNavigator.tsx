import CartScreen from '@/app/(tabs)/cart';
import FavoritesScreen from '@/app/(tabs)/favorites';
import HomeScreen from '@/app/(tabs)/index';
import ProfileScreen from '@/app/(tabs)/profile';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  NAVIGATION_OPTIONS,
  NAVIGATION_THEME,
  TABS_CONFIG,
  type TabRouteName,
} from '@/src/constants/navigation';

const Tab = createMaterialTopTabNavigator();

// Mapeo de componentes de pantalla
const screenComponents: Record<TabRouteName, React.ComponentType> = {
  index: HomeScreen,
  favorites: FavoritesScreen,
  cart: CartScreen,
  profile: ProfileScreen,
};

// Icono de tab personalizado
function TabBarIcon({
  name,
  color,
}: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={22} name={name} color={color} />;
}

// Label personalizado con icono arriba
function TabBarLabel({
  config,
  focused,
}: {
  config: (typeof TABS_CONFIG)[0];
  focused: boolean;
}) {
  const color = focused
    ? NAVIGATION_THEME.colors.activeTint
    : NAVIGATION_THEME.colors.inactiveTint;

  return (
    <View style={styles.tabItem}>
      <TabBarIcon name={config.iconName} color={color} />
      <Text style={[styles.tabLabel, { color }]} numberOfLines={1}>
        {config.title}
      </Text>
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="index"
      {...NAVIGATION_OPTIONS}
      screenOptions={({ route }) => ({
        tabBarStyle: styles.tabBar,
        tabBarIndicatorStyle: styles.indicator,
        tabBarLabel: ({ focused }) => {
          const config = TABS_CONFIG.find((t) => t.name === route.name)!;
          return <TabBarLabel config={config} focused={focused} />;
        },
        tabBarActiveTintColor: NAVIGATION_THEME.colors.activeTint,
        tabBarInactiveTintColor: NAVIGATION_THEME.colors.inactiveTint,
        tabBarPressColor: 'transparent', // Evita el efecto ripple en Android
      })}
    >
      {TABS_CONFIG.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={screenComponents[tab.name]}
          options={{
            title: tab.title,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: NAVIGATION_THEME.tabBar.height,
    paddingBottom: NAVIGATION_THEME.tabBar.paddingBottom,
    backgroundColor: NAVIGATION_THEME.colors.background,
    borderTopWidth: NAVIGATION_THEME.tabBar.borderTopWidth,
    elevation: NAVIGATION_THEME.tabBar.elevation,
    shadowOpacity: NAVIGATION_THEME.tabBar.shadowOpacity,
    borderTopColor: '#eee',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  indicator: {
    height: NAVIGATION_THEME.indicator.height,
    backgroundColor: NAVIGATION_THEME.indicator.backgroundColor,
    borderRadius: 2,
  },
});
