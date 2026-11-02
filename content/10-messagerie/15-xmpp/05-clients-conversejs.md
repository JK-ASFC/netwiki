---
title: Clients XMPP et Converse.js
description: Clients XMPP par plateforme (Conversations, Monocles et Snikket sur Android, Monal et Siskin sur iOS et macOS, Gajim et Dino sur Windows et Linux, Psi, Pidgin) et fonctions à vérifier (OMEMO, MAM, envoi de fichiers, appels), et Converse.js : client web XMPP en JavaScript (MPL 2.0) à intégrer dans un site ou un intranet (CDN, npm, modes fullscreen, overlay et embedded), connexion par WebSocket ou BOSH, reverse proxy NGINX, authentification et options courantes.
tags: [xmpp, converse.js, client web, omemo, gajim, conversations, monal]
icon: monitor-smartphone
---

## Clients par plateforme

| Plateforme | Clients conseillés | Remarques |
| --- | --- | --- |
| Android | **Conversations**, Monocles, Snikket | OMEMO, MAM, fichiers, appels |
| iOS, iPadOS, macOS | **Monal**, Siskin (iOS), Snikket (iOS) | Notifications push via le serveur |
| Windows, Linux | **Gajim**, Dino (Linux), Psi | Gajim : `winget install --id Gajim.Gajim -e` |
| Navigateur | **Converse.js**, Movim | Aucune installation pour l'utilisateur |

Fonctions à vérifier côté serveur pour un bon usage mobile : MAM (historique), Carbons, Stream Management, HTTP File Upload, push (XEP-0357) et un serveur STUN/TURN pour les appels — voir [[01-prosody|Prosody]], [[02-ejabberd|ejabberd]], [[03-openfire|Openfire]].

## Converse.js

**Converse.js** (MPL 2.0) est un client XMPP complet en JavaScript : salons, messages privés, OMEMO, historique MAM, envoi de fichiers. On l'intègre dans une page web (intranet, portail, site public) ou on l'héberge comme application autonome. Version 14 actuellement.

### Page minimale

```html
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="https://cdn.conversejs.org/14.0.0/dist/converse.min.css">
  <script type="module" src="https://cdn.conversejs.org/14.0.0/dist/converse.min.js"></script>
</head>
<body>
  <script type="module">
    converse.initialize({
      websocket_url: 'wss://xmpp.corp.exemple.fr/xmpp-websocket',
      view_mode: 'fullscreen',                 // 'overlay' : fenêtre flottante sur un site ; 'embedded' : dans un élément
      i18n: 'fr',
      auto_login: false,
      allow_registration: false,
      discover_connection_methods: true,
      omemo_default: true
    });
  </script>
</body>
</html>
```

Pour ne pas dépendre du CDN, installer le paquet npm (`npm install converse.js`) et servir le dossier `dist/` depuis votre serveur web.

| Option | Usage |
| --- | --- |
| `websocket_url` | Connexion WebSocket (recommandée) |
| `bosh_service_url` | Connexion BOSH (`https://xmpp.corp.exemple.fr/http-bind`), pour les réseaux qui bloquent WebSocket |
| `view_mode` | `fullscreen`, `overlay`, `embedded` |
| `jid`, `auto_login`, `authentication` | Connexion automatique (jeton ou SSO par `credentials_url`) |
| `muc_domain`, `auto_join_rooms` | Salons ouverts au démarrage |
| `whitelisted_plugins` | Greffons optionnels |

### Reverse proxy NGINX (WebSocket et BOSH vers Prosody)

```nginx
location /xmpp-websocket {
  proxy_pass http://127.0.0.1:5280/xmpp-websocket;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  proxy_set_header Host $host;
  proxy_read_timeout 900s;
}
location /http-bind {
  proxy_pass http://127.0.0.1:5280/http-bind;
  proxy_set_header Host $host;
  proxy_buffering off;
}
```

Avec ejabberd, les chemins par défaut sont `/ws` et `/bosh` (port 5443) ; avec Openfire, `ws://…:7070/ws/` et `/http-bind/`. Servir la page et la connexion sous le **même domaine** évite les blocages CORS.

<!-- CAPTURE: Converse.js en mode plein écran avec un salon ouvert | _assets/conversejs-plein-ecran.png -->
