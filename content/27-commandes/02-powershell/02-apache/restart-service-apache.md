---
title: "Restart-Service (Apache)"
description: "PowerShell — Restart-Service (Apache) (Service / WAMP) : Gère le service Windows d'Apache (démarrer, arrêter, redémarrer)."
tags: [powershell, commande, apache]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Apache |
| **Contexte** | Service / WAMP |
| **Commande type** | `Restart-Service Apache2.4` |

## Rôle

Gère le service Windows d'Apache (démarrer, arrêter, redémarrer).

## Options

| Option | Rôle |
| --- | --- |
| `-Force` | force même avec des services dépendants |
| `(Start-Service ‹service›)` | démarre le service |
| `(Stop-Service ‹service›)` | arrête le service |
| `(Get-Service ‹service›)` | affiche l'état |

## Exemples

**Redémarrer**

```powershell
Restart-Service Apache2.4
```

**Démarrer**

```powershell
Start-Service Apache2.4
```

**Voir l'état**

```powershell
Get-Service Apache2.4
```

*Mots-clés : apache service windows restart start stop redémarrer wamp httpd get-service*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
