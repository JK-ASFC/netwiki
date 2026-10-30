---
title: "Headscale : serveur de coordination auto-hébergé"
description: Installer et configurer Headscale (paquet, config.yaml, préfixes, DERP intégré, base SQLite ou PostgreSQL, MagicDNS et split DNS, OIDC), le publier derrière un reverse proxy, gérer utilisateurs, clés et nœuds, approuver les routes, appliquer une politique d'accès, interfaces web, sauvegarde et mises à jour.
tags: [headscale, tailscale, auto-hébergé, oidc, derp, reverse proxy, caddy, nginx]
icon: server
---

**Headscale** remplace le plan de contrôle SaaS de Tailscale par un serveur que vous hébergez. Les clients restent les **clients Tailscale officiels** (Linux, Windows, macOS, iOS, Android), configurés pour utiliser votre URL.

| Avantage | Limite |
| --- | --- |
| Données de coordination chez vous, aucune dépendance SaaS | Un seul tailnet par instance |
| Gratuit, open source (BSD) | Pas de Funnel, de journaux de flux, de console d'administration officielle |
| Clients officiels | Évolutions rapides : lire le *changelog* avant chaque mise à jour |

## Installation (Debian / Ubuntu)

```bash
VER=0.26.1                          # adapter à la dernière version publiée
wget https://github.com/juanfont/headscale/releases/download/v${VER}/headscale_${VER}_linux_amd64.deb
sudo apt install ./headscale_${VER}_linux_amd64.deb
sudo nano /etc/headscale/config.yaml
sudo systemctl enable --now headscale
sudo journalctl -u headscale -f
```

Conteneur : image `headscale/headscale` avec `/etc/headscale` et `/var/lib/headscale` en volumes.

## Configuration

```yaml /etc/headscale/config.yaml
server_url: https://headscale.exemple.fr       # URL publique utilisée par les clients
listen_addr: 127.0.0.1:8080                     # derrière un reverse proxy
metrics_listen_addr: 127.0.0.1:9090             # métriques Prometheus
grpc_listen_addr: 127.0.0.1:50443

noise:
  private_key_path: /var/lib/headscale/noise_private.key

prefixes:
  v4: 100.64.0.0/10
  v6: fd7a:115c:a1e0::/48
  allocation: sequential

derp:
  server:
    enabled: true                                # relais DERP intégré
    region_id: 999
    region_code: "par"
    region_name: "Paris (auto-hébergé)"
    stun_listen_addr: "0.0.0.0:3478"
    private_key_path: /var/lib/headscale/derp_server_private.key
    automatically_add_embedded_derp_region: true
  urls:
    - https://controlplane.tailscale.com/derpmap/default   # retirer pour n'utiliser que vos relais
  auto_update_enabled: true
  update_frequency: 24h

database:
  type: sqlite                                   # ou postgres
  sqlite:
    path: /var/lib/headscale/db.sqlite
    write_ahead_log: true

dns:
  magic_dns: true
  base_domain: tailnet.exemple.fr                # ne doit pas englober le nom de server_url
  override_local_dns: true
  nameservers:
    global:
      - 10.0.10.53
      - 10.0.10.54
    split:
      corp.exemple.fr:
        - 10.0.10.53

policy:
  mode: file
  path: /etc/headscale/policy.hujson

log:
  level: info
```

> [!IMPORTANT]
> Ouvrez **TCP 443** (via le reverse proxy) et **UDP 3478** (STUN du DERP intégré). Le relais DERP intégré passe par le même port HTTPS que le plan de contrôle.

## Reverse proxy

Headscale utilise des connexions HTTP **mises à niveau** (protocole Noise, WebSocket) : le proxy doit les transmettre sans mise en tampon.

```caddy /etc/caddy/Caddyfile
headscale.exemple.fr {
    reverse_proxy 127.0.0.1:8080
}
```

```nginx /etc/nginx/sites-available/headscale.conf
map $http_upgrade $connection_upgrade {
    default keep-alive;
    'websocket' upgrade;
    ''          close;
}
server {
    listen 443 ssl;
    http2 on;
    server_name headscale.exemple.fr;
    ssl_certificate     /etc/letsencrypt/live/headscale.exemple.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/headscale.exemple.fr/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $server_name;
        proxy_redirect http:// https://;
        proxy_buffering off;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        add_header Strict-Transport-Security "max-age=15552000; includeSubDomains" always;
    }
}
```

Voir [[04-caddy/03-reverse-proxy-repartition|Caddy]] et [[03-nginx/05-reverse-proxy-repartition|Nginx en reverse proxy]].

