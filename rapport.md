## Rapport de veille du 2026-11-15

| Sources suivies | Nouvelles versions | Correctifs de sécurité | Changements à vérifier | Fins de vie < 120 j | Erreurs |
| --- | --- | --- | --- | --- | --- |
| 590 | 147 | 43 | 51 | 20 | 8 |

### Nouvelles versions

| Service | Avant | Maintenant | Date | Alertes | Fiche |
| --- | --- | --- | --- | --- | --- |
| [Podman](https://github.com/podman-container-tools/podman/releases/tag/v6.2.0) | v6.1.4 | **v6.2.0** | 2026-11-10 | 🔒 sécurité ⚠️ changements | `13-conteneurs/02-podman` |
| [Firecracker](https://github.com/firecracker-microvm/firecracker/releases/tag/v1.18.0) | v1.17.0 | **v1.18.0** | 2026-11-09 | — | `13-conteneurs/22-runtimes-isoles` |
| [YunoHost](https://github.com/YunoHost/yunohost/releases/tag/debian/12.1.42) | debian/12.1.41.2 | **debian/12.1.42** | 2026-11-15 | — | `31-auto-hebergement/01-plateformes-auto-hebergement` |
| [FreeIPA](https://github.com/freeipa/freeipa/releases/tag/release-4-13-5) | release-4-13-4 | **release-4-13-5** |  | — | `01-annuaire-identite/03-freeipa` |
| [Kanidm](https://github.com/kanidm/kanidm/releases/tag/v1.12.1) | v1.12.0 | **v1.12.1** | 2026-11-13 | 🔒 sécurité | `01-annuaire-identite/14-kanidm` |
| [Zitadel](https://github.com/zitadel/zitadel/releases/tag/v4.20.3) | v4.20.1 | **v4.20.3** | 2026-11-13 | ⚠️ changements | `01-annuaire-identite/19-plateformes-iam` |
| [Casdoor](https://github.com/casdoor/casdoor/releases/tag/v4.29.0) | v4.26.0 | **v4.29.0** | 2026-11-15 | — | `01-annuaire-identite/19-plateformes-iam` |
| [Pi-hole](https://github.com/pi-hole/pi-hole/releases/tag/v6.6) | v6.5 | **v6.6** | 2026-11-11 | 🔒 sécurité ⚠️ changements | `02-dns/09-dns-filtrants` |
| [Blocky](https://github.com/0xERR0R/blocky/releases/tag/v0.36.0) | v0.35.0 | **v0.36.0** | 2026-11-09 | — | `02-dns/09-dns-filtrants` |
| [NetBox](https://github.com/netbox-community/netbox/releases/tag/v4.7.5) | v4.7.4 | **v4.7.5** | 2026-11-10 | — | `18-infrastructure-systeme/08-netbox-nautobot` |
| [Nautobot](https://github.com/nautobot/nautobot/releases/tag/v3.2.9) | v3.2.8 | **v3.2.9** | 2026-11-09 | 🔒 sécurité ⚠️ changements | `18-infrastructure-systeme/08-netbox-nautobot` |
| [Ralph](https://github.com/allegro/ralph/releases/tag/20261112.1) | 20261106.1 | **20261112.1** | 2026-11-12 | ⚠️ changements | `18-infrastructure-systeme/10-ipam-dcim-alternatives` |
| [OpenWISP](https://github.com/openwisp/openwisp-controller/releases/tag/1.3.3) | 1.3.2 | **1.3.3** | 2026-11-12 | — | `22-constructeurs/29-openwrt-openwisp` |
| [Tailscale (client open source)](https://github.com/tailscale/tailscale/releases/tag/v1.104.7) | v1.104.5 | **v1.104.7** | 2026-11-12 | — | `08-acces-distant-vpn/05-tailscale-headscale` |
| [NetBird](https://github.com/netbirdio/netbird/releases/tag/v0.83.1) | v0.82.0 | **v0.83.1** | 2026-11-13 | — | `08-acces-distant-vpn/11-netbird-nebula` |
| [Traefik Proxy](https://github.com/traefik/traefik/releases/tag/v3.7.19) | v3.7.17 | **v3.7.19** | 2026-11-13 | — | `07-proxy-cache/04-traefik` |
| [Apache APISIX](https://github.com/apache/apisix/releases/tag/3.20.0) | 3.19.0 | **3.20.0** | 2026-11-11 | — | `07-proxy-cache/11-kong-apisix` |
| [KrakenD Community](https://github.com/krakend/krakend-ce/releases/tag/v3.0.4) | v3.0.3 | **v3.0.4** | 2026-11-12 | — | `07-proxy-cache/12-passerelles-api-alternatives` |
| [Node.js](https://github.com/nodejs/node/releases/tag/v27.0.0-alpha.0.1.0) | v26.13.0 | **v27.0.0-alpha.0.1.0** | 2026-11-12 | ⚠️ changements | `05-web/06-nodejs` |
| [Rust](https://github.com/rust-lang/rust/releases/tag/1.100.0) | 1.99.1 | **1.100.0** | 2026-11-12 | ⚠️ changements | `05-web/17-rust` |
| [.NET SDK](https://endoflife.date/dotnet) | 10.0.13 | **11.0.0** | 2026-11-10 | — | `05-web/18-dotnet-mono` |
| [PowerShell](https://github.com/PowerShell/PowerShell/releases/tag/v7.7.0) | v7.6.9 | **v7.7.0** | 2026-11-10 | — | `05-web/19-powershell` |
| [CMake](https://github.com/Kitware/CMake/releases/tag/v4.5.0) | v4.4.5 | **v4.5.0** | 2026-11-12 | — | `30-developpement-api/02-cmake-ninja-meson` |
| [Apache Tomcat](https://endoflife.date/tomcat) | 11.0.27 | **11.0.29** | 2026-11-09 | — | `05-web/10-tomcat` |
| [Eclipse Jetty](https://github.com/jetty/jetty.project/releases/tag/jetty-12.1.15) | jetty-12.1.14 | **jetty-12.1.15** | 2026-11-10 | 🔒 sécurité | `05-web/22-serveurs-jakarta-ee` |
| [Payara Community](https://github.com/payara/Payara/releases/tag/payara-server-7.2026.11) | payara-server-7.2026.10 | **payara-server-7.2026.11** | 2026-11-11 | 🔒 sécurité | `05-web/22-serveurs-jakarta-ee` |
| [Jenkins](https://github.com/jenkinsci/jenkins/releases/tag/jenkins-2.590) | jenkins-2.580.2 | **jenkins-2.590** | 2026-11-10 | ⚠️ changements | `14-devops/05-jenkins` |
| [PostgreSQL](https://endoflife.date/postgresql) | 18.6 | **18.7** | 2026-11-09 | — | `11-bases-de-donnees/02-postgresql` |
| [TimescaleDB](https://github.com/timescale/timescaledb/releases/tag/2.32.0) | 2.31.0 | **2.32.0** | 2026-11-12 | 🔒 sécurité | `11-bases-de-donnees/13-extensions-postgresql` |
| [QuestDB](https://github.com/questdb/questdb/releases/tag/10.2.0) | 10.1.0 | **10.2.0** | 2026-11-10 | ⚠️ changements | `11-bases-de-donnees/14-questdb` |
| [MongoDB Community Server](https://endoflife.date/mongodb) | 9.0.4 | **9.0.8** | 2026-11-11 | — | `11-bases-de-donnees/03-mongodb` |
| [SurrealDB](https://github.com/surrealdb/surrealdb/releases/tag/v4.0.1) | v4.0.0 | **v4.0.1** | 2026-11-09 | — | `11-bases-de-donnees/21-multi-modeles` |
| [TerminusDB](https://github.com/terminusdb/terminusdb/releases/tag/v12.1.0-rc3) | v12.1.0-rc2 | **v12.1.0-rc3** | 2026-11-14 | ⚠️ changements | `11-bases-de-donnees/23-terminusdb-xtdb` |
| [NFS-Ganesha](https://github.com/nfs-ganesha/nfs-ganesha/releases/tag/V15.12) | V15.11 | **V15.12** | 2026-11-13 | — | `09-fichiers-partage/02-nfs` |
| [SeaweedFS](https://github.com/seaweedfs/seaweedfs/releases/tag/4.53) | 4.52 | **4.53** | 2026-11-08 | — | `09-fichiers-partage/32-stockage-objet` |
| [Nextcloud](https://github.com/nextcloud/server/releases/tag/v33.0.11) | v33.0.10 | **v33.0.11** | 2026-11-12 | — | `09-fichiers-partage/08-nextcloud` |
| [Talos Linux](https://github.com/siderolabs/talos/releases/tag/v1.14.6) | v1.14.5 | **v1.14.6** | 2026-11-11 | — | `13-conteneurs/25-talos-linux` |
| [OpenShift OKD](https://github.com/okd-project/okd/releases/tag/5.0.0-okd-scos.7) | 5.0.0-okd-scos.5 | **5.0.0-okd-scos.7** | 2026-11-14 | — | `13-conteneurs/27-openshift-okd` |
| [Helm](https://github.com/helm/helm/releases/tag/v4.3.2) | v4.3.1 | **v4.3.2** | 2026-11-13 | — | `13-conteneurs/29-helm-kustomize` |
| [Kyverno](https://github.com/kyverno/kyverno/releases/tag/v1.20.0) | v1.19.2 | **v1.20.0** | 2026-11-12 | 🔒 sécurité | `13-conteneurs/40-politiques-opa-kyverno` |
| [Docker Compose](https://github.com/docker/compose/releases/tag/v5.7.1) | v5.7.0 | **v5.7.1** | 2026-11-11 | ⚠️ changements | `13-conteneurs/01-docker` |
| [Grafana OSS](https://github.com/grafana/grafana/releases/tag/v13.3.1) | v13.3.0 | **v13.3.1** | 2026-11-10 | 🔒 sécurité | `06-supervision/03-grafana` |
| [VictoriaMetrics](https://github.com/VictoriaMetrics/VictoriaMetrics/releases/tag/v1.156.0) | v1.155.0 | **v1.156.0** | 2026-11-09 | ⚠️ changements | `06-supervision/13-stockage-metriques-long-terme` |
| [Mimir](https://github.com/grafana/mimir/releases/tag/mimir-3.2.5) | mimir-3.2.4 | **mimir-3.2.5** | 2026-11-13 | — | `06-supervision/13-stockage-metriques-long-terme` |
| [Alertmanager](https://github.com/prometheus/alertmanager/releases/tag/v0.35.0) | v0.34.2 | **v0.35.0** | 2026-11-09 | ⚠️ changements | `06-supervision/02-prometheus` |
| [Cockpit](https://github.com/cockpit-project/cockpit/releases/tag/372) | 371 | **372** | 2026-11-10 | 🔒 sécurité | `06-supervision/15-glances-cockpit` |
| [Loki](https://github.com/grafana/loki/releases/tag/v3.7.10) | v3.7.9 | **v3.7.10** | 2026-11-13 | — | `15-journalisation/09-loki-promtail` |
| [Grafana Alloy](https://github.com/grafana/alloy/releases/tag/v1.22.0) | v1.21.3 | **v1.22.0** | 2026-11-13 | ⚠️ changements | `06-supervision/17-opentelemetry-alloy` |
| [Fluent Bit](https://github.com/fluent/fluent-bit/releases/tag/v5.2.0) | v5.1.5 | **v5.2.0** | 2026-11-09 | — | `15-journalisation/03-fluent-bit` |
| [Wazuh](https://github.com/wazuh/wazuh/releases/tag/v4.14.10) | v4.14.9 | **v4.14.10** | 2026-11-09 | 🔒 sécurité | `15-journalisation/05-wazuh` |
| [SigNoz](https://github.com/SigNoz/signoz/releases/tag/v0.150.0) | v0.149.0 | **v0.150.0** | 2026-11-13 | ⚠️ changements | `06-supervision/19-observabilite-unifiee` |
| [Uptime Kuma](https://github.com/louislam/uptime-kuma/releases/tag/2.5.11) | 2.5.9 | **2.5.11** | 2026-11-12 | 🔒 sécurité | `06-supervision/21-disponibilite-pages-statut` |
| [MISP](https://github.com/MISP/MISP/releases/tag/v2.5.51) | v2.5.50 | **v2.5.51** | 2026-11-11 | ⚠️ changements | `16-securite/14-reponse-incident-cti` |
| [OpenCTI](https://github.com/OpenCTI-Platform/opencti/releases/tag/7.261109.0) | 7.261106.0 | **7.261109.0** | 2026-11-09 | ⚠️ changements | `16-securite/14-reponse-incident-cti` |
| [OpenVAS](https://github.com/greenbone/openvas-scanner/releases/tag/v23.52.12) | v23.52.9 | **v23.52.12** | 2026-11-12 | — | `21-outils/02-reseau-diagnostic/08-greenbone-openvas` |
| [Certbot](https://github.com/certbot/certbot/releases/tag/v5.10.0) | v5.9.0 | **v5.10.0** | 2026-11-10 | — | `16-securite/20-acme-certbot` |
| [Vault (open source core)](https://github.com/hashicorp/vault/releases/tag/v2.2.2) | v2.2.1 | **v2.2.2** | 2026-11-12 | 🔒 sécurité ⚠️ changements | `01-annuaire-identite/07-vault` |
| [Infisical (open source core)](https://github.com/Infisical/infisical/releases/tag/v0.167.10) | v0.167.6 | **v0.167.10** | 2026-11-13 | — | `16-securite/25-openbao-infisical` |
| [Passbolt Community](https://github.com/passbolt/passbolt_api/releases/tag/v5.18.0) | v5.17.0 | **v5.18.0** | 2026-11-12 | 🔒 sécurité ⚠️ changements | `16-securite/26-passbolt-psono` |
| [Semaphore UI](https://github.com/semaphoreui/semaphore/releases/tag/v2.20.23) | v2.19.18 | **v2.20.23** | 2026-11-10 | — | `17-automatisation/06-awx-semaphore` |
| [Terraform](https://github.com/hashicorp/terraform/releases/tag/v1.17.2) | v1.17.1 | **v1.17.2** | 2026-11-11 | — | `17-automatisation/04-terraform` |
| [Pulumi](https://github.com/pulumi/pulumi/releases/tag/v3.276.0) | v3.274.1 | **v3.276.0** | 2026-11-12 | — | `17-automatisation/09-pulumi` |
| [Terragrunt](https://github.com/gruntwork-io/terragrunt/releases/tag/v1.2.2) | v1.2.1 | **v1.2.2** | 2026-11-11 | ⚠️ changements | `17-automatisation/10-terragrunt-terramate` |
| [Terramate](https://github.com/terramate-io/terramate/releases/tag/v0.17.4) | v0.17.3 | **v0.17.4** | 2026-11-09 | — | `17-automatisation/10-terragrunt-terramate` |
| [Huginn](https://github.com/huginn/huginn/releases/tag/v2026.11.09) | v2026.11.05.2 | **v2026.11.09** | 2026-11-09 | 🔒 sécurité ⚠️ changements | `17-automatisation/18-workflows-low-code` |
| [n8n (source available/community)](https://github.com/n8n-io/n8n/releases/tag/n8n%402.47.7) | n8n@2.46.6 | **n8n@2.47.7** | 2026-11-13 | — | `21-outils/05-ia-productivite/06-n8n` |
| [Activepieces (community)](https://github.com/activepieces/activepieces/releases/tag/0.93.0) | 0.92.3-hotfix.2 | **0.93.0** | 2026-11-08 | ⚠️ changements | `17-automatisation/18-workflows-low-code` |
| [Windmill (community)](https://github.com/windmill-labs/windmill/releases/tag/v1.875.0) | v1.864.1 | **v1.875.0** | 2026-11-14 | — | `17-automatisation/18-workflows-low-code` |
| [Kestra](https://github.com/kestra-io/kestra/releases/tag/v2.0.10) | v2.0.9 | **v2.0.10** | 2026-11-10 | 🔒 sécurité ⚠️ changements | `17-automatisation/19-orchestration-donnees` |
| [Prefect](https://github.com/PrefectHQ/prefect/releases/tag/3.9.3) | 3.9.2 | **3.9.3** | 2026-11-13 | — | `17-automatisation/19-orchestration-donnees` |
| [Dagster](https://github.com/dagster-io/dagster/releases/tag/1.13.30) | 1.13.29 | **1.13.30** | 2026-11-12 | ⚠️ changements | `17-automatisation/19-orchestration-donnees` |
| [Matrix Synapse](https://github.com/element-hq/synapse/releases/tag/v1.165.0) | v1.164.2 | **v1.165.0** | 2026-11-10 | — | `10-messagerie/11-matrix` |
| [Rocket.Chat Community](https://github.com/RocketChat/Rocket.Chat/releases/tag/9.0.0) | 8.9.1 | **9.0.0** | 2026-11-10 | 🔒 sécurité ⚠️ changements | `10-messagerie/13-rocketchat` |
| [Zulip](https://github.com/zulip/zulip/releases/tag/13.2) | 12.4 | **13.2** | 2026-11-13 | — | `10-messagerie/14-zulip` |
| [Galène](https://github.com/jech/galene/releases/tag/galene-1.2.2) | galene-1.2.1 | **galene-1.2.2** |  | — | `23-telephonie-ip/16-visioconference` |
| [Zammad](https://github.com/zammad/zammad/releases/tag/7.2.3) | 7.2.2 | **7.2.3** |  | — | `21-outils/06-support-parc/06-zammad` |
| [FreeScout](https://github.com/freescout-help-desk/freescout/releases/tag/1.8.251) | 1.8.250 | **1.8.251** | 2026-11-14 | — | `21-outils/06-support-parc` |
| [GLPI](https://github.com/glpi-project/glpi/releases/tag/12.0.2) | 12.0.1 | **12.0.2** | 2026-11-12 | 🔒 sécurité | `21-outils/06-support-parc/04-glpi-installation` |
| [OpenProject](https://github.com/opf/openproject/releases/tag/v17.9.7) | v17.9.6 | **v17.9.7** | 2026-11-09 | 🔒 sécurité | `10-messagerie/16-gestion-projet` |
| [Leantime](https://github.com/Leantime/leantime/releases/tag/v3.15.0) | v3.13.2 | **v3.15.0** | 2026-11-15 | ⚠️ changements | `10-messagerie/16-gestion-projet` |
| [Wekan](https://github.com/wekan/wekan/releases/tag/v13.13) | v13.01 | **v13.13** | 2026-11-15 | — | `10-messagerie/16-gestion-projet` |
| [AppFlowy](https://github.com/AppFlowy-IO/AppFlowy/releases/tag/0.15.1) | 0.15.0 | **0.15.1** | 2026-11-15 | — | `10-messagerie/17-wikis` |
| [BookStack](https://github.com/BookStackApp/BookStack/releases/tag/v26.09.3) | v26.09.2 | **v26.09.3** | 2026-11-11 | 🔒 sécurité | `21-outils/05-ia-productivite/09-bookstack` |
| [Wiki.js](https://github.com/requarks/wiki/releases/tag/3.4.0) | 3.2.0 | **3.4.0** | 2026-11-15 | 🔒 sécurité | `10-messagerie/17-wikis` |
| [Etherpad](https://github.com/ether/etherpad/releases/tag/v3.3.17) | v3.3.16 | **v3.3.17** | 2026-11-11 | 🔒 sécurité ⚠️ changements | `10-messagerie/18-edition-collaborative` |
| [CryptPad](https://github.com/cryptpad/cryptpad/releases/tag/2026.10.1) | 2026.10.0 | **2026.10.1** | 2026-11-10 | 🔒 sécurité | `10-messagerie/18-edition-collaborative` |
| [Radicale](https://github.com/Kozea/Radicale/releases/tag/v3.9.1) | v3.9.0 | **v3.9.1** | 2026-11-12 | 🔒 sécurité | `10-messagerie/08-radicale` |
| [Mailu](https://github.com/Mailu/Mailu/releases/tag/2024.06.68) | 2024.06.67 | **2024.06.68** | 2026-11-08 | 🔒 sécurité | `10-messagerie/20-suites-messagerie` |
| [Modoboa](https://github.com/modoboa/modoboa/releases/tag/2.13.0) | 2.12.0 | **2.13.0** | 2026-11-13 | 🔒 sécurité | `10-messagerie/20-suites-messagerie` |
| [iRedMail (open source edition)](https://github.com/iredmail/iRedMail/releases/tag/1.8.10) | 1.8.9 | **1.8.10** |  | — | `10-messagerie/20-suites-messagerie` |
| [Rspamd](https://github.com/rspamd/rspamd/releases/tag/4.3.0) | 4.2.3 | **4.3.0** | 2026-11-13 | 🔒 sécurité ⚠️ changements | `10-messagerie/04-rspamd` |
| [Roundcube](https://github.com/roundcube/roundcubemail/releases/tag/1.7.6) | 1.7.5 | **1.7.6** | 2026-11-09 | 🔒 sécurité | `10-messagerie/21-webmail` |
| [SnappyMail](https://github.com/the-djmaze/snappymail/releases/tag/v3.0.1) | v3.0.0 | **v3.0.1** | 2026-11-09 | ⚠️ changements | `10-messagerie/21-webmail` |
| [Ghost](https://github.com/TryGhost/Ghost/releases/tag/v6.77.0) | v6.75.0 | **v6.77.0** | 2026-11-11 | 🔒 sécurité | `25-web-cms-portails/04-ghost-grav-october` |
| [Grav](https://github.com/getgrav/grav/releases/tag/2.2.29) | 2.2.28 | **2.2.29** | 2026-11-11 | 🔒 sécurité ⚠️ changements | `25-web-cms-portails/04-ghost-grav-october` |
| [TYPO3](https://github.com/TYPO3/typo3/releases/tag/v14.3.11) | v14.3.10 | **v14.3.11** | 2026-11-10 | — | `25-web-cms-portails/03-typo3-contao` |
| [Contao](https://github.com/contao/contao/releases/tag/6.0.6) | 6.0.5 | **6.0.6** |  | — | `25-web-cms-portails/03-typo3-contao` |
| [Strapi](https://github.com/strapi/strapi/releases/tag/v5.62.0) | v5.61.0 | **v5.62.0** | 2026-11-12 | 🔒 sécurité ⚠️ changements | `25-web-cms-portails/05-cms-headless-python` |
| [Sanity Studio (source available)](https://github.com/sanity-io/sanity/releases/tag/v6.23.0) | v6.22.0 | **v6.23.0** | 2026-11-10 | — | `25-web-cms-portails/05-cms-headless-python` |
| [Plone](https://github.com/plone/Products.CMFPlone/releases/tag/6.2.3) | 6.2.2 | **6.2.3** |  | — | `25-web-cms-portails/05-cms-headless-python` |
| [Moodle](https://github.com/moodle/moodle/releases/tag/v5.3.1) | v5.3.0 | **v5.3.1** | 2026-11-12 | — | `25-web-cms-portails/07-lms` |
| [ERPNext](https://github.com/frappe/erpnext/releases/tag/v16.55.0) | v16.54.0 | **v16.55.0** | 2026-11-12 | ⚠️ changements | `25-web-cms-portails/08-erp` |
| [Dolibarr](https://github.com/Dolibarr/dolibarr/releases/tag/24.0.3) | 24.0.1 | **24.0.3** | 2026-11-11 | ⚠️ changements | `25-web-cms-portails/08-erp` |
| [Akaunting (community)](https://github.com/akaunting/akaunting/releases/tag/3.3.1) | 3.3.0 | **3.3.1** | 2026-11-11 | ⚠️ changements | `25-web-cms-portails/09-facturation-temps` |
| [Kimai](https://github.com/kimai/kimai/releases/tag/2.72.0) | 2.71.0 | **2.72.0** | 2026-11-13 | 🔒 sécurité ⚠️ changements | `25-web-cms-portails/09-facturation-temps` |
| [PrestaShop](https://github.com/PrestaShop/PrestaShop/releases/tag/9.2.1) | 9.2.0 | **9.2.1** | 2026-11-09 | — | `25-web-cms-portails/10-ecommerce` |
| [WooCommerce](https://github.com/woocommerce/woocommerce/releases/tag/11.3.0) | 11.2.2 | **11.3.0** | 2026-11-11 | — | `25-web-cms-portails/10-ecommerce` |
| [Saleor](https://github.com/saleor/saleor/releases/tag/3.23.49) | 3.23.47 | **3.23.49** | 2026-11-12 | — | `25-web-cms-portails/10-ecommerce` |
| [Medusa](https://github.com/medusajs/medusa/releases/tag/v2.22.7) | v2.22.4 | **v2.22.7** | 2026-11-13 | 🔒 sécurité ⚠️ changements | `25-web-cms-portails/10-ecommerce` |
| [Spree Commerce](https://github.com/spree/spree/releases/tag/v6.0.4) | v6.0.3 | **v6.0.4** | 2026-11-12 | ⚠️ changements | `25-web-cms-portails/10-ecommerce` |
| [Vendure](https://github.com/vendurehq/vendure/releases/tag/v3.8.2) | v3.8.1 | **v3.8.2** | 2026-11-12 | ⚠️ changements | `25-web-cms-portails/10-ecommerce` |
| [Inventree](https://github.com/inventree/InvenTree/releases/tag/1.7.2) | 1.7.1 | **1.7.2** | 2026-11-12 | — | `25-web-cms-portails/11-caisse-inventaire` |
| [Git](https://github.com/git/git/releases/tag/v2.56.1) | v2.56.0 | **v2.56.1** |  | — | `14-devops/01-git` |
| [GitLab Community Edition](https://endoflife.date/gitlab) | 19.5.3 | **19.5.5** | 2026-11-11 | — | `14-devops/02-gitlab` |
| [Gogs](https://github.com/gogs/gogs/releases/tag/v0.14.4) | v0.14.3 | **v0.14.4** | 2026-11-12 | 🔒 sécurité ⚠️ changements | `14-devops/13-forges-revue-vcs` |
| [OneDev](https://github.com/theonedev/onedev/releases/tag/v17.2.0) | v17.1.2 | **v17.2.0** | 2026-11-11 | ⚠️ changements | `14-devops/13-forges-revue-vcs` |
| [Gerrit Code Review](https://github.com/GerritCodeReview/gerrit/releases/tag/v3.15.0) | v3.14.5 | **v3.15.0** |  | — | `14-devops/13-forges-revue-vcs` |
| [Harbor](https://github.com/goharbor/harbor/releases/tag/v2.15.5) | v2.14.6 | **v2.15.5** | 2026-11-12 | — | `14-devops/14-registres-artefacts` |
| [Verdaccio](https://github.com/verdaccio/verdaccio/releases/tag/v7.1.0) | v7.0.2 | **v7.1.0** | 2026-11-08 | ⚠️ changements | `14-devops/14-registres-artefacts` |
| [Semgrep CE](https://github.com/semgrep/semgrep/releases/tag/v1.185.0) | v1.184.0 | **v1.185.0** | 2026-11-10 | 🔒 sécurité ⚠️ changements | `14-devops/15-analyse-code` |
| [ESLint](https://github.com/eslint/eslint/releases/tag/v10.15.0) | v10.14.0 | **v10.15.0** | 2026-11-13 | 🔒 sécurité | `14-devops/15-analyse-code` |
| [Prettier](https://github.com/prettier/prettier/releases/tag/3.10.1) | 3.9.10 | **3.10.1** | 2026-11-12 | — | `14-devops/15-analyse-code` |
| [Ruff](https://github.com/astral-sh/ruff/releases/tag/0.17.5) | 0.17.4 | **0.17.5** | 2026-11-12 | — | `14-devops/15-analyse-code` |
| [Pylint](https://github.com/pylint-dev/pylint/releases/tag/v4.1.4) | v4.1.3 | **v4.1.4** | 2026-11-14 | ⚠️ changements | `14-devops/15-analyse-code` |
| [Grype](https://github.com/anchore/grype/releases/tag/v0.121.3) | v0.121.2 | **v0.121.3** | 2026-11-09 | 🔒 sécurité ⚠️ changements | `14-devops/16-chaine-approvisionnement` |
| [Syft](https://github.com/anchore/syft/releases/tag/v1.57.1) | v1.57.0 | **v1.57.1** | 2026-11-09 | 🔒 sécurité | `14-devops/16-chaine-approvisionnement` |
| [Renovate](https://github.com/renovatebot/renovate/releases/tag/44.239.1) | 44.222.4 | **44.239.1** | 2026-11-13 | — | `14-devops/17-dependances-modernisation` |
| [OpenRewrite](https://github.com/openrewrite/rewrite/releases/tag/v8.108.1) | v8.101.2 | **v8.108.1** | 2026-11-15 | — | `14-devops/17-dependances-modernisation` |
| [k6](https://github.com/grafana/k6/releases/tag/v2.4.0) | v2.3.0 | **v2.4.0** | 2026-11-12 | 🔒 sécurité ⚠️ changements | `14-devops/18-tests` |
| [OWASP Juice Shop](https://github.com/juice-shop/juice-shop/releases/tag/v20.4.0) | v20.3.0 | **v20.4.0** | 2026-11-08 | 🔒 sécurité | `14-devops/18-tests` |
| [PowerShell 7](https://github.com/PowerShell/PowerShell/releases/tag/v7.7.0) | v7.6.9 | **v7.7.0** | 2026-11-10 | — | `05-web/19-powershell` |
| [Windows Terminal](https://github.com/microsoft/terminal/releases/tag/v1.25.3131.0) | v1.25.2733.0 | **v1.25.3131.0** | 2026-11-11 | ⚠️ changements | `26-gestion-parc/01-outils-windows` |
| [FreeRDP](https://github.com/FreeRDP/FreeRDP/releases/tag/3.33.1) | 3.33.0 | **3.33.1** | 2026-11-10 | 🔒 sécurité | `26-gestion-parc/02-bureau-distant` |
| [WSL](https://github.com/microsoft/WSL/releases/tag/3.0.5) | 3.0.3 | **3.0.5** | 2026-11-03 | — | `26-gestion-parc/01-outils-windows` |
| [Git for Windows](https://github.com/git-for-windows/git/releases/tag/v2.56.1.windows.1) | v2.56.0.windows.4 | **v2.56.1.windows.1** | 2026-11-10 | 🔒 sécurité | `26-gestion-parc/01-outils-windows` |
| [FOG Project](https://github.com/FOGProject/fogproject/releases/tag/1.6.0.158) | 1.6.0.14 | **1.6.0.158** | 2026-11-11 | ⚠️ changements | `26-gestion-parc/03-supports-deploiement` |
| [Homebrew](https://github.com/Homebrew/brew/releases/tag/7.0.13) | 7.0.12 | **7.0.13** | 2026-11-09 | 🔒 sécurité ⚠️ changements | `21-outils/08-gestionnaires-paquets` |
| [Nix](https://github.com/NixOS/nix/releases/tag/2.35.6) | 2.35.4 | **2.35.6** |  | — | `21-outils/08-gestionnaires-paquets` |
| [Zellij](https://github.com/zellij-org/zellij/releases/tag/v0.46.0) | v0.45.1 | **v0.46.0** | 2026-11-11 | ⚠️ changements | `21-outils/10-shells-terminal` |
| [nushell](https://github.com/nushell/nushell/releases/tag/0.117.0) | 0.116.1 | **0.117.0** | 2026-11-10 | — | `21-outils/10-shells-terminal` |
| [chezmoi](https://github.com/twpayne/chezmoi/releases/tag/v2.74.1) | v2.74.0 | **v2.74.1** | 2026-11-10 | — | `21-outils/10-shells-terminal` |
| [Notepad++](https://github.com/notepad-plus-plus/notepad-plus-plus/releases/tag/v8.9.9.1) | v8.9.9 | **v8.9.9.1** | 2026-11-12 | — | `21-outils/04-developpement/05-notepad-plus-plus` |
| [EMQX (community)](https://github.com/emqx/emqx/releases/tag/6.3.3) | 6.3.2 | **6.3.3** | 2026-11-11 | — | `12-recherche-messages/06-emqx` |
| [Ollama](https://github.com/ollama/ollama/releases/tag/v0.40.16) | v0.40.15 | **v0.40.16** | 2026-11-09 | ⚠️ changements | `21-outils/05-ia-productivite/04-ollama-open-webui` |
| [Open WebUI](https://github.com/open-webui/open-webui/releases/tag/v0.13.3) | v0.13.1 | **v0.13.3** | 2026-11-08 | ⚠️ changements | `21-outils/05-ia-productivite/04-ollama-open-webui` |
| [OpenSSH](https://github.com/openssh/openssh-portable/releases/tag/V_10_6_P2) | V_10_6_P1 | **V_10_6_P2** |  | — | `08-acces-distant-vpn/01-openssh` |
| [Playwright](https://github.com/microsoft/playwright/releases/tag/v1.65.1) | v1.65.0 | **v1.65.1** | 2026-11-13 | — | `21-outils/04-developpement/09-playwright` |

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
