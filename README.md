# 🛍️ Tienda Zerelle

Aplicación móvil de e-commerce de joyería desarrollada con React Native, Expo y TypeScript. Permite navegar productos, agregar al carrito, marcar favoritos y gestionar perfil con foto.

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración Firebase](#configuración-firebase)
- [Scripts Disponibles](#scripts-disponibles)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Hooks Principales](#hooks-principales)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Cumplimiento de Requisitos](#cumplimiento-de-requisitos)

## ✅ Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- Expo Go instalado en el celular
- Android Studio (para emulador Android)

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone <url-repositorio>
cd Proyecto-Zerelle
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear un archivo `.env` en la raíz del proyecto.
Copiar el contenido de `.env.example` y completar
con las credenciales de Firebase:

```
EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id
EXPO_PUBLIC_ADMIN_EMAIL=admin@zerelle.com
```

> ⚠️ **Nota para evaluación**: El archivo `.env` con las
> credenciales reales fue entregado por separado por razones
> de seguridad Gracias. 

4. **Iniciar la app**
```bash
npx expo start
```

5. **Abrir en el celular**
   - Instalar **Expo Go** en el celular
   - Escanear el QR que aparece en la terminal

## 👤 Usuarios de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@zerelle.com | (ver .env entregado) |
| Usuario | (registrarse en la app) | - |

> El usuario **admin** tiene acceso al Panel de
> Administración desde la pantalla de Perfil.

## 🔥 Configuración Firebase

El proyecto usa Firebase con los siguientes servicios:

| Servicio | Uso |
|---------|-----|
| **Firestore** | Productos, carrito y favoritos |
| **Auth** | Autenticación email/password |

### Estructura en Firestore

```
products/
└── {productId}
    ├── nombre: string
    ├── precio: number
    ├── categoria: string
    ├── imagen: string
    ├── imagenes: string[]
    ├── stock: number
    └── ...

users/
└── {userId}/
    ├── cart/data
    │   └── items: CartItem[]
    └── favorites/data
        └── items: FavoriteItem[]
```

### Reglas de Seguridad Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Productos: lectura pública, escritura solo admin
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.token.email == 'admin@zerelle.com';
    }

    // Carrito y favoritos: solo el dueño
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }
  }
}
```

## 📱 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npx expo start` | Inicia el servidor de desarrollo |
| `npx expo start --clear` | Inicia limpiando caché |
| `npm run android` | Ejecuta en Android |
| `npm run ios` | Ejecuta en iOS (solo macOS) |

## 📁 Estructura del Proyecto

```
├── app/                      # Rutas (Expo Router)
│   ├── (tabs)/              # Pantallas con tabs
│   │   ├── index.tsx        # Home - lista de productos
│   │   ├── cart.tsx         # Carrito
│   │   ├── favorites.tsx    # Favoritos
│   │   └── profile/        # Perfil
│   ├── details/[id].tsx     # Detalle del producto
│   ├── admin.tsx            # Panel de administración
│   ├── login.tsx            # Login
│   ├── register.tsx         # Registro
│   └── edit-profile.tsx     # Editar perfil
│
├── components/              # Componentes reutilizables
│   ├── admin/              # CRUD de productos
│   ├── auth/               # Modal de autenticación
│   ├── home/               # Carrusel de categorías
│   ├── product/            # Tarjetas y galería
│   └── profile/            # Avatar y menú
│
├── hooks/                   # Custom hooks
│   ├── useCartSync.ts      # Sincroniza carrito con Firestore
│   ├── useFavoritesSync.ts # Sincroniza favoritos con Firestore
│   ├── useImagePicker.ts   # Cámara y galería
│   ├── useProductAdmin.ts  # CRUD de productos
│   └── ...
│
├── store/                   # Redux
│   ├── index.ts            # Store configurado
│   ├── productsApi.ts      # RTK Query
│   └── slices/             # authSlice, cartSlice, favoritesSlice
│
├── domain/                  # Tipos TypeScript
│   └── types.ts
│
├── database/               # Firebase
│   └── firebaseConfig.ts
│
├── constants/              # Colores y navegación
├── utils/                  # Funciones utilitarias
└── .env.example            # Variables de entorno (ejemplo)
```

