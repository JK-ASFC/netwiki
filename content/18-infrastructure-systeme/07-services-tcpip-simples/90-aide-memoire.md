---
title: Services TCP/IP simples — aide-mémoire des commandes
description: Commandes pour détecter, tester et désactiver les services TCP/IP simples (echo 7, discard 9, daytime 13, qotd 17, chargen 19) sous Windows (fonctionnalité Simple-TCPIP, service simptcp) et Linux (inetd/xinetd, systemd), audit réseau (nmap), règles de pare-feu, alternatives modernes pour les tests (iperf3, ping, nc).
tags: [aide-mémoire, simple tcpip, echo, chargen, sécurité, nmap]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-risques|services TCP/IP simples]]. Ces services sont **obsolètes** et exploitables (amplification, déni de service) : à n'activer que temporairement en laboratoire.

## Windows

```powershell
Get-WindowsFeature Simple-TCPIP                                   # Windows Server
Get-WindowsOptionalFeature -Online -FeatureName SimpleTCP         # Windows 10/11
Get-Service simptcp -ErrorAction SilentlyContinue
Get-NetTCPConnection -State Listen | Where-Object LocalPort -in 7, 9, 13, 17, 19
# Désactiver / supprimer
Stop-Service simptcp; Set-Service simptcp -StartupType Disabled
Uninstall-WindowsFeature Simple-TCPIP
Disable-WindowsOptionalFeature -Online -FeatureName SimpleTCP
```

## Linux

```bash
sudo ss -lntup | grep -E ':(7|9|13|17|19)\s'
systemctl list-unit-files | grep -Ei 'echo|daytime|chargen|discard|xinetd|inetd'
grep -E '^(echo|discard|daytime|chargen)' /etc/inetd.conf 2>/dev/null
ls /etc/xinetd.d/ 2>/dev/null
# Désactiver (xinetd) : disable = yes dans /etc/xinetd.d/echo-stream, puis
sudo systemctl restart xinetd
sudo systemctl disable --now xinetd
```

## Audit réseau

```bash
nmap -sT -sU -p T:7,9,13,17,19,U:7,9,13,17,19 10.0.0.0/24 --open
```

## Pare-feu

```powershell
New-NetFirewallRule -DisplayName "Bloquer services TCP/IP simples" -Direction Inbound -Protocol TCP -LocalPort 7,9,13,17,19 -Action Block
New-NetFirewallRule -DisplayName "Bloquer services UDP simples" -Direction Inbound -Protocol UDP -LocalPort 7,9,13,17,19 -Action Block
```

```bash
sudo nft add rule inet filter input meta l4proto { tcp, udp } th dport { 7, 9, 13, 17, 19 } drop
```

## Alternatives modernes

| Besoin | Outil |
| --- | --- |
| Tester la connectivité | `ping`, `Test-NetConnection -Port`, `nc -vz` |
| Débit | `iperf3` |
| Heure | NTP (`chronyc`, `w32tm`) |
| Écho applicatif | `nc -l` / `socat` temporaires en laboratoire |
