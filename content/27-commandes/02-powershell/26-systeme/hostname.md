---
title: "hostname"
description: "PowerShell — hostname (Nom de la machine (= hostname)) : Affiche le nom de l'ordinateur. Présent aussi comme commande native sous Windows."
tags: [powershell, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Système |
| **Contexte** | Nom de la machine (= hostname) |
| **Commande type** | `hostname` |

## Rôle

Affiche le nom de l'ordinateur. Présent aussi comme commande native sous Windows.

## Options

| Option | Rôle |
| --- | --- |
| `(sans arg)` | affiche le nom de la machine |
| `$env:COMPUTERNAME` | variable équivalente |
| `[System.Net.Dns]::GetHostName()` | via .NET |

## Exemples

**Nom**

```powershell
hostname
```

**Via variable**

```powershell
$env:COMPUTERNAME
```

**Renommer**

```powershell
Rename-Computer -NewName SRV02 -Restart
```

## Dans les autres shells

- [[27-commandes/01-bash/24-systeme/hostname|hostname (Bash)]]
- [[27-commandes/03-macos/25-systeme/hostname|hostname (macOS)]]

*Mots-clés : hostname nom machine ordinateur réseau identité*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
