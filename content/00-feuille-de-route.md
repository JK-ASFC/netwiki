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
| 46 | Logiciel 1.45 : mises à jour séparées — logiciel vérifié uniquement à la demande ; wiki (.netwiki) recherché automatiquement au démarrage si l’utilisateur l’accepte, récapitulatif des nouveautés avant installation, redémarrage avec compte à rebours et contrôle au lancement suivant ; installateurs Windows et macOS aux couleurs de NetWiki (thème sombre, pages « Sécurité et confidentialité » et « Soutenir ») | ✅ |
| 47 | Site de présentation sur GitHub Pages (jk-asfc.github.io/netwiki) : mêmes couleurs que le logiciel, exemples, démo interactive des commandes, « Comment ça marche », téléchargements de la dernière version, soutien et FAQ | ✅ |
| 48 | Catalogue — virtualisation : KVM, QEMU et libvirt (virt-manager, GNOME Boxes, Cockpit), XCP-ng et Xen (Xen Orchestra), UTM, Incus, LXD et LXC, oVirt, OpenStack (Horizon), OpenNebula (Sunstone), Apache CloudStack, CRI-O, Kata Containers, Firecracker, bhyve | ✅ |
| 49 | Catalogue — systèmes et stockage : catégorie « Systèmes d'exploitation » (Debian et Ubuntu Server, famille Red Hat, openSUSE, Arch, Gentoo, Alpine, NixOS, Kali et Parrot, FreeBSD, OpenBSD, NetBSD, Raspberry Pi OS et DietPi), NAS (TrueNAS, OpenMediaVault, Rockstor), Bareos, catégorie « Services auto-hébergés » (YunoHost, CasaOS, Runtipi, Umbrel) | ✅ |
| 50 | Catalogue — identité et SSO : 389 Directory Server, Authentik, Kanidm, LemonLDAP::NG, Shibboleth, privacyIDEA et LinOTP, OAuth2 Proxy et Dex, plateformes IAM (Zitadel, Casdoor, Logto, Ory, Gluu Flex, OpenAM), PacketFence et OpenNAC, SSSD et realmd, gopass | ✅ |
| 51 | Catalogue — réseau : Knot DNS, NSD et MaraDNS, CoreDNS, Technitium, DNS filtrants (AdGuard Home, Pi-hole, Blocky), Open DHCP Server, Kea Stork, NetBox et Nautobot, phpIPAM, GestióIP, NIPAP, Ralph, RackTables, VyOS, OpenWrt et OpenWISP, IPFire, Endian, FRRouting, BIRD, OpenBGPD, NetBird, Nebula, OpenConnect et ocserv, SoftEther, Pritunl, Mullvad | ✅ |
| 52 | Catalogue — proxys et passerelles : Envoy, Tinyproxy, Privoxy, mitmproxy, Apache Traffic Server, OpenResty, Lighttpd, H2O, Cherokee, Kong, Apache APISIX, Tyk, KrakenD, Gravitee, Zuul, Ocelot, YARP, Keepalived, LVS, Pen, Balance, PgBouncer, Odyssey, ProxySQL, MaxScale | ✅ |
| 53 | Catalogue — langages et CI : Bun, Go, Rust, .NET, Mono, GraalVM (et Temurin), PowerShell 7, Perl, Lua, Erlang, Elixir, GCC, Clang, CMake, Ninja, Meson, Task, Just, Jetty, Payara, GlassFish, Open Liberty, Buildbot, GoCD, Woodpecker, Drone, Concourse, Tekton, Argo Workflows, Dagger, Earthly | ✅ |
| 54 | Catalogue — bases de données : Firebird, DuckDB, CockroachDB, YugabyteDB, TiDB, Citus, TimescaleDB, Apache AGE, QuestDB, Cassandra, ScyllaDB, FerretDB, Couchbase, RavenDB, RethinkDB, KeyDB, Dragonfly, etcd, Consul, FoundationDB, RocksDB, LevelDB, LMDB, BadgerDB, SurrealDB, ArangoDB, OrientDB, Memgraph, JanusGraph, Dgraph | ✅ |
| 55 | Catalogue — analytique et en mémoire : TerminusDB, XTDB, ClickHouse, Doris, Pinot, Druid, Trino, Presto, Drill, Hive, HBase, Kudu, Greenplum, MonetDB, Ignite, Hazelcast, Geode, VoltDB, H2, HSQLDB, Derby, Realm | ✅ |
| 56 | Catalogue — stockage et sauvegarde : Ceph, GlusterFS, Lustre, BeeGFS, OpenZFS, Btrfs, XFS, LVM2, mdadm, mergerfs, SnapRAID, OpenAFS, SeaweedFS, Garage, Swift, OpenIO, Rook, Longhorn, OpenEBS, DRBD, LINSTOR, rsync, Rclone, File Browser, Filestash, SFTPGo, Pydio Cells, Cozy, ProjectSend, Pingvin Share, Kopia, Duplicati, Amanda, rdiff-backup, rsnapshot | ✅ |
| 57 | Catalogue — Kubernetes (1) : MicroK8s, k0s, Talos Linux, RKE2, Rancher, OKD, KubeVirt, Helm, Kustomize, Argo CD, Flux, Lens, Headlamp, K9s, Skaffold, Tilt, Garden, Telepresence | ✅ |
| 58 | Catalogue — Kubernetes (2) : Dapr, Knative, OpenFaaS, Fission, KEDA, Crossplane, Cluster API, Cilium, Calico, Flannel, Weave Net, Multus, Gateway API, Contour, NGINX Ingress, cert-manager, ExternalDNS, MetalLB, Velero, Kanister, kube-bench, Kubescape, Trivy, Falco, OPA, Gatekeeper, Kyverno, Buildah, Skopeo, Dive, Hadolint, Dockle, Kompose, Packer, Vagrant | ✅ |
| 59 | Catalogue — observabilité : VictoriaMetrics, Thanos, Mimir, Cortex, LibreNMS, Observium, OpenNMS, NetXMS, Glances, Cockpit, collectd, StatsD, OpenTelemetry Collector, Grafana Alloy, Jaeger, Zipkin, Tempo, SigNoz, HyperDX, Uptrace, Sentry, GlitchTip, Errbit, Loki, Promtail, Fluentd, Vector, alternatives à ELK, Quickwit, VictoriaLogs | ✅ |
| 60 | Catalogue — disponibilité et SOC : Uptime Kuma, Gatus, Cachet, Statping-ng, Cabot, Healthchecks, ntopng, tcpdump, iftop, vnStat, ZMap, Masscan, OSSEC, Security Onion, TheHive, MISP, OpenCTI, Yeti, IntelOwl, Velociraptor, GRR, osquery, FleetDM, Kolide, OpenSCAP | ✅ |
| 61 | Catalogue — sécurité : Nuclei, Nikto, Wapiti, Arachni, sqlmap, testssl.sh, SSLyze, Certbot, acme.sh, step-ca, EJBCA, OpenSSL, LibreSSL, GnuPG, age, SOPS, OpenBao, Infisical, Passbolt, Psono, nftables, iptables, firewalld, UFW, SSHGuard, YARA, chkrootkit, rkhunter, OpenEDR | ✅ |
| 62 | Catalogue — automatisation (1) : AWX, Semaphore, Rundeck, Chef/Cinc, CFEngine, Pulumi, Terragrunt, Terramate, cloud-init, Ignition, Foreman, Katello, Uyuni, Rudder, Rex, Fabric, Invoke, Netmiko, NAPALM, Nornir, StackStorm | ✅ |
| 63 | Catalogue — automatisation (2) et Matrix : Node-RED, Huginn, Activepieces, Windmill, Airflow, Kestra, Prefect, Dagster, DolphinScheduler, Temporal, Conductor, Molecule, Testinfra, InSpec, Serverspec, Test Kitchen, Synapse, Dendrite, Conduit, Continuwuity, Element Server Suite | ✅ |
| 64 | Catalogue — messagerie d'équipe et XMPP : Mattermost, Rocket.Chat, Zulip, Prosody, ejabberd, Openfire, Snikket, MongooseIM, Converse.js, Galène (Jitsi, BigBlueButton et Element déjà présents) | ✅ |
| 65 | Catalogue — support client, helpdesk et ITSM : Chatwoot, FreeScout, osTicket, iTop, OTOBO, Znuny, Request Tracker, UVdesk, Faveo | ✅ |
| 66 | Catalogue — gestion de projet et kanban : OpenProject, Redmine, Taiga, Plane, Leantime, Tuleap, Trac, Phorge (Phabricator), Kanboard, Wekan, Focalboard, Vikunja | ✅ |
| 67 | Catalogue — wikis et espaces de travail : Outline, Wiki.js, XWiki, MediaWiki, DokuWiki, Gollum, MoinMoin, TWiki, AppFlowy, AFFiNE | ✅ |
| 68 | Catalogue — édition collaborative, groupware et agendas : HedgeDoc, Etherpad, CryptPad, SOGo, Kopano, Cal.com (Cal.diy), Baïkal, DAViCal | ✅ |
| 69 | Catalogue — suites de messagerie et webmails : Mailcow, Mailu, docker-mailserver, Modoboa, iRedMail, OpenSMTPD, Amavis, Roundcube, SnappyMail, SquirrelMail, RainLoop | ✅ |
| 70 | Catalogue — CMS (nouvelle catégorie Web : CMS, e-commerce & portails) : WordPress, ClassicPress, Drupal, Joomla, TYPO3, Contao, Ghost, Grav, October CMS | ✅ |
| 71 | Catalogue — CMS headless et Python : Strapi, Directus, Payload, KeystoneJS, Sanity Studio, Wagtail, Mezzanine, Plone, Zope | ✅ |
| 72 | Catalogue — portails, GED et LMS : Liferay, Jahia, eXo Platform, Alfresco, Nuxeo, Moodle, Canvas, Chamilo, ILIAS, Open edX | ✅ |
| 73 | Catalogue — ERP : Odoo, Frappe et ERPNext, Dolibarr, Tryton, iDempiere, metasfresh, Apache OFBiz, ERP5, FrontAccounting | ✅ |
| 74 | Catalogue — facturation, temps et e-commerce PHP : Invoice Ninja, Akaunting, Kimai, Crater, PrestaShop, WooCommerce, OpenCart, Magento Open Source | ✅ |
| 75 | Catalogue — commerce headless et frameworks : Saleor, Medusa, Vendure, Sylius, Shopware, Bagisto, Spree, Solidus, Reaction Commerce | ✅ |
| 76 | Catalogue — caisses et inventaire : OSPOS, uniCenta oPOS, Floreant POS, ERPNext POS, InvenTree, Snipe-IT, OpenBoxes, FusionInventory | ✅ |
| 77 | Catalogue — forges, revue de code et gestion de versions : Gogs, OneDev, SourceHut, Pagure, RhodeCode, Gerrit, Review Board, Subversion, Mercurial, Fossil (Phorge déjà présent) | ✅ |
| 78 | Catalogue — registres, artefacts et analyse de code : Harbor, Distribution, Zot, Nexus, Artifactory, Verdaccio, SonarQube for IDE, Semgrep, CodeQL, PMD, Checkstyle, SpotBugs, ESLint, Prettier | ✅ |
| 79 | Catalogue — analyse Python et chaîne d'approvisionnement : Ruff, Pylint, mypy, Bandit, Syft, Grype, Cosign, in-toto, Tekton Chains | ✅ |
| 80 | Catalogue — dépendances, modernisation et tests : Renovate, Dependabot, Mend Renovate, OpenRewrite, Allure Report, ReportPortal, Sonobuoy, OWASP Juice Shop, WebGoat | ✅ |
| 81 | Catalogue — tests de charge : k6, Apache JMeter, Locust, Gatling, Vegeta, wrk, hey, Siege | ✅ |
| 82 | Catalogue — outils Windows (nouvelle catégorie Gestion de parc) : Windows Terminal, WinGet, Chocolatey, Scoop, NSSM, WinSW, WSL, Cygwin, MSYS2, Git for Windows, OpenSSH pour Windows, PowerToys (PowerShell 7 déjà présent) | ✅ |
| 83 | Catalogue — bureau distant : Apache Guacamole, FreeRDP, xrdp, Remmina, RDPY, TigerVNC, TightVNC, UltraVNC, X2Go | ✅ |
| 84 | Catalogue — supports, déploiement, RMM et automatisation : Rufus, Ventoy, FOG, opsi, WAPT, Open-AudIT, Tactical RMM, RPort, Remotely, AutoHotkey, AutoIt, Actiona (Winbind déjà présent) | ✅ |
| 85 | Catalogue — gestionnaires de paquets : Homebrew, MacPorts, Nix, GNU Guix, Flatpak, Snap, AppImage, équivalences apt/dnf/yum/zypper/pacman/apk/Portage (déjà traités par distribution) | ✅ |
| 86 | Catalogue — init et supervision de processus : systemd, OpenRC, runit, s6, Supervisor, Monit, Circus, PM2, forever | ✅ |
| 87 | Catalogue — shells, multiplexeurs et dotfiles : tmux, GNU Screen, Zellij, Bash, Zsh, Oh My Zsh, fish, Nushell, Starship, chezmoi, GNU Stow | ✅ |
| 88 | Catalogue — instantanés et sauvegarde du poste : Timeshift, Snapper, Back In Time, Déjà Dup | ✅ |
| 89 | Catalogue — partage entre appareils : KDE Connect, GSConnect, LocalSend, Barrier, Input Leap, Synergy Core (Deskflow) | ✅ |
| 90 | Catalogue — environnements de bureau : GNOME, KDE Plasma, XFCE, MATE, Cinnamon, LXQt, COSMIC | ✅ |
| 91 | Catalogue — terminaux graphiques : Xfce Terminal, Alacritty, WezTerm, Kitty, Ghostty | ✅ |
| 92 | Catalogue — éditeurs de texte : Vim, Neovim, GNU Emacs, Kate, Geany | ✅ |
| 93 | Catalogue — IDE : VSCodium, Apache NetBeans, Qt Creator, Code::Blocks | ✅ |
| 94 | Catalogue — serveurs de musique : Ampache, Lyrion Music Server, Mopidy, Airsonic-Advanced, Funkwhale | ✅ |
| 95 | Catalogue — radio web et plates-formes vidéo : AzuraCast, LibreTime, Owncast, PeerTube, MediaCMS | ✅ |
| 96 | Catalogue — serveurs de streaming vidéo : MediaMTX, SRS, OvenMediaEngine, Ant Media Server Community, Red5, Restreamer | ✅ |
| 97 | Catalogue — WebRTC : Janus, LiveKit, mediasoup, Pion, Kurento | ✅ |
| 98 | Catalogue — traitement vidéo : FFmpeg, GStreamer, HandBrake | ✅ |
| 99 | Catalogue — capture et lecture : OBS Studio, VLC, mpv, Kodi | ✅ |
| 100 | Catalogue — empaquetage et transcodage automatisé : Shaka Packager, Bento4, Tdarr, Unmanic, FileFlows | ✅ |
| 101 | Catalogue — gestion de médiathèque : Sonarr, Radarr, Lidarr, Readarr, Prowlarr, Jackett, Bazarr | ✅ |
| 102 | Catalogue — outils de téléchargement : aria2, yt-dlp | ✅ |
| 103 | Catalogue — administration et plates-formes d'envoi : PostfixAdmin, Haraka, Postal | ✅ |
| 104 | Catalogue — serveurs SMTP de test : MailHog, smtp4dev | ✅ |
| 105 | Catalogue — authentification et filtrage des e-mails : OpenDKIM, OpenDMARC, OpenARC, policyd-spf, Postgrey | ✅ |
| 106 | Catalogue — newsletters et listes de diffusion : Listmonk, phpList, Mautic, Sympa, Mailman 2 (migration) | ✅ |
| 107 | Catalogue — clients de messagerie et synchronisation : Thunderbird, Evolution, KMail, Claws Mail, SOGo Connector, DAVx5 | ✅ |
| 108 | Catalogue — courrier en terminal et récupération : Mutt, NeoMutt, aerc, fetchmail, getmail6, OfflineIMAP | ✅ |
| 109 | Catalogue — courtiers d'entreprise : ActiveMQ Classic, ActiveMQ Artemis, Apache RocketMQ, Apache Pulsar | ✅ |
| 110 | Catalogue — messagerie légère : NATS et JetStream, NSQ, ZeroMQ, Redpanda | ✅ |
| 111 | Catalogue — autres courtiers MQTT : VerneMQ, NanoMQ, HiveMQ CE | ✅ |
| 112 | Catalogue — files de tâches : Beanstalkd, Gearman, Celery, Dramatiq, RQ, BullMQ, pg-boss, Graphile Worker | ✅ |
| 113 | Catalogue — traitement de flux et par lots : Apache Spark, Flink, Beam, Samza, Storm | ✅ |
| 114 | Catalogue — intégration de données : Apache NiFi, SeaTunnel, Airbyte, Meltano, Singer | ✅ |
| 115 | Catalogue — capture de changements : Debezium, Kafka Connect, Benthos / Redpanda Connect, Flink CDC | ✅ |
| 116 | Catalogue — lac de données transactionnel : Apache Iceberg, Delta Lake, Apache Hudi, Project Nessie, lakeFS | ✅ |
| 117 | Catalogue — catalogues de données : OpenMetadata, DataHub, Amundsen, Apache Atlas | ✅ |
| 118 | Catalogue — transformation : dbt Core, SQLMesh, Polars, Apache Arrow | ✅ |
| 119 | Catalogue — science des données : JupyterHub, MLflow, DVC, Pachyderm | ✅ |
| 120 | Catalogue — inférence locale : llama.cpp, KoboldCpp, LocalAI | ✅ |
| 121 | Catalogue — serveurs d'inférence : vLLM, Text Generation Inference, Hugging Face Transformers | ✅ |
| 122 | Catalogue — interfaces de chat : LibreChat, AnythingLLM, text-generation-webui, SillyTavern | ✅ |
| 123 | Catalogue — applications locales : GPT4All, Jan, PrivateGPT, Khoj | ✅ |
| 124 | Catalogue — constructeurs d'applications IA : Dify, Flowise, Langflow | ✅ |
| 125 | Catalogue — RAG : LangChain, LlamaIndex, Haystack, RAGFlow, Quivr | ✅ |
| 126 | Catalogue — génération d'images : ComfyUI, AUTOMATIC1111, InvokeAI, Fooocus | ✅ |
| 127 | Catalogue — frameworks : PyTorch, TensorFlow, JAX, OpenCV | ✅ |
| 128 | Catalogue — ML classique et inférence optimisée : scikit-learn, XGBoost, LightGBM, CatBoost, ONNX Runtime, OpenVINO | ✅ |
| 129 | Catalogue — service de modèles et MLOps : BentoML, KServe, Seldon Core, Ray, Kubeflow | ✅ |
| 130 | Catalogue — expériences et annotation : ClearML, Aim, Label Studio, CVAT, FiftyOne | ✅ |
| 131 | Catalogue — audio et voix : Whisper, whisper.cpp, faster-whisper, Piper, Coqui TTS, Kokoro, RVC, Mimic 3 | ✅ |
| 132 | Catalogue — GED : Paperless-ngx, Mayan EDMS, Teedy, Docspell | ✅ |
| 133 | Catalogue — GED d'entreprise : OpenKM, LogicalDOC, SeedDMS | ✅ |
| 134 | Catalogue — signature et PDF : Documenso, OpenSign, LibreSign, Stirling-PDF, Gotenberg | ✅ |
| 135 | Catalogue — bureautique : ONLYOFFICE Docs, Collabora Online, LibreOffice, Apache OpenOffice | ✅ |
| 136 | Catalogue — notes et connaissances : TriliumNext, Memos, SilverBullet, Logseq, SiYuan | ✅ |
| 137 | Catalogue — documentation technique : MkDocs, Material for MkDocs, Sphinx, Read the Docs, Documize | ✅ |
| 138 | Catalogue — générateurs de documentation : Docusaurus, VitePress, Antora, Bookdown | ✅ |
| 139 | Catalogue — sites statiques : Hugo, Jekyll, Zola, Astro, Quartz | ✅ |
| 140 | Catalogue — recherche instantanée : Meilisearch, Typesense, Sonic | ✅ |
| 141 | Catalogue — moteurs plein texte : Apache Solr, Manticore Search, ZincSearch, Tantivy | ✅ |
| 142 | Catalogue — métamoteurs : SearXNG, Whoogle, 4get, LibreX | ✅ |
| 143 | Catalogue — serveurs SSH légers : Dropbear, TinySSH | ✅ |
| 144 | Catalogue — gestion du réseau Linux : NetworkManager, systemd-networkd, ConnMan | ✅ |
| 145 | Catalogue — Wi-Fi Linux : hostapd, wpa_supplicant, iw, iwd | ✅ |
| 146 | Catalogue — commutateur virtuel : Open vSwitch | ✅ |
| 147 | Catalogue — laboratoires réseau : GNS3, Containerlab, Kathará | ✅ |
| 148 | Catalogue — émulateurs réseau : CORE, ns-3, Mininet | ✅ |
| 149 | Catalogue — contrôleurs SDN : OpenDaylight, ONOS, Ryu | ✅ |
| 150 | Catalogue — tests de débit : iperf2, OpenSpeedTest, LibreSpeed, Speedtest Tracker | ✅ |
| 151 | Catalogue — sondes réseau : Smokeping, Blackbox Exporter, fping exporter | ✅ |
| 152 | Catalogue — configuration réseau : Oxidized, RANCID, Netdisco, Batfish | ✅ |
| 153 | Catalogue — inventaire et CMDB : Agent FusionInventory, i-doit Open, CMDBuild | ✅ |
| 154 | Catalogue — gestion de stocks : Grocy, Homebox, PartKeepr, ERPNext Stock, OpenWMS, OpenLMIS | ✅ |
| 155 | Catalogue — impression 3D et IPP : OctoPrint, Klipper, Moonraker, Mainsail, Fluidd, IPP Everywhere | ✅ |
| 156 | Catalogue — domotique : Home Assistant, openHAB, Domoticz | ✅ |
| 157 | Catalogue — plates-formes IoT : ThingsBoard Community, Mainflux/Magistrala, Kaa, Eclipse Kura | ✅ |
| 158 | Catalogue — LoRaWAN et passerelles : ChirpStack, The Things Stack, Mosquitto, ThingsBoard Gateway | ✅ |
| 159 | Catalogue — Zigbee, Z-Wave et firmwares : Zigbee2MQTT, Z-Wave JS UI, ESPHome, Tasmota, OpenMQTTGateway | ✅ |
| 160 | Catalogue — vidéosurveillance (NVR) : Frigate, ZoneMinder, Shinobi | ✅ |
| 161 | Catalogue — relais et détection vidéo : Motion, motionEye, Kerberos.io, Scrypted, go2rtc | ✅ |
| 162 | Catalogue — clients HTTP et API : Insomnia, Hoppscotch, HTTPie, xh, wget | ✅ |
| 163 | Catalogue — documentation d'API : Swagger UI, Swagger Editor, Redoc, Scalar, Stoplight Elements | ✅ |
| 164 | Catalogue — simulation d'API : Prism, WireMock, MockServer, Hoverfly, Mountebank | ✅ |
| 165 | Catalogue — tests d'API et de contrat : Pact, Schemathesis, Dredd, Hurl, Newman | ✅ |
| 166 | Catalogue — micro-tests de charge : Apache Bench, wrk2, Autocannon, oha | ✅ |
| 167 | Catalogue — tests navigateur : Selenium, Cypress, WebdriverIO, Puppeteer, Robot Framework | ✅ |
| 168 | Catalogue — tests unitaires : pytest, JUnit, TestNG, NUnit, xUnit.net, MSTest | ✅ |
| 169 | Catalogue — BDD et tests Go/Rust : Cucumber, Behave, Ginkgo, go test, cargo test | ✅ |
| 170 | Catalogue — tests JavaScript : Vitest, Jest, Mocha, AVA | ✅ |
| 171 | Catalogue — tests PHP et Ruby : PHPUnit, Pest, RSpec, Minitest | ✅ |
| 172 | Catalogue — détection de secrets : Gitleaks, detect-secrets, TruffleHog OSS | ✅ |
| 173 | Catalogue — analyse IaC : Checkov, KICS, Terrascan, TFLint | ✅ |
| 174 | Catalogue — linters et format : Actionlint, ShellCheck, shfmt, EditorConfig | ✅ |
| 175 | Catalogue — PaaS auto-hébergés : Coolify, Dokku, CapRover | ✅ |
| 176 | Catalogue — suites d'auto-hébergement : HomelabOS, Ansible-NAS, Sandstorm, FreedomBox | ✅ |
| 177 | Catalogue — panneaux d'hébergement : HestiaCP, CyberPanel, ISPConfig, Virtualmin | ✅ |
| 178 | Catalogue — administration serveur : Webmin, Ajenti, Froxlor | ✅ |
| 179 | Catalogue — gestion de conteneurs : Dockge, Yacht, Komodo | ✅ |
| 180 | Catalogue — tableaux de bord : Homepage, Homarr, Dashy, Heimdall | ✅ |
| 181 | Catalogue — tableaux de bord (suite) : Flame, Organizr, Glance, Homer, Fenrus, DashMachine, SUI | ✅ |
| 182 | Catalogue — actions et automatisation : OliveTin, Ansible Semaphore | ✅ |
| 183 | Catalogue — bases no-code : NocoDB, Baserow, Grist | ✅ |
| 184 | Catalogue — low-code : Appsmith, Budibase, ToolJet | ✅ |
| 185 | Catalogue — BaaS auto-hébergés : Supabase, Appwrite, PocketBase, Parse Server | ✅ |
| 186 | Catalogue — API sur base : Hasura, PostgREST, PostGraphile | ✅ |
| 187 | Catalogue — BI : Metabase, Apache Superset, Redash, Lightdash, Evidence | ✅ |

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
| [[04-tacacs/01-presentation-historique\|TACACS, XTACACS et TACACS+]] (RFC 1492, 8907, 9887 ; tac_plus-ng, tac_plus, équipements) | tac_plus-ng, tac_plus, libpam-tacplus | TACACS.net | ➖ | ✅ |

