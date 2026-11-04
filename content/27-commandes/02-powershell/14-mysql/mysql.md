---
title: "mysql"
description: "PowerShell — mysql (Base de données / Client) : Client MySQL/MariaDB sous Windows : se connecter et exécuter du SQL."
tags: [powershell, commande, mysql]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | MySQL |
| **Contexte** | Base de données / Client |
| **Commande type** | `mysql.exe -u ‹utilisateur› -p ‹base›` |

## Rôle

Client MySQL/MariaDB sous Windows : se connecter et exécuter du SQL.

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

```powershell
mysql.exe -u root -p
```

**Lister les bases**

```powershell
mysql.exe -u root -p -e "SHOW DATABASES;"
```

**Restaurer un dump**

```powershell
Get-Content dump.sql | mysql.exe -u root -p mabase
```

## Dans les autres shells

- [[27-commandes/01-bash/14-mysql/mysql|mysql (Bash)]]
- [[27-commandes/03-macos/14-mysql/mysql|mysql (macOS)]]

*Mots-clés : mysql mariadb client connexion sql base données requête restaurer windows wamp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
