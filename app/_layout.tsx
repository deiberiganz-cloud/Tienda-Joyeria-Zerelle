import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';

// Captura cualquier error que ocurra en el componente Layout
export { ErrorBoundary } from 'expo-router';

// Configuración para asegurar que al recargar la app se mantenga en los tabs
export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Evita que la pantalla de carga (Splash Screen) se oculte antes de cargar los recursos
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Cargamos las fuentes (SpaceMono y los iconos de FontAwesome)
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Si hay un error cargando las fuentes, lo lanzamos para saber qué pasó
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Cuando las fuentes terminan de cargar, ocultamos la pantalla de inicio
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Si aún no cargan los recursos, no mostramos nada (se queda la Splash Screen)
  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    /* ThemeProvider aplica el tema (Claro o Oscuro) automáticamente */
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Aquí le decimos que la pantalla principal son los (tabs) y ocultamos su título */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Esta es la configuración para ventanas emergentes tipo modal */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Información' }} />
      </Stack>
    </ThemeProvider>
  );
}