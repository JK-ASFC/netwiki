---
title: "access_log (ngx_stream_log_module)"
description: "Directive nginx access_log (ngx_stream_log_module) — Définit le chemin, le format et la configuration d'une écriture de journal en mémoire tampon. Plusieurs journaux peuvent être indiqués au même niveau de configuration. La journalisation vers syslog…"
tags: [nginx, directive, ngx_stream_log_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `access_log path format [buffer=size] [gzip[=level]] [flush=time] [if=condition];` ou `access_log off;` |
| **Valeur par défaut** | `access_log off;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_log_module\|ngx_stream_log_module]] |

## Utilisation

Définit le chemin, le [[12-directives/log-format-stream-log|format]] et la configuration d'une écriture de journal en mémoire tampon. Plusieurs journaux peuvent être indiqués au même niveau de configuration. La journalisation vers [[10-guides/01-introduction/syslog|syslog]] se configure avec le préfixe « `syslog:` » dans le premier paramètre. La valeur spéciale `off` annule toutes les directives `access_log` du niveau courant.

Si le paramètre `buffer` ou `gzip` est utilisé, les écritures dans le journal sont mises en tampon.

> [!NOTE]
> La taille du tampon ne doit pas dépasser la taille d'une écriture atomique dans un fichier sur disque. Sous FreeBSD, cette taille est illimitée.

Lorsque le tampon est activé, les données sont écrites dans le fichier :

- si la ligne de journal suivante ne tient pas dans le tampon ;
- si les données en tampon sont plus anciennes que la valeur du paramètre `flush` ;
- lorsqu'un processus de travail [[10-guides/01-introduction/control|rouvre]] les fichiers journaux ou s'arrête.

Si le paramètre `gzip` est utilisé, les données tamponnées sont compressées avant d'être écrites dans le fichier. Le niveau de compression va de 1 (le plus rapide, compression moindre) à 9 (le plus lent, meilleure compression). Par défaut, le tampon fait 64K octets et le niveau de compression est 1. Comme les données sont compressées par blocs atomiques, le fichier journal peut être décompressé ou lu avec « `zcat` » à tout moment.

Exemple :

```nginx
access_log /path/to/log.gz basic gzip flush=5m;
```

> [!NOTE]
> Pour que la compression gzip fonctionne, nginx doit être compilé avec la bibliothèque zlib.

Le chemin du fichier peut contenir des variables, mais ces journaux ont certaines contraintes :

- l'[[12-directives/user|utilisateur]] sous lequel s'exécutent les processus de travail doit avoir le droit de créer des fichiers dans le répertoire de ces journaux ;
- l'écriture tamponnée ne fonctionne pas ;
- le fichier est ouvert et fermé à chaque écriture. Toutefois, comme les descripteurs des fichiers fréquemment utilisés peuvent être conservés dans un [[12-directives/open-log-file-cache-stream-log|cache]], l'écriture dans l'ancien fichier peut se poursuivre pendant la durée indiquée par le paramètre `valid` de la directive [[12-directives/open-log-file-cache-stream-log|open_log_file_cache]]

Le paramètre `if` active la journalisation conditionnelle. Une session n'est pas journalisée si la *condition* vaut « 0 » ou une chaîne vide.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
