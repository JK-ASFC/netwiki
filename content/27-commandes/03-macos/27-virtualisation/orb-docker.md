---
title: "orb docker"
description: "macOS — orb docker (Docker / Migration & moteur) : Migre les données de Docker Desktop vers OrbStack et rappelle comment faire cohabiter ou basculer entre les moteurs Docker."
tags: [macos, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Virtualisation |
| **Contexte** | Docker / Migration & moteur |
| **Commande type** | `orb docker migrate` |

## Rôle

Migre les données de Docker Desktop vers OrbStack et rappelle comment faire cohabiter ou basculer entre les moteurs Docker.

## Options

| Option | Rôle |
| --- | --- |
| `migrate` | copie les données de Docker Desktop |
| `(contexte) docker context use orbstack` | choisit le moteur utilisé par docker |
| `(volumes) orb docker volume import / export` | importer et exporter des volumes |
| `(socket) /var/run/docker.sock` | lien mis à jour avec un accès administrateur |

## Exemples

**Migrer Docker Desktop**

```zsh
orb docker migrate
```

**Basculer sur OrbStack**

```zsh
docker context use orbstack
```

**Revenir à Docker Desktop**

```zsh
docker context use desktop-linux
```

*Mots-clés : orbstack orb docker migrate migration docker desktop colima contexte moteur*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