## Serveurs web & applications

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[01-iis/01-presentation\|IIS]] (+ FTP, outils de gestion, WAS) | ➖ | Web-Server, Web-Ftp-Server, Web-Mgmt-Tools, WAS | ➖ | ✅ |
| [[02-apache/01-presentation\|Apache HTTP Server]] (+ documentation de référence : 17 commandes, 85 guides, 132 modules, 730 directives) | apache2 | Apache Lounge | httpd | ✅ |
| [[03-nginx/01-presentation\|Nginx]] (+ documentation de référence traduite : 44 guides, 103 modules, 1 009 directives, 210 variables) | nginx | nginx | nginx | ✅ |
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
| [[14-dropbear-tinyssh/01-dropbear-tinyssh\|Dropbear, TinySSH]] | dropbear-bin, dropbear-initramfs, tinysshd | ➖ | ➖ | ✅ |

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
| [[07-mailpit/01-presentation-installation\|Mailpit (tests)]], [[07-mailpit/03-mailhog-smtp4dev\|MailHog, smtp4dev]] | mailpit, Docker | mailpit, smtp4dev | mailpit, Docker | ✅ |
| [[10-smtp-windows/01-relais-smtp\|Serveur SMTP Windows (relais IIS 6)]] | ➖ | SMTP-Server | ➖ | ✅ |
| [[08-radicale/01-installation-configuration\|Radicale (CalDAV / CardDAV)]], [[09-joplin-server/01-installation-exploitation\|Joplin Server]] | radicale | radicale (pip) | radicale, joplin-server | ✅ |
| [[11-matrix/01-synapse-ess\|Matrix (Synapse, ESS, Element)]] | matrix-synapse-py3, Docker | ➖ (Docker), Element | ➖ (Docker), Element | ✅ |
| [[12-mattermost/01-presentation-installation\|Mattermost]] | mattermost (deb), tar.gz, Docker | ➖ (Docker), client winget | ➖ (Docker), client brew | ✅ |
| [[13-rocketchat/01-presentation-installation\|Rocket.Chat]] | Docker Compose | Docker Desktop, client winget | Docker Desktop, client brew | ✅ |
| [[14-zulip/01-presentation-installation\|Zulip]] | installateur (Ubuntu, Debian), Docker | ➖ (Docker), client winget | ➖ (Docker), client brew | ✅ |
| [[15-xmpp/01-prosody\|XMPP : Prosody]], [[15-xmpp/02-ejabberd\|ejabberd]], [[15-xmpp/03-openfire\|Openfire]], [[15-xmpp/04-snikket-mongooseim\|Snikket, MongooseIM]] | prosody, ejabberd, openfire, Docker | Openfire (exe), Docker | prosody, ejabberd (brew), Openfire (dmg) | ✅ |
| [[16-gestion-projet/01-openproject\|OpenProject]], [[16-gestion-projet/02-redmine\|Redmine]], [[16-gestion-projet/03-taiga-plane-leantime\|Taiga, Plane, Leantime]], [[16-gestion-projet/04-tuleap-trac-phorge\|Tuleap, Trac, Phorge]], [[16-gestion-projet/05-kanban-taches\|Kanboard, Wekan, Vikunja]] | openproject, redmine, Docker | Docker, Redmine (Ruby) | Docker | ✅ |
| [[17-wikis/01-outline-wikijs\|Outline, Wiki.js]], [[17-wikis/02-xwiki\|XWiki]], [[17-wikis/03-mediawiki-dokuwiki\|MediaWiki, DokuWiki]], [[17-wikis/04-gollum-moinmoin-twiki\|Gollum, MoinMoin, TWiki]], [[17-wikis/05-appflowy-affine\|AppFlowy, AFFiNE]] | Docker, PHP, gem, pip | Docker, PHP, clients AppFlowy | Docker, PHP, brew | ✅ |
| [[18-edition-collaborative/01-hedgedoc-etherpad-cryptpad\|HedgeDoc, Etherpad, CryptPad]], [[19-groupware-agendas/01-sogo-kopano\|SOGo, Kopano]], [[19-groupware-agendas/02-calcom-baikal-davical\|Cal.diy, Baïkal, DAViCal]] | Docker, sogo, davical | Etherpad, Docker | Etherpad, Docker | ✅ |
| [[20-suites-messagerie/01-mailcow-mailu-docker-mailserver\|Mailcow, Mailu, docker-mailserver]], [[20-suites-messagerie/02-modoboa-iredmail\|Modoboa, iRedMail]], [[22-opensmtpd/01-presentation-configuration\|OpenSMTPD]], [[05-spamassassin/03-amavis\|Amavis]] | Docker, installateurs, opensmtpd, amavisd-new | ➖ (VM Linux) | opensmtpd (brew) | ✅ |
| [[21-webmail/01-roundcube\|Roundcube]], [[21-webmail/02-snappymail-anciens\|SnappyMail, SquirrelMail, RainLoop]] | roundcube, archive, Docker | IIS + PHP, Docker | PHP, Docker | ✅ |
| [[01-postfix/10-postfixadmin\|PostfixAdmin]], [[23-plateformes-envoi/01-haraka\|Haraka]], [[23-plateformes-envoi/02-postal\|Postal]] | postfixadmin, npm, Docker | ➖ (Docker) | npm (Haraka), Docker | ✅ |
| [[24-authentification-mail/01-opendkim-opendmarc-openarc\|OpenDKIM, OpenDMARC, OpenARC]], [[24-authentification-mail/02-policyd-spf-postgrey\|policyd-spf, Postgrey]] | opendkim, opendmarc, postfix-policyd-spf-python, postgrey | ➖ | ➖ | ✅ |
| [[25-listes-newsletters/01-listmonk-phplist\|Listmonk, phpList]], [[25-listes-newsletters/02-mautic\|Mautic]], [[25-listes-newsletters/03-sympa\|Sympa]], [[06-mailman/04-mailman2-migration\|Mailman 2 et migration]] | binaire, Docker, PHP, sympa | ➖ (Docker) | ➖ (Docker) | ✅ |
| [[26-clients-messagerie/01-thunderbird\|Thunderbird]], [[26-clients-messagerie/02-evolution-kmail-claws\|Evolution, KMail, Claws Mail]], [[26-clients-messagerie/03-davx5-sogo-connector\|DAVx5, SOGo Connector]] | thunderbird, evolution, kmail, claws-mail | Thunderbird, Claws Mail | Thunderbird | ✅ |
| [[27-courrier-terminal/01-mutt-neomutt-aerc\|Mutt, NeoMutt, aerc]], [[27-courrier-terminal/02-fetchmail-getmail-offlineimap\|fetchmail, getmail6, OfflineIMAP]] | mutt, neomutt, aerc, fetchmail, getmail6, offlineimap3 | ➖ (WSL) | neomutt, aerc (brew) | ✅ |

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
| [[08-activemq-rocketmq-pulsar/01-activemq-classic-artemis\|ActiveMQ Classic, Artemis]], [[08-activemq-rocketmq-pulsar/02-rocketmq-pulsar\|RocketMQ, Pulsar]] | archives Apache, Docker, Helm | archives (Java) | archives, Homebrew | ✅ |
| [[09-nats-nsq-zeromq-redpanda/01-nats\|NATS, JetStream]], [[09-nats-nsq-zeromq-redpanda/02-nsq-zeromq\|NSQ, ZeroMQ]], [[09-nats-nsq-zeromq-redpanda/03-redpanda\|Redpanda]] | binaires, paquets, Docker | binaires, bibliothèques | Homebrew, Docker | ✅ |
| [[10-courtiers-mqtt/01-vernemq\|VerneMQ]], [[10-courtiers-mqtt/02-nanomq-hivemq\|NanoMQ, HiveMQ CE]] | paquets, Docker | Docker, archive Java | Docker | ✅ |
| [[11-files-de-taches/01-beanstalkd-gearman\|Beanstalkd, Gearman]], [[11-files-de-taches/02-celery-dramatiq-rq\|Celery, Dramatiq, RQ]], [[11-files-de-taches/03-bullmq-pg-boss-graphile\|BullMQ, pg-boss, Graphile Worker]] | paquets, pip, npm | pip, npm | Homebrew, pip, npm | ✅ |
| [[12-moteurs-recherche/01-meilisearch-typesense-sonic\|Meilisearch, Typesense, Sonic]], [[12-moteurs-recherche/02-solr-manticore-zinc-tantivy\|Solr, Manticore, ZincSearch, Tantivy]] | binaires, Docker | binaires, Docker | Homebrew, Docker | ✅ |
| [[13-metamoteurs/01-searxng-whoogle-4get-librex\|SearXNG, Whoogle, 4get, LibreX]] | Docker, PHP | Docker | Docker | ✅ |

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
| [[13-forges-revue-vcs/01-forges\|Gogs, OneDev, SourceHut, Pagure, RhodeCode]], [[13-forges-revue-vcs/02-gerrit-reviewboard\|Gerrit, Review Board]], [[13-forges-revue-vcs/03-subversion-mercurial-fossil\|Subversion, Mercurial, Fossil]] | Docker, binaires, paquets | TortoiseSVN, TortoiseHg, Fossil (winget) | Homebrew | ✅ |
| [[14-registres-artefacts/01-harbor-distribution-zot\|Harbor, Distribution, Zot]], [[14-registres-artefacts/02-nexus-artifactory-verdaccio\|Nexus, Artifactory, Verdaccio]] | Docker, installateurs | Docker, archives Java | Docker, Node.js | ✅ |
| [[15-analyse-code/01-outils-analyse\|Semgrep, CodeQL, PMD, Checkstyle, SpotBugs, ESLint, Prettier]] | pip, npm, Java | pip, npm, Java | brew, npm | ✅ |
| [[15-analyse-code/02-python\|Ruff, Pylint, mypy, Bandit]] | pip, uv | pip, uv | pip, brew | ✅ |
| [[16-chaine-approvisionnement/01-sbom-signature-attestations\|Syft, Grype, Cosign, in-toto, Tekton Chains]] | binaires, pip, Kubernetes | binaires, pip | brew | ✅ |
| [[17-dependances-modernisation/01-renovate-dependabot\|Renovate, Dependabot, Mend Renovate]], [[17-dependances-modernisation/02-openrewrite\|OpenRewrite]] | Docker, npm, Maven, Gradle | npm, Maven, Gradle | npm, brew | ✅ |
| [[18-tests/01-rapports-tests-sonobuoy\|Allure, ReportPortal, Sonobuoy]], [[18-tests/03-applications-vulnerables\|Juice Shop, WebGoat]] | npm, Docker, binaire | npm, Docker | npm, brew, Docker | ✅ |
| [[18-tests/02-tests-charge\|k6, JMeter, Locust, Gatling, Vegeta, wrk, hey, Siege]] | apt, dnf, pip, Docker | winget, pip, archives | brew | ✅ |

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
| [[08-serveurs-musique/02-ampache\|Ampache]], [[08-serveurs-musique/03-lyrion-music-server\|Lyrion Music Server]], [[08-serveurs-musique/04-mopidy\|Mopidy]], [[08-serveurs-musique/05-airsonic-advanced\|Airsonic-Advanced]], [[08-serveurs-musique/06-funkwhale\|Funkwhale]] | Docker, paquets, pip | Ampache, LMS, Airsonic (Java) | Docker, Homebrew | ✅ |
| [[09-radio-video/01-azuracast-libretime\|AzuraCast, LibreTime]], [[09-radio-video/02-owncast\|Owncast]], [[09-radio-video/03-peertube\|PeerTube]], [[09-radio-video/04-mediacms\|MediaCMS]] | Docker, Docker Compose | Docker (WSL), Owncast | Docker, Owncast | ✅ |
| [[10-serveurs-streaming/02-mediamtx\|MediaMTX]], [[10-serveurs-streaming/03-srs\|SRS]], [[10-serveurs-streaming/04-ovenmediaengine\|OvenMediaEngine]], [[10-serveurs-streaming/05-ant-media-red5\|Ant Media Server, Red5]], [[10-serveurs-streaming/06-restreamer\|Restreamer]] | binaire, Docker, script | MediaMTX, SRS (binaires), Docker | MediaMTX, Docker | ✅ |
| [[11-webrtc/01-architecture\|architecture WebRTC]], [[11-webrtc/02-janus\|Janus]], [[11-webrtc/03-livekit\|LiveKit]], [[11-webrtc/04-mediasoup-pion-kurento\|mediasoup, Pion, Kurento]] | janus, binaires, Docker, npm, Go | LiveKit, mediasoup, Pion | LiveKit, mediasoup, Pion | ✅ |
| [[12-traitement-video/01-ffmpeg\|FFmpeg]], [[12-traitement-video/02-gstreamer\|GStreamer]], [[12-traitement-video/03-handbrake\|HandBrake]] | ffmpeg, gstreamer1.0, Flatpak | winget | Homebrew | ✅ |
| [[13-capture-lecture/01-obs-studio\|OBS Studio]], [[13-capture-lecture/02-vlc-mpv\|VLC, mpv]], [[13-capture-lecture/03-kodi\|Kodi]] | Flatpak, apt, LibreELEC | winget | Homebrew | ✅ |
| [[14-packaging-transcodage-auto/01-shaka-packager-bento4\|Shaka Packager, Bento4]], [[14-packaging-transcodage-auto/02-tdarr-unmanic-fileflows\|Tdarr, Unmanic, FileFlows]] | binaires, Docker | binaires, Docker | Homebrew, Docker | ✅ |
| [[15-gestion-medias-arr/01-pile-arr\|pile *arr]], [[15-gestion-medias-arr/02-sonarr-radarr-lidarr-readarr\|Sonarr, Radarr, Lidarr, Readarr]], [[15-gestion-medias-arr/03-prowlarr-jackett-bazarr\|Prowlarr, Jackett, Bazarr]] | Docker (LinuxServer), paquets | installateurs | Homebrew, Docker | ✅ |
| [[16-telechargement/01-aria2\|aria2]], [[16-telechargement/02-yt-dlp\|yt-dlp]] | aria2, pip, pipx | winget | Homebrew | ✅ |

