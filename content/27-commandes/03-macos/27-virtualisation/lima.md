---
title: "lima"
description: "macOS — lima (VM Linux) : Lance des machines virtuelles Linux légères sur macOS (brew install lima)."
tags: [macos, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Virtualisation |
| **Contexte** | VM Linux |
| **Commande type** | `limactl start` |

## Rôle

Lance des machines virtuelles Linux légères sur macOS (brew install lima).

## Options

| Option | Rôle |
| --- | --- |
| `start` | démarre une VM avec le modèle par défaut |
| `start ‹modèle.yaml›` | démarre depuis un fichier de configuration |
| `shell ‹nom›` | ouvre un shell dans la VM |
| `list` | liste les VM |
| `stop ‹nom›` | arrête une VM |
| `delete ‹nom›` | supprime une VM |

## Exemples

**Démarrer**

```zsh
limactl start
```

**Ouvrir un shell**

```zsh
limactl shell default
```

**Lister**

```zsh
limactl list
```

*Mots-clés : lima vm linux machine virtuelle macos brew qemu*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
