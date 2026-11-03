---
title: "access_log (ngx_stream_log_module)"
description: "Directive nginx access_log (ngx_stream_log_module) — Sets the path, format, and configuration for a buffered log write. Several logs can be specified on the same configuration level. Logging to syslog can be configured by specifying the “syslog:”…"
tags: [nginx, directive, ngx_stream_log_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `access_log path format [buffer=size] [gzip[=level]] [flush=time] [if=condition];` ou `access_log off;` |
| **Valeur par défaut** | `access_log off;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_log_module\|ngx_stream_log_module]] |

## Utilisation

Sets the path, [[12-directives/log-format-stream-log|format]], and configuration for a buffered log write. Several logs can be specified on the same configuration level. Logging to [[10-guides/01-introduction/syslog|syslog]] can be configured by specifying the “`syslog:`” prefix in the first parameter. The special value `off` cancels all `access_log` directives on the current level.

If either the `buffer` or `gzip` parameter is used, writes to log will be buffered.

> [!NOTE]
> La taille du tampon ne doit pas dépasser la taille d'une écriture atomique dans un fichier sur disque. Sous FreeBSD, cette taille est illimitée.

Lorsque le tampon est activé, les données sont écrites dans le fichier :

- si la ligne de journal suivante ne tient pas dans le tampon ;
- if the buffered data is older than specified by the `flush` parameter;
- lorsqu'un processus de travail [[10-guides/01-introduction/control|rouvre]] les fichiers journaux ou s'arrête.

Si le paramètre `gzip` est utilisé, les données tamponnées sont compressées avant d'être écrites dans le fichier. Le niveau de compression va de 1 (le plus rapide, compression moindre) à 9 (le plus lent, meilleure compression). Par défaut, le tampon fait 64K octets et le niveau de compression est 1. Comme les données sont compressées par blocs atomiques, le fichier journal peut être décompressé ou lu avec « `zcat` » à tout moment.

Exemple :

```nginx
access_log /path/to/log.gz basic gzip flush=5m;
```

> [!NOTE]
> Pour que la compression gzip fonctionne, nginx doit être compilé avec la bibliothèque zlib.

The file path can contain variables, but such logs have some constraints:

- l'[[12-directives/user|utilisateur]] sous lequel s'exécutent les processus de travail doit avoir le droit de créer des fichiers dans le répertoire de ces journaux ;
- l'écriture tamponnée ne fonctionne pas ;
- le fichier est ouvert et fermé à chaque écriture. Toutefois, comme les descripteurs des fichiers fréquemment utilisés peuvent être conservés dans un [[12-directives/open-log-file-cache-stream-log|cache]], l'écriture dans l'ancien fichier peut se poursuivre pendant la durée indiquée par le paramètre `valid` de la directive [[12-directives/open-log-file-cache-stream-log|open_log_file_cache]]

The `if` parameter enables conditional logging. A session will not be logged if the *condition* evaluates to “0” or an empty string.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