## Outils de l'administrateur

| Domaine | Logiciels | État |
| --- | --- | --- |
| Administration et accès | [[01-openssh/01-presentation\|OpenSSH]], [[01-acces-administration/01-putty\|PuTTY]], [[01-acces-administration/02-termius\|Termius]], [[01-acces-administration/03-winscp\|WinSCP]], [[10-windows-admin-center/01-presentation-installation\|Windows Admin Center]], [[08-portainer/01-presentation-installation\|Portainer]] | ✅ |
| Réseau et diagnostic | [[02-reseau-diagnostic/01-wireshark-capture\|Wireshark]], [[02-reseau-diagnostic/03-nmap\|Nmap]], [[02-reseau-diagnostic/04-angry-ip-scanner\|Angry IP Scanner]], [[02-reseau-diagnostic/05-iperf3\|iPerf3]], [[02-reseau-diagnostic/06-dig-mtr-curl\|dig, mtr, curl]], [[02-reseau-diagnostic/07-postman-bruno\|Postman, Bruno]], [[02-reseau-diagnostic/08-greenbone-openvas\|Greenbone/OpenVAS]] | ✅ |
| Cybersécurité | [[09-defender/01-antivirus-configuration\|Microsoft Defender]], [[03-cybersecurite/01-nessus\|Nessus]], [[03-cybersecurite/02-owasp-zap\|OWASP ZAP]], [[03-cybersecurite/03-burp-suite\|Burp Suite]], [[03-cybersecurite/04-john-hashcat\|John the Ripper, Hashcat]], [[08-lynis/01-installation-audit\|Lynis]], [[03-cybersecurite/05-owasp-dependency-check\|OWASP Dependency-Check]], [[03-cybersecurite/06-keepassxc-bitwarden\|KeePassXC, Bitwarden]], [[03-cybersecurite/07-ghidra\|Ghidra]] | ✅ |
| Développement | [[04-developpement/01-vscode\|VS Code]], [[04-developpement/02-jetbrains-intellij-pycharm\|IntelliJ IDEA, PyCharm]], [[04-developpement/03-visual-studio\|Visual Studio]], [[04-developpement/04-eclipse\|Eclipse]], [[04-developpement/05-notepad-plus-plus\|Notepad++]], [[01-git/01-presentation-installation\|Git]], [[04-developpement/06-github-github-desktop\|GitHub, GitHub Desktop]], [[04-developpement/07-dbeaver\|DBeaver]], [[04-developpement/08-pgadmin-mysql-workbench\|pgAdmin, MySQL Workbench]], [[04-developpement/09-playwright\|Playwright]], [[04-developpement/10-uv\|uv]], [[04-developpement/11-vscodium\|VSCodium]], [[04-developpement/12-netbeans-qt-creator-code-blocks\|NetBeans, Qt Creator, Code::Blocks]], [[06-nodejs/01-presentation-installation\|Node.js]] | ✅ |
| IA et productivité | [[05-ia-productivite/01-chatgpt\|ChatGPT]], [[05-ia-productivite/02-github-copilot\|GitHub Copilot]], [[05-ia-productivite/03-cursor\|Cursor]], [[05-ia-productivite/04-ollama-open-webui\|Ollama, Open WebUI]], [[05-ia-productivite/05-jupyterlab\|JupyterLab]], [[05-ia-productivite/06-n8n\|n8n]], [[05-ia-productivite/07-power-automate\|Power Automate]], [[05-ia-productivite/08-obsidian\|Obsidian]], [[05-ia-productivite/09-bookstack\|BookStack]] | ✅ |
| Support et prise en main | [[06-support-parc/01-anydesk-teamviewer\|AnyDesk, TeamViewer]], [[06-support-parc/02-rustdesk\|RustDesk]], [[06-support-parc/03-meshcentral\|MeshCentral]], [[06-support-parc/04-glpi-installation\|GLPI]], [[06-support-parc/06-zammad\|Zammad]], [[06-support-parc/12-chatwoot\|Chatwoot]], [[06-support-parc/13-freescout\|FreeScout]], [[06-support-parc/14-osticket\|osTicket]], [[06-support-parc/15-itop\|iTop]], [[06-support-parc/16-otobo-znuny\|OTOBO et Znuny]], [[06-support-parc/17-request-tracker\|Request Tracker]], [[06-support-parc/18-uvdesk-faveo\|UVdesk et Faveo]], [[06-support-parc/07-ocs-inventory\|OCS Inventory NG]], [[06-support-parc/08-lansweeper\|Lansweeper]], [[06-support-parc/09-pdq-deploy\|PDQ Deploy]], [[06-support-parc/10-intune-inscription\|Intune]] | ✅ |
| Disques et récupération | [[07-disques-recuperation/01-gparted\|GParted]], [[07-disques-recuperation/02-clonezilla\|Clonezilla]], [[07-disques-recuperation/03-testdisk-photorec\|TestDisk, PhotoRec]] | ✅ |
| Gestionnaires de paquets | [[08-gestionnaires-paquets/01-homebrew-macports\|Homebrew, MacPorts]], [[08-gestionnaires-paquets/02-nix-guix\|Nix, Guix]], [[08-gestionnaires-paquets/03-flatpak-snap-appimage\|Flatpak, Snap, AppImage]], [[08-gestionnaires-paquets/04-equivalences-distributions\|équivalences apt, dnf, zypper, pacman, apk, Portage]] | ✅ |
| Init et processus | [[09-init-processus/01-systemd\|systemd]], [[09-init-processus/02-openrc-runit-s6\|OpenRC, runit, s6]], [[09-init-processus/03-supervisor-monit-circus\|Supervisor, Monit, Circus]], [[09-init-processus/04-pm2-forever\|PM2, forever]] | ✅ |
| Shells et terminal | [[10-shells-terminal/01-tmux-screen-zellij\|tmux, Screen, Zellij]], [[10-shells-terminal/02-shells-bash-zsh-fish-nushell\|Bash, Zsh, fish, Nushell, Starship, Oh My Zsh]], [[10-shells-terminal/03-dotfiles-chezmoi-stow\|chezmoi, GNU Stow]] | ✅ |
| Instantanés et sauvegarde du poste | [[11-sauvegarde-poste/01-timeshift-snapper\|Timeshift, Snapper]], [[11-sauvegarde-poste/02-back-in-time-deja-dup\|Back In Time, Déjà Dup]] | ✅ |
| Partage entre appareils | [[12-partage-appareils/01-kde-connect-localsend\|KDE Connect, LocalSend]], [[12-partage-appareils/02-barrier-input-leap-synergy\|Barrier, Input Leap, Synergy]] | ✅ |
| Environnements de bureau | [[13-environnements-bureau/01-panorama-choix\|choisir un bureau, Wayland ou X11]], [[13-environnements-bureau/02-gnome-kde-plasma\|GNOME, KDE Plasma]], [[13-environnements-bureau/03-xfce-mate-cinnamon-lxqt-cosmic\|XFCE, MATE, Cinnamon, LXQt, COSMIC]] | ✅ |
| Terminaux graphiques | [[14-terminaux-graphiques/01-alacritty-kitty-wezterm-ghostty\|Alacritty, Kitty, WezTerm, Ghostty]], [[14-terminaux-graphiques/02-xfce-terminal\|Xfce Terminal]] | ✅ |
| Éditeurs de texte | [[15-editeurs-texte/01-vim-neovim\|Vim, Neovim]], [[15-editeurs-texte/02-emacs\|GNU Emacs]], [[15-editeurs-texte/03-kate-geany\|Kate, Geany]] | ✅ |
| Gestion du réseau (Linux) | [[16-gestion-reseau-linux/01-networkmanager-networkd-connman\|NetworkManager, systemd-networkd, ConnMan]] | ✅ |
| Wi-Fi (Linux) | [[17-wifi-linux/01-hostapd-wpa-supplicant-iw-iwd\|hostapd, wpa_supplicant, iw, iwd]] | ✅ |
| Commutateur virtuel | [[18-open-vswitch/01-open-vswitch\|Open vSwitch]] | ✅ |
| Laboratoires réseau | [[19-labos-reseau/01-gns3-containerlab\|GNS3, Containerlab, Kathará]] | ✅ |
| Contrôleurs SDN | [[20-controleurs-sdn/01-opendaylight-onos-ryu\|OpenDaylight, ONOS, Ryu]] | ✅ |
| Tests de débit | [[21-tests-debit/01-iperf2-openspeedtest-librespeed\|iperf2, OpenSpeedTest, LibreSpeed, Speedtest Tracker]] | ✅ |
| Sondes réseau (latence) | [[22-sondes-reseau/01-smokeping-blackbox\|Smokeping, Blackbox Exporter, fping exporter]] | ✅ |
| Configurations réseau | [[23-config-reseau/01-oxidized-rancid-netdisco-batfish\|Oxidized, RANCID, Netdisco, Batfish]] | ✅ |

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

