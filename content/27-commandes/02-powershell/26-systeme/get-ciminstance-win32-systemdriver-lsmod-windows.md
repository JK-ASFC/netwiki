---
title: "Get-CimInstance Win32_SystemDriver (lsmod Windows)"
description: "PowerShell — Get-CimInstance Win32_SystemDriver (lsmod Windows) (Noyau & pilotes (= lsmod)) : Interroge WMI sur les pilotes système, avec leur état exact (Running ou Stopped) : le vrai pendant de lsmod, là où driverquery ne donne l'état qu'avec /v."
tags: [powershell, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Système |
| **Contexte** | Noyau & pilotes (= lsmod) |
| **Commande type** | `Get-CimInstance Win32_SystemDriver` |

## Rôle

Interroge WMI sur les pilotes système, avec leur état exact (Running ou Stopped) : le vrai pendant de lsmod, là où driverquery ne donne l'état qu'avec /v.

## Options

| Option | Rôle |
| --- | --- |
| `-Filter ‹filtre›` | filtre WQL appliqué à la source |
| `-Property ‹propriétés›` | propriétés demandées |
| `(chargés) State='Running'` | pilotes en cours d'exécution |
| `(noyau) ServiceType='Kernel Driver'` | pilotes noyau seulement |
| `(chemin) PathName` | fichier du pilote |
| `(démarrage) StartMode` | quand le pilote démarre |

## Exemples

**Pilotes chargés**

```powershell
Get-CimInstance Win32_SystemDriver -Filter "State='Running'" | Select-Object Name,DisplayName,PathName
```

**Pilotes noyau seulement**

```powershell
Get-CimInstance Win32_SystemDriver -Filter "ServiceType='Kernel Driver'" | Select-Object Name,State,StartMode
```

**Triés par mode de démarrage**

```powershell
Get-CimInstance Win32_SystemDriver | Sort-Object StartMode,Name | Select-Object State,StartMode,Name
```

*Mots-clés : get-ciminstance win32_systemdriver pilote driver lsmod état running stopped noyau kernel wmi cim*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
