---
title: "lsmod"
description: "Bash — lsmod (Noyau & modules) : Liste les modules du noyau actuellement chargés : nom, taille en mémoire et compteur d'utilisation. Il met en forme /proc/modules, sans rien modifier."
tags: [bash, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Système |
| **Contexte** | Noyau & modules |
| **Commande type** | `lsmod` |

## Rôle

Liste les modules du noyau actuellement chargés : nom, taille en mémoire et compteur d'utilisation. Il met en forme /proc/modules, sans rien modifier.

## Options

| Option | Rôle |
| --- | --- |
| `-v` | messages sur ce que fait le programme |
| `-s` | erreurs envoyées à syslog |
| `-V` | version de kmod |
| `(filtrer) lsmod \| grep -w ‹module›` | chercher un module précis |
| `(détails) modinfo ‹module›` | licence, paramètres, dépendances |
| `(brut) cat /proc/modules` | état et adresse en plus |
| `(retirer) sudo modprobe -r ‹module›` | possible si « Used by » vaut 0 |

## Exemples

**Lister les modules chargés**

```bash
lsmod
```

**Un module précis**

```bash
lsmod | grep -w overlay
```

**Les plus volumineux**

```bash
lsmod | sort -k2 -nr | head
```

*Mots-clés : lsmod module noyau kernel driver pilote charge modinfo modprobe rmmod insmod proc modules*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
