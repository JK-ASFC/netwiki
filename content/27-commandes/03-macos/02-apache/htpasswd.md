---
title: "htpasswd"
description: "macOS — htpasswd (Authentification) : Crée et gère les fichiers de mots de passe pour l'authentification Apache."
tags: [macos, commande, apache]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Apache |
| **Contexte** | Authentification |
| **Commande type** | `htpasswd -c .htpasswd alice` |

## Rôle

Crée et gère les fichiers de mots de passe pour l'authentification Apache.

## Options

| Option | Rôle |
| --- | --- |
| ⚠️ `-c ‹fichier user›` | CRÉE le fichier (écrase s'il existe déjà) |
| `-b ‹fichier user mdp›` | mot de passe en ligne (non interactif) |
| `-B` | hachage bcrypt (recommandé) |
| `-D ‹fichier user›` | supprime un utilisateur |
| `-n ‹user›` | affiche l'empreinte sans écrire de fichier |

> [!WARNING]
> Options à manier avec précaution : `-c ‹fichier user›`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Créer (premier utilisateur)**

```zsh
htpasswd -cB .htpasswd alice
```

**Ajouter un utilisateur**

```zsh
htpasswd -B .htpasswd bob
```

**Supprimer**

```zsh
htpasswd -D .htpasswd bob
```

## Dans les autres shells

- [[27-commandes/01-bash/02-apache/htpasswd|htpasswd (Bash)]]
- [[27-commandes/02-powershell/02-apache/htpasswd|htpasswd (PowerShell)]]

*Mots-clés : htpasswd authentification mot de passe apache bcrypt utilisateur*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
