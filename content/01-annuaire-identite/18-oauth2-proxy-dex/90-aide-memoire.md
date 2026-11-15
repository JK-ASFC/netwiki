---
title: OAuth2 Proxy et Dex — aide-mémoire des commandes
description: Référence complète des commandes OAuth2 Proxy et Dex avec exemples — OAuth2 Proxy (secret de cookie, fichier de configuration OIDC, groupes autorisés, conteneur et Compose, intégration Nginx auth_request, points de terminaison /oauth2/*, santé et métriques, tests curl), Dex (config.yaml, stockage, connecteur LDAP Active Directory, clients statiques, conteneur, Helm, découverte et clés, tests ldapsearch), authentification Kubernetes par OIDC (paramètres de l'API server, kubelogin, liaison de rôle à un groupe, whoami) et décodage d'un JWT.
tags: [aide-mémoire, oauth2-proxy, dex, oidc, sso, kubernetes, kubelogin, nginx, ldap]
icon: terminal
---

Références : [[01-oauth2-proxy|OAuth2 Proxy]], [[02-dex|Dex]]. Exemples : Dex `https://dex.corp.exemple.fr`, application protégée `https://grafana.corp.exemple.fr`, annuaire `corp.exemple.fr`.

## OAuth2 Proxy

```bash
# Secret de cookie (32 octets, base64 URL)
openssl rand -base64 32 | tr -- '+/' '-_'
```

```ini /etc/oauth2-proxy.cfg
provider = "oidc"
oidc_issuer_url = "https://dex.corp.exemple.fr"
client_id = "grafana-proxy"
client_secret = "secret-du-client"
cookie_secret = "remplacer-par-le-secret-genere"
cookie_secure = true
cookie_domains = [".corp.exemple.fr"]
whitelist_domains = [".corp.exemple.fr"]
email_domains = ["*"]
allowed_groups = ["GG-Grafana"]
redirect_url = "https://grafana.corp.exemple.fr/oauth2/callback"
http_address = "127.0.0.1:4180"
reverse_proxy = true
set_xauthrequest = true
skip_provider_button = true
upstreams = ["static://202"]
```

```bash
oauth2-proxy --config /etc/oauth2-proxy.cfg
docker run -d --name oauth2-proxy -p 127.0.0.1:4180:4180 -v /etc/oauth2-proxy.cfg:/oauth2-proxy.cfg:ro quay.io/oauth2-proxy/oauth2-proxy:latest --config /oauth2-proxy.cfg
docker run --rm quay.io/oauth2-proxy/oauth2-proxy:latest --version
docker logs -f oauth2-proxy
```

```nginx /etc/nginx/sites-available/grafana (extrait)
location /oauth2/ {
    proxy_pass       http://127.0.0.1:4180;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
location = /oauth2/auth {
    proxy_pass       http://127.0.0.1:4180;
    proxy_set_header Host $host;
    proxy_set_header Content-Length "";
    proxy_pass_request_body off;
}
location / {
    auth_request /oauth2/auth;
    error_page 401 = /oauth2/sign_in;
    auth_request_set $user  $upstream_http_x_auth_request_user;
    auth_request_set $email $upstream_http_x_auth_request_email;
    proxy_set_header X-User  $user;
    proxy_set_header X-Email $email;
    proxy_pass http://127.0.0.1:3000;
}
```

| Point de terminaison | Rôle |
| --- | --- |
| `/oauth2/sign_in`, `/oauth2/start` | Page de connexion, début du flux OIDC |
| `/oauth2/callback` | Retour du fournisseur (URL déclarée chez Dex) |
| `/oauth2/auth` | Vérification pour `auth_request` : 202 connecté, 401 sinon |
| `/oauth2/userinfo` | Identité de la session (JSON) |
| `/oauth2/sign_out` | Déconnexion (cookie supprimé) |
| `/ping`, `/ready` | Santé (sans authentification) |

```bash
curl -s http://127.0.0.1:4180/ping ; curl -s http://127.0.0.1:4180/ready
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4180/oauth2/auth                 # 401 sans cookie
curl -s -o /dev/null -w '%{http_code}\n' -H "Cookie: _oauth2_proxy=$COOKIE" http://127.0.0.1:4180/oauth2/auth   # 202 avec une session valide
curl -s -H "Cookie: _oauth2_proxy=$COOKIE" https://grafana.corp.exemple.fr/oauth2/userinfo | jq .
```

## Dex

```yaml /etc/dex/config.yaml
issuer: https://dex.corp.exemple.fr
storage:
  type: sqlite3
  config:
    file: /var/dex/dex.db
web:
  http: 0.0.0.0:5556
connectors:
  - type: ldap
    id: ad
    name: Active Directory
    config:
      host: dc01.corp.exemple.fr:636
      rootCA: /etc/dex/ca-corp.crt
      bindDN: CN=svc-dex,OU=Services,DC=corp,DC=exemple,DC=fr
      bindPW: $DEX_LDAP_BINDPW
      usernamePrompt: Identifiant
      userSearch:
        baseDN: OU=Utilisateurs,DC=corp,DC=exemple,DC=fr
        filter: "(objectClass=person)"
        username: sAMAccountName
        idAttr: objectGUID
        emailAttr: mail
        nameAttr: displayName
      groupSearch:
        baseDN: OU=Groupes,DC=corp,DC=exemple,DC=fr
        filter: "(objectClass=group)"
        userMatchers:
          - userAttr: DN
            groupAttr: member
        nameAttr: cn
staticClients:
  - id: grafana-proxy
    name: Grafana
    secret: secret-du-client
    redirectURIs:
      - https://grafana.corp.exemple.fr/oauth2/callback
  - id: kubernetes
    name: Kubernetes
    secret: secret-client-kubernetes
    redirectURIs:
      - http://localhost:8000
```

Dex remplace `$DEX_LDAP_BINDPW` par la variable d'environnement correspondante : le mot de passe reste hors du fichier.

```bash
dex serve /etc/dex/config.yaml
docker run -d --name dex -p 127.0.0.1:5556:5556 -e DEX_LDAP_BINDPW="$MDP" -v /etc/dex:/etc/dex:ro -v dex-data:/var/dex ghcr.io/dexidp/dex:latest dex serve /etc/dex/config.yaml
docker exec dex dex version
helm repo add dex https://charts.dexidp.io && helm upgrade --install dex dex/dex --namespace dex --create-namespace -f valeurs-dex.yaml

curl -s https://dex.corp.exemple.fr/.well-known/openid-configuration | jq '{issuer, authorization_endpoint, token_endpoint, jwks_uri}'
curl -s https://dex.corp.exemple.fr/keys | jq '.keys[] | {kid, alg}'
docker logs -f dex 2>&1 | grep -E "level=error|failed"
# Vérifier ce que Dex verra dans l'annuaire
ldapsearch -H ldaps://dc01.corp.exemple.fr -D "CN=svc-dex,OU=Services,DC=corp,DC=exemple,DC=fr" -W -b "OU=Utilisateurs,DC=corp,DC=exemple,DC=fr" "(sAMAccountName=alice)" mail displayName memberOf
```

## Kubernetes avec OIDC (Dex)

```text Paramètres de kube-apiserver
--oidc-issuer-url=https://dex.corp.exemple.fr
--oidc-client-id=kubernetes
--oidc-username-claim=email
--oidc-groups-claim=groups
```

```bash
# Poste de l'administrateur : greffon kubelogin
kubectl krew install oidc-login
kubectl oidc-login setup --oidc-issuer-url=https://dex.corp.exemple.fr --oidc-client-id=kubernetes --oidc-client-secret=secret-client-kubernetes
kubectl config set-credentials oidc --exec-api-version=client.authentication.k8s.io/v1beta1 --exec-command=kubectl --exec-arg=oidc-login --exec-arg=get-token --exec-arg=--oidc-issuer-url=https://dex.corp.exemple.fr --exec-arg=--oidc-client-id=kubernetes --exec-arg=--oidc-client-secret=secret-client-kubernetes
kubectl --user=oidc get nodes
kubectl --user=oidc auth whoami

# Droits donnés à un groupe de l'annuaire
kubectl create clusterrolebinding admins-k8s-oidc --clusterrole=cluster-admin --group=GG-Admins-K8s
kubectl create rolebinding lecture-prod --clusterrole=view --group=GG-Dev --namespace=production
kubectl auth can-i list pods --as=alice@exemple.fr --as-group=GG-Dev -n production
```

## Décoder un JWT (sans vérifier la signature)

```bash
P=$(printf '%s' "$JETON" | cut -d. -f2 | tr '_-' '/+'); while [ $(( ${#P} % 4 )) -ne 0 ]; do P="$P="; done; printf '%s' "$P" | base64 -d | jq .
```
