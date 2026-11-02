---
title: DRBD et LINSTOR — aide-mémoire des commandes
description: Commandes DRBD (drbdadm status, up, down, primary, secondary, connect, disconnect, invalidate, verify, adjust, dump, create-md ; drbdsetup events2 ; résolution de split-brain) et LINSTOR (node, storage-pool, resource-definition, resource-group, resource, volume, snapshot, error-reports) avec exemples.
tags: [aide-mémoire, drbd, drbdadm, linstor]
icon: terminal
---

Explications : [[01-presentation-installation|DRBD et LINSTOR]].

```bash
drbdadm status ; drbdadm status donnees --verbose ; drbdsetup events2 --now --statistics
drbdadm up donnees ; drbdadm down donnees ; drbdadm adjust donnees ; drbdadm dump donnees
drbdadm primary donnees ; drbdadm secondary donnees ; drbdadm verify donnees ; drbdadm invalidate donnees   # resynchroniser ce nœud depuis le pair
# Split-brain : sur le nœud dont on abandonne les modifications
drbdadm secondary donnees && drbdadm connect --discard-my-data donnees ; drbdadm connect donnees   # sur l'autre nœud si nécessaire
linstor node list ; linstor storage-pool list ; linstor resource-definition list ; linstor resource list ; linstor volume list
linstor snapshot create vm-101-disk-0 avant-maj ; linstor snapshot list ; linstor error-reports list
```
