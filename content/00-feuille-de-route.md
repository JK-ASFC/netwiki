---
title: Feuille de route du contenu
description: Catalogue de tous les services et logiciels prévus dans NetWiki (Linux, Windows Server, macOS, outils), regroupés par fonction, avec leur état d'avancement et l'ordre des lots.
tags: [feuille de route, catalogue, avancement]
icon: map
---

NetWiki documente progressivement les services listés ci-dessous. Un même logiciel disponible sur plusieurs systèmes (ex. Nginx sous Linux, Windows et macOS) a **une seule fiche**, dont l'article d'installation couvre chaque OS. Les services sont rangés **par fonction** pour retrouver côte à côte les alternatives (Apache, Nginx, Caddy, IIS…).

**Légende** : ✅ documenté · 🔄 lot en cours · ⏳ prévu · ➖ non applicable

## Ordre des lots

| Lot | Contenu | État |
| --- | --- | --- |
| 0 | IIS, BIND9, ISC DHCP, FreeRADIUS, Active Directory (+ AD CS), Centreon | ✅ |
| 1 | Apache, Nginx, Caddy, HAProxy, Squid, Varnish, Unbound, dnsmasq (+ PXE), PowerDNS | ✅ |
| 2 | OpenSSH (+ SFTP), OpenVPN, WireGuard, strongSwan, Tailscale/Headscale, ZeroTier | ✅ |
| 3 | Samba, NFS, vsftpd, ProFTPD, Pure-FTPd, TFTP | ✅ |
| 4 | Postfix, Exim, Dovecot, Mailman 3, Rspamd, SpamAssassin, Mailpit | ✅ |
| 5 | MariaDB, MySQL, PostgreSQL, MongoDB, Redis, Memcached, SQLite, CouchDB | ✅ |
| 6 | Elasticsearch, OpenSearch, RabbitMQ, Kafka, Mosquitto, EMQX | ✅ |
| 7 | Docker, Podman, containerd, Kubernetes, K3s, Minikube, Kind, Portainer | ✅ |
| 8 | Git, GitLab, Gitea, Forgejo, Jenkins, TeamCity, SonarQube | ✅ |
| 9 | Prometheus, Grafana, Zabbix, Nagios, Icinga 2, Netdata, Checkmk, Telegraf, InfluxDB, PRTG | ✅ |
| 10 | rsyslog, Logstash, Fluent Bit, Graylog, Wazuh, Splunk, EventLog Analyzer | ✅ |
| 11 | Fail2ban, CrowdSec, AIDE, ClamAV, Suricata, Snort, Zeek, Lynis | ✅ |
| 12 | OpenLDAP, FreeIPA, Kerberos KDC, Keycloak, Authelia, Vault, Vaultwarden | ✅ |
| 13 | Ansible, Puppet, Salt, Terraform, PowerShell DSC | ✅ |
| 14 | Chrony, NTPsec, Kea DHCP, CUPS (+ serveur d'impression Windows) | ✅ |
| 15 | MinIO, Nextcloud, ownCloud, Seafile, Syncthing, WebDAV | ✅ |
| 16 | Restic, BorgBackup, Bacula, UrBackup, Veeam, Nakivo | ✅ |
| 17 | Rôles Windows : DNS, DHCP, NPS, RRAS, WDS, WSUS, Bureau à distance (RDS) | ✅ |
| 18 | Rôles Windows : serveur de fichiers, DFS, FSRM, iSCSI/MPIO, Storage Replica, déduplication | ✅ |
| 19 | Rôles Windows : Hyper-V, clustering, NLB, sauvegarde, BitLocker, Defender, pare-feu, IPAM | ✅ |
| 20 | Rôles Windows : AD FS, AD LDS, AD RMS, WinRM, Admin Center, Event Collector, SNMP, OpenSSH | ✅ |
| 21 | SQL Server (moteur, Agent, SSRS, SSIS, SSAS) | ✅ |
| 22 | Serveurs d'applications : PHP-FPM, Node.js, Python, Ruby, OpenJDK, Tomcat, WildFly | ✅ |
| 23 | Traefik, Nginx Proxy Manager, Dante | ✅ |
| 24 | Multimédia et services personnels (+ Radicale, Joplin Server) | ✅ |
| 25 | Outils de l'administrateur (réseau, sécurité, développement, support, IA) | ✅ |
| 26 | Compléments : FileZilla Server, Cerberus FTP, SMTP Windows, Neo4j, MSMQ, conteneurs Windows, Proxmox VE, VirtualBox, VMware Workstation, services TCP/IP simples | ✅ |
| 27 | Constructeurs — Cisco (IOS, routeurs, commutateurs, ASA, Meraki) et correspondance des commandes | ✅ |
| 28 | Constructeurs — commutation : HPE Comware, Aruba, Huawei, Alcatel-Lucent Enterprise, D-Link, TP-Link, Ubiquiti, Netgear, Zyxel, Arista | ✅ |
| 29 | Constructeurs — pare-feu : FortiGate, Fortinet SD-WAN et FortiSwitch, Stormshield, Palo Alto, pfSense/OPNsense, Sophos, Check Point, WatchGuard | ✅ |
| 30 | Constructeurs — Juniper, MikroTik, Mitel | ✅ |
| 31 | Téléphonie IP : fondamentaux, Asterisk, FreePBX, FreeSWITCH, Kamailio/OpenSIPS, 3CX, Cisco CME/CUCM, Alcatel OmniPCX/OXO/Rainbow, Mitel, Teams Phone, SBC, postes, softphones, diagnostic, visioconférence | ✅ |
| 32 | Aide-mémoires des commandes : annuaire et identité, DNS, DHCP, AAA (22) | ✅ |
| 33 | Aide-mémoires : serveurs web et applications, proxys et répartition de charge (17) | ✅ |
| 34 | Aide-mémoires : supervision, accès distant et VPN (22) | ✅ |
| 35 | Aide-mémoires : fichiers, partage et stockage (20) | ✅ |
| 36 | Aide-mémoires : messagerie et bases de données (19) | ✅ |
| 37 | Aide-mémoires : recherche, files de messages, conteneurs et virtualisation (20) | ✅ |
| 38 | Aide-mémoires : DevOps, journalisation, sécurité (26) | ✅ |
| 39 | Aide-mémoires : automatisation, infrastructure système, sauvegarde, multimédia (26) | ✅ |
| 40 | Logiciel 1.40 : recherche instantanée, retour en haut de page, mises à jour (paquets signés, GitHub avec accord), écran de démarrage, audit de sécurité, confidentialité/RGPD, licence MIT JK-ASFC, versions Linux/macOS/Android/iOS | ✅ |
| 41 | Aide-mémoires : outils (5), téléphonie IP (14), constructeurs (26) | ✅ |
| 42 | Logiciel 1.42 : soutien du projet (onglet « Soutenir », bouton ♥, lien de don Liberapay dans l'installateur, le README, les Releases et le bouton Sponsor de GitHub) | ✅ |
| 43 | Logiciel 1.43 : contenu publié chaque semaine (paquet signé sur la branche « contenu », appliqué automatiquement), mise à jour automatique du portable et de l'installeur Windows (empreintes signées), correction du retour à l'ancien contenu au redémarrage | ✅ |
| 44 | Mise à jour des articles : OpenTofu (présentation, fonctions propres, chiffrement de l’état, migration depuis Terraform) | ✅ |
| 45 | Logiciel 1.44 : images dans les articles (bouton « Insérer une image », légendes, agrandissement au clic, images dans la version mobile, contrôle des images manquantes) ; première capture : page de test d’Apache2 sous Debian | ✅ |

## Annuaire, identité & secrets

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[01-active-directory/01-presentation\|Active Directory Domain Services]] | ➖ | AD-Domain-Services | ➖ | ✅ |
| [[01-active-directory/10-adcs-pki\|AD Certificate Services]] | ➖ | ADCS-Cert-Authority | ➖ | ✅ |
| [[09-adfs/01-presentation-installation\|AD Federation Services]] | ➖ | ADFS-Federation | ➖ | ✅ |
| [[10-adlds/01-presentation-installation-exploitation\|AD Lightweight Directory Services]] | ➖ | ADLDS | ➖ | ✅ |
| [[11-adrms/01-presentation-deploiement\|AD Rights Management Services]] | ➖ | ADRMS | ➖ | ✅ |
| [[02-openldap/01-presentation-installation\|OpenLDAP]] | slapd | ➖ | openldap | ✅ |
| [[03-freeipa/01-presentation-installation\|FreeIPA]] | freeipa-server | ➖ | ➖ | ✅ |
| [[04-kerberos/01-presentation-installation\|Kerberos KDC (MIT)]] | krb5-kdc | ➖ | ➖ | ✅ |
| [[05-keycloak/01-presentation-installation\|Keycloak]] | keycloak | ➖ | keycloak | ✅ |
| [[06-authelia/01-presentation-configuration\|Authelia]] | authelia | ➖ | authelia | ✅ |
| [[07-vault/01-presentation-installation\|HashiCorp Vault]] | vault | ➖ | vault | ✅ |
| [[08-vaultwarden/01-presentation-installation\|Vaultwarden]] | ➖ | ➖ | vaultwarden | ✅ |

## DNS

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[01-bind9/01-presentation\|BIND9]] | bind9 | ➖ | bind | ✅ |
| [[02-unbound/01-presentation-installation\|Unbound]] | unbound | ➖ | unbound | ✅ |
| [[03-dnsmasq/01-presentation-installation\|dnsmasq]] | dnsmasq | ➖ | dnsmasq | ✅ |
| [[04-powerdns/01-presentation\|PowerDNS]] | pdns-server | ➖ | ➖ | ✅ |
| [[05-dns-windows/01-installation-zones-strategies\|Serveur DNS Windows]] | ➖ | DNS | ➖ | ✅ (voir aussi [[01-active-directory/03-dns-integre\|DNS intégré à AD]]) |

