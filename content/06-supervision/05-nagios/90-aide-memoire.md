---
title: Nagios Core — aide-mémoire des commandes
description: Commandes Nagios Core avec exemples — vérification de la configuration (nagios -v), service, définitions (hôtes, services, commandes, contacts), plugins usuels exécutés à la main (check_ping, check_http, check_disk, check_snmp, check_by_ssh, NRPE avec check_nrpe), commandes externes (fichier de commandes : planifier une vérification, acquitter, maintenance, désactiver les notifications), statut (nagiostats), journaux.
tags: [aide-mémoire, nagios, plugins, nrpe, supervision]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Nagios]]. Chemins d'une installation depuis les sources : `/usr/local/nagios/`.

## Service et vérification

```bash
sudo /usr/local/nagios/bin/nagios -v /usr/local/nagios/etc/nagios.cfg     # vérification complète
sudo systemctl reload nagios
sudo /usr/local/nagios/bin/nagiostats | grep -E "Services Ok|Hosts Up|Latency"
sudo tail -f /usr/local/nagios/var/nagios.log
```

## Définitions types

```text
define host {
    use                 linux-server
    host_name           srv-web01
    alias               Serveur web 1
    address             10.0.30.10
    hostgroups          serveurs-web
}
define service {
    use                 generic-service
    host_name           srv-web01
    service_description HTTPS
    check_command       check_https_url!intranet.exemple.fr!/health
}
define command {
    command_name        check_https_url
    command_line        $USER1$/check_http -H $ARG1$ -u $ARG2$ -S --sni -e 200 -C 30,14
}
```

## Plugins à la main (en tant qu'utilisateur nagios)

```bash
P=/usr/local/nagios/libexec
sudo -u nagios $P/check_ping -H 10.0.30.10 -w 100,20% -c 500,60% -p 5
sudo -u nagios $P/check_http -H intranet.exemple.fr -S --sni -u /health -e 200
sudo -u nagios $P/check_http -H intranet.exemple.fr -S --sni -C 30,14          # expiration du certificat
sudo -u nagios $P/check_disk -w 20% -c 10% -p /
sudo -u nagios $P/check_tcp -H 10.0.30.10 -p 5432
sudo -u nagios $P/check_dns -H www.exemple.fr -s 10.0.10.53
sudo -u nagios $P/check_ssh 10.0.30.10
sudo -u nagios $P/check_snmp -H 10.0.99.10 -C Lecture-Supervision -o IF-MIB::ifOperStatus.1 -r 1
sudo -u nagios $P/check_by_ssh -H 10.0.30.10 -l nagios -C "/usr/lib/nagios/plugins/check_load -w 4,3,2 -c 8,6,4"
sudo -u nagios $P/check_nrpe -H 10.0.30.10 -c check_load
echo $?           # 0 OK, 1 WARNING, 2 CRITICAL, 3 UNKNOWN
```

## Commandes externes

```bash
CMD=/usr/local/nagios/var/rw/nagios.cmd
now=$(date +%s)
printf "[%s] SCHEDULE_FORCED_SVC_CHECK;srv-web01;HTTPS;%s\n" $now $now > $CMD
printf "[%s] ACKNOWLEDGE_SVC_PROBLEM;srv-web01;HTTPS;2;1;0;amartin;Intervention en cours\n" $now > $CMD
printf "[%s] SCHEDULE_HOST_DOWNTIME;srv-web01;%s;%s;1;0;7200;amartin;Maintenance\n" $now $now $((now+7200)) > $CMD
printf "[%s] DISABLE_HOST_NOTIFICATIONS;srv-web01\n" $now > $CMD
printf "[%s] ENABLE_HOST_NOTIFICATIONS;srv-web01\n" $now > $CMD
```

## NRPE (côté supervisé)

```text
# /etc/nagios/nrpe.cfg
allowed_hosts=127.0.0.1,10.0.98.10
command[check_load]=/usr/lib/nagios/plugins/check_load -w 4,3,2 -c 8,6,4
command[check_root]=/usr/lib/nagios/plugins/check_disk -w 20% -c 10% -p /
```

```bash
sudo systemctl restart nagios-nrpe-server
```
