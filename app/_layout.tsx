// 1. Librerías Externas y del Sistema (React, Expo, Redux)
import { useEffect } from 'react';
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// 2. Redux 
import { Provider } from 'react-redux';
import { store } from '../store/index'; // Importamos el "cerebro" de nuestra tienda (Redux Store)

// 3. Configuración de Navegación y Temas
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

// 4. Componentes y Hooks 
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
    /* 'store' */
    <Provider store={store}> 
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          {/* Pantalla principal de la tienda y pestañas */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          
          {/* Ventana modal de información */}
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Información' }} />
        </Stack>
      </ThemeProvider>

     {/*Cerramos el Provider */}
    </Provider>
  );
}