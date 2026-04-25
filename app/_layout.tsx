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
import { auth } from '@/database/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

// Redux
import { store } from '@/store/index';
import { clearUser, selectUser, setUser } from '@/store/slices/authSlice';
import { Provider, useDispatch, useSelector } from 'react-redux';

// Navegación y Temas
import { useColorScheme } from '@/components/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

// Pantallas

// Evita que la Splash Screen se oculte antes de tiempo
SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

/**
 * AppContent - Componente que sincroniza Firebase con Redux
 * Está dentro del Provider para poder acceder a Redux
 */
function AppContent() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [authLoading, setAuthLoading] = useState(true);

  // Sincronizar estado de autenticación de Firebase con Redux
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        dispatch(setUser({
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
        }));
      } else {
        dispatch(clearUser());
      }
      setAuthLoading(false);
    });

    return unsubscribe;
  }, [dispatch]);

  // Mostrar splash mientras se verifica autenticación
  if (authLoading) {
    return null;
  }

  // Auth Lazy: Mostrar siempre el layout completo
  // El onAuthStateChanged sincroniza Redux, pero no bloquea la navegación
  return <RootLayoutNav />;
}

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

  // Mostrar splash mientras se cargan las fuentes
  if (!loaded) {
    return null;
  }

  // Renderizar la app dentro del Provider para que AppContent pueda usar Redux
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    // GestureHandlerRootView debe envolver TODA la app para que los gestos funcionen
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          {/*
            Stack Navigator como raíz para manejar la jerarquía de gestos:
            - El Stack captura los gestos primero
            - Las pantallas del Stack (como details) pueden usar PinchGesture sin conflicto
            - Las tabs con swipe están en un nivel inferior del Stack
          */}
          <Stack
            initialRouteName="(tabs)"
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

              <Stack.Screen
                name="edit-profile"
                 options={{
                  headerShown: false,
                  gestureEnabled: true,
                   animation: 'slide_from_right',
  }}
/>
<Stack.Screen
  name="orders"
  options={{
    headerShown: false,
    gestureEnabled: true,
    animation: 'slide_from_right',
  }}
/>
<Stack.Screen
  name="addresses"
  options={{
    headerShown: false,
    gestureEnabled: true,
    animation: 'slide_from_right',
  }}
/>
<Stack.Screen
  name="settings"
  options={{
    headerShown: false,
    gestureEnabled: true,
    animation: 'slide_from_right',
  }}

            />
          </Stack>
        </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
