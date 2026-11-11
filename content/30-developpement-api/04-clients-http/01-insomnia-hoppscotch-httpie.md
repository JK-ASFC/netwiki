---
title: Insomnia, Hoppscotch, HTTPie, xh et wget
description: Clients HTTP pour tester et appeler des API — Insomnia (client graphique REST/GraphQL/gRPC, collections, environnements, question de la connexion de compte et des versions libres), Hoppscotch (client web léger auto-hébergeable, Docker), HTTPie (client en ligne de commande lisible, http/https, sessions, JSON par défaut), xh (clone rapide de HTTPie en Rust) et wget (téléchargement et appels simples) ; exemples, authentification et place face à curl et Postman.
tags: [insomnia, hoppscotch, httpie, xh, wget, api, http, rest, graphql, client]
icon: send
---

Pour appeler et tester des API, on dispose de clients **graphiques** (collections, environnements, partage) et de clients **en ligne de commande** (scriptables, légers). Ils complètent [[02-reseau-diagnostic/07-postman-bruno|Postman et Bruno]] et `curl` ([[02-reseau-diagnostic/06-dig-mtr-curl|dig, mtr, curl]]), déjà présentés.

## Insomnia

Client **graphique** (REST, GraphQL, gRPC, WebSocket, SSE) : requêtes organisées en collections, variables d'**environnement**, chaînage, génération de code, import OpenAPI.

```bash
# Linux : Flatpak ou .deb ; Windows : winget ; macOS : brew install --cask insomnia
flatpak install flathub rest.insomnia.Insomnia
```

> [!NOTE]
> Les versions récentes d'Insomnia **incitent à créer un compte** pour la synchronisation cloud ; l'usage local reste possible. Pour une alternative entièrement locale et sans compte, **Bruno** (déjà dans le wiki) stocke les collections en fichiers versionnables dans Git.

## Hoppscotch

Client **web** léger (ex-Postwoman), **auto-hébergeable** : pratique pour une équipe sans installer d'application. REST, GraphQL, WebSocket, collections, environnements.

```bash
docker run -d --name hoppscotch -p 127.0.0.1:3000:3000 hoppscotch/hoppscotch
# Interface : http://serveur:3000 ; une version avec comptes et persistance (self-host complet) existe
```

## HTTPie

Client **en ligne de commande** pensé pour la **lisibilité** : sortie colorée, JSON par défaut, syntaxe concise.

```bash
python3 -m pip install httpie          # ou apt install httpie ; brew install httpie
http GET https://api.exemple.fr/v1/equipements X-Api-Key:ABC search==switch
http POST https://api.exemple.fr/v1/tickets titre="Panne Wi-Fi" priorite:=2    # := pour un nombre/booléen (JSON)
http --session=prod GET https://api.exemple.fr/v1/me Authorization:"Bearer $JETON"   # session réutilisable
http --download https://exemple.fr/fichier.iso
https --verify=/etc/ssl/ca-interne.pem GET https://interne.exemple.fr/        # CA personnalisée
```

- `champ==valeur` : paramètre d'URL ; `champ=valeur` : chaîne JSON ; `champ:=valeur` : JSON brut ; `En-Tête:valeur` : en-tête.
- `--session` enregistre cookies et en-têtes (sous `~/.config/httpie`).

## xh

**xh** réimplémente HTTPie en **Rust** : mêmes commandes, démarrage quasi instantané, un seul binaire. Idéal pour les scripts et les conteneurs.

```bash
# Binaire des versions GitHub ; brew install xh ; cargo install xh
xh GET https://api.exemple.fr/v1/equipements search==switch
xh POST https://api.exemple.fr/v1/tickets titre="Test" priorite:=1
```

## wget

Au-delà du téléchargement, **wget** sert aux appels HTTP simples et aux vérifications en script (présent presque partout).

```bash
wget -qO- https://api.exemple.fr/health                       # afficher la réponse
wget --method=POST --header='Content-Type: application/json' --body-data='{"ping":true}' -qO- https://api.exemple.fr/v1/echo
wget --header="Authorization: Bearer $JETON" -O export.json https://api.exemple.fr/v1/export
wget --mirror --no-parent -P site https://docs.exemple.fr/    # copie d'un site statique
```

## Choisir

| Besoin | Outil |
| --- | --- |
| Collections partagées, GraphQL/gRPC, interface | Insomnia, Hoppscotch |
| Collections versionnées dans Git, sans compte | [[02-reseau-diagnostic/07-postman-bruno\|Bruno]] |
| Appels lisibles au clavier | HTTPie, xh |
| Scripts, conteneurs, partout | curl, wget, xh |

Ne jamais mettre de **jeton** en clair dans une commande partagée ou un historique : utiliser des variables d'environnement ou les sessions.

Commandes : [[90-aide-memoire|aide-mémoire]].
