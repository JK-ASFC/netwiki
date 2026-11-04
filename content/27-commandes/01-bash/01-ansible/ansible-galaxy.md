---
title: "ansible-galaxy"
description: "Bash — ansible-galaxy (Rôles & collections) : Installe et gère les rôles et collections Ansible."
tags: [bash, commande, ansible]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
ansible-galaxy install geerlingguy.nginx
```

**Depuis requirements**

```bash
ansible-galaxy install -r requirements.yml
```

**Une collection**

```bash
ansible-galaxy collection install community.docker
```

## Dans les autres shells

- [[27-commandes/03-macos/01-ansible/ansible-galaxy|ansible-galaxy (macOS)]]

*Mots-clés : ansible galaxy rôle collection install requirements init*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
