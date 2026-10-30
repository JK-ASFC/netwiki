---
title: Aide-mémoires des commandes
description: Index de tous les aide-mémoires de commandes de NetWiki, un par service, classés par catégorie — commandes essentielles avec exemples prêts à copier pour l'installation, la configuration, l'exploitation, la sauvegarde et le dépannage.
tags: [aide-mémoire, commandes, index, référence]
icon: terminal
---

Chaque service documenté dispose d'un article **« aide-mémoire des commandes »** : les commandes utiles regroupées par thème, avec des exemples prêts à copier (et commentés). Les explications détaillées restent dans les articles du service. Pour les équipements réseau, voir aussi la [[01-correspondance-commandes/01-administration-commutation|correspondance des commandes entre constructeurs]].

## Annuaire, identité & secrets

- [[01-annuaire-identite/01-active-directory/90-aide-memoire|Active Directory]]
- [[01-annuaire-identite/02-openldap/90-aide-memoire|OpenLDAP]]
- [[01-annuaire-identite/03-freeipa/90-aide-memoire|FreeIPA]]
- [[01-annuaire-identite/04-kerberos/90-aide-memoire|Kerberos (MIT)]]
- [[01-annuaire-identite/05-keycloak/90-aide-memoire|Keycloak]]
- [[01-annuaire-identite/06-authelia/90-aide-memoire|Authelia]]
- [[01-annuaire-identite/07-vault/90-aide-memoire|HashiCorp Vault]]
- [[01-annuaire-identite/08-vaultwarden/90-aide-memoire|Vaultwarden]]
- [[01-annuaire-identite/09-adfs/90-aide-memoire|AD FS (fédération)]]
- [[01-annuaire-identite/10-adlds/90-aide-memoire|AD LDS]]
- [[01-annuaire-identite/11-adrms/90-aide-memoire|AD RMS]]

## DNS

- [[02-dns/01-bind9/90-aide-memoire|BIND9]]
- [[02-dns/02-unbound/90-aide-memoire|Unbound]]
- [[02-dns/03-dnsmasq/90-aide-memoire|dnsmasq]]
- [[02-dns/04-powerdns/90-aide-memoire|PowerDNS]]
- [[02-dns/05-dns-windows/90-aide-memoire|Serveur DNS Windows]]

## DHCP

- [[03-dhcp/01-isc-dhcp/90-aide-memoire|ISC DHCP (dhcpd)]]
- [[03-dhcp/02-kea/90-aide-memoire|Kea DHCP]]
- [[03-dhcp/03-dhcp-windows/90-aide-memoire|Serveur DHCP Windows]]
- [[03-dhcp/04-wds/90-aide-memoire|Services de déploiement Windows (WDS)]]

## AAA & Authentification

- [[04-aaa/01-freeradius/90-aide-memoire|FreeRADIUS]]
- [[04-aaa/02-nps/90-aide-memoire|NPS (serveur RADIUS Windows)]]

## Serveurs web & applications

- [[05-web/01-iis/90-aide-memoire|IIS]]
- [[05-web/02-apache/90-aide-memoire|Apache HTTP Server]]
- [[05-web/03-nginx/90-aide-memoire|Nginx]]
- [[05-web/04-caddy/90-aide-memoire|Caddy]]
- [[05-web/05-php-fpm/90-aide-memoire|PHP-FPM]]
- [[05-web/06-nodejs/90-aide-memoire|Node.js]]
- [[05-web/07-python/90-aide-memoire|Python (Gunicorn / Uvicorn)]]
- [[05-web/08-ruby/90-aide-memoire|Ruby (Puma)]]
- [[05-web/09-openjdk/90-aide-memoire|OpenJDK]]
- [[05-web/10-tomcat/90-aide-memoire|Apache Tomcat]]
- [[05-web/11-wildfly/90-aide-memoire|WildFly]]

## Supervision & métriques

- [[06-supervision/01-centreon/90-aide-memoire|Centreon]]
- [[06-supervision/02-prometheus/90-aide-memoire|Prometheus]]
- [[06-supervision/03-grafana/90-aide-memoire|Grafana]]
- [[06-supervision/04-zabbix/90-aide-memoire|Zabbix]]
- [[06-supervision/05-nagios/90-aide-memoire|Nagios]]
- [[06-supervision/06-icinga/90-aide-memoire|Icinga 2]]
- [[06-supervision/07-netdata/90-aide-memoire|Netdata]]
- [[06-supervision/08-checkmk/90-aide-memoire|Checkmk]]
- [[06-supervision/09-telegraf/90-aide-memoire|Telegraf]]
- [[06-supervision/10-influxdb/90-aide-memoire|InfluxDB]]
- [[06-supervision/11-prtg/90-aide-memoire|PRTG Network Monitor]]
- [[06-supervision/12-snmp-windows/90-aide-memoire|Service SNMP Windows]]

