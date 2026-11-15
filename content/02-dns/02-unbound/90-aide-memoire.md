---
title: Unbound — aide-mémoire des commandes
description: Référence complète des commandes Unbound avec exemples — installation (Debian/Ubuntu, RHEL, Alpine, Arch, FreeBSD, macOS, Windows), vérification (unbound-checkconf), ancre DNSSEC et fichier racine, unbound-control (rechargement, cache, purge par type, infrastructure, redirections, zones locales et données à chaud en masse, zones insécurisées, zones autoritaires, vues, RPZ, limites de débit, options, contrôle à distance), statistiques détaillées, tests (dig, unbound-host, kdig DoT et DoH, openssl), extraits de configuration, journaux, débogage au premier plan et sauvegarde.
tags: [aide-mémoire, unbound, unbound-control, dns, dnssec, cache]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Unbound]].

## Service et vérification

```bash
sudo unbound-checkconf                         # /etc/unbound/unbound.conf
sudo unbound-checkconf /etc/unbound/unbound.conf.d/local.conf
sudo systemctl restart unbound
sudo unbound-anchor -a /var/lib/unbound/root.key     # créer/mettre à jour l'ancre DNSSEC racine
unbound -V
```

## unbound-control

```bash
sudo unbound-control-setup                       # générer les certificats de contrôle (une fois)
sudo unbound-control status
sudo unbound-control reload                      # relire la configuration (vide le cache)
sudo unbound-control reload_keep_cache           # versions récentes : garder le cache
sudo unbound-control flush www.exemple.com       # un nom
sudo unbound-control flush_zone exemple.com      # une zone entière
sudo unbound-control flush_bogus                 # entrées DNSSEC invalides
sudo unbound-control flush_requestlist
sudo unbound-control dump_cache > /tmp/cache.txt
sudo unbound-control load_cache < /tmp/cache.txt
sudo unbound-control stats_noreset | grep -E "total.num.queries|cachehits|cachemiss"
sudo unbound-control list_forwards
sudo unbound-control forward_add corp.exemple.fr 10.0.10.11 10.0.10.12
sudo unbound-control forward_remove corp.exemple.fr
sudo unbound-control local_zone "pub.exemple.net" always_nxdomain     # bloquer un domaine
sudo unbound-control local_data "intranet.exemple.fr. 300 IN A 10.0.30.20"
sudo unbound-control local_data_remove intranet.exemple.fr
sudo unbound-control list_local_zones | head
sudo unbound-control lookup www.exemple.com      # quels serveurs seraient interrogés
sudo unbound-control verbosity 3                 # temporaire
sudo unbound-control set_option log-queries: yes
```

## Tests

```bash
dig @127.0.0.1 www.exemple.com
dig @127.0.0.1 dnssec-failed.org             # doit renvoyer SERVFAIL (validation active)
dig @127.0.0.1 www.isc.org +dnssec           # drapeau ad
unbound-host -v -r www.exemple.com           # résolution avec l'état DNSSEC
kdig @10.0.10.53 +tls www.exemple.com        # DNS over TLS si activé (port 853)
```

## Extraits de configuration fréquents

```ini
# /etc/unbound/unbound.conf.d/local.conf
server:
    interface: 0.0.0.0
    access-control: 10.0.0.0/8 allow
    access-control: 0.0.0.0/0 refuse
    hide-identity: yes
    hide-version: yes
    qname-minimisation: yes
    prefetch: yes
    local-zone: "exemple.fr." transparent
    local-data: "nas.exemple.fr. IN A 10.0.40.5"
forward-zone:
    name: "corp.exemple.fr."
    forward-addr: 10.0.10.11
```

## Journaux

```bash
sudo journalctl -u unbound -f
sudo unbound-control log_reopen
```

## Installation

