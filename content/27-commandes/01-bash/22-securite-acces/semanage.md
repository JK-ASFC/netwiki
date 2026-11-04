---
title: "semanage"
description: "Bash — semanage (SELinux) : Gère les règles SELinux persistantes (contextes, ports, users)."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | SELinux |
| **Commande type** | `semanage fcontext -l` |

## Rôle

Gère les règles SELinux persistantes (contextes, ports, users).

## Options

| Option | Rôle |
| --- | --- |
| `fcontext` | contextes de fichiers |
| `port` | règles de ports |
| `user` | utilisateurs SELinux |
| `login` | associe un compte Linux à un utilisateur SELinux (mapping login système vers user SELinux) |
| `-a` | ajoute une règle |
| `-l` | liste |
| `-d` | supprime |

## Exemples

**Lister les users SELinux**

```bash
semanage user -l
```

**Ajouter un contexte**

```bash
semanage fcontext -a -t httpd_sys_content_t "/web(/.*)?"
```

**Mapper un compte**

```bash
sudo semanage login -a -s staff_u alice
```

*Mots-clés : selinux semanage politique contexte port user persistant semanage*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
