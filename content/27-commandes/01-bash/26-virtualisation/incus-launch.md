---
title: "incus launch"
description: "Bash — incus launch (Virtualisation / Incus) : Crée et démarre une instance Incus : conteneur système, ou machine virtuelle avec --vm."
tags: [bash, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Virtualisation |
| **Contexte** | Virtualisation / Incus |
| **Commande type** | `incus launch images:ubuntu/24.04 ‹nom›` |

## Rôle

Crée et démarre une instance Incus : conteneur système, ou machine virtuelle avec --vm.

## Options

| Option | Rôle |
| --- | --- |
| `--vm` | crée une machine virtuelle (sinon un conteneur) |
| `-c ‹limits.cpu=2›` | option de config (CPU, mémoire…) |
| `-n ‹réseau›` | rattache à un réseau |
| `-s ‹pool›` | pool de stockage |
| `-p ‹profil›` | applique un profil |
| `-d ‹root,size=20GiB›` | option de device (disque) |

## Exemples

**Conteneur Ubuntu**

```bash
incus launch images:ubuntu/24.04 web
```

**Machine virtuelle**

```bash
incus launch images:ubuntu/24.04 vm1 --vm
```

**Limiter CPU et mémoire**

```bash
incus launch images:debian/12 db -c limits.cpu=2 -c limits.memory=2GiB
```

*Mots-clés : incus lxd conteneur vm machine virtuelle launch créer démarrer image ubuntu*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
