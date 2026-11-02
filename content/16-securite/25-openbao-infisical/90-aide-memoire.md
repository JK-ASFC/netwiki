---
title: OpenBao et Infisical — aide-mémoire des commandes
description: Commandes bao (status, operator init/unseal/seal/raft list-peers/raft snapshot save/restore/step-down, login, secrets enable/list, kv put/get/list/metadata/rollback, auth enable/list, policy write/read, token create/lookup/revoke, audit enable, write/read) et infisical (login, init, run, export, secrets get/set/delete, user, --env, --path) avec exemples.
tags: [aide-mémoire, openbao, bao, infisical]
icon: terminal
---

Explications : [[01-openbao|OpenBao]] · [[02-infisical|Infisical]].

```bash
bao status ; bao operator raft list-peers ; bao operator raft snapshot save bao-$(date +%F).snap ; bao operator raft snapshot restore x.snap
bao operator seal ; bao operator unseal ; bao operator step-down
bao login -method=oidc ; bao token lookup ; bao token create -policy=lecture-infra -ttl=8h ; bao token revoke -self
bao secrets list ; bao kv put secret/app/db password=… ; bao kv get -field=password secret/app/db ; bao kv list secret/app ; bao kv rollback -version=2 secret/app/db
bao auth list ; bao policy list ; bao policy read lecture-infra ; bao audit list
infisical login ; infisical secrets --env=prod ; infisical secrets get API_CLE --env=prod --plain ; infisical secrets delete ANCIEN --env=dev
infisical run --env=recette --path=/backend -- npm start ; infisical export --env=prod --format=json > secrets.json
```
