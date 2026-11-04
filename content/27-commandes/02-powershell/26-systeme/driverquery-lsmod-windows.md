---
title: "driverquery (lsmod Windows)"
description: "PowerShell — driverquery (lsmod Windows) (Noyau & pilotes (= lsmod)) : Liste les pilotes de périphériques installés : l'équivalent le plus proche de lsmod sous Windows. Sans /v, il ne dit pas quels pilotes sont chargés."
tags: [powershell, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Système |
| **Contexte** | Noyau & pilotes (= lsmod) |
| **Commande type** | `driverquery /v` |

## Rôle

Liste les pilotes de périphériques installés : l'équivalent le plus proche de lsmod sous Windows. Sans /v, il ne dit pas quels pilotes sont chargés.

## Options

| Option | Rôle |
| --- | --- |
| `/v` | sortie détaillée, avec l'état du pilote |
| `/si` | informations de signature numérique |
| `/fo ‹format›` | format de sortie |
| `/nh` | supprime la ligne d'en-tête |
| `/s ‹ordinateur›` | interroge un ordinateur distant |
| `(installés) pas chargés` | ce que liste driverquery par défaut |
| `(en cours) driverquery /v \| findstr Running` | ne garder que les pilotes actifs |
| `(exact) Get-CimInstance Win32_SystemDriver` | état précis, en PowerShell |

## Exemples

**Pilotes installés**

```powershell
driverquery
```

**Pilotes en cours d'exécution**

```powershell
driverquery /v | findstr Running
```

**Pilotes non signés**

```powershell
driverquery /si | findstr FALSE
```

*Mots-clés : driverquery pilote driver lsmod noyau charge installe signe findstr windows*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
