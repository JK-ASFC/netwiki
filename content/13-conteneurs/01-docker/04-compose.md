---
title: Docker Compose
description: Décrire une application multi-conteneurs avec Docker Compose (compose.yaml) — services, réseaux, volumes, variables et fichier .env, secrets, contrôles de santé et ordre de démarrage, limites de ressources, profils, surcharges par environnement, commandes docker compose et mises à jour d'une pile.
tags: [docker, compose, compose.yaml, healthcheck, secrets, profils, déploiement]
icon: layers-3
---

**Docker Compose** décrit dans un fichier YAML l'ensemble des conteneurs d'une application (services, réseaux, volumes) et les gère comme une unité. Compose v2 est un greffon de la CLI : `docker compose …` (l'ancien `docker-compose` en Python est obsolète).

## Exemple : application web + base + cache

```yaml compose.yaml
name: inventaire

services:
  web:
    image: registre.corp.exemple.fr/reseau/inventaire:${VERSION:-1.4.2}
    restart: unless-stopped
    env_file: .env
    environment:
      DB_HOST: db
      REDIS_URL: redis://cache:6379/0
    secrets:
      - db_mdp
    ports:
      - "127.0.0.1:8000:8000"          # exposé seulement au reverse proxy local
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
    healthcheck:
      test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/sante')"]
      interval: 30s
      timeout: 5s
      retries: 3
    deploy:
      resources:
        limits:
          cpus: "2"
          memory: 1g
    networks: [front, back]
    logging:
      driver: local
      options: { max-size: "20m", max-file: "5" }

  db:
    image: postgres:17.4
    restart: unless-stopped
    environment:
      POSTGRES_DB: inventaire
      POSTGRES_USER: inventaire
      POSTGRES_PASSWORD_FILE: /run/secrets/db_mdp
    secrets: [db_mdp]
    volumes:
      - donnees-db:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U inventaire -d inventaire"]
      interval: 10s
      retries: 5
    networks: [back]

  cache:
    image: valkey/valkey:8
    restart: unless-stopped
    command: ["valkey-server", "--save", "", "--maxmemory", "256mb", "--maxmemory-policy", "allkeys-lru"]
    networks: [back]

  sauvegarde:
    image: postgres:17.4
    profiles: ["outils"]               # démarré seulement avec --profile outils
    entrypoint: ["sh", "-c", "PGPASSWORD=$$(cat /run/secrets/db_mdp) pg_dump -h db -U inventaire -Fc inventaire > /sauvegardes/inventaire-$$(date +%F).dump"]
    secrets: [db_mdp]
    volumes:
      - /srv/sauvegardes:/sauvegardes
    networks: [back]

networks:
  front: {}
  back:
    internal: true                      # pas d'accès à l'extérieur

volumes:
  donnees-db: {}

secrets:
  db_mdp:
    file: ./secrets/db_mdp.txt
```

```ini .env (non versionné)
VERSION=1.4.2
DJANGO_SECRET_KEY=valeur-secrete
```

## Commandes

| Commande | Rôle |
| --- | --- |
| `docker compose up -d` | Créer/mettre à jour et démarrer la pile |
| `docker compose ps` | État des services |
| `docker compose logs -f web` | Journaux |
| `docker compose pull && docker compose up -d` | Mettre à jour les images et recréer les conteneurs modifiés |
| `docker compose exec db psql -U inventaire` | Commande dans un service |
| `docker compose run --rm --profile outils sauvegarde` | Tâche ponctuelle |
| `docker compose down` | Arrêter et supprimer conteneurs et réseaux (`-v` supprime aussi les **volumes**) |
| `docker compose config` | Fichier final après variables et surcharges (vérification) |

### Toutes les sous-commandes

```bash
docker compose up -d --build --force-recreate --remove-orphans   # (re)construire et recréer
docker compose build --pull --no-cache web                       # construire les images des services
docker compose create ; docker compose start ; docker compose stop ; docker compose restart
docker compose kill -s SIGHUP web ; docker compose pause web ; docker compose unpause web
docker compose rm -f ; docker compose down --rmi local --volumes --remove-orphans
docker compose ps -a --format json ; docker compose ls          # piles (projets) en cours
docker compose top ; docker compose events --json ; docker compose port web 8000
docker compose images ; docker compose logs -f --tail 100 --since 10m
docker compose exec -it db psql -U inventaire ; docker compose run --rm web sh
docker compose cp web:/app/export.csv ./ ; docker compose scale web=3
docker compose pull ; docker compose push ; docker compose wait web
docker compose config --services ; docker compose config --volumes ; docker compose convert
docker compose watch                                             # reconstruction/synchro en développement (section develop:)
docker compose --profile outils up -d                            # activer un profil
```

### Principales clés du fichier `compose.yaml`

| Clé de service | Rôle |
| --- | --- |
| `image` / `build` | Image à utiliser / construire (`context`, `dockerfile`, `args`, `target`, `secrets`) |
| `command` / `entrypoint` | Remplacer la commande / le point d'entrée |
| `environment` / `env_file` | Variables (liste ou carte) / fichier(s) de variables |
| `ports` / `expose` | Publier / exposer des ports (`"127.0.0.1:8000:8000"`) |
| `volumes` / `tmpfs` | Volumes nommés, *bind mounts*, tmpfs |
| `networks` / `dns` / `extra_hosts` | Réseaux attachés, DNS, entrées `/etc/hosts` |
| `depends_on` | Ordre et condition (`service_healthy`, `service_started`, `service_completed_successfully`) |
| `healthcheck` | Sonde (`test`, `interval`, `timeout`, `retries`, `start_period`) |
| `restart` / `deploy` | Politique de redémarrage / `replicas`, `resources.limits`, `update_config`, `placement` |
| `secrets` / `configs` | Secrets et configurations montés |
| `profiles` | N'activer le service qu'avec `--profile` |
| `user`, `cap_drop`, `cap_add`, `read_only`, `security_opt`, `pids_limit` | Durcissement (mêmes options que `docker run`) |
| `logging`, `labels`, `ulimits`, `sysctls`, `devices`, `gpus` | Journalisation, étiquettes, limites, périphériques, GPU |
| `develop.watch` | Synchronisation/reconstruction automatique (`docker compose watch`) |

## Points clés

| Sujet | Recommandation |
| --- | --- |
| `depends_on` | Avec `condition: service_healthy` pour attendre une base réellement prête |
| Secrets | Fichiers montés dans `/run/secrets/` plutôt que variables d'environnement visibles dans `docker inspect` |
| Réseau `internal: true` | Les bases et caches n'ont pas d'accès sortant |
| Versions d'images | Figées et passées par variable (`${VERSION}`) |
| Ports | Publiés sur `127.0.0.1` derrière un reverse proxy ([[03-nginx/05-reverse-proxy-repartition\|Nginx]], [[04-caddy/03-reverse-proxy-repartition\|Caddy]], Traefik) |
| Limites | `deploy.resources.limits` (mémoire, CPU) |

## Environnements

```bash
# compose.yaml (base) + compose.prod.yaml (surcharges : répliques, limites, étiquettes)
docker compose -f compose.yaml -f compose.prod.yaml up -d
```

Les fichiers `compose.override.yaml` sont lus automatiquement (pratique pour le développement local).

## Démarrage au boot

`restart: unless-stopped` suffit : le démon Docker redémarre les conteneurs à son démarrage. Pour une gestion par systemd (dépendances, journal), une unité exécutant `docker compose up` / `down` dans le répertoire de la pile est aussi possible.
