---
title: Sécurité, RPZ, DoT/DoH et performances
description: Durcissement de BIND (ACL, version, chroot, systemd), limitation du débit de réponse (RRL), pare-feu DNS avec les Response Policy Zones, DNS over TLS et DNS over HTTPS, canal de statistiques, Prometheus et dimensionnement.
tags: [bind9, sécurité, rpz, rrl, dot, doh, durcissement, performance, statistiques]
icon: shield
---

## Durcissement de base

```named /etc/bind/named.conf.options
options {
    // Ne rien divulguer
    version "non communiquée";
    hostname none;
    server-id none;

    // Séparer clairement les rôles
    recursion no;                         // sur un autoritaire
    allow-query { any; };                 // autoritaire public
    allow-transfer { none; };             // surchargé par zone avec une clé TSIG
    allow-update { none; };
    allow-notify { none; };

    // Ignorer totalement certains réseaux (bogons, attaquants connus)
    blackhole { 0.0.0.0/8; 224.0.0.0/3; };

    // Réponses minimales
    minimal-responses yes;
    minimal-any yes;

    // Taille EDNS sûre (évite la fragmentation IP)
    edns-udp-size 1232;
    max-udp-size 1232;
};
```

| Mesure | Pourquoi |
| --- | --- |
| Autoritaires et résolveurs séparés | Un autoritaire récursif ouvert = amplification DDoS et empoisonnement |
| `allow-recursion` restreint | Pas de résolveur ouvert |
| `allow-transfer` par clé TSIG | Empêche l'énumération des zones |
| Masquer la version | `dig version.bind CH TXT` ne révèle plus la version vulnérable |
| Utilisateur non privilégié | `named -u bind` (défaut sur les distributions) |
| Mises à jour | Suivre les annonces de sécurité de l'ISC (liste `bind-announce`) |
| Clé rndc limitée à localhost | Le canal 953 ne doit jamais être exposé |
| Supervision des requêtes | Détection de tunnels DNS, d'exfiltration, de domaines malveillants |

### Durcissement systemd

```ini /etc/systemd/system/named.service.d/hardening.conf
[Service]
ProtectSystem=strict
ReadWritePaths=/var/cache/bind /var/lib/bind /var/log/named /run/named
ProtectHome=yes
PrivateTmp=yes
PrivateDevices=yes
ProtectKernelTunables=yes
ProtectKernelModules=yes
ProtectControlGroups=yes
NoNewPrivileges=yes
RestrictAddressFamilies=AF_UNIX AF_INET AF_INET6 AF_NETLINK
CapabilityBoundingSet=CAP_NET_BIND_SERVICE CAP_SETUID CAP_SETGID CAP_SYS_RESOURCE CAP_CHOWN
```

```bash
sudo systemctl daemon-reload && sudo systemctl restart named
systemd-analyze security named
```

> [!NOTE]
> Le **chroot** (`named -t /var/named/chroot`, paquet `bind-chroot` sur RHEL) est une alternative historique ; le confinement systemd + AppArmor/SELinux offre aujourd'hui une protection équivalente avec moins de complexité.

## Limitation du débit de réponse (RRL)

Les attaques par amplification envoient des requêtes avec une IP source usurpée (la victime). Le RRL limite le nombre de réponses **identiques** envoyées à un même préfixe.

```named
options {
    rate-limit {
        responses-per-second 10;     // réponses identiques / s vers un même /24 (IPv4) ou /56 (IPv6)
        nxdomains-per-second 5;
        errors-per-second 5;
        window 5;
        slip 2;                      // 1 réponse sur 2 au-delà de la limite est tronquée (TC=1) → le vrai client réessaie en TCP
        ipv4-prefix-length 24;
        ipv6-prefix-length 56;
        exempt-clients { 10.0.0.0/8; };
        // log-only yes;             // pour mesurer avant d'appliquer
    };
};
```

> [!TIP]
> Le RRL est indispensable sur les **autoritaires publics**. Sur un résolveur interne, préférez limiter qui peut l'interroger (ACL) ; des quotas par client existent aussi : `fetches-per-zone`, `fetches-per-server`, `clients-per-query`.

