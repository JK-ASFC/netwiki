---
title: "lvs"
description: "Bash — lvs (LVM) : Résumé en tableau des volumes logiques (LV) : nom, groupe, taille et attributs, une ligne par volume."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | LVM |
| **Commande type** | `lvs` |

## Rôle

Résumé en tableau des volumes logiques (LV) : nom, groupe, taille et attributs, une ligne par volume.

## Options

| Option | Rôle |
| --- | --- |
| `-a` | inclut les volumes INTERNES normalement masqués (miroirs, métadonnées de pool, snapshots) |
| `-o ‹colonnes›` | choisit les colonnes : lv_name,vg_name,lv_size,devices,lv_attr |
| `-o +‹colonne›` | AJOUTE une colonne à l'affichage par défaut (ex : -o +devices montre les PV utilisés) |
| `--units ‹b/k/m/g/t›` | unité d'affichage des tailles (g = Gio) |
| `--noheadings` | supprime la ligne d'en-tête : pratique pour un script |
| `--segments` | détaille les SEGMENTS et leur type (linéaire, striped, RAID) |
| `-S ‹critère›` | filtre par sélection (ex : -S 'lv_size>10g') |

## Exemples

**Vue simple**

```bash
sudo lvs
```

**Avec les disques**

```bash
sudo lvs -o +devices
```

**Tailles en Gio**

```bash
sudo lvs --units g
```

**Tout, même l'interne**

```bash
sudo lvs -a
```

*Mots-clés : lvm lv volume logique liste tableau résumé*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
