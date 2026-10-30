---
title: GPO, IPsec, journalisation et dépannage
description: Déployer le pare-feu Windows à l'échelle — GPO (fusion des règles locales, magasins de stratégie, règles par rôle), règles de sécurité de connexion IPsec (authentification Kerberos ou certificats, isolation de serveurs et de domaine, chiffrement), journalisation des paquets et audit de la plateforme de filtrage (5152, 5157), outils de diagnostic (Test-NetConnection, pktmon, netsh wfp) et problèmes fréquents.
tags: [pare-feu windows, gpo, ipsec, isolation, journalisation, wfp, pktmon, dépannage]
icon: settings-2
---

## Déploiement par GPO

*Configuration ordinateur → Stratégies → Paramètres Windows → Paramètres de sécurité → Pare-feu Windows Defender avec fonctions avancées de sécurité* :

| Réglage | Recommandation |
| --- | --- |
| État du pare-feu par profil | **Activé**, entrant *Bloquer*, sortant *Autoriser* (ou *Bloquer* sur les serveurs, voir l'article précédent) |
| **Fusion des règles locales** | **Non** sur les serveurs et postes gérés : seules les règles de la GPO s'appliquent (un administrateur local ou un logiciel ne peut pas ouvrir de port) |
| Fusion des règles de sécurité de connexion | Non |
| Notifications | Désactivées |
| Journalisation | Paquets rejetés, taille 16–32 Mo |

Organisation : une GPO **socle** (règles communes : administration depuis le bastion, supervision) liée au domaine ou aux OU, puis une GPO **par rôle** (serveurs web, SQL, fichiers, contrôleurs de domaine) liée à l'OU correspondante.

```powershell
# Gérer les règles d'une GPO directement en PowerShell
$gpo = "corp.exemple.fr\PF-Serveurs-Web"
New-NetFirewallRule -PolicyStore $gpo -DisplayName "Web HTTPS" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow
Get-NetFirewallRule -PolicyStore $gpo
# Règles effectivement appliquées sur une machine (local + GPO)
Get-NetFirewallRule -PolicyStore ActiveStore | Where-Object Enabled -eq True | Measure-Object
```

> [!WARNING]
> Avant de désactiver la fusion des règles locales, recensez les règles créées par les applications (agents de sauvegarde, de supervision, SQL Server, Hyper-V) et reprenez-les dans la GPO : sinon ces services deviennent injoignables.

## IPsec : règles de sécurité de connexion

Les **règles de sécurité de connexion** authentifient (et peuvent chiffrer) le trafic entre machines avec **IPsec**, en utilisant **Kerberos** (comptes d'ordinateur du domaine) ou des certificats. Les règles de pare-feu peuvent ensuite autoriser un flux **seulement s'il est authentifié**, éventuellement pour certains ordinateurs ou utilisateurs.

| Scénario | Principe |
| --- | --- |
| **Isolation de domaine** | Les machines du domaine n'acceptent que du trafic authentifié par des machines du domaine |
| **Isolation de serveurs** | Un serveur sensible (SQL RH) n'accepte que les ordinateurs d'un groupe AD (serveurs applicatifs RH) |
| Chiffrement | Protection de flux non chiffrés nativement (anciens protocoles) sur le réseau interne |
| Exemptions | Contrôleurs de domaine, DHCP, DNS (nécessaires avant l'authentification) |

```powershell
# Exiger l'authentification Kerberos ordinateur pour le trafic entrant vers le serveur SQL
New-NetIPsecRule -DisplayName "IPsec SQL RH" -InboundSecurity Require -OutboundSecurity Request -Phase1AuthSet ComputerKerberos -LocalAddress 10.0.20.40 -Protocol TCP -LocalPort 1433

# Autoriser 1433 uniquement si la connexion est authentifiée et provient du groupe d'ordinateurs autorisé
$sddl = (New-Object System.Security.Principal.NTAccount "CORP\GG-Serveurs-App-RH").Translate([System.Security.Principal.SecurityIdentifier]).Value
New-NetFirewallRule -DisplayName "SQL RH (authentifié)" -Direction Inbound -Protocol TCP -LocalPort 1433 -Action Allow `
  -Authentication Required -Encryption Dynamic -RemoteMachine "O:LSD:(A;;CC;;;$sddl)"

Get-NetIPsecMainModeSA; Get-NetIPsecQuickModeSA
```

Commencez en mode **Request** (authentification demandée mais non exigée), vérifiez les associations de sécurité, puis passez en **Require**. Le chiffrement IPsec a un coût CPU et complique le diagnostic réseau (paquets ESP).

## Journalisation

```powershell
Set-NetFirewallProfile -Profile Domain,Private,Public -LogBlocked True -LogAllowed False -LogMaxSizeKilobytes 32767 -LogFileName "%SystemRoot%\System32\LogFiles\Firewall\pfirewall.log"
Get-Content "$env:SystemRoot\System32\LogFiles\Firewall\pfirewall.log" -Tail 30
```

| Source | Contenu |
| --- | --- |
| `pfirewall.log` | Paquets rejetés/autorisés (date, action, protocole, adresses, ports) |
| Audit **Plateforme de filtrage** (journal Sécurité) | **5152** (paquet bloqué), **5157** (connexion bloquée), 5156 (autorisée — volumineux) ; `auditpol /set /subcategory:"Connexion de la plateforme de filtrage" /failure:enable` |
| *Microsoft-Windows-Windows Firewall With Advanced Security/Firewall* | Modifications de règles et de profils (2004, 2005, 2006, 2033…) |

Envoyez les modifications de règles et les blocages d'intérêt au SIEM : un ajout de règle autorisant un port inhabituel est un signal d'attaque.

## Diagnostic

```powershell
Test-NetConnection srv-sql-01 -Port 1433                     # depuis le client
Get-NetTCPConnection -State Listen | Sort-Object LocalPort | Format-Table LocalAddress, LocalPort, OwningProcess
Get-NetFirewallRule -DisplayName "*SQL*" | Get-NetFirewallAddressFilter
pktmon filter add -p 1433; pktmon start --etw -c; pktmon stop; pktmon etl2txt PktMon.etl   # capture sur l'hôte
netsh wfp show state file=C:\Temp\wfpstate.xml             # état complet de la plateforme de filtrage
netsh wfp capture start; netsh wfp capture stop             # événements de filtrage détaillés
```

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Service injoignable malgré une règle | Mauvais profil actif (Public), règle de blocage prioritaire, fusion locale désactivée | `Get-NetConnectionProfile`, règles de blocage, `ActiveStore` |
| Règle locale sans effet | GPO avec *Fusion des règles locales : Non* | Ajouter la règle dans la GPO |
| RPC/WMI échoue alors que 135 est ouvert | Ports dynamiques RPC | Règle `-LocalPort RPC` (+ `RPCEPMap`), ou groupe intégré |
| Serveur en profil Public au démarrage | NLA a détecté le réseau avant que le DC soit joignable | DNS, ordre des services, redémarrer NLA ; règles aussi sur le profil Public pour les flux vitaux |
| IPsec : connexions qui échouent par intermittence | Kerberos (heure, SPN), exemptions manquantes, NAT | Mode Request, `Get-NetIPsecMainModeSA`, exemptions DC/DNS |
| Journal vide | Journalisation non activée ou droits du dossier | `LogBlocked True`, droits du service `MpsSvc` sur le dossier de journaux |
