---
title: "$env:"
description: "PowerShell — $env: (Environnement / Variables) : Accède ou définit une variable d'environnement de session."
tags: [powershell, commande, environnement-variables]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Environnement & variables |
| **Contexte** | Environnement / Variables |
| **Commande type** | `$env:PATH` |

## Rôle

Accède ou définit une variable d'environnement de session.

## Options

| Option | Rôle |
| --- | --- |
| `$env:VAR` | lecture |
| `$env:VAR="x"` | écriture (session) |
| `$env:NUMBER_OF_PROCESSORS` | coeurs (= nproc) |
| `[Environment]::GetEnvironmentVariable` | portée précise |

## Exemples

**Lire**

```powershell
$env:PATH
```

**Définir (session)**

```powershell
$env:EDITOR="code"
```

**Nombre de coeurs**

```powershell
$env:NUMBER_OF_PROCESSORS
```

*Mots-clés : variable environnement session accéder définir env*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
