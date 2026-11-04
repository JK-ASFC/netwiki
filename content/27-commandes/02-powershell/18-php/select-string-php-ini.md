---
title: "Select-String (php.ini)"
description: "PowerShell — Select-String (php.ini) (Configuration / WAMP) : Sous Windows, les extensions s'activent dans php.ini (extension=php_xxx) — pas de pecl ni phpenmod."
tags: [powershell, commande, php]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | PHP |
| **Contexte** | Configuration / WAMP |
| **Commande type** | `Select-String -Path php.ini -Pattern "^extension="` |

## Rôle

Sous Windows, les extensions s'activent dans php.ini (extension=php_xxx) — pas de pecl ni phpenmod.

## Options

| Option | Rôle |
| --- | --- |
| `-Path ‹php.ini›` | fichier de config (php.exe --ini le localisé) |
| `-Pattern ‹motif›` | directive recherchée |
| `(décommenter extension=php_mbstring)` | active une extension |
| `(memory_limit, error_reporting)` | réglages courants |
| `(puis)` | Restart-Service Apache2.4 |

## Exemples

**Extensions actives**

```powershell
Select-String -Path php.ini -Pattern "^extension="
```

**Voir un réglage**

```powershell
Select-String -Path php.ini -Pattern "memory_limit"
```

**Localiser le php.ini**

```powershell
php.exe --ini
```

*Mots-clés : php.ini extension activer dll mbstring opcache xdebug windows php wamp configurer*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
