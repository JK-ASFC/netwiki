---
title: "ifconfig"
description: "Bash — ifconfig (Interfaces réseau) : Affiche et configure les interfaces réseau (outil historique net-tools, remplace par ip)."
tags: [bash, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Réseau |
| **Contexte** | Interfaces réseau |
| **Commande type** | `ifconfig -a` |

## Rôle

Affiche et configure les interfaces réseau (outil historique net-tools, remplace par ip).

## Options

| Option | Rôle |
| --- | --- |
| `(sans argument)` | liste les interfaces actives et leurs adresses |
| `‹interface›` | détaillé une interface précise |
| `-a` | toutes les interfaces, même inactives |
| `up` | après le nom d'interface : active le lien |
| ⚠️ `down` | après le nom d'interface : désactive le lien |
| `netmask ‹masque›` | adresse et masque (après l'interface et l'adresse) |
| ⚠️ `mtu ‹taille›` | change la taille maximale de trame |
| `promisc` | active le mode promiscuite |
| `(equivalent moderne)` | ip addr / ip link |

> [!WARNING]
> Options à manier avec précaution : `down`, `mtu ‹taille›`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Toutes les interfaces**

```bash
ifconfig -a
```

**Une interface précise**

```bash
ifconfig enp0s3
```

**Adresse temporaire (perdue au redémarrage)**

```bash
sudo ifconfig enp0s3 192.168.1.50 netmask 255.255.255.0
```

**Équivalent moderne recommandé**

```bash
ip -br addr show
```

## Dans les autres shells

- [[27-commandes/03-macos/22-reseau/ifconfig|ifconfig (macOS)]]

*Mots-clés : ifconfig interface réseau adresse mtu promiscuite net-tools ip legacy carte lien*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
