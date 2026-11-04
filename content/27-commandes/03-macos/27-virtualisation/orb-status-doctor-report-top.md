---
title: "orb (status doctor report top)"
description: "macOS — orb (status doctor report top) (OrbStack / Maintenance) : Vérifie l'état d'OrbStack, sa version, sa configuration et sa consommation, le met à jour et prépare un rapport de bogue."
tags: [macos, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Virtualisation |
| **Contexte** | OrbStack / Maintenance |
| **Commande type** | `orb status` |

## Rôle

Vérifie l'état d'OrbStack, sa version, sa configuration et sa consommation, le met à jour et prépare un rapport de bogue.

## Options

| Option | Rôle |
| --- | --- |
| `status / version / update / doctor / report / top` | sous-commande : état, version, mise à jour, contrôle, rapport, moniteur |
| `(licence) orb login` | active la licence (orb logout : se déconnecter) |
| ⚠️ `(réinitialisation) orb reset` | efface TOUTES les données Linux et Docker |
| `(installation) brew install --cask orbstack` | macOS uniquement |
| `(désinstaller) supprimer ~/.orbstack` | retire l'application et ses données |

> [!WARNING]
> Options à manier avec précaution : `(réinitialisation) orb reset`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Vérifier qu'OrbStack tourne**

```zsh
orb status
```

**Suivre la consommation en direct**

```zsh
orb top
```

**Contrôler la configuration**

```zsh
orb doctor
```

*Mots-clés : orbstack orb status version update doctor report top maintenance diagnostic licence reset*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
