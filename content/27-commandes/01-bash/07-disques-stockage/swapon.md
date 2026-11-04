---
title: "swapon"
description: "Bash — swapon (Disques / Swap) : Active et liste l'espace d'échange."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | Disques / Swap |
| **Commande type** | `swapon --show` |

## Rôle

Active et liste l'espace d'échange.

## En détail

Active une zone de swap, la mémoire virtuelle sur disque utilisée quand la RAM est pleine. swapon --show liste le swap actif.

## Options

| Option | Rôle |
| --- | --- |
| `--show` | liste les zones d'échange actives : nom, type, taille, utilisé, priorité |
| `-a` | active toutes les zones déclarées dans /etc/fstab (avec swap comme type) |
| `-p ‹priorité (0-32767)›` | priorité d'utilisation : la plus HAUTE est consommée en premier ; égales = répartition en parallèle |
| `-v` | mode verbeux : détaille ce qui est activé |
| `-f` | force l'activation même si la signature semble incohérente |
| `--bytes` | affiche les tailles en octets bruts au lieu du format lisible |

## Exemples

**Voir le swap**

```bash
swapon --show
```

**Activer un fichier**

```bash
swapon /swapfile
```

**Tout activer**

```bash
swapon -a
```

*Mots-clés : swap mémoire échange activer swapon*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
