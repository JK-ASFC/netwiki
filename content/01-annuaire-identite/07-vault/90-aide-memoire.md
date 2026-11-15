---
title: HashiCorp Vault / OpenBao — aide-mémoire des commandes
description: Référence complète des commandes Vault et OpenBao avec exemples — installation (dépôts HashiCorp Debian et RHEL, Homebrew, winget, conteneur, Helm, OpenBao), variables d'environnement, opérateur (init avec clés PGP, descellement, rekey, generate-root, rotation, step-down, Raft et autopilot), authentification (jetons, userpass, LDAP/Active Directory, OIDC, AppRole durci avec emballage de réponse, Kubernetes), identités et groupes externes, jetons et accesseurs, politiques, KV v2 (versions, métadonnées, restauration), PKI à deux niveaux (intermédiaire, URL, émission, signature de CSR, révocation, nettoyage), CA SSH, identifiants dynamiques de bases de données, transit (chiffrement, rotation, rewrap), baux, audit (empreinte de recherche), instantanés Raft, Vault Agent, API HTTP, santé, métriques, journaux et paquet de diagnostic.
tags: [aide-mémoire, vault, openbao, secrets, pki, approle, kv, ldap, oidc, ssh, transit, raft]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Vault]], [[02-secrets-authentification|secrets et authentification]] et [[03-pki-ssh-exploitation|PKI, SSH et exploitation]]. Pour **OpenBao** (fork libre), remplacez `vault` par `bao` et `VAULT_` par `BAO_`. Exemples : `https://vault.exemple.fr:8200`, montage KV `secret/`, annuaire `corp.exemple.fr`.

## Installation

```bash
# Debian / Ubuntu : dépôt HashiCorp
wget -O - https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install vault
# RHEL / Rocky / Alma
sudo dnf install -y dnf-plugins-core
sudo dnf config-manager --add-repo https://rpm.releases.hashicorp.com/RHEL/hashicorp.repo
sudo dnf install vault
# macOS, Windows
brew tap hashicorp/tap && brew install hashicorp/tap/vault
winget install Hashicorp.Vault
# OpenBao
brew install openbao
# Conteneur, Kubernetes (Helm, cluster Raft à 3 nœuds)
docker run -d --name vault --cap-add=IPC_LOCK -p 8200:8200 -v /srv/vault/config:/vault/config -v /srv/vault/data:/vault/data hashicorp/vault server
helm repo add hashicorp https://helm.releases.hashicorp.com
helm install vault hashicorp/vault --namespace vault --create-namespace --set server.ha.enabled=true --set server.ha.raft.enabled=true --set server.ha.replicas=3

sudo systemctl enable --now vault
vault version
```

| Variable | Rôle |
| --- | --- |
| `VAULT_ADDR` | Adresse du serveur (`https://vault.exemple.fr:8200`) |
| `VAULT_TOKEN` | Jeton utilisé par la CLI (sinon `~/.vault-token`) |
| `VAULT_CACERT` | AC qui a signé le certificat du serveur |
| `VAULT_FORMAT` | `json` pour toutes les sorties |
| `VAULT_SKIP_VERIFY` | Désactive la vérification TLS : tests uniquement |

```bash
export VAULT_ADDR=https://vault.exemple.fr:8200
export VAULT_CACERT=/etc/ssl/certs/ca-corp.crt
vault server -dev                                   # laboratoire uniquement (en mémoire, déscellé, jeton racine affiché)
```

## Opérateur : initialisation, descellement, clés

```bash
vault status
vault operator init -key-shares=5 -key-threshold=3          # clés de descellement + jeton racine
vault operator init -key-shares=5 -key-threshold=3 -pgp-keys="alice.asc,bob.asc,claire.asc,david.asc,emma.asc"   # clés chiffrées pour chaque gardien
vault operator unseal                                      # à répéter avec 3 clés différentes
vault operator seal                                        # sceller en urgence

# Changer les clés de descellement (gardiens qui partent)
vault operator rekey -init -key-shares=5 -key-threshold=3
vault operator rekey -nonce=<nonce-affiché>                # chaque gardien fournit sa clé actuelle

# Recréer un jeton racine temporaire (le jeton racine initial a été révoqué)
vault operator generate-root -init
vault operator generate-root -nonce=<nonce-affiché>        # avec les clés de descellement
vault operator generate-root -decode=<jeton-encodé> -otp=<otp-affiché-par-init>
vault token revoke <jeton-racine>                          # à révoquer après usage

# Clé de chiffrement interne
vault operator key-status
vault operator rotate

# Cluster Raft
vault operator raft list-peers
vault operator raft join https://vault1.exemple.fr:8200
vault operator raft remove-peer vault3
vault operator raft autopilot state
vault operator step-down                                   # le nœud actif passe la main
vault operator members
```

