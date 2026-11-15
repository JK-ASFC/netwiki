---
title: BIND 9 — aide-mémoire des commandes
description: Référence complète des commandes BIND 9 avec exemples — installation (Debian/Ubuntu, RHEL, Alpine, Arch, FreeBSD, macOS, conteneur), pare-feu et SELinux, vérifications (named-checkconf, named-checkzone, named-compilezone, named-journalprint), rndc (rechargement, cache, zones dynamiques gelées, transferts, ajout et suppression de zones à chaud, traces, requêtes en cours, ancres de confiance, NTA, serve-stale, contrôle à distance), dig avancé (sans récursion, nssearch, trace, DoT, DoH, ECS, NSID, TSIG, IXFR, comparaison des numéros de série), clés TSIG et transferts, mises à jour dynamiques nsupdate (prérequis, PTR, GSS-TSIG), DNSSEC (état, roulement, DS, vérification, validation, NTA), RPZ, journalisation, statistiques, tests de charge, débogage au premier plan et sauvegarde.
tags: [aide-mémoire, bind, bind9, named, dns, rndc, dig, nsupdate, dnssec, tsig, rpz]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation|BIND 9]] et les articles de la fiche. Sous Debian/Ubuntu : paquet `bind9`, configuration `/etc/bind/`, zones dynamiques `/var/lib/bind/`, cache `/var/cache/bind/`, compte `bind`. Sous RHEL : paquet `bind`, `/etc/named.conf`, `/var/named/`, compte `named`. Exemples : résolveur `10.0.10.53`, primaire `ns1.exemple.fr` (10.0.10.53), secondaire `ns2.exemple.fr` (10.0.10.54), zone `exemple.fr`.

## Installation

```bash
sudo apt install bind9 bind9-utils bind9-dnsutils          # Debian / Ubuntu
sudo dnf install bind bind-utils                           # RHEL / Rocky / Alma / Fedora
sudo apk add bind bind-tools                               # Alpine
sudo pacman -S bind                                        # Arch
sudo pkg install bind920 && sudo sysrc named_enable=YES    # FreeBSD
brew install bind                                          # macOS (outils dig, delv, nsupdate)
docker run -d --name bind9 -p 53:53/udp -p 53:53/tcp -v /srv/bind/etc:/etc/bind -v /srv/bind/zones:/var/lib/bind internetsystemsconsortium/bind9:9.20
named -V                                                   # version et options de compilation
sudo systemctl enable --now named

# Pare-feu : 53 tcp/udp (DNS), 853 tcp (DoT), 443 tcp (DoH) ; 953 (rndc) reste sur 127.0.0.1
sudo ufw allow 53 && sudo ufw allow 853/tcp
sudo firewall-cmd --permanent --add-service=dns --add-service=dns-over-tls && sudo firewall-cmd --reload

# SELinux (RHEL) : autoriser l'écriture des zones dynamiques et des secondaires
sudo setsebool -P named_write_master_zones 1
sudo restorecon -Rv /var/named
```

## Vérifications

```bash
sudo named-checkconf                                       # syntaxe de named.conf (silencieux si OK)
sudo named-checkconf -z                                    # + chargement de toutes les zones
sudo named-checkconf -p | less                             # configuration complète, normalisée
sudo named-checkconf -l                                    # liste des zones déclarées
sudo named-checkzone exemple.fr /var/lib/bind/db.exemple.fr
sudo named-checkzone -D -o - exemple.fr /var/lib/bind/db.exemple.fr    # zone normalisée
sudo named-checkzone 20.0.10.in-addr.arpa /var/lib/bind/db.10.0.20
# Zone signée ou secondaire au format binaire (raw) → texte lisible
sudo named-compilezone -f raw -F text -o /tmp/exemple.fr.txt exemple.fr /var/lib/bind/db.exemple.fr.signed
sudo named-journalprint /var/lib/bind/db.exemple.fr.jnl    # modifications dynamiques en attente
```

## rndc

