---
title: "swanctl"
description: "Bash — swanctl (strongSwan / IPsec) : Pilote strongSwan : charge la configuration et gère les associations de sécurité."
tags: [bash, commande, vpn]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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
| `--list-certs` | certificats chargés |
| `--initiate --child ‹nom›` | monte un tunnel |
| ⚠️ `--terminate --ike ‹nom›` | coupe une association IKE |
| `--stats` | statistiques du démon |
| `--log` | suit le journal en direct |

> [!WARNING]
> Options à manier avec précaution : `--terminate --ike ‹nom›`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Recharger sans couper**

```bash
sudo swanctl --load-all
```

**Voir les tunnels**

```bash
sudo swanctl --list-sas
```

**Monter un tunnel**

```bash
sudo swanctl --initiate --child net
```

## Dans les autres shells

- [[27-commandes/03-macos/28-vpn/swanctl|swanctl (macOS)]]

*Mots-clés : strongswan swanctl ipsec ikev2 esp sa tunnel vpn charge initiate*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
