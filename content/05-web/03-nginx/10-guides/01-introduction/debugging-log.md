---
title: "Le journal de débogage"
description: "Nginx — Le journal de débogage. Pour activer le journal de débogage, nginx doit être configuré avec la prise en charge du débogage lors de la compilation :"
tags: [nginx, guide]
icon: book-open
---

Pour activer le journal de débogage, nginx doit être configuré avec la prise en charge du débogage lors de la compilation :

```
./configure --with-debug ...
```

Il faut ensuite définir le niveau `debug` avec la directive [[12-directives/error-log|error_log]] :

```c
error_log /path/to/log debug;
```

Pour vérifier que nginx prend en charge le débogage, exécutez la commande `nginx -V` :

```
configure arguments: --with-debug ...
```

Les paquets Linux précompilés prennent en charge le journal de débogage avec l'exécutable `nginx-debug` (1.9.8), qu'on lance avec les commandes

```
service nginx stop
service nginx-debug start
```

puis on définit le niveau `debug`. La version de nginx pour Windows est toujours compilée avec le journal de débogage ; il suffit donc de définir le niveau `debug`.

Redéfinir le journal sans indiquer aussi le niveau `debug` désactive le journal de débogage. Dans l'exemple ci-dessous, redéfinir le journal au niveau [[12-directives/server-http-core|server]] désactive le journal de débogage pour ce serveur :

```
error_log /path/to/log debug;

http {
    server {
        error_log /path/to/log;
        ...
```

Pour l'éviter, mettez en commentaire la ligne qui redéfinit le journal, ou ajoutez-y aussi le niveau `debug` :

```
error_log /path/to/log debug;

http {
    server {
        error_log /path/to/log debug;
        ...
```

## Journal de débogage pour certains clients

On peut aussi activer le journal de débogage uniquement pour [[12-directives/debug-connection|certaines adresses de clients]] :

```c
error_log /path/to/log;

events {
    debug_connection 192.168.1.1;
    debug_connection 192.168.10.0/24;
}
```

## Journalisation dans un tampon mémoire circulaire

Le journal de débogage peut être écrit dans un tampon mémoire circulaire :

```c
error_log memory:32m debug;
```

La journalisation au niveau `debug` dans le tampon mémoire n'a pas d'impact notable sur les performances, même sous forte charge. Le journal peut alors être extrait avec un script `gdb` comme celui-ci :

```nginx
set $log = ngx_cycle->log

while $log->writer != ngx_log_memory_writer
    set $log = $log->next
end

set $buf = (ngx_log_memory_buf_t *) $log->wdata
dump binary memory debug_log.txt $buf->start $buf->end
```

Ou avec un script `lldb` comme celui-ci :

```nginx
expr ngx_log_t *$log = ngx_cycle->log
expr while ($log->writer != ngx_log_memory_writer) { $log = $log->next; }
expr ngx_log_memory_buf_t *$buf = (ngx_log_memory_buf_t *) $log->wdata
memory read --force --outfile debug_log.txt --binary $buf->start $buf->end
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
