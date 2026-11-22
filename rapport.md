## Rapport de veille du 2026-11-22

| Sources suivies | Nouvelles versions | Correctifs de sécurité | Changements à vérifier | Fins de vie < 120 j | Erreurs |
| --- | --- | --- | --- | --- | --- |
| 600 | 150 | 43 | 54 | 21 | 7 |

### Nouvelles versions

| Service | Avant | Maintenant | Date | Alertes | Fiche |
| --- | --- | --- | --- | --- | --- |
| [UTM](https://github.com/utmapp/UTM/releases/tag/v5.0.9-2) | v5.0.8 | **v5.0.9-2** | 2026-11-18 | 🔒 sécurité ⚠️ changements | `13-conteneurs/16-utm` |
| [Docker Engine](https://github.com/moby/moby/releases/tag/docker-v29.10.0) | docker-v29.9.3 | **docker-v29.10.0** | 2026-11-16 | ⚠️ changements | `13-conteneurs/01-docker` |
| [CRI-O](https://github.com/cri-o/cri-o/releases/tag/v1.37.4) | v1.37.3 | **v1.37.4** | 2026-11-16 | 🔒 sécurité | `13-conteneurs/22-runtimes-isoles` |
| [Kata Containers](https://github.com/kata-containers/kata-containers/releases/tag/4.4.0) | 4.3.1 | **4.4.0** | 2026-11-17 | — | `13-conteneurs/22-runtimes-isoles` |
| [Rocky Linux](https://endoflife.date/rocky-linux) | 10.2 | **10.3** | 2026-11-16 | — | `24-systemes-exploitation/02-famille-red-hat` |
| [AlmaLinux](https://endoflife.date/almalinux) | 10.2 | **10.3** | 2026-11-16 | — | `24-systemes-exploitation/02-famille-red-hat` |
| [YunoHost](https://github.com/YunoHost/yunohost/releases/tag/debian/13.0.11) | debian/12.1.42 | **debian/13.0.11** | 2026-11-18 | — | `31-auto-hebergement/01-plateformes-auto-hebergement` |
| [DietPi](https://github.com/MichaIng/DietPi/releases/tag/v10.9) | v10.8 | **v10.9** | 2026-11-21 | 🔒 sécurité ⚠️ changements | `24-systemes-exploitation/10-raspberry-pi-os-dietpi` |
| [Authentik](https://github.com/goauthentik/authentik/releases/tag/version/2026.8.6) | version/2026.8.5 | **version/2026.8.6** | 2026-11-20 | — | `01-annuaire-identite/13-authentik` |
| [privacyIDEA](https://github.com/privacyidea/privacyidea/releases/tag/v3.14.1) | v3.14 | **v3.14.1** | 2026-11-20 | ⚠️ changements | `01-annuaire-identite/17-privacyidea-linotp` |
| [LinOTP](https://github.com/LinOTP/LinOTP/releases/tag/release%2F4.0.0) | release/3.4.5 | **release/4.0.0** |  | — | `01-annuaire-identite/17-privacyidea-linotp` |
| [Zitadel](https://github.com/zitadel/zitadel/releases/tag/v4.20.5) | v4.20.3 | **v4.20.5** | 2026-11-18 | — | `01-annuaire-identite/19-plateformes-iam` |
| [Casdoor](https://github.com/casdoor/casdoor/releases/tag/v4.30.0) | v4.29.0 | **v4.30.0** | 2026-11-21 | — | `01-annuaire-identite/19-plateformes-iam` |
| [AdGuard Home](https://github.com/AdguardTeam/AdGuardHome/releases/tag/v1.0.0) | v0.107.80 | **v1.0.0** | 2026-11-19 | 🔒 sécurité ⚠️ changements | `02-dns/09-dns-filtrants` |
| [Blocky](https://github.com/0xERR0R/blocky/releases/tag/v0.37.0) | v0.36.0 | **v0.37.0** | 2026-11-21 | 🔒 sécurité ⚠️ changements | `02-dns/09-dns-filtrants` |
| [phpIPAM](https://github.com/phpipam/phpipam/releases/tag/v1.9.1) | v1.9.0 | **v1.9.1** | 2026-11-17 | 🔒 sécurité | `18-infrastructure-systeme/09-phpipam` |
| [NetBird](https://github.com/netbirdio/netbird/releases/tag/v0.83.2) | v0.83.1 | **v0.83.2** | 2026-11-20 | — | `08-acces-distant-vpn/11-netbird-nebula` |
| [SoftEther VPN](https://github.com/SoftEtherVPN/SoftEtherVPN/releases/tag/5.2.5190) | 5.2.5189 | **5.2.5190** | 2026-11-18 | — | `08-acces-distant-vpn/13-softether-pritunl-mullvad` |
| [NGINX](https://github.com/nginx/nginx/releases/tag/release-1.31.9) | release-1.31.8 | **release-1.31.9** | 2026-11-18 | 🔒 sécurité ⚠️ changements | `05-web/03-nginx` |
| [HAProxy](https://endoflife.date/haproxy) | 3.4.7 | **3.4.8** | 2026-11-18 | — | `07-proxy-cache/01-haproxy` |
| [Kong Gateway OSS](https://github.com/Kong/kong/releases/tag/3.9.5) | 3.9.4 | **3.9.5** | 2026-11-19 | — | `07-proxy-cache/11-kong-apisix` |
| [Apache APISIX](https://github.com/apache/apisix/releases/tag/3.21.0) | 3.20.0 | **3.21.0** | 2026-11-19 | 🔒 sécurité | `07-proxy-cache/11-kong-apisix` |
| [KrakenD Community](https://github.com/krakend/krakend-ce/releases/tag/v3.0.5) | v3.0.4 | **v3.0.5** | 2026-11-19 | — | `07-proxy-cache/12-passerelles-api-alternatives` |
| [PHP](https://github.com/php/php-src/releases/tag/php-8.6.0) | php-8.5.12 | **php-8.6.0** | 2026-11-21 | ⚠️ changements | `05-web/05-php-fpm` |
| [Node.js](https://github.com/nodejs/node/releases/tag/v27.0.0-alpha.0.1.1) | v27.0.0-alpha.0.1.0 | **v27.0.0-alpha.0.1.1** | 2026-11-17 | 🔒 sécurité | `05-web/06-nodejs` |
| [Bun](https://github.com/oven-sh/bun/releases/tag/bun-v1.4.5) | bun-v1.4.4 | **bun-v1.4.5** | 2026-11-19 | — | `05-web/15-bun` |
| [Ruby](https://endoflife.date/ruby) | 4.0.9 | **4.0.10** | 2026-11-18 | — | `05-web/08-ruby` |
| [Eclipse Temurin](https://endoflife.date/eclipse-temurin) | 27.0.1.0.2+1 | **27.0.1.1+4** | 2026-11-18 | — | `05-web/09-openjdk` |
| [Clang/LLVM](https://github.com/llvm/llvm-project/releases/tag/llvmorg-23.1.6) | llvmorg-23.1.5 | **llvmorg-23.1.6** | 2026-11-17 | — | `30-developpement-api/01-gcc-clang` |
| [CMake](https://github.com/Kitware/CMake/releases/tag/v4.5.1) | v4.5.0 | **v4.5.1** | 2026-11-19 | — | `30-developpement-api/02-cmake-ninja-meson` |
| [Jenkins](https://github.com/jenkinsci/jenkins/releases/tag/jenkins-2.591) | jenkins-2.590 | **jenkins-2.591** | 2026-11-17 | — | `14-devops/05-jenkins` |
| [GoCD](https://github.com/gocd/gocd/releases/tag/26.2.0) | 26.1.0 | **26.2.0** | 2026-11-21 | — | `14-devops/08-buildbot-gocd` |
| [Dagger](https://github.com/dagger/dagger/releases/tag/v0.21.12) | v0.21.11 | **v0.21.12** | 2026-11-17 | ⚠️ changements | `14-devops/12-dagger-earthly` |
| [PostgreSQL](https://endoflife.date/postgresql) | 18.7 | **19.0** | 2026-11-16 | — | `11-bases-de-donnees/02-postgresql` |
| [DuckDB](https://github.com/duckdb/duckdb/releases/tag/v2.0.1) | v2.0.0 | **v2.0.1** | 2026-11-20 | — | `11-bases-de-donnees/11-duckdb` |
| [CockroachDB](https://github.com/cockroachdb/cockroach/releases/tag/v26.2.12) | v26.2.11 | **v26.2.12** | 2026-10-26 | — | `11-bases-de-donnees/12-sql-distribue` |
| [TimescaleDB](https://github.com/timescale/timescaledb/releases/tag/2.32.1) | 2.32.0 | **2.32.1** | 2026-11-19 | 🔒 sécurité | `11-bases-de-donnees/13-extensions-postgresql` |
| [Valkey](https://github.com/valkey-io/valkey/releases/tag/9.2.0) | 9.1.3 | **9.2.0** | 2026-11-19 | ⚠️ changements | `11-bases-de-donnees/04-redis` |
| [etcd](https://github.com/etcd-io/etcd/releases/tag/v3.7.4) | v3.7.3 | **v3.7.4** | 2026-11-19 | ⚠️ changements | `11-bases-de-donnees/18-etcd-consul` |
| [FoundationDB](https://github.com/apple/foundationdb/releases/tag/7.4.8) | 7.3.77 | **7.4.8** | 2026-09-24 | — | `11-bases-de-donnees/19-foundationdb` |
| [ArangoDB Community](https://github.com/arangodb/arangodb/releases/tag/v3.12.14) | v3.12.13 | **v3.12.14** |  | — | `11-bases-de-donnees/21-multi-modeles` |
| [ClickHouse](https://github.com/ClickHouse/ClickHouse/releases/tag/v26.9.35.9-stable) | v26.9.28.166-stable | **v26.9.35.9-stable** | 2026-11-21 | — | `11-bases-de-donnees/24-clickhouse` |
| [Apache Druid](https://github.com/apache/druid/releases/tag/druid-39.0.0) | druid-38.0.0 | **druid-39.0.0** | 2026-11-19 | ⚠️ changements | `11-bases-de-donnees/25-olap-temps-reel` |
| [SnapRAID](https://github.com/amadvance/snapraid/releases/tag/v15.2) | v15.1 | **v15.2** | 2026-11-16 | — | `09-fichiers-partage/30-mergerfs-snapraid` |
| [SeaweedFS](https://github.com/seaweedfs/seaweedfs/releases/tag/4.54) | 4.53 | **4.54** | 2026-11-16 | — | `09-fichiers-partage/32-stockage-objet` |
| [Restic](https://github.com/restic/restic/releases/tag/v0.20.0) | v0.19.1 | **v0.20.0** | 2026-11-19 | 🔒 sécurité ⚠️ changements | `19-sauvegarde/01-restic` |
| [Nextcloud](https://github.com/nextcloud/server/releases/tag/v35.0.3) | v33.0.11 | **v35.0.3** | 2026-11-12 | — | `09-fichiers-partage/08-nextcloud` |
| [OpenShift OKD](https://github.com/okd-project/okd/releases/tag/5.0.0-okd-scos.8) | 5.0.0-okd-scos.7 | **5.0.0-okd-scos.8** | 2026-11-19 | — | `13-conteneurs/27-openshift-okd` |
| [KubeVirt](https://github.com/kubevirt/kubevirt/releases/tag/v1.10.0) | v1.9.1 | **v1.10.0** | 2026-11-18 | ⚠️ changements | `13-conteneurs/28-kubevirt` |
| [Argo CD](https://github.com/argoproj/argo-cd/releases/tag/v3.6.2) | v3.6.1 | **v3.6.2** | 2026-11-18 | 🔒 sécurité | `13-conteneurs/30-gitops-argocd-flux` |
| [Flux CD](https://github.com/fluxcd/flux2/releases/tag/v2.10.1) | v2.10.0 | **v2.10.1** | 2026-11-20 | ⚠️ changements | `13-conteneurs/30-gitops-argocd-flux` |
| [Portainer CE](https://github.com/portainer/portainer/releases/tag/2.45.4) | 2.45.3 | **2.45.4** | 2026-11-18 | 🔒 sécurité ⚠️ changements | `13-conteneurs/08-portainer` |
| [Dapr](https://github.com/dapr/dapr/releases/tag/v1.19.2) | v1.19.1 | **v1.19.2** | 2026-11-19 | 🔒 sécurité ⚠️ changements | `13-conteneurs/33-dapr` |
| [KEDA](https://github.com/kedacore/keda/releases/tag/v2.21.1) | v2.21.0 | **v2.21.1** | 2026-11-15 | — | `13-conteneurs/34-serverless-keda` |
| [Cilium](https://github.com/cilium/cilium/releases/tag/v1.20.5) | v1.20.4 | **v1.20.5** | 2026-11-17 | 🔒 sécurité ⚠️ changements | `13-conteneurs/36-reseau-cni` |
| [Calico](https://github.com/projectcalico/calico/releases/tag/v3.33.1) | v3.33.0 | **v3.33.1** | 2026-11-16 | — | `13-conteneurs/36-reseau-cni` |
| [Flannel](https://github.com/flannel-io/flannel/releases/tag/v0.28.11) | v0.28.10 | **v0.28.11** | 2026-11-19 | — | `13-conteneurs/36-reseau-cni` |
| [Docker Compose](https://github.com/docker/compose/releases/tag/v5.8.0) | v5.7.1 | **v5.8.0** | 2026-11-17 | — | `13-conteneurs/01-docker` |
| [Mimir](https://github.com/grafana/mimir/releases/tag/mimir-3.2.6) | mimir-3.2.5 | **mimir-3.2.6** | 2026-11-18 | 🔒 sécurité | `06-supervision/13-stockage-metriques-long-terme` |
| [LibreNMS](https://github.com/librenms/librenms/releases/tag/26.11.0) | 26.10.2 | **26.11.0** | 2026-11-16 | — | `06-supervision/14-supervision-reseau-snmp` |
| [Netdata](https://github.com/netdata/netdata/releases/tag/v2.13.0) | v2.12.3 | **v2.13.0** | 2026-11-19 | ⚠️ changements | `06-supervision/07-netdata` |
| [Prometheus Node Exporter](https://github.com/prometheus/node_exporter/releases/tag/v1.13.1) | v1.12.1 | **v1.13.1** | 2026-11-19 | — | `06-supervision/02-prometheus` |
| [Vector](https://github.com/vectordotdev/vector/releases/tag/v0.62.0) | v0.61.0 | **v0.62.0** | 2026-11-16 | ⚠️ changements | `15-journalisation/10-fluentd-vector` |
| [OpenSearch](https://github.com/opensearch-project/OpenSearch/releases/tag/3.10.0) | 3.9.0 | **3.10.0** | 2026-11-18 | ⚠️ changements | `12-recherche-messages/02-opensearch` |
| [SigNoz](https://github.com/SigNoz/signoz/releases/tag/v0.151.0) | v0.150.0 | **v0.151.0** | 2026-11-18 | — | `06-supervision/19-observabilite-unifiee` |
| [Sentry self-hosted](https://github.com/getsentry/self-hosted/releases/tag/26.11.0) | 26.10.1 | **26.11.0** | 2026-11-18 | 🔒 sécurité | `06-supervision/20-suivi-erreurs` |
| [Uptime Kuma](https://github.com/louislam/uptime-kuma/releases/tag/2.5.12) | 2.5.11 | **2.5.12** | 2026-11-17 | 🔒 sécurité | `06-supervision/21-disponibilite-pages-statut` |
| [OSSEC](https://github.com/ossec/ossec-hids/releases/tag/4.5.0) | 4.4.1 | **4.5.0** | 2026-11-19 | 🔒 sécurité ⚠️ changements | `16-securite/12-ossec` |
| [MISP](https://github.com/MISP/MISP/releases/tag/v2.5.52) | v2.5.51 | **v2.5.52** | 2026-11-18 | 🔒 sécurité ⚠️ changements | `16-securite/14-reponse-incident-cti` |
| [OpenCTI](https://github.com/OpenCTI-Platform/opencti/releases/tag/7.261119.0) | 7.261109.0 | **7.261119.0** | 2026-11-19 | — | `16-securite/14-reponse-incident-cti` |
| [FleetDM](https://github.com/fleetdm/fleet/releases/tag/fleet-v4.95.0) | fleet-v4.94.1 | **fleet-v4.95.0** | 2026-11-17 | 🔒 sécurité ⚠️ changements | `16-securite/16-osquery-fleet` |
| [acme.sh](https://github.com/acmesh-official/acme.sh/releases/tag/3.1.7) | 3.1.6 | **3.1.7** | 2026-11-19 | 🔒 sécurité ⚠️ changements | `16-securite/20-acme-certbot` |
| [OpenBao](https://github.com/openbao/openbao/releases/tag/v2.7.3) | v2.7.2 | **v2.7.3** | 2026-11-19 | 🔒 sécurité | `16-securite/25-openbao-infisical` |
| [Infisical (open source core)](https://github.com/Infisical/infisical/releases/tag/v0.167.14) | v0.167.10 | **v0.167.14** | 2026-11-20 | — | `16-securite/25-openbao-infisical` |
| [Bitwarden self-hosted (clients open source)](https://github.com/bitwarden/server/releases/tag/v2026.11.0) | v2026.10.1 | **v2026.11.0** | 2026-11-18 | — | `21-outils/03-cybersecurite/06-keepassxc-bitwarden` |
| [ClamAV](https://github.com/Cisco-Talos/clamav/releases/tag/clamav-1.5.5) | clamav-1.5.4 | **clamav-1.5.5** | 2026-11-18 | 🔒 sécurité | `16-securite/04-clamav` |
| [Pulumi](https://github.com/pulumi/pulumi/releases/tag/v3.277.0) | v3.276.0 | **v3.277.0** | 2026-11-18 | — | `17-automatisation/09-pulumi` |
| [Huginn](https://github.com/huginn/huginn/releases/tag/v2026.11.19) | v2026.11.09 | **v2026.11.19** | 2026-11-19 | 🔒 sécurité | `17-automatisation/18-workflows-low-code` |
| [n8n (source available/community)](https://github.com/n8n-io/n8n/releases/tag/n8n%402.48.7) | n8n@2.47.7 | **n8n@2.48.7** | 2026-11-20 | — | `21-outils/05-ia-productivite/06-n8n` |
| [Node-RED](https://github.com/node-red/node-red/releases/tag/5.0.10) | 5.0.9 | **5.0.10** | 2026-11-17 | — | `17-automatisation/18-workflows-low-code` |
| [Windmill (community)](https://github.com/windmill-labs/windmill/releases/tag/v1.881.1) | v1.875.0 | **v1.881.1** | 2026-11-21 | — | `17-automatisation/18-workflows-low-code` |
| [Kestra](https://github.com/kestra-io/kestra/releases/tag/v2.0.11) | v2.0.10 | **v2.0.11** | 2026-11-17 | 🔒 sécurité ⚠️ changements | `17-automatisation/19-orchestration-donnees` |
| [Prefect](https://github.com/PrefectHQ/prefect/releases/tag/3.9.4) | 3.9.3 | **3.9.4** | 2026-11-19 | — | `17-automatisation/19-orchestration-donnees` |
| [Dagster](https://github.com/dagster-io/dagster/releases/tag/1.13.31) | 1.13.30 | **1.13.31** | 2026-11-19 | ⚠️ changements | `17-automatisation/19-orchestration-donnees` |
| [Mattermost Team Edition](https://github.com/mattermost/mattermost/releases/tag/v12.1.0) | v12.0.2 | **v12.1.0** | 2026-11-05 | — | `10-messagerie/12-mattermost` |
| [Zulip](https://github.com/zulip/zulip/releases/tag/13.3) | 13.2 | **13.3** | 2026-11-19 | — | `10-messagerie/14-zulip` |
| [MongooseIM](https://github.com/esl/MongooseIM/releases/tag/6.11.0) | 6.10.0 | **6.11.0** | 2026-11-19 | ⚠️ changements | `10-messagerie/15-xmpp` |
| [Chatwoot](https://github.com/chatwoot/chatwoot/releases/tag/v4.20.1) | v4.19.1 | **v4.20.1** | 2026-11-20 | 🔒 sécurité | `21-outils/06-support-parc` |
| [FreeScout](https://github.com/freescout-help-desk/freescout/releases/tag/1.8.252) | 1.8.251 | **1.8.252** | 2026-11-21 | — | `21-outils/06-support-parc` |
| [Plane (community)](https://github.com/makeplane/plane/releases/tag/v1.5.0) | v1.4.3 | **v1.5.0** | 2026-11-16 | 🔒 sécurité ⚠️ changements | `10-messagerie/16-gestion-projet` |
| [Leantime](https://github.com/Leantime/leantime/releases/tag/v3.15.3) | v3.15.0 | **v3.15.3** | 2026-11-16 | ⚠️ changements | `10-messagerie/16-gestion-projet` |
| [Kanboard](https://github.com/kanboard/kanboard/releases/tag/v1.2.58) | v1.2.57 | **v1.2.58** | 2026-11-21 | 🔒 sécurité ⚠️ changements | `10-messagerie/16-gestion-projet` |
| [Wekan](https://github.com/wekan/wekan/releases/tag/v13.27) | v13.13 | **v13.27** | 2026-11-22 | ⚠️ changements | `10-messagerie/16-gestion-projet` |
| [Outline](https://github.com/outline/outline/releases/tag/v1.13.0) | v1.12.0 | **v1.13.0** | 2026-11-15 | 🔒 sécurité ⚠️ changements | `10-messagerie/17-wikis` |
| [Wiki.js](https://github.com/requarks/wiki/releases/tag/3.5.0) | 3.4.0 | **3.5.0** | 2026-11-20 | — | `10-messagerie/17-wikis` |
| [MediaWiki](https://github.com/wikimedia/mediawiki/releases/tag/1.46.3) | 1.46.2 | **1.46.3** |  | — | `10-messagerie/17-wikis` |
| [Etherpad](https://github.com/ether/etherpad/releases/tag/v3.3.21) | v3.3.17 | **v3.3.21** | 2026-11-20 | 🔒 sécurité ⚠️ changements | `10-messagerie/18-edition-collaborative` |
| [Radicale](https://github.com/Kozea/Radicale/releases/tag/v3.9.2) | v3.9.1 | **v3.9.2** | 2026-11-17 | — | `10-messagerie/08-radicale` |
| [Mailu](https://github.com/Mailu/Mailu/releases/tag/2024.06.72) | 2024.06.68 | **2024.06.72** | 2026-11-22 | — | `10-messagerie/20-suites-messagerie` |
| [SnappyMail](https://github.com/the-djmaze/snappymail/releases/tag/v3.1.4) | v3.0.1 | **v3.1.4** | 2026-11-20 | ⚠️ changements | `10-messagerie/21-webmail` |
| [WordPress](https://github.com/WordPress/WordPress/releases/tag/7.1.5) | 7.1.4 | **7.1.5** | 2026-11-18 | — | `25-web-cms-portails/01-wordpress` |
| [Drupal](https://github.com/drupal/drupal/releases/tag/11.4.13) | 11.4.12 | **11.4.13** | 2026-11-18 | — | `25-web-cms-portails/02-drupal-joomla` |
| [Ghost](https://github.com/TryGhost/Ghost/releases/tag/v6.78.0) | v6.77.0 | **v6.78.0** | 2026-11-17 | — | `25-web-cms-portails/04-ghost-grav-october` |
| [Grav](https://github.com/getgrav/grav/releases/tag/2.2.32) | 2.2.29 | **2.2.32** | 2026-11-20 | — | `25-web-cms-portails/04-ghost-grav-october` |
| [TYPO3](https://github.com/TYPO3/typo3/releases/tag/v14.3.12) | v14.3.11 | **v14.3.12** | 2026-11-17 | — | `25-web-cms-portails/03-typo3-contao` |
| [Strapi](https://github.com/strapi/strapi/releases/tag/v5.63.0) | v5.62.0 | **v5.63.0** | 2026-11-18 | ⚠️ changements | `25-web-cms-portails/05-cms-headless-python` |
| [Directus](https://github.com/directus/directus/releases/tag/v12.7.0) | v12.6.1 | **v12.7.0** | 2026-11-18 | ⚠️ changements | `25-web-cms-portails/05-cms-headless-python` |
| [Payload CMS](https://github.com/payloadcms/payload/releases/tag/v3.94.1) | v3.93.0 | **v3.94.1** | 2026-11-20 | 🔒 sécurité | `25-web-cms-portails/05-cms-headless-python` |
| [Sanity Studio (source available)](https://github.com/sanity-io/sanity/releases/tag/v6.24.0) | v6.23.0 | **v6.24.0** | 2026-11-17 | ⚠️ changements | `25-web-cms-portails/05-cms-headless-python` |
| [ILIAS](https://github.com/ILIAS-eLearning/ILIAS/releases/tag/v11.6) | v11.5 | **v11.6** | 2026-11-17 | 🔒 sécurité | `25-web-cms-portails/07-lms` |
| [Frappe Framework](https://github.com/frappe/frappe/releases/tag/v16.60.2) | v15.126.1 | **v16.60.2** | 2026-11-18 | — | `25-web-cms-portails/08-erp` |
| [Invoice Ninja (community)](https://github.com/invoiceninja/invoiceninja/releases/tag/v5.13.56) | v5.13.53 | **v5.13.56** | 2026-11-20 | — | `25-web-cms-portails/09-facturation-temps` |
| [Akaunting (community)](https://github.com/akaunting/akaunting/releases/tag/3.3.2) | 3.3.1 | **3.3.2** | 2026-11-20 | — | `25-web-cms-portails/09-facturation-temps` |
| [Kimai](https://github.com/kimai/kimai/releases/tag/2.72.1) | 2.72.0 | **2.72.1** | 2026-11-20 | — | `25-web-cms-portails/09-facturation-temps` |
| [WooCommerce](https://github.com/woocommerce/woocommerce/releases/tag/11.3.1) | 11.3.0 | **11.3.1** | 2026-11-19 | — | `25-web-cms-portails/10-ecommerce` |
| [Saleor](https://github.com/saleor/saleor/releases/tag/3.23.50) | 3.23.49 | **3.23.50** | 2026-11-17 | — | `25-web-cms-portails/10-ecommerce` |
| [Medusa](https://github.com/medusajs/medusa/releases/tag/v2.23.0) | v2.22.7 | **v2.23.0** | 2026-11-20 | ⚠️ changements | `25-web-cms-portails/10-ecommerce` |
| [Sylius](https://github.com/Sylius/Sylius/releases/tag/v2.3.3) | v2.3.2 | **v2.3.3** | 2026-11-18 | 🔒 sécurité ⚠️ changements | `25-web-cms-portails/10-ecommerce` |
| [Shopware Community](https://github.com/shopware/shopware/releases/tag/v6.7.16.1) | v6.7.16.0 | **v6.7.16.1** | 2026-11-18 | 🔒 sécurité ⚠️ changements | `25-web-cms-portails/10-ecommerce` |
| [Bagisto](https://github.com/bagisto/bagisto/releases/tag/v2.5.2) | v2.5.1 | **v2.5.2** | 2026-11-18 | ⚠️ changements | `25-web-cms-portails/10-ecommerce` |
| [Spree Commerce](https://github.com/spree/spree/releases/tag/v6.0.5) | v6.0.4 | **v6.0.5** | 2026-11-16 | ⚠️ changements | `25-web-cms-portails/10-ecommerce` |
| [OpenBoxes](https://github.com/openboxes/openboxes/releases/tag/v0.9.9-hotfix1) | v0.9.9 | **v0.9.9-hotfix1** | 2026-11-21 | — | `25-web-cms-portails/11-caisse-inventaire` |
| [Inventree](https://github.com/inventree/InvenTree/releases/tag/1.7.3) | 1.7.2 | **1.7.3** | 2026-11-17 | 🔒 sécurité | `25-web-cms-portails/11-caisse-inventaire` |
| [Snipe-IT](https://github.com/grokability/snipe-it/releases/tag/v8.8.4) | v8.8.3 | **v8.8.4** | 2026-11-20 | 🔒 sécurité | `25-web-cms-portails/11-caisse-inventaire` |
| [Gitea](https://github.com/go-gitea/gitea/releases/tag/v28.4.0) | v28.3.0 | **v28.4.0** | 2026-11-15 | 🔒 sécurité | `14-devops/03-gitea` |
| [GitLab Community Edition](https://endoflife.date/gitlab) | 19.5.5 | **19.6.1** | 2026-11-19 | — | `14-devops/02-gitlab` |
| [OneDev](https://github.com/theonedev/onedev/releases/tag/v17.2.2) | v17.2.0 | **v17.2.2** | 2026-11-19 | ⚠️ changements | `14-devops/13-forges-revue-vcs` |
| [Verdaccio](https://github.com/verdaccio/verdaccio/releases/tag/v7.1.2) | v7.1.0 | **v7.1.2** | 2026-11-18 | ⚠️ changements | `14-devops/14-registres-artefacts` |
| [Semgrep CE](https://github.com/semgrep/semgrep/releases/tag/v1.186.0) | v1.185.0 | **v1.186.0** | 2026-11-18 | ⚠️ changements | `14-devops/15-analyse-code` |
| [CodeQL CLI (license restrictions)](https://github.com/github/codeql-cli-binaries/releases/tag/v2.27.5) | v2.27.4 | **v2.27.5** | 2026-11-19 | 🔒 sécurité ⚠️ changements | `14-devops/15-analyse-code` |
| [Ruff](https://github.com/astral-sh/ruff/releases/tag/0.17.6) | 0.17.5 | **0.17.6** | 2026-11-19 | — | `14-devops/15-analyse-code` |
| [Grype](https://github.com/anchore/grype/releases/tag/v0.122.1) | v0.121.3 | **v0.122.1** | 2026-11-18 | — | `14-devops/16-chaine-approvisionnement` |
| [Syft](https://github.com/anchore/syft/releases/tag/v1.57.2) | v1.57.1 | **v1.57.2** | 2026-11-16 | 🔒 sécurité ⚠️ changements | `14-devops/16-chaine-approvisionnement` |
| [Renovate](https://github.com/renovatebot/renovate/releases/tag/44.257.9) | 44.239.1 | **44.257.9** | 2026-11-21 | — | `14-devops/17-dependances-modernisation` |
| [Mend Renovate CLI](https://github.com/mend/renovate-ce-ee/releases/tag/15.12.0) | 15.11.0 | **15.12.0** | 2026-11-18 | — | `14-devops/17-dependances-modernisation` |
| [OpenRewrite](https://github.com/openrewrite/rewrite/releases/tag/v8.113.2) | v8.108.1 | **v8.113.2** | 2026-11-20 | ⚠️ changements | `14-devops/17-dependances-modernisation` |
| [ReportPortal](https://github.com/reportportal/reportportal/releases/tag/26.1) | 26.0.7 | **26.1** | 2026-11-20 | ⚠️ changements | `14-devops/18-tests` |
| [Gatling (core)](https://github.com/gatling/gatling/releases/tag/v3.16.1) | v3.16.0 | **v3.16.1** | 2026-11-16 | — | `14-devops/18-tests` |
| [WinSW](https://github.com/winsw/winsw/releases/tag/v2.13.0) | v2.12.0 | **v2.13.0** | 2026-11-15 | ⚠️ changements | `26-gestion-parc/01-outils-windows` |
| [Rufus (open source)](https://github.com/pbatard/rufus/releases/tag/v4.16) | v4.15 | **v4.16** | 2026-11-17 | 🔒 sécurité | `26-gestion-parc/03-supports-deploiement` |
| [AutoHotkey](https://github.com/AutoHotkey/AutoHotkey/releases/tag/v2.0.32) | v2.0.31 | **v2.0.32** | 2026-11-20 | — | `26-gestion-parc/05-automatisation-poste` |
| [Homebrew](https://github.com/Homebrew/brew/releases/tag/7.0.15) | 7.0.13 | **7.0.15** | 2026-11-19 | — | `21-outils/08-gestionnaires-paquets` |
| [Nix](https://github.com/NixOS/nix/releases/tag/2.36.0) | 2.35.6 | **2.36.0** |  | — | `21-outils/08-gestionnaires-paquets` |
| [Mailpit](https://github.com/axllent/mailpit/releases/tag/v1.34.0) | v1.33.1 | **v1.34.0** | 2026-11-17 | 🔒 sécurité ⚠️ changements | `10-messagerie/07-mailpit` |
| [RabbitMQ](https://github.com/rabbitmq/rabbitmq-server/releases/tag/v4.4.1) | v4.4.0 | **v4.4.1** | 2026-11-16 | ⚠️ changements | `12-recherche-messages/03-rabbitmq` |
| [Mosquitto](https://github.com/eclipse/mosquitto/releases/tag/v2.1.4) | v2.1.2 | **v2.1.4** |  | — | `12-recherche-messages/05-mosquitto` |
| [Ollama](https://github.com/ollama/ollama/releases/tag/v0.40.17) | v0.40.16 | **v0.40.17** | 2026-11-10 | ⚠️ changements | `21-outils/05-ia-productivite/04-ollama-open-webui` |
| [Open WebUI](https://github.com/open-webui/open-webui/releases/tag/v0.13.4) | v0.13.3 | **v0.13.4** | 2026-11-17 | — | `21-outils/05-ia-productivite/04-ollama-open-webui` |
| [Joplin Server](https://github.com/laurent22/joplin/releases/tag/v3.7.24) | v3.7.22 | **v3.7.24** | 2026-11-19 | 🔒 sécurité | `10-messagerie/09-joplin-server` |
| [iperf3](https://github.com/esnet/iperf/releases/tag/3.22.1) | 3.22 | **3.22.1** | 2026-11-20 | — | `21-outils/02-reseau-diagnostic/05-iperf3` |

### Fins de support proches

| Service | Version | Fin de support | Fiche |
| --- | --- | --- | --- |
| Docker Engine | 25.0 | 2026-12-04 | `13-conteneurs/01-docker` |
| FreeBSD | 14.4 | 2026-12-31 | `24-systemes-exploitation/09-bsd` |
| Fedora Server | 43 | 2026-12-01 | `24-systemes-exploitation/02-famille-red-hat` |
| NixOS | 26.05 | 2026-12-31 | `24-systemes-exploitation/07-nixos` |
| HAProxy | 3.3 | 2027-01-01 | `07-proxy-cache/01-haproxy` |
| PHP | 8.2 | 2026-12-31 | `05-web/05-php-fpm` |
| MariaDB Server | 13.0 | 2026-12-31 | `11-bases-de-donnees/01-mariadb-mysql` |
| CockroachDB | 26.3 | 2027-02-19 | `11-bases-de-donnees/12-sql-distribue` |
| Redis | 8.0 | 2026-12-01 | `11-bases-de-donnees/04-redis` |
| Nextcloud | 33 | 2027-02-28 | `09-fichiers-partage/08-nextcloud` |
| Kubernetes | 1.35 | 2027-02-28 | `13-conteneurs/04-kubernetes` |
| Grafana OSS | 13.1 | 2027-03-20 | `06-supervision/03-grafana` |
| Grafana OSS | 13.0 | 2027-01-09 | `06-supervision/03-grafana` |
| Zabbix | 6.0 | 2027-02-28 | `06-supervision/04-zabbix` |
| Ansible | 2.19 | 2026-11-30 | `17-automatisation/01-ansible` |
| Drupal | 11.3 | 2026-12-09 | `25-web-cms-portails/02-drupal-joomla` |
| Drupal | 10.6 | 2026-12-09 | `25-web-cms-portails/02-drupal-joomla` |
| GitLab Community Edition | 19.6 | 2027-02-18 | `14-devops/02-gitlab` |
| GitLab Community Edition | 19.5 | 2027-01-21 | `14-devops/02-gitlab` |
| GitLab Community Edition | 19.4 | 2026-12-17 | `14-devops/02-gitlab` |
| RabbitMQ | 4.3 | 2027-01-31 | `12-recherche-messages/03-rabbitmq` |

<details><summary>Sources en erreur (7)</summary>

- GCC : endoflife.date 404 (gcc)
- Tuleap Community : GitHub 404 (Enalean/tuleap, étiquettes)
- MSYS2 : aucune version publiée (msys2/MSYS2-packages)
- Open-AudIT : GitHub 404 (Open-AudIT/Open-AudIT, étiquettes)
- Actiona : GitHub 404 (actiona/actiona, étiquettes)
- OpenRC : aucune version publiée (OpenRC/openrc)
- Oh My Zsh : aucune version publiée (ohmyzsh/ohmyzsh)

</details>

L'agent IA prépare une demande de fusion avec les mises à jour des fiches concernées (si la clé de l'agent est configurée). Rien n'est publié sans validation de JK-ASFC.
