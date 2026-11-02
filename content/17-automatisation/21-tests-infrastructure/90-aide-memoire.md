---
title: Tests d'infrastructure — aide-mémoire des commandes
description: Commandes Molecule (init scenario, test, create, converge, idempotence, verify, login, destroy, list, reset, --scenario-name, --destroy=never), Testinfra (pytest --hosts, --connection, --ansible-inventory, -v), InSpec/cinc-auditor (exec, -t, --reporter, check, shell, init profile, vendor), Serverspec (rake spec) et Test Kitchen (list, create, converge, verify, test, login, destroy) avec exemples.
tags: [aide-mémoire, molecule, testinfra, inspec, cinc-auditor, test kitchen]
icon: terminal
---

Explications : [[01-molecule-testinfra|Molecule et Testinfra]] · [[02-inspec-serverspec-kitchen|InSpec, Serverspec et Test Kitchen]].

```bash
molecule init scenario -d docker ; molecule list ; molecule test ; molecule test --destroy=never ; molecule converge ; molecule idempotence
molecule verify ; molecule login -h debian12 ; molecule destroy ; molecule reset ; molecule test -s ha
pytest -v --hosts=ssh://admin@srv-web-01 tests/ ; pytest --hosts=ansible://all --ansible-inventory=inventaire/prod tests/ ; pytest --connection=docker --hosts=conteneur tests/
cinc-auditor init profile corp-socle ; cinc-auditor check corp-socle ; cinc-auditor exec corp-socle -t ssh://admin@hote --reporter json:res.json
cinc-auditor shell -t ssh://admin@hote ; cinc-auditor vendor corp-socle
rake spec ; kitchen list ; kitchen create ; kitchen converge ; kitchen verify ; kitchen login defaut-debian-12 ; kitchen test ; kitchen destroy
```
