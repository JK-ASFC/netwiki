---
title: Dapr — aide-mémoire des commandes
description: Commandes Dapr CLI avec exemples — init (-k, --slim), uninstall, run, list, stop, status -k, logs -k, components -k, configurations -k, dashboard -k, upgrade -k, mtls -k, publish, invoke ; API HTTP du sidecar (state, publish, invoke, secrets, healthz).
tags: [aide-mémoire, dapr]
icon: terminal
---

Explications : [[01-presentation-installation|Dapr]].

```bash
dapr --version ; dapr init ; dapr init --slim ; dapr uninstall --all
dapr run --app-id api --app-port 8080 -- dotnet run ; dapr list ; dapr stop --app-id api
dapr init -k --wait ; dapr status -k ; dapr upgrade -k --runtime-version 1.15.0 ; dapr mtls -k ; dapr mtls expiry
dapr components -k -n inventaire ; dapr configurations -k ; dapr logs -k --app-id inventaire -n inventaire ; dapr dashboard -k -p 9999
dapr publish --publish-app-id api --pubsub messages --topic commandes --data '{"id":1}'
dapr invoke --app-id facturation --method factures --verb POST --data '{"client":42}'
curl http://localhost:3500/v1.0/healthz ; curl http://localhost:3500/v1.0/secrets/coffre/mdp-base
```
