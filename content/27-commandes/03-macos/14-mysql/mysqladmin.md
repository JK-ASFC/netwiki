---
title: "mysqladmin"
description: "macOS — mysqladmin (Administration) : Administration rapide : état, ping, création/suppression de base, mot de passe."
tags: [macos, commande, mysql]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | MySQL |
| **Contexte** | Administration |
| **Commande type** | `mysqladmin -u ‹utilisateur› -p status` |

## Rôle

Administration rapide : état, ping, création/suppression de base, mot de passe.

## Options

| Option | Rôle |
| --- | --- |
| `-u ‹utilisateur›` | utilisateur |
| `-p` | mot de passe |
| `status` | état du serveur |
| `ping` | teste si le serveur répond |
| `processlist` | threads/connexions en cours |
| `create ‹base›` | crée une base |
| ⚠️ `drop ‹base›` | SUPPRIME une base |
| `flush-privileges` | recharge les droits |
| ⚠️ `shutdown` | arrête le serveur |

> [!WARNING]
> Options à manier avec précaution : `drop ‹base›`, `shutdown`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Vérifier l'état**

```zsh
mysqladmin -u root -p status
```

**Tester la dispo**

```zsh
mysqladmin -u root -p ping
```

**Créer une base**

```zsh
mysqladmin -u root -p create app_db
```

## Dans les autres shells

- [[27-commandes/01-bash/14-mysql/mysqladmin|mysqladmin (Bash)]]
- [[27-commandes/02-powershell/14-mysql/mysqladmin|mysqladmin (PowerShell)]]

*Mots-clés : mysqladmin admin status ping processlist flush créer base mot de passe mysql lamp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
