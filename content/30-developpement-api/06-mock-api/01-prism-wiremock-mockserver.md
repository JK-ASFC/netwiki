---
title: Prism, WireMock, MockServer, Hoverfly et Mountebank
description: Simuler des API (bouchons et services virtuels) — pourquoi simuler, Prism (serveur fictif généré depuis OpenAPI, validation des requêtes, proxy de validation), WireMock (stubs HTTP, correspondances et réponses, délais et pannes simulées, Docker), MockServer (attentes et vérifications, proxy, Java), Hoverfly (capture puis rejeu du trafic, modes simulate/capture/spy), Mountebank (imposteurs multi-protocoles HTTP/TCP) ; tests de contrat et choix.
tags: [mock, prism, wiremock, mockserver, hoverfly, mountebank, api, tests, service virtuel]
icon: test-tube
---

**Simuler une API** (créer un « bouchon » ou un service virtuel) permet de développer et tester une application **sans dépendre** du vrai service : API partenaire payante, service pas encore développé, cas d'erreur difficiles à reproduire, tests reproductibles et hors-ligne.

## Prism

**Prism** (Stoplight) génère un **serveur fictif** directement à partir d'une spécification **OpenAPI** : il renvoie des réponses d'exemple conformes au schéma, et peut **valider** les requêtes reçues.

```bash
npx @stoplight/prism-cli mock openapi.yaml -p 4010         # serveur fictif sur :4010
npx @stoplight/prism-cli proxy openapi.yaml https://api.exemple.fr   # relaie au vrai service en validant
curl http://127.0.0.1:4010/equipements
curl http://127.0.0.1:4010/equipements -H 'Prefer: code=404'         # forcer une réponse donnée
```

Idéal quand on a déjà une spécification : aucun scénario à écrire, la doc **est** le bouchon.

## WireMock

**WireMock** (Java, mais utilisable en conteneur) définit des **correspondances** (méthode, URL, en-têtes, corps) et les **réponses** associées, en JSON ou par API. Il simule aussi des **délais** et des **pannes**.

```bash
docker run -d --name wiremock -p 127.0.0.1:8080:8080 -v /srv/wiremock:/home/wiremock wmok/wiremock-docker:latest
# /srv/wiremock/mappings/*.json décrivent les stubs ; __files/ contient les corps de réponse
curl -X POST http://127.0.0.1:8080/__admin/mappings -d '{
  "request": { "method": "GET", "url": "/equipements/1" },
  "response": { "status": 200, "jsonBody": { "id": 1, "nom": "sw-coeur" }, "fixedDelayMilliseconds": 200 }
}'
```

## MockServer

**MockServer** sépare les **attentes** (quelle requête → quelle réponse) et permet ensuite de **vérifier** que les requêtes attendues ont bien eu lieu (utile en test d'intégration). Il fait aussi **proxy** enregistreur.

```bash
docker run -d --name mockserver -p 127.0.0.1:1080:1080 mockserver/mockserver
curl -X PUT http://127.0.0.1:1080/mockserver/expectation -d '{
  "httpRequest": { "path": "/tickets" },
  "httpResponse": { "statusCode": 201, "body": { "id": 42 } } }'
curl -X PUT http://127.0.0.1:1080/mockserver/verify -d '{"httpRequest":{"path":"/tickets"},"times":{"atLeast":1}}'
```

## Hoverfly

**Hoverfly** fonctionne par **capture puis rejeu** : en mode *capture*, il enregistre le trafic réel entre l'application et un service ; en mode *simulate*, il rejoue ces réponses sans le service. Pratique pour figer un comportement observé.

```bash
hoverctl start
hoverctl mode capture
# ... faire tourner l'application à travers le proxy Hoverfly (port 8500) ...
hoverctl mode simulate
hoverctl export simulation.json           # sauvegarder le scénario capturé
hoverctl import simulation.json
```

## Mountebank

**Mountebank** crée des **imposteurs** multi-protocoles (HTTP, HTTPS, **TCP**, SMTP) décrits en JSON : un seul outil pour simuler des services qui ne sont pas forcément HTTP.

```bash
npx mountebank                             # API de contrôle sur :2525
curl -X POST http://127.0.0.1:2525/imposters -d '{
  "port": 4545, "protocol": "http",
  "stubs": [ { "responses": [ { "is": { "statusCode": 200, "body": "OK" } } ] } ] }'
```

## Tests de contrat

Simuler est lié aux **tests de contrat** : s'assurer que producteur et consommateur d'une API respectent le même contrat. WireMock et Prism servent de double pour le consommateur ; voir [[07-tests-contrat/01-pact-schemathesis|Pact et Schemathesis]] pour la vérification de contrat proprement dite.

## Choisir

| Besoin | Outil |
| --- | --- |
| Bouchon immédiat depuis une spécification OpenAPI | Prism |
| Stubs HTTP riches, délais, pannes | WireMock |
| Attentes + vérification des appels | MockServer |
| Capturer puis rejouer un trafic réel | Hoverfly |
| Simuler aussi du TCP/SMTP | Mountebank |

Commandes : [[90-aide-memoire|aide-mémoire]].
