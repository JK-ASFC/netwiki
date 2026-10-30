---
title: Zeek — aide-mémoire des commandes
description: Commandes Zeek avec exemples — zeekctl (install, deploy, status, check, restart, diag, netstats), analyse d'une capture (zeek -r), lecture des journaux (zeek-cut, jq en sortie JSON), journaux clés (conn, dns, http, ssl, files, notice, weird, x509), scripts locaux et paquets (zkg), requêtes d'investigation usuelles.
tags: [aide-mémoire, zeek, nsm, zeekctl, zeek-cut, analyse réseau]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Zeek]]. Installation d'exemple : `/opt/zeek`.

## zeekctl

```bash
export PATH=/opt/zeek/bin:$PATH
sudo zeekctl install          # première fois
sudo zeekctl check            # vérifier les scripts
sudo zeekctl deploy           # appliquer la configuration et redémarrer
sudo zeekctl status
sudo zeekctl netstats         # paquets reçus / perdus
sudo zeekctl diag
sudo zeekctl stop
```

```text
# /opt/zeek/etc/node.cfg (instance simple)
[zeek]
type=standalone
host=localhost
interface=af_packet::eth1
```

## Analyse hors ligne

```bash
zeek -r capture.pcap                                  # journaux dans le répertoire courant
zeek -r capture.pcap LogAscii::use_json=T local       # sortie JSON, avec les scripts locaux
```

## Lire les journaux

```bash
cd /opt/zeek/logs/current
zeek-cut ts id.orig_h id.resp_h id.resp_p proto service duration < conn.log | head
zeek-cut -d ts query answers < dns.log | tail
zeek-cut host uri status_code user_agent < http.log | head
zeek-cut server_name version validation_status < ssl.log | sort | uniq -c | sort -rn | head
zeek-cut note msg src < notice.log
# Connexions les plus longues
zeek-cut id.orig_h id.resp_h id.resp_p duration < conn.log | sort -k4 -nr | head
# Plus gros volumes sortants
zeek-cut id.orig_h id.resp_h orig_bytes < conn.log | sort -k3 -nr | head
# Journaux archivés compressés
zcat /opt/zeek/logs/2026-10-29/dns.*.log.gz | zeek-cut query | sort | uniq -c | sort -rn | head
# Sortie JSON
jq -c 'select(.id.resp_p == 3389) | {ts, src: ."id.orig_h", dst: ."id.resp_h"}' conn.log | head
```

| Journal | Contenu |
| --- | --- |
| `conn.log` | Toutes les connexions (durée, octets, état) |
| `dns.log`, `http.log`, `ssl.log`, `x509.log` | Protocoles applicatifs |
| `files.log` | Fichiers transférés (empreintes) |
| `notice.log` | Événements remarquables détectés par les scripts |
| `weird.log` | Anomalies protocolaires |

## Scripts et paquets

```bash
zkg refresh
zkg install zeek/corelight/zeek-community-id
zkg list
echo '@load packages' | sudo tee -a /opt/zeek/share/zeek/site/local.zeek
sudo zeekctl deploy
```