## DHCP & démarrage réseau

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[01-isc-dhcp/01-presentation\|ISC DHCP]] | isc-dhcp-server | ➖ | ➖ | ✅ |
| [[02-kea/01-presentation-installation\|Kea DHCP]] | kea-dhcp4-server | ➖ | kea | ✅ |
| [[03-dhcp-windows/01-presentation-installation\|Serveur DHCP Windows]] | ➖ | DHCP | ➖ | ✅ |
| [[06-tftp/01-presentation-installation\|Serveur TFTP]] | tftpd-hpa, tftp-server | Tftpd64, client TFTP | tftpd intégré | ✅ |
| [[03-dnsmasq/04-pxe-tftp\|PXE avec dnsmasq]] | dnsmasq | ➖ | ➖ | ✅ |
| [[04-wds/01-presentation-installation\|Windows Deployment Services]] | ➖ | WDS | ➖ | ✅ |

## AAA & accès réseau

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[01-freeradius/01-presentation\|FreeRADIUS]] | freeradius | ➖ | freeradius-server | ✅ |
| [[02-nps/01-presentation-installation\|Network Policy Server]] | ➖ | NPAS | ➖ | ✅ |

## Serveurs web & applications

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[01-iis/01-presentation\|IIS]] (+ FTP, outils de gestion, WAS) | ➖ | Web-Server, Web-Ftp-Server, Web-Mgmt-Tools, WAS | ➖ | ✅ |
| [[02-apache/01-presentation\|Apache HTTP Server]] | apache2 | Apache Lounge | httpd | ✅ |
| [[03-nginx/01-presentation\|Nginx]] | nginx | nginx | nginx | ✅ |
| [[04-caddy/01-presentation-installation\|Caddy]] | caddy | caddy | caddy | ✅ |
| [[05-php-fpm/01-presentation-installation-pools\|PHP (PHP-FPM)]] | php-fpm | PHP NTS (FastCGI IIS) | php | ✅ |
| [[06-nodejs/01-presentation-installation\|Node.js]] | nodejs | Node.js LTS | node | ✅ |
| [[07-python/01-environnements-gunicorn-uvicorn\|Python (Gunicorn / Uvicorn)]] | python3 | Waitress, Uvicorn | python | ✅ |
| [[08-ruby/01-ruby-puma-production\|Ruby (Puma)]] | ruby | ➖ | ruby | ✅ |
| [[09-openjdk/01-installation-exploitation\|Java OpenJDK]], [[10-tomcat/01-presentation-installation\|Tomcat]], [[11-wildfly/01-presentation-installation\|WildFly]] | openjdk, tomcat, wildfly | Temurin, Tomcat, WildFly | openjdk, tomcat, wildfly | ✅ |

