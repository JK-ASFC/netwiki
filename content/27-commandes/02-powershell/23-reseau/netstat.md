---
title: "netstat"
description: "PowerShell — netstat (Dépannage réseau) : Connexions et ports avec PID (natif)."
tags: [powershell, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Réseau |
| **Contexte** | Dépannage réseau |
| **Commande type** | `netstat -ano` |

## Rôle

Connexions et ports avec PID (natif).

## En détail

Affiche les connexions réseau et les ports en écoute (outil classique). ss est son remplaçant plus rapide.

## Options

| Option | Rôle |
| --- | --- |
| `-a` | toutes |
| `-n` | numérique |
| `-o` | PID |
| `-b` | exécutable (admin) |

## Exemples

**Ports + PID**

```powershell
netstat -ano
```

**Qui écoute sur 443**

```powershell
netstat -ano | findstr :443
```

## Dans les autres shells

- [[27-commandes/01-bash/21-reseau/netstat|netstat (Bash)]]
- [[27-commandes/03-macos/22-reseau/netstat|netstat (macOS)]]

*Mots-clés : connexion port écoute pid netstat*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
