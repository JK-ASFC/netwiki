---
title: Configuration, vhosts, droits et TLS
description: Configurer RabbitMQ — fichiers rabbitmq.conf, advanced.config et enabled_plugins, seuils d'alarme mémoire et disque, vhosts, utilisateurs, étiquettes et permissions (configure/write/read), politiques (TTL, longueur maximale, files de lettres mortes), TLS pour clients et interface, authentification LDAP / Active Directory.
tags: [rabbitmq, rabbitmq.conf, vhost, permissions, tls, ldap, politiques, dlx]
icon: shield-check
---

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `/etc/rabbitmq/rabbitmq.conf` | Configuration principale (format `clé = valeur`) |
| `/etc/rabbitmq/advanced.config` | Réglages avancés (format Erlang), ex. requêtes LDAP complexes |
| `/etc/rabbitmq/enabled_plugins` | Greffons activés (`rabbitmq-plugins enable …`) |
| `/etc/rabbitmq/rabbitmq-env.conf` | Variables d'environnement (nom de nœud, répertoires) |

```rabbitmq /etc/rabbitmq/rabbitmq.conf
# Écoute
listeners.tcp = none                         # désactiver AMQP en clair
listeners.ssl.default = 5671
management.ssl.port = 15671
management.ssl.cacertfile = /etc/rabbitmq/tls/ca.crt
management.ssl.certfile = /etc/rabbitmq/tls/mq1.crt
management.ssl.keyfile = /etc/rabbitmq/tls/mq1.key

# TLS clients
ssl_options.cacertfile = /etc/rabbitmq/tls/ca.crt
ssl_options.certfile = /etc/rabbitmq/tls/mq1.crt
ssl_options.keyfile = /etc/rabbitmq/tls/mq1.key
ssl_options.verify = verify_peer
ssl_options.fail_if_no_peer_cert = false
ssl_options.versions.1 = tlsv1.3
ssl_options.versions.2 = tlsv1.2

# Alarmes de ressources
vm_memory_high_watermark.relative = 0.6
disk_free_limit.absolute = 5GB

# Divers
default_vhost = /
loopback_users.guest = true
log.file.level = info
```

```bash
sudo systemctl restart rabbitmq-server
sudo rabbitmq-diagnostics environment | grep -A2 vm_memory_high_watermark
```

> [!IMPORTANT]
> Quand la mémoire dépasse `vm_memory_high_watermark` ou que l'espace disque passe sous `disk_free_limit`, RabbitMQ **bloque les producteurs** de tout le cluster jusqu'au retour sous le seuil. Dimensionnez la mémoire et surveillez la longueur des files.

## Vhosts, utilisateurs et permissions

```bash
sudo rabbitmqctl add_vhost /commandes
sudo rabbitmqctl add_user app_commandes 'MotDePasseLong!'
# Permissions : configure (créer/supprimer), write (publier), read (consommer), sous forme d'expressions régulières sur les noms
sudo rabbitmqctl set_permissions -p /commandes app_commandes '^commandes\..*' '^commandes\..*' '^commandes\..*'
sudo rabbitmqctl add_user supervision 'MotDePasse!'
sudo rabbitmqctl set_user_tags supervision monitoring
sudo rabbitmqctl list_permissions -p /commandes
sudo rabbitmqctl list_users
```

| Étiquette | Accès à l'interface de gestion |
| --- | --- |
| `administrator` | Tout |
| `monitoring` | Lecture de tout (supervision) |
| `policymaker` | Politiques des vhosts autorisés |
| `management` | Ses propres vhosts |
| (aucune) | Pas d'accès à l'interface, AMQP seulement |

## Politiques

Les **politiques** appliquent des paramètres aux files et échanges par motif de nom, sans modifier les applications :

```bash
# Files quorum de « commandes.* » : longueur max, file de lettres mortes
sudo rabbitmqctl set_policy -p /commandes limites-commandes '^commandes\.' \
  '{"max-length": 100000, "overflow": "reject-publish", "dead-letter-exchange": "commandes.dlx"}' \
  --apply-to queues --priority 10

# Durée de vie des messages d'une file temporaire
sudo rabbitmqctl set_policy -p /commandes ttl-notifications '^notifications\.' '{"message-ttl": 3600000}' --apply-to queues

sudo rabbitmqctl list_policies -p /commandes
```

| Paramètre | Effet |
| --- | --- |
| `message-ttl` | Expiration des messages (ms) |
| `max-length` / `max-length-bytes` | Taille maximale de la file |
| `overflow` | `drop-head` (défaut), `reject-publish`, `reject-publish-dlx` |
| `dead-letter-exchange` | Échange recevant les messages rejetés, expirés ou en surplus |
| `delivery-limit` (quorum) | Nombre maximal de redistributions d'un message (évite les « messages poison ») |

## LDAP / Active Directory

```bash
sudo rabbitmq-plugins enable rabbitmq_auth_backend_ldap
```

```rabbitmq /etc/rabbitmq/rabbitmq.conf (extrait)
auth_backends.1 = ldap
auth_backends.2 = internal
auth_ldap.servers.1 = dc1.corp.exemple.fr
auth_ldap.servers.2 = dc2.corp.exemple.fr
auth_ldap.use_ssl = true
auth_ldap.port = 636
auth_ldap.dn_lookup_bind.user_dn = CN=svc_rabbitmq,OU=Services,DC=corp,DC=exemple,DC=fr
auth_ldap.dn_lookup_bind.password = MotDePasseCompteService
auth_ldap.dn_lookup_attribute = sAMAccountName
auth_ldap.dn_lookup_base = OU=Utilisateurs,DC=corp,DC=exemple,DC=fr
```

Les autorisations (vhosts, étiquettes, ressources) selon l'appartenance aux groupes AD se définissent dans `advanced.config` (requêtes `in_group`, `in_group_nested`). Gardez le backend `internal` pour les comptes applicatifs.

## Durcissement

- [ ] Compte `guest` supprimé, un utilisateur par application, un vhost par domaine applicatif
- [ ] AMQP et interface de gestion en TLS ; ports filtrés (5671, 15671 vers les clients et administrateurs seulement ; 25672/4369 entre nœuds)
- [ ] Cookie Erlang secret et protégé (`/var/lib/rabbitmq/.erlang.cookie`, mode 400)
- [ ] Limites de files par politique, files de lettres mortes surveillées
