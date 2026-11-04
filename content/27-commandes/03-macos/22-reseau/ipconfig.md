---
title: "ipconfig"
description: "macOS — ipconfig (Adresse d'une interface) : Interroge la configuration IP obtenue par DHCP (à ne pas confondre avec l'outil Windows)."
tags: [macos, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Réseau |
| **Contexte** | Adresse d'une interface |
| **Commande type** | `ipconfig getifaddr en0` |

## Rôle

Interroge la configuration IP obtenue par DHCP (à ne pas confondre avec l'outil Windows).

## Options

| Option | Rôle |
| --- | --- |
| `getifaddr ‹interface›` | adresse IPv4 de l'interface |
| `getpacket ‹interface›` | détail du bail DHCP reçu |
| `getsummary ‹interface›` | résumé de la config de l'interface |

## Exemples

**IP du Wi-Fi**

```zsh
ipconfig getifaddr en0
```

**Bail DHCP complet**

```zsh
ipconfig getpacket en0
```

## Dans les autres shells

- [[27-commandes/02-powershell/23-reseau/ipconfig|ipconfig (PowerShell)]]

*Mots-clés : ip adresse dhcp ipconfig interface en0 bail*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
