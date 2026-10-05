# kestrel-console

Operations dashboard for the Kestrel medical drone delivery network. Dispatchers use it to watch drones live, manage the mission board and audit the chain of custody for each specimen.

Next.js 15 (App Router), NextAuth with Okta OIDC, Mapbox GL for the live map. It talks only to `kestrel-gateway`; browsers never reach dispatch, telemetry or compliance directly.

## Local development

```sh
cp .env.example .env.local   # fill in Okta and Mapbox values
npm install                  # needs a GitHub token with read:packages for @kestrel/contracts
npm run dev
```

`.npmrc` points the `@kestrel` scope at GitHub Packages. Put your token in `~/.npmrc`, not in the repo.

## How it fits

- `app/api/missions` proxies mission CRUD to the gateway. Mission ids from before the dispatch migration are resolved through `LEGACY_ROUTER_URL`.
- `app/api/stream` relays the gateway SSE feed of `TelemetryFrame` events to the map.
- Wire types come from `@kestrel/contracts`.

## Deploy

Vercel, production branch `main`. Env vars are managed in the Vercel project; `.env.example` lists what is needed.
