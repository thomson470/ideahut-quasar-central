# Ideahut Quasar Central <img height="32" src="https://avatars.githubusercontent.com/u/23064371?s=200&v=4" alt="Quasar"> <img height="32" src="https://raw.githubusercontent.com/ideahut-apps-team/ideahut-springboot-docs/main/docs/images/logo.png" alt="Ideahut">

- UI untuk [ideahut-springboot-central](https://github.com/thomson470/ideahut-springboot-central/)
- Berisi informasi Project & Module
- Terintegrasi dengan UI Admin (share user)

## Install
```bash
npm install
npm run lint --fix
icongenie generate -m spa -i icon-512x512.png
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Build the app for production
```bash
quasar build
```
- Aplikasi yang sudah di-_build_ (folder: dist), bisa digunakan sebagai static resource di backend.

### Environment (file: .env)
```md
## Running menggunakan Quasar SPA Server
#PUBLIC_PATH=
#API_URL=http://localhost:6401

## Running sebagai resource di ideahut-springboot-central (embedded)
PUBLIC_PATH=/ui
API_URL=/

API_TIMEOUT=60
DEFAULT_LANGUAGE=en
DEVELOPMENT=false

```
- `PUBLIC_PATH` path untuk akses static resource di backend.
- `API_URL` untuk static resource yang akan di-_embed_ ke backend cukup dengan path API central tanpa protokol, host, dan port ("/"). 


### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js).
