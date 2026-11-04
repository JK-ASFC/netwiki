---
title: "scutil --nc"
description: "macOS — scutil --nc (VPN / connexions natives) : Pilote les connexions VPN natives de macOS : les lance et les arrête, mais ne les crée pas."
tags: [macos, commande, vpn]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | VPN |
| **Contexte** | VPN / connexions natives |
| **Commande type** | `scutil --nc list` |

## Rôle

Pilote les connexions VPN natives de macOS : les lance et les arrête, mais ne les crée pas.

## Options

| Option | Rôle |
| --- | --- |
| `list` | liste les services VPN configurés |
| `start ‹service›` | établit la connexion |
| ⚠️ `stop ‹service›` | coupe la connexion |
| `status ‹service›` | état courant |
| `statistics ‹service›` | compteurs de la session |
| `show ‹service›` | détail de la configuration |
| `(création du profil)` | Réglages Système ▸ Réseau ▸ VPN, ou profil .mobileconfig |

> [!WARNING]
> Options à manier avec précaution : `stop ‹service›`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Lister**

```zsh
scutil --nc list
```

**Se connecter**

```zsh
scutil --nc start "VPN Bureau"
```

**État**

```zsh
scutil --nc status "VPN Bureau"
```

*Mots-clés : scutil vpn ikev2 l2tp connexion native macos start stop status statistics*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
