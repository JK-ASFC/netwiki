---
title: Mise à jour DNS dynamique avec BIND
description: Enregistrer automatiquement les clients DHCP dans le DNS — style standard/interim, clés TSIG, zones directe et inverse, nommage des hôtes, option FQDN (81), enregistrements DHCID, réservations, failover et dépannage.
tags: [isc-dhcp, ddns, bind9, tsig, dns dynamique, dhcid, fqdn]
icon: refresh-ccw
---

## Fonctionnement

À chaque attribution de bail, `dhcpd` envoie une mise à jour RFC 2136 au serveur DNS primaire :

- un enregistrement **A** `nom.dhcp.exemple.fr → IP` dans la zone directe ;
- un enregistrement **PTR** `IP → nom.dhcp.exemple.fr` dans la zone inverse ;
- un enregistrement **DHCID** (style `standard`) ou **TXT** (style `interim`) qui identifie le client propriétaire du nom, pour éviter qu'un autre client « vole » le nom.

À l'expiration ou à la libération du bail, les enregistrements sont supprimés.

## Préparer BIND

```bash
tsig-keygen -a hmac-sha256 ddns-dhcp | sudo tee /etc/bind/keys/ddns-dhcp.key
```

```named /etc/bind/named.conf.local
include "/etc/bind/keys/ddns-dhcp.key";

zone "dhcp.exemple.fr" {
    type primary;
    file "/var/lib/bind/db.dhcp.exemple.fr";
    update-policy { grant ddns-dhcp zonesub ANY; };
};

zone "40.0.10.in-addr.arpa" {
    type primary;
    file "/var/lib/bind/db.10.0.40";
    update-policy { grant ddns-dhcp zonesub ANY; };
};
```

Fichiers de zone initiaux (SOA + NS suffisent), dans un dossier inscriptible par `named`. Détails côté BIND : [[01-bind9/08-ddns-nsupdate|mises à jour dynamiques BIND]].

> [!TIP]
> Utilisez une **sous-zone dédiée** (`dhcp.exemple.fr`) pour les clients dynamiques : la zone principale reste statique et éditable à la main, et une erreur de DDNS ne peut pas écraser un enregistrement de serveur.

## Configurer dhcpd

```dhcpd /etc/dhcp/dhcpd.conf
ddns-updates on;
ddns-update-style standard;          # RFC 4703 : DHCID ; « interim » = ancien format TXT
ddns-domainname "dhcp.exemple.fr.";
ddns-rev-domainname "in-addr.arpa.";
ddns-ttl 3600;

# Le serveur décide du nom (pas le client)
ignore client-updates;
# Mettre aussi à jour le DNS pour les adresses réservées
update-static-leases on;
# Nom à utiliser si le client n'en envoie pas : dhcp-10-0-40-117
ddns-hostname = pick-first-value(
    option fqdn.hostname,
    option host-name,
    concat("dhcp-", binary-to-ascii(10, 8, "-", leased-address))
);

key ddns-dhcp {
    algorithm hmac-sha256;
    secret "Q2xlRERORFNQb3VyRGhjcGRCYXNlNjRDaGFuZ2VyU1ZQ";
};

zone dhcp.exemple.fr. {
    primary 10.0.20.53;
    key ddns-dhcp;
}
zone 40.0.10.in-addr.arpa. {
    primary 10.0.20.53;
    key ddns-dhcp;
}

subnet 10.0.40.0 netmask 255.255.255.0 {
    range 10.0.40.100 10.0.40.199;
    option routers 10.0.40.1;
    option domain-name "dhcp.exemple.fr";
}
```

| Paramètre | Rôle |
| --- | --- |
| `ddns-update-style` | `standard` (DHCID, recommandé), `interim` (TXT, compatibilité ancienne), `none` |
| `ddns-domainname` | Domaine des enregistrements A |
| `ddns-rev-domainname` | Suffixe des zones inverses |
| `ddns-hostname` | Expression qui calcule le nom de l'hôte |
| `allow` / `ignore` / `deny client-updates` | Laisser le client mettre à jour son propre A (option FQDN) ou non |
| `update-static-leases` | DDNS pour les déclarations `host` (attention : ces baux n'expirent jamais côté DNS) |
| `update-conflict-detection` | Vérifie le DHCID avant de remplacer un nom (défaut `true`) |
| `update-optimization` | N'envoie pas de mise à jour si rien n'a changé (défaut `true`) |
| `ddns-guard-id-must-match` / `ddns-other-guard-is-dynamic` | Gestion fine des conflits (4.4) |

## Option FQDN (81) et clients Windows

Les postes Windows et certains Linux envoient l'option **81** et proposent de mettre à jour eux-mêmes leur enregistrement A :

- `ignore client-updates;` : le serveur met à jour **A et PTR** (cohérent, recommandé avec BIND car les clients n'ont pas la clé TSIG).
- `allow client-updates;` : le client gère son A, le serveur seulement le PTR (cas d'un DNS Active Directory acceptant les mises à jour sécurisées).

## Gestion des conflits

Si deux machines utilisent le même nom d'hôte (clonage de VM, renommage), la seconde ne remplace pas l'enregistrement de la première : le DHCID ne correspond pas. Journal :

```text
DDNS: Forward add to pc-01.dhcp.exemple.fr: FQDN in use by another client
```

Solutions : renommer le poste, supprimer l'ancien enregistrement (`nsupdate`), ou désactiver la détection (`update-conflict-detection false;` — déconseillé).

## Failover et DDNS

En failover, les deux serveurs doivent avoir **la même configuration DDNS et la même clé**. Le serveur qui attribue le bail effectue la mise à jour ; le partenaire en est informé par le protocole de failover.

## Vérifier

```bash
journalctl -u isc-dhcp-server | grep -i ddns
# Attendu :
#   Added new forward map from pc-07.dhcp.exemple.fr to 10.0.40.117
#   Added reverse map from 117.40.0.10.in-addr.arpa. to pc-07.dhcp.exemple.fr
dig @10.0.20.53 pc-07.dhcp.exemple.fr +short
dig @10.0.20.53 -x 10.0.40.117 +short
dig @10.0.20.53 pc-07.dhcp.exemple.fr DHCID
```

## Erreurs fréquentes

| Message | Cause |
| --- | --- |
| `Unable to add forward map … : REFUSED` | Politique `update-policy` ou clé non autorisée sur BIND |
| `… : timed out` | Serveur DNS injoignable, mauvaise IP dans `zone { primary … }` |
| `… : bad DNS key` / `BADSIG` | Secret différent entre `dhcpd.conf` et BIND |
| `… : BADTIME` | Horloges désynchronisées (> 5 min) |
| `… : not authorized` (NOTAUTH) | Le serveur cible n'est pas primaire de la zone |
| `FQDN in use by another client` | Conflit de nom (voir plus haut) |
| Rien dans les journaux | `ddns-updates off`, `ddns-update-style none`, ou zone non déclarée dans `dhcpd.conf` |
