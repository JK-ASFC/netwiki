---
title: Init et processus — aide-mémoire
description: Commandes systemd (systemctl, journalctl, timers, systemd-analyze), OpenRC (rc-service, rc-update, rc-status), runit (sv), s6 (s6-svc, s6-svstat), Supervisor (supervisorctl), Monit (monit -t, summary), Circus (circusctl), PM2 (start, reload, logs, startup, save) et forever.
tags: [aide-mémoire, systemd, openrc, runit, s6, supervisor, monit, pm2]
icon: terminal
---

Explications : [[01-systemd|systemd]] · [[02-openrc-runit-s6|OpenRC, runit, s6]] · [[03-supervisor-monit-circus|Supervisor, Monit, Circus]] · [[04-pm2-forever|PM2 et forever]].

## Systèmes d'init

```bash
systemctl status nginx ; sudo systemctl enable --now nginx ; sudo systemctl edit nginx ; sudo systemctl daemon-reload
systemctl --failed ; systemctl list-timers ; systemd-analyze blame ; systemd-analyze security api-interne
journalctl -u nginx -f ; journalctl -b -1 -p err ; sudo journalctl --vacuum-time=30d
rc-service sshd restart ; rc-update add sshd default ; rc-status
sv status api-interne ; sv restart api-interne ; ln -s /etc/sv/api-interne /var/service/
s6-svc -r /run/service/api ; s6-svstat /run/service/api
```

## Superviseurs

```bash
sudo supervisorctl reread && sudo supervisorctl update ; sudo supervisorctl status ; sudo supervisorctl restart api
sudo monit -t ; sudo monit reload ; sudo monit summary
circusd --daemon circus.ini ; circusctl status ; circusctl incr web
pm2 start ecosystem.config.js --env production ; pm2 reload api ; pm2 logs api ; pm2 startup systemd -u api --hp /home/api ; pm2 save
forever start server.js ; forever list ; forever stopall
```
