# API Client — Guía de uso

Cliente HTTP basado en **axios** con interceptores para autenticación automática y manejo de errores centralizado.

---

## Instalación de dependencias

```bash
npm install axios sonner
```

---

## Importación

```ts
import {apiRequest} from "@/lib/api/client/axios";
import {ENDPOINTS} from "@/lib/api/endpoints";
```

---

## Interfaces base

```ts
// @/lib/api/interfaces/api-response.interface.ts
export interface ApiResponse {
  status: "success" | "error";
  status_code: number;
  message: string;
  data?: object; // presente solo en endpoints que devuelven recursos
}

// @/lib/api/interfaces/api-validation-error.interface.ts
export interface ApiValidationError {
  message: string;
  errors: Record<string, string[]>; // errores de validación por campo
}
```

> **¿Por qué `ApiValidationError` y no `Error`?**
> El interceptor de axios rechaza directamente `error.response?.data`, que es el objeto
> JSON del servidor — no una instancia de `Error`. Por eso en el `catch` se hace cast
> a `ApiValidationError` para acceder a `message` y `errors`.

### Acceder al `data` tipado

Como `data` es `object | undefined`, hay que hacer cast al tipo esperado:

```ts
const response = await apiRequest<ApiResponse>(ENDPOINTS.AUTH.LOGIN, {
  method: "POST",
  data: credentials,
});

const payload = response.data as {token: string; user: User};
setSession(payload.token, payload.user);
```

---

## Estructura de ENDPOINTS

```ts
// @/lib/api/endpoints.ts
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

## Patrón de hook — estructura base

Todo hook de servicio sigue esta estructura:

```ts
const [isLoading, setIsLoading] = useState(false);
const [errors, setErrors] = useState<Record<string, string[]>>({});
```

- **`isLoading`** — activo durante la petición, útil para deshabilitar botones.
- **`errors`** — errores de validación por campo (`{ email: ["El email ya existe"] }`).
  Se limpia con `setErrors({})` al inicio de cada petición.

---

## CRUD — Ejemplos completos

### Index — Listado (con y sin parámetros)

```ts
const getProducts = async (params?: {
  search?: string;
  page?: number;
  per_page?: number;
}): Promise<ApiResponse | null> => {
  setIsLoading(true);
  setErrors({});
  try {
    const response = await apiRequest<ApiResponse>(
      ENDPOINTS.PRODUCTS.INDEX,
      {method: "GET", params}, // los params undefined se filtran automáticamente
    );
    if (response.status === "success") {
      const products = response.data as Product[];
      return response;
    }
    return response;
  } catch (err) {
    const apiError = err as ApiValidationError;
    toast.error(apiError.message || "Error al obtener productos");
    setErrors(apiError.errors ?? {});
    return null;
  } finally {
    setIsLoading(false);
  }
};
```

---

### Show — Obtener un recurso por ID

```ts
const getProduct = async (id: number): Promise<ApiResponse | null> => {
  setIsLoading(true);
  setErrors({});
  try {
    const response = await apiRequest<ApiResponse>(
      ENDPOINTS.PRODUCTS.SHOW(id),
      {method: "GET"},
    );
    if (response.status === "success") {
      const product = response.data as Product;
    }
    return response;
  } catch (err) {
    const apiError = err as ApiValidationError;
    toast.error(apiError.message || "Error al obtener el producto");
    return null;
  } finally {
    setIsLoading(false);
  }
};
```

---

### Store — Crear un recurso

```ts
const createProduct = async (
  data: ProductData,
): Promise<ApiResponse | null> => {
  setIsLoading(true);
  setErrors({});
  try {
    const response = await apiRequest<ApiResponse>(ENDPOINTS.PRODUCTS.STORE, {
      method: "POST",
      data,
    });
    if (response.status === "success") {
      toast.success(response.message || "Producto creado");
    }
    return response;
  } catch (err) {
    const apiError = err as ApiValidationError;
    toast.error(apiError.message || "Error al crear el producto");
    setErrors(apiError.errors ?? {});
    return null;
  } finally {
    setIsLoading(false);
  }
};
```

---

### Update — Actualizar un recurso

```ts
const updateProduct = async (
  id: number,
  data: Partial<ProductData>,
): Promise<ApiResponse | null> => {
  setIsLoading(true);
  setErrors({});
  try {
    const response = await apiRequest<ApiResponse>(
      ENDPOINTS.PRODUCTS.UPDATE(id),
      {method: "PATCH", data},
    );
    if (response.status === "success") {
      toast.success(response.message || "Producto actualizado");
    }
    return response;
  } catch (err) {
    const apiError = err as ApiValidationError;
    toast.error(apiError.message || "Error al actualizar el producto");
    setErrors(apiError.errors ?? {});
    return null;
  } finally {
    setIsLoading(false);
  }
};
```

---

### Destroy — Eliminar un recurso

```ts
const deleteProduct = async (id: number): Promise<ApiResponse | null> => {
  setIsLoading(true);
  setErrors({});
  try {
    const response = await apiRequest<ApiResponse>(
      ENDPOINTS.PRODUCTS.DELETE(id),
      {method: "DELETE"},
    );
    if (response.status === "success") {
      toast.success(response.message || "Producto eliminado");
    }
    return response;
  } catch (err) {
    const apiError = err as ApiValidationError;
    toast.error(apiError.message || "Error al eliminar el producto");
    return null;
  } finally {
    setIsLoading(false);
  }
};
```

---

## Patrón de hook con autenticación

```ts
// hooks/useAuth.ts
import {apiRequest} from "@/lib/api/client/axios";
import {ENDPOINTS} from "@/lib/api/endpoints";
import type {ApiResponse} from "@/lib/api/interfaces/api-response.interface";
import type {ApiValidationError} from "@/lib/api/interfaces/api-validation-error.interface";
import {useAuthStore} from "@/lib/store/authStore";
import {useState} from "react";
import {toast} from "sonner";