## Authentification

```bash
vault login                                                # jeton (saisi)
vault login -method=userpass username=amartin
vault login -method=ldap username=amartin
vault login -method=oidc role=admins                       # ouvre le navigateur
vault auth list -detailed
vault auth enable -path=ldap ldap
vault auth disable userpass

# Utilisateurs locaux (secours)
vault auth enable userpass
vault write auth/userpass/users/secours password='MotDePasseLongEtUnique' token_policies="admins"

# LDAP / Active Directory : groupe AD → politique
vault write auth/ldap/config url="ldaps://dc01.corp.exemple.fr,ldaps://dc02.corp.exemple.fr" userdn="OU=Utilisateurs,DC=corp,DC=exemple,DC=fr" userattr="sAMAccountName" upndomain="corp.exemple.fr" groupdn="OU=Groupes,DC=corp,DC=exemple,DC=fr" groupattr="cn" binddn="CN=svc-vault,OU=Services,DC=corp,DC=exemple,DC=fr" bindpass='MotDePasseCompteService' certificate=@/etc/ssl/certs/ca-corp.crt
vault write auth/ldap/groups/GG-Reseau policies="reseau-lecture"
vault read auth/ldap/config

# OIDC (Keycloak, Entra ID…)
vault auth enable oidc
vault write auth/oidc/config oidc_discovery_url="https://sso.exemple.fr/realms/entreprise" oidc_client_id="vault" oidc_client_secret="$SECRET_OIDC" default_role="admins"
vault write auth/oidc/role/admins bound_audiences="vault" allowed_redirect_uris="https://vault.exemple.fr:8200/ui/vault/auth/oidc/oidc/callback" allowed_redirect_uris="http://localhost:8250/oidc/callback" user_claim="preferred_username" groups_claim="groups" token_policies="admins" token_ttl=8h

# AppRole (applications), durci : secret-id à usage unique, adresses autorisées
vault auth enable approle
vault write auth/approle/role/app-web token_policies="app-web" token_ttl=1h token_max_ttl=4h secret_id_ttl=24h secret_id_num_uses=1 secret_id_bound_cidrs="10.0.30.0/24" token_bound_cidrs="10.0.30.0/24"
vault read -field=role_id auth/approle/role/app-web/role-id
vault write -f -field=secret_id auth/approle/role/app-web/secret-id
vault write -wrap-ttl=120s -f auth/approle/role/app-web/secret-id     # secret-id emballé : transmis sans être lisible
vault unwrap <jeton-d-emballage>                                       # par l'application, une seule fois
vault write auth/approle/login role_id="$ROLE_ID" secret_id="$SECRET_ID"

# Kubernetes (pods)
vault auth enable kubernetes
vault write auth/kubernetes/config kubernetes_host="https://kubernetes.default.svc:443"
vault write auth/kubernetes/role/app-web bound_service_account_names=app-web bound_service_account_namespaces=production token_policies=app-web token_ttl=1h
```

## Identités et groupes externes

```bash
# Groupe Vault rattaché au groupe LDAP « GG-Reseau » (politiques héritées par les membres)
vault write identity/group name="reseau" type="external" policies="reseau-lecture"
GROUP_ID=$(vault read -field=id identity/group/name/reseau)
LDAP_ACCESSOR=$(vault auth list -format=json | jq -r '.["ldap/"].accessor')
vault write identity/group-alias name="GG-Reseau" mount_accessor="$LDAP_ACCESSOR" canonical_id="$GROUP_ID"
vault list identity/entity/name
vault read identity/entity/name/amartin
```

## Jetons

```bash
vault token lookup
vault token lookup -accessor <accesseur>
vault token renew
vault token renew -increment=2h
vault token revoke -self
vault token create -policy=reseau-lecture -ttl=8h -display-name="script-sauvegarde"
vault token create -policy=app-web -period=24h -orphan                 # jeton périodique, indépendant du parent
vault token create -policy=reseau-lecture -use-limit=5 -ttl=10m
vault list auth/token/accessors
vault token revoke -accessor <accesseur>
vault token capabilities secret/data/reseau/routeur-paris
vault token capabilities <jeton> secret/data/reseau/routeur-paris
```

## Politiques

```bash
cat > reseau-lecture.hcl <<'EOF'
path "secret/data/reseau/*" {
  capabilities = ["read", "list"]
}
path "secret/metadata/reseau/*" {
  capabilities = ["list", "read"]
}
EOF
vault policy fmt reseau-lecture.hcl
vault policy write reseau-lecture reseau-lecture.hcl
vault policy list
vault policy read reseau-lecture
vault policy delete ancienne
```

## Secrets KV v2

