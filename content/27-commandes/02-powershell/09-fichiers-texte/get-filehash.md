---
title: "Get-FileHash"
description: "PowerShell — Get-FileHash (Cryptographie / Intégrité) : Empreinte d'un fichier (verif d'intégrité)."
tags: [powershell, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Cryptographie / Intégrité |
| **Commande type** | `Get-FileHash image.iso -Algorithm SHA256` |

## Rôle

Empreinte d'un fichier (verif d'intégrité).

## Options

| Option | Rôle |
| --- | --- |
| `-Algorithm ‹SHA256›` | SHA256/SHA1/MD5 |
| `-Path ‹fichier›` | fichier |

## Exemples

**Vérifier une ISO**

```powershell
Get-FileHash image.iso -Algorithm SHA256
```

*Mots-clés : hash empreinte intégrité sha256 checksum get-filehash*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
