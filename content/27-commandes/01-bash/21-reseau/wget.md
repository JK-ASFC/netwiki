---
title: "wget"
description: "Bash — wget (Tests d'API / Web) : Téléchargement robuste, avec reprise."
tags: [bash, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Réseau |
| **Contexte** | Tests d'API / Web |
| **Commande type** | `wget -c https://site/fichier.iso` |

## Rôle

Téléchargement robuste, avec reprise.

## En détail

Télécharge des fichiers depuis le web, y compris des sites entiers en récursif. Plus oriente téléchargement que curl.

## Options

| Option | Rôle |
| --- | --- |
| `-c` | reprend |
| `-O ‹fichier›` | nom de sortie |
| `-q` | silencieux |
| `-r` | récursif |
| `--limit-rate=‹débit›` | limite débit |

## Exemples

**Reprendre**

```bash
wget -c https://site/fichier.iso
```

## Dans les autres shells

- [[27-commandes/03-macos/22-reseau/wget|wget (macOS)]]

*Mots-clés : télécharger download fichier reprise miroir wget*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
