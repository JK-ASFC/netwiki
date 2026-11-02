---
title: Présentation, installation et utilisation
description: Lens, Headlamp et K9s — outils pour explorer et administrer des clusters Kubernetes : Lens (application de bureau Mirantis ; édition libre OpenLens et forks, licences et compte), Headlamp (CNCF, application de bureau ou interface web dans le cluster, greffons, RBAC respecté), K9s (interface en terminal : navigation, raccourcis, journaux, shell, port-forward, plugins, skins, lecture seule) ; installation Windows, Linux, macOS, kubeconfig et contextes, et bonnes pratiques d'accès.
tags: [lens, openlens, headlamp, k9s, kubernetes, interface, kubeconfig]
icon: info
---

Ces outils lisent votre **kubeconfig** et offrent une vue d'ensemble plus confortable que `kubectl` : ressources, journaux, événements, shell dans un conteneur, métriques. Ils n'ajoutent **aucun droit** : chacun voit ce que son compte Kubernetes autorise (RBAC).

| Outil | Type | Licence | Points forts |
| --- | --- | --- | --- |
| **Lens Desktop** | Application de bureau | Propriétaire (gratuit sous conditions, compte requis) | Ergonomie, extensions |
| OpenLens / FreeLens | Application de bureau | MIT (forks communautaires) | Lens sans compte |
| **Headlamp** | Bureau **ou** web dans le cluster | Apache 2.0 (CNCF, sous-projet Kubernetes SIG UI) | Remplaçant du Kubernetes Dashboard, greffons (Flux, Prometheus) |
| **K9s** | Terminal | Apache 2.0 | Rapide, au clavier, fonctionne en SSH |

## Installation

| Outil | Windows | macOS | Linux |
| --- | --- | --- | --- |
| Lens | `winget install Mirantis.Lens` | `brew install --cask lens` | `.deb`, `.rpm`, AppImage, snap |
| Headlamp | Installeur `.exe` des versions GitHub | `brew install --cask headlamp` | Flatpak, AppImage, `.deb` |
| K9s | `winget install Derailed.k9s` | `brew install derailed/k9s/k9s` | `snap install k9s`, binaire GitHub |

Headlamp dans le cluster : `helm repo add headlamp https://kubernetes-sigs.github.io/headlamp/ && helm install headlamp headlamp/headlamp -n kube-system`, connexion par jeton de compte de service ou OIDC.

## K9s en pratique

```bash
k9s                           # contexte courant ; k9s --context prod -n inventaire ; k9s --readonly
```

| Touche / commande | Action |
| --- | --- |
| `:pods`, `:deploy`, `:svc`, `:ns`, `:nodes`, `:events` | Changer de vue |
| `/texte` | Filtrer |
| `l` / `s` / `d` / `e` | Journaux / shell / décrire / éditer |
| `Shift+f` | Port-forward |
| `Ctrl+d` / `Ctrl+k` | Supprimer / tuer |
| `:xray deploy` | Arborescence des dépendances |
| `:pulses` | Tableau de bord du cluster |

> [!TIP]
> Utilisez un compte en **lecture seule** pour la consultation quotidienne et `k9s --readonly` sur la production ; réservez les droits d'écriture à des kubeconfig distincts.

Interface : [[02-interface-graphique|captures]] · commandes : [[90-aide-memoire|aide-mémoire]].
