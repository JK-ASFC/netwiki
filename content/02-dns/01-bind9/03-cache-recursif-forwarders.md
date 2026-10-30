---
title: Résolveur récursif, cache et redirecteurs
description: Configurer BIND en résolveur cache interne sécurisé — ACL, écoute, récursion, redirecteurs globaux et conditionnels (forward zones), zones stub, validation DNSSEC, réglages du cache, préchargement et minimisation QNAME.
tags: [bind9, récursif, cache, forwarders, resolver, conditionnel]
icon: refresh-cw
---

## Configuration minimale d'un résolveur interne

```named /etc/bind/named.conf.options
acl "clients-internes" {
    127.0.0.1;
    ::1;
    10.0.0.0/8;
    172.16.0.0/12;
    192.168.0.0/16;
};

options {
    directory "/var/cache/bind";

    // Écoute
    listen-on port 53 { 127.0.0.1; 10.0.10.53; };
    listen-on-v6 port 53 { ::1; };

    // Récursion réservée aux clients internes
    recursion yes;
    allow-recursion { clients-internes; };
    allow-query { clients-internes; };
    allow-query-cache { clients-internes; };

    // Aucun transfert de zone depuis ce serveur
    allow-transfer { none; };

    // Validation DNSSEC avec l'ancre de confiance intégrée de la racine
    dnssec-validation auto;

    // Masquer la version
    version "non communiquée";

    // Réponses minimales (moins de trafic, moins d'information divulguée)
    minimal-responses yes;
};
```

> [!CAUTION]
> Un serveur qui accepte la récursion pour n'importe qui (`allow-recursion { any; }`) est un **résolveur ouvert** : il sera utilisé pour des attaques par amplification DDoS en quelques heures s'il est exposé sur Internet.

### Les ACL prédéfinies

| ACL | Contenu |
| --- | --- |
| `any` | Toutes les adresses |
| `none` | Aucune |
| `localhost` | Les adresses du serveur lui-même |
| `localnets` | Les réseaux directement connectés aux interfaces du serveur |

Une ACL peut combiner adresses, préfixes, clés TSIG (`key "nom";`), d'autres ACL et des négations (`!10.0.99.0/24;` — l'ordre compte, la première correspondance gagne).

## Redirecteurs (forwarders)

Au lieu de résoudre depuis la racine, le serveur transmet les requêtes récursives à d'autres résolveurs (FAI, résolveurs publics, proxy DNS de sécurité).

```named
options {
    forwarders {
        9.9.9.9;           // Quad9
        149.112.112.112;
        1.1.1.1;           // Cloudflare
    };
    forward first;         // essaie les redirecteurs, puis la résolution itérative s'ils échouent
    // forward only;       // n'utilise QUE les redirecteurs (pare-feu qui bloque le DNS sortant direct)
};
```

| Mode | Comportement |
| --- | --- |
| `forward first` | Redirecteurs d'abord, repli sur la résolution complète |
| `forward only` | Redirecteurs uniquement ; s'ils échouent : SERVFAIL |
| (pas de forwarders) | Résolution itérative depuis les serveurs racine |

> [!NOTE]
> Avec `dnssec-validation auto`, les redirecteurs doivent transmettre les enregistrements DNSSEC (RRSIG, DNSKEY…). Certains équipements de sécurité ou box les suppriment, ce qui provoque des **SERVFAIL**. Testez avec `dig +dnssec @redirecteur`.

## Redirection conditionnelle (forward zones)

Indispensable pour résoudre les domaines internes hébergés sur un autre DNS (ex. **Active Directory**) :

```named /etc/bind/named.conf.local
// Domaine Active Directory : toutes les requêtes vers les contrôleurs de domaine
zone "corp.local" {
    type forward;
    forward only;
    forwarders { 10.0.10.11; 10.0.10.12; };
};

// Zone inverse des réseaux AD
zone "10.10.in-addr.arpa" {
    type forward;
    forward only;
    forwarders { 10.0.10.11; 10.0.10.12; };
};

// Domaine d'un partenaire joint par VPN
zone "partenaire.lan" {
    type forward;
    forwarders { 172.20.0.53; };
};
```

> [!IMPORTANT]
> Pour les zones inverses **privées** (RFC 1918), BIND crée automatiquement des **zones vides** (`empty-zones-enable yes`) qui répondent NXDOMAIN. Une zone `forward` déclarée explicitement prend le pas sur la zone vide correspondante ; sinon ajoutez `disable-empty-zone "10.in-addr.arpa";` dans `options`.

Si le domaine AD n'est pas signé DNSSEC alors que la validation est active et qu'il s'agit d'un nom « réel » (ex. `ad.exemple.fr` dont le parent `exemple.fr` est signé), ajoutez une exception :

