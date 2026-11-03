---
title: "access_log (ngx_http_log_module)"
description: "Directive nginx access_log (ngx_http_log_module) — Définit le chemin, le format et la configuration de l'écriture tamponnée d'un journal. Plusieurs journaux peuvent être définis au même niveau de configuration. La journalisation vers syslog se…"
tags: [nginx, directive, ngx_http_log_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `access_log path [format [buffer=size] [gzip[=level]] [flush=time] [if=condition]];` ou `access_log off;` |
| **Valeur par défaut** | `access_log logs/access.log combined;` |
| **Contexte** | `http`, `server`, `location`, `if dans location`, `limit_except` |
| **Module** | [[11-modules/02-http/ngx_http_log_module\|ngx_http_log_module]] |

## Utilisation

Définit le chemin, le format et la configuration de l'écriture tamponnée d'un journal. Plusieurs journaux peuvent être définis au même niveau de configuration. La journalisation vers [[10-guides/01-introduction/syslog|syslog]] se configure avec le préfixe « `syslog:` » dans le premier paramètre. La valeur spéciale `off` annule toutes les directives `access_log` du niveau courant. Si le format n'est pas indiqué, le format prédéfini « `combined` » est utilisé.

Si le paramètre `buffer` ou `gzip` (1.3.10, 1.2.7) est utilisé, les écritures dans le journal sont tamponnées.

> [!NOTE]
> La taille du tampon ne doit pas dépasser la taille d'une écriture atomique dans un fichier sur disque. Sous FreeBSD, cette taille est illimitée.

Lorsque le tampon est activé, les données sont écrites dans le fichier :

- si la ligne de journal suivante ne tient pas dans le tampon ;
- si les données tamponnées sont plus anciennes que la durée indiquée par le paramètre `flush` (1.3.10, 1.2.7) ;
- lorsqu'un processus de travail [[10-guides/01-introduction/control|rouvre]] les fichiers journaux ou s'arrête.

Si le paramètre `gzip` est utilisé, les données tamponnées sont compressées avant d'être écrites dans le fichier. Le niveau de compression va de 1 (le plus rapide, compression moindre) à 9 (le plus lent, meilleure compression). Par défaut, le tampon fait 64K octets et le niveau de compression est 1. Comme les données sont compressées par blocs atomiques, le fichier journal peut être décompressé ou lu avec « `zcat` » à tout moment.

Exemple :

```nginx
access_log /path/to/log.gz combined gzip flush=5m;
```

> [!NOTE]
> Pour que la compression gzip fonctionne, nginx doit être compilé avec la bibliothèque zlib.

Le chemin du fichier peut contenir des variables (0.7.6+), mais ces journaux ont certaines contraintes :

- l'[[12-directives/user|utilisateur]] sous lequel s'exécutent les processus de travail doit avoir le droit de créer des fichiers dans le répertoire de ces journaux ;
- l'écriture tamponnée ne fonctionne pas ;
- le fichier est ouvert et fermé à chaque écriture. Toutefois, comme les descripteurs des fichiers fréquemment utilisés peuvent être conservés dans un [[12-directives/open-log-file-cache-http-log|cache]], l'écriture dans l'ancien fichier peut se poursuivre pendant la durée indiquée par le paramètre `valid` de la directive [[12-directives/open-log-file-cache-http-log|open_log_file_cache]]
- à chaque écriture, l'existence du [[12-directives/root|répertoire racine]] de la requête est vérifiée ; s'il n'existe pas, le journal n'est pas créé. Il est donc conseillé d'indiquer [[12-directives/root|root]] et `access_log` au même niveau de configuration :

  ```nginx
  server {
      root       /spool/vhost/data/$host;
      access_log /spool/vhost/logs/$host;
      ...
  ```

Le paramètre `if` (1.7.0) active la journalisation conditionnelle. Une requête n'est pas journalisée si la condition (*condition*) vaut « 0 » ou une chaîne vide. Dans l'exemple suivant, les requêtes dont le code de réponse est 2xx ou 3xx ne sont pas journalisées :

```nginx
map $status $loggable {
    ~^[23]  0;
    default 1;
}

access_log /path/to/access.log combined if=$loggable;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
