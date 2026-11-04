---
title: "Start-VM / Stop-VM"
description: "PowerShell — Start-VM / Stop-VM (Virtualisation / Cycle de vie) : Démarre (Start-VM), arrête (Stop-VM) ou suspend une VM Hyper-V."
tags: [powershell, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Virtualisation |
| **Contexte** | Virtualisation / Cycle de vie |
| **Commande type** | `Start-VM -Name ‹nom›` |

## Rôle

Démarre (Start-VM), arrête (Stop-VM) ou suspend une VM Hyper-V.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | nom de la VM |
| ⚠️ `-Force` | sans confirmation (avec Stop-VM) |
| `-TurnOff` | coupe brutalement (comme débrancher) |
| `-Save` | enregistre l'état puis arrête |
| `(Stop-VM ‹nom›)` | arrêt propre (via l'intégration) |
| `(Suspend-VM ‹nom›)` | met en pause |

> [!WARNING]
> Options à manier avec précaution : `-Force`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Démarrer**

```powershell
Start-VM -Name SRV01
```

**Arrêt propre**

```powershell
Stop-VM -Name SRV01
```

**Coupure forcée**

```powershell
Stop-VM -Name SRV01 -TurnOff -Force
```

*Mots-clés : hyper-v hyperv vm start stop démarrer arrêter suspendre cycle vie windows*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
