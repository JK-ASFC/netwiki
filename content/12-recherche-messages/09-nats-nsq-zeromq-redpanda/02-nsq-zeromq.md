---
title: NSQ et ZeroMQ
description: Deux approches minimalistes de la messagerie — NSQ (Go, MIT : nsqd, nsqlookupd, nsqadmin, topics et canaux, au moins une fois, débordement sur disque, API HTTP, outils nsq_tail et to_nsq, état du projet) et ZeroMQ (bibliothèque sans courtier, MPL : motifs REQ/REP, PUB/SUB, PUSH/PULL, ROUTER/DEALER, transports tcp, ipc, inproc, sécurité CURVE, exemples Python) ; quand les utiliser.
tags: [nsq, zeromq, zmq, messagerie, pub/sub, sans courtier, go, python]
icon: zap
---

## NSQ

**NSQ** est une plate-forme de messagerie distribuée simple, sans point central : chaque serveur applicatif peut avoir son **nsqd** local, et les consommateurs découvrent les producteurs via **nsqlookupd**.

| Composant | Rôle | Ports |
| --- | --- | --- |
| **nsqd** | Reçoit, stocke (mémoire puis disque) et distribue les messages | 4150 TCP, 4151 HTTP |
| **nsqlookupd** | Annuaire : quels nsqd ont quels topics | 4160 TCP, 4161 HTTP |
| **nsqadmin** | Interface web | 4171 |

Un **topic** reçoit les messages ; chaque **canal** du topic en reçoit une copie, et les consommateurs d'un même canal se les **répartissent**. Livraison **au moins une fois** (accusé de réception, nouvelle tentative), sans ordre garanti.

```bash
nsqlookupd &
nsqd --lookupd-tcp-address=127.0.0.1:4160 --data-path=/var/lib/nsq --mem-queue-size=10000 &
nsqadmin --lookupd-http-address=127.0.0.1:4161 &

curl -d 'commande 42 validée' 'http://127.0.0.1:4151/pub?topic=commandes'
nsq_tail --lookupd-http-address=127.0.0.1:4161 --topic=commandes --channel=debug
curl -s http://127.0.0.1:4151/stats?format=json | jq '.topics[] | {topic_name, depth}'
```

> [!NOTE]
> NSQ est stable mais évolue peu. Pour un nouveau projet, **NATS** (voir [[01-nats|NATS et JetStream]]) offre des fonctions équivalentes et une communauté plus active.

## ZeroMQ

**ZeroMQ** (ØMQ) n'est **pas un serveur** : c'est une **bibliothèque** de sockets évoluées, intégrée aux applications (C, C++, Python, Go, Java…). Pas de courtier à exploiter, donc pas de persistance ni de console : la fiabilité dépend de l'application.

| Motif | Principe | Usage |
| --- | --- | --- |
| **REQ / REP** | Requête puis réponse | Appels de service |
| **PUB / SUB** | Diffusion filtrée par préfixe | Flux de données, cotations, télémétrie |
| **PUSH / PULL** | Répartition vers des travailleurs | Pipelines de calcul |
| **ROUTER / DEALER** | Routage asynchrone avancé | Courtiers et proxys sur mesure |

Transports : `tcp://`, `ipc://` (socket locale), `inproc://` (entre threads), `pgm://` (multidiffusion fiable).

```python
import zmq

# Diffuseur
ctx = zmq.Context()
pub = ctx.socket(zmq.PUB)
pub.bind("tcp://*:5556")
pub.send_string("capteur.temp 21.5")

# Abonné (autre processus)
sub = ctx.socket(zmq.SUB)
sub.connect("tcp://serveur:5556")
sub.setsockopt_string(zmq.SUBSCRIBE, "capteur.")
print(sub.recv_string())
```

```bash
python3 -m pip install pyzmq
```

- **Sécurité** : chiffrement et authentification **CURVE** (clés Curve25519) à activer explicitement ; sans cela, tout circule en clair.
- On le rencontre dans des logiciels connus : le noyau de **Jupyter**, des systèmes de trading, des outils scientifiques.

## Quand les choisir ?

| Besoin | Choix |
| --- | --- |
| Microservices simples sans courtier lourd | NATS (ou NSQ existant) |
| Communication interne d'une application, latence minimale, pas d'administration | ZeroMQ |
| Persistance, relecture, garanties fortes | NATS JetStream, Kafka, [[03-redpanda\|Redpanda]] |

Commandes : [[90-aide-memoire|aide-mémoire]].
