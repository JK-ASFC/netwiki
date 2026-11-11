---
title: Simulation d'API — aide-mémoire
description: Commandes Prism (mock, proxy, Prefer), WireMock (conteneur, API __admin/mappings), MockServer (expectation, verify), Hoverfly (hoverctl modes) et Mountebank (imposteurs).
tags: [aide-mémoire, prism, wiremock, mockserver, hoverfly, mountebank, mock]
icon: terminal
---

Explications : [[01-prism-wiremock-mockserver|Prism, WireMock, MockServer, Hoverfly et Mountebank]].

| Outil | Port |
| --- | --- |
| Prism | 4010 |
| WireMock | 8080 (admin `/__admin`) |
| MockServer | 1080 |
| Hoverfly | 8500 proxy, 8888 admin |
| Mountebank | 2525 (contrôle) + ports des imposteurs |

```bash
# Prism
npx @stoplight/prism-cli mock openapi.yaml -p 4010
npx @stoplight/prism-cli proxy openapi.yaml https://api.exemple.fr
curl http://127.0.0.1:4010/x -H 'Prefer: code=404'

# WireMock
docker run -d -p 8080:8080 -v /srv/wiremock:/home/wiremock wmok/wiremock-docker:latest
curl http://127.0.0.1:8080/__admin/mappings

# MockServer
docker run -d -p 1080:1080 mockserver/mockserver
curl -X PUT http://127.0.0.1:1080/mockserver/expectation -d '{"httpRequest":{"path":"/x"},"httpResponse":{"statusCode":200}}'

# Hoverfly
hoverctl start ; hoverctl mode capture ; hoverctl mode simulate ; hoverctl export sim.json

# Mountebank
npx mountebank
curl -X POST http://127.0.0.1:2525/imposters -d '{"port":4545,"protocol":"http","stubs":[{"responses":[{"is":{"statusCode":200}}]}]}'
```