## 🎣 Hooks Principales

### `useGetProductsQuery()` ⭐ RTK Query
Obtiene productos desde Firestore usando RTK Query con
`fakeBaseQuery`. Incluye caché automático: si los productos
ya se cargaron, no vuelve a consultar Firebase.

```typescript
const { data: products = [], isLoading } = useGetProductsQuery();
```

> Como Firebase no es una API REST convencional, se usa
> `fakeBaseQuery` para ejecutar el SDK de Firestore dentro
> del ciclo de vida de RTK Query.

---

### `useCartSync()`
Sincroniza el carrito entre Redux y Firestore.

- ✅ Carga el carrito desde Firestore al iniciar sesión
- ✅ Guarda cambios automáticamente en Firestore
- ✅ Limpia el carrito local al cerrar sesión

---

### `useFavoritesSync()`
Sincroniza favoritos entre Redux y Firestore.

- ✅ Carga favoritos desde Firestore al iniciar sesión
- ✅ Guarda cambios automáticamente en Firestore
- ✅ Limpia favoritos locales al cerrar sesión

---

### `useImagePicker()` 📷
Accede a cámara y galería del dispositivo.

- Solicita permisos automáticamente
- Compresión de imagen al 80%
- Maneja cancelación y permisos denegados

```typescript
const { openCamera, openGallery } = useImagePicker();
```

---

### `useAuthGuard()`
Protege acciones que requieren autenticación.

```typescript
const { requireAuth } = useAuthGuard();
requireAuth(() => dispatch(addToFavorites(product)));
```

---

### `useProductAdmin()`
CRUD completo de productos en Firestore.

```typescript
const { products, createProduct,
        updateProduct, deleteProduct } = useProductAdmin();
```

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| React Native | 0.81.5 | Framework móvil |
| Expo | ^54.0.0 | Plataforma de desarrollo |
| TypeScript | - | Tipado estático |
| Firebase Firestore | 12.11.0 | Base de datos |
| Firebase Auth | 12.11.0 | Autenticación |
| Redux Toolkit (RTK) | ^2.11.2 | Estado global |
| RTK Query | ^2.11.2 | Estado del servidor y caché |
| Expo Router | ~6.0.23 | Navegación por archivos |
| expo-image-picker | ~17.0.10 | Cámara y galería |

## 📊 Cumplimiento de Requisitos

| Requisito | Implementación | Estado |
|-----------|---------------|--------|
| Lista optimizada | FlatList en 7+ componentes | ✅ |
| Componentes reutilizables | 15+ componentes organizados por carpeta | ✅ |
| Documentación | README + JSDoc en hooks | ✅ |
| Navegación | Expo Router + Tabs + Stack dinámico | ✅ |
| useState | Múltiples componentes y hooks | ✅ |
| RTK | 3 slices (auth, cart, favorites) | ✅ |
| RTK Query + Firebase | productsApi con fakeBaseQuery | ✅ |
| Interfaz de dispositivo | Cámara y galería en editar perfil | ✅ |

## 🐛 Solución de Problemas

### Los productos no cargan
- Verificar que el `.env` tiene las credenciales correctas
- Verificar conexión a internet

### Error al iniciar sesión
```bash
npx expo start
```
Sin `--clear` para mantener la sesión activa.

### La cámara no funciona
- Verificar que el usuario aceptó los permisos
- Ir a Configuración del celular → Expo Go → Permisos

## 📝 Convenciones de Código

- **Hooks**: prefijo `use` en camelCase
- **Componentes**: PascalCase
- **Tipos**: Interfaces con mayúscula inicial
- **Comentarios**: JSDoc en español

## 📄 Licencia

Proyecto académico desarrollado para el curso de 
Programación con React Native + Expo + Firebase en CoderHouse.

> Mi primer Proyecto Desarrollado con ❤️ usando React Native + Expo + Firebase