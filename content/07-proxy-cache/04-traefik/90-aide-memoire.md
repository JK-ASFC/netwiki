---
title: Traefik — aide-mémoire des commandes
description: Commandes et configuration Traefik avec exemples — lancement (binaire, Docker, options en ligne de commande), configuration statique (points d'entrée, fournisseurs, résolveurs ACME) et dynamique (routeurs, services, middlewares) en fichiers et en étiquettes Docker, tableau de bord et API, vérifications (healthcheck, API rawdata), redirection HTTPS, authentification, en-têtes, limitation, journaux d'accès et métriques.
tags: [aide-mémoire, traefik, reverse proxy, docker, acme, middlewares]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Traefik]].

## Lancement

```bash
traefik version
traefik --configFile=/etc/traefik/traefik.yml
traefik healthcheck --ping                    # avec ping activé
docker run -d --name traefik -p 80:80 -p 443:443 \
  -v /var/run/docker.sock:/var/run/docker.sock:ro -v /srv/traefik:/etc/traefik traefik:v3.2
docker logs -f traefik
```

## Configuration statique

```yaml
# /etc/traefik/traefik.yml
entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint: { to: websecure, scheme: https }
  websecure:
    address: ":443"
providers:
  docker:
    exposedByDefault: false
  file:
    directory: /etc/traefik/dynamique
    watch: true
certificatesResolvers:
  le:
    acme:
      email: admin@exemple.fr
      storage: /etc/traefik/acme.json
      httpChallenge: { entryPoint: web }
api:
  dashboard: true
ping: {}
log: { level: INFO }
accessLog: { filePath: /var/log/traefik/access.log, format: json }
metrics:
  prometheus: {}
```

```bash
touch /srv/traefik/acme.json && chmod 600 /srv/traefik/acme.json
```

## Configuration dynamique (fichier)

```yaml
# /etc/traefik/dynamique/app.yml
http:
  routers:
    app:
      rule: "Host(`app.exemple.fr`)"
      entryPoints: [websecure]
      service: app
      middlewares: [securite, limite]
      tls: { certResolver: le }
    tableau:
      rule: "Host(`traefik.exemple.fr`)"
      service: api@internal
      middlewares: [admin-auth, admin-ip]
      tls: { certResolver: le }
  services:
    app:
      loadBalancer:
        servers:
          - url: "http://10.0.30.21:8080"
          - url: "http://10.0.30.22:8080"
        healthCheck: { path: /health, interval: 10s }
  middlewares:
    securite:
      headers:
        stsSeconds: 31536000
        contentTypeNosniff: true
        frameDeny: true
    limite:
      rateLimit: { average: 50, burst: 100 }
    admin-auth:
      basicAuth:
        users: ["admin:$apr1$..."]
    admin-ip:
      ipAllowList:
        sourceRange: ["10.0.99.0/24"]
```

## Étiquettes Docker

```yaml
# compose.yaml d'une application
services:
  wiki:
    image: requarks/wiki:2
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.wiki.rule=Host(`wiki.exemple.fr`)"
      - "traefik.http.routers.wiki.entrypoints=websecure"
      - "traefik.http.routers.wiki.tls.certresolver=le"
      - "traefik.http.services.wiki.loadbalancer.server.port=3000"
```

## API et vérifications

```bash
htpasswd -nbB admin 'MotDePasse'                      # entrée pour basicAuth (doubler les $ dans les étiquettes)
curl -s http://127.0.0.1:8080/api/http/routers | jq '.[] | {name, rule, status}'
curl -s http://127.0.0.1:8080/api/http/services | jq '.[] | {name, status, serverStatus}'
curl -s http://127.0.0.1:8080/api/rawdata | jq 'keys'
curl -s http://127.0.0.1:8080/ping
curl -s http://127.0.0.1:8080/metrics | grep traefik_service_requests_total | head
jq -r '.le.Certificates[].domain.main' /srv/traefik/acme.json     # domaines certifiés
```
