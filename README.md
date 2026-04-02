# The Thesis of Church
Web-side source code for The Thesis of Church Website 

## Install and Run Instructions
1. Use Ubuntu distributive or use WSL with installed Ubuntu distributive.
2. Install node with version >= 24.
3. Run 'npm install' to download and install needed dependencies.
4. Run 'npm start' to start server with REST API for The Thesis of Church website.
5. Server will start at http://localhost:1904.

## Docker Deployment
Run the full stack with Docker Compose:

```bash
docker compose up -d --build
```

The stack starts PostgreSQL, initializes the schema from `createScheme.sql`, builds the Vue frontend, and launches `api`, `web`, and `redirect` containers.

Container settings are stored in `docker.env`. By default the stack runs over HTTP for easier local testing. To enable HTTPS for the web container, place the certificate files in `./certs`, then set `WEB_USE_HTTPS=true` and adjust `CRT_PATH` and `KEY_PATH` in `docker.env` if needed.

## Server Deployment
For a real server, use the dedicated stack with Caddy in front of the app. Caddy will accept both HTTP and HTTPS on the public domain, automatically issue TLS certificates, and redirect visitors from HTTP to HTTPS.

1. Point your domain A record to the server IP.
2. Open ports `80` and `443` in the server firewall.
3. Copy `docker.server.env.example` to `docker.server.env` and fill in real values.
4. Set `APP_DOMAIN`, `ACME_EMAIL`, `CORS_ORIGIN`, `POSTGRES_PASSWORD`, and `API_JWT_SECRET` in `docker.server.env`.
5. Start the server stack:

```bash
cp docker.server.env.example docker.server.env
docker compose -f docker-compose.server.yml up -d --build
```

With this setup:

1. `http://your-domain` redirects to `https://your-domain`
2. `https://your-domain` serves the frontend
3. `/api/*` works through the frontend proxy to the internal API container
4. Cookies stay secure because `COOKIE_SECURE=true`

For first verification on the server:

```bash
docker compose -f docker-compose.server.yml ps
docker compose -f docker-compose.server.yml logs caddy --tail=100
docker compose -f docker-compose.server.yml logs web --tail=100
docker compose -f docker-compose.server.yml logs api --tail=100
```