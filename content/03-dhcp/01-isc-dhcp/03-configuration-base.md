---
title: Configuration de base
description: Paramètres globaux (authoritative, durées de bail, ping-check, journalisation), déclaration des sous-réseaux et plages, options réseau standard, groupes, fichier de baux et rechargement.
tags: [isc-dhcp, dhcpd.conf, subnet, range, options, bail]
icon: settings
---

## Exemple complet commenté

```dhcpd /etc/dhcp/dhcpd.conf
# ===================================================================== global
# Ce serveur est la référence pour les réseaux déclarés : il envoie un DHCPNAK
# aux clients qui demandent une adresse incorrecte (ex. portable venant d'un autre site)
authoritative;

# Durées de bail (secondes)
default-lease-time 28800;          # 8 h si le client ne demande rien
max-lease-time 86400;              # 24 h maximum
min-lease-time 3600;

# Vérifie par ping qu'une adresse est libre avant de l'offrir
ping-check true;
ping-timeout 1;

# Mises à jour DNS (voir l'article DDNS) — désactivées ici
ddns-update-style none;

# Une seule adresse par client (évite l'épuisement par les postes multi-boot / PXE)
one-lease-per-client true;

# Journalisation via syslog local7
log-facility local7;

# Options communes à tous les réseaux
option domain-name "exemple.fr";
option domain-search "exemple.fr", "corp.exemple.fr";
option domain-name-servers 10.0.10.53, 10.0.10.54;
option ntp-servers 10.0.10.123;

# ===================================================================== réseaux
# Réseau du serveur lui-même (aucune distribution, mais nécessaire pour écouter)
subnet 10.0.10.0 netmask 255.255.255.0 {
}

# VLAN 40 — postes de travail
subnet 10.0.40.0 netmask 255.255.255.0 {
    range 10.0.40.100 10.0.40.199;
    range 10.0.40.210 10.0.40.249;
    option routers 10.0.40.1;
    option broadcast-address 10.0.40.255;
    default-lease-time 43200;
}

# VLAN 50 — invités (baux courts, DNS publics)
subnet 10.0.50.0 netmask 255.255.254.0 {
    range 10.0.50.10 10.0.51.250;
    option routers 10.0.50.1;
    option domain-name-servers 9.9.9.9, 149.112.112.112;
    option domain-name "invite.exemple.fr";
    default-lease-time 3600;
    max-lease-time 7200;
}

# VLAN 60 — téléphonie (aucune plage dynamique : seulement des réservations)
subnet 10.0.60.0 netmask 255.255.255.0 {
    option routers 10.0.60.1;
}
```

## Paramètres globaux importants

