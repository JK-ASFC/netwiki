---
title: "netstat"
description: "Bash — netstat (Réseau / Sockets) : Affiche connexions et ports en écoute (paquet net-tools)."
tags: [bash, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Réseau |
| **Contexte** | Réseau / Sockets |
| **Commande type** | `netstat -tulpn` |

## Rôle

Affiche connexions et ports en écoute (paquet net-tools).

## En détail

Affiche les connexions réseau et les ports en écoute (outil classique). ss est son remplaçant plus rapide.

## Options

| Option | Rôle |
| --- | --- |
| `-t` | TCP |
| `-u` | UDP |
| `-l` | en écoute |
| `-p` | processus (root) |

## Exemples

**Ports en écoute**

```bash
netstat -tulpn
```

**Équivalent moderne**

```bash
ss -tulpn
```

**Tout le TCP**

```bash
netstat -at
```

## Dans les autres shells

- [[27-commandes/02-powershell/23-reseau/netstat|netstat (PowerShell)]]
- [[27-commandes/03-macos/22-reseau/netstat|netstat (macOS)]]

*Mots-clés : sockets ports écoute connexions netstat legacy*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
