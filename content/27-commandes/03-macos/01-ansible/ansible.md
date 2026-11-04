---
title: "ansible"
description: "macOS — ansible (Ad-hoc) : Exécute une tâche ponctuelle (ad-hoc) sur des hôtes via un module."
tags: [macos, commande, ansible]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Ansible |
| **Contexte** | Ad-hoc |
| **Commande type** | `ansible all -m ping` |

## Rôle

Exécute une tâche ponctuelle (ad-hoc) sur des hôtes via un module.

## Options

| Option | Rôle |
| --- | --- |
| `-i ‹inventaire›` | fichier ou dossier d'inventaire |
| `-m ‹module›` | module à exécuter (ping, command, apt...) |
| `-a ‹arguments›` | arguments du module |
| `-b` | devient root (become / sudo) |
| `--become-user ‹user›` | devient cet utilisateur |
| `-u ‹user›` | utilisateur SSH distant |
| `-e ‹var=valeur›` | variables supplémentaires |
| `-l ‹limite›` | limite aux hôtes correspondants |
| `-f ‹N›` | parallélisme (forks) |
| `-C` | simulation (check, dry-run) |
| `-k` | demande le mot de passe SSH |
| `-K` | demande le mot de passe become |
| `-v` | verbeux (-vvv très verbeux) |

## Exemples

**Tester la connexion**

```zsh
ansible all -m ping
```

**Commande distante**

```zsh
ansible web -m command -a "uptime"
```

**Installer un paquet**

```zsh
ansible web -b -m apt -a "name=nginx state=present"
```

## Dans les autres shells

- [[27-commandes/01-bash/01-ansible/ansible|ansible (Bash)]]

*Mots-clés : ansible adhoc module ping inventaire become ssh orchestration*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
