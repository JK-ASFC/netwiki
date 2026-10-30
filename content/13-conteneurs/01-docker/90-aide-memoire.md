---
title: Docker — aide-mémoire des commandes
description: Commandes Docker avec exemples — conteneurs (run avec options, ps, logs, exec, inspect, stats, cp, restart, rm), images (build, tag, push, pull, history, prune), volumes et réseaux, Docker Compose (up, down, ps, logs, exec, pull, config), nettoyage (system df, prune), contextes et accès distant, Buildx multi-architecture, sécurité (rootless, Scout/Trivy), journaux et dépannage.
tags: [aide-mémoire, docker, docker compose, conteneurs, images, volumes]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Docker]].

## Conteneurs

```bash
docker run -d --name web -p 8080:80 --restart unless-stopped nginx:1.27
docker run -it --rm alpine:3.20 sh                       # conteneur jetable interactif
docker run -d --name app -e TZ=Europe/Paris --env-file .env -v app-data:/data -v ./conf:/etc/app:ro \
  --memory 512m --cpus 1.5 --read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges \
  --network interne --health-cmd "wget -qO- http://localhost:8000/health || exit 1" registre.exemple.fr/app:2.3.1
docker ps
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
docker logs -f --tail 100 web
docker logs --since 30m app
docker exec -it web sh
docker exec web nginx -t
docker inspect web --format '{{.State.Health.Status}} {{.NetworkSettings.Networks}}'
docker stats --no-stream
docker top web
docker cp web:/etc/nginx/nginx.conf ./nginx.conf
docker restart web
docker stop web && docker rm web
docker update --restart always --memory 1g app
```

## Images

```bash
docker build -t registre.exemple.fr/app:2.3.1 .
docker build --no-cache --pull -t app:test -f Dockerfile.prod .
docker images
docker image history app:test
docker tag app:test registre.exemple.fr/app:2.3.2
docker login registre.exemple.fr
docker push registre.exemple.fr/app:2.3.2
docker pull nginx:1.27
docker save app:test | gzip > app-test.tar.gz && docker load < app-test.tar.gz
docker rmi app:ancien
docker buildx build --platform linux/amd64,linux/arm64 -t registre.exemple.fr/app:2.3.2 --push .
```

## Volumes et réseaux

```bash
docker volume create app-data
docker volume ls
docker volume inspect app-data
docker run --rm -v app-data:/data -v "$PWD":/sauvegarde alpine tar czf /sauvegarde/app-data.tar.gz -C /data .     # sauvegarde d'un volume
docker network create --driver bridge --subnet 172.30.0.0/24 interne
docker network ls
docker network inspect interne
docker network connect interne web
docker network disconnect interne web
```

## Docker Compose

```bash
docker compose up -d
docker compose ps
docker compose logs -f app
docker compose exec app sh
docker compose pull && docker compose up -d          # mise à jour des images
docker compose restart app
docker compose down                                   # garde les volumes
docker compose down -v                                # supprime aussi les volumes (attention)
docker compose config                                 # configuration fusionnée et validée
docker compose -f compose.yaml -f compose.prod.yaml up -d
docker compose top
```

## Nettoyage

```bash
docker system df
docker container prune -f
docker image prune -a --filter "until=720h" -f
docker volume prune -f                    # volumes orphelins (vérifier avant !)
docker builder prune -f
docker system prune -f
```

## Contexte distant et sécurité

```bash
docker context create srv01 --docker "host=ssh://admin@srv01.exemple.fr"
docker context use srv01 && docker ps && docker context use default
dockerd-rootless-setuptool.sh install             # mode sans root
docker scout cves app:test                         # vulnérabilités (ou : trivy image app:test)
docker info | grep -iE "rootless|cgroup|storage driver"
```

## Service et journaux

```bash
sudo systemctl status docker
sudo journalctl -u docker -f
cat /etc/docker/daemon.json
```

```json
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "20m", "max-file": "5" },
  "live-restore": true,
  "userland-proxy": false
}
```
