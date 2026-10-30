---
title: Collecte, index, sourcetypes et SPL
description: Organiser la collecte dans Splunk — applications et fichiers .conf (inputs, outputs, props, transforms, indexes), index et rétention, sourcetypes et extraction des horodatages, add-ons (Windows, Unix/Linux, Cisco, Palo Alto, Fortinet), syslog via Splunk Connect for Syslog, HTTP Event Collector, et langage de recherche SPL avec exemples réseau et sécurité.
tags: [splunk, inputs.conf, indexes.conf, props.conf, sourcetype, sc4s, hec, spl]
icon: settings-2
---

## Fichiers de configuration

La configuration se range dans des **applications** (`$SPLUNK_HOME/etc/apps/<app>/local/`), distribuées par le serveur de déploiement. Ordre de priorité vérifiable avec `btool`.

| Fichier | Rôle |
| --- | --- |
| `inputs.conf` | Ce qui est collecté (fichiers, journaux Windows, ports, scripts) |
| `outputs.conf` | Où envoyer (forwarders → indexeurs) |
| `props.conf` / `transforms.conf` | Analyse : sourcetypes, horodatages, découpage des événements, extractions, masquage, routage |
| `indexes.conf` | Index, emplacements, rétention |
| `server.conf`, `web.conf`, `authentication.conf`, `authorize.conf` | Serveur, interface, authentification, rôles |

```splunkconf etc/apps/collecte_linux/local/inputs.conf (forwarders Linux)
[monitor:///var/log/secure]
index = os_linux
sourcetype = linux_secure

[monitor:///var/log/nginx/access.log]
index = web
sourcetype = nginx:plus:kv

[journald://systeme]
index = os_linux
```

```splunkconf etc/apps/collecte_windows/local/inputs.conf (forwarders Windows)
[WinEventLog://Security]
index = wineventlog
disabled = 0
renderXml = true
blacklist1 = EventCode="5156|5158"

[WinEventLog://Microsoft-Windows-Sysmon/Operational]
index = sysmon
renderXml = true
```

```splunkconf etc/apps/sortie/local/outputs.conf
[tcpout]
defaultGroup = indexeurs

[tcpout:indexeurs]
server = idx1.corp.exemple.fr:9997, idx2.corp.exemple.fr:9997
useACK = true
clientCert = $SPLUNK_HOME/etc/auth/forwarder.pem
sslVerifyServerCert = true
```

## Index et rétention

```splunkconf etc/apps/index_entreprise/local/indexes.conf (indexeurs)
[reseau]
homePath   = $SPLUNK_DB/reseau/db
coldPath   = $SPLUNK_DB/reseau/colddb
thawedPath = $SPLUNK_DB/reseau/thaweddb
# 1 an, puis gel (suppression ou archivage) ; pas de commentaire en fin de ligne dans les fichiers .conf
frozenTimePeriodInSecs = 31536000
maxTotalDataSizeMB = 500000
```

Créez des index par **domaine et rétention** (réseau, sécurité, applications) : droits et durées de conservation s'appliquent par index.

## Sourcetypes et horodatages

```splunkconf etc/apps/analyse_appli/local/props.conf
[appli:inventaire]
SHOULD_LINEMERGE = false
LINE_BREAKER = ([\r\n]+)\d{4}-\d{2}-\d{2}
TIME_PREFIX = ^
TIME_FORMAT = %Y-%m-%d %H:%M:%S.%3N%z
MAX_TIMESTAMP_LOOKAHEAD = 30
TRUNCATE = 10000
KV_MODE = auto
```

Les **add-ons** (*Technology Add-ons*, Splunkbase) fournissent sourcetypes, extractions et mise en conformité au modèle **CIM** : *Splunk Add-on for Microsoft Windows*, *for Unix and Linux*, *for Cisco IOS/ASA*, *Palo Alto*, *Fortinet*, *Microsoft Cloud Services*… Installez-les sur les forwarders lourds, les indexeurs et les têtes de recherche selon leur documentation.

## Syslog : Splunk Connect for Syslog (SC4S)

Ne faites pas recevoir le syslog directement par Splunk : **SC4S** (conteneur basé sur syslog-ng) reçoit le syslog des équipements, identifie la source (Cisco, Fortinet, Palo Alto…), applique le bon sourcetype et l'index, puis envoie à Splunk par **HEC**.

```ini /opt/sc4s/env_file
SC4S_DEST_SPLUNK_HEC_DEFAULT_URL=https://idx1.corp.exemple.fr:8088
SC4S_DEST_SPLUNK_HEC_DEFAULT_TOKEN=00000000-0000-0000-0000-000000000000
SC4S_DEST_SPLUNK_HEC_DEFAULT_TLS_VERIFY=yes
```

## HTTP Event Collector (HEC)

*Paramètres → Entrées de données → HTTP Event Collector* : créer un jeton (index autorisés, sourcetype). Applications, Fluent Bit, scripts envoient en JSON :

```bash
curl -s https://idx1.corp.exemple.fr:8088/services/collector/event \
  -H "Authorization: Splunk $HEC_TOKEN" \
  -d '{"index":"web","sourcetype":"_json","event":{"action":"deploiement","version":"1.4.2"}}'
```

## SPL : exemples

```spl
index=reseau sourcetype=cisco:ios "%LINK-3-UPDOWN"
| rex "Interface (?<interface>\S+), changed state to (?<etat>\w+)"
| stats count latest(etat) AS dernier_etat BY host interface
| sort - count
```

```spl
index=wineventlog EventCode=4625
| stats count dc(TargetUserName) AS comptes values(TargetUserName) AS liste BY src_ip
| where count > 20
```

```spl
index=pare_feu action=blocked earliest=-24h
| timechart span=1h count BY dest_port limit=10
```

```spl
| tstats count WHERE index=* BY index sourcetype _time span=1d
```

| Commande | Usage |
| --- | --- |
| `stats`, `chart`, `timechart` | Agrégations |
| `rex`, `eval`, `where` | Extraction, calcul, filtrage |
| `lookup` / `inputlookup` | Enrichissement (inventaire, listes) |
| `transaction`, `join` | Corrélation (coûteuses : préférer `stats`) |
| `tstats` | Recherches très rapides sur les métadonnées et modèles de données accélérés |

Filtrez **tôt** (index, sourcetype, période, termes) pour des recherches rapides.
