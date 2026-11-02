---
title: OAuth2 Proxy et Dex — aide-mémoire des commandes
description: Commandes OAuth2 Proxy et Dex avec exemples — génération du secret de cookie, lancement en conteneur, vérification de la configuration, points de contrôle (ping, ready, metrics), test de l'en-tête d'authentification, découverte OIDC de Dex, test LDAP, kubelogin et décodage d'un jeton.
tags: [aide-mémoire, oauth2-proxy, dex, oidc, kubelogin]
icon: terminal
---

Références : [[01-oauth2-proxy|OAuth2 Proxy]], [[02-dex|Dex]].

```bash
openssl rand -base64 32 | tr -- '+/' '-_'                            # secret de cookie
docker run --rm quay.io/oauth2-proxy/oauth2-proxy:latest --version
docker logs -f oauth2-proxy
curl -s http://127.0.0.1:4180/ping ; curl -s http://127.0.0.1:4180/ready ; curl -s http://127.0.0.1:4180/metrics | head
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4180/oauth2/auth   # 401 sans cookie
curl -s https://dex.corp.exemple.fr/.well-known/openid-configuration | jq '{issuer, authorization_endpoint, token_endpoint}'
docker exec dex dex version
ldapsearch -H ldaps://dc01.corp.exemple.fr -D "CN=svc-dex,OU=Services,DC=corp,DC=exemple,DC=fr" -W -b "OU=Utilisateurs,DC=corp,DC=exemple,DC=fr" "(sAMAccountName=alice)" memberOf
kubectl oidc-login setup --oidc-issuer-url=https://dex.corp.exemple.fr --oidc-client-id=kubernetes --oidc-client-secret=secret-client-kubernetes
kubectl --user=oidc auth whoami
echo "$JETON" | cut -d. -f2 | base64 -d 2>/dev/null | jq .            # contenu d'un jeton JWT (revendications)
```
