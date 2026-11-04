---
title: "a2ensite / a2dissite"
description: "Bash — a2ensite / a2dissite (Configuration / vhost) : Active (a2ensite) ou désactive (a2dissite) un hôte virtuel sur Debian/Ubuntu."
tags: [bash, commande, apache]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Apache |
| **Contexte** | Configuration / vhost |
| **Commande type** | `a2ensite ‹site›` |

## Rôle

Active (a2ensite) ou désactive (a2dissite) un hôte virtuel sur Debian/Ubuntu.

## Options

| Option | Rôle |
| --- | --- |
| `-q` | mode silencieux (quiet) |
| `(a2dissite ‹site› fait l'inverse)` | désactive le vhost |
| `(à recharger ensuite)` | systemctl reload apache2 |

## Exemples

**Activer un site**

```bash
a2ensite monsite.conf
```

**Désactiver le défaut**

```bash
a2dissite 000-default.conf
```

**Recharger**

```bash
systemctl reload apache2
```

*Mots-clés : vhost virtualhost site activer désactiver a2ensite a2dissite enable disable apache lamp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
