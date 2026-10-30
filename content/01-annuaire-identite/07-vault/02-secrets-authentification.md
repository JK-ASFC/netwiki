---
title: Secrets, authentification et politiques
description: Utiliser Vault — moteur kv-v2 (écriture, lecture, versions), politiques HCL par chemin, authentification LDAP/Active Directory et OIDC pour les personnes, AppRole pour les automates (Ansible, CI/CD), identifiants dynamiques de bases de données, Vault Agent et intégrations (Ansible, Terraform, Kubernetes), audit.
tags: [vault, kv, politiques, ldap, oidc, approle, database, ansible, audit]
icon: settings-2
---

## Secrets clé-valeur (kv-v2)

```bash
vault secrets enable -path=secret kv-v2
vault kv put secret/reseau/routeurs enable_secret='S3cr3t!' snmp_v3_auth='…' snmp_v3_priv='…'
vault kv get secret/reseau/routeurs
vault kv get -field=enable_secret secret/reseau/routeurs
vault kv metadata get secret/reseau/routeurs       # versions
vault kv rollback -version=2 secret/reseau/routeurs
vault kv delete secret/reseau/routeurs             # suppression logique (récupérable : undelete)
```

## Politiques

```hcl politique-reseau.hcl
# Équipe réseau : lecture/écriture de ses secrets
path "secret/data/reseau/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}
path "secret/metadata/reseau/*" {
  capabilities = ["list", "read"]
}
# Lecture seule des secrets partagés
path "secret/data/commun/*" {
  capabilities = ["read"]
}
```

```bash
vault policy write equipe-reseau politique-reseau.hcl
vault policy list
vault token capabilities secret/data/reseau/routeurs      # droits du jeton courant sur un chemin
```

Le moteur kv-v2 insère `data/` (contenu) et `metadata/` (versions) dans les chemins des politiques.

## Authentification des personnes

### LDAP / Active Directory

```bash
vault auth enable ldap
vault write auth/ldap/config \
  url="ldaps://dc1.corp.exemple.fr,ldaps://dc2.corp.exemple.fr" \
  binddn="CN=svc_vault,OU=Services,DC=corp,DC=exemple,DC=fr" bindpass='…' \
  userdn="OU=Utilisateurs,DC=corp,DC=exemple,DC=fr" userattr="sAMAccountName" \
  groupdn="OU=Groupes,DC=corp,DC=exemple,DC=fr" \
  groupfilter="(&(objectClass=group)(member:1.2.840.113556.1.4.1941:={{.UserDN}}))" groupattr="cn" \
  certificate=@/opt/vault/tls/ac-ad.crt
vault write auth/ldap/groups/GG_Reseau policies=equipe-reseau
vault login -method=ldap username=alice
```

### OIDC (SSO + MFA)

```bash
vault auth enable oidc
vault write auth/oidc/config oidc_discovery_url="https://sso.corp.exemple.fr/realms/infra" \
  oidc_client_id="vault" oidc_client_secret="…" default_role="defaut"
vault write auth/oidc/role/defaut user_claim="preferred_username" groups_claim="groups" \
  allowed_redirect_uris="https://vault.corp.exemple.fr:8200/ui/vault/auth/oidc/oidc/callback,http://localhost:8250/oidc/callback" \
  token_policies="defaut"
# Groupes externes → politiques via les entités/groupes d'identité de Vault
```

## Authentification des automates : AppRole

```bash
vault auth enable approle
vault write auth/approle/role/ansible-reseau token_policies="equipe-reseau" token_ttl=30m token_max_ttl=2h \
  secret_id_ttl=24h secret_id_num_uses=0 token_bound_cidrs="10.0.99.0/24"
vault read auth/approle/role/ansible-reseau/role-id
vault write -f auth/approle/role/ansible-reseau/secret-id
vault write auth/approle/login role_id=… secret_id=…
```

Le *role_id* (identifiant) et le *secret_id* (secret, de courte durée) sont fournis séparément à l'automate (variables CI/CD protégées). Pour GitLab CI ou Kubernetes, préférez les méthodes **JWT/OIDC** et **kubernetes** (aucun secret à distribuer).

## Identifiants dynamiques de bases de données

```bash
vault secrets enable database
vault write database/config/postgres-app plugin_name=postgresql-database-plugin \
  connection_url="postgresql://{{username}}:{{password}}@db1.corp.exemple.fr:5432/app?sslmode=verify-full" \
  username="vault_admin" password="…" allowed_roles="app-lecture"
vault write database/roles/app-lecture db_name=postgres-app default_ttl=1h max_ttl=24h \
  creation_statements="CREATE ROLE \"{{name}}\" WITH LOGIN PASSWORD '{{password}}' VALID UNTIL '{{expiration}}'; GRANT SELECT ON ALL TABLES IN SCHEMA public TO \"{{name}}\";"
vault read database/creds/app-lecture          # crée un compte temporaire, révoqué à l'expiration
vault write -force database/rotate-root/postgres-app    # Vault change le mot de passe de son compte admin
```

## Intégrations

| Outil | Méthode |
| --- | --- |
| **Ansible** | Collection `community.hashi_vault` (lookup `hashi_vault`), authentification AppRole/LDAP |
| **Terraform** | Fournisseur `vault` (lecture de secrets, configuration de Vault lui-même) |
| **Kubernetes** | Injecteur *Vault Agent*, **Vault Secrets Operator**, pilote CSI — voir [[04-kubernetes/05-stockage-configuration\|secrets Kubernetes]] |
| Applications | **Vault Agent** (authentification automatique, rendu de fichiers de configuration avec renouvellement) |
| GitLab CI | Secrets `vault` natifs avec jeton JWT des jobs |

## Audit

```bash
sudo mkdir -p /var/log/vault && sudo chown vault: /var/log/vault
vault audit enable file file_path=/var/log/vault/audit.log
vault audit list
```

Envoyez le journal d'audit au SIEM ; activez au moins **deux** dispositifs d'audit : si aucun ne peut écrire, Vault refuse les requêtes (sécurité).
