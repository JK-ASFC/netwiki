---
title: Buildbot
description: Buildbot — framework d'intégration continue en Python (GPL) utilisé par de grands projets libres : architecture maître et workers, installation (pip, environnement virtuel, Docker), création du maître et des workers, master.cfg (workers, change sources, schedulers, builders, BuildFactory et étapes ShellCommand, Git, rapports), interface web (port 8010), authentification, service systemd, et cas d'usage (matrices multi-plates-formes Windows, Linux, macOS, BSD).
tags: [buildbot, ci, intégration continue, python, workers]
icon: info
---

**Buildbot** est une boîte à outils de CI dont la configuration est un **programme Python** (`master.cfg`) : très souple pour des matrices de construction complexes sur des machines physiques variées (Windows, Linux, BSD, ARM). Python, LLVM historiquement, ou WebKit l'utilisent. Pour une CI classique liée à une forge, [[02-gitlab/03-ci-cd-runners|GitLab CI]], [[05-jenkins/01-presentation-installation|Jenkins]] ou [[09-woodpecker-drone/01-presentation-installation|Woodpecker]] sont plus rapides à mettre en place.

## Installation

```bash
# Maître (Linux)
sudo apt install python3-venv git
python3 -m venv /opt/buildbot && . /opt/buildbot/bin/activate
pip install 'buildbot[bundle]'                 # maître + interface web
buildbot create-master /srv/buildbot/maitre
cp /srv/buildbot/maitre/master.cfg.sample /srv/buildbot/maitre/master.cfg
buildbot checkconfig /srv/buildbot/maitre && buildbot start /srv/buildbot/maitre

# Worker (Linux, macOS, Windows avec Python)
pip install buildbot-worker
buildbot-worker create-worker /srv/buildbot/worker-lin01 buildbot.corp.exemple.fr:9989 worker-lin01 MdpWorker2026
buildbot-worker start /srv/buildbot/worker-lin01
```

Docker : images `buildbot/buildbot-master` et `buildbot/buildbot-worker`. Ports : **9989** (workers → maître), **8010** (interface web).

## master.cfg (extrait)

```python
from buildbot.plugins import worker, changes, schedulers, util, steps

c = BuildmasterConfig = {}
c['workers'] = [worker.Worker("worker-lin01", "MdpWorker2026"), worker.Worker("worker-win01", "MdpWorker2026")]
c['protocols'] = {'pb': {'port': 9989}}
c['change_source'] = [changes.GitPoller('https://git.corp.exemple.fr/infra/outils.git', branches=['main'], pollInterval=300)]

f = util.BuildFactory()
f.addStep(steps.Git(repourl='https://git.corp.exemple.fr/infra/outils.git', mode='incremental'))
f.addStep(steps.ShellCommand(command=["make", "test"], name="tests"))

c['builders'] = [util.BuilderConfig(name="outils-linux", workernames=["worker-lin01"], factory=f)]
c['schedulers'] = [schedulers.SingleBranchScheduler(name="main", change_filter=util.ChangeFilter(branch='main'), builderNames=["outils-linux"]),
                   schedulers.ForceScheduler(name="forcer", builderNames=["outils-linux"])]
c['www'] = {'port': 8010, 'auth': util.UserPasswordAuth({"admin": "MdpWeb2026"}),
            'authz': util.Authz(allowRules=[util.AnyControlEndpointMatcher(role="admins")],
                                roleMatchers=[util.RolesFromUsername(roles=["admins"], usernames=["admin"])])}
c['buildbotURL'] = "https://buildbot.corp.exemple.fr/"
c['db'] = {'db_url': "sqlite:///state.sqlite"}     # PostgreSQL recommandé en production
```

```bash
buildbot checkconfig /srv/buildbot/maitre && buildbot reconfig /srv/buildbot/maitre
```

Suite : [[02-gocd|GoCD]] · [[03-interface-graphique|interfaces graphiques]] · [[90-aide-memoire|aide-mémoire]].
