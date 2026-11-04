---
title: "Restart-Service (MySQL)"
description: "PowerShell — Restart-Service (MySQL) (Service / WAMP) : Gère le service Windows MySQL/MariaDB (le nom varie : MySQL, MySQL80, MariaDB)."
tags: [powershell, commande, mysql]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | MySQL |
| **Contexte** | Service / WAMP |
| **Commande type** | `Restart-Service MySQL80` |

## Rôle

Gère le service Windows MySQL/MariaDB (le nom varie : MySQL, MySQL80, MariaDB).

## Options

| Option | Rôle |
| --- | --- |
| `-Force` | force même avec des dépendances |
| `(Start-Service ‹service›)` | démarre |
| `(Stop-Service ‹service›)` | arrête |
| `(Get-Service *mysql*)` | retrouve le nom exact du service |

## Exemples

**Redémarrer**

```powershell
Restart-Service MySQL80
```

**Trouver le service**

```powershell
Get-Service *mysql*
```

**Démarrer**

```powershell
Start-Service MariaDB
```

*Mots-clés : mysql service windows restart start stop redémarrer wamp mariadb get-service*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
