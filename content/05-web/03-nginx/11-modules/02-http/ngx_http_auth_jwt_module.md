---
title: "ngx_http_auth_jwt_module"
description: "Module nginx ngx_http_auth_jwt_module — The ngx_http_auth_jwt_module module (1.11.3) implements client authorization by validating the provided JSON Web Token (JWT) using the specified keys. The module supports JSON Web Signature (JWS), JSON Web Encryption…"
tags: [nginx, module, ngx_http_auth_jwt_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_auth_jwt_module` module (1.11.3) implements client authorization by validating the provided [JSON Web Token](https://datatracker.ietf.org/doc/html/rfc7519) (JWT) using the specified keys. The module supports [JSON Web Signature](https://datatracker.ietf.org/doc/html/rfc7515) (JWS), [JSON Web Encryption](https://datatracker.ietf.org/doc/html/rfc7516) (JWE) (1.19.7), and Nested JWT (1.21.0). The module can be used for [OpenID Connect](http://openid.net/specs/openid-connect-core-1_0.html) authentication.

The module may be combined with other access modules, such as [[11-modules/02-http/ngx_http_access_module|ngx_http_access_module]], [[11-modules/02-http/ngx_http_auth_basic_module|ngx_http_auth_basic_module]], and [[11-modules/02-http/ngx_http_auth_request_module|ngx_http_auth_request_module]], via the [[12-directives/satisfy|satisfy]] directive.

> [!NOTE]
> This module is available as part of our [abonnement commercial](https://nginx.com/products/).

## Supported Algorithms

The module supports the following JSON Web [Algorithms](https://www.iana.org/assignments/jose/jose.xhtml#web-signature-encryption-algorithms).

JWS algorithms:

- HS256, HS384, HS512
- RS256, RS384, RS512
- ES256, ES384, ES512
- EdDSA (Ed25519 and Ed448 signatures) (1.15.7)
- PS256, PS384, PS512 (1.29.0)

> [!NOTE]
> Prior to version 1.13.7, only HS256, RS256, ES256 algorithms were supported.

JWE content encryption algorithms (1.19.7):

- A128CBC-HS256, A192CBC-HS384, A256CBC-HS512
- A128GCM, A192GCM, A256GCM

JWE key management algorithms (1.19.9):

- A128KW, A192KW, A256KW
- A128GCMKW, A192GCMKW, A256GCMKW
- dir — direct use of a shared symmetric key as the content encryption key
- RSA-OAEP, RSA-OAEP-256, RSA-OAEP-384, RSA-OAEP-512 (1.21.0)

## Example Configuration

```nginx
location / {
    auth_jwt          "closed site";
    auth_jwt_key_file conf/keys.json;
}
```

## Directives

- [[12-directives/auth-jwt|auth_jwt]]
- [[12-directives/auth-jwt-claim-set|auth_jwt_claim_set]]
- [[12-directives/auth-jwt-header-set|auth_jwt_header_set]]
- [[12-directives/auth-jwt-key-cache|auth_jwt_key_cache]]
- [[12-directives/auth-jwt-key-file|auth_jwt_key_file]]
- [[12-directives/auth-jwt-key-request|auth_jwt_key_request]]
- [[12-directives/auth-jwt-leeway|auth_jwt_leeway]]
- [[12-directives/auth-jwt-type|auth_jwt_type]]
- [[12-directives/auth-jwt-require|auth_jwt_require]]

## Variables intégrées

- [[13-variables/jwt-header-name|$jwt_header_name]]
- [[13-variables/jwt-claim-name|$jwt_claim_name]]
- [[13-variables/jwt-payload|$jwt_payload]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
