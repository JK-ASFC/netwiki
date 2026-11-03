---
title: Supervisor, Monit et Circus
description: Superviseurs de processus indépendants du système d'init — Supervisor (BSD, Python : programmes dans /etc/supervisor/conf.d, autorestart, journaux, groupes, supervisorctl reread, update, status, interface web inet_http_server), Monit (AGPL : surveillance et réparation automatique de processus, fichiers, disques et services réseau, monitrc, check process, alertes e-mail, monit -t, summary, interface sur le port 2812) et Circus (Apache 2.0, Mozilla : watchers, nombre de processus, sockets partagés, circusctl), cas d'usage et comparaison avec systemd.
tags: [supervisor, supervisord, monit, circus, processus, supervision, python]
icon: heart-pulse
---

Sur une distribution avec [[01-systemd|systemd]], une unité de service avec `Restart=on-failure` suffit souvent. Ces outils restent utiles : **plusieurs processus dans un conteneur**, applications Python déployées par utilisateur, ou **surveillance active** (Monit vérifie qu'un service *répond*, pas seulement qu'il tourne).

| Outil | Rôle | Systèmes | Licence |
| --- | --- | --- | --- |
| **Supervisor** | Lance et relance des programmes, centralise leurs journaux | Linux, macOS, BSD | BSD |
| **Monit** | Surveille processus, ports, fichiers, disques et **répare** (redémarrage, alerte) | Linux, BSD, macOS | AGPL 3.0 |
| **Circus** | Gestion de groupes de processus et de sockets (Python) | Linux, macOS | Apache 2.0 — peu actif |

## Supervisor

```bash
sudo apt install supervisor            # dnf install supervisor (EPEL) ; pip install supervisor
```

`/etc/supervisor/conf.d/api.conf` (RHEL : `/etc/supervisord.d/api.ini`) :

```ini
[program:api]
command=/opt/api/venv/bin/gunicorn app:app -b 127.0.0.1:8000 -w 4
directory=/opt/api
user=api
autostart=true
autorestart=true
startretries=5
stopsignal=TERM
stdout_logfile=/var/log/supervisor/api.log
stdout_logfile_maxbytes=20MB
stdout_logfile_backups=5
redirect_stderr=true
environment=APP_ENV="production"

[program:worker]
command=/opt/api/venv/bin/celery -A app worker
process_name=%(program_name)s_%(process_num)02d
numprocs=2
directory=/opt/api
user=api
autorestart=true
```

```bash
sudo supervisorctl reread && sudo supervisorctl update     # prendre en compte les fichiers
sudo supervisorctl status ; sudo supervisorctl restart api ; sudo supervisorctl tail -f api
```

L'interface web (`[inet_http_server]`, port 9001) doit être protégée par mot de passe et limitée à `127.0.0.1`.

## Monit

```bash
sudo apt install monit                 # dnf install monit (EPEL)
```

`/etc/monit/monitrc` (RHEL : `/etc/monitrc`) ou fichiers dans `/etc/monit/conf.d/` :

```text
set daemon 60
set log /var/log/monit.log
set mailserver smtp.corp.exemple.fr port 587
set alert supervision@corp.exemple.fr
set httpd port 2812 and
    use address 127.0.0.1
    allow admin:MotDePasseLong

check process nginx with pidfile /run/nginx.pid
    start program = "/usr/bin/systemctl start nginx"
    stop program  = "/usr/bin/systemctl stop nginx"
    if failed host 127.0.0.1 port 80 protocol http request "/sante" then restart
    if cpu > 80% for 5 cycles then alert
    if 3 restarts within 5 cycles then unmonitor

check filesystem racine with path /
    if space usage > 90% then alert

check file certificat with path /etc/ssl/certs/intranet.pem
    if changed checksum then alert
```

```bash
sudo monit -t                          # vérifier la syntaxe
sudo monit reload ; sudo monit summary ; sudo monit status nginx
```

Pour une supervision d'ensemble avec historique et tableaux de bord, Monit se complète par une plate-forme de supervision ; M/Monit (commercial) centralise plusieurs instances.

## Circus

```bash
pip install circus
```

```ini
# circus.ini
[circus]
check_delay = 5

[watcher:web]
cmd = /opt/api/venv/bin/chaussette --fd $(circus.sockets.web) app.application
use_sockets = True
numprocesses = 4
copy_env = True

[socket:web]
host = 127.0.0.1
port = 8000
```

`circusd --daemon circus.ini`, puis `circusctl status`, `circusctl incr web` (ajouter un processus), `circusctl reload`. Le projet évolue peu : pour une nouvelle installation, préférer systemd ou Supervisor.

Commandes : [[90-aide-memoire|aide-mémoire]].
