---
title: DNSSEC, sécurité, journaux et dépannage
description: Signer une zone DNSSEC sur Windows Server (maître des clés, KSK/ZSK, NSEC3, ancres d'approbation, renouvellement automatique), valider côté résolveur, durcir le service DNS (pool de sockets, verrouillage du cache, Admins DNS, mises à jour sécurisées, DoH client), journaux de débogage et analytiques, supervision et problèmes fréquents.
tags: [windows server, dns, dnssec, sécurité, cache locking, socket pool, journaux, dépannage]
icon: shield-check
---

## DNSSEC

```powershell
# Signer une zone avec les paramètres par défaut (RSA/SHA-256, NSEC3, renouvellement automatique)
Invoke-DnsServerZoneSign -ZoneName "exemple.fr" -SignWithDefault -PassThru -Verbose

# Paramètres personnalisés : ECDSA P-256
Add-DnsServerSigningKey -ZoneName "dmz.exemple.fr" -Type KeySigningKey  -CryptoAlgorithm ECDsaP256Sha256 -KeyLength 256
Add-DnsServerSigningKey -ZoneName "dmz.exemple.fr" -Type ZoneSigningKey -CryptoAlgorithm ECDsaP256Sha256 -KeyLength 256
Invoke-DnsServerZoneSign -ZoneName "dmz.exemple.fr" -Force

Get-DnsServerDnsSecZoneSetting -ZoneName "exemple.fr"
Get-DnsServerSigningKey -ZoneName "exemple.fr"
Get-DnsServerResourceRecord -ZoneName "exemple.fr" -RRType DnsKey
```

| Notion | Windows |
| --- | --- |
| **Maître des clés** (*Key Master*) | Serveur qui génère et renouvelle les clés de la zone (un par zone) ; transférable (`Reset-DnsServerZoneKeyMasterRole`) |
| KSK / ZSK | Renouvellement automatique configurable (ZSK ~90 jours, KSK ~1 an) |
| NSEC3 | Par défaut (limite l'énumération de zone) |
| Ancres d'approbation | Distribuées automatiquement aux DC DNS de la forêt (zones intégrées) |
| Délégation publique | Publier l'enregistrement **DS** (dans `dsset-<zone>`) chez le registre de la zone parente |

**Côté résolveur** : la validation DNSSEC des réponses externes est active par défaut sur les serveurs DNS récents (`Get-DnsServerDnsSecZoneSetting`, `Set-DnsServerSetting -EnableDnsSec`). Les clients Windows ne valident pas eux-mêmes : la table **NRPT** (GPO) peut exiger la validation pour certains espaces de noms. Pour la théorie et la comparaison avec BIND, voir [[01-bind9/07-dnssec|DNSSEC avec BIND]].

## Durcissement

| Mesure | Commande / emplacement |
| --- | --- |
| **Pool de sockets** (ports source aléatoires contre l'empoisonnement) | `dnscmd /config /socketpoolsize 10000` (défaut 2500) |
| **Verrouillage du cache** (empêche l'écrasement avant expiration du TTL) | `Set-DnsServerCache -LockingPercent 100` |
| Protection contre la pollution du cache | `Set-DnsServerCache -PollutionProtection $true` (défaut) |
| Mises à jour dynamiques **sécurisées uniquement** | `Set-DnsServerPrimaryZone -Name corp.exemple.fr -DynamicUpdate Secure` |
| Délégation d'administration | Groupe **DnsAdmins** vide ou très restreint (un membre peut charger une DLL dans le service DNS des DC : élévation vers le domaine) |
| Liste de blocage des requêtes globales | `Get-DnsServerGlobalQueryBlockList` (wpad, isatap bloqués par défaut) |
| Transferts | Limités aux secondaires déclarés |
| RRL | Sur les serveurs autoritaires exposés |

Les **clients** Windows 11 / Server 2022+ prennent en charge **DNS sur HTTPS** (DoH) vers des résolveurs déclarés (`Add-DnsClientDohServerAddress`, GPO *Configurer DNS sur HTTPS*). Le serveur DNS de Windows Server 2025 ajoute un service DoH (en préversion selon les versions) ; sinon, placez un résolveur compatible devant les clients.

## Journaux

| Journal | Usage |
| --- | --- |
| *Journaux des applications et des services → DNS Server* | Événements du service (zones, transferts, erreurs) |
| **Analytique** `Microsoft-Windows-DNSServer/Analytical` | Chaque requête et réponse, faible impact : base pour le SIEM (à activer) |
| `Microsoft-Windows-DNSServer/Audit` | Modifications de zones, d'enregistrements, de paramètres |
| Journal de débogage (`dns.log`) | Paquets détaillés, impact sur les performances : temporaire |

```powershell
# Activer le journal analytique (taille en octets)
wevtutil sl "Microsoft-Windows-DNSServer/Analytical" /e:true /ms:536870912 /q:true
# Journal de débogage ciblé
Set-DnsServerDiagnostics -Queries $true -Answers $true -ReceivePackets $true -SendPackets $true -UdpPackets $true -TcpPackets $true -LogFilePath "D:\Logs\dns.log" -MaxMBFileSize 500
Set-DnsServerDiagnostics -All $false      # désactiver après analyse
```

Le journal analytique alimente utilement un SIEM ([[01-rsyslog/01-presentation-installation|collecte]], [[05-wazuh/01-presentation-installation|Wazuh]], Splunk) pour détecter tunnels DNS, domaines malveillants et machines compromises.

## Supervision

| Contrôle | Méthode |
| --- | --- |
| Service et résolution | `Resolve-DnsName www.exemple.fr -Server 10.0.10.53` dans la sonde |
| Statistiques | `Get-DnsServerStatistics` (requêtes, échecs, récursions) |
| Zones et transferts | Événements 6001/6004 (transferts), numéros de série des secondaires |
| DNSSEC | Expiration des signatures, renouvellement des clés (événements DNSSEC) |

## Commandes de diagnostic

```powershell
Resolve-DnsName exemple.fr -Type SOA -Server 10.0.10.53
Resolve-DnsName www.exemple.fr -DnssecOk -Server 10.0.10.53
Test-DnsServer -IPAddress 10.0.10.53 -ZoneName exemple.fr
Clear-DnsServerCache -Force
Show-DnsServerCache | Where-Object HostName -like "*exemple*"
dcdiag /test:dns /v              # contrôleurs de domaine
nslookup -type=SRV _ldap._tcp.dc._msdcs.corp.exemple.fr
```

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Secondaire non mis à jour | Transfert refusé, notification absente, numéro de série | `SecureSecondaries`, `NotifyServers`, comparer les SOA |
| Résolution externe lente | Redirecteurs injoignables, indications de racine bloquées | `Get-DnsServerForwarder`, délai, filtrage 53 sortant |
| `SERVFAIL` sur un domaine externe | Échec de validation DNSSEC (domaine mal signé) | Vérifier avec un validateur externe ; ancre négative si besoin |
| Enregistrements en double / obsolètes | Nettoyage non configuré | Vieillissement et nettoyage (voir DNS intégré à AD) |
| Stratégie sans effet | Ordre de traitement, sous-réseau client | `Get-DnsServerQueryResolutionPolicy`, `-ProcessingOrder` |
| Serveur utilisé pour une amplification | Récursivité ouverte vers Internet | Désactiver la récursivité sur l'interface externe, RRL |
