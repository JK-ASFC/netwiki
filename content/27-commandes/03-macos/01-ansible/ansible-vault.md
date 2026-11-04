---
title: "ansible-vault"
description: "macOS — ansible-vault (Secrets) : Chiffre et déchiffre des fichiers de secrets Ansible."
tags: [macos, commande, ansible]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Ansible |
| **Contexte** | Secrets |
| **Commande type** | `ansible-vault encrypt secrets.yml` |

## Rôle

Chiffre et déchiffre des fichiers de secrets Ansible.

## Options

| Option | Rôle |
| --- | --- |
| `encrypt ‹fichier›` | chiffre un fichier |
| `decrypt ‹fichier›` | déchiffre |
| `edit ‹fichier›` | édite en clair (rechiffre) |
| `view ‹fichier›` | affiche en clair |
| `rekey ‹fichier›` | change la clé |
| `create ‹fichier›` | crée un fichier chiffre |
| `--vault-password-file ‹fichier›` | fichier du mot de passe |
| `--ask-vault-pass` | demande le mot de passe |

## Exemples

**Chiffrer**

```zsh
ansible-vault encrypt group_vars/all/secrets.yml
```

**Éditer**

```zsh
ansible-vault edit secrets.yml
```

**Jouer avec le vault**

```zsh
ansible-playbook site.yml --ask-vault-pass
```

## Dans les autres shells

- [[27-commandes/01-bash/01-ansible/ansible-vault|ansible-vault (Bash)]]

*Mots-clés : ansible vault chiffrer secret encrypt decrypt mot de passe*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