## Proxy, cache & répartition de charge

- [[07-proxy-cache/01-haproxy/90-aide-memoire|HAProxy]]
- [[07-proxy-cache/02-squid/90-aide-memoire|Squid]]
- [[07-proxy-cache/03-varnish/90-aide-memoire|Varnish Cache]]
- [[07-proxy-cache/04-traefik/90-aide-memoire|Traefik]]
- [[07-proxy-cache/05-nginx-proxy-manager/90-aide-memoire|Nginx Proxy Manager]]
- [[07-proxy-cache/06-dante/90-aide-memoire|Dante (SOCKS)]]

## Accès distant & VPN

- [[08-acces-distant-vpn/01-openssh/90-aide-memoire|OpenSSH (+ SFTP)]]
- [[08-acces-distant-vpn/02-openvpn/90-aide-memoire|OpenVPN]]
- [[08-acces-distant-vpn/03-wireguard/90-aide-memoire|WireGuard]]
- [[08-acces-distant-vpn/04-strongswan/90-aide-memoire|strongSwan (IPsec)]]
- [[08-acces-distant-vpn/05-tailscale-headscale/90-aide-memoire|Tailscale / Headscale]]
- [[08-acces-distant-vpn/06-zerotier/90-aide-memoire|ZeroTier]]
- [[08-acces-distant-vpn/07-rras/90-aide-memoire|RRAS (routage et accès distant)]]
- [[08-acces-distant-vpn/08-rds/90-aide-memoire|Services Bureau à distance (RDS)]]
- [[08-acces-distant-vpn/09-winrm/90-aide-memoire|WinRM et PowerShell à distance]]
- [[08-acces-distant-vpn/10-windows-admin-center/90-aide-memoire|Windows Admin Center]]

## Fichiers, partage & stockage

- [[09-fichiers-partage/01-samba/90-aide-memoire|Samba]]
- [[09-fichiers-partage/02-nfs/90-aide-memoire|NFS]]
- [[09-fichiers-partage/03-vsftpd/90-aide-memoire|vsftpd]]
- [[09-fichiers-partage/04-proftpd/90-aide-memoire|ProFTPD]]
- [[09-fichiers-partage/05-pure-ftpd/90-aide-memoire|Pure-FTPd]]
- [[09-fichiers-partage/06-tftp/90-aide-memoire|TFTP]]
- [[09-fichiers-partage/07-minio/90-aide-memoire|MinIO (stockage objet S3)]]
- [[09-fichiers-partage/08-nextcloud/90-aide-memoire|Nextcloud]]
- [[09-fichiers-partage/09-owncloud/90-aide-memoire|ownCloud (Infinite Scale)]]
- [[09-fichiers-partage/10-seafile/90-aide-memoire|Seafile]]
- [[09-fichiers-partage/11-syncthing/90-aide-memoire|Syncthing]]
- [[09-fichiers-partage/12-webdav/90-aide-memoire|WebDAV]]
- [[09-fichiers-partage/13-serveur-fichiers-windows/90-aide-memoire|Serveur de fichiers Windows]]
- [[09-fichiers-partage/14-dfs/90-aide-memoire|DFS (espaces de noms et réplication)]]
- [[09-fichiers-partage/15-fsrm/90-aide-memoire|FSRM (gestion des ressources)]]
- [[09-fichiers-partage/16-iscsi-mpio/90-aide-memoire|iSCSI et MPIO]]
- [[09-fichiers-partage/17-storage-replica/90-aide-memoire|Storage Replica]]
- [[09-fichiers-partage/18-deduplication/90-aide-memoire|Déduplication des données]]
- [[09-fichiers-partage/19-filezilla-server/90-aide-memoire|FileZilla Server]]
- [[09-fichiers-partage/20-cerberus-ftp/90-aide-memoire|Cerberus FTP Server]]

## Messagerie & collaboration

