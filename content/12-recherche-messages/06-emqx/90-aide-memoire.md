---
title: EMQX — aide-mémoire des commandes
description: Commandes EMQX avec exemples — démarrage et état (emqx start, ctl status), emqx ctl (clients, sujets, abonnements, grappe, plugins, journaux), API REST v5 (clés d'API, clients, publication, règles, ponts), tableau de bord, configuration HOCON, Docker, grappe et sauvegarde (data export/import).
tags: [aide-mémoire, emqx, mqtt, emqx ctl, api, iot]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|EMQX]]. Tableau de bord : `http://<serveur>:18083`.

## Service et emqx ctl

```bash
sudo systemctl start emqx
emqx ctl status
emqx ctl cluster status
emqx ctl clients list | head
emqx ctl clients show capteur-salle1
emqx ctl clients kick capteur-salle1
emqx ctl topics list | head
emqx ctl subscriptions show capteur-salle1
emqx ctl listeners
emqx ctl plugins list
emqx ctl log set-level warning
emqx ctl admins passwd admin 'MotDePasseLong2026'
emqx ctl data export                              # sauvegarde de la configuration et des données (archive)
emqx ctl data import /var/lib/emqx/backup/emqx-export-2026-10-29.tar.gz
emqx ctl cluster join emqx@emqx1.exemple.fr       # sur un nouveau nœud
```

## API REST v5

```bash
E=http://127.0.0.1:18083/api/v5
A=(-s -u "$CLE_API:$SECRET_API")                   # clé d'API créée dans le tableau de bord
curl "${A[@]}" $E/nodes | jq '.[] | {node, node_status, connections}'
curl "${A[@]}" "$E/clients?limit=10" | jq '.data[] | {clientid, username, ip_address, connected}'
curl "${A[@]}" -X DELETE $E/clients/capteur-salle1
curl "${A[@]}" -X POST $E/publish -H "Content-Type: application/json" -d '{"topic":"batiment/annonce","payload":"maintenance a 20h","qos":1}'
curl "${A[@]}" $E/rules | jq '.data[] | {id, sql, enable}'
curl "${A[@]}" $E/metrics | jq '.[0] | with_entries(select(.key | test("messages.received|messages.sent")))'
```

## Configuration (HOCON)

```text
# /etc/emqx/emqx.conf (extrait)
listeners.ssl.default {
  bind = "0.0.0.0:8883"
  ssl_options {
    certfile = "/etc/emqx/certs/mqtt.crt"
    keyfile = "/etc/emqx/certs/mqtt.key"
  }
}
authorization.no_match = deny
```

## Docker

```bash
docker run -d --name emqx -p 1883:1883 -p 8883:8883 -p 8083:8083 -p 18083:18083 -v emqx-data:/opt/emqx/data emqx/emqx:5.8
docker exec -it emqx emqx ctl status
```
