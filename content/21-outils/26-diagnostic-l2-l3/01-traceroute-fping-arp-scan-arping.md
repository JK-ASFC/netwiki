---
title: traceroute, fping, arp-scan et arping
description: Diagnostic réseau de couche 2 et 3 — traceroute sous Linux (sondes UDP, ICMP -I, TCP -T vers 443, extensions MPLS -e, MTU), tracepath, tracert et pathping sous Windows, Test-NetConnection -TraceRoute, lecture des étoiles et des chemins asymétriques ; fping (balayage d'un sous-réseau -g, statistiques de perte et de latence, boucle, cibles depuis un fichier) ; arp-scan (inventaire du réseau local, constructeur par OUI, adresses IP en double, VLAN 802.1Q) ; arping (iputils et Habets : test de présence sans ICMP, détection d'adresse en double -D, ARP gratuit -U après bascule) ; installation Linux, macOS, BSD, équivalents Windows et dépannage.
tags: [traceroute, tracepath, tracert, fping, arp-scan, arping, arp, icmp, diagnostic réseau, adresse ip en double]
icon: route
---

Quatre outils pour répondre vite à des questions de terrain : *par où passent les paquets et où se perdent-ils ?* (**traceroute**), *quels hôtes de ce sous-réseau répondent, avec quelle perte ?* (**fping**), *quels équipements sont réellement présents sur ce VLAN, et qui utilise cette adresse IP ?* (**arp-scan**, **arping**). Pour un chemin mesuré en continu, voir [[02-reseau-diagnostic/06-dig-mtr-curl|mtr]] ; pour la supervision de la latence dans la durée, [[22-sondes-reseau/01-smokeping-blackbox|Smokeping et fping exporter]].

> [!NOTE]
> arp-scan, arping et les modes TCP/ICMP de traceroute envoient des paquets bruts : ils demandent les droits **root** (ou la capacité `cap_net_raw`). N'interrogez que les réseaux dont vous avez la charge.

## Installation

| Système | traceroute | fping | arp-scan | arping |
| --- | --- | --- | --- | --- |
| Debian / Ubuntu | `sudo apt install traceroute` | `sudo apt install fping` | `sudo apt install arp-scan` | `sudo apt install iputils-arping` |
| RHEL / Rocky / Alma | `sudo dnf install traceroute` | `sudo dnf install epel-release && sudo dnf install fping` | `sudo dnf install epel-release && sudo dnf install arp-scan` | inclus dans `iputils` |
| Fedora | `sudo dnf install traceroute` | `sudo dnf install fping` | `sudo dnf install arp-scan` | inclus dans `iputils` |
| Alpine | `sudo apk add traceroute` | `sudo apk add fping` | `sudo apk add arp-scan` | `sudo apk add iputils-arping` |
| Arch | `sudo pacman -S traceroute` | `sudo pacman -S fping` | `sudo pacman -S arp-scan` | `sudo pacman -S iputils` |
| macOS | intégré | `brew install fping` | `brew install arp-scan` | `brew install arping` |
| FreeBSD | intégré | `sudo pkg install fping` | `sudo pkg install arp-scan` | `sudo pkg install arping` |
| Windows | `tracert`, `pathping` intégrés | — (voir équivalents) | — | — |

`tracepath` (sans droits root, découverte de la MTU du chemin) fait partie d'`iputils` sur la plupart des distributions.

## traceroute

### Principe

traceroute envoie des paquets avec un **TTL** (durée de vie) croissant : 1, 2, 3… Chaque routeur qui décrémente le TTL à 0 renvoie un message ICMP *Time Exceeded* : son adresse révèle le saut. La destination répond par *Port Unreachable* (sondes UDP), *Echo Reply* (ICMP) ou *SYN-ACK* (TCP).

| Sonde | Commande Linux | Quand l'utiliser |
| --- | --- | --- |
| UDP ports 33434 et suivants (défaut) | `traceroute srv-web` | Réseau interne sans filtrage |
| ICMP Echo | `sudo traceroute -I srv-web` | Comme `tracert` de Windows |
| TCP SYN | `sudo traceroute -T -p 443 srv-web` | À travers les pare-feu : seul le port du service passe |

### Exemples

