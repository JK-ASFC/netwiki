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
