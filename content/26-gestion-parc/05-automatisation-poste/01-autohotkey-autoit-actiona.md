---
title: AutoHotkey, AutoIt et Actiona
description: Automatiser l'interface graphique quand il n'existe ni ligne de commande ni API — AutoHotkey v2 (GPL, Windows : raccourcis clavier, abréviations, remappage, fenêtres, compilation Ahk2Exe), AutoIt v3 (gratuiciel, Windows : pilotage d'installateurs et de fenêtres, Au3Info, ControlClick, compilation Aut2Exe), Actiona (GPL, Windows et Linux : scénarios visuels et JavaScript, actexec), cas d'usage administrateur, déploiement et précautions (antivirus, mots de passe, sessions).
tags: [autohotkey, autoit, actiona, automatisation, macros, windows, interface graphique]
icon: mouse-pointer-click
---

Dernier recours quand un logiciel ne propose **ni installation silencieuse, ni ligne de commande, ni API** : simuler clics et frappes. Pour tout le reste, préférer [[19-powershell/01-presentation-installation|PowerShell]] ou les outils de [[03-supports-deploiement/02-fog-opsi-wapt|déploiement]].

| Outil | Systèmes | Langage | Licence |
| --- | --- | --- | --- |
| **AutoHotkey v2** | Windows | Script AutoHotkey | GPL 2.0 |
| **AutoIt v3** | Windows | Script proche du BASIC | Gratuiciel (non open source) |
| **Actiona** | Windows, Linux (X11) | Scénario visuel + JavaScript | GPL 3.0 |

## AutoHotkey v2

`winget install --id AutoHotkey.AutoHotkey -e`. Un script `.ahk` :

```text
#Requires AutoHotkey v2.0
#SingleInstance Force

^!t::Run "wt.exe"                                   ; Ctrl+Alt+T : Windows Terminal
^!p::Run "mstsc.exe /v:srv-app01.corp.exemple.fr"   ; Ctrl+Alt+P : bureau distant
::@sig::Cordialement,`nService informatique — poste 4242   ; abréviation

#HotIf WinActive("ahk_exe notepad.exe")
^s::{                                               ; dans le Bloc-notes seulement
    Send "^s"
    TrayTip "Fichier enregistré"
}
#HotIf

CapsLock::Esc                                       ; remappage d'une touche
```

Placer un raccourci du script dans `shell:startup` pour le lancer à l'ouverture de session. **Ahk2Exe** compile un script en `.exe` autonome. Window Spy (fourni) affiche classe, titre et position des fenêtres.

## AutoIt v3

Installation depuis le site d'AutoIt (éditeur SciTE adapté inclus). Exemple : piloter un ancien installateur sans mode silencieux.

```text
Run("C:\Deploi\VieilleAppli\setup.exe")
WinWaitActive("Installation de VieilleAppli", "", 60)
ControlClick("Installation de VieilleAppli", "", "[CLASS:Button; TEXT:&Suivant >]")
WinWaitActive("Installation de VieilleAppli", "Dossier de destination")
ControlSetText("Installation de VieilleAppli", "", "Edit1", "C:\Program Files\VieilleAppli")
ControlClick("Installation de VieilleAppli", "", "[CLASS:Button; TEXT:&Installer]")
WinWaitClose("Installation de VieilleAppli", "", 300)
```

`Au3Info.exe` identifie les contrôles (classe, identifiant) : `ControlClick` sur un contrôle est bien plus fiable qu'un clic à des coordonnées. **Aut2Exe** compile en `.exe`, déployable par GPO, [[03-supports-deploiement/02-fog-opsi-wapt|WAPT ou opsi]].

## Actiona

Windows (installateur) ou Linux (`sudo apt install actiona` ; X11 uniquement, pas Wayland). On assemble des **actions** (clic, frappe, attente d'une fenêtre ou d'une image à l'écran, boucle, condition, lecture de fichier) dans un scénario `.ascr`, avec du JavaScript pour la logique. Exécution sans interface : `actexec scenario.ascr`.

## Précautions

- Les exécutables compilés AutoIt et AutoHotkey sont souvent **signalés par les antivirus** (ils sont aussi utilisés par des logiciels malveillants) : signer ses exécutables avec un certificat de signature de code interne et les déclarer dans l'EDR.
- **Jamais de mot de passe en clair** dans un script ; utiliser le gestionnaire d'identifiants de Windows ou un coffre.
- Ces outils agissent dans une **session ouverte et déverrouillée** : ils ne fonctionnent pas dans la session 0 d'un service ni sur un écran verrouillé.
- Documenter et versionner les scripts : une mise à jour de l'application peut changer les fenêtres et casser l'automatisation.

Commandes : [[90-aide-memoire|aide-mémoire]].
