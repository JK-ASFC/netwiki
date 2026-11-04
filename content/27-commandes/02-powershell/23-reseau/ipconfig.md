---
title: "ipconfig"
description: "PowerShell — ipconfig (Dépannage réseau) : Config IP complète (DNS, bail DHCP, MAC)."
tags: [powershell, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Réseau |
| **Contexte** | Dépannage réseau |
| **Commande type** | `ipconfig /all` |

## Rôle

Config IP complète (DNS, bail DHCP, MAC).

## Options

| Option | Rôle |
| --- | --- |
| `/all` | config complète |
| `/release` | libère DHCP |
| `/renew` | renouvelle |
| `/flushdns` | vide le cache DNS |

## Exemples

**Config complète**

```powershell
ipconfig /all
```

**Vider le cache DNS**

```powershell
ipconfig /flushdns
```

## Dans les autres shells

- [[27-commandes/03-macos/22-reseau/ipconfig|ipconfig (macOS)]]

*Mots-clés : ip adresse réseau dns dhcp ipconfig*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
