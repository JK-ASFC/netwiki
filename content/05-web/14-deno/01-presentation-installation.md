---
title: Présentation et installation
description: Deno 2 — runtime JavaScript et TypeScript sécurisé par permissions, différences avec Node.js, installation sous Linux, macOS, Windows (winget, Chocolatey, Scoop), npm, conteneur Docker et binaire manuel, mise à jour (deno upgrade), permissions (--allow-net, --allow-read), deno serve, service systemd durci, deno compile et deno audit.
tags: [deno, javascript, typescript, runtime, permissions, installation, systemd, docker, windows, linux, macos]
icon: info
---

**Deno** est un runtime JavaScript et TypeScript (moteur V8, écrit en Rust) créé par l'auteur de Node.js. Trois particularités l'intéressent en exploitation :

- **Sécurité par permissions** : un script n'accède ni au réseau, ni aux fichiers, ni aux variables d'environnement sans autorisation explicite.
- **TypeScript natif**, sans étape de compilation, avec outils intégrés (`deno fmt`, `deno lint`, `deno test`, `deno audit`).
- **Binaire unique** et compatibilité avec les paquets npm.

Licence MIT. Alternative et voisins : [[06-nodejs/01-presentation-installation|Node.js]] (écosystème le plus large), [[05-php-fpm/01-presentation-installation-pools|PHP-FPM]].

## Ports et prérequis

| Usage | Port | Remarque |
| --- | --- | --- |
| `deno serve` / `Deno.serve()` | 8000/TCP par défaut | écoute sur `0.0.0.0` par défaut : limiter avec `--host=127.0.0.1` |

Windows 10 version 1709 ou plus (ou Windows Server 2016 version 1709) ; Linux, macOS et Windows en x86_64 et ARM64.

## Installation

Il n'existe pas de dépôt apt ou dnf officiel : les paquets des distributions sont maintenus par la communauté et souvent en retard. Utilisez le script officiel, le binaire ou le conteneur.

### Linux (Debian, Ubuntu, RHEL, Rocky, Alma, Fedora, Alpine, Arch…)

```bash
curl -fsSL https://deno.land/install.sh | sh
deno --version
```

Le script installe dans `~/.deno/bin` et propose d'ajouter le chemin au profil du shell. Pour une installation système sans script distant, téléchargez l'archive de la version (somme `.sha256sum` fournie) :

```bash
sudo apt install -y unzip        # dnf install unzip ; apk add unzip
unzip deno-x86_64-unknown-linux-gnu.zip
sudo install -m 0755 deno /usr/local/bin/deno
deno --version
```

Les archives sont sur github.com/denoland/deno/releases (Linux x86_64 et ARM64). Sous Alpine, préférez l'image Docker `denoland/deno:alpine` ou vérifiez la compatibilité du binaire (glibc).

### macOS

```bash
brew install deno
```

### Windows

```powershell
winget install DenoLand.Deno
# ou
choco install deno
scoop install deno
# ou script officiel
irm https://deno.land/install.ps1 | iex
```

### Autres : npm, BSD

```bash
npm install -g deno            # toutes plateformes disposant de Node.js
cargo install deno --locked    # compilation depuis les sources (FreeBSD, OpenBSD…)
```

Aucun binaire officiel pour les BSD : compilez avec Cargo ou utilisez le conteneur/une VM Linux.

### Conteneur

```bash
docker run --rm -it -p 8000:8000 -v "$PWD":/app -w /app denoland/deno:2 deno run --allow-net --allow-read main.ts
```

Variantes d'image : `denoland/deno:latest`, `:alpine`, `:ubuntu`, `:distroless`, `:2.x` (ligne de version).

```dockerfile Dockerfile
FROM denoland/deno:2
WORKDIR /app
COPY deno.json deno.lock ./
COPY . .
RUN addgroup --system deno-app && adduser --system --ingroup deno-app deno-app
USER deno-app
CMD ["deno", "run", "--allow-net=0.0.0.0:8000", "--allow-read=/app", "main.ts"]
```

