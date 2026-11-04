---
title: "lynis configure"
description: "Bash — lynis configure (Audit / Configuration) : Ajoute ou modifie des réglages dans le profil personnalisé custom.prf, sans l'éditer à la main. À combiner avec lynis show settings pour contrôler le résultat."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Audit / Configuration |
| **Commande type** | `lynis configure settings debug=yes` |

## Rôle

Ajoute ou modifie des réglages dans le profil personnalisé custom.prf, sans l'éditer à la main. À combiner avec lynis show settings pour contrôler le résultat.

## Options

| Option | Rôle |
| --- | --- |
| `settings ‹clé=valeur›` | écrit un réglage dans custom.prf |
| `(plusieurs) debug=yes:quick=yes` | réglages séparés par deux-points |
| `(profil) touch custom.prf` | créer d'abord le profil |
| `(identifiants) hostid=...:hostid2=...` | les deux valeurs ensemble |
| `(contrôle) lynis show settings` | ce qui est vraiment appliqué |

## Exemples

**Activer le mode débogage**

```bash
lynis configure settings debug=yes
```

**Plusieurs réglages**

```bash
lynis configure settings debug=yes:quick=yes
```

**Fixer les identifiants d'hôte**

```bash
lynis configure settings hostid=$(head -c 64 /dev/random | sha1sum | awk '{print $1}'):hostid2=$(head -c 64 /dev/random | sha256sum | awk '{print $1}')
```

## Dans les autres shells

- [[27-commandes/03-macos/23-securite-acces/lynis-configure|lynis configure (macOS)]]

*Mots-clés : lynis configure settings custom.prf profil réglages skip-test hostid configuration*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
