# ct-appportal-ui

App-Portal-Frontend für die Eagles Jungscharen. Ermöglicht Benutzern den zentralisierten Zugriff auf alle für sie freigegebenen Applikationen und bietet Administratoren eine vollständige Verwaltungsoberfläche.

## Überblick

Das Portal besteht aus zwei Bereichen:

- **User-Portal** (`/`): Zeigt eine personalisierte Übersicht aller Applikationen, auf die der eingeloggte Benutzer Zugriff hat.
- **Admin-Bereich** (`/admin`): Ermöglicht Administratoren das Registrieren von Applikationen, das Verwalten von Benutzer-/Gruppen-Zuweisungen sowie die Registrierung von OAuth2-Clients beim Churchtool IDP.

## Tech-Stack

| Layer | Technologie |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite |
| UI-Bibliothek | FluentUI V9 (`@fluentui/react-components`) |
| Icons | `@fluentui/react-icons` |
| Authentifizierung | `oidc-client-ts` + `react-oidc-context` (Churchtool IDP) |
| Routing | `react-router-dom` v7 |
| Server-State | `@tanstack/react-query` v5 |
| Backend | Azure Functions (ct-appportal-azfunctions) |

## Lokale Entwicklung

### Voraussetzungen

- Node.js ≥ 20
- npm ≥ 10

### Setup

```bash
npm install
```

### Umgebungsvariablen

Datei `.env.local` im Projektroot anlegen:

```env
VITE_OIDC_AUTHORITY=        # Churchtool IDP Basis-URL
VITE_OIDC_CLIENT_ID=        # OIDC Client-ID der registrierten App
VITE_OIDC_REDIRECT_URI=     # Callback-URL (z. B. http://localhost:5173/auth/callback)
VITE_API_BASE_URL=          # Azure Functions Base-URL (lokal: http://localhost:7071)
```

### Starten

```bash
npm run dev
```

Die App läuft dann unter `http://localhost:5173`.

## Projektstruktur

```
src/
├── api/           # Backend-Calls (authFetch, Typen, eine Datei pro Ressource)
│   ├── client.ts  # authFetch() — Basis-Funktion für alle API-Aufrufe mit Bearer Token
│   ├── types.ts   # Gemeinsame DTOs (AppDto, MeDto, RoleDto, …)
│   ├── me.ts      # GET /api/me
│   ├── apps.ts    # GET/POST/PUT/DELETE /api/apps & /api/appmanagement/apps
│   ├── assignments.ts  # POST /api/appmanagement/apps/:id/assignments
│   └── clients.ts # POST /api/appmanagement/clients
├── auth/          # OIDC-Integration und Route-Guards
│   ├── AuthProvider.tsx    # Lädt /api/me nach Login, befüllt AppAuthContext
│   ├── ProtectedRoute.tsx  # Redirect zu / wenn nicht eingeloggt
│   ├── AdminRoute.tsx      # Redirect zu /unauthorized wenn kein Admin
│   ├── HomeRoute.tsx       # Leitet zu AppPortal oder LandingPage
│   └── OidcCallback.tsx    # Verarbeitet den OIDC-Redirect nach dem Login
├── components/    # Wiederverwendbare UI-Komponenten
│   ├── AppCard.tsx     # Karte für eine einzelne Applikation
│   ├── AppGrid.tsx     # Grid-Layout für AppCards
│   └── PageShell.tsx   # Seitenlayout mit Header, Navigation und User-Menü
├── config/
│   ├── api.ts     # VITE_API_BASE_URL
│   └── oidc.ts    # OIDC-Konfiguration
├── context/
│   └── AppAuthContext.ts  # React Context für Auth-Zustand (token, isAdmin, groups, …)
├── hooks/         # TanStack Query Hooks
│   ├── useAppAuth.ts          # Zugriff auf AppAuthContext
│   ├── useMe.ts               # GET /api/me
│   ├── useApps.ts             # GET /api/apps + Mutations
│   ├── useAdminApps.ts        # GET /api/appmanagement/apps + Mutations
│   └── useClientRegistration.ts  # POST /api/appmanagement/clients
├── pages/
│   ├── AppPortal.tsx     # User-Dashboard (AppGrid)
│   ├── LandingPage.tsx   # Einstiegsseite für nicht-eingeloggte Benutzer
│   ├── Unauthorized.tsx  # 403-Fehlerseite
│   └── admin/
│       ├── AdminDashboard.tsx        # Tabbed Admin-Oberfläche
│       ├── AppList.tsx               # DataGrid aller Applikationen
│       ├── AppRegistrationForm.tsx   # Dialog: App erstellen / bearbeiten
│       ├── AppAssignmentPanel.tsx    # Drawer: Benutzer/Gruppen zuweisen
│       └── ClientRegistrationForm.tsx # Dialog: OAuth2-Client registrieren
└── router/
    └── index.tsx  # React Router Konfiguration
```