## Proxy, cache & répartition de charge

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[01-haproxy/01-presentation\|HAProxy]] | haproxy | HAProxy (WSL/Docker) | haproxy | ✅ |
| [[02-squid/01-presentation\|Squid]] | squid | Squid for Windows | squid | ✅ |
| [[03-varnish/01-presentation-installation\|Varnish Cache]] | varnish | ➖ | varnish | ✅ |
| [[04-traefik/01-presentation-installation\|Traefik]] | traefik | traefik | traefik | ✅ |
| [[05-nginx-proxy-manager/01-presentation-installation-exploitation\|Nginx Proxy Manager]] | Docker | Docker | Docker | ✅ |
| [[06-dante/01-presentation-configuration\|Dante (SOCKS)]] | dante-server | ➖ | dante | ✅ |

## Accès distant & VPN

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[01-openssh/01-presentation\|OpenSSH Server (+ SFTP)]] | openssh-server | [[01-openssh/08-windows-server\|OpenSSH.Server]] | intégré | ✅ |
| [[02-openvpn/01-presentation\|OpenVPN]] | openvpn | OpenVPN Community | openvpn | ✅ |
| [[03-wireguard/01-presentation-installation\|WireGuard]] | wireguard | WireGuard for Windows | wireguard-tools | ✅ |
| [[04-strongswan/01-presentation\|strongSwan (IPsec)]] | strongswan | client IKEv2 natif | client IKEv2 natif | ✅ |
| [[05-tailscale-headscale/01-presentation-installation\|Tailscale / Headscale]] | tailscale, headscale | tailscale | tailscale, headscale | ✅ |
| [[06-zerotier/01-presentation-installation\|ZeroTier]] | zerotier-one | zerotier-one | zerotier-one | ✅ |
| [[07-rras/01-presentation-vpn\|Routage et accès distant (RRAS)]] | ➖ | RemoteAccess | ➖ | ✅ |
| [[08-rds/01-presentation-architecture\|Services Bureau à distance (Session Host, Gateway, Licensing, Broker, Web Access)]] | ➖ | RDS-* | ➖ | ✅ |
| [[10-windows-admin-center/01-presentation-installation\|Windows Admin Center]], [[09-winrm/01-presentation-configuration\|WinRM]] | ➖ | WindowsAdminCenter, WinRM | ➖ | ✅ |
| Serveur Telnet | ➖ | non disponible sur les versions modernes (remplacé par OpenSSH) | ➖ | ➖ |

## Fichiers, partage & stockage

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[01-samba/01-presentation\|Samba]] | samba | ➖ (serveur SMB natif) | samba (outils ; serveur SMB natif) | ✅ |
| [[02-nfs/01-presentation\|NFS]] | nfs-kernel-server, nfs-utils | FS-NFS-Service, client NFS | intégré | ✅ |
| [[03-vsftpd/01-presentation-installation\|vsftpd]], [[04-proftpd/01-presentation-installation\|ProFTPD]], [[05-pure-ftpd/01-presentation-installation\|Pure-FTPd]] | vsftpd, proftpd-core, pure-ftpd | ➖ | proftpd, pure-ftpd | ✅ |
| [[19-filezilla-server/01-installation-configuration\|FileZilla Server]], [[20-cerberus-ftp/01-presentation-configuration\|Cerberus FTP]] | filezilla-server | FileZilla Server, Cerberus | ➖ | ✅ |
| [[13-serveur-fichiers-windows/01-partages-ntfs-smb\|Serveur de fichiers]], [[14-dfs/01-espaces-noms\|DFS-N]], [[14-dfs/02-replication-dfsr\|DFS-R]], [[15-fsrm/01-quotas-filtrage-classification\|FSRM]] | ➖ | FS-FileServer, FS-DFS-*, FS-Resource-Manager | ➖ | ✅ |
| [[16-iscsi-mpio/01-cible-iscsi\|iSCSI Target]], [[16-iscsi-mpio/02-initiateur-mpio\|Multipath I/O]] | ➖ | FS-iSCSITarget-Server, Multipath-IO | ➖ | ✅ |
| [[17-storage-replica/01-presentation-deploiement\|Storage Replica]], [[18-deduplication/01-deduplication\|déduplication]] | ➖ | Storage-Replica, FS-Data-Deduplication | ➖ | ✅ |
| [[12-webdav/01-presentation-serveurs\|WebDAV (Apache, nginx, rclone serve)]] | apache2, nginx, rclone | IIS, rclone | rclone | ✅ |
| [[07-minio/01-presentation-installation\|MinIO]] | minio | MinIO | minio | ✅ |
| [[08-nextcloud/01-presentation-installation\|Nextcloud]], [[09-owncloud/01-presentation-installation\|ownCloud Infinite Scale]], [[10-seafile/01-presentation-installation\|Seafile]] | nextcloud, ocis, seafile (Docker) | Docker | Docker | ✅ |
| [[11-syncthing/01-presentation-installation\|Syncthing]] | syncthing | Syncthing | syncthing | ✅ |