```bash
sudo apt install unbound dns-root-data                 # Debian / Ubuntu
sudo dnf install unbound                               # RHEL / Rocky / Alma / Fedora
sudo apk add unbound                                   # Alpine
sudo pacman -S unbound                                 # Arch
sudo pkg install unbound && sudo sysrc unbound_enable=YES   # FreeBSD (le système de base fournit aussi local-unbound)
brew install unbound                                   # macOS
# Windows : installeur MSI de NLnet Labs (service « unbound », configuration C:\Program Files\Unbound\service.conf)
sudo systemctl enable --now unbound
# Liste des serveurs racine à jour (si root-hints est utilisé)
sudo curl -fsSL -o /var/lib/unbound/root.hints https://www.internic.net/domain/named.root
```

## unbound-control : commandes complémentaires

```bash
sudo unbound-checkconf -o interface                    # valeur effective d'une option
sudo unbound-control get_option num-threads
sudo unbound-control flush_type www.exemple.com AAAA  # un type d'enregistrement
sudo unbound-control flush_negative                    # réponses négatives (NXDOMAIN) en cache
sudo unbound-control flush_infra all                   # mesures de temps de réponse des serveurs
sudo unbound-control dump_infra | head                 # serveurs amont connus (RTT, état)
sudo unbound-control dump_requestlist                  # requêtes en cours
sudo unbound-control list_stubs
sudo unbound-control list_auth_zones
sudo unbound-control auth_zone_reload exemple.fr
sudo unbound-control auth_zone_transfer exemple.fr     # retransfert depuis le primaire
sudo unbound-control insecure_add exemple.lan          # pas de validation DNSSEC pour un domaine interne
sudo unbound-control insecure_remove exemple.lan
sudo unbound-control list_insecure
sudo unbound-control view_list_local_zones invites
sudo unbound-control rpz_disable rpz.local
sudo unbound-control rpz_enable rpz.local
sudo unbound-control ratelimit_list
sudo unbound-control ip_ratelimit_list
sudo unbound-control stats                             # remet les compteurs à zéro (stats_noreset pour lire seulement)

# Blocage en masse : une zone par ligne sur l'entrée standard
printf '%s always_nxdomain\n' publicite.exemple.net traceur.exemple.org | sudo unbound-control local_zones
# Données locales en masse
printf '%s\n' "imprimante.exemple.fr. 300 IN A 10.0.40.20" "nas.exemple.fr. 300 IN A 10.0.40.5" | sudo unbound-control local_datas

# Contrôler un autre serveur (certificats de unbound-control-setup copiés)
sudo unbound-control -s 10.0.10.54@8953 status
```

## Statistiques utiles

```bash
# extended-statistics: yes dans la configuration pour le détail par type et code de retour
sudo unbound-control stats_noreset | grep -E "^total\.(num\.(queries|cachehits|cachemiss|prefetch)|requestlist\.avg|recursion\.time\.(avg|median))="
sudo unbound-control stats_noreset | grep -E "^num\.answer\.rcode\.(SERVFAIL|NXDOMAIN)="
sudo unbound-control stats_noreset | grep -E "^num\.query\.type\.(A|AAAA|PTR|HTTPS)="
sudo unbound-control stats_noreset | grep -E "^mem\."
```

| Compteur | Lecture |
| --- | --- |
| `total.num.cachehits` / `total.num.queries` | Taux de réussite du cache (souvent plus de 70 % en entreprise) |
| `total.requestlist.avg` | Requêtes en attente : une valeur qui monte signale un amont lent ou injoignable |
| `total.recursion.time.avg` | Temps de résolution des absences de cache |
| `num.answer.rcode.SERVFAIL` | Échecs : DNSSEC invalide, amont injoignable |

## Tests chiffrés et débogage

```bash
kdig @10.0.10.53 +tls-ca +tls-host=dns.exemple.fr www.exemple.com      # DoT avec vérification du certificat
kdig @10.0.10.53 +https www.exemple.com                                  # DoH
openssl s_client -connect 10.0.10.53:853 -servername dns.exemple.fr </dev/null | openssl x509 -noout -subject -enddate
# Unbound au premier plan, très verbeux (service arrêté)
sudo systemctl stop unbound
sudo unbound -d -vvv -c /etc/unbound/unbound.conf
sudo tcpdump -ni any port 53 or port 853
```

## Sauvegarde

```bash
sudo tar czf /srv/sauvegardes/unbound-$(date +%F).tar.gz /etc/unbound /var/lib/unbound/root.key
```
