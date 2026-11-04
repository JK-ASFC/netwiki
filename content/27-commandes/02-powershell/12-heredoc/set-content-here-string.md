---
title: "Set-Content (here-string)"
description: "PowerShell — Set-Content (here-string) (Écrire un fichier) : Envoie une here-string dans un fichier (écrase). Réflexe à garder : -Encoding utf8, sinon PowerShell 5 écrit de l'UTF-16 souvent mal lu par les serveurs."
tags: [powershell, commande, heredoc]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Heredoc |
| **Contexte** | Écrire un fichier |
| **Commande type** | `Set-Content` |

## Rôle

Envoie une here-string dans un fichier (écrase). Réflexe à garder : -Encoding utf8, sinon PowerShell 5 écrit de l'UTF-16 souvent mal lu par les serveurs.

## Options

| Option | Rôle |
| --- | --- |
| `-Encoding utf8` | encodage de sortie, évite l'UTF-16 à BOM |
| `-Force` | écrase même un fichier en lecture seule |
| `-NoNewline` | sans saut de ligne final |
| `(Set-Content écrase)` | Add-Content ajoute à la fin |

## Exemples

**Config MySQL (WAMP)**

```powershell
@'⏎[mysqld]⏎port=3306⏎max_connections=150⏎'@ | Set-Content C:\wamp64\bin\mysql\my.ini -Encoding utf8
```

**Fichier .env**

```powershell
@'⏎APP_ENV=production⏎'@ | Set-Content .\.env -Encoding utf8
```

**Ajouter une ligne**

```powershell
@'⏎# note⏎'@ | Add-Content .\notes.txt -Encoding utf8
```

*Mots-clés : set-content écrire fichier encoding utf8 utf16 here-string powershell config wamp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
