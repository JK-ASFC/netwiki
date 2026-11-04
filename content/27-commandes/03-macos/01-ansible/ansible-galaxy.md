---
title: "ansible-galaxy"
description: "macOS — ansible-galaxy (Rôles & collections) : Installe et gère les rôles et collections Ansible."
tags: [macos, commande, ansible]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Ansible |
| **Contexte** | Rôles & collections |
| **Commande type** | `ansible-galaxy collection install community.general` |

## Rôle

Installe et gère les rôles et collections Ansible.

## Options

| Option | Rôle |
| --- | --- |
| `install ‹nom›` | installe un rôle |
| `collection install ‹nom›` | installe une collection |
| `-r ‹requirements.yml›` | depuis un fichier de dépendances |
| `-p ‹chemin›` | dossier d'installation |
| `init ‹role›` | squelette de rôle |
| `list` | liste l'installe |
| `--force` | réinstallé |

## Exemples

**Installer un rôle**

```zsh
ansible-galaxy install geerlingguy.nginx
```

**Depuis requirements**

```zsh
ansible-galaxy install -r requirements.yml
```

**Une collection**

```zsh
ansible-galaxy collection install community.docker
```

## Dans les autres shells

- [[27-commandes/01-bash/01-ansible/ansible-galaxy|ansible-galaxy (Bash)]]

*Mots-clés : ansible galaxy rôle collection install requirements init*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
