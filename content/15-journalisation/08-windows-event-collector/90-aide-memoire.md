---
title: Windows Event Collector (WEF) — aide-mémoire des commandes
description: Commandes du transfert d'événements Windows avec exemples — configuration du collecteur (wecutil qc, abonnements initiés par la source, XML d'abonnement, filtres XPath), GPO des sources (SubscriptionManager, droits du Service Réseau sur le journal Sécurité), suivi (wecutil gr, es, rs), WinRM, journal ForwardedEvents, requêtes Get-WinEvent et wevtutil, dépannage.
tags: [aide-mémoire, wef, wec, wecutil, wevtutil, get-winevent, windows]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-configuration|Windows Event Collector]].

## Collecteur

```powershell
wecutil qc /q                                   # configurer le service Windows Event Collector
wecutil es                                       # lister les abonnements
wecutil gs "Securite-Serveurs"                   # configuration d'un abonnement
wecutil gr "Securite-Serveurs"                   # état d'exécution et sources
wecutil cs C:\WEF\securite-serveurs.xml          # créer depuis un fichier XML
wecutil ss "Securite-Serveurs" /e:true           # activer
wecutil rs "Securite-Serveurs"                   # réessayer les sources en échec
wecutil ds "Ancien-Abonnement"                   # supprimer
wevtutil sl ForwardedEvents /ms:4294967296       # taille du journal ForwardedEvents (4 Go)
```

```xml
<Subscription xmlns="http://schemas.microsoft.com/2006/03/windows/events/subscription">
  <SubscriptionId>Securite-Serveurs</SubscriptionId>
  <SubscriptionType>SourceInitiated</SubscriptionType>
  <Description>Événements de sécurité des serveurs</Description>
  <Enabled>true</Enabled>
  <Uri>http://schemas.microsoft.com/wbem/wsman/1/windows/EventLog</Uri>
  <ConfigurationMode>MinLatency</ConfigurationMode>
  <Query><![CDATA[
    <QueryList><Query Id="0">
      <Select Path="Security">*[System[(EventID=4624 or EventID=4625 or EventID=4672 or EventID=4720 or EventID=4728 or EventID=4740)]]</Select>
      <Select Path="System">*[System[(EventID=7045)]]</Select>
    </Query></QueryList>]]></Query>
  <ReadExistingEvents>false</ReadExistingEvents>
  <TransportName>HTTP</TransportName>
  <ContentFormat>RenderedText</ContentFormat>
  <LogFile>ForwardedEvents</LogFile>
  <AllowedSourceDomainComputers>O:NSG:BAD:P(A;;GA;;;DC)(A;;GA;;;DD)S:</AllowedSourceDomainComputers>
</Subscription>
```

## Sources (GPO)

- *Configuration ordinateur → Modèles d'administration → Composants Windows → Transfert d'événements → Configurer le gestionnaire d'abonnements cible* : `Server=http://wec01.corp.exemple.fr:5985/wsman/SubscriptionManager/WEC,Refresh=60`
- Donner au **Service Réseau** la lecture du journal Sécurité : ajouter le compte au groupe « Lecteurs des journaux d'événements » ou modifier la SDDL du canal.

```powershell
winrm quickconfig -q                              # sur les sources (ou par GPO)
wevtutil gl Security | Select-String channelAccess
Get-WinEvent -LogName "Microsoft-Windows-Forwarding/Operational" -MaxEvents 10      # côté source
```

## Interroger les événements

```powershell
Get-WinEvent -LogName ForwardedEvents -MaxEvents 20 | Format-Table TimeCreated, MachineName, Id, Message -Wrap
Get-WinEvent -FilterHashtable @{LogName="ForwardedEvents"; Id=4625; StartTime=(Get-Date).AddHours(-1)} | Group-Object MachineName | Sort-Object Count -Descending
Get-WinEvent -LogName Security -FilterXPath "*[System[EventID=4740]]" -MaxEvents 5       # comptes verrouillés
wevtutil qe ForwardedEvents /c:5 /rd:true /f:text
wevtutil epl ForwardedEvents C:\Temp\forwarded.evtx                                      # exporter
```

| Événement | Sens |
| --- | --- |
| 4624 / 4625 | Connexion réussie / échouée |
| 4672 | Connexion avec privilèges spéciaux |
| 4720 / 4726 | Compte créé / supprimé |
| 4728 / 4732 | Ajout à un groupe global / local de sécurité |
| 4740 | Compte verrouillé |
| 7045 | Nouveau service installé |
| 1102 | Journal de sécurité effacé |
