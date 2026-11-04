---
title: "lynis"
description: "Bash — lynis (Audit / Durcissement) : Lynis audité la configuration d'un système UNIX (Linux, macOS, BSD...) et propose des pistes de durcissement. Il conseillé, il ne durcit rien lui-même."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Audit / Durcissement |
| **Commande type** | `lynis --version` |

## Rôle

Lynis audité la configuration d'un système UNIX (Linux, macOS, BSD...) et propose des pistes de durcissement. Il conseillé, il ne durcit rien lui-même.

## Options

| Option | Rôle |
| --- | --- |
| `--help` | commandes et options les plus courantes (-h) |
| `--version` | version installée (-V) |
| `--man` | page de manuel intégrée |
| `(sans argument) lynis` | affiche l'état et comment démarrer |
| `(root) sudo lynis audit system` | un audit complet exige root |
| `(paquet) apt install lynis` | depuis la distribution ou le dépôt CISOfy |
| `(git) git clone https://github.com/CISOfy/lynis` | dernière version, sans installation |

## Exemples

**Voir l'état et les pistes de départ**

```bash
lynis
```

**Version installée**

```bash
lynis --version
```

**Premier audit**

```bash
sudo lynis audit system
```

## Dans les autres shells

- [[27-commandes/03-macos/23-securite-acces/lynis|lynis (macOS)]]

*Mots-clés : lynis audit sécurité durcissement hardening cisofy conformité audit système*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
