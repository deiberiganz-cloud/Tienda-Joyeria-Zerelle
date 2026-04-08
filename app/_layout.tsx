/**
 * Root Layout - Punto de entrada de la aplicación
 * Configura GestureHandlerRootView y la jerarquía de navegación
 */

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

// Firebase
import { auth } from '@/src/database/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';

// Redux
import { store } from '@/store/index';
import { Provider } from 'react-redux';

// Navegación y Temas
import { useColorScheme } from '@/components/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

// Pantallas
import LoginScreen from '@/src/screens/LoginScreen';

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

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Monitorear estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (loaded && !authLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, authLoading]);

  // Mostrar splash mientras se carga
  if (!loaded || authLoading) {
    return null;
  }

  // Si no hay usuario, mostrar LoginScreen
  if (!user) {
    return <LoginScreen />;
  }

  // Si hay usuario, mostrar el layout completo
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
            {/* Pantalla de login */}
            <Stack.Screen
              name="login"
              options={{
                headerShown: false,
                gestureEnabled: false,
                animation: 'slide_from_right',
              }}
            />

            {/* Pantalla de inicio */}
            <Stack.Screen
              name="home"
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
            />

            {/* Pantalla de registro */}
            <Stack.Screen
              name="register"
              options={{
                headerShown: false,
                gestureEnabled: false,
                animation: 'slide_from_right',
              }}
            />

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
                gestureResponseDistance: { start: 50, end: 50 },
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
