---
title: Présentation, déploiement et utilisation d'IPAM
description: Gestion des adresses IP (IPAM) de Windows Server — fonctions (inventaire des espaces d'adresses, gestion centralisée des serveurs DHCP et DNS, suivi des adresses par utilisateur et appareil, audit), limites, provisionnement par GPO ou manuel, découverte des serveurs, base WID ou SQL, blocs, plages et sous-réseaux, alertes d'utilisation, rôles d'accès, recherche d'adresses, comparaison avec NetBox et dépannage.
tags: [ipam, gestion des adresses ip, windows server, dhcp, dns, gpo, netbox, audit]
icon: list-tree
---

**IPAM** (*IP Address Management*) de Windows Server centralise la **gestion des adresses** d'un environnement Microsoft : il découvre les serveurs **DHCP**, **DNS** et contrôleurs de domaine, collecte étendues, baux et zones, calcule l'occupation des sous-réseaux et conserve un **historique** des attributions (qui avait quelle adresse, quand).

| Fonction | Détail |
| --- | --- |
| Espaces d'adresses | Blocs → sous-réseaux → plages → adresses, IPv4 et IPv6, avec champs personnalisés (site, VLAN, usage) |
| Gestion DHCP | Étendues, options, réservations, stratégies, basculement sur plusieurs serveurs à la fois |
| Gestion DNS | Zones et enregistrements, redirecteurs conditionnels |
| Suivi des adresses | Recherche par adresse IP, MAC, nom d'hôte ou **utilisateur** (corrélation baux DHCP + ouvertures de session sur les DC/NPS) |
| Audit | Modifications de configuration DHCP/DNS/IPAM, historique des baux |

**Limites** : périmètre Microsoft (pas de découverte des équipements réseau ni des serveurs DHCP/DNS non Windows), interface vieillissante, développement figé. Pour une **source de vérité** réseau complète (VLAN, équipements, câblage, automatisation), un outil comme **NetBox** est plus adapté ; IPAM reste utile pour piloter un parc DHCP/DNS Windows et pour l'audit des adresses.

## Prérequis

- Serveur membre dédié (pas un contrôleur de domaine), Windows Server, même forêt que les serveurs gérés
- Base **WID** (petits parcs) ou **SQL Server** (rétention longue, gros volumes)
- Accès aux serveurs gérés : RPC/WMI, journaux d'événements (pare-feu), partages `ADMIN$` selon les fonctions

## Installation et provisionnement

```powershell
Install-WindowsFeature IPAM -IncludeManagementTools

# Provisionnement par GPO : crée les GPO qui ouvrent l'accès sur les serveurs DHCP, DNS et DC
Invoke-IpamGpoProvisioning -Domain corp.exemple.fr -GpoPrefixName IPAM -IpamServerFqdn srv-ipam-01.corp.exemple.fr -DelegatedGpoUser "CORP\GG-Admins-IPAM"
# → GPO IPAM_DHCP, IPAM_DNS, IPAM_DC_NPS, à lier au domaine (filtrées automatiquement sur les serveurs gérés)
```

Étapes dans la console (*Gestionnaire de serveur → IPAM*) :

1. **Provisionner le serveur IPAM** (base, méthode GPO).
2. **Configurer la découverte** : domaines et types de serveurs.
3. **Démarrer la découverte**, puis dans l'inventaire passer chaque serveur à l'état de gestion **Géré**.
4. Attendre l'application des GPO (`gpupdate /force` sur les serveurs gérés) : l'état d'accès doit devenir *Débloqué*.
5. **Récupérer les données des serveurs** (tâche planifiée).

## Espaces d'adresses

```powershell
Add-IpamBlock -NetworkId 10.0.0.0/8 -Description "Interne"
Add-IpamSubnet -NetworkId 10.0.40.0/24 -Name "Paris-VLAN40-Utilisateurs" -VlanId 40 -CustomConfiguration "Site=Paris"
Add-IpamRange -NetworkId 10.0.40.0/24 -StartIPAddress 10.0.40.20 -EndIPAddress 10.0.40.250 -ManagedByService "MS DHCP" -ServiceInstance srv-dhcp-01.corp.exemple.fr
Add-IpamAddress -IpAddress 10.0.40.5 -DeviceName "imp-rdc-01" -DeviceType "Printer" -AssignmentType Static -ManagedByService "IPAM"

Get-IpamSubnet -AddressFamily IPv4 | Sort-Object PercentageUtilized -Descending | Select-Object -First 10 NetworkId, Name, PercentageUtilized
Find-IpamFreeAddress -RangeNetworkId 10.0.40.0/24 -NumAddress 3
```

**Seuils d'utilisation** (*Paramètres → Configurer le seuil d'utilisation*) : alertes visuelles quand un sous-réseau dépasse par exemple 80 %.

## Rôles d'accès

Rôles intégrés : *Administrateur IPAM*, *Administrateur DHCP IPAM*, *Administrateur des enregistrements DNS IPAM*, *Administrateur de l'espace d'adresses IP*… attribuables par **étendue d'accès** (ex. un site), pour déléguer la gestion DHCP d'un site sans donner de droits d'administrateur sur les serveurs.

## Suivi des adresses (audit)

*Surveiller et gérer → Suivi des adresses IP* : recherche par adresse, MAC, nom ou utilisateur sur une période. Nécessite la collecte des événements des **DC et NPS** (GPO `IPAM_DC_NPS`) et de l'audit DHCP. Réponse type à une demande d'enquête : « quel utilisateur utilisait 10.0.40.87 le 14 octobre à 10 h 32 ».

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| État d'accès *Bloqué* | GPO non appliquées, pare-feu | `gpresult /r` sur le serveur géré, liaison des GPO IPAM, règles de pare-feu |
| Serveurs non découverts | Découverte limitée au domaine choisi, rôle non détecté | Configurer la découverte, ajouter le serveur manuellement |
| Données DHCP/DNS anciennes | Tâches de récupération en échec | *Planificateur de tâches → Microsoft → Windows → IPAM* |
| Suivi par utilisateur vide | Événements DC/NPS non collectés | GPO `IPAM_DC_NPS`, groupe *Lecteurs des journaux d'événements* |
| Console lente | Base WID volumineuse | Rétention plus courte, migration vers SQL Server (`Move-IpamDatabase`) |
