---
title: "ansible-inventory"
description: "Bash — ansible-inventory (Inventaire) : Affiche et vérifie l'inventaire (statique ou dynamique)."
tags: [bash, commande, ansible]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Ansible |
| **Contexte** | Inventaire |
| **Commande type** | `ansible-inventory --list` |

## Rôle

Affiche et vérifie l'inventaire (statique ou dynamique).

## Options

| Option | Rôle |
| --- | --- |
| `-i ‹inventaire›` | source d'inventaire |
| `--list` | JSON complet |
| `--graph` | arborescence des groupes |
| `--host ‹hote›` | variables d'un hôte |
| `-y` | sortie YAML |

## Exemples

**Voir les groupes**

```bash
ansible-inventory -i hosts --graph
```

**Tout en JSON**

```bash
ansible-inventory --list
```

## Dans les autres shells

- [[27-commandes/03-macos/01-ansible/ansible-inventory|ansible-inventory (macOS)]]

*Mots-clés : ansible inventaire inventory list graph host yaml*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