interface AuthPayload {
  token: string;
  user: User;
}

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const {setSession, clearSession} = useAuthStore();

  // Register — el servidor solo confirma, no devuelve data
  const register = async (data: RegisterData): Promise<ApiResponse | null> => {
    setIsLoading(true);
    setErrors({});
    try {
      const response = await apiRequest<ApiResponse>(ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        data,
      });
      if (response.status === "success") {
        toast.success(response.message || "Registro exitoso");
      }
      return response;
    } catch (err) {
      const apiError = err as ApiValidationError;
      toast.error(apiError.message || "Error en el registro");
      setErrors(apiError.errors ?? {});
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Login — el servidor devuelve token + user en data
  const login = async (data: LoginData): Promise<ApiResponse | null> => {
    setIsLoading(true);
    setErrors({});
    try {
      const response = await apiRequest<ApiResponse>(ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        data,
      });
      if (response.status === "success") {
        const payload = response.data as AuthPayload;
        setSession(payload.token, payload.user);
        toast.success(response.message || "Bienvenido");
      }
      return response;
    } catch (err) {
      const apiError = err as ApiValidationError;
      toast.error(apiError.message || "Credenciales incorrectas");
      setErrors(apiError.errors ?? {});
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout — limpia sesión aunque el server falle
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await apiRequest<ApiResponse>(ENDPOINTS.AUTH.LOGOUT, {method: "POST"});
    } finally {
      clearSession();
      setIsLoading(false);
    }
  };

  return {isLoading, errors, register, login, logout};
};
```

---

## Consumir un hook desde un componente

```tsx
import {useAuth} from "@/hooks/useAuth";

export default function RegisterForm() {
  const {register, isLoading, errors} = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const result = await register({
      email: form.get("email") as string,
      password: form.get("password") as string,
      password_confirmation: form.get("password_confirmation") as string,
      name: form.get("name") as string,
      first_last_name: form.get("first_last_name") as string,
      metric_system: "metric",
      weight: form.get("weight") as string,
      height: form.get("height") as string,
      birth_date: form.get("birth_date") as string,
    });

    if (result?.status === "success") {
      // redirigir, limpiar form, etc.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name='email' type='email' required />
      {errors.email?.map((msg) => (
        <p key={msg} className='text-red-500 text-sm'>
          {msg}
        </p>
      ))}

      <input name='password' type='password' required />
      {errors.password?.map((msg) => (
        <p key={msg} className='text-red-500 text-sm'>
          {msg}
        </p>
      ))}

      <button type='submit' disabled={isLoading}>
        {isLoading ? "Registrando..." : "Registrarse"}
      </button>
    </form>
  );
}
```

---

## Referencia rápida

| Operación | Método HTTP | `data` en respuesta    |
| --------- | ----------- | ---------------------- |
| Index     | GET         | `T[]` (cast requerido) |
| Show      | GET         | `T` (cast requerido)   |
| Store     | POST        | generalmente ausente   |
| Update    | PUT / PATCH | generalmente ausente   |
| Destroy   | DELETE      | generalmente ausente   |
| Login     | POST        | `AuthPayload` (cast)   |
| Register  | POST        | ausente                |
