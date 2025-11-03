Metrics Dev Server (abimongo)

Purpose
-------
This dev server provides a lightweight API that the Docusaurus docs dashboard can call for metrics. It supports two modes:

- DB-backed mode (preferred): uses `@abimongo/core` (recommended) to persist metrics into MongoDB. The server will attempt to build `@abimongo/core` automatically if it's not present.
- File-backed mode: reads/writes `docs/website/static/api/metrics.json` — useful when you don't want DB setup.

HOW IT CHOOSES DB MODE
----------------------
1. If `MONGO_URI` or `MONGODB_URI` is set, the server will attempt to load `@abimongo/core`.
2. If `@abimongo/core` is not resolvable, the server will run the build command from the repo root:

```
pnpm --filter @abimongo/core run build
```

3. If building or loading `@abimongo/core` fails, the server will exit with a clear error message telling you how to build it.
4. To force file-backed mode even when DB env vars are present, set `FORCE_FILE_BACKED=1`.

RUN THE SERVER
--------------
Start the dev metrics server (file-backed by default):

```powershell
pnpm run dev:metrics-server
```

To run in DB-backed mode, set your MongoDB URI and run:

```powershell
$env:MONGO_URI='mongodb://user:pass@host:27017'
pnpm run dev:metrics-server
```

NOTES ABOUT `@abimongo/core`
----------------------------

- The server expects `@abimongo/core` to be resolvable from the workspace. If you change the package layout, update the build command in the script.
- Building the core package requires the normal workspace build environment (Node >= 20.11 and pnpm >= 10.x).

INTEGRATING WITH DOCUSARAUS DEV SERVER (RECOMMENDED)
---------------------------------------------------
Instead of running two processes, you can configure a dev proxy in Docusaurus so the docs dev server proxies `/api` requests to the metrics server. Example (add to `docusaurus.config.js` or dev server configuration):

```js
// pseudo-code: adapt for your Docusaurus version
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:9002',
        changeOrigin: true,
      },
    },
  },
};
```

You can also run the metrics server on a different port:

```powershell
$env:METRICS_PORT=9010
pnpm run dev:metrics-server
```

SECURITY
--------

This dev server is only intended for local development. Do not expose it publicly without adding authentication and proper validation.

TROUBLESHOOTING
---------------

- If the server errors with `Failed to build @abimongo/core`, run the build command manually at the repo root:

```
pnpm --filter @abimongo/core run build
```

Then restart the server.

CONTACT
-------

If you want help wiring a production endpoint using Abimongo + MongoDB, I can scaffold a small API service that uses `Abimongo` to persist metrics permanently.
