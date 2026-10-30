# NetWiki — le wiki local de l'architecte réseau

Application de bureau **Windows / macOS / Linux** (Electron) pour documenter la présentation, l'installation et la configuration des services d'infrastructure. Les articles sont de simples fichiers **Markdown** stockés localement : ajout, modification, suppression, déplacement et recherche plein texte hors ligne.

## Licence, propriété et confidentialité

- **Licence MIT** — Copyright © 2026 **JK-ASFC** ([LICENSE](LICENSE)) : utilisation, modification et redistribution libres, à condition de conserver la mention de copyright et la licence. L'attribution est vérifiée au démarrage et affichée dans *Paramètres → À propos*.
- **Confidentialité** : aucune donnée collectée, aucune télémétrie, aucune connexion sans accord ([PRIVACY.md](PRIVACY.md), [RGPD.md](RGPD.md)).
- **Sécurité** : mesures et signalement des vulnérabilités dans [SECURITY.md](SECURITY.md).
- **Mises à jour** : vérification facultative des [Releases GitHub](https://github.com/JK-ASFC/netwiki/releases) et paquets de contenu `.netwiki` signés (Ed25519) par JK-ASFC ; export/import de paquets pour les postes hors ligne.

## Plateformes

| Plateforme | Format | Compilation |
| --- | --- | --- |
| Windows | Installeur NSIS et version portable | Locale (`npm run dist:win`) ou GitHub Actions |
| macOS | DMG et ZIP | GitHub Actions (runner macOS) |
| Linux | AppImage et .deb | GitHub Actions (runner Ubuntu) |
| Android | APK de test, AAB pour le Play Store | GitHub Actions (Capacitor, dossier `mobile/`) |
| iOS | Application pour simulateur ; App Store après signature Apple | GitHub Actions (Capacitor) |

Guide complet : [docs/PUBLICATION.md](docs/PUBLICATION.md).

## Contenu livré

| Catégorie | Service | Articles |
| --- | --- | --- |
| Annuaire & Identité | Active Directory (AD DS, DNS intégré, GPO, sites, FSMO, sauvegarde, sécurité, AD CS, approbations, dépannage) | 12 |
| DNS | BIND9 (cache, zones, primaire/secondaire, vues, DNSSEC, DDNS, RPZ, DoT/DoH, rndc) | 10 |
| DNS | Unbound (résolveur validant, zones locales, RPZ, vues, DoT/DoH, unbound-control) | 5 |
| DNS | dnsmasq (DNS, DHCP, IPv6, PXE/TFTP, proxy DHCP, iPXE) | 5 |
| DNS | PowerDNS (autoritaire SQL + API, DNSSEC, réplication, enregistrements Lua, Recursor, dnsdist) | 6 |
| DHCP | ISC DHCP (base, réservations/classes/PXE/option 43/82, relais, failover, DDNS, DHCPv6, migration Kea) | 9 |
| AAA & Authentification | FreeRADIUS (clients, unlang, SQL, LDAP/AD, EAP-PEAP/TLS, 802.1X, VLAN dynamique, MAB, admin équipements, proxy, CoA) | 11 |
| Serveurs Web | IIS (sites/pools, HTTPS, authentification, URL Rewrite/ARR, ASP.NET/PHP, performances, sécurité, FTP, journaux) | 12 |
| Serveurs Web | Apache (MPM, vhosts, TLS, PHP-FPM, reverse proxy, ModSecurity, LDAP/Kerberos, performances) | 8 |
| Serveurs Web | Nginx (server/location, TLS, HTTP/3, upstreams, cache, limitation de débit, auth_request, stream) | 8 |
| Serveurs Web | Caddy (HTTPS automatique, Caddyfile, reverse proxy, API, PKI interne, modules) | 5 |
| Proxy, cache & répartition | HAProxy (frontends/backends, ACL, stick-tables, TLS, ACME, keepalived, API runtime) | 7 |
| Proxy, cache & répartition | Squid (ACL, Kerberos/AD, SSL Bump, ICAP/ClamAV, transparent, WPAD) | 6 |
| Proxy, cache & répartition | Varnish (VCL, purge/ban/xkey, grâce, ESI, Hitch, outils) | 5 |
| Accès distant & VPN | OpenSSH + SFTP (durcissement, clés et certificats, tunnels, bastion, chroot, MFA, AD) | 7 |
| Accès distant & VPN | OpenVPN (PKI easy-rsa, accès distant, LDAP/RADIUS/MFA, site à site, DCO, clients) | 6 |
| Accès distant & VPN | WireGuard (accès distant, site à site, routage dynamique, gestion à grande échelle) | 5 |
| Accès distant & VPN | strongSwan IPsec (IKEv2, site à site, interop Cisco/FortiGate/cloud, clients natifs, EAP/RADIUS, PKI) | 6 |
| Accès distant & VPN | Tailscale / Headscale (subnet routers, exit nodes, MagicDNS, ACL, SSH, auto-hébergement, OIDC) | 4 |
| Accès distant & VPN | ZeroTier (réseaux L2, routes, bridging, règles de flux, API, contrôleur, moons) | 3 |
| Fichiers & partage | Samba (partages, membre AD/winbind, ACL Windows, contrôleur de domaine AD, corbeille, versions précédentes, Time Machine, DFS, CTDB, durcissement) | 9 |
| Fichiers & partage | NFS (v3/v4.2, exports, autofs, Kerberos krb5p, idmap, RPC-over-TLS, performances, Pacemaker/DRBD, clients Windows/macOS) | 6 |
| Fichiers & partage | vsftpd (concepts FTP/FTPS, chroot, utilisateurs virtuels PAM, FTPS, fail2ban) | 4 |
| Fichiers & partage | ProFTPD (Limit/Directory, mod_tls, mod_sftp, SQL/LDAP, quotas, mod_ban) | 3 |
| Fichiers & partage | Pure-FTPd (PureDB, quotas/débits par utilisateur, TLS, LDAP, scripts après dépôt) | 3 |
| Fichiers & partage | TFTP (tftpd-hpa, PXE BIOS/UEFI, sauvegardes Cisco, conntrack/nftables, dépannage) | 3 |
| Messagerie | Postfix (relais, smarthost, domaines virtuels, submission, TLS/DANE/MTA-STS, SPF/DKIM/DMARC, postscreen, passerelle Exchange/M365, files) | 9 |
| Messagerie | Dovecot (IMAP, LMTP, passdb/userdb LDAP-AD/SQL, Sieve, apprentissage IMAPSieve, quotas, migration, 2.3 → 2.4) | 5 |
| Messagerie | Exim (debconf, ACL, routeurs, transports, Rspamd, DKIM, exim -bh) | 3 |
| Messagerie | Rspamd (milter, actions, Bayes Redis, DKIM/ARC, multimap, ratelimit, ClamAV) | 3 |
| Messagerie | SpamAssassin (spamd, spamass-milter, Bayes, Razor/Pyzor, règles locales) | 2 |
| Messagerie | Mailman 3 (Core, Postorius, HyperKitty, Postfix, modération, DMARC/ARC, migration 2.1) | 3 |
| Messagerie | Mailpit (SMTP de test, API REST, CI, relais) | 2 |
| Bases de données | MariaDB / MySQL (InnoDB, comptes, PAM/AD, TLS, sauvegarde mariadb-backup/XtraBackup, PITR, réplication GTID, Galera, InnoDB Cluster, proxys) | 8 |
| Bases de données | PostgreSQL (pg_hba, rôles, RLS, pgaudit, pgBackRest, PITR, streaming, logique, Patroni, PgBouncer, VACUUM, EXPLAIN, pg_upgrade) | 8 |
| Bases de données | MongoDB (sécurité, x.509, replica sets, sharding, mongodump, PBM) | 4 |
| Bases de données | Redis / Valkey (persistance, ACL, TLS, Sentinel, Cluster) | 4 |
| Bases de données | Memcached (configuration, sécurité, statistiques) | 2 |
| Bases de données | SQLite (shell, WAL, sauvegarde, Litestream, récupération) | 2 |
| Bases de données | CouchDB (sécurité, cluster, réplication multi-maîtres, exploitation) | 3 |
| Recherche & messages | Elasticsearch (cluster, sécurité, mappings, ILM, snapshots, Kibana) | 4 |
| Recherche & messages | OpenSearch (plugin de sécurité, LDAP/AD, DLS/FLS, ISM, Dashboards) | 3 |
| Recherche & messages | RabbitMQ (vhosts, politiques, TLS, LDAP, cluster, files quorum, fédération) | 4 |
| Recherche & messages | Apache Kafka (KRaft, réplication, SASL/TLS/ACL, groupes, réaffectation) | 4 |
| Recherche & messages | Mosquitto (MQTT, ACL, TLS, ponts) et EMQX (cluster, règles) | 4 |
| Conteneurs | Docker (images, réseaux, plages d'adresses, DOCKER-USER, Compose, sécurité) | 5 |
| Conteneurs | Podman (rootless, Quadlet) et containerd (CRI, nerdctl, crictl) | 3 |
| Conteneurs | Kubernetes (kubeadm, CNI, MetalLB/BGP, Ingress/Gateway, stockage, RBAC, etcd, mises à niveau) | 7 |
| Conteneurs | K3s, Minikube, Kind, Portainer | 6 |
| DevOps & forges | Git (flux de travail, hooks, LFS, signature) | 3 |
| DevOps & forges | GitLab (Omnibus, LDAP/AD, OIDC, CI/CD, runners, sauvegardes) | 4 |
| DevOps & forges | Gitea et Forgejo (app.ini, LDAP, Actions, migration) | 5 |
| DevOps & forges | Jenkins (Jenkinsfile, agents, JCasC), TeamCity (Kotlin DSL), SonarQube (quality gates) | 7 |
| Supervision | Prometheus (exporteurs, SNMP, blackbox, PromQL, Alertmanager, stockage longue durée) | 4 |
| Supervision | Grafana (tableaux, variables, alertes, LDAP/OIDC, provisionnement) | 3 |
| Supervision | Zabbix (agents, PSK, SNMP, LLD, proxys, HA) | 5 |
| Supervision | Nagios, Icinga 2 (DSL, zones, Director), Checkmk (OMD, règles) | 9 |
| Supervision | Netdata, Telegraf (SNMP, gNMI), InfluxDB, PRTG | 8 |
| Journaux & SIEM | rsyslog (centralisation TLS, files d'attente, équipements réseau) | 3 |
| Journaux & SIEM | Logstash (grok, dissect, DLQ) et Fluent Bit (Windows, Kubernetes) | 4 |
| Journaux & SIEM | Graylog (Sidecar, flux, pipelines, alertes) | 3 |
| Journaux & SIEM | Wazuh (règles, FIM, SCA, vulnérabilités, réponse active) | 3 |
| Journaux & SIEM | Splunk Enterprise (forwarders, SC4S, SPL, clusters) et EventLog Analyzer | 5 |
| Sécurité | Fail2ban, CrowdSec (bouncers, CTI), AIDE, ClamAV (clamd, milter, ICAP) | 7 |
| Sécurité | Suricata (IDS/IPS, EVE JSON), Snort 3, Zeek (scripts, cluster), Lynis | 8 |
| Annuaire & identité | OpenLDAP (cn=config, ACL, réplication), FreeIPA (HBAC, sudo, approbation AD), Kerberos MIT | 8 |
| Annuaire & identité | Keycloak (fédération LDAP, OIDC/SAML, MFA), Authelia, HashiCorp Vault (secrets, PKI, SSH), Vaultwarden | 10 |
| Automatisation | Ansible (playbooks, rôles, équipements réseau, Windows, AWX), Puppet / OpenVox, Salt (NAPALM) | 8 |
| Automatisation | Terraform / OpenTofu (état, modules, import, fournisseurs réseau, CI) et PowerShell DSC (1.1, v3) | 5 |
| Infrastructure | Chrony et NTPsec (NTS, GPS/PPS), CUPS et serveur d'impression Windows | 6 |
| DHCP | Kea (réservations, classes, DHCPv6, DDNS, HA, API, Stork) | 3 |
| Fichiers & stockage | MinIO (S3, IAM, verrouillage d'objets), Nextcloud, ownCloud Infinite Scale, Seafile | 9 |
| Fichiers & stockage | Syncthing (découverte et relais privés) et WebDAV (Apache, nginx, rclone, clients) | 4 |
| Sauvegarde | Restic, BorgBackup / borgmatic (dépôts en ajout seul, rétention), Bacula (Director, pools, bandes) | 7 |
| Sauvegarde | UrBackup (fichiers et images), Veeam (dépôt renforcé, SureBackup), NAKIVO | 7 |
| Rôles Windows | DNS (stratégies, DNSSEC), DHCP (basculement, stratégies), WDS, NPS (802.1X, VLAN dynamiques) | 8 |
| Rôles Windows | RRAS (Always On VPN), WSUS, Services Bureau à distance (passerelle, FSLogix) | 7 |
| Rôles Windows | Serveur de fichiers (NTFS, SMB 3, SMB sur QUIC), DFS-N / DFS-R, FSRM, iSCSI / MPIO, Storage Replica, déduplication | 9 |
| Rôles Windows | Hyper-V (SET, réplica), clustering de basculement et NLB, IPAM, Windows Server Backup | 7 |
| Rôles Windows | Microsoft Defender (ASR, Defender for Endpoint), pare-feu Windows (GPO, IPsec), BitLocker | 6 |
| Rôles Windows | AD FS, AD LDS, AD RMS, WinRM / JEA, Windows Admin Center, collecteur d'événements, SNMP, OpenSSH | 10 |
| Bases de données | SQL Server (Windows et Linux, sécurité, TDE, sauvegarde, Always On, Agent, performances, SSRS/SSIS/SSAS) | 7 |
| Serveurs d'applications | PHP-FPM (pools, OPcache), Node.js (systemd, PM2), Python (Gunicorn, Uvicorn), Ruby (Puma) | 7 |
| Serveurs d'applications | OpenJDK (mémoire, keytool, diagnostic), Tomcat, WildFly (Elytron, cluster) | 5 |
| Proxy & répartition | Traefik (ACME, middlewares, TCP), Nginx Proxy Manager, Dante (SOCKS) | 5 |
| Multimédia & services | Jellyfin, Plex, Navidrome, Icecast, nginx RTMP, Transmission, qBittorrent, Deluge, Minecraft, Terraria | 11 |
| Messagerie & collaboration | Radicale (CalDAV/CardDAV) et Joplin Server | 2 |
| Outils | Accès (PuTTY, Termius, WinSCP) et réseau (Wireshark, Nmap, Angry IP Scanner, iPerf3, dig/mtr/curl, Postman/Bruno, Greenbone) | 11 |
| Outils | Cybersécurité (Nessus, ZAP, Burp Suite, John/Hashcat, Dependency-Check, KeePassXC/Bitwarden, Ghidra) | 7 |
| Outils | Développement (VS Code, JetBrains, Visual Studio, Eclipse, Notepad++, GitHub, DBeaver, pgAdmin/Workbench, Playwright, uv) | 10 |
| Outils | IA et productivité (ChatGPT, Copilot, Cursor, Ollama/Open WebUI, JupyterLab, n8n, Power Automate, Obsidian, BookStack) | 9 |
| Outils | Support et parc (AnyDesk/TeamViewer, RustDesk, MeshCentral, GLPI, Zammad, OCS, Lansweeper, PDQ, Intune) et disques (GParted, Clonezilla, TestDisk/PhotoRec) | 14 |
| Virtualisation | Proxmox VE (installation, réseau et SDN, ZFS/Ceph, cluster et HA, Proxmox Backup Server), VirtualBox, VMware Workstation | 5 |
| Conteneurs | Conteneurs Windows (isolation, images, réseau HNS, gMSA, nœuds Kubernetes) | 2 |
| Compléments | FileZilla Server, Cerberus FTP, relais SMTP Windows, Neo4j (Cypher, sécurité), MSMQ, services TCP/IP simples | 7 |
| Constructeurs | Cisco : IOS (CLI et outils graphiques), routeurs, commutateurs Catalyst, ASA (ASDM), Meraki ; tables de correspondance des commandes | 14 |
| Constructeurs | Commutation : HPE Comware, Aruba (AOS-S, AOS-CX, Central), Huawei VRP, Alcatel-Lucent OmniSwitch, D-Link, TP-Link (Omada), Ubiquiti (UniFi, EdgeRouter), Netgear, Zyxel, Arista | 17 |
| Constructeurs | Pare-feu : FortiGate, Fortinet SD-WAN/FortiSwitch/FortiAP/FortiManager, Stormshield, Palo Alto, pfSense, OPNsense, Sophos, Check Point, WatchGuard | 16 |
| Constructeurs | Juniper (Junos, SRX), MikroTik (RouterOS, WinBox), Mitel (réseau ToIP, plateformes) | 6 |
| Téléphonie IP | Fondamentaux (SIP, SDP, RTP, codecs, QoS, sécurité, Erlang), Asterisk (installation, PJSIP, dialplan, sécurité/CLI), FreePBX, FreeSWITCH/FusionPBX, Kamailio, OpenSIPS, 3CX | 16 |
| Téléphonie IP | Cisco CME/CUCM, Alcatel OmniPCX/OXO/Rainbow, Mitel MiVoice, Teams Phone (Direct Routing, PowerShell), autres IPBX, SBC, ATA, postes et provisionnement, softphones, diagnostic (sngrep, Wireshark, SIPp, HOMER), Jitsi/BigBlueButton | 15 |
| Aide-mémoires | Un aide-mémoire de commandes par service (Linux, Windows, macOS), téléphonie IP et constructeur, avec exemples commentés, et une page d'index | 218 |
| Supervision | Centreon (installation, objets, SNMP, agents, notifications, collecteurs, traps, API, maintenance, dépannage) | 11 |

Plus un guide d'utilisation (`content/00-bienvenue.md`) et la **feuille de route** (`content/00-feuille-de-route.md`) qui catalogue tous les services prévus (Linux, Windows Server, macOS, outils) et leur état. Le contenu est enrichi par lots successifs.

## Fonctionnalités

- Interface moderne : thèmes sombre/clair/système, couleur d'accent, effets de verre et fond animé (désactivables), animations.
- Navigation **en arborescence** ou **en liste A–Z**, filtre instantané des titres, vues **en cartes** par dossier, favoris, historique (Alt+←/→).
- **Recherche plein texte locale** (Ctrl+K) : tolérance aux fautes, insensible aux accents, extraits surlignés, filtre par catégorie, `#étiquette`, palette de commandes (`>`).
- **Éditeur Markdown** (CodeMirror) avec aperçu en direct, barre d'outils, métadonnées (titre, description, étiquettes, icône), collage d'images, modèles d'articles.
- Rendu riche : coloration syntaxique (dont `named.conf`, `dhcpd.conf`, FreeRADIUS, Cisco IOS), encadrés `> [!NOTE]`, diagrammes **Mermaid**, liens wiki `[[Titre]]`, tableaux, table des matières flottante.
- Gestion du contenu : créer, renommer, dupliquer, déplacer (glisser-déposer), supprimer (corbeille du système), propriétés de dossiers (icône, couleur), export **PDF**.
- Les modifications faites hors de l'application (éditeur de texte, `git pull`) sont détectées et rechargées.

## Développement

Prérequis : **Node.js 20+** (LTS recommandée).

```bash
npm install
npm start            # construit le renderer (esbuild) et lance l'application
npm run watch        # reconstruit le renderer à chaque modification (relancer ensuite l'application)
npm run validate     # vérifie tout le contenu : liens cassés, langages de code, diagrammes Mermaid, icônes
```

> Sous npm 11+, les scripts d'installation peuvent être bloqués : si `node_modules/electron/dist` est vide, lancer `node node_modules/electron/install.js`.

Structure :

```text
main.js            processus principal (fenêtre, fichiers, protocole wikifile://, surveillance du dossier)
preload.js         pont sécurisé (contextBridge) exposé au renderer
src/index.html     page de l'application
src/js/            renderer : app, store, recherche (MiniSearch), Markdown (marked + highlight.js + Mermaid), éditeur (CodeMirror), vues
src/css/           thèmes, mise en page, rendu des articles, éditeur
content/           contenu livré (copié dans le dossier de données au premier lancement)
build/icon.png     icône (npm run icon pour la régénérer)
scripts/           génération d'icône, validation du contenu, captures d'écran de test
```

## Construire les installateurs

```bash
npm run dist:win     # Windows : installateur NSIS + version portable  → release/
npm run dist:mac     # macOS : DMG + ZIP (à lancer sur un Mac)
npm run dist:linux   # Linux : AppImage + .deb (à lancer sous Linux)
```

Chaque système se construit sur son propre OS. Le workflow `.github/workflows/build.yml` produit les trois automatiquement sur GitHub Actions (déclenché par un tag `v*` ou manuellement).

> Les binaires ne sont pas signés : Windows SmartScreen et macOS Gatekeeper afficheront un avertissement. Pour une diffusion large, configurer un certificat de signature de code (variables `CSC_LINK` / `CSC_KEY_PASSWORD`, notarisation Apple).

## Où sont les données ?

| Système | Dossier par défaut |
| --- | --- |
| Windows | `%APPDATA%\NetWiki\wiki` |
| macOS | `~/Library/Application Support/NetWiki/wiki` |
| Linux | `~/.config/NetWiki/wiki` |

*Paramètres → Dossier des données* permet d'ouvrir ce dossier ou d'en choisir un autre (partage réseau, dépôt Git d'équipe). Les préférences (thème, favoris, récents) sont dans `settings.json` à côté.

Au premier lancement, le contenu livré est copié dans ce dossier. Lors des mises à jour de l'application, les nouveaux articles sont ajoutés et les articles d'origine **non modifiés** sont actualisés ; vos modifications et suppressions sont toujours respectées (manifeste `.netwiki-seed.json`). *Paramètres → Restaurer le contenu d'origine* recrée les articles livrés manquants.

## Format d'un article

```markdown
---
title: Configuration NTP sur Cisco IOS
description: Synchroniser l'heure des équipements réseau.
tags: [ntp, cisco, temps]
icon: clock
---

## Section
Texte, `code`, [[Autre article]], > [!TIP] encadrés, ```cisco blocs de code```, ```mermaid diagrammes```.
```

- Un **dossier** = une catégorie ; son fichier `_folder.json` (facultatif) définit `title`, `description`, `icon` (nom d'icône [Lucide](https://lucide.dev/icons)) et `color`.
- L'ordre suit le préfixe numérique des noms de fichiers (`01-…`, `02-…`) ou le champ `order`.
- Les images collées dans l'éditeur sont enregistrées dans un sous-dossier `_assets/`.

## Ajouter un nouveau service au contenu livré

1. Créer `content/<catégorie>/<NN-service>/_folder.json` et les articles `NN-sujet.md`.
2. `npm run validate` pour contrôler liens, blocs de code et diagrammes.
3. Reconstruire l'application : les utilisateurs existants recevront les nouveaux articles à la prochaine mise à jour.

## Raccourcis

| Raccourci | Action |
| --- | --- |
| Ctrl/Cmd + K | Recherche / palette de commandes |
| Ctrl/Cmd + N | Nouvel article |
| Ctrl/Cmd + E | Modifier l'article affiché |
| Ctrl/Cmd + S | Enregistrer |
| Ctrl/Cmd + B | Panneau latéral |
| Ctrl/Cmd + , | Paramètres |
| Alt + ← / → | Historique |
| F5 | Recharger depuis le disque |
| F12 | Outils de développement |
