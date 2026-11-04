---
title: "Invoke-WebRequest"
description: "PowerShell — Invoke-WebRequest (Tests d'API / Web) : Requête HTTP avec headers/DOM. Alias : iwr."
tags: [powershell, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Réseau |
| **Contexte** | Tests d'API / Web |
| **Commande type** | `Invoke-WebRequest https://example.com -OutFile page.html` |

## Rôle

Requête HTTP avec headers/DOM. Alias : iwr.

## Options

| Option | Rôle |
| --- | --- |
| `-Uri ‹url›` | URL |
| `-OutFile ‹fichier›` | enregistre |
| `-Method ‹GET›` | GET/POST |
| `-Headers @{}` | en-têtes |
| `-UseBasicParsing` | sans moteur HTML |

## Exemples

**Télécharger**

```powershell
Invoke-WebRequest https://site/f.zip -OutFile f.zip
```

**Code de statut**

```powershell
(Invoke-WebRequest https://example.com).StatusCode
```

*Mots-clés : http télécharger web page requête download curl wget iwr*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
