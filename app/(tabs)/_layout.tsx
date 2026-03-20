/**
 * Material Top Tabs Navigator con Expo Router
 * Permite swipe entre pestañas con la barra en la parte inferior
 * Clean Architecture: Configuración centralizada en constants/navigation
 */

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Importar pantallas
import CartScreen from './cart';
import FavoritesScreen from './favorites';
import IndexScreen from './index';
import ProfileScreen from './profile';

// Configuración centralizada
import {
  NAVIGATION_OPTIONS,
  NAVIGATION_THEME,
  TABS_CONFIG,
  type TabRouteName,
} from '@/constants/navigation';

// Tipos para el navigator
type TabStackParamList = {
  index: undefined;
  favorites: undefined;
  cart: undefined;
  profile: undefined;
};

const Tab = createMaterialTopTabNavigator<TabStackParamList>();

// Componente de icono del tab
function TabBarIcon({
  name,
  color,
}: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={20} name={name} color={color} />;
}

// Componente de label personalizado (icono + texto)
function TabBarLabel({
  routeName,
  focused,
}: {
  routeName: TabRouteName;
  focused: boolean;
}) {
  const config = TABS_CONFIG.find((t) => t.name === routeName)!;
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

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="index"
      {...NAVIGATION_OPTIONS}
      screenOptions={({ route }) => ({
        // Configuración visual de la barra
        tabBarStyle: [
          styles.tabBar,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 },
        ],
        tabBarIndicatorStyle: styles.indicator,
        tabBarLabel: ({ focused }) => (
          <TabBarLabel routeName={route.name as TabRouteName} focused={focused} />
        ),
        // Colores
        tabBarActiveTintColor: NAVIGATION_THEME.colors.activeTint,
        tabBarInactiveTintColor: NAVIGATION_THEME.colors.inactiveTint,
        // Deshabilitar ripple effect en Android
        tabBarPressColor: 'transparent',
        // Gestos
        swipeEnabled: true,
        animationEnabled: true,
        lazy: true,
      })}
    >
      <Tab.Screen
        name="index"
        component={IndexScreen}
        options={{ title: 'Tienda' }}
      />
      <Tab.Screen
        name="favorites"
        component={FavoritesScreen}
        options={{ title: 'Favoritos' }}
      />
      <Tab.Screen
        name="cart"
        component={CartScreen}
        options={{ title: 'Carrito' }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: NAVIGATION_THEME.tabBar.height,
    backgroundColor: NAVIGATION_THEME.colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
    elevation: NAVIGATION_THEME.tabBar.elevation,
    shadowOpacity: NAVIGATION_THEME.tabBar.shadowOpacity,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowRadius: 2,
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
    top: 0,
  },
});
