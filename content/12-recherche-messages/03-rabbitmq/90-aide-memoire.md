---
title: RabbitMQ — aide-mémoire des commandes
description: Commandes RabbitMQ avec exemples — rabbitmqctl (état, utilisateurs, vhosts, permissions, files, connexions, canaux, consommateurs), rabbitmq-plugins (management, prometheus, shovel, federation), rabbitmq-diagnostics (status, ping, check_running, alarmes, listeners), rabbitmqadmin et API HTTP, politiques (files quorum, TTL, longueur maximale), grappe (join_cluster), files quorum et streams, définitions (export/import).
tags: [aide-mémoire, rabbitmq, rabbitmqctl, amqp, files, cluster]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|RabbitMQ]].

## État et diagnostic

```bash
sudo rabbitmq-diagnostics status
sudo rabbitmq-diagnostics ping
sudo rabbitmq-diagnostics check_running
sudo rabbitmq-diagnostics check_local_alarms          # mémoire / disque
sudo rabbitmq-diagnostics listeners
sudo rabbitmq-diagnostics memory_breakdown
sudo rabbitmqctl cluster_status
sudo rabbitmq-plugins enable rabbitmq_management rabbitmq_prometheus
sudo rabbitmq-plugins list -e
```

## Utilisateurs, vhosts, droits

```bash
sudo rabbitmqctl add_vhost production
sudo rabbitmqctl add_user app 'MotDePasseLong2026'
sudo rabbitmqctl set_permissions -p production app "^app\..*" "^app\..*" "^app\..*"     # configure, écriture, lecture
sudo rabbitmqctl set_user_tags admin-mq administrator
sudo rabbitmqctl list_users
sudo rabbitmqctl list_permissions -p production
sudo rabbitmqctl change_password app 'NouveauMotDePasse2026'
sudo rabbitmqctl delete_user guest                   # supprimer le compte par défaut
```

## Files, connexions, consommateurs

```bash
sudo rabbitmqctl list_queues -p production name type messages messages_ready messages_unacknowledged consumers
sudo rabbitmqctl list_exchanges -p production name type
sudo rabbitmqctl list_bindings -p production
sudo rabbitmqctl list_connections name user peer_host state
sudo rabbitmqctl list_channels connection messages_unacknowledged
sudo rabbitmqctl list_consumers -p production
sudo rabbitmqctl purge_queue -p production app.commandes
sudo rabbitmqctl delete_queue -p production app.ancienne
sudo rabbitmqctl close_connection "<rabbit@mq1.1729.42>" "Maintenance"
```

## Politiques

```bash
sudo rabbitmqctl set_policy -p production limites "^app\.temp\." '{"max-length":100000,"message-ttl":3600000,"overflow":"reject-publish"}' --apply-to queues
sudo rabbitmqctl set_policy -p production dlx "^app\." '{"dead-letter-exchange":"app.dlx"}' --apply-to queues
sudo rabbitmqctl list_policies -p production
# Les files quorum se déclarent par l'application (argument x-queue-type=quorum) ou par défaut du vhost
sudo rabbitmqctl update_vhost_metadata production --default-queue-type quorum
```

## rabbitmqadmin et API HTTP

```bash
rabbitmqadmin -u admin-mq -p "$MDP" list queues vhost name messages
rabbitmqadmin -u admin-mq -p "$MDP" -V production publish exchange=amq.default routing_key=app.test payload="bonjour"
rabbitmqadmin -u admin-mq -p "$MDP" -V production get queue=app.test ackmode=ack_requeue_true
curl -s -u admin-mq:"$MDP" http://127.0.0.1:15672/api/overview | jq '.queue_totals, .object_totals'
curl -s -u admin-mq:"$MDP" http://127.0.0.1:15672/api/queues/production | jq '.[] | {name, messages}'
```

## Grappe et définitions

```bash
# Sur mq2 (même cookie Erlang que mq1 : /var/lib/rabbitmq/.erlang.cookie)
sudo rabbitmqctl stop_app && sudo rabbitmqctl reset && sudo rabbitmqctl join_cluster rabbit@mq1 && sudo rabbitmqctl start_app
sudo rabbitmq-queues check_if_node_is_quorum_critical       # avant d'arrêter un nœud
sudo rabbitmq-upgrade drain                                 # mettre un nœud en maintenance
sudo rabbitmq-upgrade revive
sudo rabbitmqctl export_definitions /srv/sauvegardes/rabbitmq-definitions.json
sudo rabbitmqctl import_definitions /srv/sauvegardes/rabbitmq-definitions.json
```

## Journaux

```bash
sudo journalctl -u rabbitmq-server -f
sudo tail -f /var/log/rabbitmq/rabbit@$(hostname -s).log
```