## Web : CMS, e-commerce & portails

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[01-wordpress/01-presentation-installation\|WordPress, ClassicPress]] | PHP-FPM, WP-CLI, Docker | IIS + PHP, Docker | Homebrew, Docker | ✅ |
| [[02-drupal-joomla/01-drupal\|Drupal]], [[02-drupal-joomla/02-joomla\|Joomla]] | Composer, Drush, archive, Docker | IIS + PHP, Docker | Homebrew, DDEV | ✅ |
| [[03-typo3-contao/01-typo3\|TYPO3]], [[03-typo3-contao/02-contao\|Contao]] | Composer, DDEV | PHP + Composer | PHP + Composer | ✅ |
| [[04-ghost-grav-october/01-ghost\|Ghost]], [[04-ghost-grav-october/02-grav-october\|Grav, October CMS]] | Ghost-CLI, Composer, Docker | Docker, IIS (Grav) | Docker, PHP | ✅ |
| [[05-cms-headless-python/01-strapi-directus-payload\|Strapi, Directus, Payload]], [[05-cms-headless-python/02-keystone-sanity\|KeystoneJS, Sanity]], [[05-cms-headless-python/03-wagtail-mezzanine\|Wagtail, Mezzanine]], [[05-cms-headless-python/04-plone-zope\|Plone, Zope]] | Node.js, pip, Docker | Node.js, Python, Docker | Node.js, Python, Docker | ✅ |
| [[06-portails-ged/01-liferay-jahia-exo\|Liferay, Jahia, eXo]], [[06-portails-ged/02-alfresco-nuxeo\|Alfresco, Nuxeo]] | Docker, bundle Tomcat | Docker, bundle Tomcat | Docker | ✅ |
| [[07-lms/01-moodle\|Moodle]], [[07-lms/02-canvas-chamilo-ilias-openedx\|Canvas, Chamilo, ILIAS, Open edX]] | PHP, Git, Tutor | IIS/WAMP + PHP | PHP (Homebrew) | ✅ |
| [[08-erp/01-odoo\|Odoo]], [[08-erp/02-frappe-erpnext\|ERPNext]], [[08-erp/03-dolibarr-tryton\|Dolibarr, Tryton]], [[08-erp/04-idempiere-metasfresh-ofbiz-erp5-frontaccounting\|iDempiere, metasfresh, OFBiz, ERP5, FrontAccounting]] | odoo (deb), bench, Docker | Odoo (exe), DoliWamp, Docker | Docker, sources | ✅ |
| [[09-facturation-temps/01-invoice-ninja-akaunting-kimai-crater\|Invoice Ninja, Akaunting, Kimai]] | Docker, PHP | Docker, PHP (Kimai) | Docker, PHP (Kimai) | ✅ |
| [[10-ecommerce/01-prestashop-woocommerce-opencart-magento\|PrestaShop, WooCommerce, OpenCart, Magento]] | PHP, Composer, Docker | WAMP/IIS + PHP, Docker | PHP, Docker | ✅ |
| [[10-ecommerce/02-headless-frameworks\|Saleor, Medusa, Vendure, Sylius, Shopware, Bagisto, Spree, Solidus]] | Docker, Node.js, PHP, Ruby | Docker, Node.js, PHP | Docker, Node.js, PHP | ✅ |
| [[11-caisse-inventaire/01-caisses-pos\|OSPOS, uniCenta, Floreant, ERPNext POS]], [[11-caisse-inventaire/02-inventaire-actifs\|InvenTree, Snipe-IT, OpenBoxes]] | Docker, PHP, Java | Java (uniCenta, Floreant), Docker | Java, Docker | ✅ |

