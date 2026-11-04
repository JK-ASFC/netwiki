---
title: "a2enmod / a2dismod"
description: "Bash — a2enmod / a2dismod (Configuration / module) : Active (a2enmod) ou désactive (a2dismod) un module Apache sur Debian/Ubuntu."
tags: [bash, commande, apache]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Apache |
| **Contexte** | Configuration / module |
| **Commande type** | `a2enmod ‹module›` |

## Rôle

Active (a2enmod) ou désactive (a2dismod) un module Apache sur Debian/Ubuntu.

## Options

| Option | Rôle |
| --- | --- |
| `-q` | mode silencieux |
| `(a2dismod ‹module› fait l'inverse)` | désactive le module |
| `(à recharger ensuite)` | systemctl reload apache2 |

## Exemples

**Activer le rewrite**

```bash
a2enmod rewrite
```

**Activer SSL + headers**

```bash
a2enmod ssl headers
```

**Désactiver**

```bash
a2dismod status
```

*Mots-clés : module mod_rewrite ssl headers activer désactiver a2enmod a2dismod apache lamp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
