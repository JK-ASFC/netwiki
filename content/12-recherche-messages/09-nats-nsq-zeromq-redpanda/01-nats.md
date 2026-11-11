---
title: NATS et JetStream
description: NATS (Go, Apache 2.0, CNCF) — messagerie légère par sujets (publication, abonnement, requête-réponse, groupes de files, jokers), JetStream (flux persistants, consommateurs, rétention, réplication, magasins clé-valeur et objets), installation, nats.conf (comptes, utilisateurs, TLS, grappe, nœuds feuilles), CLI nats (pub, sub, stream, consumer, kv, bench), supervision sur le port 8222, sécurité NKeys et JWT.
tags: [nats, jetstream, messagerie, pub/sub, clé-valeur, cncf, go, microservices, iot]
icon: zap
---

**NATS** est un système de messagerie très léger (un binaire Go de quelques dizaines de Mo) et très rapide. Ses applications publient et s'abonnent à des **sujets** hiérarchiques ; **JetStream**, intégré au serveur, ajoute la **persistance**, la relecture et des magasins **clé-valeur** et **objets**. Usages : microservices, commandes et télémétrie d'équipements, communication entre sites (nœuds feuilles).

## Modèle

| Notion | Exemple |
| --- | --- |
| Sujet | `usine.lyon.capteur.temp` |
| Jokers | `usine.*.capteur.temp` (un niveau), `usine.>` (tous les niveaux suivants) |
| Publication / abonnement | Diffusion à tous les abonnés (au plus une fois, sans stockage) |
| **Groupe de file** | Les abonnés d'un même groupe se **répartissent** les messages |
| Requête / réponse | Appel synchrone par un sujet de réponse temporaire |
| **JetStream** | Flux persistant, consommateurs durables, accusés de réception, relecture |

## Installation

```bash
# Binaire (GitHub) ou paquet ; Docker : nats:latest
docker run -d --name nats -p 4222:4222 -p 8222:8222 -v /srv/nats:/data nats:latest -js -sd /data
# CLI
go install github.com/nats-io/natscli/nats@latest      # ou brew install nats-io/nats-tools/nats
```

| Port | Usage |
| --- | --- |
| 4222 | Clients |
| 8222 | Supervision HTTP (`/varz`, `/connz`, `/jsz`, `/healthz`) |
| 6222 | Routes de la grappe |
| 7422 | Nœuds feuilles (*leaf nodes*) |

```text /etc/nats/nats.conf
server_name: nats1
port: 4222
http_port: 8222

jetstream {
  store_dir: /var/lib/nats
  max_file_store: 50G
}

accounts {
  APP: {
    jetstream: enabled
    users: [ { user: app, password: "$2a$11$…" } ]     # hachage bcrypt : nats server passwd
  }
  SYS: { users: [ { user: admin, password: "$2a$11$…" } ] }
}
system_account: SYS

tls { cert_file: "/etc/nats/tls/serveur.crt", key_file: "/etc/nats/tls/serveur.key" }

cluster {
  name: grappe-lyon
  port: 6222
  routes: [ nats://nats2:6222, nats://nats3:6222 ]
}
```

Une grappe de **3 nœuds** permet la réplication JetStream (`replicas: 3`). Les **nœuds feuilles** relient un site distant (usine, magasin) à la grappe centrale tout en continuant à fonctionner hors connexion.

## CLI nats

```bash
nats context save local --server nats://localhost:4222 --user app --password '…' --select
nats pub usine.lyon.capteur.temp '{"valeur": 21.5}'
nats sub "usine.>"
nats reply service.heure "il est l'heure" & nats request service.heure ""

# JetStream
nats stream add MESURES --subjects "usine.>" --storage file --replicas 3 --retention limits --max-age 30d --defaults
nats consumer add MESURES analyse --pull --deliver all --ack explicit --defaults
nats consumer next MESURES analyse --count 10
nats stream info MESURES ; nats stream report

# Clé-valeur et objets
nats kv add CONFIG --history 5
nats kv put CONFIG seuil.temperature 30 ; nats kv get CONFIG seuil.temperature ; nats kv watch CONFIG
nats object add FICHIERS ; nats object put FICHIERS firmware.bin

nats server list ; nats server report jetstream      # avec le compte système
nats bench test --pub 4 --sub 4 --msgs 1000000      # performance
```

## Sécurité

- Comptes **isolés** (sujets et flux séparés), import/export explicites entre comptes.
- Mode **décentralisé** : NKeys et **JWT** gérés avec l'outil `nsc` (opérateur, comptes, utilisateurs révocables) pour les grands déploiements.
- TLS sur les clients, les routes et les nœuds feuilles ; supervision sur 8222 non exposée.

Voir aussi : [[02-nsq-zeromq|NSQ et ZeroMQ]] · [[03-redpanda|Redpanda]]. Commandes : [[90-aide-memoire|aide-mémoire]].
