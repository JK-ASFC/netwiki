---
title: HashiCorp Vault / OpenBao — aide-mémoire des commandes
description: Commandes Vault avec exemples — serveur (dev, production), initialisation et descellement, état, connexion (tokens, userpass, AppRole, OIDC), moteurs de secrets (KV v2, base de données, PKI, SSH, transit), politiques, jetons et baux, audit, instantanés Raft et réplication, API HTTP avec curl, équivalents OpenBao (bao).
tags: [aide-mémoire, vault, openbao, secrets, pki, approle, kv]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Vault]]. Pour **OpenBao** (fork libre), remplacez `vault` par `bao` et `VAULT_` par `BAO_`.

## Serveur et état

```bash
vault server -dev                                   # laboratoire uniquement (en mémoire, déscellé)
sudo systemctl enable --now vault
export VAULT_ADDR=https://vault.exemple.fr:8200
vault status
vault operator init -key-shares=5 -key-threshold=3          # clés de descellement + token racine
vault operator unseal                                      # à répéter avec 3 clés différentes
vault operator seal                                        # sceller en urgence
vault operator raft list-peers
vault operator raft join https://vault1.exemple.fr:8200
```

## Connexion

```bash
vault login                                 # token
vault login -method=userpass username=amartin
vault login -method=oidc role=admins
vault token lookup
vault token renew
vault token revoke -self
```

## Secrets KV v2

```bash
vault secrets enable -path=secret kv-v2
vault kv put secret/reseau/routeur-paris utilisateur=admin motdepasse='Xq7vR2pL9mZt'
vault kv get secret/reseau/routeur-paris
vault kv get -field=motdepasse secret/reseau/routeur-paris
vault kv get -format=json secret/reseau/routeur-paris | jq .data.data
vault kv patch secret/reseau/routeur-paris motdepasse='Nouveau2026'
vault kv metadata get secret/reseau/routeur-paris        # versions
vault kv rollback -version=1 secret/reseau/routeur-paris
vault kv delete secret/reseau/routeur-paris               # suppression douce (récupérable)
vault kv undelete -versions=2 secret/reseau/routeur-paris
vault kv destroy -versions=1 secret/reseau/routeur-paris  # définitif
vault kv list secret/reseau
```

## Authentification des applications

```bash
vault auth enable approle
vault write auth/approle/role/app-web token_policies="app-web" token_ttl=1h secret_id_ttl=24h
vault read auth/approle/role/app-web/role-id
vault write -f auth/approle/role/app-web/secret-id
vault write auth/approle/login role_id="$ROLE_ID" secret_id="$SECRET_ID"
vault auth enable userpass
vault write auth/userpass/users/amartin password='MotDePasse' policies="reseau-lecture"
vault auth list
```

## Politiques

```bash
cat > reseau-lecture.hcl <<'EOF'
path "secret/data/reseau/*" {
  capabilities = ["read", "list"]
}
path "secret/metadata/reseau/*" {
  capabilities = ["list"]
}
EOF
vault policy write reseau-lecture reseau-lecture.hcl
vault policy list
vault policy read reseau-lecture
vault token capabilities secret/data/reseau/routeur-paris
```

## Moteurs dynamiques

```bash
# PKI : AC interne et émission de certificats
vault secrets enable pki
vault secrets tune -max-lease-ttl=87600h pki
vault write pki/root/generate/internal common_name="AC Interne Exemple" ttl=87600h
vault write pki/roles/serveurs allowed_domains=exemple.fr allow_subdomains=true max_ttl=720h
vault write pki/issue/serveurs common_name=srv-web01.exemple.fr ttl=720h
# Base de données : identifiants temporaires PostgreSQL
vault secrets enable database
vault write database/config/pg plugin_name=postgresql-database-plugin connection_url="postgresql://{{username}}:{{password}}@db.exemple.fr:5432/app" allowed_roles=lecture username=vault password='MotDePasseVault'
vault read database/creds/lecture
# Transit : chiffrement en tant que service
vault secrets enable transit
vault write -f transit/keys/app
vault write transit/encrypt/app plaintext=$(echo -n "secret" | base64)
vault write transit/decrypt/app ciphertext="vault:v1:..."
# Baux
vault lease list database/creds/lecture
vault lease revoke -prefix database/creds/lecture
```

## Audit et sauvegarde

```bash
vault audit enable file file_path=/var/log/vault/audit.log
vault audit list
vault operator raft snapshot save /srv/sauvegardes/vault-$(date +%F).snap
vault operator raft snapshot restore /srv/sauvegardes/vault-2026-10-29.snap
```

## API HTTP

```bash
curl -s -H "X-Vault-Token: $VAULT_TOKEN" $VAULT_ADDR/v1/secret/data/reseau/routeur-paris | jq .data.data
curl -s $VAULT_ADDR/v1/sys/health | jq .
curl -s -X POST -d '{"password":"MotDePasse"}' $VAULT_ADDR/v1/auth/userpass/login/amartin | jq -r .auth.client_token
```
