## Rapport de veille du 2026-11-08

| Sources suivies | Nouvelles versions | Correctifs de sécurité | Changements à vérifier | Fins de vie < 120 j | Erreurs |
| --- | --- | --- | --- | --- | --- |
| 590 | 50 | 12 | 14 | 25 | 8 |

### Nouvelles versions

| Service | Avant | Maintenant | Date | Alertes | Fiche |
| --- | --- | --- | --- | --- | --- |
| [libvirt](https://github.com/libvirt/libvirt/releases/tag/v12.9.0) | v12.8.0 | **v12.9.0** |  | — | `13-conteneurs/14-kvm-qemu-libvirt` |
| [Docker Engine](https://github.com/moby/moby/releases/tag/docker-v29.9.3) | docker-v29.9.2 | **docker-v29.9.3** | 2026-11-03 | 🔒 sécurité | `13-conteneurs/01-docker` |
| [CRI-O](https://github.com/cri-o/cri-o/releases/tag/v1.37.3) | v1.37.2 | **v1.37.3** | 2026-11-03 | 🔒 sécurité | `13-conteneurs/22-runtimes-isoles` |
| [Fedora Server](https://endoflife.date/fedora) | 44 | **45** | 2026-11-03 | — | `24-systemes-exploitation/02-famille-red-hat` |
| [Alpine Linux](https://endoflife.date/alpine) | 3.24.3 | **3.24.4** | 2026-11-05 | — | `24-systemes-exploitation/06-alpine-linux` |
| [TrueNAS SCALE](https://github.com/truenas/middleware/releases/tag/TS-25.10.8) | TS-25.10.7 | **TS-25.10.8** |  | — | `09-fichiers-partage/21-truenas-scale` |
| [Keycloak](https://github.com/keycloak/keycloak/releases/tag/26.8.2) | 26.8.1 | **26.8.2** | 2026-11-05 | 🔒 sécurité | `01-annuaire-identite/05-keycloak` |
| [Gluu Flex](https://github.com/JanssenProject/jans/releases/tag/v2.6.1) | v2.6.0 | **v2.6.1** | 2026-11-03 | — | `01-annuaire-identite/19-plateformes-iam` |
| [OAuth2 Proxy](https://github.com/oauth2-proxy/oauth2-proxy/releases/tag/v7.15.6) | v7.15.5 | **v7.15.6** | 2026-11-05 | 🔒 sécurité ⚠️ changements | `01-annuaire-identite/18-oauth2-proxy-dex` |
| [Zitadel](https://github.com/zitadel/zitadel/releases/tag/v4.20.1) | v4.20.0 | **v4.20.1** | 2026-11-03 | — | `01-annuaire-identite/19-plateformes-iam` |
| [Casdoor](https://github.com/casdoor/casdoor/releases/tag/v4.26.0) | v4.25.0 | **v4.26.0** | 2026-11-05 | — | `01-annuaire-identite/19-plateformes-iam` |
| [Logto](https://github.com/logto-io/logto/releases/tag/v1.46.0) | v1.45.0 | **v1.46.0** | 2026-11-05 | 🔒 sécurité | `01-annuaire-identite/19-plateformes-iam` |
| [SSSD](https://github.com/SSSD/sssd/releases/tag/2.13.2) | 2.13.1 | **2.13.2** | 2026-11-06 | — | `01-annuaire-identite/20-sssd-realmd` |
| [AdGuard Home](https://github.com/AdguardTeam/AdGuardHome/releases/tag/v0.107.80) | v0.107.79 | **v0.107.80** | 2026-11-03 | 🔒 sécurité ⚠️ changements | `02-dns/09-dns-filtrants` |
| [phpIPAM](https://github.com/phpipam/phpipam/releases/tag/v1.9.0) | v1.8.3 | **v1.9.0** | 2026-11-02 | 🔒 sécurité ⚠️ changements | `18-infrastructure-systeme/09-phpipam` |
| [Ralph](https://github.com/allegro/ralph/releases/tag/20261106.1) | 20261019.1 | **20261106.1** | 2026-11-06 | — | `18-infrastructure-systeme/10-ipam-dcim-alternatives` |
| [OpenVPN](https://github.com/OpenVPN/openvpn/releases/tag/v2.7.9) | v2.7.8 | **v2.7.9** | 2026-11-05 | 🔒 sécurité | `08-acces-distant-vpn/02-openvpn` |
| [Tailscale (client open source)](https://github.com/tailscale/tailscale/releases/tag/v1.104.5) | v1.104.4 | **v1.104.5** | 2026-11-03 | — | `08-acces-distant-vpn/05-tailscale-headscale` |
| [SoftEther VPN](https://github.com/SoftEtherVPN/SoftEtherVPN/releases/tag/5.2.5189) | 5.2.5188 | **5.2.5189** | 2026-11-05 | — | `08-acces-distant-vpn/13-softether-pritunl-mullvad` |
| [Pritunl (community)](https://github.com/pritunl/pritunl/releases/tag/1.34.4803.56) | 1.34.4763.45 | **1.34.4803.56** | 2026-11-06 | — | `08-acces-distant-vpn/13-softether-pritunl-mullvad` |
| [Apache HTTP Server](https://github.com/apache/httpd/releases/tag/djg-apache-nspr-07) | 2.4.69 | **djg-apache-nspr-07** | 2026-11-06 | — | `05-web/02-apache` |
| [Caddy](https://github.com/caddyserver/caddy/releases/tag/v2.11.9) | v2.11.7 | **v2.11.9** | 2026-11-05 | 🔒 sécurité ⚠️ changements | `05-web/04-caddy` |
| [KrakenD Community](https://github.com/krakend/krakend-ce/releases/tag/v3.0.3) | v3.0.2 | **v3.0.3** | 2026-11-02 | ⚠️ changements | `07-proxy-cache/12-passerelles-api-alternatives` |
| [ProxySQL](https://github.com/sysown/proxysql/releases/tag/v3.0.12) | v3.0.11 | **v3.0.12** | 2026-11-05 | 🔒 sécurité | `07-proxy-cache/14-proxys-bases-de-donnees` |
| [InfluxDB OSS](https://github.com/influxdata/influxdb/releases/tag/v3.12.2) | v3.12.1 | **v3.12.2** | 2026-11-02 | 🔒 sécurité ⚠️ changements | `06-supervision/10-influxdb` |
| [Neo4j Community](https://endoflife.date/neo4j) | 2026.09.0 | **2026.10.2** | 2026-11-02 | — | `11-bases-de-donnees/09-neo4j` |
| [NFS-Ganesha](https://github.com/nfs-ganesha/nfs-ganesha/releases/tag/V15.11) | V15.9 | **V15.11** | 2026-11-07 | — | `09-fichiers-partage/02-nfs` |
| [ownCloud Infinite Scale](https://github.com/owncloud/ocis/releases/tag/v8.2.3) | v8.2.2 | **v8.2.3** | 2026-11-06 | 🔒 sécurité ⚠️ changements | `09-fichiers-partage/09-owncloud` |
| [K3s](https://github.com/k3s-io/k3s/releases/tag/v1.37.2%2Bk3s1) | v1.37.1+k3s1 | **v1.37.2+k3s1** | 2026-11-03 | — | `13-conteneurs/05-k3s` |
| [Docker Compose](https://github.com/docker/compose/releases/tag/v5.7.0) | v5.6.1 | **v5.7.0** | 2026-11-02 | ⚠️ changements | `13-conteneurs/01-docker` |
| [Prometheus](https://github.com/prometheus/prometheus/releases/tag/v3.16.0) | v3.15.1 | **v3.16.0** | 2026-11-05 | ⚠️ changements | `06-supervision/02-prometheus` |
| [Zabbix](https://endoflife.date/zabbix) | 7.4.16 | **8.0.0** | 2026-11-05 | — | `06-supervision/04-zabbix` |
| [Netdata](https://github.com/netdata/netdata/releases/tag/v2.12.3) | v2.12.2 | **v2.12.3** | 2026-11-04 | ⚠️ changements | `06-supervision/07-netdata` |
| [Centreon Open Source](https://github.com/centreon/centreon/releases/tag/centreon-web-26.11.0) | centreon-web-26.09.2 | **centreon-web-26.11.0** | 2026-11-06 | — | `06-supervision/01-centreon` |
| [Telegraf](https://github.com/influxdata/telegraf/releases/tag/v1.40.3) | v1.40.2 | **v1.40.3** | 2026-11-02 | — | `06-supervision/09-telegraf` |
| [Logstash](https://endoflife.date/logstash) | 9.5.5 | **9.5.6** | 2026-11-02 | — | `15-journalisation/02-logstash` |
| [Graylog Open](https://github.com/Graylog2/graylog2-server/releases/tag/7.2.2) | 7.2.1 | **7.2.2** |  | — | `15-journalisation/04-graylog` |
| [Snort](https://github.com/snort3/snort3/releases/tag/3.13.2.0) | 3.12.4.0 | **3.13.2.0** | 2026-11-05 | ⚠️ changements | `16-securite/06-snort` |
| [OpenVAS](https://github.com/greenbone/openvas-scanner/releases/tag/v23.52.9) | v23.52.8 | **v23.52.9** | 2026-11-05 | — | `21-outils/02-reseau-diagnostic/08-greenbone-openvas` |
| [Ansible](https://github.com/ansible/ansible/releases/tag/v2.22.0) | v2.21.5 | **v2.22.0** | 2026-11-02 | — | `17-automatisation/01-ansible` |
| [OpenTofu](https://github.com/opentofu/opentofu/releases/tag/v1.13.9) | v1.13.2 | **v1.13.9** | 2026-11-05 | — | `17-automatisation/04-terraform` |
| [n8n (source available/community)](https://github.com/n8n-io/n8n/releases/tag/n8n%402.46.6) | n8n@2.45.7 | **n8n@2.46.6** | 2026-11-04 | — | `21-outils/05-ia-productivite/06-n8n` |
| [SonarQube Community Build](https://github.com/SonarSource/sonarqube/releases/tag/26.11.0.134175) | 26.10.0.133078 | **26.11.0.134175** | 2026-11-04 | — | `14-devops/07-sonarqube` |
| [Notepad++](https://github.com/notepad-plus-plus/notepad-plus-plus/releases/tag/v8.9.9) | v8.9.8.1 | **v8.9.9** | 2026-11-06 | — | `21-outils/04-developpement/05-notepad-plus-plus` |
| [Mailpit](https://github.com/axllent/mailpit/releases/tag/v1.33.1) | v1.33.0 | **v1.33.1** | 2026-11-07 | — | `10-messagerie/07-mailpit` |
| [JupyterLab](https://github.com/jupyterlab/jupyterlab/releases/tag/v4.6.6) | v4.6.5 | **v4.6.6** | 2026-11-06 | ⚠️ changements | `21-outils/05-ia-productivite/05-jupyterlab` |
| [Ollama](https://github.com/ollama/ollama/releases/tag/v0.40.15) | v0.40.13 | **v0.40.15** | 2026-11-03 | — | `21-outils/05-ia-productivite/04-ollama-open-webui` |
| [Open WebUI](https://github.com/open-webui/open-webui/releases/tag/v0.13.1) | v0.12.5 | **v0.13.1** | 2026-11-08 | ⚠️ changements | `21-outils/05-ia-productivite/04-ollama-open-webui` |
| [Elasticsearch (license changed)](https://github.com/elastic/elasticsearch/releases/tag/v9.5.6) | v9.5.5 | **v9.5.6** | 2026-11-02 | — | `12-recherche-messages/01-elasticsearch` |
| [Playwright](https://github.com/microsoft/playwright/releases/tag/v1.65.0) | v1.64.1 | **v1.65.0** | 2026-11-05 | ⚠️ changements | `21-outils/04-developpement/09-playwright` |

### Fins de support proches

| Service | Version | Fin de support | Fiche |
| --- | --- | --- | --- |
| Docker Engine | 25.0 | 2026-12-04 | `13-conteneurs/01-docker` |
| FreeBSD | 14.4 | 2026-12-31 | `24-systemes-exploitation/09-bsd` |
| Fedora Server | 43 | 2026-12-01 | `24-systemes-exploitation/02-famille-red-hat` |
| NixOS | 26.05 | 2026-12-31 | `24-systemes-exploitation/07-nixos` |
| HAProxy | 3.3 | 2027-01-01 | `07-proxy-cache/01-haproxy` |
| PHP | 8.2 | 2026-12-31 | `05-web/05-php-fpm` |
| .NET SDK | 9 | 2026-11-10 | `05-web/18-dotnet-mono` |
| .NET SDK | 8 | 2026-11-10 | `05-web/18-dotnet-mono` |
| PowerShell | 7.5 | 2026-11-10 | `05-web/19-powershell` |
| PowerShell | 7.4 | 2026-11-10 | `05-web/19-powershell` |
| PostgreSQL | 14 | 2026-11-12 | `11-bases-de-donnees/02-postgresql` |
| MariaDB Server | 13.0 | 2026-12-31 | `11-bases-de-donnees/01-mariadb-mysql` |
| CockroachDB | 26.3 | 2027-02-19 | `11-bases-de-donnees/12-sql-distribue` |
| Redis | 8.0 | 2026-12-01 | `11-bases-de-donnees/04-redis` |
| Nextcloud | 33 | 2027-02-28 | `09-fichiers-partage/08-nextcloud` |
| Kubernetes | 1.35 | 2027-02-28 | `13-conteneurs/04-kubernetes` |
| Grafana OSS | 13.0 | 2027-01-09 | `06-supervision/03-grafana` |
| Zabbix | 6.0 | 2027-02-28 | `06-supervision/04-zabbix` |
| Ansible | 2.19 | 2026-11-30 | `17-automatisation/01-ansible` |
| Drupal | 11.3 | 2026-12-16 | `25-web-cms-portails/02-drupal-joomla` |
| Drupal | 10.6 | 2026-12-16 | `25-web-cms-portails/02-drupal-joomla` |
| GitLab Community Edition | 19.5 | 2027-01-21 | `14-devops/02-gitlab` |
| GitLab Community Edition | 19.4 | 2026-12-17 | `14-devops/02-gitlab` |
| GitLab Community Edition | 19.3 | 2026-11-19 | `14-devops/02-gitlab` |
| RabbitMQ | 4.3 | 2027-01-31 | `12-recherche-messages/03-rabbitmq` |

<details><summary>Sources en erreur (8)</summary>

- GCC : endoflife.date 404 (gcc)
- Tuleap Community : GitHub 404 (Enalean/tuleap, étiquettes)
- UltraVNC : aucune version publiée (ultravnc/UltraVNC)
- MSYS2 : aucune version publiée (msys2/MSYS2-packages)
- Open-AudIT : GitHub 404 (Open-AudIT/Open-AudIT, étiquettes)
- Actiona : GitHub 404 (actiona/actiona, étiquettes)
- OpenRC : aucune version publiée (OpenRC/openrc)
- Oh My Zsh : aucune version publiée (ohmyzsh/ohmyzsh)

</details>

L'agent IA prépare une demande de fusion avec les mises à jour des fiches concernées (si la clé de l'agent est configurée). Rien n'est publié sans validation de JK-ASFC.
