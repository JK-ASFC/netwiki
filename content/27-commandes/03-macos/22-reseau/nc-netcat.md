---
title: "nc (netcat)"
description: "macOS — nc (netcat) (Test de ports) : Le couteau suisse réseau : tester un port, transférer des données."
tags: [macos, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Réseau |
| **Contexte** | Test de ports |
| **Commande type** | `nc -vz example.com 443` |

## Rôle

Le couteau suisse réseau : tester un port, transférer des données.

## En détail

Le couteau suisse du réseau : ouvrir une connexion brute, tester si un port répond, transférer des données entre deux machines.

## Options

| Option | Rôle |
| --- | --- |
| `-v` | verbeux (affiche le résultat) |
| `-z` | mode scan (n'envoie rien, teste juste) |
| `-l ‹port›` | écoute sur un port (mode serveur) |
| `-u` | mode UDP |
| `-w ‹secondes›` | délai d'expiration |

## Exemples

**Tester un port**

```zsh
nc -vz example.com 443
```

**Écouter un port**

```zsh
nc -l 9000
```

**Scan d'une plage**

```zsh
nc -vz -w1 10.0.0.1 20-25
```

## Dans les autres shells

- [[27-commandes/01-bash/21-reseau/nc-netcat|nc (netcat) (Bash)]]

*Mots-clés : netcat nc port test connexion tcp udp scan*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
