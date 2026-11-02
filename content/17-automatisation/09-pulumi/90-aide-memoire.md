---
title: Pulumi — aide-mémoire des commandes
description: Commandes Pulumi avec exemples — login, new, stack init/select/ls/rm/output/export/import, config set/get (--secret), preview (--diff), up (--yes, --target, --refresh), refresh, destroy, import, state delete/unprotect, cancel, plugin ls, package add, about, whoami, logs.
tags: [aide-mémoire, pulumi, iac]
icon: terminal
---

Explications : [[01-presentation-installation|Pulumi]].

```bash
pulumi version ; pulumi about ; pulumi whoami ; pulumi login --local ; pulumi login s3://bucket ; pulumi logout
pulumi new go --name projet ; pulumi stack init recette ; pulumi stack select prod ; pulumi stack ls ; pulumi stack output --json
pulumi config ; pulumi config set region eu-west-3 ; pulumi config set --secret jeton … ; pulumi config get jeton --show-secrets
pulumi preview --diff ; pulumi up --yes ; pulumi up --target 'urn:pulumi:prod::projet::k8s:core/v1:Namespace::reseau' ; pulumi refresh --yes
pulumi destroy --yes ; pulumi import <type> <nom> <id> ; pulumi state delete <urn> ; pulumi state unprotect <urn> ; pulumi cancel
pulumi stack export --file etat.json ; pulumi stack import --file etat.json ; pulumi plugin ls ; pulumi package add terraform-provider netbox
```
