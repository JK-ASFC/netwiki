---
title: DNS intégré à Active Directory
description: Zones intégrées à AD et étendues de réplication, configuration DNS des contrôleurs et des clients, mises à jour dynamiques sécurisées, redirecteurs et redirecteurs conditionnels, zones inverses, vieillissement et nettoyage, enregistrements SRV, coexistence avec BIND et commandes PowerShell DnsServer.
tags: [active directory, dns, zones intégrées, scavenging, redirecteurs, srv, windows dns]
icon: globe
---

## Zones intégrées à Active Directory

Une zone **intégrée à AD** est stockée dans l'annuaire et répliquée avec lui (réplication **multi-maître** : chaque DC DNS peut la modifier). Avantages : pas de transfert de zone à gérer, mises à jour dynamiques **sécurisées** (Kerberos), tolérance de panne.

| Étendue de réplication | Partition | Contenu typique |
| --- | --- | --- |
| Tous les serveurs DNS de la **forêt** | ForestDnsZones | `_msdcs.corp.exemple.fr` (enregistrements de localisation de toute la forêt) |
| Tous les serveurs DNS du **domaine** | DomainDnsZones | `corp.exemple.fr` (recommandé) |
| Tous les DC du domaine | Domain | Compatibilité Windows 2000 |
| Partition d'application personnalisée | Au choix | Répliquer une zone vers un sous-ensemble de DC |

```powershell
Get-DnsServerZone | Format-Table ZoneName, ZoneType, IsDsIntegrated, ReplicationScope, DynamicUpdate, IsReverseLookupZone
```

## Configuration DNS des contrôleurs de domaine

> [!IMPORTANT]
> Recommandation Microsoft : sur chaque DC, **premier serveur DNS = un autre DC**, puis **lui-même en loopback (`127.0.0.1`) en dernier**. Un DC qui ne pointe que sur lui-même peut, au démarrage, attendre indéfiniment sa propre zone (« îlot DNS ») ; un DC qui ne pointe que sur un autre dépend entièrement de celui-ci.

```powershell
# DC01 (10.0.10.11)
Set-DnsClientServerAddress -InterfaceAlias Ethernet -ServerAddresses 10.0.10.12,127.0.0.1
# DC02 (10.0.10.12)
Set-DnsClientServerAddress -InterfaceAlias Ethernet -ServerAddresses 10.0.10.11,127.0.0.1
```

- Jamais de DNS **public** (FAI, 8.8.8.8) dans la configuration d'un DC ou d'un poste du domaine : les enregistrements SRV internes seraient introuvables par intermittence.
- Les **clients** reçoivent les DC/DNS internes par DHCP (option 6, voir [[01-isc-dhcp/03-configuration-base|ISC DHCP]]).

## Mises à jour dynamiques

| Mode | Effet |
| --- | --- |
| **Sécurisé uniquement** | Seuls les ordinateurs authentifiés du domaine peuvent créer/modifier leur enregistrement ; le propriétaire est inscrit dans l'ACL de l'enregistrement (**recommandé**) |
| Non sécurisé et sécurisé | N'importe qui peut écrire (dangereux) |
| Aucun | Enregistrements statiques uniquement |

```powershell
Set-DnsServerPrimaryZone -Name "corp.exemple.fr" -DynamicUpdate Secure
```

Le service **Netlogon** de chaque DC enregistre ses SRV (et le fichier `%SystemRoot%\System32\Config\netlogon.dns` contient la liste attendue). Pour les forcer : `nltest /dsregdns` ou `ipconfig /registerdns` + redémarrage de Netlogon.

### DHCP Windows et mises à jour au nom des clients

