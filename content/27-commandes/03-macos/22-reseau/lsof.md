---
title: "lsof"
description: "macOS — lsof (Ports & fichiers ouverts) : Liste les fichiers ouverts et surtout les ports en écoute (remplace ss sur macOS)."
tags: [macos, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Réseau |
| **Contexte** | Ports & fichiers ouverts |
| **Commande type** | `lsof -i -P -n` |

## Rôle

Liste les fichiers ouverts et surtout les ports en écoute (remplace ss sur macOS).

## En détail

Liste les fichiers ouverts et par quel programme, y compris les connexions réseau. Sert à savoir qui utilise un fichier ou un port.

## Options

| Option | Rôle |
| --- | --- |
| `-i` | connexions réseau (fichiers Internet) |
| `-i :‹port›` | ce qui utilise un port précis |
| `-P` | ports numériques (pas de résolution de service) |
| `-n` | pas de résolution DNS (plus rapide) |
| `-i TCP -sTCP:LISTEN` | seulement les ports en écoute |

## Exemples

**Ports en écoute**

```zsh
lsof -i -P -n | grep LISTEN
```

**Qui occupe le port 8080**

```zsh
lsof -i :8080
```

**Connexions d'une app**

```zsh
lsof -i -a -c Safari
```

## Dans les autres shells

- [[27-commandes/01-bash/19-processus-perf/lsof|lsof (Bash)]]
- [[27-commandes/03-macos/20-processus-perf/lsof|lsof (macOS)]]

*Mots-clés : ports écoute lsof connexions fichiers ouverts réseau*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
