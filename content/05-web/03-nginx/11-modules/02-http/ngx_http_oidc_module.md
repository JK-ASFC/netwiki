---
title: "ngx_http_oidc_module"
description: "Module nginx ngx_http_oidc_module — The ngx_http_oidc_module module (1.27.4) implements authentication as a Relying Party in OpenID Connect using the Authorization Code Flow."
tags: [nginx, module, ngx_http_oidc_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_oidc_module` module (1.27.4) implements authentication as a Relying Party in OpenID Connect using the [Authorization Code Flow](https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth).

The module expects the OpenID Provider's configuration to be available via [metadata](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig) and requires dynamic [[12-directives/resolver-http-core|resolver]].

The module can be combined with other access modules via the [[12-directives/satisfy|satisfy]] directive. Note that the module may still block requests even with `satisfy any;` as an OpenID Provider might not redirect the user back to nginx.

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

The example assumes that the “`https://<nginx-host>/oidc_callback`” Redirection URI is configured on the OpenID Provider's side. The path can be customized with the [[12-directives/redirect-uri|redirect_uri]] directive.

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
