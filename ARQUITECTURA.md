# 🏗️ Arquitectura del Proyecto

Guía técnica sobre la estructura y organización de Tienda Zerelle.

## 📐 Arquitectura General

```
Frontend (React Native + Expo)
    ↓
Redux Store (Gestión de estado global)
    ↓
Firebase (Backend: Auth + Firestore + Storage)
    ↓
REST APIs (Si aplica)
```

## 📂 Estructura de Carpetas

### `/app` - Rutas y Pantallas (Expo Router)

Utiliza **file-based routing** como Next.js.

```
app/
├── (tabs)/                 # Grupo de rutas con tabs
│   ├── _layout.tsx        # Configuración de tabs
│   ├── index.tsx          # Home screen
│   ├── cart.tsx           # Carrito
│   ├── favorites.tsx      # Favoritos
│   └── profile/
│       └── index.tsx
├── details/
│   └── [id].tsx           # Detalles dinámicos por ID
├── _layout.tsx            # Root layout
├── login.tsx              # Pantalla de login
├── register.tsx           # Pantalla de registro
├── admin.tsx              # Panel admin
└── ...
```

**Convenciones:**
- `_layout.tsx` → Configuración de navegación
- `[id].tsx` → Rutas dinámicas con parámetros
- `(grupo)/` → Agrupar rutas sin crear segmento en URL

---

### `/components` - Componentes Reutilizables

Componentes React que se importan y reutilizan.

```
components/
├── admin/                 # Componentes administrativos
│   ├── ProductForm.tsx
│   ├── ProductList.tsx
│   └── ConfirmDeleteModal.tsx
├── auth/                  # Autenticación
│   └── AuthModal.tsx
├── home/                  # Home screen
│   └── CategoryCarousel.tsx
├── product/               # Detalles de producto
│   ├── ProductGallery.tsx
│   ├── ProductInfo.tsx
│   ├── AddToCartModal.tsx
│   ├── FavoriteButton.tsx
│   └── ...
├── profile/               # Perfil de usuario
│   ├── ProfileHeader.tsx
│   ├── ProfileMenu.tsx
│   └── EditProfileForm.tsx
└── ...
```

**Principios:**
- Componentes pequeños y enfocados
- Props bien tipadas
- Sin lógica de estado global (usar hooks)

---

### `/hooks` - Hooks Personalizados

Lógica reutilizable del componente en forma de hooks.

```
hooks/
├── useProducts.ts         # Obtener productos de Firestore
├── useAddToCart.ts        # Modal de agregar al carrito
├── useAuthGuard.ts        # Protección de acciones
├── useProfile.ts          # Gestión de usuario
├── useFavoriteToggle.ts   # Toggle de favoritos
├── useToggleFavorite.ts   # Control global de favoritos
├── useEditProfile.ts      # Editar perfil
├── useImagePicker.ts      # Seleccionar imágenes
├── useCartSync.ts         # Sincronizar carrito con Firestore
├── useFavoritesSync.ts    # Sincronizar favoritos
├── useProductFilter.ts    # Filtrar productos
├── useProductForm.ts      # Formulario de productos
├── useProductAdmin.ts     # CRUD de productos
└── index.ts              # Exportar todos
```

**Ver:** [HOOKS.md](./HOOKS.md) para documentación detallada

---

### `/store` - Redux Store

Gestión de estado global con Redux Toolkit.

```
store/
├── index.ts              # Configuración del store
└── slices/
    ├── authSlice.ts      # Estado de autenticación
    ├── cartSlice.ts      # Estado del carrito
    └── favoritesSlice.ts # Estado de favoritos
```

**Estructura de Estado:**

```typescript
{
  auth: {
    user: {
      uid: string,
      displayName: string,
      email: string,
      photoURL: string
    } | null
  },
  cart: {
    items: CartItem[]
  },
  favorites: {
    items: FavoriteItem[]
  }
}
```

---

### `/domain` - Tipos e Interfaces

Definiciones de tipos TypeScript.

```
domain/
└── types.ts
    ├── Product
    ├── User
    ├── CartItem
    ├── FavoriteItem
    └── ...
```

---

### `/database` - Configuración de Firebase

```
database/
└── firebaseConfig.ts     # Inicialización de Firebase
```

---

### `/utils` - Funciones Utilitarias

```
utils/
├── parsePrice.ts         # Parsear precios
└── productValidation.ts  # Validación de formularios
```

---

### `/constants` - Valores Constantes

```
constants/
├── Colors.ts            # Colores del tema
└── navigation.ts        # Constantes de navegación
```

---

### `/mocks` - Datos Simulados

```
mocks/
└── categories.ts        # Categorías de productos
```

---

## 🔄 Flujo de Datos

### 1. **Flujo de Lectura (Obtener datos)**

```
Componente
    ↓
useProductos() / useProfile()
    ↓
Firebase Firestore
    ↓
Redux Store (estado local)
    ↓
Componente (re-render)
```

### 2. **Flujo de Escritura (Guardar datos)**

```
Usuario interactúa (Ej: agregar al carrito)
    ↓
Componente ejecuta función (confirmAddToCart)
    ↓
Dispatch Redux Action
    ↓
Redux Store se actualiza
    ↓
useCartSync() detecta cambio
    ↓
Guarda en Firestore (debounce 300ms)
    ↓
Componente re-renderiza (estado actualizado)
```

### 3. **Flujo de Autenticación**

```
Usuario hace login
    ↓
Firebase Auth valida credenciales
    ↓
useProfile() actualiza Redux
    ↓
useCartSync() y useFavoritesSync() cargan datos
    ↓
Componentes usan datos del store
```

