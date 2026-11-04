---
title: "getenforce"
description: "Bash — getenforce (SELinux / État) : Affiche le mode SELinux courant."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | SELinux / État |
| **Commande type** | `getenforce` |

## Rôle

Affiche le mode SELinux courant.

## Exemples

**Le mode actuel**

```bash
getenforce
```

**État détaillé**

```bash
sestatus
```

**Liste les booléens**

```bash
getsebool -a
```

*Mots-clés : selinux mode sécurité contexte enforcing getenforce*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
