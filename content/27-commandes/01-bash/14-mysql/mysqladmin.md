---
title: "mysqladmin"
description: "Bash — mysqladmin (Administration) : Administration rapide : état, ping, création/suppression de base, mot de passe."
tags: [bash, commande, mysql]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
mysqladmin -u root -p status
```

**Tester la dispo**

```bash
mysqladmin -u root -p ping
```

**Créer une base**

```bash
mysqladmin -u root -p create app_db
```

## Dans les autres shells

- [[27-commandes/02-powershell/14-mysql/mysqladmin|mysqladmin (PowerShell)]]
- [[27-commandes/03-macos/14-mysql/mysqladmin|mysqladmin (macOS)]]

*Mots-clés : mysqladmin admin status ping processlist flush créer base mot de passe mysql lamp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
