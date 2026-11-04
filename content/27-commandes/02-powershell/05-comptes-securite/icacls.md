---
title: "icacls"
description: "PowerShell — icacls (Durcissement / Sécurité) : Affiche/modifie les ACL NTFS (équivalent setfacl)."
tags: [powershell, commande, comptes-securite]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Comptes & sécurité |
| **Contexte** | Durcissement / Sécurité |
| **Commande type** | `icacls C:\dossier` |

## Rôle

Affiche/modifie les ACL NTFS (équivalent setfacl).

## Options

| Option | Rôle |
| --- | --- |
| `/grant` | accorde |
| `/remove` | retire |
| `/inheritance:r` | coupe l'héritage |
| `/T` | récursif |
| `/save` | sauvegarde |

## Exemples

**Voir les droits**

```powershell
icacls C:\dossier
```

**Donner lecture**

```powershell
icacls C:\data /grant ops:(R)
```

*Mots-clés : acl permissions ntfs droits sécurité icacls*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
