---
title: "yum"
description: "Bash — yum (RHEL / CentOS (ancien)) : Ancien gestionnaire de paquets RPM (CentOS 7, RHEL ≤7). Mêmes sous-commandes que dnf, qui l'a remplacé sur les versions récentes."
tags: [bash, commande, paquets-mises-a-jour]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Paquets & mises à jour |
| **Contexte** | RHEL / CentOS (ancien) |
| **Commande type** | `yum install nginx` |

## Rôle

Ancien gestionnaire de paquets RPM (CentOS 7, RHEL ≤7). Mêmes sous-commandes que dnf, qui l'a remplacé sur les versions récentes.

## Options

| Option | Rôle |
| --- | --- |
| `install` | installe un paquet |
| `remove` | désinstalle |
| `update` | met à jour les paquets |
| `search` | cherche un paquet |
| `info` | détails d'un paquet |
| `list installed` | liste les paquets installés |
| `-y` | répond oui automatiquement |

## Exemples

**Installer un paquet**

```bash
sudo yum install nginx
```

**Mettre à jour le système**

```bash
sudo yum update -y
```

**Infos sur un paquet**

```bash
yum info httpd
```

*Mots-clés : yum rpm paquet centos rhel ancien installer mettre à jour package update redhat legacy*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
