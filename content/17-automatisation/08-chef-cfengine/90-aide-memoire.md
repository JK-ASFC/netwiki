---
title: Chef Infra et CFEngine — aide-mémoire des commandes
description: Commandes Chef/Cinc (cinc-client -z, -o, --why-run, knife bootstrap/node/role/cookbook/ssh/search/status, cookstyle, kitchen list/converge/verify/test/destroy, chef generate) et CFEngine (cf-agent -KI, --bootstrap, -n, cf-promises, cf-key, cf-serverd, cf-execd, cf-net, cf-check) avec exemples.
tags: [aide-mémoire, chef, cinc, knife, cfengine]
icon: terminal
---

Explications : [[01-chef-infra|Chef Infra]] · [[02-cfengine|CFEngine]].

```bash
cinc-client -z -o 'recipe[base_web]' ; cinc-client --why-run ; cinc-client -l info
knife node list ; knife node show srv-web-01 ; knife search node 'platform:ubuntu' ; knife status ; knife role list ; knife cookbook list
knife ssh 'role:web' 'sudo cinc-client' -x admin ; knife bootstrap HOTE -U admin --sudo -N NOM -r 'role[web]'
cinc generate cookbook base_web ; cookstyle cookbooks/ ; kitchen list ; kitchen converge ; kitchen verify ; kitchen destroy
sudo cf-agent -KI ; sudo cf-agent -n -KI          # simulation (aucune modification)
sudo cf-promises -f ./promises.cf ; sudo cf-key -s ; sudo cf-net -H 10.0.20.70 connect ; sudo cf-check diagnose
```
