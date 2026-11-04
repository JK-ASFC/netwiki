---
title: "lynis"
description: "macOS — lynis (Audit / Durcissement) : Lynis audité la configuration d'un système UNIX (Linux, macOS, BSD...) et propose des pistes de durcissement. Il conseillé, il ne durcit rien lui-même."
tags: [macos, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
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
| `(brew) brew install lynis` | installation par Homebrew |
| `(git) git clone https://github.com/CISOfy/lynis` | dernière version, sans installation |

## Exemples

**Voir l'état et les pistes de départ**

```zsh
lynis
```

**Version installée**

```zsh
lynis --version
```

**Premier audit**

```zsh
sudo lynis audit system
```

## Dans les autres shells

- [[27-commandes/01-bash/22-securite-acces/lynis|lynis (Bash)]]

*Mots-clés : lynis audit sécurité durcissement hardening cisofy conformité audit système*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