## Utilisateurs, clés et nœuds

```bash
sudo headscale users create alice
sudo headscale users list                         # noter l'identifiant (ID) de l'utilisateur

# Clé pré-authentifiée (serveurs, déploiements) — --user attend l'ID dans les versions récentes
sudo headscale preauthkeys create --user 1 --reusable --expiration 24h
sudo headscale preauthkeys create --user 1 --ephemeral --expiration 1h
```

### Inscrire un client

```bash
# Linux
sudo tailscale up --login-server https://headscale.exemple.fr --auth-key <clé>
# ou interactif : le client affiche une URL contenant une clé de nœud, que l'administrateur valide :
sudo headscale nodes register --user alice --key <clé-affichée>
```

| Client | Serveur personnalisé |
| --- | --- |
| Windows | `tailscale login --login-server https://headscale.exemple.fr`, ou politique `LoginURL` (registre / ADMX) |
| macOS | Menu Tailscale (option *Use custom coordination server* / paramètres de compte) ou profil MDM `ControlURL` |
| iOS / Android | Paramètres du compte → serveur de coordination personnalisé |

```bash
sudo headscale nodes list
sudo headscale nodes rename -i 3 routeur-paris
sudo headscale nodes expire -i 5               # forcer la réauthentification
sudo headscale nodes delete -i 5
sudo headscale nodes tag -i 3 -t tag:routeur
```

## Routes et exit nodes

```bash
# Sur le routeur : tailscale up --login-server … --advertise-routes=10.0.0.0/16 --advertise-exit-node
sudo headscale nodes list-routes
sudo headscale nodes approve-routes --identifier 3 --routes 10.0.0.0/16,0.0.0.0/0,::/0
# Versions antérieures à 0.26 : headscale routes list / headscale routes enable -r <id>
```

Les `autoApprovers` de la politique évitent l'approbation manuelle.

## Politique d'accès

Même format HuJSON que Tailscale ([[02-fonctionnalites]]), avec des utilisateurs Headscale (`alice@` pour un utilisateur local, l'adresse e-mail pour un utilisateur OIDC) :

```json /etc/headscale/policy.hujson
{
  "groups": {
    "group:admins": ["alice@"],
  },
  "tagOwners": {
    "tag:routeur": ["group:admins"],
  },
  "acls": [
    {"action": "accept", "src": ["group:admins"], "dst": ["*:*"]},
    {"action": "accept", "src": ["autogroup:member"], "dst": ["10.0.20.0/24:443", "10.0.10.53:53"]},
  ],
  "autoApprovers": {
    "routes": {"10.0.0.0/16": ["tag:routeur"]},
    "exitNode": ["tag:routeur"],
  },
}
```

```bash
sudo headscale policy check --file /etc/headscale/policy.hujson
sudo systemctl reload headscale        # ou redémarrage selon la version
```

## Authentification OIDC (SSO)

```yaml
oidc:
  issuer: https://login.microsoftonline.com/<id-tenant>/v2.0
  client_id: <id-application>
  client_secret_path: /etc/headscale/oidc_secret
  scope: ["openid", "profile", "email"]
  allowed_groups: ["<id-groupe-vpn>"]     # selon le fournisseur ; ou allowed_domains / allowed_users
  pkce:
    enabled: true
```

URI de redirection à déclarer chez le fournisseur : `https://headscale.exemple.fr/oidc/callback`. Le MFA est alors imposé par le fournisseur d'identité (accès conditionnel Entra ID, Keycloak, Authentik…).

## Interfaces web

| Projet | Remarque |
| --- | --- |
| **Headplane** | Interface complète (nœuds, utilisateurs, politique, DNS), intégrable à OIDC |
| headscale-ui | Interface statique légère (clé API) |

```bash
sudo headscale apikeys create --expiration 90d     # clé pour l'interface ou l'API
```

## Sauvegarde et mises à jour

```bash
sudo systemctl stop headscale
sudo tar czf /srv/sauvegardes/headscale-$(date +%F).tgz /etc/headscale /var/lib/headscale
sudo systemctl start headscale
```

- La **clé Noise** (`noise_private.key`) identifie le serveur : la perdre impose de réinscrire tous les nœuds.
- Mettez à jour **version par version** en lisant les notes (migrations de base, changements de commandes et de configuration) ; testez la configuration avec `headscale configtest`.
- PostgreSQL pour les grands déploiements ou si vous l'exploitez déjà.
