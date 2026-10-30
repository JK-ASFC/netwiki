---
title: "Cache avancé : invalidation, grâce, ESI, variations"
description: Invalider le cache (purge, ban par expression, invalidation par étiquettes xkey), servir du contenu périmé (grace, keep, stale-while-revalidate), assembler des pages avec ESI, gérer Vary, compression et variantes mobiles, regroupement des requêtes et pièges hit-for-miss.
tags: [varnish, purge, ban, xkey, grace, esi, vary, invalidation]
icon: refresh-cw
---

## Invalidation

| Méthode | Portée | Usage |
| --- | --- | --- |
| **Purge** | Un objet (URL + Host) et ses variantes | Mise à jour d'un article |
| **Ban** | Tous les objets correspondant à une expression | Rubrique entière, motif d'URL |
| **xkey** (vmod) | Tous les objets portant une **étiquette** | Un produit affiché sur 50 pages |
| TTL court + grâce | — | Contenu changeant souvent |

### Purge

```vcl
acl purgeurs {
    "localhost";
    "10.0.20.0"/24;        # serveurs applicatifs
}

sub vcl_recv {
    if (req.method == "PURGE") {
        if (!client.ip ~ purgeurs) {
            return (synth(405, "Non autorisé"));
        }
        return (purge);
    }
}
```

```bash
curl -X PURGE -H "Host: www.exemple.fr" http://varnish01/actualites/article-42
```

### Ban

```vcl
sub vcl_recv {
    if (req.method == "BAN") {
        if (!client.ip ~ purgeurs) {
            return (synth(405, "Non autorisé"));
        }
        # Le motif est fourni dans un en-tête
        ban("obj.http.x-host == " + req.http.host + " && obj.http.x-url ~ " + req.http.X-Ban-Url);
        return (synth(200, "Ban ajouté"));
    }
}

sub vcl_backend_response {
    # Copier host et URL dans l'objet : bans évalués par le « ban lurker » (en arrière-plan)
    set beresp.http.x-host = bereq.http.host;
    set beresp.http.x-url = bereq.url;
}

sub vcl_deliver {
    unset resp.http.x-host;
    unset resp.http.x-url;
}
```

```bash
curl -X BAN -H "Host: www.exemple.fr" -H "X-Ban-Url: ^/actualites/" http://varnish01/
sudo varnishadm "ban req.http.host == www.exemple.fr && req.url ~ \.css$"   # en ligne de commande
sudo varnishadm ban.list
```

> [!TIP]
> Préférez les bans sur `obj.*` (évaluables par le *ban lurker* en arrière-plan) aux bans sur `req.*` (évalués seulement au prochain accès à chaque objet, la liste de bans grossit).

### xkey : invalidation par étiquettes

```vcl
import xkey;      # paquet varnish-modules

sub vcl_recv {
    if (req.method == "PURGEKEYS") {
        if (!client.ip ~ purgeurs) { return (synth(405)); }
        set req.http.n-gone = xkey.purge(req.http.xkey-purge);
        return (synth(200, "Objets invalidés : " + req.http.n-gone));
    }
}
```

L'application ajoute à ses réponses `xkey: produit-123 categorie-9` ; une modification du produit 123 déclenche `curl -X PURGEKEYS -H "xkey-purge: produit-123" http://varnish01/`. Supporté nativement par de nombreux CMS (Drupal, Magento, Sylius via modules).

## Grâce : servir du périmé plutôt que d'attendre

```vcl
sub vcl_backend_response {
    set beresp.ttl = 2m;          # frais pendant 2 minutes
    set beresp.grace = 6h;        # ensuite servi « périmé » pendant 6 h si besoin
    set beresp.keep = 1d;         # conservé 1 j pour des requêtes conditionnelles (If-Modified-Since)
}

sub vcl_recv {
    # Si le backend est sain, grâce courte (rafraîchissement rapide) ; sinon la grâce complète
    if (std.healthy(req.backend_hint)) {
        set req.grace = 15s;
    }
}
```

Pendant la grâce, Varnish **sert immédiatement** l'objet périmé et le rafraîchit **en arrière-plan** (*stale-while-revalidate*). Si le backend est en panne, le site reste disponible avec le contenu des dernières heures.

Le backend peut piloter cela lui-même : `Cache-Control: max-age=120, stale-while-revalidate=21600`.

## Regroupement des requêtes et hit-for-miss

Quand 1 000 clients demandent simultanément un objet absent, **une seule** requête part vers le backend ; les autres attendent (*request coalescing*). Si la réponse s'avère non cacheable, Varnish crée un objet **hit-for-miss** pour que les suivantes ne s'attendent plus mutuellement :

```vcl
sub vcl_backend_response {
    if (beresp.http.Set-Cookie || beresp.http.Cache-Control ~ "private") {
        set beresp.uncacheable = true;      # hit-for-miss
        set beresp.ttl = 120s;              # durée de la décision
        return (deliver);
    }
}
```

## ESI : assembler des fragments

**Edge Side Includes** : une page mise en cache 1 h contient un fragment personnalisé ou plus volatil, récupéré séparément.

```html
<header>…</header>
<esi:include src="/fragments/panier-resume" />
<main>Contenu de l'article (cache 1 h)</main>
```

```vcl
sub vcl_backend_response {
    if (beresp.http.Surrogate-Control ~ "ESI/1.0") {
        unset beresp.http.Surrogate-Control;
        set beresp.do_esi = true;
    }
    if (bereq.url ~ "^/fragments/panier-resume") {
        set beresp.ttl = 0s;           # fragment toujours récupéré
    }
}
```

L'application signale les pages à analyser avec `Surrogate-Control: content="ESI/1.0"`.

## Variations : Vary, compression, appareils

- Varnish respecte l'en-tête `Vary` : un objet par valeur de l'en-tête indiqué. Un `Vary: User-Agent` crée des milliers de variantes → **normaliser** dans `vcl_recv`.
- Compression : Varnish stocke la version gzip et décompresse pour les rares clients qui ne la supportent pas (`http_gzip_support`, actif par défaut).

```vcl
sub vcl_recv {
    # Variante mobile / bureau seulement
    if (req.http.User-Agent ~ "(?i)mobile|android|iphone") {
        set req.http.X-Device = "mobile";
    } else {
        set req.http.X-Device = "desktop";
    }
    # Langue : ne garder que les langues servies
    if (req.http.Accept-Language ~ "^fr") {
        set req.http.Accept-Language = "fr";
    } else {
        set req.http.Accept-Language = "en";
    }
}

sub vcl_hash {
    hash_data(req.http.X-Device);
    # (la VCL intégrée ajoute ensuite URL et Host)
}

sub vcl_backend_fetch {
    set bereq.http.X-Device = req.http.X-Device;
}
```

## Taille de l'objet et streaming

```vcl
sub vcl_backend_response {
    # Ne pas encombrer le cache avec des fichiers énormes
    if (std.integer(beresp.http.Content-Length, 0) > 104857600) {
        set beresp.uncacheable = true;
        set beresp.do_stream = true;
        return (deliver);
    }
}
```

## Points de vigilance

> [!WARNING]
> - **Taux de HIT faible** : cookies non nettoyés, `Vary` trop large, paramètres d'URL aléatoires (`?_=123456`), `Cache-Control: private` envoyé par défaut par l'application.
> - **Données personnelles en cache** : toujours `pass` pour les requêtes authentifiées (`Authorization`, cookie de session).
> - **Bans en nombre** : surveiller `MAIN.bans` dans `varnishstat`.
