---
title: Cluster, configuration et sécurité
description: Configurer elasticsearch.yml (nom du cluster, rôles, réseau, découverte, amorçage), ajouter des nœuds par jeton d'inscription, architecture hot/warm/cold, sécurité (TLS transport et HTTP, utilisateurs, rôles, clés d'API, comptes de service), authentification LDAP/AD et SSO selon la licence, et bonnes pratiques de durcissement.
tags: [elasticsearch, elasticsearch.yml, cluster, tls, rôles, api key, hot warm cold, sécurité]
icon: shield-check
---

## elasticsearch.yml

```yaml /etc/elasticsearch/elasticsearch.yml (es1)
cluster.name: logs-prod
node.name: es1
node.roles: [ master, data_hot, data_content, ingest ]

path.data: /var/lib/elasticsearch
path.logs: /var/log/elasticsearch
path.repo: [ "/srv/snapshots" ]          # dépôts de snapshots de type fs

network.host: 10.0.30.81
http.port: 9200

discovery.seed_hosts: [ "es1.corp.exemple.fr", "es2.corp.exemple.fr", "es3.corp.exemple.fr" ]
# Uniquement lors du tout premier démarrage du cluster, puis à retirer :
cluster.initial_master_nodes: [ "es1", "es2", "es3" ]

xpack.security.enabled: true
xpack.security.enrollment.enabled: true
xpack.security.http.ssl:
  enabled: true
  keystore.path: certs/http.p12
xpack.security.transport.ssl:
  enabled: true
  verification_mode: certificate
  keystore.path: certs/transport.p12
  truststore.path: certs/transport.p12
```

> [!IMPORTANT]
> Prévoyez **3 nœuds éligibles master** (nombre impair) pour la résilience. `cluster.initial_master_nodes` ne sert qu'à l'**amorçage** : laissé en place, il peut créer un second cluster si des nœuds redémarrent isolés.

## Ajouter un nœud

```bash
# Sur un nœud existant
sudo /usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s node
# Sur le nouveau nœud (paquet installé, service non démarré)
sudo /usr/share/elasticsearch/bin/elasticsearch-reconfigure-node --enrollment-token <jeton>
sudo systemctl enable --now elasticsearch
curl -k -u elastic "https://es1:9200/_cat/nodes?v&h=name,ip,node.role,master,heap.percent,disk.used_percent"
```

## Architecture hot / warm / cold

| Niveau | Rôle de nœud | Matériel | Données |
| --- | --- | --- | --- |
| Hot | `data_hot` | SSD/NVMe, CPU | Indexation et recherches récentes |
| Warm | `data_warm` | Disques plus grands | Données consultées occasionnellement |
| Cold / Frozen | `data_cold` / `data_frozen` | Stockage économique, snapshots interrogeables | Archives |

Les données migrent automatiquement entre niveaux selon la politique **ILM** ([[03-index-mappings-ilm]]). Des nœuds dédiés `master` (sans données) sont recommandés au-delà d'une dizaine de nœuds.

## Certificats

L'installation 8.x génère une AC et des certificats auto-signés (`/etc/elasticsearch/certs/`). Pour des certificats d'entreprise :

```bash
/usr/share/elasticsearch/bin/elasticsearch-certutil ca --out elastic-ca.p12
/usr/share/elasticsearch/bin/elasticsearch-certutil cert --ca elastic-ca.p12 --out transport.p12
/usr/share/elasticsearch/bin/elasticsearch-certutil http      # assistant pour la couche HTTP (CSR possible vers votre AC)
# Mots de passe des magasins dans le keystore sécurisé :
/usr/share/elasticsearch/bin/elasticsearch-keystore add xpack.security.http.ssl.keystore.secure_password
```

## Utilisateurs, rôles et clés d'API

```bash
ES="https://localhost:9200"; AUTH="-u elastic --cacert /etc/elasticsearch/certs/http_ca.crt"

# Rôle : écriture dans les index logs-*
curl $AUTH -X PUT "$ES/_security/role/ecriture_logs" -H 'Content-Type: application/json' -d '{
  "cluster": ["monitor", "manage_index_templates", "manage_ilm"],
  "indices": [ { "names": ["logs-*"], "privileges": ["create_doc", "create_index", "view_index_metadata", "auto_configure"] } ]
}'

# Utilisateur natif
curl $AUTH -X PUT "$ES/_security/user/collecteur" -H 'Content-Type: application/json' -d '{
  "password": "MotDePasseLong!", "roles": ["ecriture_logs"], "full_name": "Collecteur de journaux"
}'

# Clé d'API (préférable pour les agents et applications)
curl $AUTH -X POST "$ES/_security/api_key" -H 'Content-Type: application/json' -d '{
  "name": "filebeat-srv-web", "expiration": "365d",
  "role_descriptors": { "ecriture": { "indices": [ { "names": ["logs-*"], "privileges": ["create_doc", "auto_configure"] } ] } }
}'
```

| Rôle intégré | Usage |
| --- | --- |
| `superuser` | Tout (compte `elastic` : à réserver aux urgences) |
| `kibana_admin`, `editor`, `viewer` | Utilisateurs de Kibana |
| `monitoring_user` | Consultation de la supervision |
| `ingest_admin` | Pipelines d'ingestion |

## Royaumes d'authentification

| Royaume | Licence |
| --- | --- |
| Natif (utilisateurs internes), fichier | Basic (gratuite) |
| **LDAP / Active Directory** | Payante (Platinum / Enterprise) |
| SAML, OIDC, Kerberos, PKI | Payante |

Avec la licence gratuite, un **reverse proxy** authentifiant devant Kibana (SSO) ou OpenSearch (qui inclut LDAP/AD gratuitement) sont les alternatives.

## Durcissement

- [ ] Sécurité active (défaut 8.x) ; TLS transport **et** HTTP
- [ ] `network.host` sur le réseau privé, pare-feu (9200 vers clients/Kibana, 9300 entre nœuds)
- [ ] Compte `elastic` non utilisé au quotidien ; comptes nominatifs, rôles minimaux, clés d'API expirantes
- [ ] Kibana derrière HTTPS ; `xpack.encryptedSavedObjects.encryptionKey` défini
- [ ] Journal d'audit (`xpack.security.audit.enabled`, selon licence)
- [ ] Snapshots réguliers vers un dépôt hors cluster