- [[10-messagerie/01-postfix/90-aide-memoire|Postfix]]
- [[10-messagerie/02-dovecot/90-aide-memoire|Dovecot]]
- [[10-messagerie/03-exim/90-aide-memoire|Exim]]
- [[10-messagerie/04-rspamd/90-aide-memoire|Rspamd]]
- [[10-messagerie/05-spamassassin/90-aide-memoire|SpamAssassin]]
- [[10-messagerie/06-mailman/90-aide-memoire|Mailman 3]]
- [[10-messagerie/07-mailpit/90-aide-memoire|Mailpit]]
- [[10-messagerie/08-radicale/90-aide-memoire|Radicale (CalDAV / CardDAV)]]
- [[10-messagerie/09-joplin-server/90-aide-memoire|Joplin Server]]
- [[10-messagerie/10-smtp-windows/90-aide-memoire|Serveur SMTP Windows]]

## Bases de données

- [[11-bases-de-donnees/01-mariadb-mysql/90-aide-memoire|MariaDB / MySQL]]
- [[11-bases-de-donnees/02-postgresql/90-aide-memoire|PostgreSQL]]
- [[11-bases-de-donnees/03-mongodb/90-aide-memoire|MongoDB]]
- [[11-bases-de-donnees/04-redis/90-aide-memoire|Redis / Valkey]]
- [[11-bases-de-donnees/05-memcached/90-aide-memoire|Memcached]]
- [[11-bases-de-donnees/06-sqlite/90-aide-memoire|SQLite]]
- [[11-bases-de-donnees/07-couchdb/90-aide-memoire|CouchDB]]
- [[11-bases-de-donnees/08-sql-server/90-aide-memoire|Microsoft SQL Server]]
- [[11-bases-de-donnees/09-neo4j/90-aide-memoire|Neo4j]]

## Recherche, files de messages & IoT

- [[12-recherche-messages/01-elasticsearch/90-aide-memoire|Elasticsearch]]
- [[12-recherche-messages/02-opensearch/90-aide-memoire|OpenSearch]]
- [[12-recherche-messages/03-rabbitmq/90-aide-memoire|RabbitMQ]]
- [[12-recherche-messages/04-kafka/90-aide-memoire|Apache Kafka]]
- [[12-recherche-messages/05-mosquitto/90-aide-memoire|Mosquitto (MQTT)]]
- [[12-recherche-messages/06-emqx/90-aide-memoire|EMQX (MQTT)]]
- [[12-recherche-messages/07-msmq/90-aide-memoire|Message Queuing (MSMQ)]]

## Conteneurs & virtualisation

- [[13-conteneurs/01-docker/90-aide-memoire|Docker]]
- [[13-conteneurs/02-podman/90-aide-memoire|Podman]]
- [[13-conteneurs/03-containerd/90-aide-memoire|containerd]]
- [[13-conteneurs/04-kubernetes/90-aide-memoire|Kubernetes]]
- [[13-conteneurs/05-k3s/90-aide-memoire|K3s]]
- [[13-conteneurs/06-minikube/90-aide-memoire|Minikube]]
- [[13-conteneurs/07-kind/90-aide-memoire|Kind]]
- [[13-conteneurs/08-portainer/90-aide-memoire|Portainer]]
- [[13-conteneurs/09-hyper-v/90-aide-memoire|Hyper-V]]
- [[13-conteneurs/10-conteneurs-windows/90-aide-memoire|Conteneurs Windows]]
- [[13-conteneurs/11-proxmox-ve/90-aide-memoire|Proxmox VE]]
- [[13-conteneurs/12-virtualbox/90-aide-memoire|VirtualBox]]
- [[13-conteneurs/13-vmware-workstation/90-aide-memoire|VMware Workstation Pro]]

## DevOps & forges

- [[14-devops/01-git/90-aide-memoire|Git]]
- [[14-devops/02-gitlab/90-aide-memoire|GitLab]]
- [[14-devops/03-gitea/90-aide-memoire|Gitea]]
- [[14-devops/04-forgejo/90-aide-memoire|Forgejo]]
- [[14-devops/05-jenkins/90-aide-memoire|Jenkins]]
- [[14-devops/06-teamcity/90-aide-memoire|TeamCity]]
- [[14-devops/07-sonarqube/90-aide-memoire|SonarQube]]

## Journaux & SIEM

