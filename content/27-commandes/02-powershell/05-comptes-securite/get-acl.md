---
title: "Get-Acl"
description: "PowerShell — Get-Acl (Durcissement / Sécurité) : Lit/écrit les ACL NTFS (permissions fichiers)."
tags: [powershell, commande, comptes-securite]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Comptes & sécurité |
| **Contexte** | Durcissement / Sécurité |
| **Commande type** | `Get-Acl C:\dossier \| Format-List` |

## Rôle

Lit/écrit les ACL NTFS (permissions fichiers).

## Options

| Option | Rôle |
| --- | --- |
| `\| Format-List` | détaillé |
| `Set-Acl` | applique |
| `(Get-Acl).Access` | règles |

## Exemples

**Voir les droits**

```powershell
Get-Acl C:\dossier | Format-List
```

**Règles d'accès**

```powershell
(Get-Acl C:\dossier).Access
```

*Mots-clés : acl permissions ntfs droits sécurité accès get-acl*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
