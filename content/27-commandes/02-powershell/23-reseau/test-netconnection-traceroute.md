---
title: "Test-NetConnection -TraceRoute"
description: "PowerShell — Test-NetConnection -TraceRoute (Traceroute (= traceroute)) : Trace le chemin réseau jusqu'à une destination. L'équivalent de traceroute/tracert."
tags: [powershell, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Réseau |
| **Contexte** | Traceroute (= traceroute) |
| **Commande type** | `Test-NetConnection example.com -TraceRoute` |

## Rôle

Trace le chemin réseau jusqu'à une destination. L'équivalent de traceroute/tracert.

## Options

| Option | Rôle |
| --- | --- |
| `-TraceRoute` | affiche chaque saut jusqu'à la cible |
| `-Hops ‹N›` | limite le nombre de sauts |
| `-Port ‹N›` | teste aussi si un port répond (= nc -z) |
| `-InformationLevel Detailed` | résultat détaillé |

## Exemples

**Tracer la route**

```powershell
Test-NetConnection example.com -TraceRoute
```

**Tester un port**

```powershell
Test-NetConnection example.com -Port 443
```

**Outil hérité**

```powershell
tracert example.com
```

*Mots-clés : traceroute tracert chemin route réseau test-netconnection saut latence*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