```bash
vault secrets enable -path=secret kv-v2
vault secrets list -detailed
vault kv put -mount=secret reseau/routeur-paris utilisateur=admin motdepasse='Xq7vR2pL9mZt'
vault kv put -mount=secret reseau/routeur-lyon @routeur-lyon.json       # depuis un fichier JSON
vault kv get -mount=secret reseau/routeur-paris
vault kv get -mount=secret -field=motdepasse reseau/routeur-paris
vault kv get -mount=secret -version=2 reseau/routeur-paris
vault kv get -format=json -mount=secret reseau/routeur-paris | jq .data.data
vault kv patch -mount=secret reseau/routeur-paris motdepasse='Nouveau2026!'
vault kv list -mount=secret reseau
vault kv metadata get -mount=secret reseau/routeur-paris               # versions et dates
vault kv metadata put -mount=secret -max-versions=10 -delete-version-after=2160h reseau/routeur-paris
vault kv rollback -mount=secret -version=1 reseau/routeur-paris
vault kv delete -mount=secret reseau/routeur-paris                     # suppression douce (récupérable)
vault kv undelete -mount=secret -versions=2 reseau/routeur-paris
vault kv destroy -mount=secret -versions=1 reseau/routeur-paris        # définitif
vault kv metadata delete -mount=secret reseau/ancien                   # toutes les versions et métadonnées
```

## PKI (AC racine + intermédiaire)

```bash
# Racine (longue durée) et URL publiées dans les certificats
vault secrets enable pki
vault secrets tune -max-lease-ttl=87600h pki
vault write -field=certificate pki/root/generate/internal common_name="AC Racine Exemple" ttl=87600h > ac-racine.crt
vault write pki/config/urls issuing_certificates="$VAULT_ADDR/v1/pki/ca" crl_distribution_points="$VAULT_ADDR/v1/pki/crl"

# Intermédiaire signée par la racine
vault secrets enable -path=pki_int pki
vault secrets tune -max-lease-ttl=43800h pki_int
vault write -format=json pki_int/intermediate/generate/internal common_name="AC Intermediaire Exemple" | jq -r .data.csr > pki_int.csr
vault write -format=json pki/root/sign-intermediate csr=@pki_int.csr format=pem_bundle ttl=43800h | jq -r .data.certificate > pki_int.pem
vault write pki_int/intermediate/set-signed certificate=@pki_int.pem
vault write pki_int/config/urls issuing_certificates="$VAULT_ADDR/v1/pki_int/ca" crl_distribution_points="$VAULT_ADDR/v1/pki_int/crl"

# Rôle et émission
vault write pki_int/roles/serveurs allowed_domains="exemple.fr" allow_subdomains=true max_ttl=720h key_type=ec key_bits=256
vault write pki_int/issue/serveurs common_name=srv-web01.exemple.fr alt_names=intranet.exemple.fr ip_sans=10.0.30.10 ttl=720h
vault write -format=json pki_int/issue/serveurs common_name=srv-web01.exemple.fr ttl=720h > srv-web01.json
jq -r .data.certificate srv-web01.json > srv-web01.crt && jq -r .data.private_key srv-web01.json > srv-web01.key
vault write pki_int/sign/serveurs csr=@srv-app.csr ttl=720h            # signer une CSR existante

# Inventaire, révocation, nettoyage
vault list pki_int/certs
vault write pki_int/revoke serial_number="3a:4b:5c:6d:7e:8f"
vault write pki_int/tidy tidy_cert_store=true tidy_revoked_certs=true safety_buffer=72h
curl -s $VAULT_ADDR/v1/pki_int/crl/pem | openssl crl -noout -text | head
```

## Certificats SSH

```bash
vault secrets enable -path=ssh-client ssh
vault write ssh-client/config/ca generate_signing_key=true
vault read -field=public_key ssh-client/config/ca | sudo tee /etc/ssh/trusted-user-ca-keys.pem   # sur chaque serveur, puis TrustedUserCAKeys dans sshd_config
cat > role-ssh.json <<'EOF'
{
  "key_type": "ca",
  "allow_user_certificates": true,
  "allowed_users": "admin,amartin",
  "default_user": "admin",
  "default_extensions": { "permit-pty": "" },
  "ttl": "30m"
}
EOF
vault write ssh-client/roles/admins @role-ssh.json
vault write -field=signed_key ssh-client/sign/admins public_key=@$HOME/.ssh/id_ed25519.pub valid_principals=admin > ~/.ssh/id_ed25519-cert.pub
ssh-keygen -L -f ~/.ssh/id_ed25519-cert.pub                            # principaux et validité
ssh admin@srv-web01.exemple.fr
```

## Identifiants dynamiques de bases de données

