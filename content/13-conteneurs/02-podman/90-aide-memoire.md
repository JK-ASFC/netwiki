---
title: Podman — aide-mémoire des commandes
description: Commandes Podman avec exemples — conteneurs et images (syntaxe compatible Docker), mode rootless (subuid/subgid), pods, génération Kubernetes (kube generate/play), Quadlet et systemd (fichiers .container, mise à jour automatique), réseaux, volumes, secrets, podman compose, Podman Desktop et machine (Windows, macOS), Buildah et Skopeo.
tags: [aide-mémoire, podman, rootless, quadlet, pods, buildah, skopeo]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Podman]]. La plupart des commandes [[01-docker/90-aide-memoire|Docker]] fonctionnent en remplaçant `docker` par `podman`.

## Bases

```bash
podman run -d --name web -p 8080:80 docker.io/library/nginx:1.27
podman ps -a
podman logs -f web
podman exec -it web sh
podman images
podman build -t localhost/app:1.0 .
podman system info | grep -E "rootless|graphDriverName"
podman unshare cat /proc/self/uid_map           # correspondance d'UID en mode rootless
grep "$USER" /etc/subuid /etc/subgid            # plages d'UID attribuées
```

## Pods et Kubernetes

```bash
podman pod create --name appli -p 8080:80
podman run -d --pod appli --name web docker.io/library/nginx:1.27
podman run -d --pod appli --name cache docker.io/library/redis:7
podman pod ps
podman kube generate appli > appli.yaml          # manifeste Kubernetes
podman kube play appli.yaml                       # recréer à partir du manifeste
podman kube down appli.yaml
```

## Quadlet (systemd)

```ini
# ~/.config/containers/systemd/web.container   (root : /etc/containers/systemd/)
[Unit]
Description=Serveur web

[Container]
Image=docker.io/library/nginx:1.27
PublishPort=8080:80
Volume=web-data:/usr/share/nginx/html:Z
AutoUpdate=registry

[Service]
Restart=always

[Install]
WantedBy=default.target
```

```bash
systemctl --user daemon-reload
systemctl --user start web.service
systemctl --user status web.service
loginctl enable-linger "$USER"                    # démarrage sans session ouverte
podman auto-update --dry-run
podman auto-update
```

## Réseaux, volumes, secrets

```bash
podman network create interne
podman volume create web-data
printf 'MotDePasseBase' | podman secret create db_mdp -
podman run -d --secret db_mdp,type=env,target=DB_PASSWORD --network interne localhost/app:1.0
podman secret ls
```

## Compose, Desktop, machine

```bash
podman compose up -d                              # via docker-compose ou podman-compose
podman machine init && podman machine start       # Windows / macOS : VM Linux
podman machine ls
```

Interface graphique : **Podman Desktop** (Windows, macOS, Linux).

## Buildah et Skopeo

```bash
buildah bud -t localhost/app:1.1 .
skopeo inspect docker://docker.io/library/nginx:1.27 | jq '.Digest, .Created'
skopeo copy docker://docker.io/library/nginx:1.27 docker://registre.exemple.fr/miroir/nginx:1.27
```

## Cycle de vie et inspection

```bash
podman create --name web docker.io/library/nginx:1.27 ; podman start web
podman stop web ; podman restart web ; podman kill -s HUP web
podman pause web ; podman unpause web ; podman wait web ; podman rename web frontal
podman cp frontal:/etc/nginx/nginx.conf ./ ; podman commit frontal localhost/app:instantane
podman export frontal -o frontal.tar ; podman import frontal.tar localhost/app:importe
podman diff frontal ; podman top frontal ; podman port frontal
podman inspect frontal --format '{{.State.Health.Status}}'
podman stats --no-stream ; podman update --memory 1g frontal
podman healthcheck run frontal ; podman init frontal
podman events --since 1h --filter event=died
```

## Images et manifestes

```bash
podman pull docker.io/library/nginx:1.27 ; podman push localhost/app:1 registre.exemple.fr/app:1
podman tag localhost/app:1 localhost/app:latest ; podman image ls --digests
podman save -o app.tar localhost/app:1 ; podman load -i app.tar
podman image prune -a ; podman image mount <id> ; podman image tree localhost/app:1
podman manifest create app:multi ; podman manifest add app:multi docker://app:1-arm64
podman manifest push --all app:multi docker://registre.exemple.fr/app:multi
```

## Réseaux, volumes, checkpoint

```bash
podman network create --subnet 10.89.0.0/24 --gateway 10.89.0.1 interne
podman network ls ; podman network inspect interne ; podman network reload --all
podman volume create data ; podman volume export data -o data.tar ; podman volume import data data.tar
# Checkpoint / restauration à chaud (CRIU)
podman container checkpoint frontal --export frontal.ckpt.tar
podman container restore --import frontal.ckpt.tar
```

## Machine (Windows, macOS, Linux)

```bash
podman machine init --cpus 4 --memory 8192 --disk-size 50 --rootful
podman machine start ; podman machine ssh ; podman machine ls
podman machine set --rootful=false ; podman machine stop ; podman machine rm
podman system connection list ; podman --remote --connection distant ps     # hôte Podman distant
```

## Buildah (construction fine)

```bash
ctr=$(buildah from docker.io/library/debian:12)
buildah run $ctr apt-get update
buildah copy $ctr ./app /app
buildah config --port 8080 --entrypoint '["/app/serveur"]' --user 10001 $ctr
buildah commit $ctr localhost/app:1.2 ; buildah images ; buildah containers
buildah bud -t localhost/app:1.2 .                 # construire depuis un Dockerfile
buildah push localhost/app:1.2 docker://registre.exemple.fr/app:1.2
buildah unshare ; buildah mount $ctr                # accéder au système de fichiers (rootless)
```

## Skopeo (images sans démon)

```bash
skopeo login registre.exemple.fr
skopeo inspect docker://docker.io/library/nginx:1.27 | jq '.Digest,.Created,.Architecture'
skopeo list-tags docker://docker.io/library/nginx
skopeo copy --all docker://docker.io/library/nginx:1.27 docker://registre.exemple.fr/miroir/nginx:1.27
skopeo copy docker://nginx:1.27 oci-archive:nginx.tar   # vers une archive OCI
skopeo sync --src docker --dest dir docker.io/library/redis ./miroir-redis
skopeo delete docker://registre.exemple.fr/app:ancien
```
