---
title: "swanctl"
description: "macOS — swanctl (strongSwan / IPsec) : Pilote strongSwan : charge la configuration et gère les associations de sécurité."
tags: [macos, commande, vpn]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | VPN |
| **Contexte** | strongSwan / IPsec |
| **Commande type** | `swanctl --list-sas` |

## Rôle

Pilote strongSwan : charge la configuration et gère les associations de sécurité.

## Options

| Option | Rôle |
| --- | --- |
| `--load-all` | recharge conf, secrets et certificats |
| `--list-sas` | associations de sécurité actives |
| `--list-conns` | connexions déclarées |
| `--initiate --child ‹nom›` | monte un tunnel |
| ⚠️ `--terminate --ike ‹nom›` | coupe une association IKE |
| `--stats` | statistiques du démon |

> [!WARNING]
> Options à manier avec précaution : `--terminate --ike ‹nom›`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Installer**

```zsh
brew install strongswan
```

**Recharger**

```zsh
sudo swanctl --load-all
```

**Voir les tunnels**

```zsh
sudo swanctl --list-sas
```

## Dans les autres shells

- [[27-commandes/01-bash/27-vpn/swanctl|swanctl (Bash)]]

*Mots-clés : strongswan swanctl ipsec ikev2 esp sa tunnel vpn homebrew macos*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