| Paramètre | Rôle | Conseil |
| --- | --- | --- |
| `authoritative` | Le serveur fait autorité : il refuse (NAK) les demandes incohérentes | **Obligatoire** sur le serveur officiel ; jamais sur un serveur de test branché sur le réseau de production |
| `default-lease-time` / `max-lease-time` | Durée proposée / plafond | Postes fixes : 8-24 h ; Wi-Fi invités : 1-2 h ; serveurs : réservations |
| `min-lease-time` | Durée minimale accordée | Évite des clients qui demandent des baux de quelques secondes |
| `ping-check` | Ping avant offre | Activé (léger délai d'une seconde à la première attribution) |
| `one-lease-per-client` | Libère l'ancien bail quand le client en demande un nouveau | Recommandé |
| `get-lease-hostnames` | Remplit l'option `host-name` par résolution inverse | Rarement utile |
| `use-host-decl-names` | Envoie le nom de la déclaration `host` comme `host-name` | Pratique pour les réservations |
| `server-identifier` | IP annoncée comme identifiant du serveur | Serveur multi-adresses |
| `local-address` | Adresse d'écoute | Serveur multi-adresses |
| `lease-file-name` | Chemin du fichier de baux | |
| `ignore client-updates` / `allow client-updates` | Gestion de l'option FQDN (DDNS) | Voir [[07-ddns-bind]] |
| `update-static-leases` | Mise à jour DNS aussi pour les réservations | Avec DDNS |

## Déclaration `subnet`

- Le `netmask` doit correspondre exactement au masque réel du réseau.
- Plusieurs `range` peuvent coexister ; elles doivent rester **dans** le sous-réseau et **exclure** les adresses fixes (passerelle, serveurs, imprimantes).
- `range dynamic-bootp …` autorise aussi les vieux clients BOOTP.
- Un `subnet` **sans range** est valide : il permet les réservations et le relais, ou simplement l'écoute.

## Options : syntaxe

```dhcpd
option routers 10.0.40.1;                                   # adresse IP
option domain-name-servers 10.0.10.53, 10.0.10.54;          # liste d'adresses
option domain-name "exemple.fr";                            # texte
option domain-search "exemple.fr", "corp.exemple.fr";       # liste de domaines
option time-offset 3600;                                    # entier signé
option interface-mtu 9000;                                  # entier
option ip-forwarding off;                                   # booléen
```

Définir une option non connue par son code :

```dhcpd
option classless-static-routes code 121 = array of unsigned integer 8;
option ms-classless-static-routes code 249 = array of unsigned integer 8;   # anciens Windows
# Route vers 192.168.100.0/24 via 10.0.40.254, plus route par défaut via 10.0.40.1
# Format : longueur de préfixe, octets significatifs du réseau, passerelle
option classless-static-routes 24, 192,168,100, 10,0,40,254,  0, 10,0,40,1;

option wpad code 252 = text;
option wpad "http://wpad.exemple.fr/wpad.dat";
```

> [!WARNING]
> Quand l'option 121 est envoyée, les clients conformes **ignorent l'option 3 (routers)** : incluez toujours la route par défaut (`0, passerelle`) dans la liste.

## Groupes

Appliquer des paramètres communs à plusieurs déclarations sans les répéter :

```dhcpd
group {
    option routers 10.0.40.1;
    default-lease-time 604800;
    host copieur-1 { hardware ethernet 00:1b:a9:00:00:01; fixed-address 10.0.40.21; }
    host copieur-2 { hardware ethernet 00:1b:a9:00:00:02; fixed-address 10.0.40.22; }
}
```

## Inclure des fichiers

```dhcpd
include "/etc/dhcp/reservations/vlan40.conf";
include "/etc/dhcp/reservations/vlan60-telephones.conf";
include "/etc/dhcp/ddns-keys.conf";
```

Découper la configuration par VLAN ou par usage rend les modifications (et leur relecture) plus sûres, et permet de générer certains fichiers automatiquement (inventaire, IPAM).

## Le fichier de baux

```text /var/lib/dhcp/dhcpd.leases (extrait)
lease 10.0.40.117 {
  starts 3 2026/01/14 08:02:11;
  ends 3 2026/01/14 16:02:11;
  cltt 3 2026/01/14 08:02:11;
  binding state active;
  next binding state free;
  rewind binding state free;
  hardware ethernet 3c:52:82:aa:bb:cc;
  uid "\001<R\202\252\273\314";
  client-hostname "PC-COMPTA-07";
}
```

- Les dates sont en **UTC**.
- Le fichier est **ajouté en continu** puis réécrit proprement (`dhcpd.leases~` = ancienne version) toutes les heures environ.
- Ne jamais l'éditer serveur démarré. Pour libérer un bail : `omshell` ou arrêt du service, suppression de l'entrée, redémarrage.

| `binding state` | Signification |
| --- | --- |
| `active` | Bail en cours |
| `free` | Adresse disponible |
| `expired` / `released` | Bail terminé ou libéré par le client |
| `abandoned` | Adresse en conflit (ping ou DECLINE) : mise de côté |
| `backup` | Réservée au serveur secondaire (failover) |

## Appliquer une modification

ISC DHCP ne sait **pas recharger** sa configuration à chaud : il faut redémarrer le service (les baux sont conservés dans le fichier).

```bash
sudo dhcpd -t -cf /etc/dhcp/dhcpd.conf && sudo systemctl restart isc-dhcp-server
```

> [!TIP]
> Les réservations peuvent être ajoutées **sans redémarrage** via OMAPI (`omshell` → objet `host`), mais elles sont alors stockées dans le fichier de baux et non dans `dhcpd.conf` ; réservez cette méthode à l'automatisation.

## Vérifier côté client

```bash
# Linux
sudo dhclient -v -r ens33 && sudo dhclient -v ens33
sudo nmap --script broadcast-dhcp-discover -e ens33      # voir tous les serveurs DHCP qui répondent
```

```powershell
# Windows
ipconfig /release ; ipconfig /renew
ipconfig /all | Select-String "DHCP|Bail|Lease|Serveur"
```
