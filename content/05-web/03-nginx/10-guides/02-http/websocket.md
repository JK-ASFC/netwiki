---
title: "Relais WebSocket"
description: "Nginx — Relais WebSocket. Pour transformer une connexion HTTP/1.1 entre un client et un serveur en connexion WebSocket, on utilise le mécanisme de changement de protocole de HTTP/1.1."
tags: [nginx, guide]
icon: book-open
---

Pour transformer une connexion HTTP/1.1 entre un client et un serveur en connexion WebSocket, on utilise le mécanisme de [changement de protocole](https://datatracker.ietf.org/doc/html/rfc2616#section-14.42) de HTTP/1.1.

Il y a toutefois une subtilité : `Upgrade` étant un en-tête [saut par saut](https://datatracker.ietf.org/doc/html/rfc2616#section-13.5.1) (*hop-by-hop*), il n'est pas transmis du client au serveur mandaté. Avec un mandataire direct, les clients peuvent utiliser la méthode `CONNECT` pour contourner ce problème. Cela ne fonctionne pas avec un mandataire inverse, car les clients ignorent l'existence de tout mandataire : un traitement particulier est donc nécessaire sur le mandataire.

Depuis la version 1.3.13, nginx dispose d'un mode de fonctionnement particulier qui établit un tunnel entre le client et le serveur mandaté lorsque celui-ci renvoie une réponse de code `101 Switching Protocols` et que le client a demandé un changement de protocole avec l'en-tête `Upgrade` de sa requête.

Comme indiqué plus haut, les en-têtes saut par saut comme `Upgrade` et `Connection` ne sont pas transmis du client au serveur mandaté ; pour que celui-ci sache que le client veut passer au protocole WebSocket, il faut donc les transmettre explicitement :

```
location /chat/ {
    proxy_pass http://backend;
    # proxy_http_version 1.1; # before version 1.29.7
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

Exemple plus élaboré, où la valeur du champ `Connection` de la requête au serveur mandaté dépend de la présence du champ `Upgrade` dans l'en-tête de la requête du client :

```
http {
    map $http_upgrade $connection_upgrade {
        default upgrade;
        ''      close;
    }

    server {
        ...

        location /chat/ {
            proxy_pass http://backend;
            # proxy_http_version 1.1; # before version 1.29.7
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
        }
    }
```

Par défaut, la connexion est fermée si le serveur mandaté ne transmet aucune donnée pendant 60 secondes. Ce délai peut être augmenté avec la directive [[12-directives/proxy-read-timeout|proxy_read_timeout]]. On peut aussi configurer le serveur mandaté pour qu'il envoie périodiquement des trames ping WebSocket, afin de réinitialiser le délai et de vérifier que la connexion est toujours active.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
