---
title: "Contrôler nginx"
description: "Nginx — Contrôler nginx. nginx se contrôle par des signaux. L'identifiant du processus maître est écrit par défaut dans le fichier /usr/local/nginx/logs/nginx.pid. Ce nom peut être modifié lors de la configuration de la compilation, ou dans…"
tags: [nginx, guide]
icon: book-open
---

nginx se contrôle par des signaux. L'identifiant du processus maître est écrit par défaut dans le fichier `/usr/local/nginx/logs/nginx.pid`. Ce nom peut être modifié lors de la configuration de la compilation, ou dans `nginx.conf` avec la directive [[12-directives/pid|pid]]. Le processus maître prend en charge les signaux suivants :

> [!NOTE]
> |   |   |
> | --- | --- |
> | TERM, INT | arrêt rapide |
> | QUIT | arrêt en douceur |
> | HUP | changement de configuration, prise en compte d'un changement de fuseau horaire (FreeBSD et Linux uniquement), démarrage de nouveaux processus de travail avec la nouvelle configuration, arrêt en douceur des anciens processus de travail |
> | USR1 | réouverture des fichiers journaux |
> | USR2 | mise à jour de l'exécutable |
> | WINCH | arrêt en douceur des processus de travail |

Les processus de travail peuvent aussi être contrôlés individuellement par des signaux, même si ce n'est pas nécessaire. Les signaux pris en charge sont :

