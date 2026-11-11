---
title: TriliumNext Notes et Memos
description: TriliumNext Notes (AGPL : base de connaissances hiérarchique, clonage de notes, attributs et relations, notes de code, scripts, cartes mentales, chiffrement de notes protégées, synchronisation serveur, application de bureau, Docker port 8080, sauvegardes automatiques, OpenID et TOTP) et Memos (MIT : notes rapides à la manière d'un fil, Markdown, étiquettes, visibilité, API, Docker port 5230, SQLite, MySQL ou PostgreSQL, comptes, accès par jeton) ; usages en équipe IT et sécurité.
tags: [triliumnext, trilium, memos, prise de notes, base de connaissances, auto-hébergement, markdown]
icon: notebook-pen
---

## TriliumNext Notes

**TriliumNext** est la suite communautaire de **Trilium Notes** (dont le développement initial s'est arrêté) : une base de connaissances **hiérarchique** très puissante, pensée pour des milliers de notes.

| Fonction | Détail |
| --- | --- |
| Arborescence | Profondeur illimitée ; une note peut être **clonée** à plusieurs endroits |
| Types de notes | Texte riche, **code** (coloration), carte mentale, canevas, diagramme Mermaid, tableau relationnel, fichier, rendu HTML |
| Attributs | Étiquettes et **relations** entre notes, modèles, requêtes de recherche enregistrées |
| Notes protégées | Chiffrées (mot de passe distinct), illisibles même sur le serveur |
| Scripts | JavaScript côté client ou serveur pour automatiser (widgets, tâches planifiées) |
| Historique | Versions de chaque note, journal du jour |

```bash
# Serveur (synchronisation et accès web)
docker run -d --name trilium -p 127.0.0.1:8080:8080 \
  -v /srv/trilium:/home/node/trilium-data \
  triliumnext/trilium:latest
# Applications de bureau (Windows, macOS, Linux) : se synchronisent avec le serveur
```

- Au premier accès, choisir le mot de passe ; options d'authentification à deux facteurs (TOTP) et **OpenID Connect** dans les versions récentes.
- Données : `document.db` (SQLite) dans le dossier de données ; **sauvegardes automatiques** quotidiennes, hebdomadaires et mensuelles dans `backup/`.
- Export d'une branche en HTML ou Markdown, import Markdown, Evernote (ENEX), OneNote (via conversion).

Usage IT : fiches d'équipements, procédures avec blocs de code, journal d'interventions, notes protégées pour des informations sensibles (pas pour des mots de passe : utiliser un gestionnaire dédié).

## Memos

**Memos** (MIT) est un outil de **notes rapides** façon fil d'actualité : on note une idée, une commande, un lien, en Markdown, avec des **étiquettes** (`#réseau`).

```bash
docker run -d --name memos -p 127.0.0.1:5230:5230 -v /srv/memos:/var/opt/memos neosmemo/memos:stable
# SQLite par défaut ; MySQL ou PostgreSQL : --driver postgres --dsn 'postgresql://memos:…@db:5432/memos?sslmode=disable'
```

- Le **premier compte créé** devient administrateur ; désactiver ensuite les inscriptions dans les réglages.
- Visibilité par note : privée, protégée (utilisateurs connectés), publique.
- **API** REST et gRPC avec jetons d'accès : capture depuis des scripts, raccourcis mobiles ou bots.

```bash
curl -X POST https://memos.exemple.fr/api/v1/memos -H "Authorization: Bearer $MEMOS_JETON" \
  -H 'Content-Type: application/json' -d '{"content":"#switch Port Gi1/0/12 en err-disabled, bpduguard","visibility":"PRIVATE"}'
```

## Sécurité

- Placer l'interface derrière un proxy HTTPS ; ne pas laisser l'inscription ouverte.
- Sauvegarder les dossiers de données (SQLite : arrêter le service ou utiliser la sauvegarde intégrée pour une copie cohérente).
- Les notes publiques sont indexables : vérifier la visibilité avant de partager.

Voir aussi : [[02-silverbullet-logseq-siyuan|SilverBullet, Logseq et SiYuan]] · [[21-outils/05-ia-productivite/08-obsidian|Obsidian]] · [[10-messagerie/09-joplin-server/01-installation-exploitation|Joplin Server]]. Commandes : [[90-aide-memoire|aide-mémoire]].