## Gestion de parc & services Windows

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[01-outils-windows/01-terminal-gestionnaires-paquets\|Windows Terminal, WinGet, Chocolatey, Scoop]] | ➖ | winget, script PowerShell | ➖ | ✅ |
| [[01-outils-windows/02-services-nssm-winsw\|NSSM, WinSW]] | ➖ | archive, choco | ➖ | ✅ |
| [[01-outils-windows/03-wsl-cygwin-msys2-git\|WSL, Cygwin, MSYS2, Git for Windows]] | ➖ | wsl --install, setup, winget | ➖ | ✅ |
| [[01-outils-windows/04-openssh-powertoys\|OpenSSH pour Windows, PowerToys]] | ➖ | Add-WindowsCapability, winget | ➖ | ✅ |
| [[02-bureau-distant/01-apache-guacamole\|Apache Guacamole]] | Docker, guacd + Tomcat | navigateur | navigateur | ✅ |
| [[02-bureau-distant/02-rdp-freerdp-xrdp-remmina\|FreeRDP, xrdp, Remmina, RDPY]] | apt, dnf, Flatpak | FreeRDP | brew (FreeRDP) | ✅ |
| [[02-bureau-distant/03-vnc-x2go\|TigerVNC, TightVNC, UltraVNC, X2Go]] | tigervnc, x2goserver | MSI, x2goclient | vncviewer, x2goclient | ✅ |
| [[03-supports-deploiement/01-rufus-ventoy\|Rufus, Ventoy]] | Ventoy2Disk.sh | winget, portable | ➖ | ✅ |
| [[03-supports-deploiement/02-fog-opsi-wapt\|FOG, opsi, WAPT]] | installfog.sh, Docker, paquets | agents | agents (opsi, WAPT) | ✅ |
| [[04-inventaire-rmm/01-open-audit-tactical-rport-remotely\|Open-AudIT, Tactical RMM, RPort, Remotely]] | installateurs, script, Docker | agents, Open-AudIT | agents | ✅ |
| [[05-automatisation-poste/01-autohotkey-autoit-actiona\|AutoHotkey, AutoIt, Actiona]] | apt (Actiona) | winget, installateurs | ➖ | ✅ |

