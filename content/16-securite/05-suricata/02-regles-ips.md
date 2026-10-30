---
title: Règles, réglage fin et mode IPS
description: Gérer les règles Suricata — sources (ET Open, ET Pro, abuse.ch, OISF), suricata-update (activer, désactiver, modifier, seuils), syntaxe d'une règle (en-tête, options, flux, contenu, métadonnées), règles locales, réduction des faux positifs (suppressions, seuils, threshold.config), et passage en IPS (AF_PACKET en coupure, NFQUEUE, actions drop/reject).
tags: [suricata, règles, suricata-update, et open, faux positifs, ips, nfqueue, af_packet]
icon: settings-2
---

## Sources de règles

| Source | Licence |
| --- | --- |
| **ET Open** (Proofpoint) | Gratuite, par défaut |
| ET Pro | Commerciale (règles plus récentes et nombreuses) |
| abuse.ch (SSL Blacklist, URLhaus), OISF Traffic ID, PT Research… | Gratuites |
| Règles locales | Vos détections propres |

```bash
sudo suricata-update update-sources
sudo suricata-update list-sources --free
sudo suricata-update enable-source sslbl/ssl-fp-blacklist
sudo suricata-update                         # fusionne tout dans suricata.rules
sudo suricatasc -c reload-rules              # rechargement à chaud (ou systemctl reload)
```

### Activer, désactiver, modifier

```text /etc/suricata/disable.conf
# Désactiver par identifiant ou par motif
2013504
group:emerging-games.rules
re:ET POLICY .* User-Agent
```

```text /etc/suricata/enable.conf
group:emerging-policy.rules
```

```text /etc/suricata/drop.conf (en IPS : passer ces règles en « drop »)
group:emerging-exploit.rules
re:ET MALWARE
```

```text /etc/suricata/modify.conf
# Modifier une règle à la volée : identifiant, motif, remplacement
2019401 "alert" "drop"
```

`suricata-update` lit ces fichiers à chaque mise à jour : vos choix survivent aux nouvelles versions des règles.

## Syntaxe d'une règle

```suricata
alert http $EXTERNAL_NET any -> $HTTP_SERVERS any (msg:"LOCAL Tentative de traversée de répertoire"; \
  flow:established,to_server; http.uri; content:"../"; fast_pattern; content:"/etc/passwd"; distance:0; \
  classtype:web-application-attack; sid:9000001; rev:1; metadata:affected_product Web_Server, created_at 2025_10_29;)
```

| Partie | Contenu |
| --- | --- |
| Action | `alert`, `drop`, `reject`, `pass` |
| En-tête | Protocole, source → destination (variables `$HOME_NET`…) |
| `flow` | Sens et état de la connexion |
| Tampons | `http.uri`, `http.host`, `dns.query`, `tls.sni`, `file.data`… |
| `content`, `pcre` | Motifs |
| `sid`, `rev` | Identifiant (≥ 9000000 pour les règles locales) et révision |

```suricata /var/lib/suricata/rules/local.rules (exemples)
alert dns $HOME_NET any -> any any (msg:"LOCAL Requête vers un domaine interdit"; dns.query; content:"exemple-malveillant.test"; nocase; endswith; sid:9000010; rev:1;)
alert tls $HOME_NET any -> $EXTERNAL_NET any (msg:"LOCAL Certificat auto-signé vers Internet"; tls.cert_issuer; content:"CN=localhost"; sid:9000011; rev:1;)
alert tcp $EXTERNAL_NET any -> $HOME_NET 3389 (msg:"LOCAL RDP depuis Internet"; flow:to_server; flags:S; sid:9000012; rev:1;)
```

Déclarez `local.rules` dans `rule-files` (ou `suricata-update --local /var/lib/suricata/rules/local.rules`).

## Réduire les faux positifs

```text /etc/suricata/threshold.config
# Ne plus alerter pour ce scanner de vulnérabilités interne
suppress gen_id 1, sig_id 2013028, track by_src, ip 10.0.99.25
# Limiter une règle bavarde à une alerte par minute et par source
threshold gen_id 1, sig_id 2210045, type limit, track by_src, count 1, seconds 60
```

Démarche : regarder les 20 signatures les plus fréquentes, vérifier leur pertinence, puis supprimer (par source), seuiller ou désactiver.

## Mode IPS

### AF_PACKET en coupure (pont entre deux interfaces)

```yaml /etc/suricata/suricata.yaml (extrait)
af-packet:
  - interface: ens224
    copy-mode: ips
    copy-iface: ens256
    cluster-id: 98
    cluster-type: cluster_flow
  - interface: ens256
    copy-mode: ips
    copy-iface: ens224
    cluster-id: 97
    cluster-type: cluster_flow
```

### NFQUEUE (routeur ou pare-feu Linux)

```bash
sudo nft add rule inet filter forward queue num 0 bypass      # « bypass » : laisser passer si Suricata est arrêté
sudo suricata -c /etc/suricata/suricata.yaml -q 0
```

> [!WARNING]
> En IPS, une règle mal ciblée **coupe du trafic légitime** et la sonde devient un point de panne. Passez d'abord des mois en IDS, convertissez en `drop` un ensemble restreint de règles fiables (`drop.conf`), et prévoyez un contournement matériel ou logiciel (`bypass`, carte avec *fail-open*).