## Messagerie & collaboration

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[01-postfix/01-presentation\|Postfix]] | postfix | ➖ (WSL / Docker) | postfix (intégré) | ✅ |
| [[03-exim/01-presentation-installation\|Exim]] | exim4 | ➖ | exim (Homebrew) | ✅ |
| [[02-dovecot/01-presentation-installation\|Dovecot]] | dovecot-imapd | ➖ | dovecot | ✅ |
| [[06-mailman/01-presentation-installation\|Mailman 3]] | mailman3-full | ➖ (Docker) | ➖ (Docker) | ✅ |
| [[04-rspamd/01-presentation-installation\|Rspamd]], [[05-spamassassin/01-presentation-installation\|SpamAssassin]] | rspamd, spamassassin | ➖ | rspamd, spamassassin | ✅ |
| [[07-mailpit/01-presentation-installation\|Mailpit (tests)]] | mailpit | mailpit | mailpit | ✅ |
| [[10-smtp-windows/01-relais-smtp\|Serveur SMTP Windows (relais IIS 6)]] | ➖ | SMTP-Server | ➖ | ✅ |
| [[08-radicale/01-installation-configuration\|Radicale (CalDAV / CardDAV)]], [[09-joplin-server/01-installation-exploitation\|Joplin Server]] | radicale | radicale (pip) | radicale, joplin-server | ✅ |

## Bases de données

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[01-mariadb-mysql/01-presentation\|MariaDB]] | mariadb-server | MariaDB (MSI) | mariadb | ✅ |
| [[01-mariadb-mysql/01-presentation\|MySQL]] | mysql-server | MySQL Server | mysql | ✅ |
| [[02-postgresql/01-presentation\|PostgreSQL]] | postgresql | PostgreSQL | postgresql | ✅ |
| [[03-mongodb/01-presentation-installation\|MongoDB]] | mongodb-org-server | MongoDB Community | mongodb-community | ✅ |
| [[04-redis/01-presentation-installation\|Redis / Valkey]] (Memurai sous Windows) | redis-server, valkey | Memurai | redis, valkey | ✅ |
| [[05-memcached/01-presentation-installation\|Memcached]] | memcached | ➖ | memcached | ✅ |
| [[06-sqlite/01-presentation-utilisation\|SQLite]] | sqlite3 | SQLite (outils) | intégré | ✅ |
| [[07-couchdb/01-presentation-installation\|CouchDB]] | couchdb | CouchDB (MSI) | couchdb | ✅ |
| [[09-neo4j/01-presentation-installation\|Neo4j]] | neo4j | Neo4j (ZIP, Desktop) | neo4j | ✅ |
| [[08-sql-server/01-presentation-installation\|SQL Server (moteur, Agent, SSRS, SSIS, SSAS)]] | mssql-server | SQL Server | ➖ (conteneur) | ✅ |

## Recherche, files de messages & IoT

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[01-elasticsearch/01-presentation-installation\|Elasticsearch]] | elasticsearch | Elasticsearch | elasticsearch | ✅ |
| [[02-opensearch/01-presentation-installation\|OpenSearch]] | opensearch | OpenSearch | opensearch | ✅ |
| [[03-rabbitmq/01-presentation-installation\|RabbitMQ]] | rabbitmq-server | RabbitMQ Server | rabbitmq | ✅ |
| [[04-kafka/01-presentation-installation\|Apache Kafka]] | kafka | Apache Kafka | kafka | ✅ |
| [[05-mosquitto/01-presentation-configuration\|Mosquitto (MQTT)]] | mosquitto | Eclipse Mosquitto | mosquitto | ✅ |
| [[06-emqx/01-presentation-installation\|EMQX (MQTT)]] | emqx | ➖ (Docker) | emqx | ✅ |
| [[07-msmq/01-presentation-exploitation\|Message Queuing (MSMQ)]] | ➖ | MSMQ | ➖ | ✅ |

