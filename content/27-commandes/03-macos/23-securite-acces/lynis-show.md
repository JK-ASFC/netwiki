---
title: "lynis show"
description: "macOS — lynis show (Audit / Informations) : Affiche des informations sur Lynis et sur le système audité : commandes, options, profils, réglages actifs, tests, catégories et groupes, chemins."
tags: [macos, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Audit / Informations |
| **Commande type** | `lynis show commands` |

## Rôle

Affiche des informations sur Lynis et sur le système audité : commandes, options, profils, réglages actifs, tests, catégories et groupes, chemins.

## Options

| Option | Rôle |
| --- | --- |
| `help` | aide et astuces |
| `commands` | commandes disponibles |
| `options` | toutes les options, à jour |
| `version` | version de Lynis |
| `release` | version stable ou préversion |
| `profiles` | profils découverts et utilisés |
| `settings` | réglages actifs |
| `tests` | tests disponibles |
| `categories` | catégories de tests |
| `groups` | groupes de tests |
| `details ‹TEST-ID›` | détail d'un test, depuis le journal |
| `os` | système détecté |
| `environment` | matériel, VM ou conteneur |
| `hostids` | identifiants hostid et hostid2 |
| `eol` | fin de vie du système |
| `logfile` | emplacement du journal |
| `plugindir` | dossier des plugins |
| `changelog` | historique des changements |
| `man` | page de manuel |
| `(autres) dbdir includedir workdir pidfile language license releasedate` | chemins et valeurs internes |

## Exemples

**Voir les commandes**

```zsh
lynis show commands
```

**Quel profil est lu**

```zsh
lynis show profiles
```

**Détail d'un test du rapport**

```zsh
lynis show details PKGS-7392
```

## Dans les autres shells

- [[27-commandes/01-bash/22-securite-acces/lynis-show|lynis show (Bash)]]

*Mots-clés : lynis show commands options profiles settings version tests catégories groups détails os environment hostids*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
