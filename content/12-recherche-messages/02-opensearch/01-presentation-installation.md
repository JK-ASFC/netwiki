---
title: Présentation et installation
description: OpenSearch, fork libre (Apache 2.0) d'Elasticsearch et Kibana — historique, différences et compatibilité avec Elasticsearch, greffons inclus (sécurité, alertes, ISM, détection d'anomalies), versions, installation sous Debian/Ubuntu, RHEL, Windows, macOS et Docker avec mot de passe administrateur initial, et OpenSearch Dashboards.
tags: [opensearch, opensearch dashboards, elasticsearch, installation, apache 2.0, recherche]
icon: info
---

**OpenSearch** est né en 2021 d'un fork d'Elasticsearch 7.10 et de Kibana 7.10, lorsque Elastic a quitté la licence Apache 2.0. Le projet, désormais porté par l'**OpenSearch Software Foundation** (Linux Foundation), reste sous **Apache 2.0** et inclut gratuitement des fonctions payantes chez Elastic.

## Différences avec Elasticsearch

| Sujet | OpenSearch | [[01-elasticsearch/01-presentation-installation\|Elasticsearch]] |
| --- | --- | --- |
| Licence | Apache 2.0 | ELv2 / SSPL / AGPLv3 |
| Sécurité (TLS, utilisateurs, **LDAP/AD**, SAML, OIDC, sécurité par document et par champ) | Incluse (greffon *Security*) | Partiellement payante |
| Cycle de vie des index | **ISM** (*Index State Management*) | ILM |
| Alertes, détection d'anomalies, rapports, SQL/PPL | Inclus | Selon licence |
| Interface | **OpenSearch Dashboards** | Kibana |
| Collecte | Data Prepper, Fluent Bit, Logstash (sortie OpenSearch) | Elastic Agent, Beats |
| API | Compatible avec l'API Elasticsearch 7.10, divergente depuis | — |

> [!NOTE]
> Les clients et agents Elastic récents (Beats ≥ 7.13, Elastic Agent) **refusent** de se connecter à OpenSearch : utilisez Fluent Bit, Logstash avec le greffon `logstash-output-opensearch`, Data Prepper ou les clients OpenSearch.

## Versions et ports

- Branches **2.x** (2.19) et **3.x** (2025, Lucene 10, Java 21).
- Ports : **9200** (REST), 9300 (transport), **5601** (Dashboards).

## Installation

### Debian / Ubuntu

```bash
curl -o- https://artifacts.opensearch.org/publickeys/opensearch-release.pgp \
  | sudo gpg --dearmor --batch --yes -o /usr/share/keyrings/opensearch-release-keyring
echo "deb [signed-by=/usr/share/keyrings/opensearch-release-keyring] https://artifacts.opensearch.org/releases/bundle/opensearch/2.x/apt stable main" \
  | sudo tee /etc/apt/sources.list.d/opensearch-2.x.list
sudo apt update
# Mot de passe de l'utilisateur « admin » exigé à l'installation (≥ 2.12) : 8 caractères min., majuscule, minuscule, chiffre, spécial
sudo env OPENSEARCH_INITIAL_ADMIN_PASSWORD='Ch4ngeM0i!Fort' apt install opensearch
sudo systemctl enable --now opensearch
curl -k -u 'admin:Ch4ngeM0i!Fort' https://localhost:9200
```

### RHEL / Rocky / Alma

```bash
sudo curl -SL https://artifacts.opensearch.org/releases/bundle/opensearch/2.x/opensearch-2.x.repo -o /etc/yum.repos.d/opensearch-2.x.repo
sudo env OPENSEARCH_INITIAL_ADMIN_PASSWORD='Ch4ngeM0i!Fort' dnf install opensearch
sudo systemctl enable --now opensearch
```

### Windows, macOS, Docker

| Plate-forme | Installation |
| --- | --- |
| Windows | Archive ZIP ou installateur MSI ; `opensearch-windows-install.bat` |
| macOS | Docker (ou `brew install opensearch` pour les tests) |
| Docker | `docker run -d -p 9200:9200 -e "discovery.type=single-node" -e OPENSEARCH_INITIAL_ADMIN_PASSWORD='Ch4ngeM0i!Fort' opensearchproject/opensearch:2` |

Mêmes réglages système qu'Elasticsearch : `vm.max_map_count = 262144`, pas de swap, tas JVM ≤ 50 % de la RAM (`/etc/opensearch/jvm.options`).

## OpenSearch Dashboards

```bash
echo "deb [signed-by=/usr/share/keyrings/opensearch-release-keyring] https://artifacts.opensearch.org/releases/bundle/opensearch-dashboards/2.x/apt stable main" \
  | sudo tee /etc/apt/sources.list.d/opensearch-dashboards-2.x.list
sudo apt update && sudo apt install opensearch-dashboards
```

```yaml /etc/opensearch-dashboards/opensearch_dashboards.yml
server.host: "10.0.30.90"
opensearch.hosts: [ "https://localhost:9200" ]
opensearch.ssl.verificationMode: full
opensearch.ssl.certificateAuthorities: [ "/etc/opensearch-dashboards/certs/ca.pem" ]
opensearch.username: "kibanaserver"
opensearch.password: "MotDePasseKibanaserver"
opensearch_security.multitenancy.enabled: true
```

```bash
sudo systemctl enable --now opensearch-dashboards
```

## Suite du parcours

1. [[02-securite-configuration|Sécurité et configuration du cluster]]
2. [[03-ism-exploitation|ISM, snapshots, exploitation et dépannage]]
