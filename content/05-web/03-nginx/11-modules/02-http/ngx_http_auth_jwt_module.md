---
title: "ngx_http_auth_jwt_module"
description: "Module nginx ngx_http_auth_jwt_module — Le module ngx_http_auth_jwt_module (1.11.3) autorise les clients en validant le JSON Web Token (JWT) fourni à l'aide des clés indiquées. Il prend en charge JSON Web Signature (JWS), JSON Web Encryption (JWE) (1.19.7) et…"
tags: [nginx, module, ngx_http_auth_jwt_module]
icon: puzzle
---

Le module `ngx_http_auth_jwt_module` (1.11.3) autorise les clients en validant le [JSON Web Token](https://datatracker.ietf.org/doc/html/rfc7519) (JWT) fourni à l'aide des clés indiquées. Il prend en charge [JSON Web Signature](https://datatracker.ietf.org/doc/html/rfc7515) (JWS), [JSON Web Encryption](https://datatracker.ietf.org/doc/html/rfc7516) (JWE) (1.19.7) et les JWT imbriqués (1.21.0). Il peut servir à l'authentification [OpenID Connect](http://openid.net/specs/openid-connect-core-1_0.html).

Le module peut être combiné avec d'autres modules d'accès, comme [[11-modules/02-http/ngx_http_access_module|ngx_http_access_module]], [[11-modules/02-http/ngx_http_auth_basic_module|ngx_http_auth_basic_module]] et [[11-modules/02-http/ngx_http_auth_request_module|ngx_http_auth_request_module]], à l'aide de la directive [[12-directives/satisfy|satisfy]].

> [!NOTE]
> Ce module est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

## Algorithmes pris en charge

Le module prend en charge les [algorithmes](https://www.iana.org/assignments/jose/jose.xhtml#web-signature-encryption-algorithms) JSON Web suivants.

Algorithmes JWS :

- HS256, HS384, HS512
- RS256, RS384, RS512
- ES256, ES384, ES512
- EdDSA (signatures Ed25519 et Ed448) (1.15.7)
- PS256, PS384, PS512 (1.29.0)

> [!NOTE]
> Avant la version 1.13.7, seuls les algorithmes HS256, RS256 et ES256 étaient pris en charge.

Algorithmes JWE de chiffrement du contenu (1.19.7) :

- A128CBC-HS256, A192CBC-HS384, A256CBC-HS512
- A128GCM, A192GCM, A256GCM

Algorithmes JWE de gestion des clés (1.19.9) :

- A128KW, A192KW, A256KW
- A128GCMKW, A192GCMKW, A256GCMKW
- dir : utilisation directe d'une clé symétrique partagée comme clé de chiffrement du contenu
- RSA-OAEP, RSA-OAEP-256, RSA-OAEP-384, RSA-OAEP-512 (1.21.0)

## Exemple de configuration

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