## Response Policy Zones (RPZ) — pare-feu DNS

Une RPZ est une zone spéciale qui **réécrit les réponses** du résolveur : blocage de domaines malveillants, publicité, redirection vers une page d'avertissement, surcharge de noms internes.

```named
options {
    response-policy {
        zone "rpz.local" policy given;
        zone "rpz.menaces" policy given max-policy-ttl 3600;
    } break-dnssec yes qname-wait-recurse no;
};

zone "rpz.local" {
    type primary;
    file "/var/lib/bind/db.rpz.local";
    allow-query { localhost; };
};

// Flux de menaces fourni par un éditeur (secondaire d'une zone RPZ distante)
zone "rpz.menaces" {
    type secondary;
    primaries { 192.0.2.10 key "rpz-flux"; };
    file "/var/cache/bind/db.rpz.menaces";
    allow-query { localhost; };
};
```

```dns /var/lib/bind/db.rpz.local
$TTL 300
@ IN SOA localhost. hostmaster.exemple.fr. ( 2026011501 3600 600 86400 300 )
  IN NS  localhost.

; --- NXDOMAIN : le domaine « n'existe pas »
malware.example            CNAME .
*.malware.example          CNAME .

; --- NODATA : le nom existe mais sans réponse
tracker.example            CNAME *.

; --- Redirection vers une page d'avertissement interne
phishing.example           A     10.0.20.80
*.phishing.example         A     10.0.20.80

; --- Liste blanche (prioritaire si placée dans une RPZ évaluée avant)
partenaire.example         CNAME rpz-passthru.

; --- Bloquer toute réponse contenant une IP donnée (ex. sinkhole connu)
32.66.0.51.198.rpz-ip      CNAME .

; --- Ignorer silencieusement (aucune réponse)
ddos-cible.example         CNAME rpz-drop.

; --- Forcer la réponse TCP
gros.example               CNAME rpz-tcp-only.
```

| Déclencheur | Syntaxe du nom dans la RPZ |
| --- | --- |
| Nom demandé (QNAME) | `domaine.tld` / `*.domaine.tld` |
| Adresse de la réponse | `<préfixe>.<ip inversée>.rpz-ip` (ex. `24.0.2.0.192.rpz-ip` pour 192.0.2.0/24) |
| Adresse du client | `<préfixe>.<ip inversée>.rpz-client-ip` |
| Nom du serveur NS | `ns.domaine.rpz-nsdname` |
| IP du serveur NS | `<préfixe>.<ip inversée>.rpz-nsip` |

| Action (cible du CNAME) | Effet |
| --- | --- |
| `.` | NXDOMAIN |
| `*.` | NODATA |
| `rpz-passthru.` | Laisser passer (liste blanche) |
| `rpz-drop.` | Ne pas répondre |
| `rpz-tcp-only.` | Tronquer pour forcer TCP |
| Un enregistrement A/AAAA/CNAME | Réponse locale de remplacement |

```bash
# Journaliser les correspondances RPZ
#   logging { channel rpz_log { file "/var/log/named/rpz.log" versions 5 size 50m; print-time yes; }; category rpz { rpz_log; }; };
dig @localhost malware.example        # status: NXDOMAIN
sudo rndc reload rpz.local
```

> [!TIP]
> Des flux RPZ gratuits ou commerciaux existent (Spamhaus, abuse.ch URLhaus RPZ, ThreatSTOP, Infoblox, Quad9 en version résolveur). Combinez-les avec une RPZ locale de **liste blanche** déclarée **en premier** dans `response-policy`.

## DNS over TLS (DoT) et DNS over HTTPS (DoH) — BIND 9.18+

Chiffre le trafic entre clients et résolveur (port 853 pour DoT, 443 pour DoH).

