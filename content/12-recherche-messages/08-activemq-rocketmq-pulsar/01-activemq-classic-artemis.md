---
title: ActiveMQ Classic et ActiveMQ Artemis
description: Les deux courtiers Java d'Apache ActiveMQ — Classic (JMS, OpenWire, KahaDB, activemq.xml, console web, maître/esclave) et Artemis (nouvelle génération : journal haute performance, Jakarta Messaging, tous les protocoles sur un port, artemis create, broker.xml, adresses et files, haute disponibilité par réplication ou stockage partagé, grappes) ; ports, sécurité (mots de passe par défaut, TLS), ligne de commande et supervision.
tags: [activemq, artemis, jms, jakarta messaging, amqp, stomp, mqtt, openwire, courtier de messages, java]
icon: radio-tower
---

**Apache ActiveMQ** existe en deux produits :

| | ActiveMQ Classic | ActiveMQ Artemis |
| --- | --- | --- |
| Origine | Historique (depuis 2004) | Issu de HornetQ (JBoss), nouvelle génération |
| API | JMS 1.1, Jakarta Messaging (versions récentes) | **Jakarta Messaging 3**, JMS 2 |
| Stockage | KahaDB (ou JDBC) | **Journal** append-only très performant |
| Protocoles | OpenWire, AMQP, STOMP, MQTT, WebSocket (un port par protocole) | CORE, AMQP, OpenWire, STOMP, MQTT, HornetQ, **tous sur le port 61616** |
| Haute disponibilité | Maître/esclave par stockage partagé | Réplication ou stockage partagé, grappes avec répartition |
| Usage conseillé | Applications existantes | **Nouveaux déploiements** |

Ces courtiers servent surtout aux applications **Java d'entreprise** (serveurs d'applications, intégration avec Apache Camel) et aux échanges multi-protocoles. Pour le streaming d'événements à grande échelle, voir Kafka ; pour AMQP 0-9-1, RabbitMQ (pages dédiées du wiki).

## ActiveMQ Classic

```bash
# Java 17 requis ; archive du site Apache
tar xzf apache-activemq-6.*-bin.tar.gz -C /opt && ln -s /opt/apache-activemq-6.* /opt/activemq
/opt/activemq/bin/activemq start          # stop, status, console (premier plan)
```

| Port | Protocole |
| --- | --- |
| 61616 | OpenWire (JMS) |
| 5672 | AMQP 1.0 |
| 61613 | STOMP |
| 1883 | MQTT |
| 61614 | WebSocket |
| **8161** | Console web (Jetty) |

Configuration : `conf/activemq.xml` (connecteurs, stockage, limites mémoire et disque, politiques par destination), `conf/jetty-realm.properties` et `conf/users.properties` (comptes de la console et des clients).

> [!WARNING]
> La console est livrée avec le compte **`admin` / `admin`** : changez-le avant toute mise en service, activez l'authentification des clients (`simpleAuthenticationPlugin` ou JAAS) et n'exposez pas la console. Des vulnérabilités graves (exécution de code par OpenWire) ont touché les versions non mises à jour : suivre les correctifs.

```bash
/opt/activemq/bin/activemq producer --destination queue://TEST --messageCount 10
/opt/activemq/bin/activemq consumer --destination queue://TEST --messageCount 10
/opt/activemq/bin/activemq dstat queues          # files, profondeur, producteurs, consommateurs
```

## ActiveMQ Artemis

```bash
tar xzf apache-artemis-2.*-bin.tar.gz -C /opt && ln -s /opt/apache-artemis-2.* /opt/artemis
/opt/artemis/bin/artemis create /var/lib/artemis/broker1 \
  --user admin --password 'Mot-De-Passe-Long' --require-login --name broker1
/var/lib/artemis/broker1/bin/artemis run                 # premier plan
/var/lib/artemis/broker1/bin/artemis-service start       # arrière-plan
```

Chaque **instance** (`broker1`) a son dossier : `etc/broker.xml` (adresses, files, accepteurs, sécurité), `etc/artemis-users.properties` et `artemis-roles.properties`, `data/` (journal). Console web **Hawtio** sur le port **8161**.

```xml etc/broker.xml
<addresses>
  <address name="commandes">
    <anycast>
      <queue name="commandes"/>               <!-- point à point -->
    </anycast>
  </address>
  <address name="evenements">
    <multicast/>                               <!-- publication / abonnement -->
  </address>
</addresses>
<address-settings>
  <address-setting match="#">
    <dead-letter-address>DLQ</dead-letter-address>
    <max-delivery-attempts>5</max-delivery-attempts>
    <max-size-bytes>-1</max-size-bytes>
    <address-full-policy>PAGE</address-full-policy>
  </address-setting>
</address-settings>
```

```bash
cd /var/lib/artemis/broker1
bin/artemis queue stat --user admin --password '…'
bin/artemis producer --destination queue://commandes --message-count 100 --user admin --password '…'
bin/artemis consumer --destination queue://commandes --message-count 100 --user admin --password '…'
bin/artemis data print                       # inspecter le journal (courtier arrêté)
```

### Haute disponibilité

- **Réplication** : un serveur principal et une sauvegarde qui réplique le journal par le réseau ; bascule automatique.
- **Stockage partagé** : principal et sauvegarde sur le même stockage (NFSv4, SAN).
- **Grappe** : plusieurs serveurs se répartissent les messages (*message load balancing*), découverte par UDP ou JGroups ou liste statique.

## Sécurité et supervision

- TLS sur les accepteurs (`sslEnabled=true;keyStorePath=…`), authentification obligatoire, rôles par adresse.
- Métriques : JMX, ou greffon Prometheus (Artemis) ; surveiller la **profondeur des files**, les messages en **DLQ** et l'espace disque.

Voir aussi : [[02-rocketmq-pulsar|RocketMQ et Pulsar]]. Commandes : [[90-aide-memoire|aide-mémoire]].
