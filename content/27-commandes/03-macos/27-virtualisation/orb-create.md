---
title: "orb create"
description: "macOS — orb create (Machines Linux / Création) : Crée une machine Linux OrbStack à partir d'une distribution (16 disponibles), avec ressources, architecture et initialisation cloud-init au choix."
tags: [macos, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Virtualisation |
| **Contexte** | Machines Linux / Création |
| **Commande type** | `orb create ubuntu my-machine` |

## Rôle

Crée une machine Linux OrbStack à partir d'une distribution (16 disponibles), avec ressources, architecture et initialisation cloud-init au choix.

## Options

| Option | Rôle |
| --- | --- |
| `‹distro›` | distribution seule, nom facultatif |
| `‹distro› ‹nom›` | distribution et nom de la machine |
| `--arch ‹architecture›` | amd64 pour une machine Intel |
| `--memory ‹taille›` | limite de mémoire, par exemple 4G |
| `--cpus ‹n›` | limite de cœurs |
| `--disk ‹taille›` | limite de disque, par exemple 64G |
| `--set-password` | demande un mot de passe pour l'utilisateur |
| `-c ‹fichier›` | données cloud-init (YAML ou script) |
| `--isolated` | machine isolée de macOS |
| `--mount ‹chemin›` | dossier Mac partagé avec une machine isolée |
| `--isolate-network` | coupe aussi les autres machines et l'hôte |
| `--forward-ssh-agent` | réactive l'agent SSH (machine isolée) |
| `(nom) nom.orb.local` | le nom devient un nom de domaine |

## Exemples

**Ubuntu par défaut**

```zsh
orb create ubuntu my-machine
```

**Machine Intel sur Apple Silicon**

```zsh
orb create --arch amd64 ubuntu x86-machine
```

**Machine isolée avec un dossier du Mac**

```zsh
orb create --isolated --mount ~/project ubuntu my-sandbox
```

*Mots-clés : orbstack orb create machine linux distribution ubuntu debian fedora alpine arch cloud-init isolée rosetta*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
