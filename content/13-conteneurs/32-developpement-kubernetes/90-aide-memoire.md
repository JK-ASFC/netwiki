---
title: Skaffold, Tilt, Garden et Telepresence — aide-mémoire
description: Commandes Skaffold (init, dev, run, build, render, deploy, delete, diagnose, verify), Tilt (up, down, ci, logs, trigger, get), Garden (dev, deploy, test, build, logs, cleanup, plugins) et Telepresence (helm install, connect, status, list, intercept, leave, quit, uninstall) avec exemples.
tags: [aide-mémoire, skaffold, tilt, garden, telepresence]
icon: terminal
---

Explications : [[01-presentation-utilisation|outils de développement]].

```bash
skaffold init ; skaffold dev ; skaffold run -p prod --tail ; skaffold build --push ; skaffold render ; skaffold delete ; skaffold diagnose
tilt up ; tilt up --stream ; tilt ci ; tilt down ; tilt logs inventaire ; tilt trigger inventaire ; tilt get uiresources
garden dev ; garden deploy ; garden test ; garden build ; garden logs ; garden cleanup namespace
telepresence helm install ; telepresence connect ; telepresence status ; telepresence list -n inventaire-dev
telepresence intercept inventaire --port 8000 --env-file ./inventaire.env ; telepresence leave inventaire ; telepresence quit ; telepresence helm uninstall
```
