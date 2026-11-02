---
title: step-ca, step CLI et EJBCA — aide-mémoire
description: Commandes step (ca init, ca health, ca bootstrap, ca certificate, ca renew, ca revoke, ca provisioner list/add/remove, ssh certificate, certificate inspect/create/fingerprint/verify, crypto keypair, path) et EJBCA (ejbca.sh ca listcas, ra addendentity, ra setclearpwd, batch, createcrl ; API REST) avec exemples.
tags: [aide-mémoire, step-ca, step cli, ejbca]
icon: terminal
---

Explications : [[01-step-ca|step-ca et step CLI]] · [[02-ejbca|EJBCA]].

```bash
step ca health ; step ca roots racine.crt ; step ca provisioner list | jq '.[].name'
step ca certificate srv.corp.exemple.fr srv.crt srv.key --san 10.0.20.15 --not-after 2160h ; step ca renew --force srv.crt srv.key
step ca revoke --cert srv.crt --key srv.key ; step ssh certificate --host srv-web-01.corp.exemple.fr ssh_host_ecdsa_key.pub
step certificate inspect srv.crt ; step certificate fingerprint racine.crt ; step certificate verify srv.crt --roots racine.crt
step certificate create test.local test.crt test.key --profile self-signed --subtle --no-password --insecure ; step crypto keypair pub.json priv.json
docker exec -it ejbca /opt/keyfactor/bin/ejbca.sh ca listcas ; docker exec -it ejbca /opt/keyfactor/bin/ejbca.sh ca createcrl
docker exec -it ejbca /opt/keyfactor/bin/ejbca.sh ra addendentity --help
```