## Commandes Bash, PowerShell & macOS

| Référence | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[27-commandes/01-presentation\|Référence des commandes]] : 350 commandes Bash, 252 PowerShell, 307 macOS, une page par commande | Bash | PowerShell | zsh | ✅ |

## Data & analytique

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[28-data-analytique/01-traitement-flux-lots/01-apache-spark\|Apache Spark]], [[28-data-analytique/01-traitement-flux-lots/02-apache-flink\|Apache Flink]], [[28-data-analytique/01-traitement-flux-lots/03-beam-samza-storm\|Beam, Samza, Storm]] | archives, pip, Kubernetes | archives (Java), WSL | archives, Homebrew | ✅ |
| [[28-data-analytique/02-integration-donnees/01-apache-nifi\|Apache NiFi]], [[28-data-analytique/02-integration-donnees/02-seatunnel-airbyte\|SeaTunnel, Airbyte]], [[28-data-analytique/02-integration-donnees/03-meltano-singer\|Meltano, Singer]] | archives, Docker, abctl, pipx | archives, Docker, pipx | archives, Docker, pipx | ✅ |
| [[28-data-analytique/03-cdc-connecteurs/01-debezium-kafka-connect\|Debezium, Kafka Connect]], [[28-data-analytique/03-cdc-connecteurs/02-benthos-flink-cdc\|Redpanda Connect, Flink CDC]] | archives, conteneurs, rpk | conteneurs | conteneurs, Homebrew (rpk) | ✅ |
| [[28-data-analytique/04-lac-donnees/01-iceberg-delta-hudi\|Iceberg, Delta Lake, Hudi]], [[28-data-analytique/04-lac-donnees/02-nessie-lakefs\|Nessie, lakeFS]] | bibliothèques Spark/Flink, pip, Docker | pip, Docker | pip, Docker, Homebrew (lakectl) | ✅ |
| [[28-data-analytique/05-catalogues-metadonnees/01-openmetadata-datahub\|OpenMetadata, DataHub]], [[28-data-analytique/05-catalogues-metadonnees/02-amundsen-atlas\|Amundsen, Apache Atlas]] | Docker, Helm, pip, archives | Docker, pip | Docker, pip | ✅ |
| [[28-data-analytique/06-transformation/01-dbt-sqlmesh\|dbt Core, SQLMesh]], [[28-data-analytique/06-transformation/02-polars-arrow\|Polars, Apache Arrow]] | pip | pip | pip, Homebrew | ✅ |
| [[28-data-analytique/07-science-donnees/01-jupyterhub\|JupyterHub]], [[28-data-analytique/07-science-donnees/02-mlflow\|MLflow]], [[28-data-analytique/07-science-donnees/03-dvc-pachyderm\|DVC, Pachyderm]] | TLJH, Helm, pip | pip, Docker | pip, Homebrew (DVC) | ✅ |

