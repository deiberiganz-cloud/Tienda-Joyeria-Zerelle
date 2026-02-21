import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
  screenOptions={{
    tabBarActiveTintColor: '#000', // Color negro para el icono seleccionado (lujo)
    tabBarInactiveTintColor: '#8E8E93', // Gris para los no seleccionados
    tabBarStyle: { height: 60, paddingBottom: 10 }, // Más espacio para que respire
    headerShown: false, // Quitamos el título de arriba para ganar espacio
  }}>
  <Tabs.Screen
    name="index"
    options={{
      title: 'Home', // O puedes dejarlo vacío "" para un look más limpio
      tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
    }}
  />
  <Tabs.Screen
    name="two"
    options={{
      title: 'Favorites',
      tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
    }}
  />
</Tabs>
  );
}
