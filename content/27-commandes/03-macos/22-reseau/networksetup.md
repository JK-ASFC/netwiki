---
title: "networksetup"
description: "macOS — networksetup (Config réseau (GUI en CLI)) : Configure le réseau comme le fait le panneau Réglages : services, DNS, Wi-Fi, proxy."
tags: [macos, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Réseau |
| **Contexte** | Config réseau (GUI en CLI) |
| **Commande type** | `networksetup -listallnetworkservices` |

## Rôle

Configure le réseau comme le fait le panneau Réglages : services, DNS, Wi-Fi, proxy.

## Options

| Option | Rôle |
| --- | --- |
| `-listallnetworkservices` | liste les services réseau (Wi-Fi, Ethernet) |
| `-getinfo ‹'Wi-Fi'›` | configuration IP d'un service |
| `-setdnsservers ‹'Wi-Fi' 1.1.1.1›` | définit les serveurs DNS |
| `-getdnsservers ‹'Wi-Fi'›` | affiche les DNS configurés |
| `-setairportpower en0 on` | allume le Wi-Fi |
| `-setmanual ‹'Wi-Fi' IP masque passerelle›` | IP statique |

## Exemples

**Lister les services**

```zsh
networksetup -listallnetworkservices
```

**Changer les DNS**

```zsh
sudo networksetup -setdnsservers Wi-Fi 1.1.1.1 9.9.9.9
```

**Allumer le Wi-Fi**

```zsh
networksetup -setairportpower en0 on
```

*Mots-clés : réseau configuration networksetup dns wifi proxy service dhcp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
