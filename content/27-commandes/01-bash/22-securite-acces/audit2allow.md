---
title: "audit2allow"
description: "Bash — audit2allow (SELinux / Diagnostic) : Génère des règles de politique SELinux (allow) à partir des refus AVC, pour autoriser un accès légitimement bloqué. À relire avant application : n'autoriser que le strict nécessaire."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | SELinux / Diagnostic |
| **Commande type** | `audit2allow -a` |

## Rôle

Génère des règles de politique SELinux (allow) à partir des refus AVC, pour autoriser un accès légitimement bloqué. À relire avant application : n'autoriser que le strict nécessaire.

## En détail

Quand SELinux bloque quelque chose de légitime, il lit les refus (AVC) dans le journal d'audit et génère les règles « allow » correspondantes, voire un module prêt à charger. À relire avant d'appliquer.

## Options

| Option | Rôle |
| --- | --- |
| `-a` | lit tous les refus depuis le journal d'audit |
| `-M ‹nom›` | crée un module (.te + .pp) prêt à charger |
| `-i ‹fichier›` | lit les refus depuis un fichier |
| `-R` | propose des règles basées sur des macros (interfaces de référence) |

## Exemples

**Voir les règles suggérées**

```bash
ausearch -m AVC | audit2allow
```

**Créer un module**

```bash
ausearch -m AVC | audit2allow -M mon_module
```

**Charger le module**

```bash
sudo semodule -i mon_module.pp
```

*Mots-clés : selinux avc denied refus policy module allow audit2allow*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
