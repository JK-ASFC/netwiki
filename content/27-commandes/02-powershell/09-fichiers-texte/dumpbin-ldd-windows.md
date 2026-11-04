---
title: "dumpbin (ldd Windows)"
description: "PowerShell — dumpbin (ldd Windows) (Binaires / Dépendances (= ldd)) : Liste les DLL dont un exécutable importe des fonctions : l'équivalent de ldd côté Windows. Outil de Visual Studio, absent d'une installation Windows ordinaire."
tags: [powershell, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Binaires / Dépendances (= ldd) |
| **Commande type** | `dumpbin /dependents C:\app\app.exe` |

## Rôle

Liste les DLL dont un exécutable importe des fonctions : l'équivalent de ldd côté Windows. Outil de Visual Studio, absent d'une installation Windows ordinaire.

## Options

| Option | Rôle |
| --- | --- |
| `/dependents` | noms des DLL importées |
| `/imports` | DLL et fonctions importées |
| `/exports` | fonctions exportées |
| `/headers` | en-têtes du fichier |
| `‹fichier›` | exécutable ou DLL à examiner |
| `(Visual Studio) invite de commandes développeur` | où se trouve dumpbin |
| `(à l'exécution) Get-Process -Name ‹nom› -Module` | modules réellement chargés |
| `(un seul niveau) pas récursif` | différence avec ldd |

## Exemples

**DLL d'un exécutable**

```powershell
dumpbin /dependents C:\app\app.exe
```

**DLL et fonctions importées**

```powershell
dumpbin /imports C:\app\app.exe
```

**Modules chargés par un processus**

```powershell
Get-Process -Name notepad -Module
```

*Mots-clés : dumpbin dependents imports exports headers dll ldd dépendances pe exe visual studio msvc*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