```bash
sudo rndc status
sudo rndc reload                          # configuration et zones modifiées
sudo rndc reload exemple.fr               # une zone
sudo rndc reconfig                        # nouvelle configuration et nouvelles zones seulement
sudo rndc zonestatus exemple.fr           # type, numéro de série, fichier, DNSSEC, dernière modification
sudo rndc showzone exemple.fr             # déclaration de la zone

# Cache (résolveur)
sudo rndc flush                           # tout
sudo rndc flushname www.exemple.com       # un nom
sudo rndc flushtree exemple.com           # un nom et ses sous-domaines
sudo rndc dumpdb -cache                   # cache dans named_dump.db
sudo rndc dumpdb -zones
sudo rndc serve-stale status              # réponses expirées servies si les autorités sont injoignables
sudo rndc serve-stale on

# Zones dynamiques : édition manuelle sûre
sudo rndc freeze exemple.fr               # suspend les mises à jour, écrit le journal dans le fichier
sudoedit /var/lib/bind/db.exemple.fr      # incrémenter le numéro de série
sudo rndc thaw exemple.fr                 # relit le fichier, reprend les mises à jour
sudo rndc sync -clean exemple.fr          # écrire le .jnl dans le fichier et le supprimer

# Transferts
sudo rndc notify exemple.fr               # primaire : notifier les secondaires
sudo rndc refresh exemple.fr              # secondaire : vérifier le SOA du primaire maintenant
sudo rndc retransfer exemple.fr           # secondaire : transfert complet (AXFR)

# Zones à chaud (allow-new-zones yes;)
sudo rndc addzone nouvelle.fr '{ type primary; file "/var/lib/bind/db.nouvelle.fr"; };'
sudo rndc modzone nouvelle.fr '{ type primary; file "/var/lib/bind/db.nouvelle.fr"; allow-transfer { key transfert-ns2; }; };'
sudo rndc delzone nouvelle.fr

# Diagnostic
sudo rndc querylog on                     # journaliser les requêtes (temporairement : volumineux)
sudo rndc querylog off
sudo rndc trace 3                         # niveau de débogage (rndc notrace pour revenir à 0)
sudo rndc notrace
sudo rndc recursing                       # requêtes récursives en cours → named.recursing
sudo rndc stats                           # statistiques → named.stats
sudo rndc tsig-list                       # clés TSIG chargées

# DNSSEC côté résolveur
sudo rndc secroots                        # ancres de confiance → named.secroots
sudo rndc validation status
sudo rndc nta -lifetime 1h zone-cassee.exemple.org     # ancre négative : ignorer temporairement un DNSSEC défaillant
sudo rndc nta -dump
sudo rndc nta -remove zone-cassee.exemple.org

# Contrôle d'un autre serveur (clé partagée, port 953 autorisé dans controls)
sudo rndc -s 10.0.10.54 -k /etc/bind/rndc-ns2.key status
```

## Requêtes de test (dig, delv, host)

```bash
dig @10.0.10.53 www.exemple.fr A
dig @10.0.10.53 exemple.fr MX +short
dig @10.0.10.53 exemple.fr SOA +multiline
dig @10.0.10.53 -x 10.0.30.10                     # inverse
dig @ns1.exemple.fr www.exemple.fr +norecurse     # réponse autoritaire (drapeau aa)
dig exemple.fr +nssearch                          # SOA de chaque serveur de la zone
dig exemple.fr NS +trace                          # résolution depuis la racine
dig @10.0.10.53 www.exemple.fr +noall +answer +ttlunits
dig @10.0.10.53 exemple.fr ANY +tcp               # forcer TCP
dig @10.0.10.53 www.exemple.fr +timeout=2 +tries=1
dig @10.0.10.53 www.exemple.fr +nsid              # identifiant du serveur qui a répondu (anycast)
dig @10.0.10.53 www.exemple.com +subnet=10.0.20.0/24   # sous-réseau client (ECS)
dig @10.0.10.53 www.exemple.fr +bufsize=1232      # taille EDNS recommandée
dig -f noms-a-tester.txt +short                   # une requête par ligne du fichier
dig @10.0.10.53 version.bind CHAOS TXT            # version annoncée (à masquer : version "non communiquée";)

# Chiffré (dig 9.18+)
dig @10.0.10.53 www.exemple.fr +tls               # DNS over TLS (853)
dig @10.0.10.53 www.exemple.fr +https             # DNS over HTTPS (443, /dns-query)

# Transferts
dig @ns1.exemple.fr exemple.fr AXFR               # doit être refusé hors secondaires autorisés
dig @ns1.exemple.fr exemple.fr AXFR -k /etc/bind/transfert-ns2.key
dig @ns1.exemple.fr exemple.fr IXFR=2026111501 -k /etc/bind/transfert-ns2.key

# Comparer le numéro de série sur tous les serveurs de la zone
for ns in $(dig +short NS exemple.fr); do printf '%-25s ' "$ns"; dig +short @"$ns" exemple.fr SOA | awk '{print $3}'; done

host -t TXT exemple.fr 10.0.10.53
host -l exemple.fr ns1.exemple.fr                 # liste (transfert)
```

## Clés TSIG et transferts

```bash
sudo rndc-confgen -a                                       # crée rndc.key (contrôle local)
tsig-keygen -a hmac-sha256 transfert-ns2 | sudo tee /etc/bind/transfert-ns2.key
sudo chown root:bind /etc/bind/transfert-ns2.key && sudo chmod 640 /etc/bind/transfert-ns2.key
```

```text /etc/bind/named.conf.local (primaire, extrait)
include "/etc/bind/transfert-ns2.key";
server 10.0.10.54 { keys { transfert-ns2; }; };
zone "exemple.fr" {
    type primary;
    file "/var/lib/bind/db.exemple.fr";
    allow-transfer { key transfert-ns2; };
    also-notify { 10.0.10.54; };
};
```

