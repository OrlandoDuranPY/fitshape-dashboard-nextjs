# API Client — Guía de uso

Cliente HTTP basado en **axios** con interceptores para autenticación automática y manejo de errores centralizado.

---

## Instalación de dependencias

```bash
npm install axios
```

---

## Importación

```ts
import {apiRequest} from "~/lib/api/axios";
import {ENDPOINTS} from "~/lib/api/endpoints";
```

---

## Estructura de ENDPOINTS

Centraliza todas las rutas en un objeto para evitar strings sueltos:

```ts
// lib/api/endpoints.ts
export const ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  PRODUCTS: {
    INDEX: "/products",
    SHOW: (id: number | string) => `/products/${id}`,
    STORE: "/products",
    UPDATE: (id: number | string) => `/products/${id}`,
    DELETE: (id: number | string) => `/products/${id}`,
  },
} as const;
```

---

## Tipado de respuestas

Define interfaces para las respuestas del servidor y pásalas como genérico a `apiRequest<T>`:

```ts
// Respuesta envuelta típica de una API Laravel / REST
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// Recurso específico
interface User {
  id: number;
  name: string;
  email: string;
}

// Uso con tipo completo
const response = await apiRequest<ApiResponse<User>>(ENDPOINTS.AUTH.ME, {
  method: "GET",
});

if (response.success) {
  console.log(response.data.name); // ✅ tipado completo
}
```

---

## CRUD — Ejemplos completos

### Index — Listado (con y sin parámetros)

```ts
// Sin parámetros
const response = await apiRequest<ApiResponse<Product[]>>(
  ENDPOINTS.PRODUCTS.INDEX,
  {method: "GET"},
);

// Con parámetros opcionales de filtrado / paginación
const response = await apiRequest<ApiResponse<PaginatedResponse<Product>>>(
  ENDPOINTS.PRODUCTS.INDEX,
  {
    method: "GET",
    params: {
      page: 1,
      per_page: 20,
      search: "camiseta", // si es undefined, se omite automáticamente
      category_id: undefined, // ← se ignora, no aparece en la URL
    },
  },
);
```

---

### Show — Obtener un recurso por ID

```ts
const response = await apiRequest<ApiResponse<Product>>(
  ENDPOINTS.PRODUCTS.SHOW(id),
  {method: "GET"},
);
```

---

### Store — Crear un nuevo recurso

```ts
const response = await apiRequest<ApiResponse<Product>>(
  ENDPOINTS.PRODUCTS.STORE,
  {
    method: "POST",
    data: {
      name: "Camiseta básica",
      price: 299,
      category_id: 3,
    },
  },
);
```

---

### Update — Actualizar un recurso existente

```ts
// PUT — reemplaza el recurso completo
const response = await apiRequest<ApiResponse<Product>>(
  ENDPOINTS.PRODUCTS.UPDATE(id),
  {
    method: "PUT",
    data: {name: "Camiseta premium", price: 399, category_id: 3},
  },
);

// PATCH — actualización parcial
const response = await apiRequest<ApiResponse<Product>>(
  ENDPOINTS.PRODUCTS.UPDATE(id),
  {
    method: "PATCH",
    data: {price: 349},
  },
);
```

---

### Destroy — Eliminar un recurso

```ts
await apiRequest<ApiResponse<null>>(ENDPOINTS.PRODUCTS.DELETE(id), {
  method: "DELETE",
});
```

---

## Patrón de hook de servicio

Encapsula la lógica de peticiones en custom hooks. Expón `isLoading`, `error` y los métodos que necesites.

```ts
// hooks/useProducts.ts
import {apiRequest} from "@/lib/api/axios";
import {ENDPOINTS} from "@/lib/api/endpoints";
import {useState} from "react";

interface Product {
  id: number;
  name: string;
  price: number;
}
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const useProducts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProducts = async (params?: {search?: string; page?: number}) => {
    setIsLoading(true);
    setError(null); // ← limpia error previo antes de cada petición
    try {
      const response = await apiRequest<ApiResponse<Product[]>>(
        ENDPOINTS.PRODUCTS.INDEX,
        {method: "GET", params},
      );
      if (response.success) {
        return response.data;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiRequest<ApiResponse<null>>(ENDPOINTS.PRODUCTS.DELETE(id), {
        method: "DELETE",
      });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {isLoading, error, getProducts, deleteProduct};
};
```

