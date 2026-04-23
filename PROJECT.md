# FITSHAPE Dashboard — Documentación del Proyecto

> **Para agentes de IA:** Este archivo es la fuente de verdad sobre la arquitectura del proyecto. Actualízalo cuando se añadan nuevas páginas, componentes, hooks, dependencias o patrones relevantes. Indica la fecha del cambio al final del archivo.

---

## Stack

| Tecnología | Versión | Rol |
|---|---|---|
| Next.js | 16.x | Framework (Pages Router) |
| React | 19.x | UI |
| TypeScript | 5.x | Tipado |
| Tailwind CSS | 4.x | Estilos |
| shadcn/ui | — | Componentes UI (estilo radix-nova) |
| Zustand | 5.x | Estado global (auth) |
| Axios | 1.x | Cliente HTTP |
| Zod | 4.x | Validación de esquemas |
| react-hook-form | 7.x | Gestión de formularios |

---

## Arquitectura general

```
src/
├── components/        # Componentes React organizados por dominio
├── hooks/             # Custom hooks por feature
├── interfaces/        # Tipos/interfaces TypeScript del dominio
├── lib/               # API client, endpoints, schemas, store, utils
├── pages/             # Rutas (Pages Router)
├── routing/           # Constantes de rutas
├── stores/            # Stores de Zustand (referencia alternativa)
└── styles/            # globals.css (tokens de diseño, Tailwind)
```

> **Importante:** El proyecto usa **Pages Router** (no App Router). No hay carpeta `app/`.

---

## Rutas (Pages Router)

```
/pages
├── _app.tsx                          # Providers globales + RouteGuard
├── _document.tsx                     # Documento HTML base
├── index.tsx                         # / (Home)
├── custom.tsx                        # /custom

/pages/auth
├── login.tsx                         # /auth/login
├── register.tsx                      # /auth/register (stepper multi-paso)
├── email-verification.tsx            # /auth/email-verification
├── forgot-password.tsx               # /auth/forgot-password
├── terms-and-conditions.tsx          # /auth/terms-and-conditions
└── privacy-policy.tsx                # /auth/privacy-policy

/pages/dashboard
└── home.tsx                          # /dashboard/home

/pages/training
├── exercises.tsx                     # /training/exercises
├── routines.tsx                      # /training/routines
├── coachees.tsx                      # /training/coachees
└── plans/
    ├── index.tsx                     # /training/plans
    └── create.tsx                    # /training/plans/create

/pages/nutrition
└── foods.tsx                         # /nutrition/foods

/pages/account
├── profile.tsx                       # /account/profile
├── settings.tsx                      # /account/settings
└── subscription.tsx                  # /account/subscription
```

**Rutas centralizadas en:** `src/routing/routes.ts`

---

## Layouts

| Layout | Archivo | Uso |
|---|---|---|
| `AuthLayout` | `components/layouts/auth-layout.tsx` | Páginas de autenticación |
| `DashboardLayout` | `components/layouts/dashboard-layout.tsx` | Páginas del dashboard |

Los layouts se asignan por página mediante el patrón `getLayout`:
```typescript
PageComponent.getLayout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>
```

---

## Autenticación

- **Tipo:** Custom JWT-based (token de Sanctum desde el backend Laravel)
- **Sin:** next-auth ni Clerk
- **Flujo:**
  1. Usuario llena formulario → `useAuth()` hook → llama a API
  2. Backend devuelve `{ user, access_token }`
  3. Token guardado en Zustand store (persistido y encriptado en localStorage con CryptoJS.AES)
  4. Axios interceptor inyecta `Authorization: Bearer {token}` en cada petición
  5. `RouteGuard` en `_app.tsx` redirige usuarios no autenticados
- **Clave de encriptación:** `NEXT_PUBLIC_STORAGE_SECRET` (env var)
- **localStorage key:** `fitshape_auth`

---

## State Management — Zustand

**Archivo:** `src/lib/store/auth-store.ts`

```typescript
interface AuthState {
  user: UserInterface | null
  token: string | null
  isAuthenticated: boolean
  setSession: (user, token) => void
  clearSession: () => void
}
```