Si le DHCP Windows enregistre les clients non-Windows, configurez des **identifiants DNS dédiés** sur le serveur DHCP (compte utilisateur sans privilège) et ajoutez le serveur DHCP au groupe `DnsUpdateProxy` avec précaution (les enregistrements créés n'ont alors pas de propriétaire sécurisé).

## Redirecteurs

```powershell
# Redirecteurs globaux (résolveurs internes ou du FAI) — sinon indications de racine
Set-DnsServerForwarder -IPAddress 10.0.10.53, 10.0.10.54 -UseRootHint $true -Timeout 3

# Redirecteur conditionnel répliqué dans AD (vers un partenaire ou un DNS BIND interne)
Add-DnsServerConditionalForwarderZone -Name "partenaire.lan" -MasterServers 172.20.0.53 -ReplicationScope Forest
Add-DnsServerConditionalForwarderZone -Name "dmz.exemple.fr" -MasterServers 10.0.20.53, 10.0.20.54 -ReplicationScope Domain

Get-DnsServerForwarder
Get-DnsServerZone | Where-Object ZoneType -eq Forwarder
```

> [!TIP]
> Architecture fréquente : les DC sont autoritaires pour la zone AD et **redirigent** tout le reste vers des résolveurs [[01-bind9/03-cache-recursif-forwarders|BIND]] (qui filtrent avec une RPZ et valident DNSSEC) ; inversement, les BIND ont une **zone forward** vers les DC pour `corp.exemple.fr`.

## Zones inverses

```powershell
Add-DnsServerPrimaryZone -NetworkId "10.0.40.0/24" -ReplicationScope Domain -DynamicUpdate Secure
Add-DnsServerPrimaryZone -NetworkId "10.0.0.0/16" -ReplicationScope Domain       # zone 0.10.in-addr.arpa
Add-DnsServerResourceRecordPtr -ZoneName "40.0.10.in-addr.arpa" -Name "10" -PtrDomainName "srv-impression.corp.exemple.fr"
```

## Enregistrements statiques

```powershell
Add-DnsServerResourceRecordA -ZoneName corp.exemple.fr -Name intranet -IPv4Address 10.0.20.15 -CreatePtr
Add-DnsServerResourceRecordCName -ZoneName corp.exemple.fr -Name wiki -HostNameAlias intranet.corp.exemple.fr
Add-DnsServerResourceRecord -ZoneName corp.exemple.fr -Name "@" -MX -MailExchange mail.corp.exemple.fr -Preference 10
Add-DnsServerResourceRecord -ZoneName corp.exemple.fr -Name "_sip._tls" -Srv -DomainName sip.corp.exemple.fr -Priority 10 -Weight 100 -Port 5061
Remove-DnsServerResourceRecord -ZoneName corp.exemple.fr -Name test -RRType A -Force
Get-DnsServerResourceRecord -ZoneName corp.exemple.fr -RRType A | Sort-Object HostName
```

## Vieillissement et nettoyage (aging / scavenging)

Sans nettoyage, les enregistrements dynamiques des postes disparus restent indéfiniment (doublons IP ↔ nom, erreurs d'administration à distance).

| Paramètre | Rôle | Valeur courante |
| --- | --- | --- |
| **No-Refresh interval** | Période pendant laquelle un enregistrement n'est **pas** rafraîchi (limite la réplication) | 7 jours |
| **Refresh interval** | Période pendant laquelle l'enregistrement doit être rafraîchi | 7 jours (≥ durée du bail DHCP) |
| **Scavenging period** | Fréquence du nettoyage par le serveur | 7 jours |

Un enregistrement non rafraîchi depuis *No-Refresh + Refresh* est supprimé au nettoyage suivant.

```powershell
# Sur la zone
Set-DnsServerZoneAging -Name corp.exemple.fr -Aging $true -NoRefreshInterval 7.00:00:00 -RefreshInterval 7.00:00:00
Set-DnsServerZoneAging -Name 40.0.10.in-addr.arpa -Aging $true -NoRefreshInterval 7.00:00:00 -RefreshInterval 7.00:00:00
# Sur UN SEUL serveur (évite les nettoyages concurrents), éventuellement restreint
Set-DnsServerScavenging -ScavengingState $true -ScavengingInterval 7.00:00:00 -ApplyOnAllZones
Set-DnsServerZoneAging -Name corp.exemple.fr -ScavengeServers 10.0.10.11
Start-DnsServerScavenging -Force          # déclenchement manuel
```

> [!WARNING]
> Activez le nettoyage **après** avoir vérifié que les enregistrements statiques importants n'ont pas d'horodatage (un enregistrement créé dynamiquement puis « rendu statique » doit avoir sa case *Supprimer cet enregistrement quand il devient obsolète* décochée). Simulez d'abord en listant les enregistrements dont le `TimeStamp` est ancien.

```powershell
Get-DnsServerResourceRecord -ZoneName corp.exemple.fr | Where-Object { $_.TimeStamp -and $_.TimeStamp -lt (Get-Date).AddDays(-14) } |
  Select-Object HostName, RecordType, TimeStamp
```

## Délégation de la zone AD depuis un DNS parent

Si `exemple.fr` est géré par BIND et que l'AD utilise `corp.exemple.fr`, deux options :

1. **Délégation** dans la zone `exemple.fr` : enregistrements NS `corp` → `dc01.corp.exemple.fr`, `dc02.corp.exemple.fr` + colle (A). Les résolveurs suivent la délégation.
2. **Redirection conditionnelle** sur les résolveurs internes (plus simple, garde la zone AD invisible de l'extérieur).

## Paramètres de sécurité du serveur DNS Windows

```powershell
# Masquer la récursion pour les serveurs exposés, limiter la taille du cache, RRL (2016+)
Set-DnsServerRecursion -Enable $true -SecureResponse $true
Set-DnsServerCache -MaxKBSize 102400 -LockingPercent 100
Set-DnsServerResponseRateLimiting -Mode Enable -ResponsesPerSec 10 -ErrorsPerSec 5 -WindowInSec 5
# Politiques DNS (2016+) : filtrage, split-brain, répartition géographique
Add-DnsServerQueryResolutionPolicy -Name "Bloquer-malware" -Action IGNORE -FQDN "EQ,*.malware.example"
# Journal analytique (diagnostic des requêtes)
Set-DnsServerDiagnostics -All $true            # temporairement : volumineux
```

## Vérification

```powershell
dcdiag /test:dns /v /e                         # santé DNS de tous les DC (délégations, SRV, redirecteurs)
Resolve-DnsName -Type SRV _ldap._tcp.dc._msdcs.corp.exemple.fr
Resolve-DnsName -Type SRV _kerberos._tcp.Paris._sites.corp.exemple.fr
nslookup -type=SRV _gc._tcp.corp.exemple.fr
Test-DnsServer -IPAddress 10.0.10.11 -ZoneName corp.exemple.fr
Clear-DnsServerCache -Force ; Clear-DnsClientCache
```
