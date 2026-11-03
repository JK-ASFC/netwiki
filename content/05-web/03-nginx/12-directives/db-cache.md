---
title: "db_cache"
description: "Directive nginx db_cache (ngx_http_db_module) — Active la mise en cache des résultats de recherche dans une zone de mémoire partagée définie par la directive keyval_zone. La clé de cache est la valeur de la directive db_get évaluée pour la requête…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_cache zone [timeout=time] [max_size=size] [not_found=on\|off\|time];` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Active la mise en cache des résultats de recherche dans une zone de mémoire partagée définie par la directive [[12-directives/keyval-zone-http-keyval|keyval_zone]]. La clé de cache est la valeur de la directive [[12-directives/db-get|db_get]] évaluée pour la requête courante. Si un résultat est trouvé dans le cache, il est renvoyé sans connexion au serveur de base de données.

La directive [[12-directives/db-pass|db_pass]] doit être indiquée dans le même contexte de configuration.

Les paramètres suivants sont pris en charge :

- **`timeout`=*time***

  définit la durée de vie des valeurs en cache ; `0` par défaut. Un délai effectif non nul doit être configuré avec ce paramètre ou avec le paramètre `timeout` de la zone. Avec un délai effectif nul, les entrées peuvent être supprimées par des écritures sans rapport dans la zone.

- **`max_size`=*size***

  définit la taille maximale d'une valeur pouvant être mise en cache ; `64k` par défaut. Les valeurs plus grandes sont renvoyées au client mais pas mises en cache.

- **`not_found`=`off` | `on` | `time`**

  Active ou désactive la mise en cache des résultats « introuvable » (`not found`). Par défaut, ils ne sont pas mis en cache. La valeur `on` utilise le même délai que pour les valeurs de la base ; une durée indique une durée de vie distincte pour ces résultats.

Par exemple :

```nginx
http {
    keyval_zone zone=db_cache:10m timeout=1m;

    upstream redis_backend {
        db_type redis;
        server  127.0.0.1:6379;
    }

    server {
        location /db/ {
            db_pass redis_backend;
            db_get  $arg_key;

            db_cache db_cache timeout=30s max_size=128k not_found=5s;
        }
    }
}
```

La valeur évaluée de [[12-directives/db-get|db_get]] sert de clé de cache. Une valeur en cache est renvoyée sans interroger la base. Un résultat « clé absente » en cache renvoie `404 Not Found` si la mise en cache des clés absentes est activée dans le bloc location courant ; sinon, la base est interrogée.

Une valeur de longueur nulle est un résultat valide, distinct d'une clé absente. Seules les réponses valides et complètes sont mises en cache, ainsi que les résultats de clé absente si cette option est activée. Les réponses en échec, mal formées ou incomplètes ne sont pas mises en cache.

Les blocs location qui partagent une zone doivent avoir des réglages [[12-directives/db-pass|db_pass]], [[12-directives/db-name|db_name]] et [[12-directives/db-auth|db_auth]] identiques. Une zone de cache ne doit pas servir aussi aux données keyval ordinaires. La mise en cache des clés absentes ne peut pas être combinée avec le paramètre `not_found` de [[12-directives/db-next-upstream|db_next_upstream]].

Une erreur de recherche dans le cache renvoie `500 Internal Server Error`. L'échec de l'insertion d'un résultat dans le cache n'affecte pas la réponse.

La directive est héritée du niveau de configuration précédent, sauf redéfinition.

> [!NOTE]
> Le module ne propose ni invalidation ni purge du cache. Les modifications de la base peuvent rester invisibles jusqu'à l'expiration ou l'éviction des entrées. Les absences simultanées dans le cache ne sont pas regroupées en une seule requête à la base.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
