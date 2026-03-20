import FontAwesome from '@expo/vector-icons/FontAwesome';
import type { MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs';

export type TabRouteName = 'index' | 'favorites' | 'cart' | 'profile';

/** Configuración individual de cada pestaña */
export interface TabConfig {
  name: TabRouteName;
  title: string;
  iconName: React.ComponentProps<typeof FontAwesome>['name'];
  testID?: string;
}

export const TABS_CONFIG: TabConfig[] = [
  {
    name: 'index',
    title: 'Tienda',
    iconName: 'shopping-bag',
    testID: 'tab-tienda',
  },
  {
    name: 'favorites',
    title: 'Favoritos',
    iconName: 'heart-o',
    testID: 'tab-favoritos',
  },
  {
    name: 'cart',
    title: 'Carrito',
    iconName: 'shopping-cart',
    testID: 'tab-carrito',
  },
  {
    name: 'profile',
    title: 'Perfil',
    iconName: 'user-o',
    testID: 'tab-perfil',
  },
];

export const NAVIGATION_THEME = {
  colors: {
    /** Color primario de la app (negro) */
    primary: '#000000',
    /** Color del texto de pestaña activa */
    activeTint: '#000000',
    /** Color del texto de pestaña inactiva */
    inactiveTint: '#888888',
    /** Fondo de la barra de navegación */
    background: '#ffffff',
    /** Color del indicador (dorado) */
    indicator: '#d4af37',
  },
  tabBar: {
    /** Altura de la barra de pestañas */
    height: 70,
    /** Elevación para Android (sombra) */
    elevation: 0,
    /** Opacidad de sombra para iOS */
    shadowOpacity: 0.1,
    /** Ancho del borde superior */
    borderTopWidth: 0,
    paddingBottom: 10,
  },
  indicator: {
    /** Altura del indicador de pestaña activa */
    height: 3,
    /** Color del indicador */
    backgroundColor: '#d4af37',
  },
} as const;

export const NAVIGATION_OPTIONS: Partial<MaterialTopTabNavigationOptions> & {
  swipeEnabled: boolean;
  lazy: boolean;
  tabBarPosition: 'bottom' | 'top';
} = {
  /** Lazy loading: solo carga la pestaña cuando se visita */
  lazy: true,
  /** Habilita el swipe entre pestañas */
  swipeEnabled: true,
  /** Posición de la barra de pestañas: abajo */
  tabBarPosition: 'bottom',
  /** Animaciones al cambiar de pestaña */
  animationEnabled: true,
  /** Opciones de optimización */
  lazyPreloadDistance: 1, // Precarga la pestaña adyacente
};

export const GESTURE_CONFIG = {
  /**
   * Velocidad mínima para activar el swipe (más bajo = más sensible)
   */
  swipeVelocityThreshold: 0.3,
  /**
   * Distancia mínima para considerar un swipe
   */
  swipeDistanceThreshold: 10,
  /**
   * Configuración para el manejador de gestos
   * Importante: GestureHandlerRootView debe envolver la app en _layout.tsx
   */
  gestureHandlerProps: {
    minPointers: 1,
    maxPointers: 1,
    activeOffsetX: [-10, 10],
    failOffsetY: [-20, 20],
  },
} as const;

/**
 * Obtiene la configuración de una pestaña por su nombre
 */
export function getTabConfig(name: TabRouteName): TabConfig | undefined {
  return TABS_CONFIG.find((tab) => tab.name === name);
}

/**
 * Obtiene el índice de una pestaña en la configuración
 */
export function getTabIndex(name: TabRouteName): number {
  return TABS_CONFIG.findIndex((tab) => tab.name === name);
}

/**
 * Verifica si una ruta es una pestaña válida
 */
export function isValidTabRoute(name: string): name is TabRouteName {
  return TABS_CONFIG.some((tab) => tab.name === name);
}
