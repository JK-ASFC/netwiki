---
title: "sysctl"
description: "Bash — sysctl (Durcissement / Tuning noyau) : Lit/écrit les paramètres du noyau à chaud."
tags: [bash, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Système |
| **Contexte** | Durcissement / Tuning noyau |
| **Commande type** | `sysctl net.ipv4.ip_forward` |

## Rôle

Lit/écrit les paramètres du noyau à chaud.

## En détail

Lit et modifie des réglages internes du noyau (réseau, mémoire, sécurité) sans redémarrer. Réserve plutôt à l'administration avancée.

## Options

| Option | Rôle |
| --- | --- |
| `-a` | liste tous les paramètres |
| `-w` | écrit une valeur |
| `-p` | recharge sysctl.conf |

## Exemples

**Lire un paramètre**

```bash
sysctl net.ipv4.ip_forward
```

**Activer le routage (temporaire)**

```bash
sudo sysctl -w net.ipv4.ip_forward=1
```

## Dans les autres shells

- [[27-commandes/03-macos/25-systeme/sysctl|sysctl (macOS)]]

*Mots-clés : noyau paramètre réglage réseau sécurité hardening tuning sysctl*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
