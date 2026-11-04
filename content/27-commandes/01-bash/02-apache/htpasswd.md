---
title: "htpasswd"
description: "Bash — htpasswd (Authentification / Auth basique) : Gère les utilisateurs d'une authentification HTTP basique Apache."
tags: [bash, commande, apache]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Apache |
| **Contexte** | Authentification / Auth basique |
| **Commande type** | `htpasswd -c ‹fichier› ‹utilisateur›` |

## Rôle

Gère les utilisateurs d'une authentification HTTP basique Apache.

## Options

| Option | Rôle |
| --- | --- |
| ⚠️ `-c` | CRÉE le fichier (écrase s'il existe déjà) |
| `-b ‹motdepasse›` | mot de passe en ligne (non interactif) |
| `-D ‹utilisateur›` | supprime un utilisateur |
| `-B` | hachage bcrypt (recommandé) |
| `-n` | affiche le hash sans écrire de fichier |

> [!WARNING]
> Options à manier avec précaution : `-c`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Créer le fichier + 1er user**

```bash
htpasswd -c /etc/apache2/.htpasswd admin
```

**Ajouter un user**

```bash
htpasswd /etc/apache2/.htpasswd bob
```

**Bcrypt non interactif**

```bash
htpasswd -bB /etc/apache2/.htpasswd bob s3cret
```

## Dans les autres shells

- [[27-commandes/02-powershell/02-apache/htpasswd|htpasswd (PowerShell)]]
- [[27-commandes/03-macos/02-apache/htpasswd|htpasswd (macOS)]]

*Mots-clés : htpasswd authentification basic auth mot de passe utilisateur htaccess apache lamp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
