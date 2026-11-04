---
title: "SetEnvironmentVariable"
description: "PowerShell — SetEnvironmentVariable (Environnement / Persistance) : Définit une variable d'environnement persistante (= export durable)."
tags: [powershell, commande, environnement-variables]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Environnement & variables |
| **Contexte** | Environnement / Persistance |
| **Commande type** | `[Environment]::SetEnvironmentVariable("EDITOR","code","User")` |

## Rôle

Définit une variable d'environnement persistante (= export durable).

## Options

| Option | Rôle |
| --- | --- |
| `"User"` | pour l'utilisateur |
| `"Machine"` | pour la machine (admin) |
| `GetEnvironmentVariable` | lecture |
| `(persiste)` | survit à la session |

## Exemples

**Pour l'utilisateur**

```powershell
[Environment]::SetEnvironmentVariable("EDITOR","code","User")
```

**Pour la machine**

```powershell
[Environment]::SetEnvironmentVariable("PROXY","host:8080","Machine")
```

**Lire**

```powershell
[Environment]::GetEnvironmentVariable("PATH","User")
```

*Mots-clés : persister variable environnement machine user export setenvironmentvariable*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
