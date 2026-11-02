---
title: Observium, OpenNMS et NetXMS
description: Autres supervisions réseau SNMP — Observium Community (édition gratuite limitée, mises à jour semestrielles, installation script), OpenNMS Horizon (Java, AGPL : découverte, provisioning requisitions, collecte SNMP/JMX/HTTP, seuils, événements et alarmes, corrélation, topologie, Helm/Docker, Meridian pour l'édition stable) et NetXMS (GPL : serveur, agents multiplate-formes, console de bureau et web, cartes, détection d'anomalies, scripts NXSL) ; installation, cas d'usage et comparaison avec LibreNMS.
tags: [observium, opennms, netxms, snmp, supervision réseau]
icon: info
---

| Outil | Licence | Points forts | Limites |
| --- | --- | --- | --- |
| [[01-librenms\|LibreNMS]] | GPL | Communauté très active, découverte, alertes | Interface PHP classique |
| **Observium Community** | Gratuite (code non libre), éditions payantes | Interface soignée, graphiques | Version gratuite mise à jour 2 fois par an, fonctions limitées |
| **OpenNMS Horizon** | AGPL | Très grande échelle, événements et corrélation, nombreux protocoles | Java, apprentissage long |
| **NetXMS** | GPL (serveur) | Agents sur serveurs et équipements, cartes, console riche | Communauté plus petite |

## Observium Community

```bash
wget http://www.observium.org/observium_installscript.sh && chmod +x observium_installscript.sh
sudo ./observium_installscript.sh          # Ubuntu/Debian : choisir l'édition Community
```

## OpenNMS Horizon

```bash
# Debian/Ubuntu : dépôt debian.opennms.org (clé et sources selon la documentation), PostgreSQL et Java 17
sudo apt install opennms
sudo -u opennms /usr/share/opennms/bin/runjava -s && sudo -u opennms /usr/share/opennms/bin/install -dis
sudo systemctl enable --now opennms        # interface http://<serveur>:8980/opennms (admin/admin à changer)
```

Les équipements sont ajoutés par **requisitions** (provisioning : import manuel, plages de découverte, DNS, VMware). Les **événements** (traps, syslog) deviennent des **alarmes** corrélées. Docker : `opennms/horizon`.

## NetXMS

```bash
# Dépôt packages.netxms.org (Debian/Ubuntu, RHEL), puis
sudo apt install netxms-server netxms-dbdrv-pgsql netxms-agent
sudo nxdbmgr init                          # initialiser la base (configurée dans /etc/netxmsd.conf)
sudo systemctl enable --now netxmsd
```

Agents : Windows (MSI), Linux, macOS, AIX. Console : application de bureau (Windows, Linux, macOS) ou console web.

Interface : [[03-interface-graphique|interfaces graphiques]] · commandes : [[90-aide-memoire|aide-mémoire]].