## Conteneurs & virtualisation

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[01-docker/01-presentation-installation\|Docker Engine]] | docker-ce, docker.io | Docker Engine / Desktop | docker | ✅ |
| [[02-podman/01-presentation-installation\|Podman]] | podman | Podman (machine WSL) | podman | ✅ |
| [[03-containerd/01-presentation-utilisation\|containerd]] | containerd | containerd (nœuds Windows) | ➖ | ✅ |
| [[04-kubernetes/01-presentation-architecture\|Kubernetes (kubeadm, kubelet)]] | kubelet | kubeadm / kubelet | kubectl | ✅ |
| [[05-k3s/01-presentation-installation\|K3s]], [[06-minikube/01-installation-utilisation\|Minikube]], [[07-kind/01-installation-utilisation\|Kind]] | k3s | minikube, kind | minikube, kind | ✅ |
| [[08-portainer/01-presentation-installation\|Portainer]] | Docker | Docker | Docker | ✅ |
| [[10-conteneurs-windows/01-presentation-installation\|Conteneurs Windows]] | ➖ | Containers | ➖ | ✅ |
| [[09-hyper-v/01-presentation-installation\|Hyper-V (+ module PowerShell)]] | ➖ | Hyper-V, Hyper-V-PowerShell | ➖ | ✅ |
| [[11-proxmox-ve/01-presentation-installation\|Proxmox VE]], [[12-virtualbox/01-installation-utilisation\|VirtualBox]], [[13-vmware-workstation/01-installation-utilisation\|VMware Workstation]] | Proxmox VE, VirtualBox, Workstation | VirtualBox, VMware Workstation | VirtualBox, VMware Fusion | ✅ |

## DevOps & forges

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[01-git/01-presentation-installation\|Serveur Git]] | git | Git for Windows | git | ✅ |
| [[02-gitlab/01-presentation-installation\|GitLab]] | gitlab-ee | (Linux recommandé) | ➖ | ✅ |
| [[03-gitea/01-presentation-installation\|Gitea]], [[04-forgejo/01-presentation-installation\|Forgejo]] | gitea, forgejo | gitea.exe, forgejo.exe | gitea, forgejo | ✅ |
| [[05-jenkins/01-presentation-installation\|Jenkins]] | jenkins | Jenkins | jenkins-lts | ✅ |
| [[06-teamcity/01-presentation-installation\|TeamCity]] | TeamCity (archive, Docker) | TeamCity | ➖ | ✅ |
| [[07-sonarqube/01-presentation-installation\|SonarQube]] | sonarqube | SonarQube | sonarqube (Docker) | ✅ |

## Supervision & métriques

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[01-centreon/01-presentation\|Centreon]] | centreon | ➖ | ➖ | ✅ |
| [[02-prometheus/01-presentation-installation\|Prometheus]] | prometheus | Prometheus | prometheus | ✅ |
| [[03-grafana/01-presentation-installation\|Grafana]] | grafana | Grafana | grafana | ✅ |
| [[04-zabbix/01-presentation-installation\|Zabbix (serveur et agent)]] | zabbix-server-pgsql / -mysql | agent 2 (MSI) | zabbix-agent | ✅ |
| [[05-nagios/01-presentation-installation\|Nagios]], [[06-icinga/01-presentation-installation\|Icinga 2]] | nagios4, icinga2 | agents (NCPA, Icinga for Windows) | ➖ | ✅ |
| [[07-netdata/01-presentation-installation\|Netdata]] | netdata | agent Windows | netdata | ✅ |
| [[08-checkmk/01-presentation-installation\|Checkmk]] | check-mk | agent Checkmk | ➖ | ✅ |
| [[09-telegraf/01-presentation-configuration\|Telegraf]], [[10-influxdb/01-presentation-installation\|InfluxDB]] | telegraf, influxdb2 | telegraf.exe, influxd.exe | telegraf, influxdb | ✅ |
| [[11-prtg/01-presentation-installation\|PRTG Network Monitor]] | ➖ | PRTG | ➖ | ✅ |
| [[12-snmp-windows/01-service-snmp\|Service SNMP Windows]] | ➖ | SNMP-Service | ➖ | ✅ |

## Journaux & SIEM

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[01-rsyslog/01-presentation-installation\|rsyslog]] | rsyslog | ➖ (agents NXLog, Fluent Bit) | rsyslog | ✅ |
| [[02-logstash/01-presentation-installation\|Logstash]], [[03-fluent-bit/01-presentation-installation\|Fluent Bit]] | logstash, fluent-bit | Logstash (ZIP), Fluent Bit | logstash, fluent-bit | ✅ |
| [[04-graylog/01-presentation-installation\|Graylog]] | graylog-server | Sidecar | graylog | ✅ |
| [[05-wazuh/01-presentation-installation\|Wazuh]] | wazuh-manager | agent Wazuh | agent Wazuh | ✅ |
| [[06-splunk/01-presentation-installation\|Splunk Enterprise]] | splunk | Splunk Enterprise | splunk | ✅ |
| [[07-eventlog-analyzer/01-presentation-installation\|ManageEngine EventLog Analyzer]] | EventLog Analyzer (Linux) | EventLog Analyzer | ➖ | ✅ |
| [[08-windows-event-collector/01-presentation-configuration\|Windows Event Collector]] | ➖ | Wecsvc | ➖ | ✅ |

## Sécurité

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[01-fail2ban/01-presentation-configuration\|Fail2ban]], [[02-crowdsec/01-presentation-installation\|CrowdSec]] | fail2ban, crowdsec | CrowdSec (agent Windows) | fail2ban, crowdsec | ✅ |
| [[03-aide/01-installation-utilisation\|AIDE]] | aide | ➖ | ➖ | ✅ |
| [[04-clamav/01-presentation-installation\|ClamAV]] | clamav-daemon | ClamAV | clamav | ✅ |
| [[05-suricata/01-presentation-installation\|Suricata]], [[06-snort/01-presentation-installation\|Snort]], [[07-zeek/01-presentation-installation\|Zeek]] | suricata, snort, zeek | ➖ | ➖ | ✅ |
| [[08-lynis/01-installation-audit\|Lynis]] | lynis | ➖ | lynis | ✅ |
| [[09-defender/01-antivirus-configuration\|Microsoft Defender]], [[10-pare-feu-windows/01-profils-regles\|pare-feu Windows]], [[11-bitlocker/01-presentation-activation\|BitLocker]] | ➖ | Windows-Defender, pare-feu, BitLocker | ➖ | ✅ |

