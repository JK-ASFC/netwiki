---
title: "qemu"
description: "macOS — qemu (Émulation) : Émulateur/hyperviseur universel, utile pour d'autres architectures (brew install qemu)."
tags: [macos, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Virtualisation |
| **Contexte** | Émulation |
| **Commande type** | `qemu-system-aarch64 -m 2048 ...` |

## Rôle

Émulateur/hyperviseur universel, utile pour d'autres architectures (brew install qemu).

## Options

| Option | Rôle |
| --- | --- |
| `-system-aarch64` | émule une machine ARM 64 bits |
| `-system-x86_64` | émule une machine x86 64 bits |
| `-m ‹Mio›` | mémoire allouée |
| `-smp ‹N›` | nombre de cœurs |
| `-accel hvf` | utilise l'accélération matérielle d'Apple (Hypervisor.framework) |
| `-cdrom ‹image.iso›` | démarre sur une ISO |

## Exemples

**VM ARM accélérée**

```zsh
qemu-system-aarch64 -M virt -accel hvf -m 4096 -smp 4 ...
```

**Vérifier l'installation**

```zsh
qemu-system-aarch64 --version
```

*Mots-clés : qemu émulation vm hyperviseur virtualisation arm x86 brew*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
