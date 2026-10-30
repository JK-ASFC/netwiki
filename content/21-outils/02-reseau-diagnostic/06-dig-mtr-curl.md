---
title: dig, mtr et curl
description: Trois outils de diagnostic en ligne de commande — dig (requêtes DNS, serveur ciblé, trace de la délégation, DNSSEC, transferts, réponses courtes) et équivalents Windows (Resolve-DnsName, nslookup), mtr (traceroute continu avec pertes et latence par saut, TCP/UDP, rapports) et équivalents (tracert, pathping), curl (diagnostic HTTP/HTTPS : en-têtes, temps détaillés, résolution forcée, TLS, proxy, API) et Invoke-WebRequest.
tags: [dig, dns, mtr, traceroute, curl, http, diagnostic, ligne de commande]
icon: terminal
---

## dig

**dig** (paquet `dnsutils` / `bind-utils`, ou `bind` sous macOS ; disponible sous Windows avec BIND) interroge un serveur DNS et affiche la réponse complète.

```bash
dig www.exemple.fr                               # enregistrement A via le résolveur du système
dig @10.0.10.53 www.exemple.fr AAAA              # serveur précis, type précis
dig +short exemple.fr MX
dig -x 10.0.20.11                                # résolution inverse (PTR)
dig +trace www.exemple.fr                        # suit la délégation depuis la racine
dig exemple.fr SOA +noall +answer                # seulement la réponse
dig @ns1.exemple.fr exemple.fr AXFR              # transfert de zone (doit être refusé aux inconnus)
dig +dnssec www.exemple.fr                       # signatures RRSIG, drapeau ad
dig _ldap._tcp.dc._msdcs.corp.exemple.fr SRV     # contrôleurs de domaine
dig +tcp @10.0.10.53 grande-reponse.exemple.fr TXT
```

| Élément de la réponse | Signification |
| --- | --- |
| `status: NOERROR / NXDOMAIN / SERVFAIL / REFUSED` | Nom trouvé / inexistant / échec (souvent DNSSEC ou serveur injoignable) / refus (ACL) |
| Drapeaux `aa` | Réponse **faisant autorité** |
| Drapeau `ad` | Données **validées** DNSSEC par le résolveur |
| `Query time` | Latence (0–1 ms : cache) |
| TTL | Durée de cache restante |

Équivalents Windows : `Resolve-DnsName www.exemple.fr -Server 10.0.10.53 -Type AAAA`, `nslookup -type=srv _ldap._tcp.corp.exemple.fr`. Voir aussi le dépannage de [[01-bind9/10-rndc-logs-depannage|BIND]].

## mtr

**mtr** combine `ping` et `traceroute` : il interroge chaque saut en continu et affiche **pertes** et **latence** par saut.

```bash
sudo apt install mtr-tiny        # ou mtr ; brew install mtr (macOS) ; WinMTR sous Windows
mtr 8.8.8.8                      # interactif
mtr -rwc 100 www.exemple.fr      # rapport après 100 cycles (r = report, w = wide)
mtr -T -P 443 www.exemple.fr     # sondes TCP vers le port 443 (traverse les pare-feu qui bloquent l'ICMP)
mtr -u -P 53 8.8.8.8             # sondes UDP
mtr -n -4 10.60.0.1              # sans résolution, IPv4
```

> [!TIP]
> Une perte sur un saut **intermédiaire** qui ne se répercute pas sur les sauts suivants n'est pas une perte réelle : le routeur limite simplement ses réponses ICMP. Seule une perte qui **persiste jusqu'à la destination** compte.

Équivalents Windows : `tracert -d 8.8.8.8`, `pathping -n 8.8.8.8` (statistiques par saut, plus lent), `Test-NetConnection 8.8.8.8 -TraceRoute`.

## curl

**curl** (présent sur Linux, macOS et Windows 10/11 sous le nom `curl.exe`) est l'outil universel de diagnostic HTTP(S).

```bash
curl -I https://www.exemple.fr                          # en-têtes de réponse
curl -v https://www.exemple.fr -o /dev/null             # échange complet : TLS, en-têtes
curl -sS -o /dev/null -w "dns=%{time_namelookup} tcp=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total} code=%{http_code}\n" https://www.exemple.fr
curl --resolve www.exemple.fr:443:10.0.20.11 https://www.exemple.fr/   # tester un serveur précis derrière un équilibreur
curl -H "Host: intranet.exemple.fr" http://10.0.20.11/                  # hôte virtuel
curl --cacert ac-corp.pem https://intranet.corp.exemple.fr              # AC interne
curl --tlsv1.3 --tls-max 1.3 -v https://www.exemple.fr                  # forcer une version de TLS
curl -x http://proxy.corp.exemple.fr:3128 https://www.exemple.fr        # via un proxy
curl -u admin -X POST -H "Content-Type: application/json" -d '{"action":"test"}' https://api.exemple.fr/v1/tests
curl -L --max-redirs 5 http://exemple.fr                                # suivre les redirections
curl -k https://…                                                       # ignorer le certificat : diagnostic uniquement
```

Le format `-w` décompose le temps : **DNS → TCP → TLS → premier octet (TTFB) → total**, ce qui localise la lenteur (résolution, réseau, poignée de main TLS ou application).

Sous PowerShell, `curl` est un alias d'`Invoke-WebRequest` dans Windows PowerShell 5.1 : appelez explicitement `curl.exe`. Équivalents : `Invoke-WebRequest -Uri https://www.exemple.fr -Method Head`, `Invoke-RestMethod` pour les API JSON, `Test-NetConnection srv -Port 443` pour un simple test de port.