## Automatisation & configuration

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[01-ansible/01-presentation-installation\|Ansible]] | ansible | ➖ (WSL) | ansible | ✅ |
| [[02-puppet/01-presentation-installation\|Puppet / OpenVox]], [[03-salt/01-presentation-installation\|Salt]] | openvox-server, salt-master | agents | agents | ✅ |
| [[04-terraform/01-presentation-installation\|Terraform / OpenTofu]] | terraform, tofu | terraform, tofu | terraform, opentofu | ✅ |
| [[05-powershell-dsc/01-presentation-configurations\|PowerShell DSC]] | dsc (v3) | PSDesiredStateConfiguration, dsc | dsc (v3) | ✅ |

## Infrastructure & services système

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[01-chrony/01-presentation-client\|Chrony]], [[02-ntpsec/01-presentation-configuration\|NTPsec]] | chrony, ntpsec | ➖ (W32Time) | chrony | ✅ |
| [[03-impression/01-cups-presentation-installation\|CUPS]], [[03-impression/03-serveur-impression-windows\|serveur d’impression Windows]] | cups | Print-Server | intégré (CUPS) | ✅ |
| [[04-wsus/01-presentation-installation\|WSUS]] | ➖ | UpdateServices | ➖ | ✅ |
| [[06-ipam/01-presentation-deploiement\|IPAM]] | ➖ | IPAM | ➖ | ✅ |
| [[05-clustering/01-cluster-basculement\|Clustering de basculement]], [[05-clustering/02-nlb-exploitation-depannage\|NLB]] | ➖ | Failover-Clustering, NLB | ➖ | ✅ |
| [[07-services-tcpip-simples/01-presentation-risques\|Services TCP/IP simples]] | ➖ (inetd) | Simple-TCPIP | ➖ | ✅ (à ne pas installer en production) |

## Sauvegarde

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[01-restic/01-presentation-installation\|Restic]], [[02-borgbackup/01-presentation-installation\|BorgBackup]] | restic, borgbackup | restic | restic, borgbackup | ✅ |
| [[03-bacula/01-presentation-architecture\|Bacula (communauté / Enterprise)]] | bacula-director, bacula-sd, bacula-fd | bacula-fd | bacula-fd | ✅ |
| [[04-urbackup/01-presentation-installation\|UrBackup]] | urbackup-server | UrBackup Server | client | ✅ |
| [[05-veeam/01-presentation-architecture\|Veeam]], [[06-nakivo/01-presentation-installation\|NAKIVO]] | appliance v13, NAKIVO | Veeam B&R, NAKIVO | agents | ✅ |
| [[07-windows-server-backup/01-sauvegarde-restauration\|Sauvegarde Windows Server]] | ➖ | Windows-Server-Backup | ➖ | ✅ (voir aussi [[01-active-directory/08-sauvegarde-restauration\|sauvegarde AD]]) |

## Multimédia & services personnels

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[01-jellyfin/01-presentation-installation\|Jellyfin]], [[02-plex/01-presentation-installation-exploitation\|Plex]], [[03-navidrome/01-installation-configuration\|Navidrome]] | jellyfin, plexmediaserver, navidrome | Jellyfin, Plex, Navidrome | jellyfin, plex, navidrome | ✅ |
| [[04-icecast/01-installation-configuration\|Icecast]], [[05-nginx-rtmp/01-diffusion-direct\|Nginx RTMP]] | icecast2, libnginx-mod-rtmp | Icecast | icecast | ✅ |
| [[06-bittorrent/01-transmission\|Transmission]], [[06-bittorrent/02-qbittorrent\|qBittorrent]], [[06-bittorrent/03-deluge\|Deluge]] | transmission-daemon, qbittorrent-nox, deluged | Transmission, qBittorrent, Deluge | transmission, qbittorrent, deluge | ✅ |
| [[07-serveurs-jeux/01-minecraft\|Minecraft]], [[07-serveurs-jeux/02-terraria\|Terraria]] | Java + Paper, serveur dédié | serveurs dédiés | minecraft-server, terraria-server | ✅ |

## Outils de l'administrateur

