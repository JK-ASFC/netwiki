---
title: "ss"
description: "Bash — ss (Dépannage réseau) : Sockets en écoute avec port et processus."
tags: [bash, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Réseau |
| **Contexte** | Dépannage réseau |
| **Commande type** | `ss -tulpn` |

## Rôle

Sockets en écoute avec port et processus.

## En détail

Liste les connexions réseau et les ports en écoute sur la machine. Sert à savoir quel service écoute sur quel port. Remplace netstat.

## Options

| Option | Rôle |
| --- | --- |
| `-t` | TCP |
| `-u` | UDP |
| `-l` | en écoute |
| `-p` | processus |
| `-n` | numérique |

## Exemples

**Ports + processus**

```bash
ss -tulpn
```

**Écoute sur 443**

```bash
ss -tulpn | grep :443
```

*Mots-clés : ports écoute listening socket connexion ouvert tcp udp netstat ss*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
