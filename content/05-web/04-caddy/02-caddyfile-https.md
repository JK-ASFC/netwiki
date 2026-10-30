---
title: Caddyfile, HTTPS automatique et sites
description: Structure du Caddyfile (options globales, blocs de site, extraits, matchers, placeholders), fonctionnement du HTTPS automatique (HTTP-01, TLS-ALPN-01, DNS-01), redirections, en-têtes, fichiers statiques, PHP, authentification basique et gestion des erreurs.
tags: [caddy, caddyfile, https, acme, letsencrypt, matchers, php]
icon: file-code
---

## Structure

```caddy /etc/caddy/Caddyfile
# 1. Options globales (un seul bloc, en tête)
{
    email admin@exemple.fr
    # acme_ca https://acme-staging-v02.api.letsencrypt.org/directory   # tests sans limite de taux
    servers {
        protocols h1 h2 h3
    }
}

# 2. Extraits réutilisables
(securite) {
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "SAMEORIGIN"
        Referrer-Policy "strict-origin-when-cross-origin"
        -Server
    }
}

# 3. Blocs de site
www.exemple.fr, exemple.fr {
    import securite
    root * /srv/www/site
    encode zstd gzip
    file_server
}
```

| Élément | Syntaxe |
| --- | --- |
| Adresse de site | `exemple.fr`, `*.exemple.fr`, `:8080`, `http://intranet`, `https://10.0.0.5`, `localhost` |
| Directive | `nom arguments… { sous-directives }` |
| Matcher | `*` (tout), `/chemin*`, `@nom` (nommé) |
| Extrait | `(nom) { … }` puis `import nom` (avec arguments : `{args[0]}`) |
| Variable d'environnement | `{$NOM}` (au chargement), `{env.NOM}` (à l'exécution) |
| Placeholder | `{host}`, `{uri}`, `{path}`, `{query}`, `{remote_host}`, `{http.request.header.User-Agent}` |
| Inclusion de fichiers | `import /etc/caddy/sites/*.caddy` |

## HTTPS automatique

Caddy active le HTTPS automatique pour toute adresse de site qui est un **nom de domaine** (ou `localhost` / une IP avec un certificat interne) :

1. Obtention du certificat auprès de Let's Encrypt (puis ZeroSSL en secours).
2. Redirection automatique HTTP → HTTPS.
3. Renouvellement en arrière-plan (au tiers de la durée de vie restante), agrafage OCSP si disponible.

| Défi ACME | Condition |
| --- | --- |
| **HTTP-01** | Port 80 joignable depuis Internet |
| **TLS-ALPN-01** | Port 443 joignable depuis Internet |
| **DNS-01** | Module DNS du fournisseur (seul possible pour un **wildcard** ou un serveur non exposé) |

```caddy
# Wildcard avec validation DNS (binaire compilé avec le module caddy-dns/… correspondant)
*.exemple.fr {
    tls {
        dns ovh {
            endpoint ovh-eu
            application_key {env.OVH_AK}
            application_secret {env.OVH_AS}
            consumer_key {env.OVH_CK}
        }
    }
    @wiki host wiki.exemple.fr
    handle @wiki {
        reverse_proxy 10.0.30.20:3000
    }
    handle {
        respond "Site inconnu" 404
    }
}
```

Le module `rfc2136` permet la validation DNS auprès d'un [[01-bind9/08-ddns-nsupdate|BIND à mises à jour dynamiques]].

### Certificats fournis manuellement ou internes

```caddy
intranet.corp.exemple.fr {
    tls /etc/caddy/certs/intranet.fullchain.pem /etc/caddy/certs/intranet.key   # certificat d'AD CS par exemple
}

app.lab.local {
    tls internal            # certificat signé par l'AC locale de Caddy (voir l'article PKI)
}

http://interne.local {      # forcer HTTP uniquement (pas de TLS)
    respond "OK"
}
```

## Matchers

