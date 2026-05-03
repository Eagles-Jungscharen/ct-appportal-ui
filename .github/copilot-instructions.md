# GitHub Copilot Instructions — ct-appportal-ui

## Projekt-Übersicht
React-App (Vite + TypeScript) als App-Portal für Benutzer und Admins.
- **User-Portal**: Zeigt alle Applikationen, auf die der eingeloggte User Zugriff hat.
- **Admin-Bereich** (`/admin`): Applikationen registrieren, Rollen/Gruppen zuweisen, OAuth2-Clients beim Churchtool IDP registrieren.

## Tech-Stack
| Layer | Technologie |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite |
| UI | FluentUI V9 (`@fluentui/react-components`, `@fluentui/react-icons`) |
| Auth | `oidc-client-ts` + `react-oidc-context` (Churchtool IDP) |
| Routing | `react-router-dom` v7 |
| Server-State | `@tanstack/react-query` v5 |
| Backend | Azure Functions (noch nicht implementiert) |

## Authentifizierung
- Auth-Provider: Churchtool IDP (OIDC)
- OIDC-Konfiguration: `src/config/oidc.ts`
- Nach dem Login ruft `AuthProvider` automatisch `GET /api/me` auf
- `isAdmin` und `groups` kommen **ausschliesslich** aus `GET /api/me` (nicht aus OIDC-Claims)
- Custom Hook: `useAuth()` aus `src/auth/useAuth.ts` — liefert `{ isAuthenticated, isAdmin, groups, displayName, token, login, logout }`
- **Niemals** OIDC-Claims direkt für Admin-Erkennung verwenden

## API-Kontrakt (Azure Functions Backend)
Alle API-Calls laufen über `authFetch()` in `src/api/client.ts` mit Bearer Token.

| Method | Endpoint | Beschreibung |
|---|---|---|
| GET | `/api/me` | `MeDto { userId, displayName, isAdmin, groups[] }` |
| GET | `/api/apps` | Apps des Users (nach Token gefiltert) |
| GET | `/api/appmanagement/apps` | Alle Apps (nur Admin) |
| POST | `/api/appmanagement/apps` | App erstellen |
| PUT | `/api/appmanagement/apps/:id` | App bearbeiten |
| DELETE | `/api/appmanagement/apps/:id` | App löschen |
| POST | `/api/appmanagement/apps/:id/assignments` | User/Gruppen zuweisen |
| POST | `/api/appmanagement/clients` | OAuth2-Client beim Churchtool IDP registrieren |

> **Wichtig**: Azure Functions reserviert `/api/admin` intern — deshalb `/api/appmanagement` verwenden.

## Projektstruktur
```
src/
  auth/          # OIDC-Integration, Route-Guards
  api/           # Alle Backend-Calls (types.ts, client.ts, me.ts, apps.ts, clients.ts, assignments.ts)
  config/        # oidc.ts, api.ts — Werte kommen aus .env (VITE_-Prefix)
  hooks/         # TanStack Query Hooks (useMe, useApps, useAdminApps, useClientRegistration)
  components/    # Wiederverwendbare UI-Komponenten (AppCard, AppGrid, PageShell)
  pages/         # Seitenkomponenten
    admin/       # Admin-spezifische Seiten
  router/        # React Router Konfiguration
```

## Konventionen
- **Named Exports** überall — kein `export default`
- **Komponenten**: PascalCase, eine Komponente pro Datei
- **Hooks**: `use`-Prefix, eigene Datei unter `src/hooks/`
- **API-Dateien**: Eine Datei pro Ressource (`apps.ts`, `clients.ts`, etc.)
- **FluentUI Styling**: `makeStyles()` aus `@fluentui/react-components` — kein CSS-in-JS, kein Tailwind
- **Icons**: Ausschliesslich aus `@fluentui/react-icons`
- **Formulare**: Keine externe Form-Library — native React State + FluentUI `Field`/`Input`
- **Fehlerbehandlung**: `ApiResponseError` aus `src/api/client.ts` für API-Fehler

## Komponenten-Stil

Komponenten werden **immer** als `const`-Arrow-Function deklariert — **kein** `function`-Keyword.
Props werden als eigenes `interface` direkt vor der Komponente definiert.
Styles werden als `const useStyles = makeStyles({...})` direkt vor dem Props-Interface deklariert.

Reihenfolge innerhalb einer Komponenten-Datei:
1. Imports
2. `const useStyles = makeStyles({...})`
3. `interface XxxProps { ... }`
4. `export const Xxx: React.FunctionComponent<XxxProps> = (props: XxxProps) => { ... }`

Beispiel:
```tsx
const useStyles = makeStyles({
  card: {
    width: '280px',
  },
});

interface AppCardProps {
  app: AppDto;
}

export const AppCard: React.FunctionComponent<AppCardProps> = (props: AppCardProps) => {
  const { app } = props;
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      {/* ... */}
    </Card>
  );
};
```

## Routing
- `/` — App-Portal (nur für eingeloggte User)
- `/admin` — Admin-Dashboard (nur für Admins, sonst Redirect zu `/unauthorized`)
- `/auth/callback` — OIDC-Callback-Handler
- `/unauthorized` — Zugriff verweigert

## Umgebungsvariablen (.env)
```
VITE_OIDC_AUTHORITY=        # Churchtool IDP Basis-URL
VITE_OIDC_CLIENT_ID=        # OIDC Client-ID
VITE_OIDC_REDIRECT_URI=     # Callback-URL (default: /auth/callback)
VITE_API_BASE_URL=          # Azure Functions Base-URL (dev: http://localhost:7071)
```

## Wichtige Hinweise für Copilot
- `authFetch<T>(path, token, options?)` immer für API-Calls verwenden — nie direkt `fetch()`
- Admin-Checks immer via `useAuth().isAdmin` — nie über OIDC-Claims
- FluentUI V9 API nutzen (keine V8/V7 Imports) — Package ist `@fluentui/react-components`
- `crypto.randomUUID()` für temporäre IDs in Formularen
- `clientSecret` wird nach OAuth2-Client-Registrierung nur einmalig angezeigt (Security)
