---
title: "Remove-LocalUser"
description: "PowerShell — Remove-LocalUser (Comptes / Suppression) : Supprime un compte local."
tags: [powershell, commande, comptes-securite]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Comptes & sécurité |
| **Contexte** | Comptes / Suppression |
| **Commande type** | `Remove-LocalUser jdupont` |

## Rôle

Supprime un compte local.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | nom du compte |
| `-SID ‹sid›` | par SID |
| `Get-LocalUser` | vérifier avant |
| `Disable-LocalUser` | désactive sans supprimer |

## Exemples

**Supprimer**

```powershell
Remove-LocalUser jdupont
```

**Vérifier d'abord**

```powershell
Get-LocalUser jdupont
```

**Désactiver plutôt**

```powershell
Disable-LocalUser jdupont
```

*Mots-clés : supprimer compte local utilisateur remove-localuser*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
