---
title: Présentation et installation
description: Zeek (ex-Bro), plate-forme de surveillance de la sécurité réseau — journaux de protocoles (conn, dns, http, ssl, x509, files, smb, notice, weird), différence avec un IDS à signatures, installation depuis les dépôts openSUSE Build Service sous Debian/Ubuntu et RHEL, zeekctl en mode autonome, configuration (node.cfg, networks.cfg, local.zeek), journaux JSON et premiers usages.
tags: [zeek, nsm, journaux réseau, conn.log, dns.log, installation, zeekctl]
icon: info
---

**Zeek** (anciennement Bro, licence BSD) observe le trafic et produit des **journaux structurés** décrivant chaque connexion et chaque transaction de protocole (requêtes DNS, sessions HTTP, certificats TLS, fichiers transférés, authentifications SMB/Kerberos…). Là où Suricata/Snort cherchent des **signatures**, Zeek fournit le **contexte** complet du trafic, et un **langage de script** pour écrire des détections comportementales. C'est l'outil de référence pour la chasse aux menaces et les enquêtes.

## Journaux principaux

| Journal | Contenu |
| --- | --- |
| `conn.log` | Chaque connexion : adresses, ports, durée, octets, état (`conn_state`), service détecté |
| `dns.log` | Requêtes et réponses DNS |
| `http.log` | Méthodes, hôtes, URI, User-Agent, codes de réponse |
| `ssl.log` / `x509.log` | Versions TLS, SNI, chiffrements, certificats (émetteur, validité) |
| `files.log` | Fichiers transférés (type MIME, empreintes) |
| `smb_files.log`, `smb_mapping.log`, `kerberos.log`, `ntlm.log`, `dce_rpc.log` | Activité Windows (mouvements latéraux) |
| `ssh.log`, `rdp.log`, `ftp.log`, `smtp.log`, `dhcp.log` | Autres protocoles |
| `notice.log` | Événements remarquables signalés par les scripts |
| `weird.log` | Anomalies de protocole |
| `software.log`, `known_hosts.log`, `known_services.log` | Inventaire passif |

## Installation

Les paquets officiels sont publiés sur l'**openSUSE Build Service** :

```bash
# Debian 12
echo 'deb http://download.opensuse.org/repositories/security:/zeek/Debian_12/ /' | sudo tee /etc/apt/sources.list.d/security:zeek.list
curl -fsSL https://download.opensuse.org/repositories/security:zeek/Debian_12/Release.key | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/security_zeek.gpg >/dev/null
sudo apt update && sudo apt install zeek
# RHEL 9 / Rocky / Alma : dépôt « security:zeek » pour la distribution, puis dnf install zeek
echo 'export PATH=/opt/zeek/bin:$PATH' | sudo tee /etc/profile.d/zeek.sh
```

Zeek s'installe dans `/opt/zeek`. macOS : `brew install zeek` (analyse de captures). Image Docker `zeek/zeek`.

## Configuration (mode autonome)

```ini /opt/zeek/etc/node.cfg
[zeek]
type=standalone
host=localhost
interface=ens224
```

```text /opt/zeek/etc/networks.cfg
10.0.0.0/8          Réseaux internes
192.168.0.0/16      Réseaux internes
172.16.0.0/12       Réseaux internes
```

```zeek /opt/zeek/share/zeek/site/local.zeek (ajouts)
# Journaux en JSON (ingestion SIEM simplifiée)
@load policy/tuning/json-logs.zeek
# Identifiant Community ID pour corréler avec Suricata et les pare-feu
@load policy/protocols/conn/community-id-logging
# Empreintes des fichiers, extraction de certificats, inventaire
@load frameworks/files/hash-all-files
@load policy/protocols/ssl/validate-certs
@load policy/protocols/conn/known-hosts
@load policy/protocols/conn/known-services
```

```bash
sudo /opt/zeek/bin/zeekctl install        # déploie la configuration
sudo /opt/zeek/bin/zeekctl start
sudo /opt/zeek/bin/zeekctl status
ls /opt/zeek/logs/current/                # journaux en cours ; archives datées dans /opt/zeek/logs/AAAA-MM-JJ/
```

Ajoutez `zeekctl cron` à la crontab (toutes les 5 minutes) : il redémarre Zeek en cas d'arrêt et gère l'archivage.

## Premiers usages

```bash
cd /opt/zeek/logs/current
# Top des destinations externes en volume (format TSV : outil zeek-cut)
zeek-cut id.orig_h id.resp_h resp_bytes < conn.log | sort -k3 -nr | head
# Domaines interrogés les plus fréquents (JSON : jq)
jq -r '.query' dns.log | sort | uniq -c | sort -nr | head
# Certificats expirés ou auto-signés vus sur le réseau
jq -r 'select(.validation_status != "ok") | [.server_name, .validation_status] | @tsv' ssl.log | sort -u
# Analyser une capture hors ligne
zeek -C -r incident.pcap local
```

## Suite

[[02-scripts-cluster-integration|Scripts, paquets, cluster et intégration]]
