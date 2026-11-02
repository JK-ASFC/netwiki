---
title: Consul
description: HashiCorp Consul — découverte de services, contrôles de santé, DNS, magasin clé-valeur et maillage de services : licence BSL 1.1 depuis 2023, architecture (serveurs Raft, agents clients, datacenters), installation (dépôt HashiCorp pour Debian/Ubuntu et RHEL, Windows, macOS, Docker, Helm), consul.hcl, bootstrap de trois serveurs, enregistrement de services et contrôles, requêtes DNS (port 8600, .service.consul), KV, ACL (bootstrap, jetons, politiques), chiffrement gossip et TLS, instantanés, interface web, et alternatives.
tags: [consul, hashicorp, découverte de services, dns, clé-valeur, service mesh]
icon: info
---

**Consul** tient un **catalogue** des services et de leur état de santé, interrogeable par **DNS** (`web.service.consul`) ou API, avec un magasin **clé-valeur** et un maillage de services (Connect). Il est souvent couplé à [[07-vault/01-presentation-installation|Vault]] et Nomad.

> [!NOTE]
> Depuis août 2023, Consul est publié sous **Business Source License 1.1** (usage interne libre, interdiction de proposer un service concurrent). Pas de fork communautaire majeur à ce jour ; pour la seule découverte de services sous Kubernetes, le DNS du cluster suffit souvent.

| Port | Usage |
| --- | --- |
| **8500** (8501 TLS) | API HTTP et interface web |
| **8600** | DNS |
| 8300 / 8301 / 8302 | RPC serveurs, gossip LAN, gossip WAN |

## Installation

```bash
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install consul
# RHEL : sudo dnf config-manager --add-repo https://rpm.releases.hashicorp.com/RHEL/hashicorp.repo && sudo dnf install consul
```

Windows : binaire `consul.exe` (service via `sc.exe create`) ; macOS : `brew install hashicorp/tap/consul` ; Kubernetes : chart Helm `hashicorp/consul`.

## Serveurs (trois nœuds)

```hcl
# /etc/consul.d/consul.hcl
datacenter       = "paris"
data_dir         = "/opt/consul"
server           = true
bootstrap_expect = 3
bind_addr        = "10.0.20.171"
client_addr      = "127.0.0.1 10.0.20.171"
retry_join       = ["10.0.20.171", "10.0.20.172", "10.0.20.173"]
encrypt          = "<clé générée par consul keygen>"
ui_config { enabled = true }
acl {
  enabled                  = true
  default_policy           = "deny"
  enable_token_persistence = true
}
```

```bash
consul validate /etc/consul.d/ && sudo systemctl enable --now consul
consul members ; consul operator raft list-peers
consul acl bootstrap                     # jeton d'administration initial : le conserver dans un coffre
```

## Services, DNS et KV

```hcl
# /etc/consul.d/web.hcl sur un agent client
service {
  name = "web"
  port = 443
  tags = ["prod"]
  check {
    http     = "https://localhost/sante"
    interval = "10s"
    timeout  = "2s"
  }
}
```

```bash
consul reload
dig @127.0.0.1 -p 8600 web.service.consul SRV
consul catalog services ; consul kv put config/proxy http://proxy.corp.exemple.fr:3128 ; consul kv get -recurse config/
consul snapshot save /sauv/consul-$(date +%F).snap
```

Pour que tout le réseau résolve `*.consul`, déléguer la zone depuis le DNS interne ([[02-unbound/03-zones-locales-redirections|Unbound]], [[01-bind9/01-presentation|BIND]]) vers le port 8600 des agents.

Interface : [[03-interface-graphique|interface graphique]] · commandes : [[90-aide-memoire|aide-mémoire]].
