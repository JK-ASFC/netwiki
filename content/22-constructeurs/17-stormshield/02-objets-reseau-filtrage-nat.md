---
title: Objets, réseau, filtrage et NAT (CLI et graphique)
description: Configuration de base d'un pare-feu Stormshield SNS en CLI (commandes CONFIG …) et dans l'interface web — objets machine, réseau, plage, port, plage de ports, routeur (passerelles principales et de secours), groupes, protocoles IP, groupes de ports, groupes de régions, objets temps ; interfaces (adresse statique ou DHCP, bridges), passerelle par défaut, routes statiques, serveurs DNS ; politiques et règles de filtrage et de NAT (dynamique, statique par port, statique) ; base LDAP interne et utilisateurs.
tags: [stormshield, sns, cli, objets, filtrage, nat, routage, ldap]
icon: shield
---

Les exemples CLI suivent la logique de la note technique Stormshield « Basic command line interface configurations » (SNS 3.x/4.x). Après chaque série de commandes, `… ACTIVATE` applique la section. Les noms d'objets et adresses sont des exemples à adapter.

## Objets

Interface web : *Configuration → Objets → Objets réseau*. En CLI, modifier un objet = la commande de création avec **`update=1`** ; supprimer = `DELETE … force=1`.

| Objet | CLI |
| --- | --- |
| **Machine** | `CONFIG OBJECT HOST NEW name=SRV_DNS comment="Serveur DNS" ip=10.0.10.53 resolve=static mac=""` |
| **Réseau** | `CONFIG OBJECT NETWORK NEW name=NET_VPN comment="Réseau VPN" ip=192.168.1.0 mask=255.255.255.0` |
| **Plage d'adresses** | `CONFIG OBJECT HOST NEW name=PLAGE_DHCP comment="Plage DHCP" begin=10.0.20.100 end=10.0.20.200` |
| **Port** | `CONFIG OBJECT SERVICE NEW name=PORT_APPLI comment="" port=2500 proto=TCP` |
| **Plage de ports** | `CONFIG OBJECT SERVICE NEW name=PLAGE_PORTS comment="" port=20000 toport=20500 proto=ANY` |
| **Groupe** | `CONFIG OBJECT GROUP NEW name=GRP_SRV comment="Serveurs"` puis `CONFIG OBJECT GROUP ADDTO group=GRP_SRV node=srv_web` |
| **Protocole IP** | `CONFIG OBJECT PROTOCOL NEW name=PROTO_200 comment="" protonumber=200` |
| **Groupe de ports** | `CONFIG OBJECT SERVICEGROUP NEW name=PORTS_WEB comment=""` puis `CONFIG OBJECT SERVICEGROUP ADDTO group=PORTS_WEB node=https` |
| **Groupe de régions** | `CONFIG OBJECT GEOGROUP NEW name=PAYS_PARTENAIRES comment=""` puis `CONFIG OBJECT GEOGROUP ADDTO group=PAYS_PARTENAIRES node=eu:it` |
| **Temps** | `CONFIG OBJECT TIME NEW name=heures_ouvrees comment="" time=09:00-18:00 weekday=1;2;3;4;5 yearday= date=` |

```sns
CONFIG OBJECT HOST NEW name=SRV_DNS comment="Serveur DNS" ip=10.0.10.53 resolve=static mac=""
CONFIG OBJECT NETWORK NEW name=NET_ADMIN comment="Réseau d'administration" ip=10.0.99.0 mask=255.255.255.0
CONFIG OBJECT ACTIVATE
CONFIG OBJECT HOST NEW name=SRV_DNS comment="Serveur DNS principal" ip=10.0.10.53 resolve=static mac="" update=1
CONFIG OBJECT ACTIVATE
CONFIG OBJECT HOST DELETE name=SRV_DNS force=1
```

### Objet routeur (passerelles multiples)

L'objet **routeur** regroupe des passerelles principales (répartition de charge) et de secours, avec tests de disponibilité :

```sns
CONFIG OBJECT ROUTER NEW name=ROUTEUR_INTERNET comment="" tries=3 wait=2 frequency=15 onfailpolicy=Pass gatewaythreshold=1 activateallbackup=Off loadbalancing=connhash
CONFIG OBJECT ROUTER GATEWAY ADD type=principalgateway name=ROUTEUR_INTERNET host=GW_FIBRE check="dns1.google.com" weight=1 monitor=icmp comment=""
CONFIG OBJECT ROUTER GATEWAY ADD type=backupgateway name=ROUTEUR_INTERNET host=GW_4G check="dns1.google.com" weight=1 monitor=icmp comment=""
CONFIG OBJECT ACTIVATE
```

Un objet routeur s'utilise comme passerelle par défaut ou dans une règle de filtrage (**routage par politique**), ce qui donne le basculement et la répartition entre liens Internet.

## Réseau

Les interfaces portent des noms par défaut : `out` (ethernet0), `in` (ethernet1), `dmz1`, `dmz2`… Interface web : *Configuration → Réseau → Interfaces / Routage / Paramètres réseau*.

```sns
# Adresse statique sur l'interface in
CONFIG NETWORK INTERFACE ADDRESS ADD ifname=ethernet1 address=10.0.10.254 mask=24 addressComment=
CONFIG NETWORK INTERFACE ACTIVATE
# Adresse DHCP sur l'interface out
CONFIG NETWORK INTERFACE ADDRESS ADD ifname=ethernet0 address=DHCP dhcpLeaseTime=0 requestDns=1
CONFIG NETWORK INTERFACE ACTIVATE
# Bridge regroupant in et dmz1
CONFIG NETWORK INTERFACE CREATE mtu=1500 name=BRIDGE_LAN interfaces=ethernet1,ethernet2 ifname=bridge1 address=10.0.5.254 mask=255.255.255.0 addressComment=
CONFIG NETWORK INTERFACE ACTIVATE
```