## Routen

| Route | Komponente | Zugriff |
|---|---|---|
| `/` | `AppPortal` | Eingeloggte Benutzer |
| `/admin` | `AdminDashboard` | Nur Admins |
| `/auth/callback` | `OidcCallback` | Öffentlich (OIDC-Redirect) |
| `/unauthorized` | `Unauthorized` | Öffentlich |

## Authentifizierung

1. Nicht eingeloggte Benutzer sehen die `LandingPage` mit Login-Button
2. Login leitet zum Churchtool IDP weiter
3. Nach erfolgreichem Login: Redirect zu `/auth/callback`
4. `AuthProvider` ruft `GET /api/me` auf und speichert das Ergebnis im `AppAuthContext`
5. `isAdmin` und `groups` kommen **ausschliesslich** aus `GET /api/me` — niemals aus OIDC-Claims

## API-Kontrakt

Alle Requests laufen über `authFetch()` aus `src/api/client.ts` mit Bearer Token im `Authorization`-Header.

| Methode | Endpoint | Beschreibung | Nur Admin |
|---|---|---|---|
| GET | `/api/me` | Eingeloggter Benutzer (`MeDto`) | — |
| GET | `/api/apps` | Apps des Benutzers (nach Token gefiltert) | — |
| GET | `/api/appmanagement/apps` | Alle registrierten Apps | ✓ |
| POST | `/api/appmanagement/apps` | App erstellen | ✓ |
| PUT | `/api/appmanagement/apps/:id` | App bearbeiten | ✓ |
| DELETE | `/api/appmanagement/apps/:id` | App löschen | ✓ |
| POST | `/api/appmanagement/apps/:id/assignments` | Benutzer/Gruppen zuweisen | ✓ |
| POST | `/api/appmanagement/clients` | OAuth2-Client beim Churchtool IDP registrieren | ✓ |

## Datenmodelle

```typescript
MeDto               { userId, displayName, isAdmin, groups[] }
AppDto              { id, name, description?, url, iconUrl?, redirectUris[], roles[] }
RoleDto             { id, name, description? }
GroupAssignmentDto  { appId, groupIds[], userIds[] }
ClientRegistrationDto        { appId, clientName, redirectUris[] }
ClientRegistrationResultDto  { clientId, clientSecret }
```

## Offene Punkte

### Hohe Priorität

| # | Thema | Beschreibung |
|---|---|---|
| 1 | **Backend vollständig fehlend** | Alle 8 API-Endpoints sind im Backend noch nicht implementiert (nur Placeholder). Das Frontend ist feature-complete, aber ohne Backend nicht nutzbar. |
| 2 | **Keine Deployment-Konfiguration** | Kein `azure.yaml`, kein Bicep/Terraform, kein CI/CD-Workflow vorhanden. |

### Mittlere Priorität

| # | Thema | Beschreibung |
|---|---|---|
| 3 | **Keine Toast-Benachrichtigungen** | Erfolgreiche Mutationen (App erstellen, löschen, zuweisen) geben keine Rückmeldung an den Benutzer. |
| 4 | **Copy-to-Clipboard bei Client Secret** | Nach OAuth2-Client-Registrierung wird `clientSecret` einmalig angezeigt, aber ohne Kopierfunktion. |
| 5 | **Error Boundaries** | Keine React Error Boundaries — unkontrollierte Fehler führen zu leerem Screen. |

### Niedrige Priorität

| # | Thema | Beschreibung |
|---|---|---|
| 6 | **Optimistic Updates** | Mutationen invalidieren den Cache, führen aber kein optimistisches UI-Update durch. |
| 7 | **Kein Retry-Handling** | Fehlgeschlagene API-Requests werden nicht automatisch wiederholt. |

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
