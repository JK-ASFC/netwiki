---
title: "Invoke-Command (VM)"
description: "PowerShell — Invoke-Command (VM) (Virtualisation / Accès) : Exécute du code dans une VM via PowerShell Direct (sans réseau) — l'équivalent de incus exec."
tags: [powershell, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Virtualisation |
| **Contexte** | Virtualisation / Accès |
| **Commande type** | `Invoke-Command -VMName ‹nom› -ScriptBlock { hostname }` |

## Rôle

Exécute du code dans une VM via PowerShell Direct (sans réseau) — l'équivalent de incus exec.

## Options

| Option | Rôle |
| --- | --- |
| `-VMName ‹nom›` | VM cible (PowerShell Direct) |
| `-ScriptBlock { }` | code à exécuter |
| `-Credential ‹utilisateur›` | identifiants dans la VM |
| `-FilePath ‹script.ps1›` | exécute un script local dans la VM |
| `(Enter-PSSession -VMName ‹nom›)` | session interactive |

## Exemples

**Commande directe**

```powershell
Invoke-Command -VMName SRV01 -ScriptBlock { Get-Service }
```

**Session interactive**

```powershell
Enter-PSSession -VMName SRV01
```

**Avec identifiants**

```powershell
Invoke-Command -VMName SRV01 -Credential admin -ScriptBlock { hostname }
```

*Mots-clés : hyper-v hyperv vm powershell direct invoke-command enter-pssession exécuter windows*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