## IA & machine learning

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[29-ia-machine-learning/01-inference-locale/01-llama-cpp\|llama.cpp]], [[29-ia-machine-learning/01-inference-locale/02-koboldcpp-localai\|KoboldCpp, LocalAI]] | binaires, CMake, Docker | binaires (CUDA, Vulkan) | Homebrew, Metal | ✅ |
| [[29-ia-machine-learning/02-serveurs-inference/01-vllm-tgi\|vLLM, TGI]], [[29-ia-machine-learning/02-serveurs-inference/02-transformers\|Transformers]] | pip, Docker (GPU) | WSL, pip (Transformers) | pip (Transformers, MPS) | ✅ |
| [[29-ia-machine-learning/03-interfaces-chat/01-librechat-anythingllm\|LibreChat, AnythingLLM]], [[29-ia-machine-learning/03-interfaces-chat/02-text-generation-webui-sillytavern\|text-generation-webui, SillyTavern]] | Docker, scripts, Node.js | Docker, scripts, application | Docker, scripts, application | ✅ |
| [[29-ia-machine-learning/04-applications-locales/01-gpt4all-jan\|GPT4All, Jan]], [[29-ia-machine-learning/04-applications-locales/02-privategpt-khoj\|PrivateGPT, Khoj]] | .deb, Flatpak, Docker, Poetry | installateurs, Docker | .dmg, Docker | ✅ |
| [[29-ia-machine-learning/05-constructeurs-applications/01-dify\|Dify]], [[29-ia-machine-learning/05-constructeurs-applications/02-flowise-langflow\|Flowise, Langflow]] | Docker Compose, npx, uv | Docker, npx, uv | Docker, npx, uv | ✅ |
| [[29-ia-machine-learning/06-frameworks-rag/01-langchain-llamaindex-haystack\|LangChain, LlamaIndex, Haystack]], [[29-ia-machine-learning/06-frameworks-rag/02-ragflow-quivr\|RAGFlow, Quivr]] | pip, Docker Compose | pip, Docker | pip, Docker | ✅ |
| [[29-ia-machine-learning/07-generation-images/01-comfyui\|ComfyUI]], [[29-ia-machine-learning/07-generation-images/02-automatic1111-invokeai-fooocus\|AUTOMATIC1111, InvokeAI, Fooocus]] | git + venv, Docker | portable, lanceurs | application, git + venv (MPS) | ✅ |
| [[29-ia-machine-learning/08-frameworks-ml/01-pytorch-tensorflow-jax\|PyTorch, TensorFlow, JAX]], [[29-ia-machine-learning/08-frameworks-ml/02-opencv\|OpenCV]] | pip (CUDA, ROCm), apt | pip (TensorFlow GPU via WSL2) | pip (MPS, Metal) | ✅ |
| [[29-ia-machine-learning/09-ml-classique-inference/01-scikit-learn-boosting\|scikit-learn, XGBoost, LightGBM, CatBoost]], [[29-ia-machine-learning/09-ml-classique-inference/02-onnx-runtime-openvino\|ONNX Runtime, OpenVINO]] | pip, apt | pip (DirectML) | pip (CoreML) | ✅ |
| [[29-ia-machine-learning/10-mlops-serving/01-bentoml-kserve-seldon\|BentoML, KServe, Seldon Core]], [[29-ia-machine-learning/10-mlops-serving/02-ray-kubeflow\|Ray, Kubeflow]] | pip, Kubernetes, Helm | pip (BentoML, Ray) | pip (BentoML, Ray) | ✅ |
| [[29-ia-machine-learning/11-experiences-annotation/01-clearml-aim\|ClearML, Aim]], [[29-ia-machine-learning/11-experiences-annotation/02-label-studio-cvat-fiftyone\|Label Studio, CVAT, FiftyOne]] | Docker Compose, pip | Docker, pip | Docker, pip | ✅ |
| [[29-ia-machine-learning/12-audio-voix/01-whisper\|Whisper, whisper.cpp, faster-whisper]], [[29-ia-machine-learning/12-audio-voix/02-synthese-vocale\|Piper, Coqui TTS, Kokoro, Mimic 3, RVC]] | pip, CMake, Docker | pip, binaires | pip, Homebrew, Metal | ✅ |

## Documentation, GED & connaissance

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[32-documentation-ged/01-ged-legere/01-paperless-ngx\|Paperless-ngx]], [[32-documentation-ged/01-ged-legere/02-mayan-teedy-docspell\|Mayan EDMS, Teedy, Docspell]] | Docker Compose | Docker | Docker | ✅ |
| [[32-documentation-ged/02-ged-entreprise/01-openkm-logicaldoc-seeddms\|OpenKM, LogicalDOC, SeedDMS]] | Tomcat (Java), Apache + PHP | installateurs (Java), PHP | ➖ | ✅ |
| [[32-documentation-ged/03-signature-pdf/01-documenso-opensign-libresign\|Documenso, OpenSign, LibreSign]], [[32-documentation-ged/03-signature-pdf/02-stirling-pdf-gotenberg\|Stirling-PDF, Gotenberg]] | Docker, Nextcloud (occ) | Docker | Docker | ✅ |
| [[32-documentation-ged/04-bureautique/01-onlyoffice-collabora\|ONLYOFFICE Docs, Collabora Online]], [[32-documentation-ged/04-bureautique/02-libreoffice-openoffice\|LibreOffice, OpenOffice]] | Docker, apt, dnf, Flatpak | Docker (serveurs), MSI, winget | Homebrew, .dmg | ✅ |
| [[32-documentation-ged/05-notes-connaissance/01-triliumnext-memos\|TriliumNext, Memos]], [[32-documentation-ged/05-notes-connaissance/02-silverbullet-logseq-siyuan\|SilverBullet, Logseq, SiYuan]] | Docker, Flatpak, AppImage | applications, Docker | applications, Docker | ✅ |
| [[32-documentation-ged/06-documentation-technique/01-mkdocs-material\|MkDocs, Material]], [[32-documentation-ged/06-documentation-technique/02-sphinx-readthedocs-documize\|Sphinx, Read the Docs, Documize]] | pip, Docker | pip | pip, Homebrew | ✅ |
| [[32-documentation-ged/07-generateurs-documentation/01-docusaurus-vitepress\|Docusaurus, VitePress]], [[32-documentation-ged/07-generateurs-documentation/02-antora-bookdown\|Antora, Bookdown]] | npm, R | npm, R | npm, R, Homebrew | ✅ |
| [[32-documentation-ged/08-sites-statiques/01-hugo-jekyll-zola\|Hugo, Jekyll, Zola]], [[32-documentation-ged/08-sites-statiques/02-astro-quartz\|Astro, Quartz]] | binaires, snap, gem, npm | winget, gem, npm | Homebrew, gem, npm | ✅ |

