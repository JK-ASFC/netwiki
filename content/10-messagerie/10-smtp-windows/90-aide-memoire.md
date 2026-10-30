---
title: Serveur SMTP Windows (relais IIS 6) — aide-mémoire des commandes
description: Commandes du service SMTP de Windows Server avec exemples — installation de la fonctionnalité, service SMTPSVC, console IIS 6 (relais, connexions autorisées, sécurité), dossiers Pickup/Queue/Badmail, test d'envoi (Send-MailMessage, telnet, PowerShell avec .NET), journaux, alternatives recommandées (relais Linux, Exchange Online, connecteur SMTP).
tags: [aide-mémoire, smtp, windows server, iis 6, relais, smtpsvc]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-relais-smtp|SMTP Windows]]. Le service SMTP d'IIS 6 est **déprécié** : à réserver aux applications héritées, en relais interne strictement filtré.

## Installation et service

```powershell
Install-WindowsFeature SMTP-Server -IncludeManagementTools
Set-Service SMTPSVC -StartupType Automatic
Start-Service SMTPSVC
Get-Service SMTPSVC
inetmgr6                         # console IIS 6 : propriétés du « Serveur virtuel SMTP »
```

Réglages essentiels dans la console : *Accès → Relais* (seulement les serveurs d'application listés), *Connexion* (adresses autorisées), *Remise → Remise avancée* (hôte actif = relais de l'entreprise ou du fournisseur, authentification sortante, TLS), *Messages* (taille maximale), journalisation W3C activée.

## Dossiers

```powershell
Get-ChildItem C:\inetpub\mailroot\Queue | Measure-Object        # messages en attente
Get-ChildItem C:\inetpub\mailroot\Badmail | Sort-Object LastWriteTime | Select-Object -Last 5
# Dépôt direct d'un message au format .eml dans le dossier Pickup
Copy-Item .\message.eml C:\inetpub\mailroot\Pickup\
```

## Tests

```powershell
Test-NetConnection relais.corp.exemple.fr -Port 25
# Envoi simple (Send-MailMessage est obsolète mais toujours présent dans Windows PowerShell 5.1)
Send-MailMessage -SmtpServer relais.corp.exemple.fr -From app@exemple.fr -To alice.martin@exemple.fr -Subject "Test relais" -Body "OK"
# Alternative .NET
$c = New-Object System.Net.Mail.SmtpClient("relais.corp.exemple.fr", 25); $c.Send("app@exemple.fr", "alice.martin@exemple.fr", "Test", "Corps")
```

## Journaux

```powershell
Get-ChildItem C:\Windows\System32\LogFiles\SMTPSVC1 | Sort-Object LastWriteTime | Select-Object -Last 1 | Get-Content -Tail 30
Get-WinEvent -LogName System -MaxEvents 30 | Where-Object ProviderName -eq "SMTPSVC"
```

## Alternatives

| Besoin | Solution |
| --- | --- |
| Relais interne moderne | [[01-postfix/01-presentation\|Postfix]] en relais restreint (Linux) |
| Microsoft 365 | Connecteur SMTP Exchange Online (relais par IP) ou envoi authentifié par SMTP AUTH / Graph |
| Applications | Bibliothèques SMTP modernes avec TLS et authentification |
