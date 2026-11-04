---
title: "restorecon"
description: "Bash — restorecon (SELinux) : Restaure les contextes SELinux par défaut (persistant)."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | SELinux |
| **Commande type** | `restorecon -Rv /var/www` |

## Rôle

Restaure les contextes SELinux par défaut (persistant).

## Options

| Option | Rôle |
| --- | --- |
| `-R` | récursif |
| `-v` | verbeux |
| `-n` | simulation (n'applique rien) |
| `-F` | force le contexte par défaut |

## Exemples

**Restaurer un dossier**

```bash
restorecon -R /var/log
```

*Mots-clés : selinux contexte restaurer défaut restorecon label restorecon*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
