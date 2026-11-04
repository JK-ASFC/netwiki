---
title: "sudo / visudo"
description: "Bash — sudo / visudo (Administration & privilèges) : Exécution privilégiée ; visudo édite sudoers en sécurité."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Administration & privilèges |
| **Commande type** | `sudo -i` |

## Rôle

Exécution privilégiée ; visudo édite sudoers en sécurité.

## En détail

sudo exécute une commande avec les droits administrateur, ponctuellement. visudo édite en sécurité la liste de qui a le droit d'utiliser sudo.

## Options

| Option | Rôle |
| --- | --- |
| `-i` | ouvre un shell root de CONNEXION : recharge tout l'environnement de root (PATH, HOME=/root, ~/.bashrc) |
| `-s` | ouvre un shell root SANS réinitialiser complètement l'environnement (garde une partie du vôtre) |
| `sh -c ‹'commande complète'›` | exécute toute une ligne via un shell root : indispensable dès qu'il y a une redirection, un tube ou un && (ex : sudo sh -c 'écho 1 > /proc/sys/net/ipv4/ip_forward') |
| `-u ‹utilisateur›` | exécute sous un AUTRE compte que root (ex : sudo -u postgres psql) |
| `-l` | liste ses droits |
| `-k` | oublié l'authentification en cache : le prochain sudo redemandera le mot de passe |
| `-v` | prolonge le délai de grâce sans lancer de commande |
| `-E` | CONSERVE vos variables d'environnement (sudo en retire beaucoup par sécurité) |
| `-b` | lance la commande en ARRIÈRE-PLAN et rend immédiatement la main |
| `visudo` | édite sudoers valide |
| `-f ‹fichier›` | visudo -f : édite un fichier sudoers PRÉCIS (ex : /etc/sudoers.d/deploy) en validant la syntaxe avant d'enregistrer |

## Exemples

**Vérifier ses droits**

```bash
sudo -l
```

**Éditer la conf sudo**

```bash
sudo visudo
```

**Éditer un fichier dédié**

```bash
sudo visudo -f /etc/sudoers.d/deploy
```

## Dans les autres shells

- [[27-commandes/03-macos/23-securite-acces/sudo-visudo|sudo / visudo (macOS)]]

*Mots-clés : privilèges root administrateur escalade visudo sudo élévation*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
