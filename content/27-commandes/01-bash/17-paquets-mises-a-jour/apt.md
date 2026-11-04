---
title: "apt"
description: "Bash — apt (Debian / Ubuntu) : Gestionnaire de paquets haut niveau de Debian/Ubuntu : installe, met à jour et supprime des logiciels depuis les dépôts, dépendances comprises."
tags: [bash, commande, paquets-mises-a-jour]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Paquets & mises à jour |
| **Contexte** | Debian / Ubuntu |
| **Commande type** | `apt install nginx` |

## Rôle

Gestionnaire de paquets haut niveau de Debian/Ubuntu : installe, met à jour et supprime des logiciels depuis les dépôts, dépendances comprises.

## Options

| Option | Rôle |
| --- | --- |
| `install` | installe un ou plusieurs paquets |
| `remove` | désinstalle (purge enlève aussi la config) |
| `update` | rafraîchit l'index des dépôts |
| `upgrade` | met à jour les paquets installés |
| `search` | cherche un paquet |
| `show` | détails d'un paquet |
| `autoremove` | supprime les dépendances orphelines (paquets installés automatiquement et devenus inutiles) ; identique avec apt-get autoremove ; combinable en flag : apt purge --autoremove ‹paquet› |
| `-y` | répond oui automatiquement |

## Exemples

**Installer un paquet**

```bash
sudo apt install nginx
```

**Mettre à jour le système**

```bash
sudo apt update && sudo apt full-upgrade -y
```

**Purger un paquet**

```bash
sudo apt purge --autoremove redis
```

*Mots-clés : apt paquet installer mettre à jour debian ubuntu dépôt logiciel package update upgrade remove*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
