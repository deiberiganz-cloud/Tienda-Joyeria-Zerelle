import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

/**
 * Componente para los iconos de la barra inferior.
 * Usamos FontAwesome para mantener un estilo clásico y elegante.
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Color negro para el icono seleccionado (Estética Zerelle)
        tabBarActiveTintColor: '#000',
        // Ocultamos el encabezado superior para un diseño más limpio
        headerShown: false,
        // Estilo de la barra de pestañas
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          borderTopWidth: 0, // Quitamos la línea de arriba para más minimalismo
          elevation: 0,      // Quita sombra en Android
          shadowOpacity: 0,  // Quita sombra en iOS
        },
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tienda',
          tabBarIcon: ({ color }) => <TabBarIcon name="shopping-bag" color={color} />,
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color }) => <TabBarIcon name="heart-o" color={color} />,
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: 'Carrito',
          tabBarIcon: ({ color }) => <TabBarIcon name="shopping-cart" color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <TabBarIcon name="user-o" color={color} />,
        }}
      />
    </Tabs>
  );
}