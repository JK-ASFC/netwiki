---
title: "orb (start stop restart delete)"
description: "macOS — orb (start stop restart delete) (Machines Linux / Cycle de vie) : Démarre, arrête, redémarre ou supprime une machine, le moteur Docker ou le cluster Kubernetes. Sans nom, start et stop visent OrbStack lui-même."
tags: [macos, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Virtualisation |
| **Contexte** | Machines Linux / Cycle de vie |
| **Commande type** | `orb restart ubuntu` |

## Rôle

Démarre, arrête, redémarre ou supprime une machine, le moteur Docker ou le cluster Kubernetes. Sans nom, start et stop visent OrbStack lui-même.

## Options

| Option | Rôle |
| --- | --- |
| `start / stop / restart / delete` | sous-commande : démarrer, arrêter, redémarrer, supprimer |
| `‹machine›` | machine visée (sans nom : OrbStack lui-même) |
| `(docker) orb restart docker` | redémarre le moteur Docker |
| `(k8s) orb start k8s` | cluster Kubernetes (stop, restart, delete aussi) |
| ⚠️ `(effacer Docker) orb delete docker` | efface les données Docker |

> [!WARNING]
> Options à manier avec précaution : `(effacer Docker) orb delete docker`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Redémarrer une machine**

```zsh
orb restart ubuntu
```

**Redémarrer le moteur Docker**

```zsh
orb restart docker
```

**Arrêter OrbStack**

```zsh
orb stop
```

*Mots-clés : orbstack orb start stop restart delete machine docker k8s kubernetes arrêter démarrer supprimer*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
