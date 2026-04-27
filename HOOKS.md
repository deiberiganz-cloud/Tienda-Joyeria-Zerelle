# 📚 Documentación de Hooks Personalizados

Este documento proporciona una guía completa de todos los hooks personalizados utilizados en la aplicación Tienda Zerelle.

## 📑 Índice de Hooks

1. [Hooks de Productos](#hooks-de-productos)
2. [Hooks de Carrito](#hooks-de-carrito)
3. [Hooks de Autenticación](#hooks-de-autenticación)
4. [Hooks de Favoritos](#hooks-de-favoritos)
5. [Hooks de Perfil](#hooks-de-perfil)
6. [Hooks de Administración](#hooks-de-administración)
7. [Hooks Utilitarios](#hooks-utilitarios)

---

## 🛍️ Hooks de Productos

### `useProducts()`

Obtiene la lista completa de productos desde Firebase Firestore. Se ejecuta una única vez al montar el componente.

**Parámetros:** Ninguno

**Retorna:**
```typescript
{
  products: Product[];      // Array de productos
  loading: boolean;         // Estado de carga inicial
  error: string | null;     // Mensaje de error
}
```

**Uso:**
```typescript
import { useProducts } from '@/hooks';

export function HomeScreen() {
  const { products, loading, error } = useProducts();
  
  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error}</Text>;
  
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductCard product={item} />}
    />
  );
}
```

**Detalles Técnicos:**
- Ordena productos por nombre
- Convierte documentos de Firestore al tipo `Product`
- Solo ejecuta la consulta una vez (dependencias vacías)

---

### `useProductFilter(products)`

Filtra productos por categoría con optimización de rendimiento usando `useMemo`.

**Parámetros:**
- `products`: `Product[]` - Array de productos a filtrar

**Retorna:**
```typescript
{
  filteredProducts: Product[];     // Productos filtrados
  selectedCategory: string;        // ID de categoría seleccionada
  setSelectedCategory: (id: string) => void;
}
```

**Uso:**
```typescript
const { products } = useProducts();
const { filteredProducts, setSelectedCategory } = useProductFilter(products);

<FlatList
  data={filteredProducts}
  renderItem={({ item }) => <ProductCard product={item} />}
/>
```

**Categorías Disponibles:**
- `'1'` - Todas (por defecto)
- Basadas en `CATEGORIAS` del mock

---

### `useProductForm(initialProduct?)`

Hook completo para gestión de formularios de productos con validación.

**Parámetros:**
- `initialProduct?`: `Product` - Producto para edición (opcional)

**Retorna:**
```typescript
{
  formValues: ProductFormData;     // Valores actuales
  errors: ValidationError[];       // Errores de validación
  isDirty: boolean;                // Si hay cambios
  setFieldValue: (field, value) => void;
  validate: () => boolean;
  reset: (initialValues?) => void;
  clearErrors: () => void;
  setFormValues: (values) => void;
}
```

**Uso:**
```typescript
const form = useProductForm();

const handleSave = () => {
  if (form.validate()) {
    // Guardar en base de datos
    console.log(form.formValues);
  }
};
```

**Campos del Formulario:**
- `nombre`, `marca`, `precio`, `precio_original`
- `descripcion`, `descripcion_tecnica`
- `categoria`, `stock`, `material`
- `url`, `imagen`, `imagenes`

---

### `useProductAdmin()`

Hook completo para operaciones CRUD de productos (solo administrador).

**Parámetros:** Ninguno

**Retorna:**
```typescript
{
  products: Product[];
  loading: boolean;
  error: string | null;
  getProducts: () => Promise<void>;
  createProduct: (data: AdminFormData) => Promise<string>;
  updateProduct: (id: string, data: AdminFormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}
```

**Uso:**
```typescript
const admin = useProductAdmin();

const handleCreateProduct = async (formData) => {
  try {
    const productId = await admin.createProduct(formData);
    alert('Producto creado: ' + productId);
  } catch (error) {
    alert('Error: ' + error.message);
  }
};
```

---

## 🛒 Hooks de Carrito

### `useAddToCart()`

Maneja el modal y cantidad para agregar productos al carrito.

**Parámetros:** Ninguno

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

**Uso:**
```typescript
const {
  cantidad,
  modalVisible,
  openModal,
  closeModal,
  increaseQuantity,
  decreaseQuantity,
  confirmAddToCart,
} = useAddToCart();

return (
  <>
    <Button onPress={openModal}>Agregar al carrito</Button>
    
    <Modal visible={modalVisible} transparent>
      <Text>Cantidad: {cantidad}</Text>
      <Button onPress={decreaseQuantity}>-</Button>
      <Button onPress={increaseQuantity}>+</Button>
      <Button onPress={() => confirmAddToCart(product)}>
        Confirmar
      </Button>
      <Button onPress={closeModal}>Cancelar</Button>
    </Modal>
  </>
);
```

**Características:**
- Cantidad mínima: 1
- Al cerrar modal, resetea cantidad a 1
- Agrega al carrito de Redux directamente

---

### `useCartSync()`

Sincroniza el carrito entre Redux y Firestore automáticamente.

**Parámetros:** Ninguno

**Automático:**
- Carga carrito de Firestore al autenticarse
- Guarda cambios en Firestore con debounce de 300ms
- Limpia carrito local al desautenticarse

**Estructura en Firestore:**
```
users/{userId}/
  └─ cart/
      └─ data: {
           items: CartItem[]
         }
```

---

## 🔐 Hooks de Autenticación

### `useAuthGuard()`

Protege acciones que requieren autenticación.

**Parámetros:** Ninguno

**Retorna:**
```typescript
{
  showAuthModal: boolean;
  setShowAuthModal: (visible: boolean) => void;
  requireAuth: (action: () => void) => void;
}
```

**Uso:**
```typescript
const { requireAuth, showAuthModal, setShowAuthModal } = useAuthGuard();

const handleFavorite = () => {
  requireAuth(() => {
    // Esta función solo se ejecuta si usuario está autenticado
    toggleFavorite(productId);
  });
};

return (
  <>
    <Button onPress={handleFavorite}>
      ❤️ Agregar a favoritos
    </Button>
    
    <AuthModal 
      visible={showAuthModal}
      onClose={() => setShowAuthModal(false)}
    />
  </>
);
```

---

### `useProfile()`

Gestiona estado de autenticación y datos del usuario.

**Parámetros:** Ninguno

**Retorna:**
```typescript
{
  user: User | null;
  loading: boolean;
  handleLogout: () => Promise<void>;
}
```

**Uso:**
```typescript
const { user, handleLogout } = useProfile();

if (!user) {
  return <Text>No autenticado</Text>;
}

return (
  <>
    <Text>Bienvenido {user.displayName}</Text>
    <Text>{user.email}</Text>
    <Button onPress={handleLogout}>Cerrar sesión</Button>
  </>
);
```

**Características:**
- Sincroniza automáticamente con Firebase Auth
- Actualiza Redux al cambiar estado de autenticación
- Listener de autenticación se limpia al desmontar

---

### `useEditProfile()`

Maneja edición del perfil del usuario.

**Parámetros:** Ninguno

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

**Uso:**
```typescript
const {
  displayName,
  photoURI,
  saving,
  handleSelectProfileImage,
  handleSaveProfile,
} = useEditProfile();

return (
  <>
    <TouchableOpacity onPress={handleSelectProfileImage}>
      <Avatar uri={photoURI} />
    </TouchableOpacity>
    
    <TextInput
      value={displayName}
      onChangeText={setDisplayName}
      placeholder="Nombre"
    />
    
    <Button 
      onPress={handleSaveProfile}
      disabled={saving}
      title={saving ? 'Guardando...' : 'Guardar cambios'}
    />
  </>
);
```

---

## ❤️ Hooks de Favoritos

### `useFavoriteToggle(product)`

Toggle de un producto específico en favoritos.

**Parámetros:**
- `product.id`: `string` - ID del producto
- `product.nombre`: `string`
- `product.precio`: `number`
- `product.imagen`: `string`
- `product.marca`: `string`

**Retorna:**
```typescript
{
  isFavorite: boolean;
  handleToggle: () => void;
}
```

**Uso:**
```typescript
const { isFavorite, handleToggle } = useFavoriteToggle(product);

return (
  <TouchableOpacity onPress={handleToggle}>
    <Icon name={isFavorite ? 'heart' : 'heart-outline'} />
  </TouchableOpacity>
);
```

---

### `useToggleFavorite()`

Gestión global de favoritos desde Redux.

**Parámetros:** Ninguno

**Retorna:**
```typescript
{
  favorites: FavoriteItem[];
  favoritesCount: number;
  isFavorite: (productId: string) => boolean;
  toggle: (product: FavoriteItem) => void;
  add: (product: FavoriteItem) => void;
  remove: (productId: string) => void;
}
```

**Uso:**
```typescript
const { isFavorite, toggle, favoritesCount } = useToggleFavorite();

return (
  <>
    <Text>Favoritos: {favoritesCount}</Text>
    {isFavorite(productId) && <Text>❤️</Text>}
  </>
);
```

---

### `useFavoritesSync()`

Sincroniza favoritos entre Redux y Firestore automáticamente.

**Parámetros:** Ninguno

**Automático:**
- Carga favoritos de Firestore al autenticarse
- Guarda cambios en Firestore con debounce de 300ms
- Limpia favoritos locales al desautenticarse

**Estructura en Firestore:**
```
users/{userId}/
  └─ favorites/
      └─ data: {
           items: FavoriteItem[]
         }
```

---

## 👤 Hooks de Perfil

Consultar sección [Hooks de Autenticación](#hooks-de-autenticación) para:
- `useProfile()`
- `useEditProfile()`

---

## 🔧 Hooks de Administración

### `useProductAdmin()`

Consultar sección [Hooks de Productos](#hooks-de-productos).

---

## 🛠️ Hooks Utilitarios

### `useImagePicker()`

Selecciona imágenes desde galería o cámara.

**Parámetros:** Ninguno

**Retorna:**
```typescript
{
  openGallery: () => Promise<ImagePickerResult>;
  openCamera: () => Promise<ImagePickerResult>;
}
```

**ImagePickerResult:**
```typescript
{
  uri: string | null;       // URI de la imagen
  cancelled: boolean;       // Si fue cancelado
  error: string | null;     // Mensaje de error
}
```

**Uso:**
```typescript
const { openGallery, openCamera } = useImagePicker();

const handleSelectImage = async () => {
  Alert.alert('Seleccionar foto', '¿De dónde?', [
    {
      text: 'Cámara',
      onPress: async () => {
        const result = await openCamera();
        if (!result.error && result.uri) {
          setImage(result.uri);
        }
      },
    },
    {
      text: 'Galería',
      onPress: async () => {
        const result = await openGallery();
        if (!result.error && result.uri) {
          setImage(result.uri);
        }
      },
    },
  ]);
};
```

**Características:**
- Gestión automática de permisos
- Aspecto 1:1 (cuadrado) para avatares
- Compresión 80% de calidad
- Edición de imagen habilitada

---

## 🏗️ Patrones Comunes

### Cargar datos al montar componente

```typescript
function MyComponent() {
  const { data, loading, error } = useProducts();
  
  return loading ? <Loader /> : <List data={data} />;
}
```

### Formularios con validación

```typescript
function ProductForm() {
  const form = useProductForm();
  
  const handleSubmit = () => {
    if (form.validate()) {
      // Guardar...
    } else {
      // Mostrar errores
      form.errors.forEach(err => console.log(err));
    }
  };
}
```

### Proteger acciones con autenticación

```typescript
function FavoriteButton({ product }) {
  const { requireAuth } = useAuthGuard();
  const { handleToggle } = useFavoriteToggle(product);
  
  return (
    <Button onPress={() => requireAuth(handleToggle)}>
      Agregar a favoritos
    </Button>
  );
}
```

---

## ⚠️ Consideraciones Importantes

### Sincronización con Firestore
- `useCartSync` y `useFavoritesSync` sincronizan automáticamente
- No es necesario llamar manualmente a métodos de guardado
- Debounce de 300ms evita múltiples escrituras rápidas

### Validación de Formularios
- `useProductForm` valida usando `validateProduct()` de utils
- Errores se actualizan automáticamente al cambiar campos
- Usar `form.validate()` antes de enviar

### Permisos
- `useImagePicker` solicita permisos automáticamente
- Los permisos se solicitan en tiempo de ejecución en Android
- Los permisos se declaran en `app.json` para iOS

---

## 📝 Ejemplos Completos

### Pantalla de Productos con Filtro

```typescript
import { useProducts, useProductFilter, useAuthGuard } from '@/hooks';

export function ProductsScreen() {
  const { products, loading } = useProducts();
  const { filteredProducts, setSelectedCategory } = useProductFilter(products);
  const { requireAuth } = useAuthGuard();
  
  if (loading) return <ActivityIndicator />;
  
  return (
    <SafeAreaView>
      <CategorySelector onSelect={setSelectedCategory} />
      
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onAddToCart={() => requireAuth(() => {
              // Agregar al carrito
            })}
          />
        )}
      />
    </SafeAreaView>
  );
}
```

---

## 🤔 Preguntas Frecuentes

**P: ¿Los hooks de sincronización se ejecutan automáticamente?**
R: Sí, `useCartSync` y `useFavoritesSync` se ejecutan automáticamente cuando el usuario se autentica.

**P: ¿Cómo reseteo los favoritos?**
R: Los favoritos se limpian automáticamente al desautenticarse. Para forzar una recarga, use el componente con `useFavoritesSync`.

**P: ¿Puedo usar `useProducts` en múltiples componentes?**
R: Sí, pero cada componente hace su propia consulta. Considere compartir datos vía Redux para optimizar.

---

**Última actualización:** 27 de abril de 2026
