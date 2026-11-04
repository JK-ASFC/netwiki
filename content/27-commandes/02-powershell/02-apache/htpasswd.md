---
title: "htpasswd"
description: "PowerShell — htpasswd (Authentification / Auth basique) : Gère les utilisateurs d'une authentification HTTP basique (htpasswd.exe livré avec Apache)."
tags: [powershell, commande, apache]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Apache |
| **Contexte** | Authentification / Auth basique |
| **Commande type** | `htpasswd.exe -c ‹fichier› ‹utilisateur›` |

## Rôle

Gère les utilisateurs d'une authentification HTTP basique (htpasswd.exe livré avec Apache).

## Options

| Option | Rôle |
| --- | --- |
| ⚠️ `-c` | CRÉE le fichier (écrase s'il existe) |
| `-b ‹motdepasse›` | mot de passe en ligne (non interactif) |
| `-D ‹utilisateur›` | supprime un utilisateur |
| `-B` | hachage bcrypt (recommandé) |
| `-n` | affiche le hash sans écrire |

> [!WARNING]
> Options à manier avec précaution : `-c`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Créer + 1er user**

```powershell
htpasswd.exe -c C:\Apache24\conf\.htpasswd admin
```

**Ajouter un user**

```powershell
htpasswd.exe C:\Apache24\conf\.htpasswd bob
```

**Bcrypt non interactif**

```powershell
htpasswd.exe -bB C:\Apache24\conf\.htpasswd bob s3cret
```

## Dans les autres shells

- [[27-commandes/01-bash/02-apache/htpasswd|htpasswd (Bash)]]
- [[27-commandes/03-macos/02-apache/htpasswd|htpasswd (macOS)]]

*Mots-clés : htpasswd authentification basic auth mot de passe utilisateur windows apache wamp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