> [!NOTE]
> |   |   |
> | --- | --- |
> | TERM, INT | arrêt rapide |
> | QUIT | arrêt en douceur |
> | USR1 | réouverture des fichiers journaux |
> | WINCH | arrêt anormal pour le débogage (nécessite d'activer [[12-directives/debug-points\|debug_points]]) |

## Changer la configuration

Pour que nginx relise son fichier de configuration, il faut envoyer le signal HUP au processus maître. Celui-ci vérifie d'abord la syntaxe, puis tente d'appliquer la nouvelle configuration, c'est-à-dire d'ouvrir les fichiers journaux et les nouveaux sockets d'écoute. En cas d'échec, il annule les modifications et continue avec l'ancienne configuration. En cas de succès, il démarre de nouveaux processus de travail et demande aux anciens de s'arrêter en douceur. Les anciens processus de travail ferment les sockets d'écoute et continuent de servir les clients en cours ; une fois tous ces clients servis, ils s'arrêtent.

Illustrons cela par un exemple. Imaginons que nginx tourne sous FreeBSD et que la commande

```
ps axw -o pid,ppid,user,%cpu,vsz,wchan,command | egrep '(nginx|PID)'
```

produise la sortie suivante :

```
  PID  PPID USER    %CPU   VSZ WCHAN  COMMAND
33126     1 root     0.0  1148 pause  nginx: master process /usr/local/nginx/sbin/nginx
33127 33126 nobody   0.0  1380 kqread nginx: worker process (nginx)
33128 33126 nobody   0.0  1364 kqread nginx: worker process (nginx)
33129 33126 nobody   0.0  1364 kqread nginx: worker process (nginx)
```

Si le signal HUP est envoyé au processus maître, la sortie devient :

```
  PID  PPID USER    %CPU   VSZ WCHAN  COMMAND
33126     1 root     0.0  1164 pause  nginx: master process /usr/local/nginx/sbin/nginx
33129 33126 nobody   0.0  1380 kqread nginx: worker process is shutting down (nginx)
33134 33126 nobody   0.0  1368 kqread nginx: worker process (nginx)
33135 33126 nobody   0.0  1368 kqread nginx: worker process (nginx)
33136 33126 nobody   0.0  1368 kqread nginx: worker process (nginx)
```

L'un des anciens processus de travail, de PID 33129, continue de fonctionner. Au bout d'un moment, il se termine :

```
  PID  PPID USER    %CPU   VSZ WCHAN  COMMAND
33126     1 root     0.0  1164 pause  nginx: master process /usr/local/nginx/sbin/nginx
33134 33126 nobody   0.0  1368 kqread nginx: worker process (nginx)
33135 33126 nobody   0.0  1368 kqread nginx: worker process (nginx)
33136 33126 nobody   0.0  1368 kqread nginx: worker process (nginx)
```

## Rotation des fichiers journaux

Pour faire tourner les fichiers journaux, il faut d'abord les renommer, puis envoyer le signal USR1 au processus maître. Celui-ci rouvre alors tous les fichiers journaux ouverts et leur attribue comme propriétaire l'utilisateur non privilégié sous lequel s'exécutent les processus de travail. Une fois la réouverture réussie, le processus maître ferme tous les fichiers ouverts et demande aux processus de travail de rouvrir les fichiers. Ceux-ci ouvrent les nouveaux fichiers et ferment aussitôt les anciens. Les anciens fichiers sont ainsi presque immédiatement disponibles pour un traitement ultérieur, comme la compression.

## Mettre à jour l'exécutable à chaud

Pour mettre à jour l'exécutable du serveur, il faut d'abord placer le nouvel exécutable à la place de l'ancien, puis envoyer le signal USR2 au processus maître. Celui-ci renomme d'abord son fichier d'identifiant de processus en lui ajoutant le suffixe `.oldbin`, par exemple `/usr/local/nginx/logs/nginx.pid.oldbin`, puis lance le nouvel exécutable, qui démarre à son tour de nouveaux processus de travail :

```
  PID  PPID USER    %CPU   VSZ WCHAN  COMMAND
33126     1 root     0.0  1164 pause  nginx: master process /usr/local/nginx/sbin/nginx
33134 33126 nobody   0.0  1368 kqread nginx: worker process (nginx)
33135 33126 nobody   0.0  1380 kqread nginx: worker process (nginx)
33136 33126 nobody   0.0  1368 kqread nginx: worker process (nginx)
36264 33126 root     0.0  1148 pause  nginx: master process /usr/local/nginx/sbin/nginx
36265 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
36266 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
36267 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
```

Tous les processus de travail (anciens et nouveaux) continuent alors d'accepter des requêtes. Si le signal WINCH est envoyé au premier processus maître, celui-ci demande à ses processus de travail de s'arrêter en douceur, et ils commencent à se terminer :

```
  PID  PPID USER    %CPU   VSZ WCHAN  COMMAND
33126     1 root     0.0  1164 pause  nginx: master process /usr/local/nginx/sbin/nginx
33135 33126 nobody   0.0  1380 kqread nginx: worker process is shutting down (nginx)
36264 33126 root     0.0  1148 pause  nginx: master process /usr/local/nginx/sbin/nginx
36265 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
36266 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
36267 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
```

Au bout d'un moment, seuls les nouveaux processus de travail traitent les requêtes :

```
  PID  PPID USER    %CPU   VSZ WCHAN  COMMAND
33126     1 root     0.0  1164 pause  nginx: master process /usr/local/nginx/sbin/nginx
36264 33126 root     0.0  1148 pause  nginx: master process /usr/local/nginx/sbin/nginx
36265 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
36266 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
36267 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
```

L'ancien processus maître ne ferme pas ses sockets d'écoute : on peut lui faire redémarrer ses processus de travail si nécessaire. Si, pour une raison quelconque, le nouvel exécutable ne fonctionne pas correctement, on peut :

- Envoyer le signal HUP à l'ancien processus maître. Il démarre de nouveaux processus de travail sans relire la configuration. On peut ensuite arrêter en douceur tous les nouveaux processus en envoyant le signal QUIT au nouveau processus maître.
- Envoyer le signal TERM au nouveau processus maître. Il demande à ses processus de travail de se terminer immédiatement, ce qu'ils font presque tous aussitôt. (Si les nouveaux processus ne se terminent pas, leur envoyer le signal KILL pour les y forcer.) Lorsque le nouveau processus maître se termine, l'ancien redémarre automatiquement de nouveaux processus de travail.

Si le nouveau processus maître se termine, l'ancien retire le suffixe `.oldbin` du nom du fichier d'identifiant de processus.

Si la mise à jour a réussi, il faut envoyer le signal QUIT à l'ancien processus maître ; seuls les nouveaux processus restent :

```
  PID  PPID USER    %CPU   VSZ WCHAN  COMMAND
36264     1 root     0.0  1148 pause  nginx: master process /usr/local/nginx/sbin/nginx
36265 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
36266 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
36267 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
```

> [!NOTE]
> Pour conserver les connexions QUIC établies lors d'une mise à jour ou d'un rechargement, activer [[12-directives/quic-bpf|quic_bpf]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
