---
title: "dpkg"
description: "Bash — dpkg (Paquet .deb local) : Outil bas niveau des paquets .deb : installe un fichier local et interroge l'installé, sans gérer les dépôts ni les dépendances."
tags: [bash, commande, paquets-mises-a-jour]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Paquets & mises à jour |
| **Contexte** | Paquet .deb local |
| **Commande type** | `dpkg -i paquet.deb` |

## Rôle

Outil bas niveau des paquets .deb : installe un fichier local et interroge l'installé, sans gérer les dépôts ni les dépendances.

## Options

| Option | Rôle |
| --- | --- |
| `-i` | installe un fichier .deb local |
| `-r` | retire un paquet (garde la config) |
| `-P` | purge (config comprise) |
| `-l` | liste les paquets installés |
| `-L` | liste les fichiers d'un paquet |
| `-S` | trouve le paquet propriétaire d'un fichier |
| `--configure -a` | reconfigure les paquets en attente |

## Exemples

**Installer un .deb**

```bash
sudo dpkg -i ./code_amd64.deb
```

**Réparer les dépendances**

```bash
sudo dpkg -i ./paquet.deb || sudo apt -f install
```

**Trouver le paquet d'un fichier**

```bash
dpkg -S /usr/bin/curl
```

*Mots-clés : dpkg deb paquet local installer bas niveau debian fichier package query liste*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
