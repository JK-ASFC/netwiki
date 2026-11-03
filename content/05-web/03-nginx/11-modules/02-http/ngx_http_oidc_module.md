---
title: "ngx_http_oidc_module"
description: "Module nginx ngx_http_oidc_module — Le module ngx_http_oidc_module (1.27.4) met en œuvre l'authentification en tant que partie de confiance (Relying Party) OpenID Connect avec le flux de code d'autorisation."
tags: [nginx, module, ngx_http_oidc_module]
icon: puzzle
---

Le module `ngx_http_oidc_module` (1.27.4) met en œuvre l'authentification en tant que partie de confiance (*Relying Party*) OpenID Connect avec le [flux de code d'autorisation](https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth).

Le module attend que la configuration du fournisseur OpenID soit disponible via ses [métadonnées](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig) et nécessite un [[12-directives/resolver-http-core|résolveur]] dynamique.

Le module peut être combiné avec d'autres modules d'accès à l'aide de la directive [[12-directives/satisfy|satisfy]]. Il peut toutefois bloquer des requêtes même avec `satisfy any;`, car un fournisseur OpenID peut ne pas rediriger l'utilisateur vers nginx.

> [!NOTE]
> Ce module est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

## Exemple de configuration

```nginx
http {
    resolver 10.0.0.1;

    oidc_provider my_idp {
        issuer        "https://provider.domain";
        client_id     "unique_id";
        client_secret "unique_secret";
    }

    server {
        location / {
            auth_oidc my_idp;

            proxy_set_header username $oidc_claim_sub;
            proxy_pass       http://backend;
        }
    }
}
```

L'exemple suppose que l'URI de redirection « `https://<nginx-host>/oidc_callback` » est configuré côté fournisseur OpenID. Le chemin se personnalise avec la directive [[12-directives/redirect-uri|redirect_uri]].

## Directives

- [[12-directives/oidc-provider|oidc_provider]]
- [[12-directives/auth-oidc|auth_oidc]]
- [[12-directives/issuer|issuer]]
- [[12-directives/client-id|client_id]]
- [[12-directives/client-secret|client_secret]]
- [[12-directives/config-url|config_url]]
- [[12-directives/cookie-name|cookie_name]]
- [[12-directives/extra-auth-args|extra_auth_args]]
- [[12-directives/frontchannel-logout-uri|frontchannel_logout_uri]]
- [[12-directives/pkce|pkce]]
- [[12-directives/redirect-uri|redirect_uri]]
- [[12-directives/logout-uri|logout_uri]]
- [[12-directives/post-logout-uri|post_logout_uri]]
- [[12-directives/logout-token-hint|logout_token_hint]]
- [[12-directives/scope|scope]]
- [[12-directives/session-store|session_store]]
- [[12-directives/session-sync-leeway|session_sync_leeway]]
- [[12-directives/session-timeout|session_timeout]]
- [[12-directives/ssl-crl-http-oidc|ssl_crl]]
- [[12-directives/ssl-trusted-certificate-http-oidc|ssl_trusted_certificate]]
- [[12-directives/userinfo|userinfo]]

## Variables intégrées

- [[13-variables/oidc-id-token|$oidc_id_token]]
- [[13-variables/oidc-access-token|$oidc_access_token]]
- [[13-variables/oidc-claim-name|$oidc_claim_name]]
- [[13-variables/oidc-userinfo|$oidc_userinfo]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
