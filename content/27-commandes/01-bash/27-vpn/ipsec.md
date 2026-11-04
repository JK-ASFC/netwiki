---
title: "ipsec"
description: "Bash — ipsec (strongSwan / historique) : Commande historique de strongSwan : démarrage du démon et état des connexions."
tags: [bash, commande, vpn]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | VPN |
| **Contexte** | strongSwan / historique |
| **Commande type** | `ipsec statusall` |

## Rôle

Commande historique de strongSwan : démarrage du démon et état des connexions.

## Options

| Option | Rôle |
| --- | --- |
| `start` | démarre le démon |
| `stop` | arrête le démon |
| `restart` | redémarre |
| `status` | résumé des connexions |
| `statusall` | état détaillé |
| `up ‹conn›` | monte une connexion |
| ⚠️ `down ‹conn›` | coupe une connexion |
| `reload` | recharge la configuration |
| `listcerts` | certificats connus |

> [!WARNING]
> Options à manier avec précaution : `down ‹conn›`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**État détaillé**

```bash
sudo ipsec statusall
```

**Monter une connexion**

```bash
sudo ipsec up nomades
```

**Recharger**

```bash
sudo ipsec reload
```

## Dans les autres shells

- [[27-commandes/03-macos/28-vpn/ipsec|ipsec (macOS)]]

*Mots-clés : ipsec strongswan status statusall up down reload démon vpn ikev1*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
