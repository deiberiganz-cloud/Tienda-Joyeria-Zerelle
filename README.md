# 🛍️ Tienda Zerelle

Una aplicación móvil de e-commerce desarrollada con Expo, React Native y TypeScript. La aplicación permite a los usuarios navegar productos, agregarlos al carrito, marcar favoritos y gestionar su perfil.

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Scripts Disponibles](#scripts-disponibles)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Configuración Firebase](#configuración-firebase)
- [Hooks Principales](#hooks-principales)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)

## ✅ Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (para emulador Android)
- Xcode (para emulador iOS en macOS)

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone <url-repositorio>
cd Proyecto-Zerelle
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno**
- Crear un archivo `.env` en la raíz del proyecto
- Agregar las credenciales de Firebase:
```
EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

4. **Iniciar el servidor de desarrollo**
```bash
npm start
```

## 📱 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia el servidor de desarrollo de Expo |
| `npm run android` | Ejecuta la app en Android (requiere Android Studio/emulador) |
| `npm run ios` | Ejecuta la app en iOS (requiere Xcode, solo macOS) |
| `npm run web` | Ejecuta la app en navegador web |

## 📁 Estructura del Proyecto

```
├── app/                      # Rutas y pantallas (Expo Router)
│   ├── (tabs)/              # Pantallas principales con tabs
│   ├── details/             # Detalles del producto
│   ├── admin.tsx            # Panel de administración
│   ├── login.tsx            # Pantalla de login
│   ├── register.tsx         # Pantalla de registro
│   └── ...
├── components/              # Componentes reutilizables
│   ├── admin/              # Componentes administrativos
│   ├── auth/               # Componentes de autenticación
│   ├── home/               # Componentes de inicio
│   ├── product/            # Componentes de productos
│   └── profile/            # Componentes de perfil
├── hooks/                   # Hooks personalizados
│   ├── useProducts.ts      # Obtener productos de Firebase
│   ├── useAddToCart.ts     # Gestionar modal de carrito
│   ├── useAuthGuard.ts     # Proteger acciones sin autenticación
│   ├── useProfile.ts       # Gestionar perfil de usuario
│   ├── useFavoriteToggle.ts # Toggle de favoritos
│   └── ...
├── store/                   # Redux store
│   ├── index.ts            # Configuración del store
│   └── slices/             # Slices de Redux
├── domain/                  # Tipos y interfaces
├── database/               # Configuración de Firebase
├── constants/              # Constantes de la app
└── utils/                  # Funciones utilitarias
```

## 🔥 Configuración Firebase

### Estructura de la Base de Datos

**Colección: `products`**
```javascript
{
  id: string,
  nombre: string,
  descripcion: string,
  precio: number,
  marca: string,
  categoria: string,
  imagen: string,
  imagenes: string[],
  stock: number,
  rating: number,
  createdAt: timestamp
}
```

**Colección: `users`**
```javascript
{
  uid: string,
  displayName: string,
  email: string,
  photoURL: string,
  createdAt: timestamp
}
```

**Colección: `favorites`**
```javascript
{
  userId: string,
  productId: string,
  addedAt: timestamp
}
```

## 🎣 Hooks Principales

### `useProducts()`
Obtiene la lista de productos desde Firebase Firestore.

**Retorna:**
```typescript
{
  products: Product[];      // Lista de productos
  loading: boolean;         // Estado de carga
  error: string | null;     // Mensaje de error
}
```

**Ejemplo de uso:**
```typescript
const { products, loading, error } = useProducts();
```

---

### `useAddToCart()`
Maneja el modal y la cantidad de productos a agregar al carrito.

**Retorna:**
```typescript
{
  cantidad: number;
  modalVisible: boolean;
  openModal: () => void;
  closeModal: () => void;
  increaseQuantity: () => void;
  decreaseQuantity: () => void;
  confirmAddToCart: (producto) => void;
}
```

**Ejemplo de uso:**
```typescript
const { cantidad, modalVisible, openModal, confirmAddToCart } = useAddToCart();
```

---

### `useAuthGuard()`
Protege acciones que requieren autenticación.

**Retorna:**
```typescript
{
  showAuthModal: boolean;
  setShowAuthModal: (visible: boolean) => void;
  requireAuth: (action: () => void) => void;
}
```

**Ejemplo de uso:**
```typescript
const { requireAuth, showAuthModal } = useAuthGuard();

const handleFavorite = () => {
  requireAuth(() => {
    // Acción protegida
  });
};
```

---

### `useProfile()`
Gestiona el estado de autenticación y datos del usuario.

**Retorna:**
```typescript
{
  user: User | null;
  loading: boolean;
  handleLogout: () => Promise<void>;
}
```

**Ejemplo de uso:**
```typescript
const { user, handleLogout } = useProfile();
```

---

### `useFavoriteToggle(product)`
Toggle de un producto en favoritos.

**Parámetros:**
- `product`: Objeto con `id`, `nombre`, `precio`, `imagen`, `marca`

**Retorna:**
```typescript
{
  isFavorite: boolean;
  handleToggle: () => void;
}
```

---

### `useEditProfile()`
Maneja la edición del perfil del usuario.

**Retorna:**
```typescript
{
  user: User | null;
  displayName: string;
  phoneNumber: string;
  photoURI: string | null;
  saving: boolean;
  handleSelectProfileImage: () => Promise<void>;
  handleSaveProfile: () => Promise<void>;
}
```

---

### `useImagePicker()`
Accede a cámara y galería del dispositivo.

**Retorna:**
```typescript
{
  openCamera: () => Promise<ImageResult>;
  openGallery: () => Promise<ImageResult>;
}
```

---

### `useToggleFavorite()`
Gestiona favoritos a nivel de estado global.

**Retorna:**
```typescript
{
  isFavorite: (productId: string) => boolean;
  toggle: (product: FavoriteItem) => void;
}
```

---

## 🛠️ Tecnologías Utilizadas

- **React Native**: Framework para aplicaciones móviles
- **Expo**: Plataforma para desarrollar aplicaciones React Native
- **TypeScript**: Tipado estático para JavaScript
- **Firebase**: Backend y autenticación
- **Redux Toolkit**: Gestión de estado global
- **Expo Router**: Navegación basada en archivos
- **React Navigation**: Navegación avanzada

## 📦 Dependencias Principales

```json
{
  "expo": "^54.0.0",
  "react-native": "0.81.5",
  "react": "19.1.0",
  "firebase": "12.11.0",
  "@reduxjs/toolkit": "^2.11.2",
  "expo-router": "~6.0.23",
  "expo-image-picker": "~17.0.10"
}
```

## 🐛 Solución de Problemas

### Error: "Firebase initialization failed"
- Verificar que las variables de entorno están correctamente configuradas en `.env`
- Asegurar que Firebase tiene los datos de la aplicación correctos

### Error: "Cannot find module"
- Ejecutar `npm install` nuevamente
- Limpiar caché: `expo prebuild --clean`

### La cámara/galería no funciona
- Verificar permisos en `app.json`
- En Android: Los permisos se solicitan en tiempo de ejecución
- En iOS: Agregar descripción de uso en Info.plist

## 📝 Convenciones de Código

- **Hooks**: Prefijo `use` en minúsculas (ej: `useProducts`)
- **Componentes**: PascalCase (ej: `ProductCard`)
- **Tipos**: Interfaces con mayúscula inicial (ej: `Product`)
- **Archivos**: Snake_case para estilos, camelCase para componentes
- **Comentarios**: JSDoc en español para funciones públicas

## 🤝 Contribución

1. Crear una rama para la feature: `git checkout -b feature/nueva-feature`
2. Commit de cambios: `git commit -m 'Agregar nueva feature'`
3. Push a la rama: `git push origin feature/nueva-feature`
4. Crear un Pull Request

## 📄 Licencia

Este proyecto está bajo licencia MIT.

---

**¿Necesitas ayuda?** Consulta la documentación de [Expo](https://docs.expo.dev) y [Firebase](https://firebase.google.com/docs)
