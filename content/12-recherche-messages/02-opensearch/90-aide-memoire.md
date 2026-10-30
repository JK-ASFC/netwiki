---
title: OpenSearch — aide-mémoire des commandes
description: Commandes OpenSearch avec exemples — API REST (santé, _cat, index, recherche), plugin de sécurité (securityadmin.sh, utilisateurs internes, rôles et correspondances, hash.sh), gestion du cycle de vie (ISM), instantanés, OpenSearch Dashboards, conteneurs Docker, différences avec Elasticsearch.
tags: [aide-mémoire, opensearch, api, securityadmin, ism, dashboards]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|OpenSearch]]. Les API de base (`_cluster/health`, `_cat/*`, index, `_search`, `_snapshot`) sont **identiques** à [[01-elasticsearch/90-aide-memoire|Elasticsearch]].

```bash
O="https://127.0.0.1:9200"; A=(-s -k -u admin:"$MDP" -H "Content-Type: application/json")
curl "${A[@]}" "$O/_cluster/health?pretty"
curl "${A[@]}" "$O/_cat/indices?v&s=index"
curl "${A[@]}" "$O/_cat/plugins?v"
```

## Sécurité

```bash
# Empreinte d'un mot de passe pour internal_users.yml
sudo /usr/share/opensearch/plugins/opensearch-security/tools/hash.sh -p 'MotDePasseLong2026'
# Appliquer les fichiers de configuration de sécurité (config.yml, roles.yml, internal_users.yml…)
sudo /usr/share/opensearch/plugins/opensearch-security/tools/securityadmin.sh \
  -cd /etc/opensearch/opensearch-security/ -icl -nhnv \
  -cacert /etc/opensearch/root-ca.pem -cert /etc/opensearch/admin.pem -key /etc/opensearch/admin-key.pem
# API de sécurité
curl "${A[@]}" -X PUT "$O/_plugins/_security/api/internalusers/amartin" -d '{"password":"MotDePasseLong2026","backend_roles":["lecture"]}'
curl "${A[@]}" -X PUT "$O/_plugins/_security/api/roles/lecture_logs" -d '{"index_permissions":[{"index_patterns":["logs-*"],"allowed_actions":["read"]}]}'
curl "${A[@]}" -X PUT "$O/_plugins/_security/api/rolesmapping/lecture_logs" -d '{"backend_roles":["lecture"]}'
curl "${A[@]}" "$O/_plugins/_security/authinfo?pretty"
```

## Cycle de vie (ISM)

```bash
curl "${A[@]}" -X PUT "$O/_plugins/_ism/policies/logs-30j" -d '{"policy":{"description":"30 jours","default_state":"chaud","states":[
  {"name":"chaud","actions":[{"rollover":{"min_index_age":"1d"}}],"transitions":[{"state_name":"suppression","conditions":{"min_index_age":"30d"}}]},
  {"name":"suppression","actions":[{"delete":{}}],"transitions":[]}],
  "ism_template":{"index_patterns":["logs-*"],"priority":100}}}'
curl "${A[@]}" "$O/_plugins/_ism/explain/logs-*?pretty" | head -30
```

## Docker

```bash
docker run -d --name opensearch -p 9200:9200 -e "discovery.type=single-node" \
  -e "OPENSEARCH_INITIAL_ADMIN_PASSWORD=MotDePasseTresLong2026!" opensearchproject/opensearch:2
docker run -d --name dashboards -p 5601:5601 -e 'OPENSEARCH_HOSTS=["https://opensearch:9200"]' --link opensearch opensearchproject/opensearch-dashboards:2
```

## Journaux et service

```bash
sudo systemctl status opensearch opensearch-dashboards
sudo tail -f /var/log/opensearch/*.log
```
