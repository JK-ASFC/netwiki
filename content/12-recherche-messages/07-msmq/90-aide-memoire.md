---
title: MSMQ — aide-mémoire des commandes
description: Commandes MSMQ avec exemples — installation de la fonctionnalité, module PowerShell MSMQ (New-MsmqQueue, Get-MsmqQueue, Send-MsmqQueue, Receive-MsmqQueue, Clear-MsmqQueue, droits), files privées et publiques, files transactionnelles, journal et file de lettres mortes, ports réseau, compteurs de performance, stockage et quotas.
tags: [aide-mémoire, msmq, message queuing, powershell, windows]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-exploitation|MSMQ]].

## Installation

```powershell
Install-WindowsFeature MSMQ-Server -IncludeManagementTools          # Windows Server
Enable-WindowsOptionalFeature -Online -FeatureName MSMQ-Server -All   # Windows 10/11
Get-Service MSMQ
```

## Files

```powershell
New-MsmqQueue -Name "commandes" -QueueType Private -Transactional
New-MsmqQueue -Name "notifications" -QueueType Private -Journaling
Get-MsmqQueue -QueueType Private | Format-Table QueueName, MessageCount, Transactional, UseJournalQueue
Get-MsmqQueue -Name "commandes" -QueueType Private | Set-MsmqQueue -Label "Commandes ERP" -QueueQuota 1048576
Get-MsmqQueue -Name "commandes" -QueueType Private | Clear-MsmqQueue
Get-MsmqQueue -Name "ancienne" -QueueType Private | Remove-MsmqQueue
```

## Messages

```powershell
$f = Get-MsmqQueue -Name "notifications" -QueueType Private
$m = New-MsmqMessage -Body "Test de file" -Label "test"
Send-MsmqQueue -InputObject $f -MessageObject $m
$f | Receive-MsmqQueue -Peek -Count 5 -RetrieveBody | Select-Object Label, Body, ArrivedTime
$f | Receive-MsmqQueue -Count 1 -RetrieveBody                     # retire le message
# Files système (journal, lettres mortes) : console « Gestion de l'ordinateur → Services et applications → Message Queuing »
```

## Droits

```powershell
Get-MsmqQueue -Name "commandes" -QueueType Private | Get-MsmqQueueACL
Get-MsmqQueue -Name "commandes" -QueueType Private | Set-MsmqQueueACL -UserName "CORP\svc-erp" -Allow ReceiveMessage, PeekMessage, WriteMessage
```

## Réseau, stockage, supervision

| Élément | Valeur |
| --- | --- |
| Ports | TCP 1801 (messages), RPC 135, 2101, 2103, 2105 ; UDP 3527 et 1801 |
| Stockage | `C:\Windows\System32\msmq\storage` (quota global de la machine dans les propriétés MSMQ) |
| Compteurs | `MSMQ Queue(*)\Messages in Queue`, `MSMQ Service\Total messages in all queues` |

```powershell
Get-Counter "\MSMQ Queue(*)\Messages in Queue" | Select-Object -ExpandProperty CounterSamples | Where-Object CookedValue -gt 0
Test-NetConnection srv-erp -Port 1801
```
