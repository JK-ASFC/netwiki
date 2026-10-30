---
title: RouterOS — pare-feu, NAT, VPN, routage et dépannage
description: Configurer la sécurité et le routage d'un MikroTik sous RouterOS v7 — pare-feu à états (chaînes input, forward, output, fasttrack, listes d'adresses, listes d'interfaces), NAT (masquerade, dst-nat, hairpin), VPN (WireGuard, IPsec IKEv2), routage (statique, OSPF v7, BGP, tables et règles de routage), files de QoS, API REST et scripts, outils de diagnostic (ping, traceroute, torch, sniffer, connexions, journaux) et problèmes fréquents.
tags: [mikrotik, routeros, firewall, nat, wireguard, ospf, torch, dépannage]
icon: shield
---

## Pare-feu à états

Le pare-feu RouterOS (*netfilter*) traite trois chaînes principales : **`input`** (trafic à destination du routeur), **`forward`** (trafic traversant), `output` (émis par le routeur). Les règles sont lues **dans l'ordre**, et **tout est accepté par défaut** si aucune règle ne refuse : terminez chaque chaîne par un refus.

```routeros
/interface list add name=WAN
/interface list member add list=WAN interface=ether1
/ip firewall address-list add list=ADMIN address=10.0.99.0/24
/ip firewall filter
add chain=input action=accept connection-state=established,related,untracked comment="input : connexions établies"
add chain=input action=drop connection-state=invalid
add chain=input action=accept protocol=icmp
add chain=input action=accept src-address-list=ADMIN comment="administration"
add chain=input action=accept in-interface-list=LAN protocol=udp dst-port=67,123
add chain=input action=drop comment="input : refus du reste"
add chain=forward action=fasttrack-connection connection-state=established,related hw-offload=yes
add chain=forward action=accept connection-state=established,related,untracked
add chain=forward action=drop connection-state=invalid
add chain=forward action=accept in-interface-list=LAN out-interface-list=WAN
add chain=forward action=accept connection-nat-state=dstnat comment="flux publiés"
add chain=forward action=drop comment="forward : refus du reste"
```