| Domaine | Logiciels | État |
| --- | --- | --- |
| Administration et accès | [[01-openssh/01-presentation\|OpenSSH]], [[01-acces-administration/01-putty\|PuTTY]], [[01-acces-administration/02-termius\|Termius]], [[01-acces-administration/03-winscp\|WinSCP]], [[10-windows-admin-center/01-presentation-installation\|Windows Admin Center]], [[08-portainer/01-presentation-installation\|Portainer]] | ✅ |
| Réseau et diagnostic | [[02-reseau-diagnostic/01-wireshark-capture\|Wireshark]], [[02-reseau-diagnostic/03-nmap\|Nmap]], [[02-reseau-diagnostic/04-angry-ip-scanner\|Angry IP Scanner]], [[02-reseau-diagnostic/05-iperf3\|iPerf3]], [[02-reseau-diagnostic/06-dig-mtr-curl\|dig, mtr, curl]], [[02-reseau-diagnostic/07-postman-bruno\|Postman, Bruno]], [[02-reseau-diagnostic/08-greenbone-openvas\|Greenbone/OpenVAS]] | ✅ |
| Cybersécurité | [[09-defender/01-antivirus-configuration\|Microsoft Defender]], [[03-cybersecurite/01-nessus\|Nessus]], [[03-cybersecurite/02-owasp-zap\|OWASP ZAP]], [[03-cybersecurite/03-burp-suite\|Burp Suite]], [[03-cybersecurite/04-john-hashcat\|John the Ripper, Hashcat]], [[08-lynis/01-installation-audit\|Lynis]], [[03-cybersecurite/05-owasp-dependency-check\|OWASP Dependency-Check]], [[03-cybersecurite/06-keepassxc-bitwarden\|KeePassXC, Bitwarden]], [[03-cybersecurite/07-ghidra\|Ghidra]] | ✅ |
| Développement | [[04-developpement/01-vscode\|VS Code]], [[04-developpement/02-jetbrains-intellij-pycharm\|IntelliJ IDEA, PyCharm]], [[04-developpement/03-visual-studio\|Visual Studio]], [[04-developpement/04-eclipse\|Eclipse]], [[04-developpement/05-notepad-plus-plus\|Notepad++]], [[01-git/01-presentation-installation\|Git]], [[04-developpement/06-github-github-desktop\|GitHub, GitHub Desktop]], [[04-developpement/07-dbeaver\|DBeaver]], [[04-developpement/08-pgadmin-mysql-workbench\|pgAdmin, MySQL Workbench]], [[04-developpement/09-playwright\|Playwright]], [[04-developpement/10-uv\|uv]], [[06-nodejs/01-presentation-installation\|Node.js]] | ✅ |
| IA et productivité | [[05-ia-productivite/01-chatgpt\|ChatGPT]], [[05-ia-productivite/02-github-copilot\|GitHub Copilot]], [[05-ia-productivite/03-cursor\|Cursor]], [[05-ia-productivite/04-ollama-open-webui\|Ollama, Open WebUI]], [[05-ia-productivite/05-jupyterlab\|JupyterLab]], [[05-ia-productivite/06-n8n\|n8n]], [[05-ia-productivite/07-power-automate\|Power Automate]], [[05-ia-productivite/08-obsidian\|Obsidian]], [[05-ia-productivite/09-bookstack\|BookStack]] | ✅ |
| Support et prise en main | [[06-support-parc/01-anydesk-teamviewer\|AnyDesk, TeamViewer]], [[06-support-parc/02-rustdesk\|RustDesk]], [[06-support-parc/03-meshcentral\|MeshCentral]], [[06-support-parc/04-glpi-installation\|GLPI]], [[06-support-parc/06-zammad\|Zammad]], [[06-support-parc/07-ocs-inventory\|OCS Inventory NG]], [[06-support-parc/08-lansweeper\|Lansweeper]], [[06-support-parc/09-pdq-deploy\|PDQ Deploy]], [[06-support-parc/10-intune-inscription\|Intune]] | ✅ |
| Disques et récupération | [[07-disques-recuperation/01-gparted\|GParted]], [[07-disques-recuperation/02-clonezilla\|Clonezilla]], [[07-disques-recuperation/03-testdisk-photorec\|TestDisk, PhotoRec]] | ✅ |

## Équipements réseau par constructeur

| Constructeur / équipement | CLI | Outils graphiques | État |
| --- | --- | --- | --- |
| [[02-cisco-ios-bases/01-cli-fondamentaux\|Cisco IOS]], [[03-cisco-routeurs/01-interfaces-routage\|routeurs]], [[04-cisco-commutateurs/01-vlan-trunk-stp\|commutateurs Catalyst]] | IOS, IOS XE | WebUI, Catalyst Center, Cisco Business | ✅ |
| [[05-cisco-asa/01-presentation-acces-interfaces\|Cisco ASA]] | ASA | ASDM, FMC/FDM (FTD) | ✅ |
| [[26-cisco-meraki/01-tableau-de-bord-configuration\|Cisco Meraki]] | ➖ | Meraki Dashboard | ✅ |
| [[06-hpe-comware/01-cli-comware\|HPE Comware]] | Comware | Interface web, IMC | ✅ |
| [[07-aruba/01-aos-switch-cli\|Aruba AOS-S]], [[07-aruba/02-aos-cx-cli\|AOS-CX]] | AOS-S, AOS-CX | Interface web, NetEdit, Aruba Central | ✅ |
| [[08-huawei/01-vrp-bases-commutation\|Huawei]] | VRP | Interface web, iMaster NCE | ✅ |
| [[09-alcatel-lucent-enterprise/01-omniswitch-cli\|Alcatel-Lucent Enterprise]] | AOS (OmniSwitch) | WebView, OmniVista | ✅ |
| [[10-d-link/01-commutateurs-web-cli\|D-Link]] | CLI DGS/DXS | Interface web, Nuclias | ✅ |
| [[11-tp-link/01-jetstream-cli-web\|TP-Link]] | CLI JetStream | Interface web, Omada | ✅ |
| [[12-ubiquiti/01-unifi\|Ubiquiti UniFi]], [[12-ubiquiti/02-edgerouter-uisp\|EdgeRouter]] | EdgeOS, shell UniFi | UniFi Network, UISP | ✅ |
| [[13-netgear/01-commutateurs-geres\|Netgear]] | CLI M4xxx | Interface web, Insight | ✅ |
| [[14-zyxel/01-parefeux-commutateurs-nebula\|Zyxel]] | CLI ZLD/uOS | Interface web, Nebula | ✅ |
| [[25-arista/01-eos-cloudvision\|Arista]] | EOS, eAPI | CloudVision | ✅ |
| [[15-fortigate/01-acces-cli-gui\|FortiGate]] | FortiOS | GUI, FortiManager, FortiAnalyzer | ✅ |
| [[16-fortinet-routage-sdwan/01-routage-sdwan\|Fortinet routage et SD-WAN]], [[16-fortinet-routage-sdwan/02-fortiswitch-fortiap-fortimanager\|FortiSwitch, FortiAP]] | FortiOS | GUI (FortiLink), FortiManager | ✅ |
| [[17-stormshield/01-presentation-acces-administration\|Stormshield SNS]] | CLI serverd | Interface web, SMC | ✅ |
| [[18-palo-alto/01-acces-cli-webui\|Palo Alto]] | PAN-OS | WebUI, Panorama, Strata Cloud Manager | ✅ |
| [[19-pfsense-opnsense/01-pfsense\|pfSense]], [[19-pfsense-opnsense/02-opnsense\|OPNsense]] | Console, pfctl, API | webConfigurator | ✅ |
| [[20-sophos-firewall/01-sophos-firewall\|Sophos Firewall]] | Console SFOS | Interface web, Sophos Central | ✅ |
| [[21-check-point/01-gaia-smartconsole\|Check Point]] | clish, mode expert, mgmt_cli | Gaia Portal, SmartConsole | ✅ |
| [[22-watchguard/01-firebox-fireware\|WatchGuard]] | CLI Fireware | Web UI, WSM, WatchGuard Cloud | ✅ |
| [[23-juniper/01-junos-cli-commutation\|Juniper EX/QFX]], [[23-juniper/02-srx-securite-depannage\|SRX]] | Junos | J-Web, Mist, Junos Space | ✅ |
| [[24-mikrotik/01-routeros-cli-winbox\|MikroTik]] | RouterOS | WinBox, WebFig, The Dude | ✅ |
| [[27-mitel/01-reseau-telephonie-ip\|Mitel (réseau ToIP)]], [[27-mitel/02-plateformes-administration\|plateformes]] | ➖ | Web Admin, MiVoice 5000 Manager, System Administration Tool | ✅ |
| [[01-correspondance-commandes/01-administration-commutation\|Correspondance : commutation]], [[01-correspondance-commandes/02-routage-securite-diagnostic\|routage et pare-feu]] | Multi-constructeurs | ➖ | ✅ |

