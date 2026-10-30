---
title: rsyslog — aide-mémoire des commandes
description: Commandes et configuration rsyslog avec exemples — vérification (rsyslogd -N1), service, réception UDP/TCP/TLS, tri par hôte et par programme (modèles dynamiques), filtres (propriétés, RainerScript), transfert fiable avec file disque, TLS (gtls), envoi de tests (logger), journald et rotation (logrotate), diagnostic (impstats).
tags: [aide-mémoire, rsyslog, syslog, logger, tls, logrotate]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|rsyslog]].

## Vérification et service

```bash
sudo rsyslogd -N1                      # valider la configuration
sudo rsyslogd -N1 -f /etc/rsyslog.d/30-reception.conf
sudo systemctl restart rsyslog
sudo ss -lnptu | grep rsyslogd
rsyslogd -v | head -3
```

## Serveur de collecte

```text
# /etc/rsyslog.d/30-reception.conf
module(load="imudp")
module(load="imtcp")
input(type="imudp" port="514" ruleset="distant")
input(type="imtcp" port="514" ruleset="distant")

template(name="ParHote" type="string" string="/var/log/distant/%HOSTNAME%/%$YEAR%-%$MONTH%-%$DAY%.log")

ruleset(name="distant") {
    if $fromhost-ip startswith "10.0.99." then {
        action(type="omfile" dynaFile="ParHote" dirCreateMode="0750" fileCreateMode="0640")
    }
    stop
}
```

## Client : transfert fiable

```text
# /etc/rsyslog.d/90-transfert.conf
*.* action(type="omfwd" target="syslog.exemple.fr" port="514" protocol="tcp"
           queue.type="LinkedList" queue.filename="file_transfert" queue.maxDiskSpace="1g"
           queue.saveOnShutdown="on" action.resumeRetryCount="-1")
```

## Filtres

```text
if $programname == "sshd" and $msg contains "Failed password" then /var/log/ssh-echecs.log
if $syslogseverity <= 3 then /var/log/critique.log
:msg, contains, "%LINK-3-UPDOWN" /var/log/reseau/liens.log
local7.*  /var/log/reseau/equipements.log
& stop
```

## TLS

```text
global(DefaultNetstreamDriver="gtls"
       DefaultNetstreamDriverCAFile="/etc/ssl/certs/ac-interne.pem"
       DefaultNetstreamDriverCertFile="/etc/rsyslog.d/tls/syslog.crt"
       DefaultNetstreamDriverKeyFile="/etc/rsyslog.d/tls/syslog.key")
module(load="imtcp" StreamDriver.Name="gtls" StreamDriver.Mode="1" StreamDriver.Authmode="x509/name" PermittedPeer=["*.exemple.fr"])
input(type="imtcp" port="6514")
```

## Tests

```bash
logger -p local7.warning -t test-netwiki "Message de test"
logger -n syslog.exemple.fr -P 514 -T "Test TCP vers le collecteur"
logger -n syslog.exemple.fr -P 514 -d "Test UDP"
sudo tail -f /var/log/distant/*/$(date +%F).log
sudo tcpdump -ni eth0 port 514 -A | head
```

## Rotation et journald

```text
# /etc/logrotate.d/distant
/var/log/distant/*/*.log {
    daily
    rotate 90
    compress
    delaycompress
    missingok
    notifempty
    sharedscripts
    postrotate
        /usr/lib/rsyslog/rsyslog-rotate
    endscript
}
```

```bash
sudo logrotate -d /etc/logrotate.d/distant      # simulation
journalctl -u rsyslog --since "10 min ago"
```

## Statistiques internes

```text
module(load="impstats" interval="60" severity="7" log.file="/var/log/rsyslog-stats.log")
```