```bash
vault secrets enable database
vault write database/config/pg plugin_name=postgresql-database-plugin connection_url="postgresql://{{username}}:{{password}}@srv-db.exemple.fr:5432/app?sslmode=verify-full" allowed_roles="lecture" username="vault" password='MotDePasseVault'
vault write -f database/rotate-root/pg                                 # Vault change son propre mot de passe : lui seul le connaît
vault write database/roles/lecture db_name=pg default_ttl=1h max_ttl=24h creation_statements="CREATE ROLE \"{{name}}\" WITH LOGIN PASSWORD '{{password}}' VALID UNTIL '{{expiration}}'; GRANT SELECT ON ALL TABLES IN SCHEMA public TO \"{{name}}\";"
vault read database/creds/lecture
vault lease list database/creds/lecture
vault lease renew database/creds/lecture/<id-du-bail>
vault lease revoke -prefix database/creds/lecture
```

## Transit (chiffrement en tant que service)

```bash
vault secrets enable transit
vault write -f transit/keys/app
vault write -field=ciphertext transit/encrypt/app plaintext=$(printf '%s' "donnée secrète" | base64)
vault write -field=plaintext transit/decrypt/app ciphertext="vault:v1:exempleTexteChiffre" | base64 -d
vault write -f transit/keys/app/rotate
vault write transit/rewrap/app ciphertext="vault:v1:exempleTexteChiffre"   # rechiffrer avec la dernière version
vault write transit/keys/app/config min_decryption_version=2
vault read transit/keys/app
```

## Audit, sauvegarde, santé

```bash
vault audit enable file file_path=/var/log/vault/audit.log
vault audit enable -path=syslog syslog tag="vault" facility="AUTH"
vault audit list -detailed
# Les valeurs sensibles sont hachées dans le journal : calculer l'empreinte d'une valeur pour la rechercher
vault write -field=hash sys/audit-hash/file input="amartin"

vault operator raft snapshot save /srv/sauvegardes/vault-$(date +%F).snap
vault operator raft snapshot restore /srv/sauvegardes/vault-2026-11-15.snap

vault status -format=json | jq '.sealed, .ha_enabled, .raft_committed_index'
curl -s -o /dev/null -w "%{http_code}\n" $VAULT_ADDR/v1/sys/health     # 200 actif, 429 secours, 501 non initialisé, 503 scellé
curl -s -H "X-Vault-Token: $VAULT_TOKEN" "$VAULT_ADDR/v1/sys/metrics?format=prometheus" | grep -E "^vault_core_unsealed|^vault_runtime" | head
vault monitor -log-level=debug                                          # journal du serveur en direct
vault debug -duration=2m -output=/tmp/vault-debug.tar.gz                # paquet de diagnostic (support)
sudo journalctl -u vault -f
```

## Vault Agent (applications sans intégration native)

```hcl /etc/vault-agent/agent.hcl
vault {
  address = "https://vault.exemple.fr:8200"
}
auto_auth {
  method "approle" {
    config = {
      role_id_file_path   = "/etc/vault-agent/role-id"
      secret_id_file_path = "/etc/vault-agent/secret-id"
      remove_secret_id_file_after_reading = true
    }
  }
  sink "file" {
    config = { path = "/run/vault-agent/token" }
  }
}
template {
  source      = "/etc/vault-agent/app.env.tpl"
  destination = "/etc/app-web/app.env"
  command     = "systemctl restart app-web"
}
```

```text /etc/vault-agent/app.env.tpl
{{ with secret "secret/data/app-web/base" }}DB_PASSWORD={{ .Data.data.motdepasse }}{{ end }}
```

```bash
vault agent -config=/etc/vault-agent/agent.hcl
```

## API HTTP

```bash
curl -s -H "X-Vault-Token: $VAULT_TOKEN" $VAULT_ADDR/v1/secret/data/reseau/routeur-paris | jq .data.data
curl -s -H "X-Vault-Token: $VAULT_TOKEN" -X POST -d '{"data":{"utilisateur":"admin","motdepasse":"Xq7vR2pL9mZt"}}' $VAULT_ADDR/v1/secret/data/reseau/routeur-paris
curl -s -X POST -d '{"password":"MotDePasseLongEtUnique"}' $VAULT_ADDR/v1/auth/userpass/login/secours | jq -r .auth.client_token
curl -s -X POST -d "{\"role_id\":\"$ROLE_ID\",\"secret_id\":\"$SECRET_ID\"}" $VAULT_ADDR/v1/auth/approle/login | jq -r .auth.client_token
curl -s $VAULT_ADDR/v1/sys/health | jq .
vault kv get -output-curl-string -mount=secret reseau/routeur-paris     # afficher la requête curl équivalente à une commande
```
