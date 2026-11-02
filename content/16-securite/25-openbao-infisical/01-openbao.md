---
title: OpenBao
description: OpenBao (Linux Foundation, MPL 2.0) — fork communautaire de HashiCorp Vault créé après le passage de Vault sous licence BSL : compatibilité (API, CLI bao, greffons), installation (paquets, binaire, Docker, Helm), stockage intégré Raft et haute disponibilité, initialisation et descellement (Shamir, auto-unseal par KMS ou transit), moteurs de secrets (KV v2, base de données dynamique, PKI, SSH, transit), authentification (userpass, LDAP, OIDC, AppRole, Kubernetes, certificats), politiques HCL, audit, migration depuis Vault et intégrations (External Secrets, Ansible, Terraform).
tags: [openbao, vault, secrets, pki, kms, raft, open source]
icon: info
---

**OpenBao** reprend le code de **HashiCorp Vault** (version 1.14, dernière sous licence MPL) au sein de la Linux Foundation, après le passage de Vault sous **BSL 1.1** en 2023. La CLI s'appelle `bao` et l'API est compatible : les principes décrits dans la fiche [[07-vault/01-presentation-installation|Vault]] s'appliquent. Choisir OpenBao garantit une licence libre et une gouvernance communautaire.

## Installation (stockage intégré Raft)

```bash
# Paquets .deb/.rpm ou binaire des versions GitHub (openbao/openbao) ; Docker : openbao/openbao ; Kubernetes : chart openbao/openbao
sudo apt install ./bao_*_linux_amd64.deb
```

```hcl
# /etc/openbao/openbao.hcl
ui = true
storage "raft" {
  path    = "/var/lib/openbao"
  node_id = "bao1"
  retry_join { leader_api_addr = "https://bao2.corp.exemple.fr:8200" }
  retry_join { leader_api_addr = "https://bao3.corp.exemple.fr:8200" }
}
listener "tcp" {
  address       = "0.0.0.0:8200"
  tls_cert_file = "/etc/openbao/tls/bao.crt"
  tls_key_file  = "/etc/openbao/tls/bao.key"
}
api_addr     = "https://bao1.corp.exemple.fr:8200"
cluster_addr = "https://bao1.corp.exemple.fr:8201"
```

```bash
sudo systemctl enable --now openbao
export BAO_ADDR=https://bao1.corp.exemple.fr:8200
bao operator init -key-shares=5 -key-threshold=3     # remettre les parts de clé à 5 personnes distinctes
bao operator unseal                                   # 3 fois, avec 3 parts différentes (sur chaque nœud)
bao login                                             # jeton racine initial : créer des accès nominatifs puis le révoquer
```

## Premiers usages

```bash
bao secrets enable -path=secret kv-v2
bao kv put secret/infra/netbox token=0123456789abcdef
bao auth enable oidc        # SSO (Keycloak, Entra ID) pour les humains
bao auth enable approle     # applications et CI
bao policy write lecture-infra - <<'EOF2'
path "secret/data/infra/*" { capabilities = ["read"] }
EOF2
bao audit enable file file_path=/var/log/openbao/audit.log
```

Migration depuis Vault : les données Raft et la configuration sont compatibles jusqu'aux versions forkées ; tester sur une copie (instantané `vault operator raft snapshot save`, restauration dans OpenBao) avant la bascule.

Suite : [[02-infisical|Infisical]] · [[03-interface-graphique|interfaces graphiques]] · [[90-aide-memoire|aide-mémoire]].
