---
title: "nginx pour Windows"
description: "Nginx — nginx pour Windows. La version de nginx pour Windows utilise l'API Win32 native (et non la couche d'émulation Cygwin). Seules les méthodes de traitement des connexions select et poll (1.15.9) sont actuellement utilisées : il ne faut donc…"
tags: [nginx, guide]
icon: book-open
---

La version de nginx pour Windows utilise l'API Win32 native (et non la couche d'émulation Cygwin). Seules les méthodes de traitement des connexions `select` et `poll` (1.15.9) sont actuellement utilisées : il ne faut donc pas s'attendre à de hautes performances ni à une grande capacité de montée en charge. Pour cette raison et d'autres problèmes connus, la version Windows est considérée comme une version *bêta*. Elle offre actuellement presque les mêmes fonctions que la version UNIX, sauf le filtre XSLT, le filtre d'images, le module GeoIP et le langage Perl intégré.

Pour installer nginx/Windows, téléchargez la dernière distribution de la branche mainline (), qui contient tous les correctifs connus. Décompressez ensuite l'archive, allez dans le répertoire nginx- et lancez `nginx`. Exemple pour la racine du lecteur C: :

```
cd c:\
unzip nginx-.zip
cd nginx-
start nginx
```

Lancez l'utilitaire en ligne de commande `tasklist` pour voir les processus nginx :

```
C:\nginx->tasklist /fi "imagename eq nginx.exe"

Image Name           PID Session Name     Session#    Mem Usage
=============== ======== ============== ========== ============
nginx.exe            652 Console                 0      2 780 K
nginx.exe           1332 Console                 0      3 112 K
```

L'un des processus est le processus maître, l'autre le processus de travail. Si nginx ne démarre pas, cherchez la raison dans le fichier journal d'erreurs `logs\error.log`. Si ce fichier n'a pas été créé, la raison doit figurer dans le journal des événements Windows. Si une page d'erreur s'affiche au lieu de la page attendue, cherchez aussi la raison dans `logs\error.log`.

nginx/Windows utilise le répertoire depuis lequel il a été lancé comme préfixe des chemins relatifs de la configuration. Dans l'exemple ci-dessus, le préfixe est `C:\nginx-\`. Les chemins d'un fichier de configuration doivent être écrits à la manière UNIX, avec des barres obliques :

```c
access_log   logs/site.log;
root         C:/web/html;
```

nginx/Windows s'exécute comme une application console standard (pas comme un service) et se gère avec les commandes suivantes :

|   |   |
| --- | --- |
| nginx -s stop | arrêt rapide |
| nginx -s quit | arrêt en douceur |
| nginx -s reload | modifier la configuration, démarrer de nouveaux processus de travail avec la nouvelle configuration, arrêter proprement les anciens |
| nginx -s reopen | réouverture des fichiers journaux |

## Problèmes connus

- Plusieurs processus de travail peuvent être démarrés, mais un seul travaille réellement.
- Les fonctions UDP (et donc QUIC) ne sont pas prises en charge.

## Améliorations envisagées

- Exécution en tant que service.
- Utilisation des ports de complétion d'E/S comme méthode de traitement des connexions.
- Utilisation de plusieurs threads de travail dans un même processus de travail.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
