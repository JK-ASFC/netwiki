---
title: Présentation, installation et mode rootless
description: Podman — moteur de conteneurs sans démon et sans privilèges (rootless), compatibilité avec la CLI Docker, outils associés (Buildah, Skopeo), installation sous Linux, Windows et macOS (podman machine), registres et noms courts, plages subuid/subgid, réseau rootless (pasta), socket compatible Docker et podman compose.
tags: [podman, rootless, conteneurs, buildah, skopeo, installation, registries.conf]
icon: info
---

**Podman** (Red Hat) exécute des conteneurs OCI **sans démon** : chaque conteneur est un processus fils de la commande (ou d'une unité systemd), et le mode **rootless** (utilisateur non privilégié) est natif. Sa ligne de commande est compatible avec celle de Docker (`alias docker=podman` fonctionne dans la plupart des cas). C'est l'outil par défaut de RHEL, Fedora et dérivées.

## Podman et Docker

| Critère | Podman | [[01-docker/01-presentation-installation\|Docker]] |
| --- | --- | --- |
| Architecture | Sans démon (fork/exec, conmon) | Démon `dockerd` |
| Rootless | Natif, par défaut pour les utilisateurs | Optionnel |
| Pods | Oui (groupe de conteneurs partageant le réseau, comme Kubernetes) | Non |
| Intégration systemd | **Quadlet** (unités `.container`) | Politique de redémarrage du démon |
| Compose | `podman compose` (via docker-compose ou podman-compose) | Natif |
| Construction | `podman build` (Buildah) | BuildKit |

| Outil associé | Rôle |
| --- | --- |
| **Buildah** | Construction d'images (avec ou sans Dockerfile) |
| **Skopeo** | Copier, inspecter, signer des images entre registres sans les télécharger localement |

## Installation

| Plate-forme | Installation |
| --- | --- |
| RHEL / Rocky / Alma | `sudo dnf install podman` (souvent présent) ; `container-tools` |
| Debian / Ubuntu | `sudo apt install podman` |
| macOS | `brew install podman && podman machine init && podman machine start` (VM Linux) |
| Windows | Podman Desktop ou `winget install RedHat.Podman` puis `podman machine init` (WSL 2) |

## Mode rootless

```bash
# Plages d'UID/GID subordonnés de l'utilisateur (créées automatiquement à la création du compte en général)
grep alice /etc/subuid /etc/subgid
sudo usermod --add-subuids 100000-165535 --add-subgids 100000-165535 alice   # si absent

podman run -d --name web -p 8080:80 docker.io/library/nginx:1.27
podman ps
podman unshare cat /proc/self/uid_map     # correspondance des UID dans l'espace de noms de l'utilisateur
```

| Contrainte rootless | Solution |
| --- | --- |
| Ports < 1024 | `sysctl net.ipv4.ip_unprivileged_port_start=80` ou reverse proxy |
| Conteneurs arrêtés à la déconnexion | `loginctl enable-linger alice` |
| Fichiers de volumes avec des UID « décalés » | Option `:U` des volumes ou `podman unshare chown` |
| Réseau | Pile utilisateur (**pasta**, slirp4netns) : performances un peu inférieures, pas de macvlan |

## Registres et noms courts

```ini /etc/containers/registries.conf (extrait)
unqualified-search-registries = ["registre.corp.exemple.fr", "docker.io"]
short-name-mode = "enforcing"

[[registry]]
location = "docker.io"
[[registry.mirror]]
location = "miroir-hub.corp.exemple.fr"
```

Utilisez des **noms complets** (`docker.io/library/nginx:1.27`) pour éviter toute ambiguïté (et l'usurpation par un autre registre).

```bash
podman login registre.corp.exemple.fr
skopeo inspect docker://registre.corp.exemple.fr/reseau/inventaire:1.4.2
skopeo copy docker://docker.io/library/nginx:1.27 docker://registre.corp.exemple.fr/miroir/nginx:1.27
```

## Compatibilité Docker

```bash
sudo dnf install podman-docker              # commande « docker » → podman
systemctl --user enable --now podman.socket # API compatible Docker (rootless)
export DOCKER_HOST=unix:///run/user/$(id -u)/podman/podman.sock
podman compose up -d                         # utilise docker-compose ou podman-compose
```

Les outils qui parlent à l'API Docker (Compose, Portainer, tests) fonctionnent alors avec Podman.

## Catalogue des commandes et outils

Podman reprend les commandes de Docker (`run`, `ps`, `build`, `image`, `network`, `volume`, `system`…) et y ajoute ses spécificités :

| Famille | Commandes propres à Podman |
| --- | --- |
| **Pods** | `podman pod create/start/stop/rm/ps/inspect/stats` |
| **Kubernetes** | `podman kube generate` / `play` / `down` ; `podman generate systemd` (déprécié → Quadlet) |
| **systemd / Quadlet** | unités `.container`/`.pod`/`.volume`/`.network`/`.kube`/`.image`, `podman auto-update` |
| **Rootless** | `podman unshare`, `podman system migrate`, `loginctl enable-linger` |
| **Machine** (VM) | `podman machine init/start/ssh/set/stop/rm` (Windows, macOS) |
| **Distant** | `podman system connection`, `podman --remote`, socket API compatible Docker |
| **Checkpoint** | `podman container checkpoint` / `restore` (CRIU) |
| **Farm** | `podman farm` (construction multi-architecture répartie) |
| **Secrets** | `podman secret create/ls/rm` (fichier, env) |

| Outil | Commandes | Rôle |
| --- | --- | --- |
| **Buildah** | `from`, `run`, `copy`, `config`, `commit`, `bud`, `images`, `mount`, `push` | Construire des images pas à pas ou depuis un Dockerfile |
| **Skopeo** | `inspect`, `copy`, `sync`, `list-tags`, `delete`, `login` | Opérer sur les images entre registres sans démon ni téléchargement local |

```bash
podman <commande> --help         # options détaillées
podman --help                     # liste complète ; voir aussi l'aide-mémoire
```

## Suite

[[02-pods-quadlet-exploitation|Pods, Quadlet, systemd et exploitation]]
