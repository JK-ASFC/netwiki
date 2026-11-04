---
title: "audit2why"
description: "Bash — audit2why (SELinux / Diagnostic) : Traduit les refus SELinux (messages AVC des journaux d'audit) en explications lisibles : pourquoi l'accès a été bloqué et quelle piste suivre."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | SELinux / Diagnostic |
| **Commande type** | `audit2why < /var/log/audit/audit.log` |

## Rôle

Traduit les refus SELinux (messages AVC des journaux d'audit) en explications lisibles : pourquoi l'accès a été bloqué et quelle piste suivre.

## En détail

Explique en français pourquoi SELinux a refusé un accès, à partir des messages AVC du journal d'audit. Le point de départ pour comprendre un blocage avant de le corriger.

## Options

| Option | Rôle |
| --- | --- |
| `-a` | lit tous les messages depuis le journal d'audit |
| `-i ‹fichier›` | lit les messages depuis un fichier |
| `-l` | ne traite que les refus survenus depuis le dernier chargement de politique |

## Exemples

**Analyser les refus**

```bash
ausearch -m AVC | audit2why
```

**Depuis le journal**

```bash
audit2why < /var/log/audit/audit.log
```

*Mots-clés : selinux avc denied refus audit journal explication audit2why*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