```bash
# Chemin vers un site distant, sans résolution DNS, une sonde par saut
traceroute -n -q 1 10.30.0.10

# À travers un pare-feu qui n'autorise que HTTPS
sudo traceroute -T -p 443 -n intranet.corp.exemple.fr

# Afficher les étiquettes MPLS du cœur opérateur (extensions ICMP)
traceroute -e -n 198.51.100.20

# Numéro d'AS de chaque saut
traceroute -A -n 9.9.9.9

# Chemin et MTU, sans droits root
tracepath -n srv-backup.corp.exemple.fr
```

```powershell
# Windows
tracert -d 10.30.0.10                 # -d : pas de résolution DNS
pathping -n 10.30.0.10                # chemin + statistiques de perte par saut (environ 5 minutes)
Test-NetConnection 10.30.0.10 -TraceRoute
```

### Lire le résultat

```text
 1  10.0.20.1      0.412 ms
 2  10.0.0.2       1.105 ms
 3  *
 4  203.0.113.9    9.871 ms
 5  10.30.0.10    11.204 ms
```

| Observation | Interprétation |
| --- | --- |
| `*` sur un saut, la suite répond | Le routeur ne répond pas ou limite ses messages ICMP : **pas** une panne |
| `*` sur tous les sauts suivants | Filtrage (pare-feu, ACL) ou perte réelle à partir de ce point ; essayer `-T -p 443` |
| Latence élevée sur un saut, normale ensuite | Le routeur traite l'ICMP avec une faible priorité : ignorer |
| Latence qui augmente à partir d'un saut et reste haute | Lien chargé ou long (WAN, satellite) à partir de ce saut |
| `!H`, `!N`, `!X` | Hôte ou réseau injoignable, interdit administrativement (ACL) |
| Chemins différents d'un essai à l'autre | Partage de charge (ECMP) ; tracer aussi dans l'autre sens, le retour peut être asymétrique |

Pour que traceroute fonctionne, les pare-feu doivent laisser revenir les messages ICMP *Time Exceeded* (type 11) et *Destination Unreachable* (type 3) — ces derniers sont aussi indispensables à la découverte de MTU.

## fping

fping interroge **de nombreux hôtes en parallèle** et produit une sortie facile à exploiter dans un script.

```bash
# Hôtes qui répondent dans un sous-réseau (les erreurs « injoignable » sont masquées)
fping -a -q -g 10.0.20.0/24

# Hôtes qui ne répondent PAS dans une liste
fping -u -f /srv/inventaire/serveurs.txt

# Statistiques : 20 paquets par cible, résumé seulement
fping -c 20 -q srv-web-01 srv-web-02 srv-db-01

# Surveillance continue d'un lien, horodatée, une sonde par seconde
fping -l -D -p 1000 10.30.0.1

# Réglages de délai sur un réseau lent : 3 tentatives, attente initiale 500 ms
fping -r 3 -t 500 -a -g 10.0.20.0/24
```

Exemple de résumé avec `-c 20 -q` :

```text
srv-web-01 : xmt/rcv/%loss = 20/20/0%, min/avg/max = 0.31/0.44/0.92
srv-db-01  : xmt/rcv/%loss = 20/18/10%, min/avg/max = 0.35/2.10/14.2
```

Codes de retour : `0` toutes les cibles répondent, `1` au moins une ne répond pas, `2` adresse invalide, `3` paramètres incorrects — pratique dans une sonde ou un script d'alerte.

> [!TIP]
> Un hôte qui ne répond pas au ping n'est pas forcément éteint : Windows bloque l'ICMP entrant par défaut sur les réseaux publics. Sur le même réseau local, confirmez avec **arping** ou **arp-scan**, que le pare-feu de l'hôte ne peut pas ignorer.

## arp-scan

arp-scan envoie une requête **ARP** à chaque adresse d'un sous-réseau local et liste les réponses : adresse IP, adresse MAC et **constructeur** (déduit du préfixe OUI). Comme ARP est indispensable au fonctionnement d'IPv4, tout équipement présent sur le segment répond, même avec un pare-feu.

```bash
# Tout le sous-réseau de l'interface (adresse et masque de l'interface)
sudo arp-scan --localnet

# Interface et plage explicites
sudo arp-scan -I ens192 10.0.20.0/24

# Réseau lent ou équipements endormis : plus de tentatives et d'attente
sudo arp-scan -I ens192 --retry=3 --timeout=500 10.0.20.0/24

# Scanner un VLAN étiqueté depuis un port trunk (tag 802.1Q 30)
sudo arp-scan -I ens192 --vlan=30 10.0.30.0/24

# Sortie brute pour un script (sans en-tête ni résumé)
sudo arp-scan -I ens192 --plain 10.0.20.0/24
```

