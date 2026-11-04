---
title: "@\"...\"@"
description: "PowerShell — @\"...\"@ (Here-string interpolée) : Here-string entre guillemets : $variable et $(expression) sont remplacés avant l'écriture. Pour générer du contenu dynamique."
tags: [powershell, commande, heredoc]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Heredoc |
| **Contexte** | Here-string interpolée |
| **Commande type** | `@"..."@` |

## Rôle

Here-string entre guillemets : $variable et $(expression) sont remplacés avant l'écriture. Pour générer du contenu dynamique.

## Options

| Option | Rôle |
| --- | --- |
| `(@" ... "@)` | $var et $(...) sont évalués |
| `(garder un $ littéral)` | préfixe-le d'un accent grave |
| `(config avec des $)` | préfère la version littérale @' ... '@ |

## Exemples

**Rapport horodaté**

```powershell
@"⏎Hôte : $env:COMPUTERNAME⏎Le : $(Get-Date -Format yyyy-MM-dd)⏎"@ | Set-Content -Path .\rapport.txt -Encoding utf8
```

**Injecter une variable**

```powershell
@"⏎USER=$env:USERNAME⏎"@ | Set-Content .\who.env -Encoding utf8
```

**Calcul en ligne**

```powershell
@"⏎Total : $(2+2)⏎"@ | Set-Content .\calc.txt -Encoding utf8
```

*Mots-clés : here-string interpolation variable expansion powershell dynamique injecter guillemets*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
