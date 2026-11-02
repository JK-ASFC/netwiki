---
title: LibreNMS
description: LibreNMS — supervision réseau libre (GPL, fork d'Observium) par SNMP : découverte automatique (CDP, LLDP, OSPF, BGP, ARP), prise en charge de milliers de modèles d'équipements, graphiques RRD, alertes (règles, transports e-mail, Teams, Slack, Telegram), cartes réseau, inventaire, collecte des configurations avec Oxidized, syslog et traps SNMP, installation Ubuntu/Debian/RHEL (PHP, MariaDB, NGINX, poller), Docker, mise à l'échelle (pollers distribués, RRDCached), API, et intégration Grafana.
tags: [librenms, snmp, supervision réseau, découverte, oxidized, lldp, alertes]
icon: info
---

**LibreNMS** est l'outil libre de référence pour superviser un **parc réseau** (commutateurs, routeurs, pare-feu, onduleurs, imprimantes) par **SNMP** : on ajoute un équipement (ou une plage) et il découvre ports, VLAN, voisins, capteurs, puis trace trafic, erreurs, CPU, températures. Complément naturel d'un outil orienté serveurs et applications ([[04-zabbix/01-presentation-installation|Zabbix]], [[01-centreon/01-presentation|Centreon]]).

## Installation (Ubuntu 24.04, résumé de la documentation officielle)

```bash
sudo apt install acl curl fping git graphviz imagemagick mariadb-client mariadb-server mtr-tiny nginx-full nmap \
  php-cli php-curl php-fpm php-gd php-gmp php-json php-mbstring php-mysql php-snmp php-xml php-zip rrdtool snmp snmpd unzip python3-pymysql python3-dotenv python3-redis python3-setuptools python3-systemd python3-pip whois traceroute
sudo useradd librenms -d /opt/librenms -M -r -s "$(which bash)"
cd /opt && sudo git clone https://github.com/librenms/librenms.git && sudo chown -R librenms:librenms /opt/librenms
sudo -u librenms bash -c 'cd /opt/librenms && ./scripts/composer_wrapper.php install --no-dev'
# Base MariaDB (librenms / utf8mb4), pool PHP-FPM dédié, site NGINX, cron et timer du scheduler : suivre la documentation
sudo cp /opt/librenms/dist/librenms.cron /etc/cron.d/librenms
sudo cp /opt/librenms/dist/librenms-scheduler.service /opt/librenms/dist/librenms-scheduler.timer /etc/systemd/system/ && sudo systemctl enable --now librenms-scheduler.timer
```

Puis l'assistant web `http://librenms.corp.exemple.fr/install`. Docker : image `librenms/librenms` (avec MariaDB, Redis, dispatcher). Validation : `sudo -u librenms /opt/librenms/validate.php`.

## Ajouter des équipements

```bash
sudo -u librenms /opt/librenms/lnms device:add --v3 -a sha -A 'MdpAuthSnmp2026' -x aes -X 'MdpPrivSnmp2026' -u supervision sw-coeur-01.corp.exemple.fr
sudo -u librenms /opt/librenms/lnms device:poll sw-coeur-01.corp.exemple.fr -vv     # tester une collecte
```

Découverte automatique : `config.php` ou interface (*Global Settings → Discovery*) avec les réseaux autorisés (`nets`) et les identifiants SNMP v3, puis découverte par voisins **LLDP/CDP**.

## Alertes et configurations

- *Alerts → Alert Rules* : partir des **règles par défaut** (équipement injoignable, port tombé, BGP, capteurs) puis ajuster ; *Alert Transports* : e-mail, Microsoft Teams, Slack, Telegram, webhook.
- **Oxidized** (outil séparé) sauvegarde les configurations des équipements dans Git ; LibreNMS l'affiche et compare les versions.
- **Syslog** et **traps SNMP** (snmptrapd) rattachés aux équipements.

Suite : [[02-observium-opennms-netxms|Observium, OpenNMS et NetXMS]] · [[03-interface-graphique|interfaces graphiques]] · [[90-aide-memoire|aide-mémoire]].
