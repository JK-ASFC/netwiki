---
title: Buildah et Skopeo
description: Buildah et Skopeo (projet containers, Red Hat, Apache 2.0) — construire des images OCI sans démon ni root (buildah build à partir d'un Dockerfile/Containerfile, construction pas à pas from/run/copy/commit, rootless, CI dans des conteneurs non privilégiés) et manipuler des images entre registres sans les télécharger localement (skopeo inspect, copy, sync pour miroirs hors ligne, delete, list-tags, login, signature) ; installation Linux (paquets), macOS et Windows via Podman machine, et intégration avec Podman.
tags: [buildah, skopeo, podman, oci, images, registre, rootless]
icon: info
---

Ces outils complètent [[02-podman/01-presentation-installation|Podman]] : **Buildah** construit des images, **Skopeo** les inspecte et les copie entre registres. Aucun démon, fonctionnement **rootless** : parfaits pour la CI et les machines sans Docker.

## Installation

```bash
sudo apt install buildah skopeo          # Debian/Ubuntu
sudo dnf install buildah skopeo          # RHEL/Fedora (souvent préinstallés)
brew install skopeo                      # macOS (Buildah via « podman build » dans la VM Podman)
```

Windows et macOS : `podman build` (qui utilise Buildah) dans la machine virtuelle Podman.

## Buildah

```bash
buildah build -t registry.corp.exemple.fr/infra/inventaire:1.8.2 -f Containerfile .     # depuis un Dockerfile
buildah push registry.corp.exemple.fr/infra/inventaire:1.8.2
# Construction pas à pas, sans Dockerfile
c=$(buildah from registry.access.redhat.com/ubi9/ubi-minimal)
buildah run $c -- microdnf install -y python3 && buildah copy $c ./app /app
buildah config --cmd '["python3","/app/main.py"]' --user 1001 --label equipe=infra $c
buildah commit $c registry.corp.exemple.fr/infra/outil:1.0 && buildah rm $c
```

Dans une CI conteneurisée (GitLab, Jenkins, Tekton) : image `quay.io/buildah/stable` avec `--storage-driver=vfs` et `--isolation=chroot` si le conteneur n'est pas privilégié.

## Skopeo

```bash
skopeo inspect docker://docker.io/library/nginx:1.27 | jq '.Digest, .Created'
skopeo list-tags docker://registry.corp.exemple.fr/infra/inventaire
skopeo copy docker://docker.io/library/nginx:1.27 docker://registry.corp.exemple.fr/miroir/nginx:1.27      # registre à registre
skopeo copy docker://quay.io/prometheus/prometheus:v3.2.1 oci-archive:/media/usb/prometheus.tar           # pour un réseau isolé
skopeo sync --src yaml --dest docker images-a-synchroniser.yaml registry.corp.exemple.fr/miroir           # miroir de liste d'images
skopeo delete docker://registry.corp.exemple.fr/infra/inventaire:ancien
```

Suite : [[02-analyse-images|Dive, Hadolint et Dockle]] · [[03-kompose|Kompose]] · [[90-aide-memoire|aide-mémoire]].
