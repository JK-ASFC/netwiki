---
title: Pact, Schemathesis, Dredd, Hurl et Newman
description: Tester des API — tests de contrat dirigés par le consommateur avec Pact (pacts, broker can-i-deploy), tests de conformité à OpenAPI avec Schemathesis (génération automatique de cas, propriétés) et Dredd (vérifie que l'API respecte sa spécification), tests fonctionnels rejouables avec Hurl (fichiers .hurl, assertions, captures, CI) et Newman (exécution des collections Postman en CI) ; intégration continue et choix.
tags: [pact, schemathesis, dredd, hurl, newman, tests api, contrat, openapi, ci]
icon: shield-check
---

Au-delà de la simulation, on **vérifie** qu'une API se comporte comme promis : qu'elle respecte le **contrat** attendu par ses consommateurs, qu'elle est **conforme** à sa spécification OpenAPI, et qu'elle passe des **scénarios fonctionnels** rejouables en intégration continue.

## Pact — tests de contrat

**Pact** met en œuvre le *consumer-driven contract testing* : le **consommateur** décrit ce qu'il attend du producteur sous forme de **pact** (interactions), et le **producteur** rejoue ce pact pour prouver qu'il le satisfait. On détecte ainsi une rupture de compatibilité **avant** le déploiement.

```bash
# Le consommateur génère un pact pendant ses tests (bibliothèques pact-js, pact-python, pact-jvm…)
# Les pacts sont publiés sur un Pact Broker partagé :
docker run -d --name pact-broker -p 127.0.0.1:9292:9292 \
  -e PACT_BROKER_DATABASE_URL=postgres://pact:…@db/pact pactfoundation/pact-broker
# Le producteur vérifie, puis on interroge le broker avant de déployer :
pact-broker can-i-deploy --pacticipant api-parc --version "$VERSION" --to-environment production
```

Pact est surtout pertinent entre **microservices internes** dont on maîtrise consommateurs et producteurs.

## Schemathesis — conformité OpenAPI

**Schemathesis** lit une spécification OpenAPI et **génère automatiquement** des quantités de requêtes (y compris des cas limites) pour vérifier que l'API ne renvoie pas d'erreur serveur inattendue et respecte son schéma (test basé sur les propriétés).

```bash
python3 -m pip install schemathesis
schemathesis run https://api.exemple.fr/v1/openapi.json --checks all --header "X-Api-Key: $CLE"
st run openapi.yaml --base-url https://api-test.exemple.fr --workers 4
```

À lancer contre un environnement de **test** (il envoie beaucoup de requêtes, dont des cas destructeurs possibles).

## Dredd

**Dredd** vérifie, point d'accès par point d'accès, que l'API réelle **correspond à sa spécification** (OpenAPI ou API Blueprint) : codes de statut, schémas des réponses. Pratique pour garder la doc et l'implémentation synchronisées.

```bash
npx dredd openapi.yaml https://api-test.exemple.fr --hookfiles=./hooks.js
```

## Hurl — tests fonctionnels rejouables

**Hurl** décrit des requêtes et des **assertions** dans un fichier texte `.hurl` versionnable : idéal pour des tests de bout en bout lisibles, des contrôles de santé et des scénarios en CI.

```text commande.hurl
POST https://api-test.exemple.fr/v1/login
{ "user": "test", "pass": "{{mdp}}" }
HTTP 200
[Captures]
jeton: jsonpath "$.token"

GET https://api-test.exemple.fr/v1/equipements
Authorization: Bearer {{jeton}}
HTTP 200
[Asserts]
jsonpath "$" count > 0
jsonpath "$[0].nom" exists
duration < 1000
```

```bash
hurl --variable mdp="$MDP" --test commande.hurl             # mode test (rapport)
hurl --test --glob 'tests/*.hurl' --report-html rapport/
```

## Newman

**Newman** exécute en **ligne de commande** les collections **Postman** (voir [[02-reseau-diagnostic/07-postman-bruno|Postman et Bruno]]) : on réutilise en CI les tests écrits dans Postman.

```bash
npm install -g newman
newman run collection.json -e env-test.json --reporters cli,junit --reporter-junit-export resultats.xml
```

## En intégration continue

```yaml .gitlab-ci.yml (extrait)
tests-api:
  image: node:22
  script:
    - npx @stoplight/prism-cli mock openapi.yaml -p 4010 &      # ou un vrai environnement de test
    - npx hurl --test --glob 'tests/*.hurl' --variable base=http://127.0.0.1:4010
```

## Choisir

| Besoin | Outil |
| --- | --- |
| Compatibilité entre microservices | Pact |
| L'API respecte-t-elle sa spécification ? | Dredd, Schemathesis |
| Robustesse, cas limites automatiques | Schemathesis |
| Scénarios fonctionnels lisibles en CI | Hurl |
| Rejouer des collections Postman | Newman |

Commandes : [[90-aide-memoire|aide-mémoire]].