## Téléphonie IP (ToIP)

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[23-telephonie-ip/01-fondamentaux/01-sip-sdp-rtp-codecs\|Fondamentaux SIP/RTP]], [[23-telephonie-ip/01-fondamentaux/02-qualite-securite-dimensionnement\|QoS et sécurité]] | ➖ | ➖ | ➖ | ✅ |
| [[02-asterisk/01-presentation-installation\|Asterisk]] | sources, asterisk (Ubuntu) | VM / WSL2 | VM / Docker | ✅ |
| [[03-freepbx/01-installation-interface\|FreePBX]] | script Debian 12 | VM | VM | ✅ |
| [[04-freeswitch/01-presentation-installation\|FreeSWITCH]], FusionPBX | freeswitch-meta-all | MSI | brew freeswitch | ✅ |
| [[05-kamailio-opensips/01-kamailio\|Kamailio]], [[05-kamailio-opensips/02-opensips\|OpenSIPS]] | kamailio, opensips | ➖ | ➖ | ✅ |
| [[06-3cx/01-installation-configuration\|3CX]] | ISO / Debian 12 | selon version | client web | ✅ |
| [[07-cisco-cme-cucm/01-cme-ios\|Cisco CME]], [[07-cisco-cme-cucm/02-cucm-administration\|CUCM]] | appliance (VM) | RTMT | RTMT | ✅ |
| [[08-alcatel-omnipcx/01-omnipcx-enterprise\|Alcatel OmniPCX Enterprise]], [[08-alcatel-omnipcx/02-oxo-connect-rainbow\|OXO Connect, Rainbow]] | Call Server | OmniVista 8770, OMC | Rainbow | ✅ |
| [[09-mitel/01-mivoice-administration\|Mitel MiVoice]] | MSL, MiVoice 5000 | outils web | outils web | ✅ |
| [[10-teams-phone/01-teams-phone-direct-routing\|Teams Phone]], [[10-teams-phone/02-powershell-administration\|PowerShell]] | PowerShell 7, web | Teams, PowerShell | Teams, PowerShell 7 | ✅ |
| [[11-autres-ipbx/01-panorama-ipbx\|Autres IPBX et UCaaS]] | ➖ | ➖ | ➖ | ✅ |
| [[12-sbc-passerelles/01-sbc\|SBC]], [[12-sbc-passerelles/02-passerelles-analogiques-ata\|passerelles et ATA]] | Mediant VE, Anynode | Syslog Viewer, Anynode | ➖ | ✅ |
| [[13-postes-provisionnement/01-postes-ip-provisionnement\|Postes IP et provisionnement]] | Nginx/Apache | IIS | ➖ | ✅ |
| [[14-softphones/01-softphones\|Softphones]] | Linphone, Baresip | MicroSIP, Linphone | Linphone, Telephone | ✅ |
| [[15-diagnostic-voip/01-sngrep-wireshark-sipp\|sngrep, Wireshark, SIPp]], [[15-diagnostic-voip/02-homer-voipmonitor\|HOMER, VoIPmonitor]] | sngrep, sipp, sipsak | Wireshark, pktmon | Wireshark | ✅ |
| [[16-visioconference/01-jitsi-bigbluebutton\|Jitsi Meet, BigBlueButton]] | jitsi-meet, bbb-install | navigateur | navigateur | ✅ |
