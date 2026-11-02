---
title: Présentation, installation et utilisation
description: Outils de développement sur Kubernetes — Skaffold (Google : construction, déploiement et rechargement automatiques, profils, skaffold dev, run, render, CI), Tilt (Tiltfile en Starlark, interface web, live update), Garden (graphe d'actions build/deploy/test/run, environnements éphémères, cache) et Telepresence (accès réseau au cluster depuis le poste, interception du trafic d'un service vers le code local, Traffic Manager), installation Windows, Linux et macOS, et cas d'usage pour les équipes.
tags: [skaffold, tilt, garden, telepresence, kubernetes, développement]
icon: info
---

Ces outils raccourcissent la boucle « modifier → construire → déployer → tester » sur Kubernetes, pour les développeurs comme pour les équipes d'infrastructure qui écrivent des opérateurs ou des services internes.

| Outil | Rôle | Licence |
| --- | --- | --- |
| **Skaffold** | Surveille le code, reconstruit les images et redéploie (Helm, Kustomize, kubectl) | Apache 2.0 |
| **Tilt** | Idem avec une interface web et le *live update* (copie de fichiers dans le conteneur sans reconstruire) | Apache 2.0 |
| **Garden** | Graphe de construction/déploiement/tests avec cache, environnements éphémères par branche | MPL 2.0 |
| **Telepresence** | Relie le poste au réseau du cluster ; redirige le trafic d'un service vers le processus local | Apache 2.0 |

## Installation

| Outil | Windows | macOS | Linux |
| --- | --- | --- | --- |
| Skaffold | Binaire `skaffold-windows-amd64.exe` | `brew install skaffold` | binaire `storage.googleapis.com/skaffold/releases/latest/skaffold-linux-amd64` |
| Tilt | `iex ((new-object net.webclient).DownloadString('https://raw.githubusercontent.com/tilt-dev/tilt/master/scripts/install.ps1'))` | `brew install tilt` | `curl -fsSL https://raw.githubusercontent.com/tilt-dev/tilt/master/scripts/install.sh \| bash` |
| Garden | `iwr https://get.garden.io/install.ps1 -useb \| iex` | `brew install garden-io/garden/garden-cli` | `curl -sL https://get.garden.io/install.sh \| bash` |
| Telepresence | Installeur Windows | `brew install telepresenceio/telepresence/telepresence-oss` | binaire GitHub |

## Exemples

```yaml
# skaffold.yaml
apiVersion: skaffold/v4beta11
kind: Config
build:
  artifacts:
    - image: registry.corp.exemple.fr/infra/inventaire
      docker: { dockerfile: Dockerfile }
manifests:
  kustomize: { paths: [overlays/dev] }
profiles:
  - name: prod
    manifests: { kustomize: { paths: [overlays/prod] } }
```

```bash
skaffold dev --port-forward          # boucle continue ; Ctrl+C nettoie
skaffold run -p prod ; skaffold render -p prod > rendu.yaml
```

```python
# Tiltfile
docker_build('registry.corp.exemple.fr/infra/inventaire', '.', live_update=[sync('./src', '/app/src')])
k8s_yaml(kustomize('overlays/dev'))
k8s_resource('inventaire', port_forwards=8000)
```

```bash
tilt up                              # interface web http://localhost:10350
telepresence helm install            # Traffic Manager dans le cluster (une fois)
telepresence connect                 # le poste résout et joint les services du cluster
curl http://inventaire.inventaire-dev:8000/sante
telepresence intercept inventaire --port 8000      # le trafic du service arrive sur le processus local
telepresence leave inventaire ; telepresence quit
```

<!-- CAPTURE: Tilt — interface web, état des ressources et journaux | _assets/tilt-ui.png -->

Commandes : [[90-aide-memoire|aide-mémoire]].
