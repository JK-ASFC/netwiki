---
title: "ansible"
description: "Bash — ansible (Ad-hoc) : Exécute une tâche ponctuelle (ad-hoc) sur des hôtes via un module."
tags: [bash, commande, ansible]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
ansible all -m ping
```

**Commande distante**

```bash
ansible web -m command -a "uptime"
```

**Installer un paquet**

```bash
ansible web -b -m apt -a "name=nginx state=present"
```

## Dans les autres shells

- [[27-commandes/03-macos/01-ansible/ansible|ansible (macOS)]]

*Mots-clés : ansible adhoc module ping inventaire become ssh orchestration*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