```yaml compose.yaml
services:
  api:
    build: .
    ports:
      - "127.0.0.1:8000:8000"
    restart: unless-stopped
```

### Kubernetes

Pas de chart Helm officiel : déployez l'image du conteneur ci-dessus avec un `Deployment` classique.

## Mise à jour et versions

```bash
deno upgrade                       # dernière version
deno upgrade --version 2.7.0       # version précise
brew upgrade deno                  # Homebrew
winget upgrade DenoLand.Deno       # winget
```

Épinglez la version en production (image `denoland/deno:2.x.y`, archive précise) et testez avant de monter.

## Premiers pas : permissions

```bash
deno run main.ts                                           # refuse ou demande à l'écran chaque accès
deno run --allow-net=api.exemple.fr main.ts                # réseau limité à un hôte
deno run --allow-read=./data --allow-env=DATABASE_URL main.ts
deno run --allow-read --deny-read=/etc main.ts             # --deny l'emporte sur --allow
```

| Option | Autorise |
| --- | --- |
| `--allow-net[=hôtes]` | Réseau (écoute et sortie) |
| `--allow-read[=chemins]`, `--allow-write[=chemins]` | Fichiers |
| `--allow-env[=variables]` | Variables d'environnement |
| `--allow-run[=programmes]` | Lancement de processus |
| `--allow-ffi` | Bibliothèques natives (équivaut à tout autoriser) |
| `-A` | Tout : désactive le bac à sable |

> [!WARNING]
> Évitez `-A` en production. `--allow-run=deno` est aussi dangereux : le sous-processus peut s'accorder toutes les permissions. En service, ajoutez `--no-prompt` (ou `DENO_NO_PROMPT=1`) pour qu'une permission manquante échoue au lieu d'attendre une réponse.

## Serveur HTTP

```ts /srv/appli-api/server.ts
export default {
  fetch(req: Request): Response {
    const { pathname } = new URL(req.url);
    if (pathname === "/health") return new Response("ok");
    return new Response("Bonjour depuis Deno\n");
  },
} satisfies Deno.ServeDefaultExport;
```

```bash
deno serve --host=127.0.0.1 --port=8000 --parallel /srv/appli-api/server.ts
curl http://127.0.0.1:8000/health
```

`--parallel` lance un worker par cœur. Placez ensuite un reverse proxy TLS devant ([[03-nginx/05-reverse-proxy-repartition|nginx]] ou [[04-caddy/03-reverse-proxy-repartition|Caddy]]).

## Service systemd

```bash
sudo useradd -r -m -d /srv/appli-api -s /usr/sbin/nologin appli-api
```

```ini /etc/systemd/system/appli-api.service
[Unit]
Description=API appli (Deno)
After=network-online.target
Wants=network-online.target

[Service]
User=appli-api
Group=appli-api
WorkingDirectory=/srv/appli-api
Environment=DENO_DIR=/var/cache/appli-api
Environment=DENO_NO_UPDATE_CHECK=1
ExecStart=/usr/local/bin/deno serve --no-prompt --allow-net=127.0.0.1:8000 --allow-read=/srv/appli-api --host=127.0.0.1 --port=8000 server.ts
Restart=on-failure
RestartSec=5
CacheDirectory=appli-api
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload && sudo systemctl enable --now appli-api
journalctl -u appli-api -f
```

Windows : exécutez Deno comme service avec NSSM ou WinSW, ou compilez un exécutable (ci-dessous).

## Binaire autonome et dépendances

```bash
deno compile --allow-net=0.0.0.0:8000 --output appli-api server.ts
deno compile --target x86_64-unknown-linux-gnu --output appli-api-linux server.ts   # compilation croisée
./appli-api
```

Les permissions sont figées à la compilation. Autres cibles : `aarch64-unknown-linux-gnu`, `x86_64-pc-windows-msvc`, `x86_64-apple-darwin`, `aarch64-apple-darwin`.

```bash
deno audit            # vulnérabilités connues des dépendances (à lancer en CI)
```

Commandes courantes : [[90-aide-memoire|aide-mémoire Deno]].
