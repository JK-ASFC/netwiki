---
title: SOPS — aide-mémoire des commandes
description: Commandes SOPS avec exemples — edit, encrypt (-i, --age, --pgp, --encrypted-regex, --input-type), decrypt (--extract), exec-env, exec-file, updatekeys, rotate, set, unset, filestatus, publish ; variables SOPS_AGE_KEY_FILE et SOPS_AGE_RECIPIENTS ; intégration Git diff.
tags: [aide-mémoire, sops]
icon: terminal
---

Explications : [[01-presentation-utilisation|SOPS]].

```bash
sops --version ; sops edit f.yaml ; sops encrypt -i --age age1… f.yaml ; sops encrypt --input-type dotenv --output-type dotenv .env > .env.enc
sops decrypt f.yaml ; sops decrypt --extract '["base"]["mot_de_passe"]' f.yaml ; sops decrypt --output clair.yaml f.yaml
sops set f.yaml '["api"]["token"]' '"nouvelle-valeur"' ; sops unset f.yaml '["ancien"]'
sops exec-env secrets.env './deploy.sh' ; sops exec-file --no-fifo cle.json 'gcloud auth activate-service-account --key-file {}'
sops updatekeys -y f.yaml ; sops rotate -i f.yaml ; sops filestatus f.yaml
export SOPS_AGE_KEY_FILE=~/.config/sops/age/keys.txt SOPS_AGE_RECIPIENTS=age1…
```
