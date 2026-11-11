---
title: SilverBullet, Logseq et SiYuan
description: SilverBullet (MIT : notes Markdown dans le navigateur, fichiers sur disque, requêtes et modèles, scripts Space Lua, fonctionnement hors ligne, Docker port 3000, SB_USER), Logseq (AGPL : plan à puces, journal quotidien, références et graphe, fichiers Markdown locaux, version base de données, synchronisation par Git ou Syncthing), SiYuan (AGPL : éditeur par blocs, références de blocs, base SQLite, serveur Docker port 6806 avec code d'accès, synchronisation chiffrée de bout en bout vers S3 ou WebDAV) ; formats, portabilité et choix.
tags: [silverbullet, logseq, siyuan, prise de notes, markdown, base de connaissances, graphe, pkm]
icon: notebook-pen
---

Ces trois outils appartiennent à la famille des **gestionnaires de connaissances personnelles** (PKM) : notes reliées entre elles par des **liens bidirectionnels**, avec recherche et requêtes.

## SilverBullet

**SilverBullet** est une application web de notes **Markdown** dont les pages restent de simples **fichiers sur disque**. Elle fonctionne aussi **hors ligne** dans le navigateur (synchronisation au retour du réseau).

```bash
docker run -d --name silverbullet -p 127.0.0.1:3000:3000 \
  -v /srv/silverbullet:/space \
  -e SB_USER='admin:<mot de passe>' \
  ghcr.io/silverbulletmd/silverbullet
```

- **Liens** `[[Page]]`, étiquettes, tâches, **requêtes** intégrées (lister les tâches ouvertes de toutes les pages, les pages d'un type) et **modèles**.
- **Space Lua** : petits scripts dans les notes pour créer commandes, widgets et automatisations.
- Le dossier `/space` peut être versionné avec **Git** ou synchronisé avec un autre outil Markdown.

## Logseq

**Logseq** organise tout en **plans à puces** (*outliner*) : chaque puce est un bloc référençable. Un **journal quotidien** sert de point d'entrée ; les références entre pages et blocs forment un **graphe**.

```bash
# Applications de bureau (Windows, macOS, Linux AppImage / Flatpak) et mobiles
flatpak install flathub com.logseq.Logseq
```

- Version « fichiers » : un **graphe** est un dossier de fichiers Markdown (`pages/`, `journals/`) ; synchronisation libre par **Git**, Syncthing, Nextcloud.
- Requêtes (`{{query (and [[serveur]] (task TODO))}}`), modèles, tableaux blancs, cartes de révision.
- Une nouvelle version fondée sur une **base de données** (SQLite) remplace progressivement le format fichiers : vérifier le mode choisi avant de déployer et l'export disponible.
- Il n'y a pas de serveur officiel multi-utilisateurs : c'est un outil personnel ou de petite équipe partageant un dépôt.

## SiYuan

**SiYuan** est un éditeur **par blocs** (chaque paragraphe, titre ou liste est un bloc avec un identifiant), avec **références** et intégrations de blocs, bases de données (vues tableau), cartes mentales et révision espacée.

```bash
docker run -d --name siyuan -p 127.0.0.1:6806:6806 \
  -v /srv/siyuan:/siyuan/workspace \
  -u 1000:1000 \
  b3log/siyuan --workspace=/siyuan/workspace/ --accessAuthCode='<code d accès long>'
# Applications de bureau et mobiles disponibles
```

- Les données sont des fichiers `.sy` (JSON) indexés dans **SQLite** : export Markdown possible mais le format natif n'est pas du Markdown pur.
- **Synchronisation chiffrée de bout en bout** vers un stockage S3 ou WebDAV que vous fournissez (fonction payante sur le service officiel, gratuite avec votre propre stockage selon la licence en vigueur : vérifier).
- `--accessAuthCode` est **obligatoire** dès que le serveur est accessible par le réseau.

## Comparatif

| Critère | SilverBullet | Logseq | SiYuan | [[01-triliumnext-memos\|TriliumNext]] |
| --- | --- | --- | --- | --- |
| Modèle | Pages Markdown | Plan à puces, journal | Blocs | Arborescence de notes |
| Stockage | Fichiers Markdown | Markdown (ou base de données) | JSON + SQLite | SQLite |
| Accès web auto-hébergé | Oui | Non (bureau) | Oui | Oui |
| Programmable | Space Lua | Greffons | Greffons | Scripts JavaScript |
| Portabilité | Excellente | Bonne | Moyenne | Export HTML/Markdown |

Pour la **documentation d'équipe** (droits, relecture, publication), préférer un wiki (Wiki.js, BookStack, Outline) ; ces outils excellent pour les notes personnelles et la prise de notes technique au quotidien.

Commandes : [[90-aide-memoire|aide-mémoire]].
