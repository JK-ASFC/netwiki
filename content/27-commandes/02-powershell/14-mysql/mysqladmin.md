---
title: "mysqladmin"
description: "PowerShell — mysqladmin (Administration) : Administration rapide MySQL/MariaDB sous Windows."
tags: [powershell, commande, mysql]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | MySQL |
| **Contexte** | Administration |
| **Commande type** | `mysqladmin.exe -u ‹utilisateur› -p status` |

## Rôle

Administration rapide MySQL/MariaDB sous Windows.

## Options

| Option | Rôle |
| --- | --- |
| `-u ‹utilisateur›` | utilisateur |
| `-p` | mot de passe |
| `status` | état du serveur |
| `ping` | teste si le serveur répond |
| `processlist` | threads en cours |
| `create ‹base›` | crée une base |
| ⚠️ `drop ‹base›` | SUPPRIME une base |
| `flush-privileges` | recharge les droits |

> [!WARNING]
> Options à manier avec précaution : `drop ‹base›`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**État**

```powershell
mysqladmin.exe -u root -p status
```

**Tester**

```powershell
mysqladmin.exe -u root -p ping
```

**Créer une base**

```powershell
mysqladmin.exe -u root -p create app_db
```

## Dans les autres shells

- [[27-commandes/01-bash/14-mysql/mysqladmin|mysqladmin (Bash)]]
- [[27-commandes/03-macos/14-mysql/mysqladmin|mysqladmin (macOS)]]

*Mots-clés : mysqladmin admin status ping processlist flush créer base windows wamp mysql*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
