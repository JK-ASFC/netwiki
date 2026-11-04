---
title: "kmutil showloaded (lsmod macOS)"
description: "macOS — kmutil showloaded (lsmod macOS) (Noyau & extensions (= lsmod)) : Liste les extensions du noyau (kexts) chargées sous macOS 11 et plus : l'équivalent de lsmod, qui n'existe pas sur macOS. Remplace kextstat, déprécié."
tags: [macos, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Système |
| **Contexte** | Noyau & extensions (= lsmod) |
| **Commande type** | `kmutil showloaded --list-only --no-kernel-components` |

## Rôle

Liste les extensions du noyau (kexts) chargées sous macOS 11 et plus : l'équivalent de lsmod, qui n'existe pas sur macOS. Remplace kextstat, déprécié.

## Options

| Option | Rôle |
| --- | --- |
| `--list-only` | supprime l'en-tête, pour grep ou un script |
| `--no-kernel-components` | masque les composants du noyau lui-même |
| `--sort` | trie par adresse de chargement |
| `--show ‹état›` | état de chargement à afficher |
| `--collection ‹collection›` | une collection de kexts |
| `--bundle-identifier ‹identifiant›` | une extension précise |
| `--arch-info` | ajoute l'architecture |
| `--show-kernel` | ajoute le noyau lui-même |
| `--filter ‹prédicat›` | filtre sur les propriétés |
| `(remplace) kextstat` | déprécié depuis macOS 11 |
| `(extensions système) systemextensionsctl list` | ce que showloaded ne couvre pas |
| `(macOS 11) collections boot sys aux` | où vivent les extensions |

## Exemples

**Extensions chargées (sans le noyau)**

```zsh
kmutil showloaded --list-only --no-kernel-components
```

**Seulement les extensions tierces**

```zsh
kmutil showloaded --collection aux
```

**Une extension précise**

```zsh
kmutil showloaded --bundle-identifier com.apple.filesystems.apfs
```

*Mots-clés : kmutil showloaded kext extension noyau kernel lsmod kextstat charge modules macos driverkit*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