```text
10.0.20.1     00:1a:2b:3c:4d:01   Cisco Systems, Inc
10.0.20.15    00:50:56:aa:bb:01   VMware, Inc.
10.0.20.40    3c:52:82:11:22:33   Hewlett Packard
10.0.20.40    b8:27:eb:44:55:66   Raspberry Pi Foundation (DUP: 2)
```

La mention **`(DUP: 2)`** signale une **adresse IP utilisée par deux machines** : cause classique de coupures intermittentes. Retrouvez le port de l'équipement fautif avec la table MAC du commutateur (`show mac address-table address b827.eb44.5566` sur Cisco) et corrigez l'attribution dans l'[[06-ipam/01-presentation-deploiement|IPAM]].

## arping

Deux programmes portent ce nom : **arping d'iputils** (Linux, le plus courant) et **arping de Thomas Habets** (Linux, macOS, BSD ; paquet `arping`). Les options diffèrent.

```bash
# iputils : l'hôte est-il présent sur le segment, même s'il bloque le ping ?
sudo arping -I ens192 -c 3 10.0.20.15

# Détection d'adresse en double AVANT d'attribuer 10.0.20.50 (code 0 = adresse libre)
sudo arping -D -I ens192 -c 2 10.0.20.50 && echo "10.0.20.50 est libre"

# ARP gratuit : annoncer que 10.0.20.100 est maintenant sur cette machine (après bascule manuelle d'une IP virtuelle)
sudo arping -U -I ens192 -c 3 10.0.20.100

# Habets (macOS, BSD) : même test de présence
sudo arping -i en0 -c 3 10.0.20.15
```

Les gestionnaires de haute disponibilité ([[13-keepalived-lvs/01-keepalived|keepalived]], Pacemaker) envoient eux-mêmes ces ARP gratuits lors d'une bascule : si les clients continuent d'envoyer vers l'ancien nœud, vérifiez que les commutateurs et pare-feu ne bloquent pas les ARP gratuits et que la durée de vie du cache ARP des routeurs n'est pas excessive.

Afficher et vider le cache ARP :

```bash
ip neigh show dev ens192
sudo ip neigh flush dev ens192
```

```powershell
Get-NetNeighbor -InterfaceAlias "Ethernet" -AddressFamily IPv4
arp -a
Remove-NetNeighbor -InterfaceAlias "Ethernet" -IPAddress 10.0.20.15 -Confirm:$false
```

## Équivalents Windows

| Besoin | Windows |
| --- | --- |
| Chemin | `tracert -d`, `pathping -n`, `Test-NetConnection -TraceRoute` |
| Ping de nombreux hôtes | `1..254 \| ForEach-Object -Parallel { if (Test-Connection "10.0.20.$_" -Count 1 -Quiet -TimeoutSeconds 1) { "10.0.20.$_" } }` (PowerShell 7) |
| Présence sur le segment | `Test-Connection` puis `Get-NetNeighbor` (l'entrée ARP apparaît même si l'ICMP est bloqué) |
| Adresse en double | Journal système (événement 4199 de Tcpip, *conflit d'adresse IP*) |

## Dépannage

| Symptôme | Cause | Correction |
| --- | --- | --- |
| `traceroute: command not found` | Paquet absent (souvent sur les images minimales) | Installer `traceroute`, ou utiliser `tracepath` |
| Seulement des `*` | ICMP filtré au retour, ou sondes UDP bloquées | `sudo traceroute -T -p 443` ; règles ICMP types 3 et 11 |
| `Operation not permitted` (arp-scan, arping, traceroute -T) | Paquets bruts sans droits | `sudo`, ou `sudo setcap cap_net_raw+ep $(command -v arp-scan)` |
| arp-scan ne voit pas un hôte d'un autre VLAN | ARP ne traverse pas les routeurs | Scanner depuis le VLAN (ou `--vlan` sur un trunk) ; à défaut fping |
| `arping: unknown option -i` | Variante iputils (option `-I`) | `-I` pour iputils, `-i` pour Habets |
| fping : hôte injoignable mais actif | Pare-feu de l'hôte (ICMP) | Confirmer par arping, ou par un test de port (`ncat -zv`) |
| `(DUP: 2)` dans arp-scan | Conflit d'adresse IP | Localiser la MAC sur les commutateurs, corriger DHCP/IPAM ; activer DHCP snooping et inspection ARP |

Commandes prêtes à copier : [[90-aide-memoire|aide-mémoire]].
