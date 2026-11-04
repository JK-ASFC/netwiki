---
title: "mysql"
description: "macOS — mysql (Base de données / Client) : Client MySQL/MariaDB en ligne de commande : se connecter et exécuter du SQL."
tags: [macos, commande, mysql]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | MySQL |
| **Contexte** | Base de données / Client |
| **Commande type** | `mysql -u ‹utilisateur› -p ‹base›` |

## Rôle

Client MySQL/MariaDB en ligne de commande : se connecter et exécuter du SQL.

## Options

| Option | Rôle |
| --- | --- |
| `-u ‹utilisateur›` | nom d'utilisateur |
| `-p` | demande le mot de passe (interactif) |
| `-h ‹hôte›` | serveur (défaut localhost) |
| `-P ‹port›` | port (défaut 3306) |
| `-e ‹requête SQL›` | exécute une requête puis quitte |
| `-D ‹base›` | sélectionne la base |
| `--ssl-mode ‹REQUIRED›` | force TLS |

## Exemples

**Se connecter**

```zsh
mysql -u root -p
```

**Lister les bases**

```zsh
mysql -u root -p -e "SHOW DATABASES;"
```

**Restaurer un dump**

```zsh
mysql -u root -p mabase < dump.sql
```

## Dans les autres shells

- [[27-commandes/01-bash/14-mysql/mysql|mysql (Bash)]]
- [[27-commandes/02-powershell/14-mysql/mysql|mysql (PowerShell)]]

*Mots-clés : mysql mariadb client connexion sql base données requête import restaurer lamp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