- Persistido con middleware `persist` de Zustand
- Encriptado con `CryptoJS.AES` antes de guardar en localStorage
- Exportado como hook `useAuthStore()`

---

## API Integration

**Backend:** Laravel API en `http://127.0.0.1:8000/api` (local)

### Capas de integración

| Capa | Archivo | Rol |
|---|---|---|
| HTTP Client | `src/lib/api/client/axios.ts` | Axios con interceptores; inyecta Bearer token automáticamente |
| Endpoints | `src/lib/api/endpoints.ts` | Centraliza todas las URLs como constantes |
| Hooks | `src/hooks/**` | Hooks por feature que consumen el cliente; manejan loading/error/data |

### Endpoints definidos

```
ENDPOINTS.AUTH       → register, login, forgot_password, logout
ENDPOINTS.TRAINING   → exercises, plans, store_plan, coach_clients
ENDPOINTS.CATALOGS   → genders_without_session, genders, coaches, users
```

### Formato de respuesta esperado

```typescript
interface ApiResponse<T> {
  status: "success" | "error"
  status_code: number
  message: string
  data?: T
}
```

---

## Custom Hooks

| Hook | Archivo | Métodos principales |
|---|---|---|
| `useAuth` | `hooks/auth/use-auth.ts` | `register()`, `login()`, `forgotPassword()`, `logout()` |
| `useTraining` | `hooks/training/use-training.ts` | `getExercices(params)` |
| `usePlans` | `hooks/training/use-plans.ts` | `getPlans(params)`, `storePlan(data)` |
| `useCoachClients` | `hooks/training/use-coach-clients.ts` | `getCoachClients(params)`, `storeCoachClient(data)`, `updateCoachClient(id, data)`, `removeCoachClient(id)` |
| `useCatalogs` | `hooks/use-catalogs.ts` | `getGenders()`, `getCoaches()`, `getUsers(params)` |
| `useIsMobile` | `hooks/use-mobile.ts` | Detecta viewport móvil (breakpoint 768px) |

Todos los hooks retornan `{ isLoading, errors, ...data }` y usan `sonner` para toasts de feedback.

---

## Componentes

```
components/
├── ui/                    # Primitivos shadcn/ui (button, input, dialog, table, etc.)
├── forms/
│   ├── input-group.tsx    # Wrapper de grupo de inputs
│   └── inputs/            # Componentes de input específicos (combobox, date, password, etc.)
├── layouts/
│   ├── auth-layout.tsx
│   ├── dashboard-layout.tsx
│   └── dashboard/         # Sidebar desktop/mobile, top-bar, user-dropdown, theme-toggle, footer
├── guards/
│   └── RouteGuard.tsx     # Protección de rutas client-side
├── tables/
│   ├── DataTable.tsx      # TanStack Table wrapper
│   ├── Pagination.tsx     # Controles de paginación
│   └── actions/
│       └── button-action.tsx  # Botón de acción con tooltip; acepta `onClick`, `icon`, `tooltipText`
├── auth/
│   └── register-stepper.tsx # Stepper multi-paso para registro
└── training/
    ├── link-client-dialog.tsx     # Dialog para vincular coach-cliente (POST)
    └── edit-coach-client-dialog.tsx # Dialog para editar vínculo coach-cliente (PATCH); recibe `coachClient` y precarga status/fechas
```

---

## Validación de formularios (Zod)

| Schema | Archivo | Campos principales |
|---|---|---|
| Registro | `lib/schemas/auth/register-schema.ts` | email, password, password_confirmation, name, apellidos, gender_id, weight, height, birth_date |
| Login | `lib/schemas/auth/login-schema.ts` | email, password (min 8) |
| Plan de entrenamiento | `lib/schemas/training/training-plan-schema.ts` | user_uuid, coach_uuid?, name, description, days_count (1-7), starts_at, ends_at |
| Coach-cliente (crear) | `lib/schemas/training/coach-client-schema.ts` | coach_uuid, user_uuid, start_date, end_date |
| Coach-cliente (editar) | `lib/schemas/training/edit-coach-client-schema.ts` | status (active/inactive/pending), start_date, end_date |

---

