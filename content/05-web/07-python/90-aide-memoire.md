---
title: Python (applications web) — aide-mémoire des commandes
description: Commandes Python avec exemples — interpréteurs et versions (py launcher, pyenv, uv python), environnements virtuels (venv, uv), pip (install, freeze, requirements, contraintes, audit), uv (init, add, sync, run, lock), serveurs d'application (Gunicorn, Uvicorn, Waitress), Django (migrate, collectstatic, createsuperuser, check --deploy), Flask, service systemd, diagnostic.
tags: [aide-mémoire, python, pip, venv, uv, gunicorn, uvicorn, django]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-environnements-gunicorn-uvicorn|Python]].

## Interpréteurs et environnements

```bash
python3 --version
python3 -m venv /opt/app/.venv
source /opt/app/.venv/bin/activate          # Windows : .venv\Scripts\Activate.ps1
deactivate
pyenv install 3.12.7 && pyenv local 3.12.7  # versions multiples (Linux, macOS)
```

```powershell
py -0p                                       # versions installées (lanceur Windows)
py -3.12 -m venv .venv
```

## pip

```bash
python -m pip install --upgrade pip
pip install "django>=5.1,<5.2" gunicorn
pip install -r requirements.txt
pip install -r requirements.txt -c constraints.txt
pip freeze > requirements.txt
pip list --outdated
pip show django
pip uninstall -y paquet
pip download -d ./wheels -r requirements.txt          # préparer une installation hors ligne
pip install --no-index --find-links ./wheels -r requirements.txt
pip config set global.index-url https://nexus.exemple.fr/repository/pypi/simple
pip install pip-audit && pip-audit                    # vulnérabilités connues
```

## uv (gestionnaire rapide)

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh      # Windows : winget install astral-sh.uv
uv python install 3.12
uv init mon-app && cd mon-app
uv add fastapi uvicorn
uv add --dev pytest
uv sync --frozen                                      # environnement identique au uv.lock
uv run uvicorn app.main:app --reload
uv lock --upgrade
uv pip install -r requirements.txt                    # interface compatible pip
uv tool install ruff
```

## Serveurs d'application

```bash
# Gunicorn (WSGI : Django, Flask)
gunicorn monprojet.wsgi:application --bind 127.0.0.1:8000 --workers 4 --timeout 60 --access-logfile -
# Gunicorn avec workers Uvicorn (ASGI : FastAPI, Django async)
gunicorn app.main:app -k uvicorn.workers.UvicornWorker --workers 4 --bind unix:/run/app/app.sock
# Uvicorn seul
uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 4 --proxy-headers --forwarded-allow-ips="127.0.0.1"
# Waitress (Windows)
waitress-serve --listen=127.0.0.1:8000 monprojet.wsgi:application
```

Règle de départ pour les workers Gunicorn : `2 × cœurs + 1`.

## Django

```bash
python manage.py check --deploy               # contrôles de sécurité de production
python manage.py migrate
python manage.py makemigrations
python manage.py showmigrations
python manage.py collectstatic --noinput
python manage.py createsuperuser
python manage.py changepassword amartin
python manage.py shell
python manage.py dbshell
python manage.py clearsessions
python manage.py dumpdata --indent 2 > sauvegarde.json
python manage.py loaddata sauvegarde.json
```

## Flask

```bash
flask --app app routes
flask --app app run --debug              # développement uniquement
```

## Service systemd

```ini
# /etc/systemd/system/app.service
[Unit]
Description=Application Python
After=network.target

[Service]
User=app
WorkingDirectory=/opt/app
EnvironmentFile=/opt/app/.env
ExecStart=/opt/app/.venv/bin/gunicorn monprojet.wsgi:application --bind unix:/run/app/app.sock --workers 4
RuntimeDirectory=app
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

## Diagnostic

```bash
python -X importtime -c "import django" 2>&1 | tail -5
python -m cProfile -s cumtime script.py | head -30
py-spy top --pid $(pgrep -f gunicorn | head -1)     # profiler un processus en cours
python -m http.server 8080 --bind 127.0.0.1          # serveur de fichiers de test
```
