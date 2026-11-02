---
title: Element et outils d'administration
description: Client Element (web, bureau Windows/macOS/Linux, Android, iOS) — connexion à un serveur domestique, salons et espaces, chiffrement de bout en bout et vérification des sessions, sauvegarde des clés, appels et Element Call ; hébergement d'Element Web (config.json) ; outils d'administration (synapse-admin, Matrix Authentication Service), avec emplacements de captures d'écran.
tags: [element, matrix, client, synapse-admin, interface graphique, captures]
icon: monitor
---

## Element

| Plate-forme | Installation |
| --- | --- |
| Web | Element Web auto-hébergé (`config.json` : `default_server_config` vers `https://matrix.corp.exemple.fr`) |
| Windows / macOS / Linux | `winget install Element.Element` · `brew install --cask element` · paquet Debian du dépôt Element ou Flathub |
| Android / iOS | Element X (nouvelle génération) ou Element |

Points d'attention pour les utilisateurs : **vérifier** chaque nouvelle session (appareil) et configurer la **sauvegarde des clés** (phrase ou clé de récupération), sans quoi l'historique chiffré est perdu en changeant d'appareil.

<!-- CAPTURE: Element — liste des salons et espaces | _assets/element-salons.png -->
<!-- CAPTURE: Element — vérification d'une nouvelle session | _assets/element-verification.png -->

## synapse-admin

Interface web (conteneur `awesometechnologies/synapse-admin`) : utilisateurs (création, désactivation, réinitialisation), salons (purge, suppression), médias, rapports d'abus, statistiques.

<!-- CAPTURE: synapse-admin — liste des utilisateurs | _assets/synapse-admin-utilisateurs.png -->
