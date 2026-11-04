---
title: "chcon"
description: "Bash — chcon (SELinux) : Change le contexte SELinux d'un fichier (temporaire)."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | SELinux |
| **Commande type** | `chcon -t httpd_sys_content_t /var/www/index.html` |

## Rôle

Change le contexte SELinux d'un fichier (temporaire).

## Options

| Option | Rôle |
| --- | --- |
| `-t ‹type›` | type SELinux (ex: httpd_sys_content_t) |
| `-u ‹user›` | user SELinux |
| `-r ‹role›` | rôle SELinux |
| `-R` | récursif |
| `--reference ‹fichier›` | copie le contexte d'un autre fichier |

## Exemples

**Changer le type**

```bash
chcon -t httpd_sys_content_t /var/index.html
```

*Mots-clés : selinux contexte type chcon label sécurité chcon*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
