---
title: "lvmdiskscan"
description: "Bash — lvmdiskscan (LVM) : Liste tous les disques et partitions vus par LVM, en distinguant ceux déjà initialisés comme volumes physiques (PV)."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | LVM |
| **Commande type** | `lvmdiskscan` |

## Rôle

Liste tous les disques et partitions vus par LVM, en distinguant ceux déjà initialisés comme volumes physiques (PV).

## Options

| Option | Rôle |
| --- | --- |
| `-l` | n'affiche QUE les volumes physiques LVM (ceux déjà passés par pvcreate) |
| `-v` | verbeux : détaille chaque périphérique examiné |

## Exemples

**Tout voir**

```bash
sudo lvmdiskscan
```

**Seulement les PV**

```bash
sudo lvmdiskscan -l
```

*Mots-clés : lvm disque scan pv volume physique inventaire repérer*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
