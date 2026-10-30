---
title: Outils d'accès — aide-mémoire (PuTTY, Termius, WinSCP)
description: Commandes et raccourcis des outils d'accès à distance avec exemples — PuTTY (lignes de commande putty/plink/pscp/psftp/puttygen, sessions enregistrées, tunnels, clés .ppk, journalisation, export des sessions), Termius (raccourcis, hôtes, snippets, transferts), WinSCP (ligne de commande winscp.com, scripts de synchronisation, journal, clés, intégration PowerShell .NET).
tags: [aide-mémoire, putty, plink, pscp, winscp, termius, ssh]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-putty|PuTTY]], [[02-termius|Termius]] et [[03-winscp|WinSCP]].

## PuTTY et ses outils

```powershell
putty.exe -ssh admin@sw-paris-01 -P 22
putty.exe -load "Coeur-Paris"                           # session enregistrée
putty.exe -serial COM3 -sercfg 9600,8,n,1,N             # console série d'un équipement
putty.exe -ssh admin@bastion -L 8443:10.0.30.10:443     # tunnel local
putty.exe -ssh admin@bastion -D 1080                    # proxy SOCKS dynamique
putty.exe -ssh amartin@srv01 -i C:\Cles\amartin.ppk
# plink : commandes non interactives (scripts)
plink.exe -batch -ssh admin@sw-paris-01 -pw $env:MDP "show running-config" > sw-paris-01.cfg
plink.exe -batch -load "Coeur-Paris" -m commandes.txt    # liste de commandes dans un fichier
plink.exe -batch -hostkey "SHA256:abc…" -ssh admin@10.0.99.10 "show version"
# pscp / psftp : copie de fichiers
pscp.exe -scp sauvegarde.cfg admin@10.0.99.10:flash:/
pscp.exe -r amartin@srv01:/var/log/nginx .\journaux\
psftp.exe amartin@srv01 -b lot.txt                        # put / get / ls dans lot.txt
# puttygen : clés
puttygen.exe -t ed25519 -o C:\Cles\amartin.ppk
puttygen.exe C:\Cles\amartin.ppk -O public-openssh -o C:\Cles\amartin.pub
puttygen.exe C:\Cles\id_ed25519 -o C:\Cles\amartin.ppk   # convertir une clé OpenSSH
# Exporter toutes les sessions enregistrées (registre)
reg export "HKCU\Software\SimonTatham\PuTTY\Sessions" C:\Temp\putty-sessions.reg
```

| Raccourci / option PuTTY | Effet |
| --- | --- |
| Clic droit | Coller ; sélection = copie |
| `Ctrl+Clic droit` | Menu (nouvelle session, journal, *Duplicate Session*) |
| *Session → Logging* | Journaliser toute la sortie (`&H-&Y&M&D-&T.log`) |
| *Window → Lines of scrollback* | Augmenter l'historique (ex. 20000) |
| *Connection → Seconds between keepalives* | 30 : éviter les coupures |
| *Terminal → Features → Disable application keypad* | Pavé numérique utilisable sur certains équipements |

## Termius

| Raccourci | Effet |
| --- | --- |
| `Ctrl+T` / `Cmd+T` | Nouvel onglet |
| `Ctrl+K` / `Cmd+K` | Recherche rapide (hôtes, snippets) |
| `Ctrl+Shift+S` | Ouvrir SFTP |
| Snippets | Commandes enregistrées réutilisables, exécutables sur plusieurs hôtes |
| Port forwarding | Règles de tunnels enregistrées par hôte |

Conservez les clés et identifiants dans le coffre chiffré de Termius ; activez l'authentification à deux facteurs du compte si la synchronisation est utilisée.

## WinSCP

```powershell
winscp.com /command "open sftp://amartin@srv01/ -hostkey=""ssh-ed25519 255 SHA256:abc…""" "put C:\Export\*.csv /srv/import/" "exit"
winscp.com /script=synchro.txt /log=C:\Temp\winscp.log
winscp.com /ini=nul /command "open sftp://amartin:$env:MDP@srv01/" "synchronize remote C:\Site /var/www/site -delete -mirror" "exit"
```

```text
# synchro.txt
option batch abort
option confirm off
open sftp://sauvegarde@nas.exemple.fr/ -privatekey=C:\Cles\sauvegarde.ppk -hostkey="ssh-ed25519 255 SHA256:abc…"
synchronize local C:\Sauvegardes\Configs /srv/configs -criteria=time
exit
```

```powershell
# Intégration .NET (WinSCPnet.dll)
Add-Type -Path "C:\Program Files (x86)\WinSCP\WinSCPnet.dll"
$opt = New-Object WinSCP.SessionOptions -Property @{ Protocol = [WinSCP.Protocol]::Sftp; HostName = "srv01"; UserName = "amartin"; SshHostKeyFingerprint = "ssh-ed25519 255 SHA256:abc…"; SshPrivateKeyPath = "C:\Cles\amartin.ppk" }
$s = New-Object WinSCP.Session; $s.Open($opt)
$s.PutFiles("C:\Export\*.csv", "/srv/import/").Check()
$s.Dispose()
```

Astuce : *Session → Générer le code de session* dans WinSCP produit automatiquement la commande ou le script correspondant à une session enregistrée.
