---
title: Profils, règles et administration
description: Pare-feu Windows Defender avec fonctions avancées de sécurité — profils domaine, privé et public et détection du réseau (NLA), comportement par défaut, règles entrantes et sortantes (programme, port, service, adresses, utilisateurs), groupes de règles intégrés, priorité des règles, gestion par PowerShell (NetSecurity), netsh et console wf.msc, règles minimales d'un serveur et filtrage sortant.
tags: [pare-feu windows, windows firewall, profils, règles, powershell, netsecurity, windows server]
icon: brick-wall
---

Le **pare-feu Windows Defender** est un pare-feu d'hôte **à états**, actif par défaut sur Windows et Windows Server. Bien configuré, il réduit fortement les mouvements latéraux (SMB, RPC, WinRM, RDP entre postes) — c'est une mesure essentielle contre la propagation des rançongiciels.

## Profils

| Profil | Appliqué quand |
| --- | --- |
| **Domaine** | L'interface joint un contrôleur de domaine du domaine de la machine (détection par le service *Network Location Awareness*, LDAP authentifié) |
| Privé | Réseau marqué privé (maison, réseau de confiance) |
| **Public** | Par défaut pour tout réseau inconnu — le plus restrictif |

```powershell
Get-NetConnectionProfile | Format-Table InterfaceAlias, Name, NetworkCategory
Get-NetFirewallProfile | Format-Table Name, Enabled, DefaultInboundAction, DefaultOutboundAction, LogFileName
Set-NetFirewallProfile -Profile Domain,Private,Public -Enabled True -DefaultInboundAction Block -DefaultOutboundAction Allow -NotifyOnListen False
```

> [!TIP]
> Un serveur qui passe en profil **Public** après un redémarrage (DC injoignable au démarrage, DNS) perd ses règles du profil Domaine : redémarrez le service *Network Location Awareness* et vérifiez la résolution DNS des DC. Pour les serveurs critiques, appliquez les règles nécessaires à **tous** les profils.

## Règles

| Critère | Exemples |
| --- | --- |
| Programme | `%SystemRoot%\System32\svchost.exe`, `C:\Program Files\App\app.exe` |
| Service | `-Service WinRM` |
| Protocole et ports | TCP 443, UDP 161, plages, `RPC`, `RPCEPMap` (ports dynamiques RPC) |
| Adresses | Locales et distantes (sous-réseaux, plages, mots-clés `LocalSubnet`, `DNS`, `DefaultGateway`) |
| Utilisateurs / ordinateurs autorisés | Avec IPsec (règles authentifiées) |
| Interface, profil, direction, action | Autoriser, bloquer, autoriser si sécurisé |

**Priorité** : une règle de **blocage** l'emporte sur une règle d'autorisation, sauf règle « autoriser si sécurisée » avec *Ignorer les règles de blocage*. Les règles sont évaluées toutes (pas d'ordre comme sur un pare-feu réseau).

```powershell
# Autoriser HTTPS entrant sur un serveur web
New-NetFirewallRule -DisplayName "Web HTTPS (entrant)" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow -Profile Domain,Private,Public

# Administration seulement depuis le réseau d'administration
New-NetFirewallRule -DisplayName "RDP depuis l'administration" -Direction Inbound -Protocol TCP -LocalPort 3389 -RemoteAddress 10.0.99.0/24 -Action Allow -Profile Domain
Disable-NetFirewallRule -DisplayGroup "Bureau à distance"           # retirer la règle intégrée ouverte à tous

# Groupes de règles intégrés (noms localisés) : activer pour une source restreinte
Get-NetFirewallRule -DisplayGroup "Gestion à distance de Windows" | Set-NetFirewallRule -RemoteAddress 10.0.99.0/24
Enable-NetFirewallRule -DisplayGroup "Gestion à distance de Windows"

# SNMP entrant depuis les serveurs de supervision
New-NetFirewallRule -DisplayName "SNMP supervision" -Direction Inbound -Protocol UDP -LocalPort 161 -RemoteAddress 10.0.98.10,10.0.98.11 -Action Allow

# Bloquer SMB entrant sur les postes (mouvements latéraux)
New-NetFirewallRule -DisplayName "Bloquer SMB entrant (postes)" -Direction Inbound -Protocol TCP -LocalPort 445 -Action Block -Profile Any

Get-NetFirewallRule -Enabled True -Direction Inbound | Get-NetFirewallPortFilter | Where-Object LocalPort -eq 3389
Show-NetFirewallRule | Out-File C:\Temp\regles.txt
```

Alternatives : `netsh advfirewall firewall add rule name="Web HTTPS" dir=in action=allow protocol=TCP localport=443` (scripts anciens), console **`wf.msc`**.

## Règles minimales d'un serveur

| Flux | Source autorisée |
| --- | --- |
| Service applicatif (ex. 443, 1433) | Réseaux clients / serveurs applicatifs |
| RDP 3389, WinRM 5985/5986, SMB d'administration 445, RPC/WMI | **Réseau d'administration** / bastion seulement |
| Supervision (SNMP 161, agents) | Serveurs de supervision |
| Sauvegarde (ports de l'agent) | Serveurs de sauvegarde |
| ICMP écho | Réseaux internes (diagnostic) |
| Tout le reste | Bloqué (défaut) |

## Filtrage sortant

Le blocage sortant par défaut est rarement appliqué sur les postes (trop d'exceptions), mais il est **très efficace sur les serveurs** : un serveur qui ne peut pas joindre Internet ne peut pas télécharger d'outils ni contacter un serveur de commande.

```powershell
Set-NetFirewallProfile -Profile Domain -DefaultOutboundAction Block
New-NetFirewallRule -DisplayName "Sortant DNS" -Direction Outbound -Protocol UDP -RemotePort 53 -RemoteAddress 10.0.10.53,10.0.10.54 -Action Allow
New-NetFirewallRule -DisplayName "Sortant AD" -Direction Outbound -RemoteAddress 10.0.10.0/27 -Action Allow   # contrôleurs de domaine
New-NetFirewallRule -DisplayName "Sortant WSUS/proxy" -Direction Outbound -Protocol TCP -RemotePort 8531,3128 -RemoteAddress 10.0.10.80,10.0.10.81 -Action Allow
```

Testez en **mode audit** (journalisation des paquets bloqués) avant de bloquer, sur une préproduction représentative.

Suite : [[02-gpo-ipsec-journalisation|GPO, IPsec, journalisation et dépannage]].
