---
title: Outils d'images — aide-mémoire des commandes
description: Commandes Buildah (build, from, run, copy, config, commit, push, images, containers, rm, rmi, login, manifest), Skopeo (inspect, list-tags, copy, sync, delete, login, --all), Hadolint, Dive, Dockle et Kompose (convert, --chart, version) avec exemples.
tags: [aide-mémoire, buildah, skopeo, hadolint, dive, dockle, kompose]
icon: terminal
---

Explications : [[01-buildah-skopeo|Buildah et Skopeo]] · [[02-analyse-images|Dive, Hadolint et Dockle]] · [[03-kompose|Kompose]].

```bash
buildah images ; buildah containers ; buildah build --layers -t IMG . ; buildah login registry.corp.exemple.fr ; buildah push IMG ; buildah rmi IMG
buildah manifest create app:multi ; buildah build --platform linux/amd64,linux/arm64 --manifest app:multi . ; buildah manifest push --all app:multi docker://REG/app:1.0
skopeo login registry.corp.exemple.fr ; skopeo inspect --raw docker://IMG | jq . ; skopeo copy --all docker://SRC docker://DEST
skopeo copy docker://IMG dir:/tmp/image ; skopeo sync --src docker --dest dir docker.io/library/alpine /media/usb/
hadolint Dockerfile ; dive IMG ; CI=true dive IMG ; dockle IMG ; kompose convert -f compose.yaml -o k8s/ ; kompose version
```
