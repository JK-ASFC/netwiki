---
title: Ory Kratos et Ory Hydra
description: Écosystème Ory (Apache 2.0) — Kratos (gestion d'identités sans interface : inscription, connexion, récupération, vérification, MFA, passkeys, schémas d'identité), Hydra (serveur OAuth2 et OpenID Connect certifié, flux de connexion et de consentement délégués), Keto (autorisations) et Oathkeeper (proxy), installation en conteneurs, configuration YAML, migrations SQL, intégration Kratos + Hydra, CLI ory et administration.
tags: [ory, kratos, hydra, oauth2, oidc, headless, identité, keto]
icon: key-round
---

**Ory** propose des **briques sans interface** (*headless*) à intégrer dans vos propres écrans, conçues pour de très gros volumes :

| Brique | Rôle |
| --- | --- |
| **Kratos** | Gestion des identités : inscription, connexion, récupération, vérification d'e-mail, MFA (TOTP, WebAuthn, passkeys), profils selon un **schéma JSON** |
| **Hydra** | Serveur **OAuth2 / OpenID Connect** certifié ; délègue la connexion et le consentement à votre application (ou à Kratos) |
| Keto | Autorisations (modèle Zanzibar de Google) |
| Oathkeeper | Proxy d'identité et d'accès devant des API |

Il n'y a **pas de console graphique** dans l'édition libre : l'administration passe par l'API et la CLI ; une interface de référence (`kratos-selfservice-ui-node`) sert d'exemple d'écrans.

## Kratos

```yaml kratos.yml (extrait)
dsn: postgres://kratos:MdpKratos@db:5432/kratos?sslmode=disable
serve:
  public: { base_url: https://id.corp.exemple.fr/ }
  admin: { base_url: http://kratos:4434/ }
selfservice:
  default_browser_return_url: https://app.corp.exemple.fr/
  methods:
    password: { enabled: true }
    totp: { enabled: true, config: { issuer: Corp } }
    passkey: { enabled: true, config: { rp: { id: corp.exemple.fr, display_name: Corp, origins: [ "https://id.corp.exemple.fr" ] } } }
  flows:
    login: { ui_url: https://app.corp.exemple.fr/connexion }
    registration: { ui_url: https://app.corp.exemple.fr/inscription }
identity:
  default_schema_id: personne
  schemas: [ { id: personne, url: file:///etc/config/kratos/personne.schema.json } ]
secrets:
  cookie: [ "UnSecretCookieTresLongEtAleatoire" ]
```

```bash
docker run --rm -v $PWD:/etc/config/kratos oryd/kratos:v1.3 migrate sql -e --yes -c /etc/config/kratos/kratos.yml
docker run -d --name kratos -p 4433:4433 -p 4434:4434 -v $PWD:/etc/config/kratos oryd/kratos:v1.3 serve -c /etc/config/kratos/kratos.yml
curl -s http://localhost:4434/admin/identities | jq '.[].traits.email'      # API d'administration (à ne jamais exposer)
```

## Hydra

```bash
docker run --rm oryd/hydra:v2.3 migrate sql -e --yes      # avec DSN dans l'environnement
docker run -d --name hydra -p 4444:4444 -p 4445:4445 -e DSN=postgres://hydra:MdpHydra@db:5432/hydra?sslmode=disable \
  -e URLS_SELF_ISSUER=https://auth.corp.exemple.fr -e URLS_LOGIN=https://app.corp.exemple.fr/login -e URLS_CONSENT=https://app.corp.exemple.fr/consent \
  -e SECRETS_SYSTEM=UnSecretSystemeLongEtAleatoire oryd/hydra:v2.3 serve all
hydra create oauth2-client --endpoint http://localhost:4445 --name grafana --grant-type authorization_code,refresh_token \
  --response-type code --scope openid,profile,email --redirect-uri https://grafana.corp.exemple.fr/login/generic_oauth
hydra list oauth2-clients --endpoint http://localhost:4445
```

Hydra appelle votre page de connexion (`URLS_LOGIN`) avec un *login_challenge* ; celle-ci authentifie l'utilisateur (via Kratos par exemple) puis accepte la demande par l'API d'administration. Les ports d'administration (4434, 4445) doivent rester internes.
