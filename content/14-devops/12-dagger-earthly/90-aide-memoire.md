---
title: Dagger et Earthly — aide-mémoire des commandes
description: Commandes Dagger (version, init, develop, functions, call, install, shell interactif, --progress plain) et Earthly (+cible, --push, --ci, --secret, -P, ls, prune, bootstrap) avec exemples.
tags: [aide-mémoire, dagger, earthly]
icon: terminal
---

Explications : [[01-presentation-installation|Dagger et Earthly]].

```bash
dagger version ; dagger init --sdk=go --name=ci ; dagger develop
dagger functions ; dagger call --help ; dagger call test --source=. --progress=plain
dagger install <module du Daggerverse> ; dagger
earthly bootstrap ; earthly ls ; earthly +test ; earthly --ci --push +image
earthly --secret REGISTRE_MDP +publier ; earthly -P +integration ; earthly prune
```
