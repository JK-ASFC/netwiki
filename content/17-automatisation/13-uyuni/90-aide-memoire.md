---
title: Uyuni — aide-mémoire des commandes
description: Commandes Uyuni avec exemples — mgradm (install, status, start, stop, restart, upgrade, backup), mgrctl (term, exec, status), spacecmd (system_list, softwarechannel_list, errata_list, system_applyerrata, system_runscript), spacewalk-common-channels, spacewalk-repo-sync, salt (test.ping, state.apply) et sur les clients (venv-salt-minion).
tags: [aide-mémoire, uyuni, spacecmd, salt, mgradm]
icon: terminal
---

Explications : [[01-presentation-installation|Uyuni]].

```bash
mgradm status ; mgradm restart ; mgradm upgrade podman ; mgrctl term       # shell dans le conteneur serveur
mgrctl exec -- spacewalk-common-channels -a x86_64 almalinux9 almalinux9-appstream
mgrctl exec -- spacewalk-repo-sync -c almalinux9-x86_64
spacecmd -u admin -- system_list ; spacecmd -- softwarechannel_list ; spacecmd -- errata_list | head
spacecmd -- system_applyerrata srv-web-01.corp.exemple.fr ALSA-2026:1234 ; spacecmd -- system_runscript srv-web-01.corp.exemple.fr
mgrctl exec -- salt '*' test.ping ; mgrctl exec -- salt -N web state.apply ntp
sudo systemctl status venv-salt-minion           # sur un client
```
