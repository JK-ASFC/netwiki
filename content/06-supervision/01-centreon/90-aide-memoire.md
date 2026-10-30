---
title: Centreon — aide-mémoire des commandes
description: Commandes Centreon avec exemples — services (cbd, centengine, gorgoned, centreon), vérification et export de la configuration du moteur, CLAPI (hôtes, modèles, services, contacts, collecteurs, APPLYCFG), API REST v2 avec curl, plugins (exécution manuelle en tant que centreon-engine, --list-mode, --help), sondes SNMP, journaux et diagnostic, sauvegarde.
tags: [aide-mémoire, centreon, clapi, supervision, plugins, snmp]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation|Centreon]].

## Services

```bash
sudo systemctl status centreon cbd centengine gorgoned
sudo systemctl restart cbd centengine gorgoned
# Vérifier la configuration du moteur (fichiers générés)
sudo -u centreon-engine /usr/sbin/centengine -v /etc/centreon-engine/centengine.cfg
```

## CLAPI

```bash
CL="centreon -u admin -p MotDePasse"
$CL -o HOST -a show | head
$CL -o HOST -a ADD -v "srv-web01;Serveur web 1;10.0.30.10;OS-Linux-SNMP-custom;Central;Linux-Servers"
$CL -o HOST -a SETPARAM -v "srv-web01;snmp_community;Lecture-Supervision"
$CL -o HOST -a SETPARAM -v "srv-web01;snmp_version;2c"
$CL -o HOST -a APPLYTPL -v "srv-web01"                 # créer les services du modèle
$CL -o HOST -a setmacro -v "srv-web01;DISKWARNING;80"
$CL -o SERVICE -a show -v "srv-web01"
$CL -o SERVICE -a setparam -v "srv-web01;Disk-/;max_check_attempts;5"
$CL -o HOSTGROUP -a addhost -v "Linux-Servers;srv-web01"
$CL -o CONTACT -a ADD -v "amartin;amartin;alice.martin@exemple.fr;MotDePasse;0;1;fr_FR.UTF-8;local"
$CL -o INSTANCE -a show                                # collecteurs (pollers)
$CL -a POLLERGENERATE -v 1                             # générer
$CL -a POLLERTEST -v 1                                 # tester
$CL -a CFGMOVE -v 1                                    # déplacer
$CL -a POLLERRELOAD -v 1                               # recharger
$CL -a APPLYCFG -v 1                                   # tout en une commande (générer, tester, déplacer, recharger)
$CL -e > /srv/sauvegardes/centreon-clapi-$(date +%F).txt        # export complet de la configuration
$CL -i /srv/sauvegardes/centreon-clapi-2026-10-29.txt           # import
```

## API REST v2

```bash
TOKEN=$(curl -s -X POST https://centreon.exemple.fr/centreon/api/latest/login -H "Content-Type: application/json" \
  -d '{"security":{"credentials":{"login":"api-user","password":"MotDePasse"}}}' | jq -r .security.token)
curl -s -H "X-AUTH-TOKEN: $TOKEN" "https://centreon.exemple.fr/centreon/api/latest/monitoring/hosts?limit=10" | jq '.result[] | {name, state}'
curl -s -H "X-AUTH-TOKEN: $TOKEN" "https://centreon.exemple.fr/centreon/api/latest/monitoring/services?search=%7B%22status%22%3A%22critical%22%7D" | jq '.result[].display_name'
# Acquitter un problème
curl -s -X POST -H "X-AUTH-TOKEN: $TOKEN" -H "Content-Type: application/json" \
  "https://centreon.exemple.fr/centreon/api/latest/monitoring/hosts/15/acknowledgements" \
  -d '{"comment":"Intervention en cours","is_notify_contacts":false,"is_persistent_comment":true,"is_sticky":true}'
```

## Plugins

```bash
sudo -u centreon-engine /usr/lib/centreon/plugins/centreon_linux_snmp.pl --plugin=os::linux::snmp::plugin --list-mode
sudo -u centreon-engine /usr/lib/centreon/plugins/centreon_linux_snmp.pl --plugin=os::linux::snmp::plugin --mode=cpu \
  --hostname=10.0.30.10 --snmp-version=2c --snmp-community=Lecture-Supervision --warning-average=80 --critical-average=90
sudo -u centreon-engine /usr/lib/centreon/plugins/centreon_linux_snmp.pl --plugin=os::linux::snmp::plugin --mode=storage --help
sudo dnf install centreon-plugin-Network-Cisco-Standard-Snmp       # paquets de plugins (RHEL/Alma ; apt sur Debian)
snmpwalk -v2c -c Lecture-Supervision 10.0.30.10 1.3.6.1.2.1.1      # tester SNMP
```

## Journaux et diagnostic

```bash
sudo tail -f /var/log/centreon-engine/centengine.log
sudo tail -f /var/log/centreon-broker/central-broker-master.log
sudo tail -f /var/log/centreon-gorgone/gorgoned.log
sudo tail -f /var/log/centreon/centreon-web.log
```

## Sauvegarde

Centreon fournit une sauvegarde planifiée (*Administration → Paramètres → Sauvegarde*) : bases MariaDB (`centreon`, `centreon_storage`) et fichiers de configuration ; à compléter par l'export CLAPI ci-dessus.
