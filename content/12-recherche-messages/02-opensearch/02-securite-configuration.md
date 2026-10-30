---
title: Sécurité et configuration du cluster
description: Configurer un cluster OpenSearch (opensearch.yml, découverte, rôles de nœuds), remplacer les certificats de démonstration, configurer le greffon de sécurité (config.yml, internal_users.yml, roles.yml, roles_mapping.yml, securityadmin.sh), authentification LDAP/Active Directory, rôles et locataires de Dashboards, et sécurité au niveau document et champ.
tags: [opensearch, sécurité, certificats, securityadmin, ldap, active directory, rôles, multitenancy]
icon: shield-check
---

## opensearch.yml (cluster de 3 nœuds)

```yaml /etc/opensearch/opensearch.yml (os1)
cluster.name: logs-prod
node.name: os1
node.roles: [ cluster_manager, data, ingest ]
network.host: 10.0.30.91
http.port: 9200
discovery.seed_hosts: [ "os1.corp.exemple.fr", "os2.corp.exemple.fr", "os3.corp.exemple.fr" ]
cluster.initial_cluster_manager_nodes: [ "os1", "os2", "os3" ]    # amorçage uniquement
path.repo: [ "/srv/snapshots" ]

# Greffon de sécurité
plugins.security.ssl.transport.pemcert_filepath: certs/os1.pem
plugins.security.ssl.transport.pemkey_filepath: certs/os1-key.pem
plugins.security.ssl.transport.pemtrustedcas_filepath: certs/ca.pem
plugins.security.ssl.transport.enforce_hostname_verification: true
plugins.security.ssl.http.enabled: true
plugins.security.ssl.http.pemcert_filepath: certs/os1.pem
plugins.security.ssl.http.pemkey_filepath: certs/os1-key.pem
plugins.security.ssl.http.pemtrustedcas_filepath: certs/ca.pem
plugins.security.nodes_dn:
  - "CN=os*.corp.exemple.fr,OU=OpenSearch,O=Exemple,C=FR"
plugins.security.authcz.admin_dn:
  - "CN=admin-opensearch,OU=OpenSearch,O=Exemple,C=FR"
plugins.security.audit.type: internal_opensearch
```

> [!WARNING]
> L'installation par paquet génère des **certificats de démonstration** (connus publiquement). Remplacez-les par des certificats de votre AC (clés au format **PKCS#8** pour le greffon), avec un certificat **admin** distinct utilisé uniquement par `securityadmin.sh`.

```bash
# Clé au format PKCS#8 attendu par OpenSearch
openssl pkcs8 -inform PEM -outform PEM -in os1-key-rsa.pem -topk8 -nocrypt -v1 PBE-SHA1-3DES -out os1-key.pem
```

## Fichiers du greffon de sécurité

| Fichier (`/etc/opensearch/opensearch-security/`) | Contenu |
| --- | --- |
| `config.yml` | Domaines d'authentification (interne, LDAP, SAML, OIDC, certificats, proxy) |
| `internal_users.yml` | Utilisateurs internes (mots de passe hachés) |
| `roles.yml` | Rôles : droits cluster, index, documents, champs, locataires |
| `roles_mapping.yml` | Association rôles ↔ utilisateurs, groupes LDAP, rôles backend |
| `action_groups.yml`, `tenants.yml` | Groupes d'actions, locataires de Dashboards |

```bash
/usr/share/opensearch/plugins/opensearch-security/tools/hash.sh -p 'NouveauMotDePasse!'   # hacher un mot de passe

# Appliquer la configuration (stockée dans l'index .opendistro_security)
sudo /usr/share/opensearch/plugins/opensearch-security/tools/securityadmin.sh \
  -cd /etc/opensearch/opensearch-security/ -icl -nhnv \
  -cacert /etc/opensearch/certs/ca.pem \
  -cert /etc/opensearch/certs/admin.pem -key /etc/opensearch/certs/admin-key.pem
```

Les modifications faites dans **Dashboards → Security** ou par l'API REST sont stockées dans l'index ; ne relancez pas `securityadmin.sh` avec d'anciens fichiers sans les avoir exportés (`-backup`).

## LDAP / Active Directory

```yaml config.yml (extrait)
config:
  dynamic:
    authc:
      basic_internal_auth_domain:
        order: 0
        http_enabled: true
        http_authenticator: { type: basic, challenge: true }
        authentication_backend: { type: intern }
      ldap:
        order: 1
        http_enabled: true
        http_authenticator: { type: basic, challenge: false }
        authentication_backend:
          type: ldap
          config:
            enable_ssl: true
            pemtrustedcas_filepath: /etc/opensearch/certs/ac-ad.pem
            hosts: [ "dc1.corp.exemple.fr:636", "dc2.corp.exemple.fr:636" ]
            bind_dn: "CN=svc_opensearch,OU=Services,DC=corp,DC=exemple,DC=fr"
            password: "MotDePasseCompteService"
            userbase: "OU=Utilisateurs,DC=corp,DC=exemple,DC=fr"
            usersearch: "(sAMAccountName={0})"
            username_attribute: sAMAccountName
    authz:
      roles_from_ad:
        http_enabled: true
        authorization_backend:
          type: ldap
          config:
            enable_ssl: true
            hosts: [ "dc1.corp.exemple.fr:636" ]
            bind_dn: "CN=svc_opensearch,OU=Services,DC=corp,DC=exemple,DC=fr"
            password: "MotDePasseCompteService"
            rolebase: "OU=Groupes,DC=corp,DC=exemple,DC=fr"
            rolesearch: "(member={0})"
            rolename: cn
            resolve_nested_roles: true
```

```yaml roles_mapping.yml (extrait)
all_access:
  backend_roles: [ "GG_OpenSearch_Admins" ]
lecteurs_journaux:
  backend_roles: [ "GG_SOC_Analystes" ]
```

## Rôles

```yaml roles.yml (extrait)
lecteurs_journaux:
  cluster_permissions: [ "cluster_composite_ops_ro" ]
  index_permissions:
    - index_patterns: [ "logs-*" ]
      allowed_actions: [ "read" ]
      fls: [ "~user.password", "~http.request.headers.authorization" ]   # champs masqués
      masked_fields: [ "user.email" ]                                     # champ haché
      dls: '{"bool": {"must_not": {"term": {"event.dataset": "rh"}}}}'      # documents exclus
  tenant_permissions:
    - tenant_patterns: [ "SOC" ]
      allowed_actions: [ "kibana_all_read" ]
```

| Mécanisme | Effet |
| --- | --- |
| **DLS** (*document level security*) | Filtre les documents visibles |
| **FLS** (*field level security*) | Masque des champs |
| Champs masqués | Valeur hachée (recherche possible, lecture impossible) |
| **Locataires** (*tenants*) | Espaces séparés de tableaux de bord dans Dashboards |

## Durcissement

- [ ] Certificats de démonstration remplacés, mot de passe `admin` changé (et utilisateurs internes de démonstration supprimés)
- [ ] TLS HTTP et transport, `nodes_dn` restreint
- [ ] Authentification par l'annuaire, rôles par groupes AD
- [ ] Journal d'audit activé (`plugins.security.audit.*`)
- [ ] Dashboards en HTTPS, éventuellement derrière un SSO (SAML/OIDC)
