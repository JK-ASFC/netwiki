---
title: FortiGate en routeur — routage dynamique et SD-WAN
description: Utiliser le FortiGate comme routeur d'entreprise — routes statiques (distance, priorité, blackhole), routage dynamique OSPF et BGP en CLI et GUI, SD-WAN (membres, zones, contrôles d'état et SLA, règles par application ou ISDB, répartition et basculement), ADVPN pour les réseaux multi-sites, routes de politique, vérifications et dépannage.
tags: [fortinet, fortigate, routage, ospf, bgp, sd-wan, advpn, sla]
icon: route
---

Fortinet ne vend pas de « routeurs » au sens classique : le **FortiGate** assure le rôle de routeur d'agence et de siège, avec un **SD-WAN** intégré sans licence supplémentaire. La gamme **FortiExtender** apporte l'accès 4G/5G, et les FortiGate « Rugged » couvrent l'industriel.

## Routes statiques

```fortios
config router static
    edit 0
        set dst 0.0.0.0 0.0.0.0
        set gateway 203.0.113.1
        set device "port1"
        set distance 10
    next
    edit 0
        set dst 10.0.0.0 255.0.0.0
        # évite que les réseaux privés partent vers Internet si un VPN tombe
        set blackhole enable
        set distance 254
    next
end
```

| Paramètre | Effet |
| --- | --- |
| `distance` | La plus faible gagne (une route de distance supérieure sert de secours) |
| `priority` | À distance égale, départage (les deux routes restent dans la table) |
| `link-monitor` | Retire une route si une cible n'est plus joignable (remplacé avantageusement par le SD-WAN) |

## OSPF

```fortios
config router ospf
    set router-id 10.255.0.1
    config area
        edit 0.0.0.0
        next
    end
    config ospf-interface
        edit "LAN-OSPF"
            set interface "port2"
            set authentication message-digest
            set md5-keys 1 CleOspfPartagee
            set network-type broadcast
        next
    end
    config network
        edit 1
            set prefix 10.0.10.0 255.255.255.0
        next
    end
    set passive-interface "VLAN20"
end
get router info ospf neighbor
get router info ospf interface
```

## BGP

```fortios
config router bgp
    set as 64500
    set router-id 10.255.0.1
    config neighbor
        edit "203.0.113.1"
            set remote-as 3215
            set password CleSessionBgp
            set route-map-in "RM-ENTREE"
            set route-map-out "RM-SORTIE"
        next
    end
    config network
        edit 1
            set prefix 192.0.2.0 255.255.255.0
        next
    end
end
get router info bgp summary
get router info bgp neighbors 203.0.113.1 advertised-routes
```

Les listes de préfixes et route-maps se définissent dans `config router prefix-list` et `config router route-map` (GUI : *Network → Routing Objects*).

## SD-WAN

Le SD-WAN regroupe plusieurs liens (fibre, 4G/5G, VPN) en **membres** d'une interface virtuelle, puis choisit le lien selon des **règles** et la **qualité mesurée**.

```fortios
config system sdwan
    set status enable
    config zone
        edit "underlay"
        next
    end
    config members
        edit 1
            set interface "port1"
            set zone "underlay"
            set gateway 203.0.113.1
        next
        edit 2
            set interface "port4"
            set zone "underlay"
            set gateway 198.51.100.1
        next
    end
    config health-check
        edit "SLA-INTERNET"
            set server "9.9.9.9" "1.1.1.1"
            set protocol ping
            set interval 500
            set members 1 2
            config sla
                edit 1
                    set latency-threshold 100
                    set jitter-threshold 30
                    set packetloss-threshold 2
                next
            end
        next
    end
    config service
        edit 1
            set name "VOIX-ET-VISIO"
            set mode sla
            set internet-service enable
            set internet-service-name "Microsoft-Teams" "Zoom-Zoom.Meeting"
            config sla
                edit "SLA-INTERNET"
                    set id 1
                next
            end
            set priority-members 1 2
        next
    end
end
config router static
    edit 0
        # route par défaut vers la zone SD-WAN
        set sdwan-zone "underlay"
    next
end
```

| Mode de règle | Comportement |
| --- | --- |
| *Manual* | Lien imposé |
| *Best Quality* | Lien au meilleur critère (latence, gigue, perte) |
| **Lowest Cost (SLA)** | Premier lien de la liste qui respecte le SLA |
| *Maximize Bandwidth* | Répartition sur les liens conformes |

```fortios
# état des liens et mesures
diagnose sys sdwan health-check
# règles et lien choisi
diagnose sys sdwan service
diagnose sys sdwan member
```

Interface graphique : *Network → SD-WAN* (zones, membres, contrôles de performance, règles), avec des graphiques de qualité par lien.

## Multi-sites : ADVPN

**ADVPN** (*Auto-Discovery VPN*) combine un concentrateur (hub) et des agences (spokes) en IPsec : les agences établissent **dynamiquement** des tunnels directs entre elles quand elles communiquent. Associé au SD-WAN et à BGP sur les tunnels, c'est l'architecture recommandée par Fortinet pour les réseaux multi-agences (guides *SD-WAN Architecture for Enterprise*). **FortiManager** facilite le déploiement par modèles.

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Route absente de la table active | Distance plus élevée qu'une autre route, interface tombée | `get router info routing-table database` |
| Trafic ne suit pas la règle SD-WAN | Session existante (la règle s'applique aux nouvelles sessions), règle plus haute | `diagnose sys sdwan service`, effacer les sessions concernées |
| Lien marqué « mort » à tort | Cible du contrôle d'état filtrée | Changer de cible ou de protocole (HTTP, DNS) |
| Voisin BGP inactif | Politique locale (trafic vers le FortiGate) ou route vers le voisin | Accès local, `diagnose ip router bgp all enable` + `diagnose debug enable` |

Suite : [[02-fortiswitch-fortiap-fortimanager|FortiSwitch, FortiAP, FortiManager et FortiAnalyzer]].
