---
title: Scripts, paquets, cluster et intégration
description: Étendre Zeek — langage de script (événements, notices, détection d'un balayage ou d'un DNS suspect), Intelligence Framework (indicateurs), gestionnaire de paquets zkg, déploiement en cluster (manager, logger, proxy, workers avec AF_PACKET), envoi des journaux vers le SIEM, rétention et problèmes fréquents.
tags: [zeek, scripts, intel, zkg, cluster, af_packet, siem, dépannage]
icon: settings-2
---

## Scripts

Zeek est piloté par **événements** (`connection_established`, `dns_request`, `http_request`, `ssl_established`…). Un script réagit à ces événements et peut journaliser ou lever une **notice**.

```zeek /opt/zeek/share/zeek/site/detections/dns-longs.zeek
@load base/frameworks/notice

module DNSLongs;

export {
    redef enum Notice::Type += { Requete_Longue };
    const seuil = 60 &redef;
}

event dns_request(c: connection, msg: dns_msg, query: string, qtype: count, qclass: count)
    {
    # Noms très longs : exfiltration ou tunnel DNS possibles
    if ( |query| > seuil && Site::is_local_addr(c$id$orig_h) )
        NOTICE([$note=Requete_Longue, $conn=c,
                $msg=fmt("Requête DNS de %d caractères : %s", |query|, query),
                $identifier=cat(c$id$orig_h), $suppress_for=10min]);
    }
```

```zeek local.zeek (ajout)
@load ./detections/dns-longs.zeek
```

```bash
sudo /opt/zeek/bin/zeekctl check && sudo /opt/zeek/bin/zeekctl deploy
```

## Intelligence Framework

Charger des **indicateurs** (adresses, domaines, URL, empreintes, certificats) : Zeek les recherche dans tout le trafic observé et écrit `intel.log`.

```text /opt/zeek/share/zeek/site/intel/indicateurs.dat (séparateur : tabulation)
#fields	indicator	indicator_type	meta.source	meta.desc
198.51.100.66	Intel::ADDR	CERT-interne	Serveur de commande connu
exemple-malveillant.test	Intel::DOMAIN	CERT-interne	Domaine d'hameçonnage
```

```zeek local.zeek (ajout)
@load frameworks/intel/seen
@load frameworks/intel/do_notice
redef Intel::read_files += { "/opt/zeek/share/zeek/site/intel/indicateurs.dat" };
```

Les flux d'indicateurs d'une plate-forme **MISP** ou d'OpenCTI peuvent alimenter ce fichier automatiquement.

## Paquets (zkg)

```bash
sudo /opt/zeek/bin/zkg refresh
sudo /opt/zeek/bin/zkg install zeek/salesforce/ja3          # empreintes JA3/JA4 des clients TLS
sudo /opt/zeek/bin/zkg install zeek/corelight/zeek-long-connections
sudo /opt/zeek/bin/zkg list
# Ajouter « @load packages » dans local.zeek
```

## Cluster

Pour les liens rapides, Zeek répartit la charge entre plusieurs processus **workers** (sur un ou plusieurs serveurs) :

```ini /opt/zeek/etc/node.cfg (un serveur, 8 workers AF_PACKET)
[logger-1]
type=logger
host=localhost

[manager]
type=manager
host=localhost

[proxy-1]
type=proxy
host=localhost

[worker-1]
type=worker
host=localhost
interface=af_packet::ens224
lb_method=custom
lb_procs=8
pin_cpus=2,3,4,5,6,7,8,9
af_packet_fanout_id=23
af_packet_fanout_mode=AF_Packet::FANOUT_HASH
af_packet_buffer_size=128*1024*1024
```

(paquet `zeek-af_packet-plugin` intégré aux versions récentes). Comme pour Suricata, préparez l'interface (promiscuité, délestages désactivés) et surveillez les pertes (`zeekctl netstats`, `capture_loss.log`).

## Intégration et rétention

| Destination | Méthode |
| --- | --- |
| Elastic / OpenSearch | Filebeat (module `zeek`), Fluent Bit, Logstash |
| [[06-splunk/01-presentation-installation\|Splunk]] | Universal Forwarder + add-on Zeek (Corelight) |
| [[05-wazuh/01-presentation-installation\|Wazuh]], [[04-graylog/01-presentation-installation\|Graylog]] | Lecture des fichiers JSON |
| Kafka | Paquet `zeek-kafka` |

La rétention locale se règle dans `zeekctl.cfg` (`LogExpireInterval = 30day`, `LogRotationInterval = 3600`). Les journaux Zeek représentent typiquement quelques pour-cent du volume de trafic observé.

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| `zeekctl start` échoue | Erreur de script | `zeekctl diag`, `zeekctl check` |
| `capture_loss.log` élevé | Workers insuffisants, CPU, tampons | Plus de workers, `pin_cpus`, taille des tampons |
| Connexions toujours `S0` / `OTH` | Asymétrie (un seul sens capturé) | SPAN des deux sens, TAP |
| Champs `local_orig` faux | `networks.cfg` incomplet | Déclarer tous les réseaux internes |
| Disque plein | Rétention trop longue, `files` extraits | `LogExpireInterval`, extraction ciblée |
| `weird.log` très volumineux | Délestages actifs sur la carte (paquets « géants »), trafic tronqué | `ethtool -K … gro off lro off` |
