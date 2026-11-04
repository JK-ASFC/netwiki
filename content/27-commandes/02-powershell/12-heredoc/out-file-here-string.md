---
title: "Out-File (here-string)"
description: "PowerShell — Out-File (here-string) (Piège d'encodage) : Autre façon d'écrire un fichier. Son piège : en PowerShell 5 l'encodage par défaut est de l'UTF-16. Précise toujours -Encoding utf8 (ou utilise Set-Content)."
tags: [powershell, commande, heredoc]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Heredoc |
| **Contexte** | Piège d'encodage |
| **Commande type** | `Out-File` |

## Rôle

Autre façon d'écrire un fichier. Son piège : en PowerShell 5 l'encodage par défaut est de l'UTF-16. Précise toujours -Encoding utf8 (ou utilise Set-Content).

## Options

| Option | Rôle |
| --- | --- |
| `-Encoding utf8` | indispensable, défaut = UTF-16 en PS 5 |
| `-Append` | ajoute à la fin |
| `-FilePath ‹chemin›` | fichier cible |
| `-Force` | crée les dossiers manquants |

## Exemples

**Vhost Apache**

```powershell
@'⏎<VirtualHost *:80>⏎    DocumentRoot C:\wamp64\www⏎</VirtualHost>⏎'@ | Out-File .\vhost.conf -Encoding utf8
```

**Ajouter**

```powershell
@'⏎extra⏎'@ | Out-File .\log.txt -Encoding utf8 -Append
```

**Forcer l'UTF-8**

```powershell
@'⏎donnée⏎'@ | Out-File .\d.txt -Encoding utf8
```

*Mots-clés : out-file encoding utf8 utf16 bom piège powershell here-string redirection fichier*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