---

## 🔐 Seguridad

### Autenticación
- Firebase Authentication (email/password)
- Tokens de sesión manejados por Firebase
- Protección automática con `useAuthGuard`

### Autorización
- Admin check en pantalla de administración
- Reglas de Firestore por usuario

### Validación
- Validación cliente con `useProductForm`
- Validación servidor en Firestore rules

---

## ⚡ Optimizaciones

### Performance
- **useMemo** en `useProductFilter` para evitar recálculos
- **useCallback** en hooks para estabilizar referencias
- **Lazy loading** de imágenes con Expo Image
- **Debounce** en sincronización (300ms)

### Estado
- Redux para estado global
- Hooks locales para estado de componente
- Sincronización automática con Firestore

### Renderizado
- FlatList con `keyExtractor`
- Componentes memo para prevenir re-renders innecesarios
- Actualización de estado en batch

---

## 📦 Dependencias Principales

### Frontend
```json
{
  "expo": "^54.0.0",
  "react-native": "0.81.5",
  "react": "19.1.0",
  "expo-router": "~6.0.23"
}
```

### Estado Global
```json
{
  "@reduxjs/toolkit": "^2.11.2",
  "react-redux": "^9.2.0"
}
```

### Backend
```json
{
  "firebase": "12.11.0"
}
```

### Funcionalidades
```json
{
  "expo-image-picker": "~17.0.10",
  "expo-font": "~14.0.11",
  "@react-native-async-storage/async-storage": "2.2.0"
}
```

---

## 🚀 Flujo de Desarrollo

### 1. **Crear nueva pantalla**

```typescript
// app/nueva-pantalla.tsx
import { View, Text } from 'react-native';
import { useProducts } from '@/hooks';

export default function NuevaPantalla() {
  const { products } = useProducts();
  return <View>...</View>;
}
```

### 2. **Crear nuevo componente**

```typescript
// components/MiComponente.tsx
interface Props {
  titulo: string;
  onPress: () => void;
}

export function MiComponente({ titulo, onPress }: Props) {
  return <Button title={titulo} onPress={onPress} />;
}
```

### 3. **Crear nuevo hook**

```typescript
// hooks/useMiLogica.ts
/**
 * Descripción del hook
 */
export function useMiLogica() {
  // Lógica...
  return { /* resultados */ };
}

// Agregar a hooks/index.ts
export { useMiLogica } from './useMiLogica';
```

### 4. **Agregar acción Redux**

```typescript
// store/slices/miSlice.ts
const miSlice = createSlice({
  name: 'mi',
  initialState,
  reducers: {
    miAccion: (state, action) => {
      // Actualizar estado
    }
  }
});
```

---

## 🧪 Testing

*Actualmente sin implementación de tests*

**Consideraciones para futuro:**
- Jest para unit tests
- React Testing Library para componentes
- Firebase emulator para tests de integración

---

## 📱 Multiplataforma

### Web
```bash
npm run web
```

### Android
```bash
npm run android
```
Requiere Android Studio/emulador

### iOS
```bash
npm run ios
```
Requiere Xcode y macOS

---

## 🔄 Sincronización de Datos

### Cart (Carrito)
- **Local:** Redux store
- **Persistencia:** Firestore
- **Sincronización:** useCartSync (automática)
- **Path:** `users/{userId}/cart/data`

### Favorites (Favoritos)
- **Local:** Redux store
- **Persistencia:** Firestore
- **Sincronización:** useFavoritesSync (automática)
- **Path:** `users/{userId}/favorites/data`

### User Profile (Perfil)
- **Local:** Redux store
- **Persistencia:** Firebase Auth + Firestore
- **Sincronización:** useProfile (automática)

---

## 📊 Base de Datos Firestore

### Colecciones

**`products`**
```
products/
├── {productId}
│   ├── id: string
│   ├── nombre: string
│   ├── descripcion: string
│   ├── precio: number
│   ├── marca: string
│   ├── categoria: string
│   ├── imagen: string
│   ├── imagenes: string[]
│   ├── stock: number
│   └── rating: number
```

**`users`**
```
users/
├── {userId}
│   ├── cart/
│   │   └── data: CartState
│   ├── favorites/
│   │   └── data: FavoritesState
│   └── profile/
│       └── (datos del usuario)
```

---

## ⚙️ Configuración y Ambiente

### Variables de Entorno

Crear archivo `.env`:
```
EXPO_PUBLIC_FIREBASE_API_KEY=xxx
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
EXPO_PUBLIC_FIREBASE_PROJECT_ID=xxx
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
EXPO_PUBLIC_FIREBASE_APP_ID=xxx
```

### app.json

Define:
- Nombre y versión
- Permisos (camera, media library)
- Splash screen
- Icono

---

## 🐛 Debugging

### Logs
```typescript
console.log('Debug:', data);
console.error('Error:', error);
```

### Redux DevTools
*Considerar instalar para desarrollo*

### Firebase Console
- Monitor de datos en tiempo real
- Logs de autenticación
- Métricas de uso

---

## 📈 Escalabilidad

### Si crece el número de usuarios
- Implementar paginación en `useProducts`
- Usar Firestore indexes para consultas complejas
- Considerar CDN para imágenes

### Si crece la complejidad de estado
- Dividir store en módulos más pequeños
- Implementar selector memoizados
- Considerar Zustand o Context API como alternativa

### Si crece la cantidad de componentes
- Crear carpeta `/shared` para componentes compartidos
- Organizar por feature en carpetas
- Crear storybook para documentación

---

**Última actualización:** 27 de abril de 2026
