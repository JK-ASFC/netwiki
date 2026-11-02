---
title: Passerelles d'API alternatives — aide-mémoire des commandes
description: Commandes Tyk (API de la passerelle /tyk/apis, /tyk/keys, /tyk/reload, /hello), KrakenD (check, run, audit, version), Gravitee (docker compose, Management API), Spring Cloud Gateway (actuator gateway routes), Ocelot et YARP (dotnet add package, run, publish, service) avec exemples.
tags: [aide-mémoire, tyk, krakend, gravitee, ocelot, yarp, spring cloud gateway]
icon: terminal
---

Explications : [[01-tyk-krakend-gravitee|Tyk, KrakenD et Gravitee]] · [[02-zuul-ocelot-yarp|Zuul, Ocelot et YARP]].

## Tyk

```bash
H="x-tyk-authorization: $TYK_SECRET"
curl -s http://localhost:8080/hello | jq .
curl -s -H "$H" http://localhost:8080/tyk/apis | jq '.[] | {name, api_id}'
curl -s -H "$H" -X POST http://localhost:8080/tyk/keys -d '{"access_rights":{"commandes":{"api_id":"commandes","versions":["Default"]}},"rate":60,"per":60,"quota_max":-1}'
curl -s -H "$H" http://localhost:8080/tyk/reload/group
```

## KrakenD

```bash
krakend version
krakend check -tlc krakend.json
krakend audit -c krakend.json
krakend run -c krakend.json -d          # mode débogage (point /__debug/)
```

## Gravitee

```bash
docker compose ps ; docker compose logs -f gateway
curl -s -u admin:<mdp> http://localhost:8083/management/organizations/DEFAULT/environments/DEFAULT/apis | jq '.[].name'
```

## Spring Cloud Gateway, Ocelot, YARP

```bash
curl -s http://localhost:8080/actuator/gateway/routes | jq '.[].route_id'   # Spring (actuator activé)
dotnet add package Ocelot ; dotnet add package Yarp.ReverseProxy
dotnet run --urls http://0.0.0.0:5000
dotnet publish -c Release -o /opt/passerelle
sc.exe create Passerelle binPath= "C:\Passerelle\Passerelle.exe" start= auto   # service Windows
```
