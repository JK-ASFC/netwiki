---
title: PowerDNS Recursor
description: Installer et configurer le résolveur PowerDNS Recursor (format YAML 5.x), contrôle d'accès, redirection vers Active Directory, validation DNSSEC, RPZ, scripts Lua, cache et performances, rec_control et supervision.
tags: [powerdns, recursor, résolveur, dnssec, rpz, lua, cache]
icon: refresh-cw
---

## Installation

```bash
# Debian (dépôt repo.powerdns.com, branche « rec-52 » par exemple)
curl https://repo.powerdns.com/FD380FBB-pub.asc | sudo tee /etc/apt/keyrings/rec-52-pub.asc
echo "deb [signed-by=/etc/apt/keyrings/rec-52-pub.asc] http://repo.powerdns.com/debian bookworm-rec-52 main" | sudo tee /etc/apt/sources.list.d/pdns-rec.list
printf "Package: pdns-*\nPin: origin repo.powerdns.com\nPin-Priority: 600\n" | sudo tee /etc/apt/preferences.d/rec-52
sudo apt update && sudo apt install pdns-recursor

# RHEL / Rocky / Alma
sudo dnf install pdns-recursor        # EPEL, ou dépôt repo.powerdns.com
sudo systemctl enable --now pdns-recursor
```

Fichiers : `/etc/powerdns/recursor.yml` (Debian) ou `/etc/pdns-recursor/recursor.yml` (RHEL). Les versions 5.x lisent encore l'ancien format `recursor.conf` (`clé=valeur`) ; l'outil `rec_control show-yaml` convertit une ancienne configuration.

## Configuration YAML

```yaml /etc/powerdns/recursor.yml
incoming:
  listen:
    - 10.0.10.53
    - 127.0.0.1
    - '::1'
  allow_from:
    - 127.0.0.0/8
    - '::1/128'
    - 10.0.0.0/8
    - 192.168.0.0/16
  max_tcp_clients: 512

outgoing:
  source_address:
    - 0.0.0.0
    - '::'

recursor:
  threads: 4
  security_poll_suffix: ''        # pas de requête de vérification de version vers PowerDNS
  server_id: ''                   # ne pas révéler le nom du serveur
  version_string: anonymous
  forward_zones:
    - zone: corp.exemple.fr
      forwarders: [10.0.10.11, 10.0.10.12]
    - zone: 10.in-addr.arpa
      forwarders: [10.0.10.11, 10.0.10.12]
  forward_zones_recurse:          # transmettre en demandant la récursion (vers un résolveur)
    - zone: partenaire.lan
      forwarders: [172.20.0.53]

dnssec:
  validation: validate            # process-no-validate | process | log-fail | validate
  negative_trustanchors:
    - name: corp.exemple.fr       # zone AD non signée sous un parent signé
      reason: Zone Active Directory interne

recordcache:
  max_entries: 2000000
  max_ttl: 86400

packetcache:
  max_entries: 1000000
  ttl: 3600

webservice:
  webserver: true
  address: 127.0.0.1
  port: 8082
  allow_from: [127.0.0.1, 10.0.30.0/24]
  api_key: CleApiRecursor

logging:
  loglevel: 4
  quiet: true
  common_errors: false
```

```bash
sudo pdns_recursor --config=check
sudo systemctl restart pdns-recursor
dig @10.0.10.53 www.isc.org +dnssec | grep flags        # « ad »
dig @10.0.10.53 dc01.corp.exemple.fr +short             # via la redirection AD
```

| Mode `dnssec.validation` | Effet |
| --- | --- |
| `process-no-validate` | Transmet les données DNSSEC sans valider (défaut ancien) |
| `process` | Valide seulement si le client le demande (bit DO/AD) |
| `log-fail` | Valide et journalise les échecs sans bloquer (période de test) |
| `validate` | Valide toujours, renvoie SERVFAIL sur échec (**recommandé**) |

## RPZ (filtrage)

Les RPZ se déclarent dans la configuration Lua (`lua_config_file`) ou dans la section YAML dédiée selon la version :

```yaml /etc/powerdns/recursor.yml (extrait)
recursor:
  lua_config_file: /etc/powerdns/recursor.lua
```

```lua /etc/powerdns/recursor.lua
-- RPZ locale (fichier) et flux distant (transfert de zone)
rpzFile("/etc/powerdns/rpz.local.zone", { policyName = "rpz-local", defpol = Policy.NXDOMAIN })
rpzPrimary({"192.0.2.10"}, "rpz.menaces.example", { refresh = 300, policyName = "menaces" })
```

Format des zones RPZ : identique à BIND (voir [[01-bind9/09-securite-rpz-dot-doh|RPZ]]).

## Scripts Lua

```yaml
recursor:
  lua_dns_script: /etc/powerdns/scripts.lua
```

```lua /etc/powerdns/scripts.lua
-- Domaines bloqués avec réponse vers une page d'information
bloques = newDS()
bloques:add({"casino.example", "jeux.example"})

function preresolve(dq)
  if bloques:check(dq.qname) then
    if dq.qtype == pdns.A then
      dq:addAnswer(pdns.A, "10.0.20.80")      -- page « site bloqué »
    end
    return true
  end
  return false
end

-- Réécrire les NXDOMAIN d'un domaine interne vers une recherche
function nxdomain(dq)
  return false
end
```

Points d'ancrage : `ipfilter`, `preresolve`, `nodata`, `nxdomain`, `postresolve`, `preoutquery`.

## rec_control

```bash
sudo rec_control ping
sudo rec_control get-all | grep -E "questions|cache-hits|cache-misses|servfail-answers|answers-slow"
sudo rec_control wipe-cache exemple.fr$        # « $ » = le nom et tous ses sous-domaines
sudo rec_control reload-zones                  # relire forward_zones / zones locales
sudo rec_control reload-lua-script
sudo rec_control reload-acls
sudo rec_control top-remotes                   # clients les plus actifs (avec record-remotes activé)
sudo rec_control top-queries
sudo rec_control trace-regex '.*exemple\.fr' /dev/stdout     # trace détaillée de la résolution de ces noms
```

## Performances

| Réglage | Conseil |
| --- | --- |
| `recursor.threads` | Nombre de cœurs (moins un) |
| `incoming.reuseport` | `true` (défaut) : répartition noyau entre threads |
| `recordcache.max_entries` / `packetcache.max_entries` | Selon la mémoire (≈ 850 octets par entrée de cache d'enregistrements) |
| `outgoing.max_qperq` | Limite de requêtes sortantes par requête cliente (protection) |
| Pare-feu | Autoriser UDP/TCP 53 sortant vers Internet (ports source aléatoires) |

## Supervision

- Statistiques par l'API web (`/api/v1/servers/localhost/statistics`) ou `rec_control get-all`.
- Exporteur Prometheus intégré : `http://127.0.0.1:8082/metrics`.
- Sondes de résolution (Centreon `apps::protocols::dns::plugin`), taux de SERVFAIL, latence (`answers-slow`, `answers100-1000`).
