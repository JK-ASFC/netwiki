---
title: Entrées, Sidecar, flux, pipelines et index
description: Recevoir les journaux dans Graylog (entrées Syslog UDP/TCP, GELF, Beats, ports non privilégiés), collecter sur les serveurs avec Graylog Sidecar (Filebeat, Winlogbeat, NXLog gérés centralement), router par flux, normaliser avec les pipelines (règles, grok, extraction clé-valeur), gérer les ensembles d'index (rotation, rétention) et rechercher.
tags: [graylog, entrées, syslog, gelf, sidecar, flux, pipelines, index sets, recherche]
icon: settings-2
---

## Entrées

*System → Inputs* : choisir le type, le port, les nœuds.

| Entrée | Usage |
| --- | --- |
| **Syslog UDP / TCP** | Équipements réseau, serveurs (rsyslog) |
| **GELF** UDP/TCP/HTTP | Applications, Docker (pilote `gelf`), Fluent Bit |
| **Beats** | Filebeat, Winlogbeat (via Sidecar) |
| Raw/Plaintext | Formats non syslog |
| CEF, NetFlow, IPFIX | Pare-feu, flux réseau |

> [!NOTE]
> Graylog ne s'exécute pas en root : utilisez des ports ≥ 1024 (ex. **1514** pour syslog) et, si les équipements ne peuvent envoyer qu'au port 514, redirigez-le : `iptables -t nat -A PREROUTING -p udp --dport 514 -j REDIRECT --to-ports 1514`.

Créez une **entrée par type de source** (équipements réseau, pare-feu, serveurs) : cela facilite le routage et l'attribution d'un champ statique (*Add static field*, ex. `type_source=reseau`).

## Graylog Sidecar

Le **Sidecar** est un agent léger qui récupère sa configuration depuis Graylog et pilote un collecteur (Filebeat, Winlogbeat, NXLog) : configuration centralisée des collecteurs sur des centaines de serveurs.

```bash
# Linux
sudo apt install graylog-sidecar        # dépôt Graylog
sudo graylog-sidecar -service install
```

```yaml /etc/graylog/sidecar/sidecar.yml (extrait)
server_url: "https://graylog.corp.exemple.fr/api/"
server_api_token: "<jeton créé pour l'utilisateur graylog-sidecar>"
node_name: "srv-web-01"
tags: [ "linux", "web" ]
```

```powershell
# Windows
.\graylog_sidecar_installer_1.5.x.exe /S -SERVERURL=https://graylog.corp.exemple.fr/api/ -APITOKEN=<jeton> -TAGS="windows,ad"
& "C:\Program Files\Graylog\sidecar\graylog-sidecar.exe" -service install
& "C:\Program Files\Graylog\sidecar\graylog-sidecar.exe" -service start
```

Dans *System → Sidecars*, créez des configurations (ex. Winlogbeat : journaux Security, System, Sysmon) et associez-les aux Sidecars par **étiquettes**.

## Flux (streams)

Un **flux** regroupe les messages selon des règles (champ `source` commence par `fw-`, `type_source` = `reseau`, gravité ≤ 3…). Les flux servent à :

- router vers un **ensemble d'index** (rétention différente par type de journaux) ;
- donner des **droits** (l'équipe réseau ne voit que les flux réseau) ;
- déclencher des **alertes** ;
- appliquer des **pipelines** spécifiques.

Cochez *Remove matches from 'Default Stream'* pour éviter le double stockage.

## Pipelines

*System → Pipelines* : des **règles** écrites dans un langage simple, organisées en étapes et rattachées à des flux.

```graylog Règle : messages Cisco IOS
rule "cisco : mnémonique et gravité"
when
  has_field("message") && regex("%[A-Z0-9_]+-[0-7]-[A-Z0-9_]+:", to_string($message.message)).matches == true
then
  let m = grok(pattern: "%%{WORD:cisco_facility}-%{INT:cisco_severity}-%{WORD:cisco_mnemonic}: %{GREEDYDATA:cisco_message}",
               value: to_string($message.message), only_named_captures: true);
  set_fields(m);
  set_field("vendor", "cisco");
end
```

```graylog Règle : pare-feu en clé=valeur (FortiGate)
rule "fortigate : extraire les paires clé=valeur"
when
  has_field("devname")  || contains(to_string($message.message), "devname=")
then
  set_fields(key_value(value: to_string($message.message), trim_value_chars: "\"", trim_key_chars: "\""));
end
```

| Fonction | Usage |
| --- | --- |
| `grok`, `regex` | Extraire des champs |
| `key_value`, `parse_json` | Formats structurés |
| `lookup_value` | Enrichir à partir d'une table (CSV, DNS, MaxMind GeoIP, API) |
| `set_field`, `rename_field`, `remove_field` | Normaliser |
| `drop_message` | Éliminer le bruit |
| `route_to_stream` | Router |

Les anciens **extracteurs** (par entrée) restent disponibles mais les pipelines sont recommandés.

## Ensembles d'index

*System → Indices* : un ensemble d'index par famille de journaux (réseau, sécurité, applications), avec :

| Réglage | Exemple |
| --- | --- |
| Rotation | Par durée (1 jour) ou taille |
| Rétention | Supprimer au-delà de N index (ex. 90 jours), ou fermer/archiver |
| Shards / répliques | Selon le nombre de nœuds de stockage |

## Recherche

Syntaxe de type Lucene :

```text
source:r1-paris AND cisco_mnemonic:UPDOWN
type_source:pare-feu AND action:deny AND NOT srcip:10.0.0.0/8
_exists_:user AND event_id:4625
```

Enregistrez les recherches utiles, créez des **tableaux de bord** (widgets agrégés) et utilisez les **paramètres** pour des recherches réutilisables.