---

## Patrón de hook con autenticación (setSession / clearSession)

Cuando el servidor devuelve un token, guárdalo en el store con `setSession`. Al cerrar sesión usa `clearSession`.

```ts
// hooks/useAuth.ts
import {apiRequest} from "@/lib/api/axios";
import {ENDPOINTS} from "@/lib/api/endpoints";
import {useAuthStore} from "@/lib/store/authStore";
import {useState} from "react";

interface LoginData {
  email: string;
  password: string;
}
interface RegisterData {
  email: string;
  password: string;
  name: string; /* ... */
}
interface AuthPayload {
  token: string;
  user: User;
}
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {setSession, clearSession} = useAuthStore();

  const login = async (data: LoginData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRequest<ApiResponse<AuthPayload>>(
        ENDPOINTS.AUTH.LOGIN,
        {method: "POST", data},
      );
      if (response.success) {
        setSession(response.data.token, response.data.user); // ← persiste sesión
        return response.data;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRequest<ApiResponse>(ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        data,
      });
      if (response.success) {
        setSession(response.data.token, response.data.user);
        return response.data;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await apiRequest<ApiResponse<null>>(ENDPOINTS.AUTH.LOGOUT, {
        method: "POST",
      });
    } finally {
      clearSession(); // ← limpia siempre, aunque el server falle
      setIsLoading(false);
    }
  };

  return {isLoading, error, login, register, logout};
};
```

---

## Consumir un hook desde un componente

```tsx
// components/LoginForm.tsx
import {useAuth} from "@/hooks/useAuth";

export default function LoginForm() {
  const {login, isLoading, error} = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await login({
      email: form.get("email") as string,
      password: form.get("password") as string,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name='email' type='email' required />
      <input name='password' type='password' required />
      {error && <p className='text-red-500'>{error}</p>}
      <button type='submit' disabled={isLoading}>
        {isLoading ? "Cargando..." : "Entrar"}
      </button>
    </form>
  );
}
```

---

## Manejo de errores

Los errores de red y respuestas no-2xx lanzan un `Error` con el mensaje del servidor (`error.response.data.message`).

```ts
try {
  const response = await apiRequest<ApiResponse<Product>>(
    ENDPOINTS.PRODUCTS.SHOW(id),
    {method: "GET"},
  );
} catch (error) {
  // ✅ siempre verifica la instancia antes de leer .message
  if (error instanceof Error) {
    console.error(error.message);
  }
}
```

---

## Uso directo del cliente axios

Para casos avanzados (uploads, cancelaciones) importa la instancia directamente:

```ts
import apiClient from "~/lib/api/axios";

// Subir imagen con progreso
const formData = new FormData();
formData.append("image", file);

await apiClient.post(`/products/${id}/image`, formData, {
  headers: {"Content-Type": "multipart/form-data"},
  onUploadProgress: (e) => {
    const percent = Math.round((e.loaded * 100) / (e.total ?? 1));
    console.log(`${percent}%`);
  },
});

// Cancelar una petición
const controller = new AbortController();
const {data} = await apiClient.get("/products", {signal: controller.signal});
controller.abort();
```

---

## Referencia rápida

| Operación | Método HTTP | Ejemplo de endpoint             |
| --------- | ----------- | ------------------------------- |
| Index     | GET         | `ENDPOINTS.PRODUCTS.INDEX`      |
| Show      | GET         | `ENDPOINTS.PRODUCTS.SHOW(id)`   |
| Store     | POST        | `ENDPOINTS.PRODUCTS.STORE`      |
| Update    | PUT / PATCH | `ENDPOINTS.PRODUCTS.UPDATE(id)` |
| Destroy   | DELETE      | `ENDPOINTS.PRODUCTS.DELETE(id)` |
