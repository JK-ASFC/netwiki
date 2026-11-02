---
title: Lens, Headlamp et K9s — aide-mémoire
description: Commandes et raccourcis — kubeconfig et contextes (kubectl config get-contexts, use-context, KUBECONFIG multiple), K9s (options --context, -n, --readonly, -c, info ; raccourcis de navigation, alias, plugins, hotkeys, fichiers de configuration), Headlamp (installation Helm, jeton de compte de service) et Lens.
tags: [aide-mémoire, k9s, headlamp, lens, kubeconfig]
icon: terminal
---

Explications : [[01-presentation|Lens, Headlamp et K9s]].

```bash
kubectl config get-contexts ; kubectl config use-context prod ; export KUBECONFIG=~/.kube/prod:~/.kube/recette ; kubectl config view --flatten > ~/.kube/config
k9s ; k9s --context prod -n inventaire ; k9s --readonly ; k9s -c pods ; k9s info          # emplacement des fichiers de configuration
helm upgrade --install headlamp headlamp/headlamp -n kube-system
kubectl -n kube-system create serviceaccount lecture-ui && kubectl create clusterrolebinding lecture-ui --clusterrole=view --serviceaccount=kube-system:lecture-ui
kubectl -n kube-system create token lecture-ui --duration=8h
```

Raccourcis K9s : `?` aide · `:ctx` contextes · `:ns` namespaces · `0` tous les namespaces · `l` journaux (`w` retour à la ligne, `0` depuis le début) · `s` shell · `d` décrire · `y` YAML · `e` éditer · `Shift+f` port-forward · `Ctrl+d` supprimer · `Esc` retour.
