---
title: Nebula
description: Nebula — réseau overlay pair à pair open source (MIT) créé par Slack puis maintenu par Defined Networking : autorité de certification et certificats d'hôtes (nebula-cert), lighthouses, traversée de NAT et relais, pare-feu par groupes dans les certificats, config.yml, installation Linux, Windows, macOS, mobiles, service systemd, rotation des certificats et comparaison avec WireGuard, Tailscale et NetBird.
tags: [nebula, overlay, mesh, pki, vpn, slack, defined networking]
icon: info
---

**Nebula** construit un réseau privé chiffré (protocole Noise) entre machines, sans serveur central de gestion : l'identité de chaque hôte est un **certificat** signé par votre autorité, qui porte son adresse overlay et ses **groupes** ; le pare-feu de chaque nœud filtre selon ces groupes. Les **lighthouses** (phares) servent seulement d'annuaire pour se trouver.

## Installation

```bash
# Binaires nebula et nebula-cert depuis les releases GitHub (Linux, Windows, macOS, FreeBSD, ARM)
sudo apt install nebula                 # Debian/Ubuntu récents (paquet de la distribution)
sudo dnf install nebula                 # Fedora / EPEL
brew install nebula                     # macOS
```

Applications mobiles : *Mobile Nebula* (Android, iOS). Version gérée : **Defined Networking** (offre commerciale).

## PKI

```bash
nebula-cert ca -name "Corp Nebula CA" -duration 17520h       # ca.crt / ca.key (clé à garder hors ligne)
nebula-cert sign -name "lighthouse1" -ip "10.42.0.1/16"
nebula-cert sign -name "srv-web-01" -ip "10.42.1.10/16" -groups "serveurs,web"
nebula-cert sign -name "poste-jk" -ip "10.42.2.20/16" -groups "admins"
nebula-cert print -path srv-web-01.crt
```

Copier `ca.crt`, `<hôte>.crt` et `<hôte>.key` dans `/etc/nebula/` de chaque machine.

## `config.yml` (hôte ordinaire)

```yaml
pki:
  ca: /etc/nebula/ca.crt
  cert: /etc/nebula/srv-web-01.crt
  key: /etc/nebula/srv-web-01.key
static_host_map:
  "10.42.0.1": ["198.51.100.10:4242"]      # adresse publique du lighthouse
lighthouse:
  am_lighthouse: false
  hosts: ["10.42.0.1"]
listen:
  host: 0.0.0.0
  port: 4242
punchy:
  punch: true
relay:
  use_relays: true
tun:
  dev: nebula1
firewall:
  outbound:
    - port: any
      proto: any
      host: any
  inbound:
    - port: any
      proto: icmp
      host: any
    - port: 443
      proto: tcp
      host: any                            # « groups: [a, b] » exigerait les DEUX groupes (ET logique)
    - port: 22
      proto: tcp
      group: admins
```

Lighthouse : `am_lighthouse: true`, `hosts: []`, port UDP 4242 ouvert sur Internet.

```bash
sudo nebula -config /etc/nebula/config.yml -test     # vérifier
sudo systemctl enable --now nebula
ping 10.42.0.1
```

> [!WARNING]
> Les certificats expirent (par défaut, ceux des hôtes un peu avant la CA) : planifiez leur renouvellement et la **rotation de la CA** (plusieurs CA peuvent être approuvées simultanément dans `ca.crt`).

Comparaison : NetBird et [[05-tailscale-headscale/01-presentation-installation|Tailscale]] offrent SSO et gestion centralisée ; Nebula privilégie la simplicité et l'autonomie (aucun serveur de contrôle), au prix d'une PKI à gérer. Commandes : [[90-aide-memoire|aide-mémoire]].