```caddy
exemple.fr {
    @api path /api/*
    @statique path *.css *.js *.png *.svg *.woff2
    @admin {
        path /admin*
        not remote_ip 10.0.10.0/24
    }
    @mobile header User-Agent *Mobile*
    @post method POST

    respond @admin "Accès refusé" 403
    header @statique Cache-Control "public, max-age=31536000, immutable"
    reverse_proxy @api 127.0.0.1:8080
    file_server
}
```

Types de matchers : `path`, `path_regexp`, `host`, `method`, `header`, `header_regexp`, `query`, `remote_ip`, `client_ip`, `protocol`, `expression` (CEL), `not`, `file` (existence de fichier).

## Ordre des directives et handle

Caddy applique un **ordre prédéfini** des directives (ex. `redir` avant `rewrite` avant `reverse_proxy` avant `file_server`), indépendamment de leur position dans le fichier. Pour imposer un ordre ou des branches exclusives :

| Bloc | Effet |
| --- | --- |
| `handle [matcher] { }` | Branches **mutuellement exclusives** (la première qui correspond) |
| `handle_path /prefixe/* { }` | Comme `handle`, en retirant le préfixe du chemin |
| `route [matcher] { }` | Exécute les directives **dans l'ordre écrit** |
| `handle_errors { }` | Traitement des erreurs (pages personnalisées) |

```caddy
exemple.fr {
    handle_path /docs/* {
        root * /srv/docs
        file_server browse
    }
    handle /api/* {
        reverse_proxy 127.0.0.1:8080
    }
    handle {
        root * /srv/spa
        try_files {path} /index.html      # application monopage
        file_server
    }
    handle_errors {
        @404 expression {err.status_code} == 404
        rewrite @404 /404.html
        file_server { root /srv/erreurs }
    }
}
```

## Redirections et réécritures

```caddy
exemple.fr {
    redir https://www.exemple.fr{uri} permanent
}

www.exemple.fr {
    redir /ancienne-page /nouvelle-page 301
    redir /blog/* https://blog.exemple.fr{uri}
    rewrite /produit/* /catalogue.php?ref={path.1}
    uri strip_prefix /v1
}
```

## PHP

```caddy
cms.exemple.fr {
    root * /srv/www/cms/public
    php_fastcgi unix//run/php/php8.2-fpm-cms.sock    # gère index.php, try_files, en-têtes FastCGI
    file_server
    encode gzip
    @interdit path /uploads/*.php /.env /.git*
    respond @interdit 403
}
```

## Authentification basique

```bash
caddy hash-password --plaintext 'MotDePasseSolide'
```

```caddy
admin.exemple.fr {
    basic_auth /admin/* {
        alice $2a$14$Zkx19XLiW6VYouLHR5NmfO...   # hachage bcrypt
    }
    reverse_proxy 127.0.0.1:9000
}
```

(`basicauth` est l'ancien nom de la directive, encore accepté.)

## Fichiers statiques

```caddy
fichiers.exemple.fr {
    root * /srv/partage
    file_server browse {
        hide .* *.tmp
        precompressed zstd br gzip      # sert app.js.br / .gz s'ils existent
    }
}
```

## Plusieurs fichiers et environnements

```caddy /etc/caddy/Caddyfile
{
    email {$ACME_EMAIL}
}
import /etc/caddy/snippets/*.caddy
import /etc/caddy/sites/*.caddy
```

Variables chargées par systemd : `sudo systemctl edit caddy` → `[Service] EnvironmentFile=/etc/caddy/caddy.env`.

## Bonnes pratiques

> [!TIP]
> - Tester avec l'AC **staging** de Let's Encrypt (`acme_ca`) avant la production, pour ne pas atteindre les limites de taux.
> - `caddy fmt --overwrite` et `caddy validate` avant chaque `reload`.
> - Versionner `/etc/caddy` dans Git ; sauvegarder `/var/lib/caddy`.
> - Les ports 80 et 443 doivent rester joignables depuis Internet pour les défis HTTP/TLS-ALPN ; sinon, utiliser DNS-01.