## Mises à jour dynamiques (nsupdate)

```bash
tsig-keygen -a hmac-sha256 cle-ddns | sudo tee /etc/bind/cle-ddns.key
# Script : remplacer un A et créer son PTR
nsupdate -k /etc/bind/cle-ddns.key <<'EOF'
server 10.0.10.53
zone exemple.fr
update delete test.exemple.fr A
update add test.exemple.fr 300 A 10.0.30.50
send
zone 30.0.10.in-addr.arpa
update add 50.30.0.10.in-addr.arpa 300 PTR test.exemple.fr.
send
EOF

# Avec prérequis : créer seulement si le nom n'existe pas encore
nsupdate -k /etc/bind/cle-ddns.key <<'EOF'
server 10.0.10.53
zone exemple.fr
prereq nxdomain nouveau.exemple.fr
update add nouveau.exemple.fr 300 A 10.0.30.51
send
answer
EOF

nsupdate -l                                                # en local avec la clé de session (session.key)
nsupdate -v -k /etc/bind/cle-ddns.key mises-a-jour.txt     # TCP, commandes dans un fichier
kinit admin-dns@CORP.EXEMPLE.FR && nsupdate -g             # GSS-TSIG (Kerberos, AD)
```

## DNSSEC

```bash
# Signature automatique : dans la zone, « dnssec-policy default; inline-signing yes; »
sudo rndc dnssec -status exemple.fr
sudo rndc signing -list exemple.fr
dnssec-dsfromkey /var/cache/bind/Kexemple.fr.+013+12345.key      # DS à transmettre au registre
dig @10.0.10.53 exemple.fr DS +short
sudo rndc dnssec -checkds -key 12345 published exemple.fr        # après publication du DS chez le registre
sudo rndc dnssec -rollover -key 12345 exemple.fr                 # roulement anticipé d'une clé
sudo rndc loadkeys exemple.fr
dnssec-verify -o exemple.fr /tmp/exemple.fr.txt                  # zone signée convertie en texte
dig @10.0.10.53 exemple.fr DNSKEY +dnssec +multiline
dig @10.0.10.53 www.exemple.fr +dnssec                           # drapeau ad = validé par le résolveur
dig @10.0.10.53 www.exemple.fr +cd                               # sans validation : comparer en cas de SERVFAIL
delv @10.0.10.53 www.exemple.fr                                  # « fully validated » attendu
delv @9.9.9.9 exemple.fr +vtrace                                 # chaîne de validation détaillée
```

## RPZ (pare-feu DNS)

```bash
sudo rndc reload rpz.local
dig @10.0.10.53 domaine-bloque.exemple                          # NXDOMAIN ou réponse de la politique
sudo journalctl -u named | grep -i "rpz"                         # catégorie rpz journalisée
```

## Journalisation et statistiques

```text /etc/bind/named.conf.options (extrait)
logging {
    channel principal { file "/var/log/named/named.log" versions 5 size 50m; print-time yes; print-category yes; severity info; };
    channel requetes  { file "/var/log/named/query.log" versions 5 size 100m; print-time yes; };
    category default   { principal; };
    category security  { principal; };
    category xfer-in   { principal; };
    category xfer-out  { principal; };
    category dnssec    { principal; };
    category rpz       { principal; };
    category queries   { requetes; };
    category lame-servers { null; };
};
statistics-channels { inet 127.0.0.1 port 8053 allow { 127.0.0.1; }; };
```

```bash
sudo install -d -o bind -g bind /var/log/named               # RHEL : -o named -g named
sudo journalctl -u named -f
sudo tail -f /var/log/named/named.log
sudo journalctl -u named --since "1 hour ago" | grep -E "denied|refused|lame|SERVFAIL|transfer"
curl -s http://127.0.0.1:8053/json/v1/server | jq '.opcodes, .rcodes'
curl -s http://127.0.0.1:8053/json/v1/zones | jq '.views[].zones[] | {name, serial}'
curl -s http://127.0.0.1:8053/json/v1/mem | jq .memory
```

## Charge, débogage, sauvegarde

```bash
# Test de charge (paquet dnsperf) : fichier « nom type » par ligne
dnsperf -s 10.0.10.53 -d requetes.txt -l 30
# named au premier plan avec traces (service arrêté)
sudo systemctl stop named
sudo named -g -d 3 -u bind                                   # RHEL : -u named
# Réseau
sudo ss -ulpn | grep ':53 '
sudo tcpdump -ni any port 53 -vv
# Sauvegarde (configuration, zones, clés DNSSEC et TSIG)
sudo rndc sync -clean
sudo sh -c 'tar czf /srv/sauvegardes/bind-$(date +%F).tar.gz /etc/bind /var/lib/bind /var/cache/bind/K*'   # glob évalué en root
```
