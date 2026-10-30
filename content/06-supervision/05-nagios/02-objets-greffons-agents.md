---
title: Objets, greffons et agents
description: Configurer Nagios Core — objets (hôtes, services, groupes, commandes, périodes, contacts) et modèles avec héritage, relations parent/enfant, supervision réseau (check_ping, check_snmp, SNMPv3), services distants par NRPE et NCPA, supervision Windows, écriture d'un greffon maison et bonnes pratiques d'organisation.
tags: [nagios, objets, modèles, check_snmp, nrpe, ncpa, greffons, windows]
icon: settings-2
---

## Modèles et hôtes

```nagios /etc/nagios4/conf.d/modeles.cfg
define host {
    name                    modele-equipement-reseau
    use                     generic-host
    check_command           check-host-alive
    check_interval          1
    retry_interval          1
    max_check_attempts      3
    notification_period     24x7
    notification_interval   60
    contact_groups          admins-reseau
    register                0              ; modèle (non instancié)
}

define service {
    name                    modele-service
    use                     generic-service
    check_interval          5
    retry_interval          1
    max_check_attempts      3
    contact_groups          admins-reseau
    register                0
}
```

```nagios /etc/nagios4/conf.d/paris.cfg
define host {
    use                     modele-equipement-reseau
    host_name               r1-paris
    alias                   Routeur WAN Paris
    address                 10.0.0.1
    hostgroups              routeurs, site-paris
}

define host {
    use                     modele-equipement-reseau
    host_name               sw-acces-paris-01
    address                 10.0.1.10
    parents                 r1-paris             ; UNREACHABLE (et non DOWN) si le routeur tombe
    hostgroups              commutateurs, site-paris
}

define hostgroup {
    hostgroup_name          routeurs
    alias                   Routeurs
}

define service {
    use                     modele-service
    hostgroup_name          routeurs
    service_description     Latence et pertes
    check_command           check_ping!100.0,20%!500.0,60%
}
```

## Commandes et SNMP

```nagios /etc/nagios4/conf.d/commandes.cfg
define command {
    command_name    check_snmp_v3_if
    command_line    $USER1$/check_snmp -H $HOSTADDRESS$ -P 3 -L authPriv -U $USER5$ -a SHA -A $USER6$ -x AES -X $USER7$ -o IF-MIB::ifOperStatus.$ARG1$ -r 1 -l "Etat $ARG2$"
}

define service {
    use                     modele-service
    host_name               r1-paris
    service_description     Interface WAN Gi0/0/0
    check_command           check_snmp_v3_if!1!Gi0/0/0
}
```

Les identifiants (`$USER5$`, `$USER6$`, `$USER7$`) sont définis dans `resource.cfg` (lisible uniquement par Nagios). Pour les interfaces, CPU, mémoire, environnement des équipements, les greffons communautaires **check_nwc_health** (ConSol) ou **Centreon Plugins** couvrent la plupart des constructeurs :

```bash
check_nwc_health --hostname 10.0.0.1 --protocol 3 --username supervision --authprotocol sha --authpassword '…' \
  --privprotocol aes --privpassword '…' --mode interface-usage --name GigabitEthernet0/0/0
```

## Agents : NRPE et NCPA

### NRPE (Linux)

```bash
sudo apt install nagios-nrpe-server monitoring-plugins
```

```ini /etc/nagios/nrpe.d/local.cfg
allowed_hosts=127.0.0.1,10.0.99.30
command[check_disque_racine]=/usr/lib/nagios/plugins/check_disk -w 20% -c 10% -p /
command[check_charge]=/usr/lib/nagios/plugins/check_load -r -w 2,1.5,1.2 -c 4,3,2
command[check_nginx]=/usr/lib/nagios/plugins/check_procs -c 1: -C nginx
```

```nagios
define service {
    use                     modele-service
    host_name               srv-web-01
    service_description     Disque /
    check_command           check_nrpe!check_disque_racine
}
```

N'autorisez pas `dont_blame_nrpe=1` (arguments transmis par le serveur) : risque d'injection. Filtrez le port 5666 au seul serveur Nagios.

### NCPA (Windows, Linux, macOS)

**NCPA** (Nagios Cross-Platform Agent) expose une API HTTPS (port 5693) protégée par un jeton :

```bash
/usr/lib/nagios/plugins/check_ncpa.py -H srv-ad-01 -t 'JetonNCPA' -M 'cpu/percent' -w 80 -c 95 -q 'aggregate=avg'
/usr/lib/nagios/plugins/check_ncpa.py -H srv-ad-01 -t 'JetonNCPA' -M 'services' -q 'service=NTDS,status=running'
```

NSClient++ reste une alternative courante pour Windows (NRPE ou API REST).

## Greffon maison

```bash /usr/local/lib/nagios/plugins/check_age_sauvegarde
#!/bin/bash
# Usage : check_age_sauvegarde <fichier> <avertissement_h> <critique_h>
F=$1; W=${2:-26}; C=${3:-50}
[ -e "$F" ] || { echo "UNKNOWN - $F absent"; exit 3; }
AGE=$(( ( $(date +%s) - $(stat -c %Y "$F") ) / 3600 ))
if   [ "$AGE" -ge "$C" ]; then echo "CRITICAL - sauvegarde vieille de ${AGE} h | age=${AGE}h;$W;$C"; exit 2
elif [ "$AGE" -ge "$W" ]; then echo "WARNING - sauvegarde vieille de ${AGE} h | age=${AGE}h;$W;$C"; exit 1
else echo "OK - sauvegarde de ${AGE} h | age=${AGE}h;$W;$C"; exit 0; fi
```

## Bonnes pratiques

- Un fichier par site ou par domaine, des **modèles** pour tout, des groupes pour appliquer les services en masse.
- Générer la configuration depuis l'inventaire (scripts, Ansible, NetBox) plutôt que l'écrire à la main.
- Relations **parents** pour éviter les avalanches d'alertes.
- Versionner `/etc/nagios4` dans Git.
