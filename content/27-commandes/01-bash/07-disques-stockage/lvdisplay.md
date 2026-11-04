---
title: "lvdisplay"
description: "Bash — lvdisplay (LVM) : Fiche détaillée de chaque volume logique : chemin, taille, statut, et répartition sur les disques."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | LVM |
| **Commande type** | `lvdisplay` |

## Rôle

Fiche détaillée de chaque volume logique : chemin, taille, statut, et répartition sur les disques.

## Options

| Option | Rôle |
| --- | --- |
| `-m` | affiche la CARTE des segments : sur quels PV et quels extents physiques repose réellement le volume |
| `-v` | verbeux : ajoute les informations internes |
| `-C` | affichage en colonnes, comme lvs |
| `--units ‹b/k/m/g/t›` | unité d'affichage des tailles |

## Exemples

**Fiche complète**

```bash
sudo lvdisplay
```

**Voir la répartition**

```bash
sudo lvdisplay -m /dev/vg0/data
```

**Un volume précis**

```bash
sudo lvdisplay /dev/vg0/data
```

*Mots-clés : lvm lv volume logique détail affichage segments*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
