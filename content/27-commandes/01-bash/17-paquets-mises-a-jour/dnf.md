---
title: "dnf"
description: "Bash — dnf (Fedora / RHEL) : Gestionnaire de paquets de Fedora/RHEL/Rocky (successeur de yum) : installe, met à jour et interroge des paquets RPM depuis les dépôts."
tags: [bash, commande, paquets-mises-a-jour]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Paquets & mises à jour |
| **Contexte** | Fedora / RHEL |
| **Commande type** | `dnf install nginx` |

## Rôle

Gestionnaire de paquets de Fedora/RHEL/Rocky (successeur de yum) : installe, met à jour et interroge des paquets RPM depuis les dépôts.

## Options

| Option | Rôle |
| --- | --- |
| `install` | installe un paquet |
| `remove` | désinstalle |
| `upgrade` | met à jour (update est un alias) |
| `search` | cherche un paquet |
| `info` | détails d'un paquet |
| `list installed` | liste les paquets installés |
| `-y` | répond oui automatiquement |

## Exemples

**Installer un paquet**

```bash
sudo dnf install nginx
```

**Mettre à jour le système**

```bash
sudo dnf upgrade -y
```

**Chercher un paquet**

```bash
dnf search redis
```

*Mots-clés : dnf rpm paquet fedora rhel rocky alma installer mettre à jour package update redhat*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
