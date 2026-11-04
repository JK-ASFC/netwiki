---
title: "colima"
description: "macOS — colima (Conteneurs & Docker) : Fait tourner Docker et Kubernetes sur macOS via une VM Linux légère (brew install colima)."
tags: [macos, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Virtualisation |
| **Contexte** | Conteneurs & Docker |
| **Commande type** | `colima start` |

## Rôle

Fait tourner Docker et Kubernetes sur macOS via une VM Linux légère (brew install colima).

## Options

| Option | Rôle |
| --- | --- |
| `start` | démarre la VM Colima (moteur Docker) |
| `start --cpu ‹4› --memory ‹8›` | démarre avec des ressources précises |
| `start --kubernetes` | active aussi un cluster Kubernetes |
| `stop` | arrête la VM |
| `status` | état de la VM |
| `delete` | supprime la VM |
| `list` | liste les instances |

## Exemples

**Démarrer Docker**

```zsh
colima start
```

**Avec 4 CPU / 8 Gio**

```zsh
colima start --cpu 4 --memory 8
```

**Avec Kubernetes**

```zsh
colima start --kubernetes
```

*Mots-clés : colima docker kubernetes vm linux conteneur macos brew moteur*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
