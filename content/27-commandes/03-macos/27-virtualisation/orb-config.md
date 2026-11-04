---
title: "orb config"
description: "macOS — orb config (OrbStack / Configuration) : Lit et modifie les réglages d'OrbStack : ressources, Rosetta, réseau, proxy, Docker, Kubernetes. Tout ce que propose l'application, et quelques réglages cachés."
tags: [macos, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Virtualisation |
| **Contexte** | OrbStack / Configuration |
| **Commande type** | `orb config set memory_mib 8192` |

## Rôle

Lit et modifie les réglages d'OrbStack : ressources, Rosetta, réseau, proxy, Docker, Kubernetes. Tout ce que propose l'application, et quelques réglages cachés.

## Options

| Option | Rôle |
| --- | --- |
| `show` | affiche tous les réglages et leurs valeurs |
| `get ‹clé›` | lit un réglage |
| `set ‹clé› ‹valeur›` | écrit un réglage |
| `(mémoire) memory_mib` | mémoire totale, en Mio |
| `(processeur) cpu` | plafond de CPU, en multiples de 100 % |
| `(Rosetta) rosetta` | émulation Intel sur Apple Silicon |
| `(proxy) network_proxy` | URL de proxy, auto ou none |
| `(par machine) machine.NOM.memory_mib` | réglages propres à une machine |
| `(avancé) ssh.expose_port` | ouvre le serveur SSH au réseau local |
| `(administrateur) setup.use_admin` | supprime les invités d'administrateur |

## Exemples

**Tout afficher**

```zsh
orb config show
```

**Plafonner la mémoire à 8 Go**

```zsh
orb config set memory_mib 8192
```

**Désactiver le proxy**

```zsh
orb config set network_proxy none
```

*Mots-clés : orbstack orb config réglages mémoire cpu rosetta proxy réseau docker kubernetes machine*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