| Notion | Explication |
| --- | --- |
| `connection-state` | Accepter `established,related` en tête de chaîne |
| **FastTrack** | Contourne le traitement pour les connexions établies (gain de performances, mais contourne aussi les files et l'IPsec) |
| Listes d'adresses | `address-list`, remplies statiquement, par DNS, ou dynamiquement par des règles (`add-src-to-address-list`) |
| `raw` | Table traitée avant le suivi de connexion (protection contre les attaques volumétriques) |
| Journalisation | `log=yes log-prefix="REFUS"` sur une règle |

## NAT

```routeros
/ip firewall nat
add chain=srcnat out-interface-list=WAN action=masquerade comment="sortie Internet"
add chain=dstnat in-interface-list=WAN protocol=tcp dst-port=443 action=dst-nat to-addresses=10.0.30.10 to-ports=443 comment="publication web"
```

Pour joindre un service publié depuis le LAN par l'adresse publique (*hairpin NAT*), ajoutez une règle `dstnat` sur l'adresse publique (et non l'interface) et une règle `srcnat` `masquerade` pour le trafic LAN → serveur, ou utilisez un DNS interne.

## VPN

### WireGuard

```routeros
/interface wireguard add name=wg-lyon listen-port=13231
/interface wireguard print
/interface wireguard peers add interface=wg-lyon public-key="CLE_PUBLIQUE_DU_PAIR" endpoint-address=198.51.100.20 endpoint-port=13231 allowed-address=10.255.255.2/32,10.60.0.0/16 persistent-keepalive=25s
/ip address add address=10.255.255.1/30 interface=wg-lyon
/ip route add dst-address=10.60.0.0/16 gateway=wg-lyon
/ip firewall filter add chain=input action=accept protocol=udp dst-port=13231 place-before=[find where comment="input : refus du reste"] comment="WireGuard"
```

La clé publique locale s'affiche avec `/interface wireguard print`. Voir aussi [[03-wireguard/01-presentation-installation|WireGuard]].

### IPsec

IPsec IKEv2 (`/ip ipsec profile`, `peer`, `identity`, `proposal`, `policy`) assure l'interopérabilité avec les autres constructeurs ; le menu *IP → IPsec* de WinBox expose les mêmes objets. Pensez à exclure le trafic IPsec du FastTrack et du NAT (règle `accept` avec `ipsec-policy=out,ipsec` avant la règle `masquerade`).

## Routage

```routeros
/ip route add dst-address=0.0.0.0/0 gateway=203.0.113.1 check-gateway=ping distance=1
/ip route add dst-address=0.0.0.0/0 gateway=198.51.100.1 distance=2 comment="lien de secours"
/routing ospf instance add name=ospf-1 version=2 router-id=10.255.0.5
/routing ospf area add name=backbone area-id=0.0.0.0 instance=ospf-1
/routing ospf interface-template add area=backbone networks=10.0.0.0/8
/routing ospf neighbor print
```

RouterOS v7 a refondu le routage : tables multiples (`/routing table`), règles (`/routing rule`) pour le routage par politique, **BGP** sous `/routing bgp connection` avec des filtres (`/routing filter rule`). Les configurations OSPF/BGP de la v6 ne se transposent pas telles quelles.

## QoS

*Queues → Simple Queues* (limitation par adresse ou réseau) et *Queue Tree* avec marquage (`mangle`) pour les politiques avancées ; files de type `cake` ou `fq-codel` pour réduire la latence sur les liens Internet. Rappel : le FastTrack contourne les files.

## API REST et scripts

```bash
# RouterOS v7 : API REST sur le service www-ssl (HTTPS)
curl -s -k -u automatisation https://10.0.99.2/rest/ip/address | jq '.[].address'
curl -s -k -u automatisation -X PUT https://10.0.99.2/rest/ip/firewall/address-list -H "Content-Type: application/json" -d '{"list":"BLOCAGE","address":"198.51.100.66"}'
```

Les **scripts** RouterOS (`/system script`) et le **planificateur** (`/system scheduler`) automatisent sauvegardes et tâches périodiques ; **Netwatch** déclenche des actions selon la joignabilité d'une adresse.

## Diagnostic

```routeros
/tool ping 8.8.8.8 src-address=10.0.20.254 count=4
/tool traceroute 8.8.8.8
/tool torch interface=ether1 src-address=10.0.20.15
/tool sniffer quick interface=ether1 ip-address=10.0.20.15
/ip firewall connection print where src-address~"10.0.20.15"
/ip firewall filter print stats
/interface monitor-traffic ether1
/ip arp print
/log print where topics~"firewall"
/system resource print
/system health print
```

| Outil | Usage |
| --- | --- |
| **Torch** | Trafic en temps réel par flux sur une interface (qui consomme ?) |
| Sniffer | Capture (fichier `.pcap` téléchargeable ou flux vers [[02-reseau-diagnostic/02-wireshark-analyse\|Wireshark]] en *streaming*) |
| `print stats` (filtre) | Compteurs de chaque règle : vérifier qu'une règle est bien atteinte |
| Profile | `/tool profile` : consommation CPU par processus |

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Accès perdu après une règle `input` | Règle de refus avant la règle d'administration | Mode sûr, MAC-WinBox, sinon reset/Netinstall |
| Files de QoS sans effet | FastTrack actif | Exclure les flux concernés du FastTrack |
| Tunnel IPsec établi mais sans trafic | Trafic NATé ou FastTracké avant IPsec | Règles d'exclusion avant `masquerade` et FastTrack |
| Routeur utilisé pour des attaques | Résolveur DNS, proxy ou SOCKS ouverts sur le WAN, RouterOS obsolète | Mettre à jour, fermer les services, `input` en refus par défaut |
| VLAN qui ne passent pas | Pont non *tagged* dans `/interface bridge vlan`, `pvid` erroné | Revoir la table VLAN du pont |
