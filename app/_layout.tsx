/**
 * Root Layout - Punto de entrada de la aplicación
 * Configura GestureHandlerRootView y la jerarquía de navegación
 */

import { useEffect } from 'react';
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

// Redux
import { Provider } from 'react-redux';
import { store } from '@/store/index';

// Navegación y Temas
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/components/useColorScheme';

// Evita que la Splash Screen se oculte antes de tiempo
SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    // GestureHandlerRootView debe envolver TODA la app para que los gestos funcionen
    <GestureHandlerRootView style={styles.container}>
      <Provider store={store}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          {/*
            Stack Navigator como raíz para manejar la jerarquía de gestos:
            - El Stack captura los gestos primero
            - Las pantallas del Stack (como details) pueden usar PinchGesture sin conflicto
            - Las tabs con swipe están en un nivel inferior del Stack
          */}
          <Stack
            screenOptions={{
              headerShown: false,
              gestureEnabled: true,
              gestureDirection: 'horizontal',
              animation: 'slide_from_right',
            }}
          >
            {/* Pantalla principal con tabs (swipe habilitado) */}
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
                // Deshabilitar el gesto de back en las tabs principales
                gestureEnabled: false,
              }}
            />

            {/* Pantalla de detalle de producto - con gestos de zoom habilitados */}
            <Stack.Screen
              name="details/[id]"
              options={{
                headerShown: false,
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                animation: 'slide_from_right',
                // El gestureResponseDistance controla el área donde el swipe funciona
                gestureResponseDistance: 50,
              }}
            />

            {/* Ventana modal */}
            <Stack.Screen
              name="modal"
              options={{
                presentation: 'modal',
                title: 'Información',
                headerShown: true,
                headerStyle: { backgroundColor: '#fff' },
                headerTintColor: '#000',
              }}
            />
          </Stack>
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
