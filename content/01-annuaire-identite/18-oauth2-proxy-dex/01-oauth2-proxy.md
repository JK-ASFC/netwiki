---
title: OAuth2 Proxy
description: OAuth2 Proxy — proxy inverse et service d'authentification qui place une connexion OIDC/OAuth2 (Keycloak, Authentik, Entra ID, Google, GitHub, Dex) devant une application sans SSO, modes proxy inverse ou auth_request (Nginx, Traefik ForwardAuth, ingress Kubernetes), installation (binaire, conteneur, Helm), configuration (fournisseur OIDC, cookie, domaines, groupes autorisés, en-têtes transmis), sessions Redis, sécurité et dépannage.
tags: [oauth2-proxy, oidc, sso, forward auth, nginx auth_request, kubernetes ingress]
icon: shield
---

**OAuth2 Proxy** (CNCF sandbox, MIT) ajoute une **authentification OIDC** devant n'importe quelle application web (tableau de bord interne, outil sans gestion d'utilisateurs, Prometheus, Kibana…) : l'utilisateur est redirigé vers le fournisseur d'identité ([[05-keycloak/01-presentation-installation|Keycloak]], [[13-authentik/01-presentation-installation|Authentik]], Entra ID, Google, [[02-dex|Dex]]), puis OAuth2 Proxy laisse passer la requête avec des en-têtes d'identité.

| Mode | Fonctionnement |
| --- | --- |
| **Proxy inverse** | OAuth2 Proxy reçoit le trafic et le transmet à l'application (`--upstream`) |
| **auth_request / ForwardAuth** | Nginx ou Traefik demande `/oauth2/auth` à chaque requête ; OAuth2 Proxy répond 202 (autorisé) ou 401 |

## Installation

```bash
# Binaire (Linux, macOS, Windows) depuis les Releases GitHub, ou conteneur :
docker run -d --name oauth2-proxy -p 4180:4180 --env-file /etc/oauth2-proxy.env quay.io/oauth2-proxy/oauth2-proxy:latest
# Kubernetes
helm repo add oauth2-proxy https://oauth2-proxy.github.io/manifests && helm install oauth2-proxy oauth2-proxy/oauth2-proxy -f valeurs.yaml
```

## Configuration (fournisseur OIDC)

```bash /etc/oauth2-proxy.env
OAUTH2_PROXY_PROVIDER=oidc
OAUTH2_PROXY_OIDC_ISSUER_URL=https://sso.corp.exemple.fr/realms/corp
OAUTH2_PROXY_CLIENT_ID=prometheus
OAUTH2_PROXY_CLIENT_SECRET=secret-du-client
# secret de cookie généré par : openssl rand -base64 32 | tr -- '+/' '-_'
OAUTH2_PROXY_COOKIE_SECRET=q3x0Vt8d1mJ9cZ4pR7sW2yK5nH6aB0eF1gL3iM8oU4E=
OAUTH2_PROXY_COOKIE_DOMAINS=.corp.exemple.fr
OAUTH2_PROXY_WHITELIST_DOMAINS=.corp.exemple.fr
OAUTH2_PROXY_EMAIL_DOMAINS=corp.exemple.fr
OAUTH2_PROXY_ALLOWED_GROUPS=supervision
OAUTH2_PROXY_UPSTREAMS=http://10.0.40.10:9090
OAUTH2_PROXY_HTTP_ADDRESS=0.0.0.0:4180
OAUTH2_PROXY_REVERSE_PROXY=true
OAUTH2_PROXY_SET_XAUTHREQUEST=true
OAUTH2_PROXY_PASS_ACCESS_TOKEN=false
OAUTH2_PROXY_SKIP_PROVIDER_BUTTON=true
```

Côté fournisseur : client confidentiel, URI de redirection `https://prometheus.corp.exemple.fr/oauth2/callback`, revendication `groups` dans le jeton.

## Avec Nginx (auth_request)

```nginx
location /oauth2/ {
  proxy_pass http://127.0.0.1:4180;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Auth-Request-Redirect $request_uri;
}
location = /oauth2/auth {
  proxy_pass http://127.0.0.1:4180;
  proxy_set_header Host $host;
  proxy_set_header Content-Length "";
  proxy_pass_request_body off;
}
location / {
  auth_request /oauth2/auth;
  error_page 401 = /oauth2/sign_in;
  auth_request_set $user $upstream_http_x_auth_request_user;
  auth_request_set $email $upstream_http_x_auth_request_email;
  proxy_set_header X-User $user;
  proxy_set_header X-Email $email;
  proxy_pass http://10.0.40.10:9090;
}
```

Ingress-NGINX (Kubernetes) : annotations `nginx.ingress.kubernetes.io/auth-url: "https://$host/oauth2/auth"` et `auth-signin: "https://$host/oauth2/start?rd=$escaped_request_uri"`. Traefik : middleware `forwardAuth` vers `http://oauth2-proxy:4180/oauth2/auth`.

## Exploitation

- Sessions volumineuses (jetons, groupes) : stockage **Redis** (`OAUTH2_PROXY_SESSION_STORE_TYPE=redis`) plutôt que cookies découpés.
- Points de contrôle : `/ping`, `/ready`, `/metrics` (Prometheus).
- Dépannage : `--show-debug-on-error`, journaux de la sortie standard ; erreur « Invalid redirect » = domaine absent de `WHITELIST_DOMAINS` ; boucle de connexion = cookie refusé (domaine, `Secure`, horloge).

Commandes : [[90-aide-memoire|aide-mémoire]].
