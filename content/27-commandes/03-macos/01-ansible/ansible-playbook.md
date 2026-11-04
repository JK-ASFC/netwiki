---
title: "ansible-playbook"
description: "macOS — ansible-playbook (Playbook) : Exécute un playbook (fichier YAML de tâches)."
tags: [macos, commande, ansible]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Ansible |
| **Contexte** | Playbook |
| **Commande type** | `ansible-playbook site.yml` |

## Rôle

Exécute un playbook (fichier YAML de tâches).

## Options

| Option | Rôle |
| --- | --- |
| `-i ‹inventaire›` | inventaire |
| `-b` | become (root) |
| `--become-user ‹user›` | become vers cet utilisateur |
| `-e ‹var=valeur›` | variables (ou @fichier.yml) |
| `-l ‹limite›` | limite aux hôtes |
| `-t ‹tags›` | ne joue que ces tags |
| `--skip-tags ‹tags›` | ignore ces tags |
| `-C` | simulation (check) |
| `--diff` | montre les changements |
| `--syntax-check` | vérifie la syntaxe sans jouer |
| `--list-tasks` | liste les tâches |
| `--list-hosts` | liste les hôtes cibles |
| `--start-at-task ‹tache›` | démarre à cette tâche |
| `--step` | confirme chaque tâche |
| `-K` | demande le mot de passe become |
| `-v` | verbeux |

## Exemples

**Jouer un playbook**

```zsh
ansible-playbook -i hosts site.yml
```

**Simulation + diff**

```zsh
ansible-playbook site.yml --check --diff
```

**Limiter + tags**

```zsh
ansible-playbook site.yml -l web -t nginx
```

## Dans les autres shells

- [[27-commandes/01-bash/01-ansible/ansible-playbook|ansible-playbook (Bash)]]

*Mots-clés : ansible playbook yaml site tags check diff become orchestration*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
