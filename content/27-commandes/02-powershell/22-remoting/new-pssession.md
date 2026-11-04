---
title: "New-PSSession"
description: "PowerShell — New-PSSession (Accès distant / Support) : Session persistante pour enchainer sans reconnecter."
tags: [powershell, commande, remoting]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Remoting |
| **Contexte** | Accès distant / Support |
| **Commande type** | `$s = New-PSSession -ComputerName srv01` |

## Rôle

Session persistante pour enchainer sans reconnecter.

## Options

| Option | Rôle |
| --- | --- |
| `-ComputerName ‹hôtes›` | cible |
| `-Credential ‹utilisateur›` | identifiants |
| `Get-PSSession` | liste |
| `Remove-PSSession` | ferme |

## Exemples

**Créer + réutiliser**

```powershell
$s = New-PSSession srv01; Invoke-Command -Session $s -ScriptBlock { hostname }
```

*Mots-clés : session persistante réutilisable remoting new-pssession*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