```named
options {
    validate-except { "ad.exemple.fr"; };
};
```

## Zones stub et static-stub

| Type | Différence avec `forward` |
| --- | --- |
| `forward` | Envoie des requêtes **récursives** (RD=1) aux serveurs indiqués |
| `stub` | Copie uniquement les NS de la zone depuis les serveurs donnés, puis interroge ces NS de façon **itérative** |
| `static-stub` | Comme stub, mais les adresses des serveurs sont fixées dans la configuration (pas de requête NS) |

```named
zone "sous.exemple.fr" {
    type static-stub;
    server-addresses { 10.30.0.53; 10.30.0.54; };
};
```

Les zones stub sont utiles quand le serveur cible est autoritaire mais **n'accepte pas la récursion**.

## Réglages du cache

```named
options {
    max-cache-size 2g;            // ou un pourcentage de la RAM : 50%; défaut 90 % de la mémoire
    max-cache-ttl 86400;          // plafond de TTL des réponses positives (1 jour)
    max-ncache-ttl 3600;          // plafond du cache négatif (1 h)
    min-cache-ttl 60;             // plancher (9.16+), à utiliser avec prudence
    prefetch 2 9;                 // renouvelle un enregistrement populaire quand il reste ≤ 2 s de TTL (si TTL initial ≥ 9 s)
    stale-answer-enable yes;      // sert des réponses périmées si les autoritaires sont injoignables (RFC 8767)
    stale-cache-enable yes;
    max-stale-ttl 86400;
    stale-answer-client-timeout 1800;   // ms avant de répondre avec une donnée périmée
    qname-minimization relaxed;   // n'envoie que le nécessaire à chaque niveau (vie privée)
    recursive-clients 10000;      // requêtes récursives simultanées (défaut 1000)
    tcp-clients 1000;
    edns-udp-size 1232;           // taille EDNS recommandée (DNS Flag Day 2020)
    max-udp-size 1232;
};
```

### Opérations sur le cache

```bash
sudo rndc flush                         # vider tout le cache
sudo rndc flushname www.exemple.fr      # un seul nom
sudo rndc flushtree exemple.fr          # un nom et tous ses sous-domaines
sudo rndc dumpdb -cache                 # écrit le cache dans named_dump.db (directory)
grep -A2 "www.exemple.fr" /var/cache/bind/named_dump.db
```

## Zones locales et surcharge de noms

Pour faire répondre localement un nom qui existe aussi sur Internet (ex. accès direct à un serveur interne), on peut créer une zone primaire **réduite au nom concerné** :

```named
zone "portail.exemple.fr" {
    type primary;
    file "/etc/bind/zones/db.portail.exemple.fr";
};
```

```dns /etc/bind/zones/db.portail.exemple.fr
$TTL 300
@   IN SOA  ns.corp.local. hostmaster.exemple.fr. ( 2026010101 3600 600 604800 300 )
    IN NS   ns.corp.local.
    IN A    10.0.20.15
```

Pour gérer de nombreuses surcharges ou du filtrage, utilisez plutôt une **RPZ** (voir [[09-securite-rpz-dot-doh]]) ou des [[06-vues-split-horizon-acl|vues]].

## Haute disponibilité des résolveurs

- Au moins **deux résolveurs** distribués aux clients (DHCP option 6, voir [[01-isc-dhcp/03-configuration-base|ISC DHCP]]).
- Les clients n'interrogent le second qu'après un délai de plusieurs secondes : préférez une **IP anycast** (BGP/OSPF avec FRRouting + sonde de santé) ou une VIP keepalived (VRRP) pour une bascule transparente.

```ini /etc/keepalived/keepalived.conf
vrrp_script chk_named {
    script "/usr/bin/dig @127.0.0.1 +time=1 +tries=1 +short localhost"
    interval 2
    fall 2
    rise 2
}
vrrp_instance DNS {
    state BACKUP
    interface eth0
    virtual_router_id 53
    priority 150
    advert_int 1
    virtual_ipaddress { 10.0.10.53/24 }
    track_script { chk_named }
}
```

## Vérifications

```bash
dig @10.0.10.53 www.wikipedia.org                 # drapeaux « rd ra » et réponse
dig @10.0.10.53 dc01.corp.local                   # redirection conditionnelle
dig @10.0.10.53 www.wikipedia.org +dnssec | grep flags   # « ad » = validé
dig @10.0.10.53 dnssec-failed.org                 # doit renvoyer SERVFAIL (domaine volontairement cassé)
dig @IP_EXTERNE_DU_SERVEUR www.wikipedia.org      # depuis l'extérieur : REFUSED attendu
```
