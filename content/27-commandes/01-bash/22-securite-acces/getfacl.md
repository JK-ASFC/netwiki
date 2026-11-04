---
title: "getfacl"
description: "Bash — getfacl (ACL) : Affiche les permissions ACL d'un fichier ou dossier."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | ACL |
| **Commande type** | `getfacl fichier` |

## Rôle

Affiche les permissions ACL d'un fichier ou dossier.

## Options

| Option | Rôle |
| --- | --- |
| `-R` | récursif |
| `-d` | ACL par défaut (dossiers) |
| `--omit-header` | sans en-tête |

## Exemples

**Voir les ACL**

```bash
getfacl archive
```

*Mots-clés : acl permissions getfacl droits étendus liste getfacl*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