## Matériel, IoT & vidéosurveillance

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[33-materiel-iot/01-inventaire-cmdb/01-fusioninventory-idoit-cmdbuild\|FusionInventory, i-doit, CMDBuild]] | agent, LAMP, Tomcat | agent (MSI) | agent | ✅ |
| [[33-materiel-iot/02-gestion-stocks/01-grocy-homebox-partkeepr\|Grocy, Homebox, PartKeepr]], [[33-materiel-iot/02-gestion-stocks/02-erpnext-openwms-openlmis\|ERPNext, OpenWMS, OpenLMIS]] | Docker, bench | Docker | Docker | ✅ |
| [[33-materiel-iot/03-impression-3d/01-octoprint-klipper-moonraker\|OctoPrint, Klipper, Moonraker, Mainsail, Fluidd]] | pip, Docker, KIAUH | ➖ | ➖ | ✅ |
| [[33-materiel-iot/04-domotique/01-home-assistant-openhab-domoticz\|Home Assistant, openHAB, Domoticz]] | OS, Docker, paquets | Docker, VM | Docker, VM | ✅ |
| [[33-materiel-iot/05-plateformes-iot/01-thingsboard-mainflux\|ThingsBoard, Magistrala]], [[33-materiel-iot/05-plateformes-iot/02-kaa-kura\|Kaa, Eclipse Kura]] | Docker | Docker | Docker | ✅ |
| [[33-materiel-iot/07-lorawan/01-chirpstack-ttn\|ChirpStack, The Things Stack]], [[33-materiel-iot/07-lorawan/02-mosquitto-iot-gateway\|Mosquitto, ThingsBoard Gateway]] | Docker, paquets | Docker | Docker | ✅ |
| [[33-materiel-iot/06-zigbee-zwave/01-zigbee2mqtt-zwavejs\|Zigbee2MQTT, Z-Wave JS UI]], [[33-materiel-iot/06-zigbee-zwave/02-esphome-tasmota\|ESPHome, Tasmota, OpenMQTTGateway]] | Docker, pip, flash | flash (Tasmotizer) | flash, pip | ✅ |
| [[33-materiel-iot/08-videosurveillance/01-frigate-zoneminder-shinobi\|Frigate, ZoneMinder, Shinobi]], [[33-materiel-iot/08-videosurveillance/02-motion-scrypted-go2rtc\|Motion, Kerberos.io, Scrypted, go2rtc]] | Docker | Docker | Docker | ✅ |

## Développement, API & tests

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[30-developpement-api/04-clients-http/01-insomnia-hoppscotch-httpie\|Insomnia, Hoppscotch, HTTPie, xh, wget]] | paquets, Flatpak, pip, Docker | winget, pip | Homebrew, pip | ✅ |
| [[30-developpement-api/05-documentation-api/01-swagger-redoc-scalar\|Swagger UI, Swagger Editor, Redoc, Scalar, Stoplight Elements]] | Docker, npx | Docker, npx | Docker, npx | ✅ |
| [[30-developpement-api/06-mock-api/01-prism-wiremock-mockserver\|Prism, WireMock, MockServer, Hoverfly, Mountebank]] | npx, Docker, binaires | npx, Docker | npx, Docker | ✅ |
| [[30-developpement-api/07-tests-contrat/01-pact-schemathesis\|Pact, Schemathesis, Dredd, Hurl, Newman]] | pip, npm, Docker, binaires | pip, npm | Homebrew, pip, npm | ✅ |
| [[30-developpement-api/08-tests-charge/01-ab-wrk2-autocannon-oha\|Apache Bench, wrk2, Autocannon, oha]] | paquets, npm, binaires | npm, binaires | Homebrew, npm | ✅ |
| [[30-developpement-api/09-tests-navigateur/01-selenium-cypress-webdriverio\|Selenium, Cypress, WebdriverIO, Puppeteer, Robot Framework]] | pip, npm, Docker | pip, npm | pip, npm | ✅ |
| [[30-developpement-api/10-tests-unitaires/01-pytest-junit-nunit\|pytest, JUnit, TestNG, NUnit, xUnit.net, MSTest]] | pip, Maven, Gradle, dotnet | pip, Maven, dotnet | pip, Maven, dotnet | ✅ |
| [[30-developpement-api/12-tests-langages/01-bdd-gotest-cargo\|Cucumber, Behave, Ginkgo, go test, cargo test]], [[30-developpement-api/12-tests-langages/02-phpunit-pest-rspec\|PHPUnit, Pest, RSpec, Minitest]] | npm, pip, go, cargo | npm, pip, go, cargo | npm, pip, go, cargo | ✅ |
| [[30-developpement-api/11-tests-js/01-vitest-jest-mocha\|Vitest, Jest, Mocha, AVA]] | npm | npm | npm | ✅ |
| [[30-developpement-api/13-securite-code/01-gitleaks-detect-secrets-trufflehog\|Gitleaks, detect-secrets, TruffleHog]], [[30-developpement-api/13-securite-code/02-iac-checkov-kics\|Checkov, KICS, Terrascan, TFLint]], [[30-developpement-api/13-securite-code/03-linters-shellcheck\|Actionlint, ShellCheck, shfmt, EditorConfig]] | binaires, pip, Docker | binaires, pip | Homebrew, pip | ✅ |

## Services de plateforme & auto-hébergement

| Service | Linux | Windows | macOS | État |
| --- | --- | --- | --- | --- |
| [[31-auto-hebergement/02-paas/01-coolify-dokku-caprover\|Coolify, Dokku, CapRover]] | script, Docker | ➖ | ➖ | ✅ |
| [[31-auto-hebergement/03-suites-homelab/01-homelabos-sandstorm\|HomelabOS, Ansible-NAS, Sandstorm, FreedomBox]] | Ansible, script, Debian | ➖ | ➖ | ✅ |
| [[31-auto-hebergement/04-panneaux-hebergement/01-hestiacp-cyberpanel-ispconfig-virtualmin\|HestiaCP, CyberPanel, ISPConfig, Virtualmin]] | scripts d'installation | ➖ | ➖ | ✅ |
| [[31-auto-hebergement/05-admin-serveur/01-webmin-ajenti-froxlor\|Webmin, Ajenti, Froxlor]] | paquets, script | ➖ | ➖ | ✅ |
| [[31-auto-hebergement/06-gestion-docker/01-dockge-yacht-komodo\|Dockge, Yacht, Komodo]] | Docker | Docker | Docker | ✅ |
| [[31-auto-hebergement/07-dashboards/01-homepage-homarr-dashy\|Homepage, Homarr, Dashy, Heimdall]], [[31-auto-hebergement/07-dashboards/02-flame-glance-homer\|Flame, Organizr, Glance, Homer]] | Docker | Docker | Docker | ✅ |
| [[31-auto-hebergement/08-actions-automatisation/01-olivetin-semaphore\|OliveTin, Ansible Semaphore]] | Docker | Docker | Docker | ✅ |
| [[31-auto-hebergement/09-bases-nocode/01-nocodb-baserow-grist\|NocoDB, Baserow, Grist]] | Docker | Docker | Docker | ✅ |
| [[31-auto-hebergement/10-low-code/01-appsmith-budibase-tooljet\|Appsmith, Budibase, ToolJet]] | Docker | Docker | Docker | ✅ |
| [[31-auto-hebergement/11-baas/01-supabase-appwrite-pocketbase\|Supabase, Appwrite, PocketBase, Parse Server]] | Docker, binaire | Docker, binaire | Docker, binaire | ✅ |
| [[31-auto-hebergement/12-api-bdd/01-hasura-postgrest-postgraphile\|Hasura, PostgREST, PostGraphile]] | Docker, npx | Docker, npx | Docker, npx | ✅ |
| [[31-auto-hebergement/13-bi-analytics/01-metabase-superset-redash\|Metabase, Superset, Redash, Lightdash, Evidence]] | Docker, npm | Docker, npm | Docker, npm | ✅ |
