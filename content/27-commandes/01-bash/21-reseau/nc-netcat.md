---
title: "nc (netcat)"
description: "Bash — nc (netcat) (Dépannage réseau) : Teste un port, écoute, transfère."
tags: [bash, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Réseau |
| **Contexte** | Dépannage réseau |
| **Commande type** | `nc -zv 10.20.0.2 22` |

## Rôle

Teste un port, écoute, transfère.

## En détail

Le couteau suisse du réseau : ouvrir une connexion brute, tester si un port répond, transférer des données entre deux machines.

## Options

| Option | Rôle |
| --- | --- |
| `-z` | scan sans données |
| `-v` | verbeux |
| `-l` | écoute |
| `-n` | pas de DNS |
| `-u` | UDP |
| `-w ‹secondes›` | timeout |

## Exemples

**Port ouvert**

```bash
nc -zv 10.20.0.2 21116
```

**Scanner une plage**

```bash
nc -zv 10.20.0.1 20-25
```

## Dans les autres shells

- [[27-commandes/03-macos/22-reseau/nc-netcat|nc (netcat) (macOS)]]

*Mots-clés : netcat port test tcp écoute connexion transfert ouvert nc*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
