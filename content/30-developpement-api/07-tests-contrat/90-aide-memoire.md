---
title: Tests d'API et de contrat — aide-mémoire
description: Commandes Pact (broker, can-i-deploy), Schemathesis (run, checks), Dredd, Hurl (fichiers .hurl, --test, assertions) et Newman (run de collections Postman).
tags: [aide-mémoire, pact, schemathesis, dredd, hurl, newman, tests api]
icon: terminal
---

Explications : [[01-pact-schemathesis|Pact, Schemathesis, Dredd, Hurl et Newman]].

```bash
# Pact
docker run -d -p 9292:9292 -e PACT_BROKER_DATABASE_URL=postgres://pact:…@db/pact pactfoundation/pact-broker
pact-broker can-i-deploy --pacticipant api --version "$VER" --to-environment production

# Schemathesis
python3 -m pip install schemathesis
schemathesis run https://api-test.exemple.fr/openapi.json --checks all --workers 4

# Dredd
npx dredd openapi.yaml https://api-test.exemple.fr

# Hurl
hurl --test --glob 'tests/*.hurl' --variable base=https://api-test.exemple.fr --report-html rapport/
hurl --test commande.hurl           # assertions : jsonpath, status, header, duration

# Newman
npm install -g newman
newman run collection.json -e env-test.json --reporters cli,junit --reporter-junit-export resultats.xml
```

| Assertion Hurl | Exemple |
| --- | --- |
| Code | `HTTP 200` |
| Corps JSON | `jsonpath "$.id" == 42` |
| Comptage | `jsonpath "$" count > 0` |
| Capture | `jeton: jsonpath "$.token"` |
| Durée | `duration < 1000` |