```named
tls tls-resolveur {
    cert-file "/etc/bind/tls/resolveur.exemple.fr.crt";   // chaîne complète
    key-file  "/etc/bind/tls/resolveur.exemple.fr.key";
    protocols { TLSv1.2; TLSv1.3; };
    ciphers "HIGH:!kRSA:!aNULL:!eNULL:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS:!SHA1:!SHA256:!SHA384";
    prefer-server-ciphers yes;
    session-tickets no;
};

http doh-local {
    endpoints { "/dns-query"; };
    listener-clients 1000;
    streams-per-connection 100;
};

options {
    listen-on port 53  { 10.0.10.53; };
    listen-on port 853 tls tls-resolveur { 10.0.10.53; };
    listen-on port 443 tls tls-resolveur http doh-local { 10.0.10.53; };
    // DoH sans TLS derrière un reverse proxy qui termine le TLS :
    // listen-on port 8080 tls none http doh-local { 127.0.0.1; };
};
```

```bash
# Tests (kdig vient du paquet knot-dnsutils)
kdig @10.0.10.53 +tls-ca +tls-host=resolveur.exemple.fr www.isc.org
dig @10.0.10.53 +https www.isc.org            # dig 9.18+ supporte +https et +tls
curl -s -H 'accept: application/dns-message' "https://resolveur.exemple.fr/dns-query?dns=q80BAAABAAAAAAAAA3d3dwNpc2MDb3JnAAABAAE" | od -c | head
```

> [!NOTE]
> Côté postes Windows 11 / Server 2022+, DoH se configure par GPO ou `Add-DnsClientDohServerAddress -ServerAddress 10.0.10.53 -DohTemplate https://resolveur.exemple.fr/dns-query -AutoUpgrade $true`. Android utilise DoT (« DNS privé »).

Pour **chiffrer les transferts de zone** (XoT, RFC 9103) entre primaire et secondaire :

```named
// secondaire
zone "exemple.fr" { type secondary; primaries { 10.0.20.53 key "xfer-exemple" tls tls-xfer; }; file "…"; };
```

## Canal de statistiques

```named
statistics-channels {
    inet 127.0.0.1 port 8053 allow { 127.0.0.1; };
};
```

```bash
curl -s http://127.0.0.1:8053/json/v1/server | jq '.qtypes, .rcodes'
curl -s http://127.0.0.1:8053/xml/v3/zones   # par zone (avec zone-statistics yes;)
```

- **Prometheus** : `bind_exporter` (prometheus-community) lit ce canal et expose requêtes/s par type, RCODE, taux de cache, transferts, échecs DNSSEC.
- **Centreon** : plugin `apps::bind9::web::plugin` (modes `server-usage`, `zone-usage`, `memory-usage`).

## Dimensionnement et performances

| Élément | Recommandation |
| --- | --- |
| Threads | Automatique (un par cœur) ; forcer avec `named -n <N>` |
| Mémoire | Résolveur : `max-cache-size` (ex. 50 % de la RAM dédiée) ; autoritaire : taille des zones ×3 environ |
| Réseau | Tamponner les rafales : `net.core.rmem_max`, `net.core.netdev_max_backlog` |
| Clients simultanés | `recursive-clients`, `tcp-clients`, `clients-per-query` |
| Mesure | `dnsperf` / `resperf` (paquet `dnsperf`) avec un jeu de requêtes réaliste |

```bash
# Test de charge d'un autoritaire
dnsperf -s 10.0.20.53 -d requetes.txt -l 30 -Q 20000
# requetes.txt : une ligne par requête, ex. « www.exemple.fr A »
```

## Détection des abus

- Activer la journalisation des requêtes (`querylog`) sur un échantillon ou l'envoyer vers un SIEM via **dnstap** (`dnstap { client response; resolver query; }; dnstap-output unix "/run/named/dnstap.sock";`).
- Surveiller : volume anormal de NXDOMAIN (DGA de malwares), noms très longs et aléatoires (tunnels DNS : iodine, dnscat2), requêtes TXT massives, clients interrogeant directement des résolveurs externes (bloquer le port 53 sortant hors des résolveurs autorisés).
