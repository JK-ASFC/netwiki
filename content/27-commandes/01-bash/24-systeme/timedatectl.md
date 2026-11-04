---
title: "timedatectl"
description: "Bash — timedatectl (Heure & fuseau) : Affiche/règle l'heure, le fuseau et la synchro NTP."
tags: [bash, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Système |
| **Contexte** | Heure & fuseau |
| **Commande type** | `timedatectl` |

## Rôle

Affiche/règle l'heure, le fuseau et la synchro NTP.

## Options

| Option | Rôle |
| --- | --- |
| `set-timezone ‹zone›` | change le fuseau (ex: Europe/Paris) |
| `set-time ‹"AAAA-MM-JJ hh:mm:ss"›` | règle la date et l'heure (format AAAA-MM-JJ hh:mm:ss, entre guillemets) |
| `set-ntp ‹true/false›` | active/désactive NTP |
| `list-timezones` | liste les fuseaux |

## Exemples

**Heure et fuseau**

```bash
timedatectl
```

**Régler le fuseau**

```bash
timedatectl set-timezone Europe/Paris
```

*Mots-clés : heure date fuseau horaire ntp timezone temps timedatectl*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
