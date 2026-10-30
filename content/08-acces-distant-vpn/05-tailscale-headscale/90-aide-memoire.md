---
title: Tailscale et Headscale — aide-mémoire des commandes
description: Commandes Tailscale et Headscale avec exemples — client (tailscale up avec options, status, ip, ping, netcheck, routes annoncées, nœud de sortie, SSH Tailscale, serve et funnel, logout), Headscale (serve, utilisateurs, clés de pré-authentification, nœuds, routes, politiques ACL, API), installation sous Linux, Windows et macOS.
tags: [aide-mémoire, tailscale, headscale, wireguard, mesh vpn, acl]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Tailscale et Headscale]].

## Client Tailscale

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up                                            # connexion (ouvre un lien d'authentification)
sudo tailscale up --login-server https://headscale.exemple.fr --authkey "$CLE"     # avec Headscale
sudo tailscale up --advertise-routes=10.0.0.0/16 --accept-routes                  # routeur de sous-réseau
sudo tailscale up --advertise-exit-node                                           # nœud de sortie
sudo tailscale set --exit-node=passerelle-paris --exit-node-allow-lan-access
sudo tailscale up --ssh                                                           # SSH Tailscale
tailscale status
tailscale ip -4
tailscale ping srv-web01
tailscale netcheck                       # NAT, DERP le plus proche, connectivité UDP
tailscale debug derp-map | head
sudo tailscale serve --bg 3000           # publier un service local dans le tailnet (HTTPS)
sudo tailscale funnel --bg 3000          # l'exposer sur Internet (à utiliser avec prudence)
sudo tailscale logout
echo 'net.ipv4.ip_forward = 1' | sudo tee /etc/sysctl.d/99-tailscale.conf && sudo sysctl --system   # routeur/sortie
```

```powershell
winget install Tailscale.Tailscale
tailscale up --login-server https://headscale.exemple.fr
```

macOS : application Tailscale (App Store ou version autonome) ; la CLI est fournie par l'application.

## Headscale (serveur de coordination libre)

```bash
headscale serve                                   # (service systemd en production)
headscale users create reseau
headscale users list
headscale preauthkeys create --user reseau --reusable --expiration 24h
headscale preauthkeys list --user reseau
headscale nodes list
headscale nodes register --user reseau --key mkey:xxxxxxxx           # enregistrement interactif
headscale nodes rename -i 3 srv-web01
headscale nodes expire -i 3
headscale nodes delete -i 3
headscale routes list
headscale routes enable -r 2                       # approuver une route annoncée (versions < 0.26)
headscale nodes approve-routes -i 5 -r 10.0.0.0/16 # versions récentes
headscale policy check --file /etc/headscale/acl.hujson
headscale apikeys create --expiration 90d          # pour une interface web ou l'API
```

## Politique d'accès (ACL)

```json
{
  "groups": { "group:admins": ["amartin@"], "group:reseau": ["bpetit@"] },
  "tagOwners": { "tag:serveurs": ["group:admins"] },
  "acls": [
    { "action": "accept", "src": ["group:admins"], "dst": ["*:*"] },
    { "action": "accept", "src": ["group:reseau"], "dst": ["tag:serveurs:22,443"] }
  ]
}
```
