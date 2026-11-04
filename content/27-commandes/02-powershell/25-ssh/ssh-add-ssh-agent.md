---
title: "ssh-add / ssh-agent"
description: "PowerShell — ssh-add / ssh-agent (Agent de clés) : Charge une clé dans l'agent SSH de Windows (service ssh-agent)."
tags: [powershell, commande, ssh]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | SSH |
| **Contexte** | Agent de clés |
| **Commande type** | `ssh-add $env:USERPROFILE\.ssh\id_ed25519` |

## Rôle

Charge une clé dans l'agent SSH de Windows (service ssh-agent).

## Options

| Option | Rôle |
| --- | --- |
| `-l` | liste les clés chargées |
| `-d ‹cle›` | retire une clé |
| `-D` | retire toutes les clés |

## Exemples

**Démarrer l'agent (admin)**

```powershell
Start-Service ssh-agent
```

**Ajouter une clé**

```powershell
ssh-add $env:USERPROFILE\.ssh\id_ed25519
```

**Lister les clés**

```powershell
ssh-add -l
```

*Mots-clés : ssh-agent ssh-add agent clé passphrase service windows charger mémoriser*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