> [!TIP]
> Les **bridges** permettent d'insérer un pare-feu Stormshield dans un réseau existant **sans réadressage** (mode transparent) : les interfaces du bridge partagent le même plan d'adressage tout en étant filtrées entre elles. Avant de supprimer un bridge, retirer ses interfaces (en leur réattribuant une adresse).

```sns
# Passerelle par défaut (objet machine ou routeur)
CONFIG NETWORK DEFAULTROUTE SET type=ipv4 name=ROUTEUR_INTERNET
CONFIG NETWORK DEFAULTROUTE ACTIVATE
# Route statique vers un réseau distant via une passerelle, par l'interface dmz2
CONFIG NETWORK ROUTE ADD State=1 Remote=NET_A Interface=dmz2 Gateway=FW_A Color=333399
CONFIG NETWORK ROUTE ACTIVATE
CONFIG NETWORK ROUTE REMOVE Remote=NET_A
CONFIG NETWORK ROUTE ACTIVATE
# Serveurs DNS utilisés par le pare-feu
CONFIG DNS SERVER ADD SRV_DNS
CONFIG DNS ACTIVATE
```

Le routage dynamique (OSPF, BGP) s'appuie sur le moteur Bird intégré (*Configuration → Réseau → Routage → Routage dynamique*).

## Politiques de filtrage et de NAT

SNS gère jusqu'à 10 **politiques** de filtrage/NAT (*slots*), une seule active à la fois : pratique pour préparer une nouvelle politique ou basculer en mode dégradé. Interface web : *Configuration → Politique de sécurité → Filtrage et NAT*.

```sns
# Activer la politique numéro 5
CONFIG SLOT ACTIVATE type=filter slot=5
```

### Règles de filtrage

```sns
# Ajouter une règle en tête de la politique 9 : réseaux internes vers Internet en HTTP, journalisation mineure
CONFIG FILTER RULE INSERT index=9 type=filter state=on action=pass srctarget=Network_internals dsttarget=internet dstport=http position=1 loglevel=minor
CONFIG FILTER ACTIVATE
# Modifier la règle : source in, ports http, https, ftp, ssh
CONFIG FILTER RULE UPDATE srctarget=Network_in srcif=in dstport=http,https,ftp,ssh index=9 global=0 type=filter position=1
CONFIG FILTER ACTIVATE
# Désactiver puis supprimer
CONFIG FILTER RULE UPDATE state=off index=9 global=0 type=filter position=1
CONFIG FILTER RULE REMOVE index=9 global=0 type=filter position=1
CONFIG FILTER ACTIVATE
```

Dans l'interface web, chaque règle définit : source (objets, utilisateurs, interface), destination, port/protocole, **action** (passer, bloquer, réinitialiser, déléguer), **inspection** (IPS, IDS, firewall seul), protections applicatives (antivirus, filtrage URL/SSL, sandboxing selon licence), journalisation, et éventuellement une **passerelle** (routage par politique).

### Règles de NAT

```sns
# NAT dynamique : sortie des réseaux internes vers Internet avec l'adresse de l'interface out
CONFIG FILTER RULE INSERT index=9 type=nat state=on action=nat srctarget=Network_in srcif=in dsttarget=internet dstif=out natsrctarget=Firewall_out natsrcport=ephemeral_fw natsrcportlb=random position=1
# NAT statique par port : publication du serveur web
CONFIG FILTER RULE INSERT index=9 type=nat state=on action=nat srctarget=internet srcif=out dsttarget=Firewall_out dstport=http natdsttarget=srv_web natdstport=http position=2 loglevel=minor
# NAT statique (bimap) : un serveur interne ↔ une adresse publique dédiée (avec publication ARP)
CONFIG FILTER RULE INSERT index=9 type=nat state=on action=nat srctarget=srv_ftp srcif=in dsttarget=internet dstif=out natsrctarget=srv_ftp_pub natsrcarp=on natsrcport=any position=3
CONFIG FILTER RULE INSERT index=9 type=nat state=on action=nat srctarget=internet srcif=out dsttarget=srv_ftp_pub natdstarp=on dstport=any natdsttarget=srv_ftp natdstport=any position=4 loglevel=minor
CONFIG FILTER ACTIVATE
```

Une règle de NAT ne **suffit pas** : le trafic doit aussi être autorisé par une règle de **filtrage** (qui s'écrit avec l'adresse de destination **avant** traduction, sur SNS).

## Utilisateurs (base LDAP interne)

```sns
CONFIG LDAP INITIALIZE domainname=corp.exemple.fr o=corp dc=fr password=MotDePasseAnnuaireTresLong
CONFIG LDAP ACTIVATE
USER CREATE uid=jdupont name=dupont gname=jean
USER PASSWORD dn=jdupont password=MotDePasseUtilisateurLong
USER GROUP CREATE "Comptabilite"
USER GROUP ADDUSER "cn=Comptabilite,ou=groups,o=corp,dc=fr" "jdupont"
```

En entreprise, connectez plutôt le pare-feu à **Active Directory** (*Configuration → Utilisateurs → Configuration des annuaires*) et utilisez l'agent **SSO** (Stormshield SSO Agent) pour identifier les utilisateurs de façon transparente dans les règles.

Suite : [[03-vpn-ha-supervision|VPN, haute disponibilité et supervision]].
