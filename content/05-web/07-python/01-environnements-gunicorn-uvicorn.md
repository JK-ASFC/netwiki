---
title: Environnements, Gunicorn et Uvicorn
description: Déployer une application web Python — versions et cycle de vie, interpréteur et environnements virtuels (venv, uv), dépendances verrouillées, WSGI (Django, Flask) avec Gunicorn et ASGI (FastAPI, Django asynchrone) avec Uvicorn, nombre de workers, socket Unix, service systemd durci, fichiers statiques, Windows (Waitress, service) et macOS.
tags: [python, gunicorn, uvicorn, wsgi, asgi, django, fastapi, venv, systemd]
icon: info
---

En production, une application web Python n'est **pas** lancée avec le serveur de développement du framework (`manage.py runserver`, `flask run`) : elle est servie par un **serveur d'applications** derrière un reverse proxy.

| Interface | Frameworks | Serveur |
| --- | --- | --- |
| **WSGI** (synchrone) | Django, Flask, Pyramid | **Gunicorn**, uWSGI (en maintenance), Waitress (Windows) |
| **ASGI** (asynchrone, WebSocket) | FastAPI, Starlette, Django (async), Quart | **Uvicorn**, Hypercorn, Daphne, Granian |

## Python et environnements virtuels

- Utilisez une version de Python **supportée** (cycle de 5 ans par version) et identique en développement et en production.
- Ne modifiez **jamais** le Python du système avec `pip install` (PEP 668 l'interdit d'ailleurs sur Debian/Ubuntu récents) : un **environnement virtuel** par application.

```bash
sudo apt install python3 python3-venv          # ou une version précise via deadsnakes (Ubuntu) / python3.12 (RHEL)
sudo useradd -r -m -d /srv/appli -s /usr/sbin/nologin appli
sudo -u appli python3 -m venv /srv/appli/venv
sudo -u appli /srv/appli/venv/bin/pip install -r /srv/appli/current/requirements.txt
```

Avec **uv** (gestionnaire très rapide : versions de Python, environnements, verrouillage — voir [[04-developpement/10-uv|uv]]) :

```bash
cd /srv/appli/current
uv sync --frozen --no-dev          # installe exactement uv.lock dans .venv
uv run gunicorn --version
```

Les dépendances doivent être **verrouillées** (`uv.lock`, `requirements.txt` avec versions et empreintes via `pip-compile --generate-hashes`).

## Gunicorn (WSGI)

```python /srv/appli/current/gunicorn.conf.py
bind = "unix:/run/appli/gunicorn.sock"
workers = 5                       # point de départ : 2 × cœurs + 1
threads = 2
worker_class = "gthread"
timeout = 60
graceful_timeout = 30
max_requests = 2000               # recycle les workers (fuites mémoire)
max_requests_jitter = 200
accesslog = "-"
errorlog = "-"
forwarded_allow_ips = "127.0.0.1"
```

```bash
/srv/appli/venv/bin/gunicorn --config gunicorn.conf.py projet.wsgi:application
```

## Uvicorn (ASGI)

```bash
# Uvicorn seul (plusieurs processus)
/srv/appli/venv/bin/uvicorn app.main:app --uds /run/appli/uvicorn.sock --workers 4 --proxy-headers --forwarded-allow-ips 127.0.0.1
# Ou Gunicorn comme gestionnaire de processus avec des workers Uvicorn
/srv/appli/venv/bin/gunicorn app.main:app -k uvicorn.workers.UvicornWorker -w 4 --bind unix:/run/appli/gunicorn.sock
```

## Service systemd

```ini /etc/systemd/system/appli.service
[Unit]
Description=Application appli (Gunicorn)
After=network-online.target
Wants=network-online.target

[Service]
Type=notify
User=appli
Group=www-data
WorkingDirectory=/srv/appli/current
EnvironmentFile=/etc/appli/env
RuntimeDirectory=appli
ExecStart=/srv/appli/venv/bin/gunicorn --config gunicorn.conf.py projet.wsgi:application
ExecReload=/bin/kill -s HUP $MAINPID
Restart=on-failure
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/srv/appli/media /var/log/appli
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

`RuntimeDirectory=appli` crée `/run/appli` à chaque démarrage ; le groupe `www-data` permet à nginx d'accéder au socket. `systemctl reload appli` (SIGHUP) recharge les workers sans coupure.

## Reverse proxy et fichiers statiques

```nginx
location /static/ { alias /srv/appli/current/staticfiles/; expires 30d; }
location /media/  { alias /srv/appli/media/; }
location / {
    proxy_pass http://unix:/run/appli/gunicorn.sock;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 60s;
}
```

Django : `python manage.py collectstatic`, `SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")`, `ALLOWED_HOSTS`, `DEBUG = False`. Le serveur web sert les fichiers statiques (ou **WhiteNoise** dans l'application).

## Windows et macOS

- **Windows** : Gunicorn ne fonctionne pas sous Windows ; utilisez **Waitress** (WSGI) ou Uvicorn (ASGI), lancés comme service (NSSM, WinSW) derrière IIS (ARR) ; ou exécutez l'application dans WSL/conteneur.
- **macOS** : identique à Linux pour le développement (`brew install python`, `uv`), launchd pour un service.

Suite : [[02-securite-exploitation|sécurité, supervision et dépannage]].
