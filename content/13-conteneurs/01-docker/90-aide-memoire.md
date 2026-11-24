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

## `docker run` / `create` — référence des options

```bash
docker run [options] IMAGE [commande] [args]
```

| Option | Rôle |
| --- | --- |
| `-d`, `--detach` / `-it` | Arrière-plan / interactif + TTY |
| `--name`, `--hostname`, `--restart` | Nom, nom d'hôte, politique (`no`, `on-failure[:n]`, `always`, `unless-stopped`) |
| `-p h:c`, `-P`, `--expose` | Publier un port / tous les ports exposés / exposer sans publier |
| `-e`, `--env-file` | Variable d'environnement / fichier de variables |
| `-v`, `--mount`, `--tmpfs` | Volume ou *bind* / montage détaillé / tmpfs |
| `-w`, `--user`, `-u` | Répertoire de travail / utilisateur (`uid:gid`) |
| `--network`, `--ip`, `--dns`, `--add-host` | Réseau, IP fixe, DNS, entrée `/etc/hosts` |
| `--memory`, `--cpus`, `--cpuset-cpus`, `--pids-limit` | Limites mémoire, CPU, cœurs, processus |
| `--cap-drop`, `--cap-add`, `--privileged` | Capacités Linux / mode privilégié (à éviter) |
| `--security-opt`, `--read-only`, `--userns` | seccomp/AppArmor/`no-new-privileges`, racine en lecture seule, espace d'UID |
| `--health-cmd`, `--health-interval`, `--no-healthcheck` | Sonde de santé |
| `--gpus all`, `--device`, `--shm-size` | GPU (NVIDIA), périphérique hôte, taille `/dev/shm` |
| `--label`, `--log-driver`, `--log-opt` | Étiquettes, pilote et options de journalisation |
| `--rm`, `--init`, `--pull`, `--platform` | Suppression à l'arrêt, init PID 1, politique de pull, architecture |

## Cycle de vie complet

```bash
docker create --name web nginx:1.27        # créer sans démarrer
docker start -ai web                         # démarrer (attaché)
docker attach web                            # se rattacher aux E/S
docker pause web ; docker unpause web        # geler / reprendre
docker kill -s HUP web                       # envoyer un signal
docker wait web                              # attendre l'arrêt et renvoyer le code de sortie
docker rename web frontal                    # renommer
docker commit frontal app:instantane         # créer une image depuis un conteneur
docker export frontal | gzip > frontal.tar.gz   # exporter le système de fichiers
docker import frontal.tar.gz app:importe     # réimporter en image
docker diff frontal                          # fichiers modifiés depuis l'image
docker port frontal                          # correspondances de ports
docker kill frontal ; docker rm -f frontal
```

## Images (compléments)

```bash
docker image inspect nginx:1.27 --format '{{.Architecture}} {{.Os}} {{index .RepoDigests 0}}'
docker search --filter is-official=true --limit 5 nginx
docker manifest inspect nginx:1.27                 # manifeste multi-architecture
docker history --no-trunc app:test                 # couches détaillées
docker image prune -a --filter "label!=garder=true" -f
```

## Buildx et BuildKit

```bash
docker buildx ls                                   # constructeurs disponibles
docker buildx create --name multi --driver docker-container --bootstrap --use
docker buildx build --platform linux/amd64,linux/arm64 -t reg/app:1 --push .
docker buildx build --cache-to type=registry,ref=reg/app:cache --cache-from type=registry,ref=reg/app:cache -t reg/app:1 --push .
docker buildx bake                                  # construire plusieurs cibles (docker-bake.hcl)
docker buildx imagetools inspect reg/app:1          # inspecter un index d'images
docker buildx prune -f ; docker buildx rm multi
```

## Docker Scout (sécurité)

```bash
docker scout quickview app:1                        # aperçu des vulnérabilités
docker scout cves app:1 --only-severity critical,high
docker scout recommendations app:1                  # images de base plus sûres
docker scout compare app:1 --to app:0.9             # comparer deux images
```

## Système, événements, init

```bash
docker system info --format '{{.ServerVersion}} {{.Driver}} {{.CgroupVersion}}'
docker system events --since 1h --filter type=container --filter event=oom
docker system prune -a --volumes -f                 # tout nettoyer (prudence)
docker init                                         # générer Dockerfile + compose.yaml + .dockerignore
```

## Swarm (orchestrateur intégré)

```bash
docker swarm init --advertise-addr 10.0.20.10
docker swarm join-token worker ; docker swarm join-token manager
docker node ls ; docker node promote srv02 ; docker node update --availability drain srv03
docker service create --name web --replicas 3 -p 80:80 --update-delay 10s nginx:1.27
docker service ls ; docker service ps web ; docker service scale web=5
docker service update --image nginx:1.27-alpine --rollback-monitor 10s web
docker secret create tls.key ./tls.key ; docker config create nginx.conf ./nginx.conf
docker stack deploy -c compose.yaml pile ; docker stack services pile ; docker stack rm pile
```

## Greffons, signature, manifeste

```bash
docker plugin install vieux/sshfs ; docker plugin ls ; docker plugin disable ID
export DOCKER_CONTENT_TRUST=1                        # exiger des images signées (pull/run/push)
docker trust sign reg/app:1 ; docker trust inspect --pretty reg/app:1
docker manifest create reg/app:1 reg/app:1-amd64 reg/app:1-arm64 && docker manifest push reg/app:1
```
