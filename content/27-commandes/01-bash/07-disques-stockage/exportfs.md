---
title: "exportfs"
description: "Bash — exportfs (NFS) : Gère les partages NFS exportés (/etc/exports)."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | NFS |
| **Commande type** | `exportfs -ra` |

## Rôle

Gère les partages NFS exportés (/etc/exports).

## Options

| Option | Rôle |
| --- | --- |
| `-r` | re-exporte tout (relit /etc/exports) |
| `-a` | exporte/desexporte tout |
| `-u` | desexporte |
| `-v` | verbeux |

## Exemples

**Recharger les exports**

```bash
exportfs -ra
```

*Mots-clés : nfs export partage exportfs reexporter exports exportfs*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