- [[15-journalisation/01-rsyslog/90-aide-memoire|rsyslog]]
- [[15-journalisation/02-logstash/90-aide-memoire|Logstash]]
- [[15-journalisation/03-fluent-bit/90-aide-memoire|Fluent Bit]]
- [[15-journalisation/04-graylog/90-aide-memoire|Graylog]]
- [[15-journalisation/05-wazuh/90-aide-memoire|Wazuh]]
- [[15-journalisation/06-splunk/90-aide-memoire|Splunk Enterprise]]
- [[15-journalisation/07-eventlog-analyzer/90-aide-memoire|EventLog Analyzer]]
- [[15-journalisation/08-windows-event-collector/90-aide-memoire|Collecteur d'événements Windows (WEF/WEC)]]

## Sécurité

- [[16-securite/01-fail2ban/90-aide-memoire|Fail2ban]]
- [[16-securite/02-crowdsec/90-aide-memoire|CrowdSec]]
- [[16-securite/03-aide/90-aide-memoire|AIDE]]
- [[16-securite/04-clamav/90-aide-memoire|ClamAV]]
- [[16-securite/05-suricata/90-aide-memoire|Suricata]]
- [[16-securite/06-snort/90-aide-memoire|Snort]]
- [[16-securite/07-zeek/90-aide-memoire|Zeek]]
- [[16-securite/08-lynis/90-aide-memoire|Lynis]]
- [[16-securite/09-defender/90-aide-memoire|Microsoft Defender]]
- [[16-securite/10-pare-feu-windows/90-aide-memoire|Pare-feu Windows]]
- [[16-securite/11-bitlocker/90-aide-memoire|BitLocker]]

## Automatisation & configuration

- [[17-automatisation/01-ansible/90-aide-memoire|Ansible]]
- [[17-automatisation/02-puppet/90-aide-memoire|Puppet / OpenVox]]
- [[17-automatisation/03-salt/90-aide-memoire|Salt]]
- [[17-automatisation/04-terraform/90-aide-memoire|Terraform / OpenTofu]]
- [[17-automatisation/05-powershell-dsc/90-aide-memoire|PowerShell DSC]]

## Infrastructure & services système

- [[18-infrastructure-systeme/01-chrony/90-aide-memoire|Chrony (NTP / NTS)]]
- [[18-infrastructure-systeme/02-ntpsec/90-aide-memoire|NTPsec]]
- [[18-infrastructure-systeme/03-impression/90-aide-memoire|Impression (CUPS, Windows)]]
- [[18-infrastructure-systeme/04-wsus/90-aide-memoire|WSUS]]
- [[18-infrastructure-systeme/05-clustering/90-aide-memoire|Clustering de basculement et NLB]]
- [[18-infrastructure-systeme/06-ipam/90-aide-memoire|IPAM Windows]]
- [[18-infrastructure-systeme/07-services-tcpip-simples/90-aide-memoire|Services TCP/IP simples]]

## Sauvegarde & restauration

- [[19-sauvegarde/01-restic/90-aide-memoire|Restic]]
- [[19-sauvegarde/02-borgbackup/90-aide-memoire|BorgBackup]]
- [[19-sauvegarde/03-bacula/90-aide-memoire|Bacula]]
- [[19-sauvegarde/04-urbackup/90-aide-memoire|UrBackup]]
- [[19-sauvegarde/05-veeam/90-aide-memoire|Veeam Backup & Replication]]
- [[19-sauvegarde/06-nakivo/90-aide-memoire|NAKIVO Backup & Replication]]
- [[19-sauvegarde/07-windows-server-backup/90-aide-memoire|Sauvegarde Windows Server]]

## Multimédia & services personnels

- [[20-multimedia-services/01-jellyfin/90-aide-memoire|Jellyfin]]
- [[20-multimedia-services/02-plex/90-aide-memoire|Plex Media Server]]
- [[20-multimedia-services/03-navidrome/90-aide-memoire|Navidrome]]
- [[20-multimedia-services/04-icecast/90-aide-memoire|Icecast]]
- [[20-multimedia-services/05-nginx-rtmp/90-aide-memoire|Nginx RTMP]]
- [[20-multimedia-services/06-bittorrent/90-aide-memoire|Clients BitTorrent]]
- [[20-multimedia-services/07-serveurs-jeux/90-aide-memoire|Serveurs de jeux]]

## Outils de l'administrateur

- [[21-outils/01-acces-administration/90-aide-memoire|Accès et administration]]
- [[21-outils/04-developpement/90-aide-memoire|Développement]]
- [[21-outils/05-ia-productivite/90-aide-memoire|IA et productivité]]
- [[21-outils/06-support-parc/90-aide-memoire|Support et gestion de parc]]
- [[21-outils/07-disques-recuperation/90-aide-memoire|Disques et récupération]]

## Équipements réseau par constructeur

- [[22-constructeurs/02-cisco-ios-bases/90-aide-memoire|Cisco — bases IOS / IOS XE]]
- [[22-constructeurs/03-cisco-routeurs/90-aide-memoire|Cisco — routeurs (ISR, Catalyst 8000)]]
- [[22-constructeurs/04-cisco-commutateurs/90-aide-memoire|Cisco — commutateurs Catalyst]]
- [[22-constructeurs/05-cisco-asa/90-aide-memoire|Cisco — ASA (et FTD)]]
- [[22-constructeurs/06-hpe-comware/90-aide-memoire|HPE — commutateurs Comware]]
- [[22-constructeurs/07-aruba/90-aide-memoire|Aruba — commutateurs AOS-S et AOS-CX]]
- [[22-constructeurs/08-huawei/90-aide-memoire|Huawei — VRP]]
- [[22-constructeurs/09-alcatel-lucent-enterprise/90-aide-memoire|Alcatel-Lucent Enterprise — OmniSwitch]]
- [[22-constructeurs/10-d-link/90-aide-memoire|D-Link]]
- [[22-constructeurs/11-tp-link/90-aide-memoire|TP-Link — JetStream et Omada]]
- [[22-constructeurs/12-ubiquiti/90-aide-memoire|Ubiquiti — UniFi et EdgeRouter]]
- [[22-constructeurs/13-netgear/90-aide-memoire|Netgear — commutateurs gérés]]
- [[22-constructeurs/14-zyxel/90-aide-memoire|Zyxel — pare-feu et commutateurs]]
- [[22-constructeurs/15-fortigate/90-aide-memoire|Fortinet — FortiGate (pare-feu)]]
- [[22-constructeurs/16-fortinet-routage-sdwan/90-aide-memoire|Fortinet — routage, SD-WAN et Security Fabric]]
- [[22-constructeurs/17-stormshield/90-aide-memoire|Stormshield — SNS]]
- [[22-constructeurs/18-palo-alto/90-aide-memoire|Palo Alto Networks — PAN-OS]]
- [[22-constructeurs/19-pfsense-opnsense/90-aide-memoire|pfSense et OPNsense]]
- [[22-constructeurs/20-sophos-firewall/90-aide-memoire|Sophos Firewall]]
- [[22-constructeurs/21-check-point/90-aide-memoire|Check Point]]
- [[22-constructeurs/22-watchguard/90-aide-memoire|WatchGuard Firebox]]
- [[22-constructeurs/23-juniper/90-aide-memoire|Juniper — Junos]]
- [[22-constructeurs/24-mikrotik/90-aide-memoire|MikroTik — RouterOS]]
- [[22-constructeurs/25-arista/90-aide-memoire|Arista — EOS]]
- [[22-constructeurs/26-cisco-meraki/90-aide-memoire|Cisco Meraki]]
- [[22-constructeurs/27-mitel/90-aide-memoire|Mitel — téléphonie IP]]

## Téléphonie IP (ToIP)

- [[23-telephonie-ip/02-asterisk/90-aide-memoire|Asterisk]]
- [[23-telephonie-ip/03-freepbx/90-aide-memoire|FreePBX]]
- [[23-telephonie-ip/04-freeswitch/90-aide-memoire|FreeSWITCH]]
- [[23-telephonie-ip/05-kamailio-opensips/90-aide-memoire|Kamailio et OpenSIPS]]
- [[23-telephonie-ip/06-3cx/90-aide-memoire|3CX]]
- [[23-telephonie-ip/07-cisco-cme-cucm/90-aide-memoire|Cisco — CME et CUCM]]
- [[23-telephonie-ip/08-alcatel-omnipcx/90-aide-memoire|Alcatel-Lucent — OmniPCX et Rainbow]]
- [[23-telephonie-ip/09-mitel/90-aide-memoire|Mitel — MiVoice]]
- [[23-telephonie-ip/10-teams-phone/90-aide-memoire|Microsoft Teams Phone]]
- [[23-telephonie-ip/12-sbc-passerelles/90-aide-memoire|SBC et passerelles]]
- [[23-telephonie-ip/13-postes-provisionnement/90-aide-memoire|Postes IP et provisionnement]]
- [[23-telephonie-ip/14-softphones/90-aide-memoire|Softphones]]
- [[23-telephonie-ip/15-diagnostic-voip/90-aide-memoire|Diagnostic VoIP]]
- [[23-telephonie-ip/16-visioconference/90-aide-memoire|Visioconférence]]
