---
title: "dmesg"
description: "Bash — dmesg (Diagnostic matériel / boot) : Messages du noyau : matériel, USB, disques, OOM."
tags: [bash, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Système |
| **Contexte** | Diagnostic matériel / boot |
| **Commande type** | `dmesg -T --level=err,warn` |

## Rôle

Messages du noyau : matériel, USB, disques, OOM.

## En détail

Montre les messages du noyau, surtout liés au matériel (disques, USB, réseau). Utile pour diagnostiquer un périphérique qui pose problème.

## Options

| Option | Rôle |
| --- | --- |
| `-T` | horodatage lisible |
| `-w` | suit en direct |
| `--level ‹niveau›` | filtre par gravité |
| `-H` | sortie paginee |

## Exemples

**Erreurs et avertissements dates**

```bash
dmesg -T --level=err,warn
```

**Suivre un branchement USB**

```bash
dmesg -w
```

*Mots-clés : noyau messages matériel boot usb disque erreur oom dmesg*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
