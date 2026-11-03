---
title: OpenRC, runit et s6
description: Systèmes d'init alternatifs à systemd — OpenRC (BSD : Alpine, Gentoo, Devuan ; scripts /etc/init.d, rc-update, rc-service, rc-status, niveaux, supervise-daemon), runit (BSD : Void Linux, conteneurs ; services /etc/sv avec script run, sv up, down, status, svlogd) et s6 (ISC : supervision fiable, s6-svscan, s6-svc, s6-rc, s6-overlay pour Docker), comparaison et écriture d'un service pour chacun.
tags: [openrc, runit, s6, s6-overlay, init, alpine, gentoo, void, conteneurs]
icon: git-branch
---

| | OpenRC | runit | s6 |
| --- | --- | --- | --- |
| Distributions | [[06-alpine-linux/01-presentation-installation\|Alpine]], [[05-gentoo/01-presentation-installation\|Gentoo]], Devuan, Artix | Void Linux, Artix, conteneurs | Conteneurs (s6-overlay), Artix, systèmes embarqués |
| Principe | Scripts d'init avec dépendances | Supervision : un dossier par service, script `run` | Suite de supervision modulaire, très fiable |
| Redémarrage auto | Option (`supervise-daemon`) | Oui | Oui |

## OpenRC

```bash
rc-service sshd start ; rc-service sshd status ; rc-service sshd restart
rc-update add sshd default        # activer au niveau « default »
rc-update del sshd default
rc-update show ; rc-status ; rc-status --crashed
```

Script de service `/etc/init.d/api-interne` (rendu exécutable) :

```bash
#!/sbin/openrc-run
name="API interne"
command="/usr/bin/node"
command_args="/opt/api/server.js"
command_user="api:api"
directory="/opt/api"
supervisor="supervise-daemon"          # relance automatique en cas d'arrêt
output_log="/var/log/api-interne.log"
error_log="/var/log/api-interne.err"

depend() {
    need net
    after postgresql
}
```

Variables propres à l'hôte dans `/etc/conf.d/api-interne`.

## runit

Un service est un dossier contenant un script `run` qui lance le programme **au premier plan** :

```bash
mkdir -p /etc/sv/api-interne/log
cat > /etc/sv/api-interne/run <<'FIN'
#!/bin/sh
exec 2>&1
cd /opt/api
exec chpst -u api:api /usr/bin/node server.js
FIN
cat > /etc/sv/api-interne/log/run <<'FIN'
#!/bin/sh
exec svlogd -tt /var/log/api-interne
FIN
chmod +x /etc/sv/api-interne/run /etc/sv/api-interne/log/run ; mkdir -p /var/log/api-interne
ln -s /etc/sv/api-interne /var/service/        # Void ; ailleurs : /etc/service ou /run/runit/service
sv status api-interne ; sv restart api-interne ; sv down api-interne
```

## s6 et s6-overlay

s6 suit le même modèle que runit (`s6-svscan` surveille un dossier de services, chaque service a un `run`) ; `s6-svc -r /run/service/api` relance, `s6-svstat` donne l'état, et **s6-rc** ajoute la gestion des dépendances.

Dans les conteneurs, **s6-overlay** fournit un vrai PID 1 (signaux, processus zombies) et permet plusieurs processus supervisés dans une image (par exemple Nginx + PHP-FPM) : services déclarés dans `/etc/s6-overlay/s6-rc.d/<nom>/` (`type` = `longrun`, `run`), point d'entrée `ENTRYPOINT ["/init"]`. Pour un seul processus, `docker run --init` (tini) suffit.

Commandes : [[90-aide-memoire|aide-mémoire]].
