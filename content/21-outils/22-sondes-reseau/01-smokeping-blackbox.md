---
title: Smokeping, Blackbox Exporter et fping exporter
description: Surveillance active de la latence et de la disponibilité — Smokeping (Perl, GPL : sondes FPing, DNS, HTTP, mesure de la latence et de la gigue, graphes RRD caractéristiques, alertes, maître/esclaves, Apache/FastCGI), Blackbox Exporter (Prometheus, Apache 2.0 : sondes ICMP, TCP, HTTP/HTTPS, DNS, TLS et expiration de certificat, modules, relabeling, requêtes PromQL, alertes) et fping exporter (latence et perte multi-cibles pour Prometheus) ; intégration Grafana et choix.
tags: [smokeping, blackbox exporter, fping, prometheus, latence, perte de paquets, supervision, sondes]
icon: activity
---

Ces outils font de la **surveillance active** : ils émettent des requêtes (ping, HTTP, DNS…) vers des cibles et mesurent **latence**, **perte de paquets** et **disponibilité**. Complémentaires de la supervision passive (SNMP, agents), ils répondent à « le lien est-il stable ? », « le service répond-il de l'extérieur ? ».

## Smokeping

**Smokeping** mesure la latence en continu et produit des graphes reconnaissables où la « fumée » grise représente la **variation** (gigue) autour de la médiane, et la couleur la **perte de paquets**. Idéal pour qualifier un lien WAN, une liaison opérateur ou une connexion Wi-Fi dans la durée.

```bash
sudo apt install smokeping           # tire fping, rrdtool, Perl ; service + CGI Apache
```

```text /etc/smokeping/config.d/Targets
*** Targets ***
probe = FPing
menu = Accueil
title = Supervision latence

+ Sites
menu = Sites distants
title = Latence vers les sites

++ Lyon
menu = Lyon
title = Routeur Lyon
host = 192.0.2.1

++ Paris
menu = Paris
host = 198.51.100.1

+ Operateurs
++ DNS_FAI
probe = DNS
host = 9.9.9.9
```

```bash
sudo systemctl enable --now smokeping
sudo smokeping --check              # vérifier la configuration
# Interface : http://serveur/smokeping/smokeping.cgi
```

- **Sondes** : FPing (ICMP), DNS, EchoPingHttp(s), TCP, SSH… ; une cible peut utiliser une sonde différente.
- **Alertes** : section `*** Alerts ***` (ex. `loss` : perte soutenue, `bigloss`, `rttdetect` : hausse de latence), notifiées par courriel ou script.
- **Maître/esclaves** : des sondes réparties mesurent depuis plusieurs points de vue et remontent au maître.
- Données en **RRD** (taille fixe, pas de purge à gérer).

## Blackbox Exporter

Sonde de l'écosystème **Prometheus** : Prometheus interroge le Blackbox Exporter, qui teste la cible et renvoie des métriques (succès, durée, code HTTP, **expiration du certificat TLS**).

```yaml blackbox.yml
modules:
  http_2xx:
    prober: http
    timeout: 5s
    http: { preferred_ip_protocol: ip4, fail_if_not_ssl: true, valid_status_codes: [200] }
  icmp:
    prober: icmp
    timeout: 5s
  tcp_connect:
    prober: tcp
  dns_a:
    prober: dns
    dns: { query_name: intranet.exemple.fr, query_type: A }
```

```bash
docker run -d --name blackbox -p 127.0.0.1:9115:9115 \
  -v /srv/blackbox/blackbox.yml:/etc/blackbox_exporter/config.yml \
  prom/blackbox-exporter:latest
# Test manuel d'une cible :
curl 'http://127.0.0.1:9115/probe?module=http_2xx&target=https://intranet.exemple.fr' | grep -E 'probe_success|probe_http_status_code|probe_ssl_earliest_cert_expiry'
```

```yaml prometheus.yml (extrait)
scrape_configs:
  - job_name: blackbox-http
    metrics_path: /probe
    params: { module: [http_2xx] }
    static_configs:
      - targets: [ https://intranet.exemple.fr, https://portail.exemple.fr ]
    relabel_configs:
      - { source_labels: [__address__], target_label: __param_target }
      - { source_labels: [__param_target], target_label: instance }
      - { target_label: __address__, replacement: blackbox:9115 }
```

Exemples d'alertes PromQL :

```promql
probe_success == 0                                                   # cible injoignable
probe_ssl_earliest_cert_expiry - time() < 15 * 24 * 3600             # certificat expire sous 15 jours
probe_duration_seconds > 2                                           # réponse trop lente
```

## fping exporter

Expose pour Prometheus la **latence et la perte** vers plusieurs cibles (fondé sur `fping`), pratique pour un tableau de bord Grafana « latence multi-sites » façon Smokeping.

```bash
docker run -d --name fping-exporter --cap-add NET_RAW -p 127.0.0.1:9605:9605 \
  czerwonk/ping_exporter --config.path=/config/config.yml
# métriques : ping_rtt_seconds, ping_loss_ratio par cible
```

## Choisir

| Besoin | Outil |
| --- | --- |
| Graphes de latence/gigue autonomes, qualifier un lien | Smokeping |
| Disponibilité de services et certificats dans Prometheus/Grafana | Blackbox Exporter |
| Latence/perte multi-cibles dans Prometheus | fping exporter (ou Smokeping) |
| Débit (pas latence) | [[21-tests-debit/01-iperf2-openspeedtest-librespeed\|iperf, LibreSpeed]] |

Ces sondes génèrent du trafic vers les cibles : rester dans un volume raisonnable et ne sonder que des hôtes que l'on administre ou que l'on est autorisé à tester.

Commandes : [[90-aide-memoire|aide-mémoire]].
