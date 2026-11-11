---
title: Clients HTTP et API — aide-mémoire
description: Commandes HTTPie et xh (GET, POST, paramètres, en-têtes, sessions, CA), wget (appels HTTP, miroir), déploiement de Hoppscotch et installation d'Insomnia.
tags: [aide-mémoire, httpie, xh, wget, insomnia, hoppscotch, api]
icon: terminal
---

Explications : [[01-insomnia-hoppscotch-httpie|Insomnia, Hoppscotch, HTTPie, xh et wget]].

```bash
# HTTPie / xh (mêmes arguments)
http GET https://api.exemple.fr/v1/x search==switch X-Api-Key:ABC
http POST https://api.exemple.fr/v1/x nom="Test" actif:=true liste:='[1,2]'
http --session=prod GET https://api.exemple.fr/v1/me Authorization:"Bearer $JETON"
http --download https://exemple.fr/f.iso
xh GET https://api.exemple.fr/v1/x            # équivalent, binaire Rust

# Syntaxe HTTPie : ==  param URL | =  chaîne JSON | :=  JSON brut | En-Tête:valeur

# wget
wget -qO- https://api.exemple.fr/health
wget --header="Authorization: Bearer $JETON" -O export.json https://api.exemple.fr/v1/export
wget --method=POST --header='Content-Type: application/json' --body-data='{"ping":true}' -qO- https://api.exemple.fr/echo

# Hoppscotch (auto-hébergé)
docker run -d -p 3000:3000 hoppscotch/hoppscotch

# Insomnia
flatpak install flathub rest.insomnia.Insomnia     # ou winget / brew --cask insomnia
```
