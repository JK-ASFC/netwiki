---
title: Apache Ignite et Hazelcast
description: Grilles de données en mémoire — Apache Ignite (Apache 2.0, versions 2.x et 3.x : cache distribué, SQL, persistance native, calcul) et Hazelcast Platform (édition Community Apache 2.0 et Enterprise : IMap, files, verrous, SQL, traitement de flux Jet, Management Center) : cas d'usage (cache de sessions, cache applicatif partagé, calcul distribué), installation (archives, Docker, Helm, Java embarqué), découverte des membres (multicast, TCP/IP, Kubernetes), configuration XML/YAML, ports, sécurité, supervision et CLI.
tags: [apache ignite, hazelcast, grille de données, cache distribué, en mémoire, java]
icon: info
---

Une **grille de données en mémoire** répartit des structures (cartes, files, verrous) sur la RAM de plusieurs serveurs : cache partagé entre instances d'une application Java, sessions web, calculs parallèles proches des données.

| | **Apache Ignite** | **Hazelcast** |
| --- | --- | --- |
| Licence | Apache 2.0 | Community Apache 2.0 ; Enterprise (sécurité, persistance, WAN) payante |
| Points forts | SQL distribué, persistance native sur disque, transactions | Simplicité, structures distribuées, traitement de flux |
| Ports | 47500 (découverte), 47100 (communication), 10800 (clients légers) | 5701+ (membres et clients), 8080 (Management Center) |

## Hazelcast

```bash
docker run -d --name hz1 -e HZ_CLUSTERNAME=corp -p 5701:5701 hazelcast/hazelcast:5.5
docker run -d --name hz-mc -p 8080:8080 hazelcast/management-center:5.5
# Archive (Linux, macOS, Windows) : bin/hz start ; client : bin/hz-cli
brew install hazelcast           # macOS
```

```yaml
# hazelcast.yaml — découverte en TCP/IP (le multicast est rarement autorisé)
hazelcast:
  cluster-name: corp
  network:
    port: { port: 5701, auto-increment: true }
    join:
      multicast: { enabled: false }
      tcp-ip:
        enabled: true
        member-list: [10.0.20.241, 10.0.20.242, 10.0.20.243]
  map:
    sessions:
      backup-count: 1
      time-to-live-seconds: 3600
```

Sous Kubernetes : découverte `kubernetes` (chart Helm `hazelcast/hazelcast`). Sans édition Enterprise, il n'y a **ni TLS ni authentification** entre membres et clients : isolez le cluster sur un réseau dédié.

## Apache Ignite

```bash
docker run -d --name ignite -p 10800:10800 -p 47100:47100 -p 47500:47500 apacheignite/ignite:2.16.0
# Archive : bin/ignite.sh config/serveur.xml ; Ignite 3 : CLI « ignite » (cluster init, sql)
```

```xml
<!-- config/serveur.xml (Ignite 2) — découverte statique et persistance -->
<bean class="org.apache.ignite.configuration.IgniteConfiguration">
  <property name="discoverySpi">
    <bean class="org.apache.ignite.spi.discovery.tcp.TcpDiscoverySpi">
      <property name="ipFinder">
        <bean class="org.apache.ignite.spi.discovery.tcp.ipfinder.vm.TcpDiscoveryVmIpFinder">
          <property name="addresses"><list><value>10.0.20.251:47500..47509</value><value>10.0.20.252:47500..47509</value></list></property>
        </bean>
      </property>
    </bean>
  </property>
  <property name="dataStorageConfiguration">
    <bean class="org.apache.ignite.configuration.DataStorageConfiguration">
      <property name="defaultDataRegionConfiguration">
        <bean class="org.apache.ignite.configuration.DataRegionConfiguration"><property name="persistenceEnabled" value="true"/></bean>
      </property>
    </bean>
  </property>
</bean>
```

```bash
bin/control.sh --set-state ACTIVE          # activer le cluster après le premier démarrage avec persistance
bin/control.sh --baseline                  # topologie de référence
bin/sqlline.sh -u jdbc:ignite:thin://10.0.20.251/
```

Suite : [[02-geode-voltdb|Geode et VoltDB]] · [[03-interface-graphique|interfaces graphiques]] · [[90-aide-memoire|aide-mémoire]].
