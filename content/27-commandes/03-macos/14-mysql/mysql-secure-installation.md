---
title: "mysql_secure_installation"
description: "macOS — mysql_secure_installation (Durcissement / Sécurité) : Assistant interactif de durcissement post-installation de MySQL/MariaDB."
tags: [macos, commande, mysql]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | MySQL |
| **Contexte** | Durcissement / Sécurité |
| **Commande type** | `mysql_secure_installation` |

## Rôle

Assistant interactif de durcissement post-installation de MySQL/MariaDB.

## Options

| Option | Rôle |
| --- | --- |
| `(interactif : aucune option)` | répond aux questions oui/non |
| `(définit le mot de passe root)` | ... |
| `(supprime les comptes anonymes)` | ... |
| `(interdit root à distance)` | ... |
| `(supprime la base de test)` | ... |

## Exemples

**Lancer l'assistant**

```zsh
mysql_secure_installation
```

**Variante MariaDB**

```zsh
mariadb-secure-installation
```

**Quand**

```zsh
une fois, juste après l'installation
```

## Dans les autres shells

- [[27-commandes/01-bash/14-mysql/mysql-secure-installation|mysql_secure_installation (Bash)]]

*Mots-clés : sécurité durcissement mysql_secure_installation root anonyme distant test base mysql lamp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
