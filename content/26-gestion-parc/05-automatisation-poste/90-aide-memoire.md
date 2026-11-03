---
title: Automatisation du poste — aide-mémoire
description: Repères AutoHotkey v2 (raccourcis, abréviations, HotIf, démarrage, Ahk2Exe), AutoIt v3 (Run, WinWaitActive, ControlClick, Au3Info, Aut2Exe) et Actiona (actexec).
tags: [aide-mémoire, autohotkey, autoit, actiona]
icon: terminal
---

Explications : [[01-autohotkey-autoit-actiona|AutoHotkey, AutoIt et Actiona]].

```text
winget install --id AutoHotkey.AutoHotkey -e
#Requires AutoHotkey v2.0        ^ Ctrl   ! Alt   + Maj   # Win
^!t::Run "wt.exe"                 ::abr::texte de remplacement        #HotIf WinActive("ahk_exe app.exe")
shell:startup  → lancement à l'ouverture de session ; Ahk2Exe → .exe
AutoIt : Run(), WinWaitActive(), ControlClick(), ControlSetText(), WinWaitClose() ; Au3Info.exe ; Aut2Exe
Actiona : actexec scenario.ascr
```
