---
title: "@'...'@"
description: "PowerShell — @'...'@ (Here-string littérale) : Équivalent PowerShell du heredoc cité : tout ce qui est entré @' et '@ est pris littéralement. Les $variable ne sont pas interprétées."
tags: [powershell, commande, heredoc]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Heredoc |
| **Contexte** | Here-string littérale |
| **Commande type** | `@'...'@` |

## Rôle

Équivalent PowerShell du heredoc cité : tout ce qui est entré @' et '@ est pris littéralement. Les $variable ne sont pas interprétées.

## Options

| Option | Rôle |
| --- | --- |
| `(@' ouvre / '@ ferme)` | le '@ de fin doit être en début de ligne, sans espace avant |
| `(contenu littéral)` | $var et $env: restent tels quels |
| `(-Encoding utf8)` | à ajouter à Set-Content pour éviter l'UTF-16 |

## Exemples

**Config littérale**

```powershell
@'⏎port=8080⏎secret=p@ss$word⏎path=$HOME\app⏎'@ | Set-Content -Path .\config.conf -Encoding utf8
```

**Fichier .env**

```powershell
@'⏎APP_ENV=production⏎APP_DEBUG=false⏎'@ | Set-Content .\.env -Encoding utf8
```

**Ajouter à la fin**

```powershell
@'⏎# extra⏎'@ | Add-Content .\.env -Encoding utf8
```

*Mots-clés : here-string heredoc littéral powershell config fichier set-content bloc multi-ligne*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
