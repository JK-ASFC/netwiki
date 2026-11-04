---
title: "ansible-doc"
description: "macOS — ansible-doc (Aide) : Documentation des modules et plugins Ansible."
tags: [macos, commande, ansible]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Ansible |
| **Contexte** | Aide |
| **Commande type** | `ansible-doc apt` |

## Rôle

Documentation des modules et plugins Ansible.

## Options

| Option | Rôle |
| --- | --- |
| `-l` | liste tous les modules |
| `-s ‹module›` | exemple d'utilisation (snippet) |
| `-t ‹type›` | type de plugin (module, lookup, filter...) |

## Exemples

**Doc d'un module**

```zsh
ansible-doc copy
```

**Exemple prêt**

```zsh
ansible-doc -s user
```

## Dans les autres shells

- [[27-commandes/01-bash/01-ansible/ansible-doc|ansible-doc (Bash)]]

*Mots-clés : ansible doc module aide documentation snippet liste*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