## Interfaces TypeScript

| Interface | Archivo | Uso |
|---|---|---|
| `UserInterface` | `interfaces/user-interface.ts` | uuid, name, apellidos, full_name, email, role, permissions |
| `NavItem` | `interfaces/nav-item-interface.ts` | Estructura de items de navegación con soporte anidado |
| `ApiResponse<T>` | `lib/api/interfaces/api-response.interface.ts` | Respuesta estándar del backend |
| `ApiValidationError` | `lib/api/interfaces/api.validation-error.interface.ts` | Errores de validación campo por campo |

---

## Estilos y diseño

- **Tailwind CSS 4** con plugin PostCSS
- **Fuente:** Chakra Petch (Regular, Medium, SemiBold, Bold) — cargada desde `/public/fonts/`
- **Dark mode:** via `next-themes` con estrategia de clase `.dark`
- **Color de marca:** `#ff0a54` (rosa/rojo)
- **Tokens CSS:** definidos en `src/styles/globals.css` (colores, radios, sidebar, charts)

### shadcn/ui config (`components.json`)
- Estilo: `radix-nova`
- Iconos: `lucide-react`
- Aliases de importación configurados

---

## Variables de entorno (`.env`)

```env
NEXT_PUBLIC_APP_TITLE="FitShape"
NEXT_PUBLIC_APP_ENV="dev"
NEXT_PUBLIC_DEV_API_BASE_URL="http://127.0.0.1:8000/api"
NEXT_PUBLIC_PROD_API_BASE_URL="http://127.0.0.1:8000/prod"
NEXT_PUBLIC_STORAGE_SECRET="fitshape_secure_32chars_key"
```

El cliente Axios selecciona la URL base según `APP_ENV`.

---

## Dependencias notables

### UI & Componentes
- `shadcn` + `radix-ui` — Sistema de componentes
- `lucide-react` — Iconos
- `recharts` — Gráficos
- `next-themes` — Dark mode

### Formularios & Validación
- `react-hook-form` + `@hookform/resolvers` + `zod`

### Tablas
- `@tanstack/react-table` — Tabla headless configurable

### Drag & Drop
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/modifiers` — Ordenamiento con drag & drop

### Fechas
- `date-fns` — Utilidades de fecha
- `react-day-picker` — Selector de fecha

### Otros
- `zustand` — Estado global
- `axios` — HTTP client
- `crypto-js` — Encriptación AES del store
- `sonner` — Toasts
- `@stepperize/react` — Formularios multi-paso

---

## Patrones clave

### Protección de rutas
- `RouteGuard` en `_app.tsx` — client-side, comprueba `isAuthenticated` del store
- No hay middleware.ts de Next.js; toda la protección es en el cliente

### Patrón de fetch
Sin React Query ni SWR. Flujo: custom hook → `apiRequest()` → Axios → backend. El hook gestiona `isLoading`, `errors` y `data` localmente con `useState`.

### Columnas de tabla con acciones dinámicas
Cuando una columna de acciones necesita disparar handlers del componente (ej. abrir un modal con la fila seleccionada), la columna **no** se define como constante fuera del componente. Se define dentro del `useMemo` de `columns` para tener acceso a los callbacks. Las columnas sin callbacks sí pueden vivir fuera como `const` estáticos.

```tsx
// Patrón en coachees.tsx
const columns = useMemo(() => {
  const actionsColumn: ColumnDef<CoachClient> = {
    id: "actions",
    cell: ({ row }) => <ButtonAction onClick={() => handleEdit(row.original)} ... />,
  };
  return [...staticColumns, actionsColumn];
}, [isSuperAdmin, handleEdit]);
```

### Navegación
- Rutas como constantes en `src/routing/routes.ts`
- Items de navegación con soporte para dropdowns anidados via `NavItem` interface

---

## Historial de cambios de este documento

| Fecha | Cambio |
|---|---|
| 2026-04-22 | Documento inicial creado por exploración automática |
| 2026-04-22 | Módulo coach-cliente: `EditCoachClientDialog`, `editCoachClientSchema`, `onClick` en `ButtonAction`, patrón de columnas dinámicas en tabla |
