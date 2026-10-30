---
title: Ruby et Puma en production
description: Héberger une application Ruby (Rails, Sinatra) — versions de Ruby et gestionnaires (rbenv, mise, paquets), Bundler et Gemfile.lock, serveur Puma (workers, threads, socket Unix, préchargement, redémarrage progressif), service systemd, reverse proxy nginx, Rails en production (identifiants chiffrés, assets, migrations), tâches de fond (Sidekiq, Solid Queue), sécurité (bundler-audit, Brakeman) et dépannage.
tags: [ruby, rails, puma, bundler, rbenv, systemd, sidekiq, sécurité]
icon: gem
---

Les applications **Ruby** (principalement **Ruby on Rails**) sont servies en production par **Puma**, serveur multiprocessus et multithread, derrière un reverse proxy. Des applications d'infrastructure courantes sont écrites en Ruby : GitLab, Redmine, Discourse, Mastodon, Chef, Puppet (serveur JRuby).

## Ruby et dépendances

```bash
# Version de Ruby par application avec rbenv (ou mise / asdf)
sudo apt install -y git build-essential libssl-dev libyaml-dev zlib1g-dev libffi-dev
sudo useradd -r -m -d /srv/appli -s /bin/bash appli
sudo -iu appli bash -c 'git clone https://github.com/rbenv/rbenv.git ~/.rbenv && git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build'
sudo -iu appli bash -lc '~/.rbenv/bin/rbenv install 3.3.6 && ~/.rbenv/bin/rbenv global 3.3.6'

# Dépendances verrouillées
cd /srv/appli/current
bundle config set --local deployment true
bundle config set --local without 'development test'
bundle install --jobs 4
```

Les paquets de la distribution (`ruby`, `ruby-dev`) conviennent si leur version correspond à l'application. Sous **Windows**, RubyInstaller existe mais la production Ruby se fait sous Linux (ou conteneur) ; macOS : `brew install rbenv ruby-build`.

## Puma

```ruby /srv/appli/current/config/puma.rb
workers Integer(ENV.fetch("WEB_CONCURRENCY", 4))        # processus (≈ nombre de cœurs)
threads_count = Integer(ENV.fetch("RAILS_MAX_THREADS", 5))
threads threads_count, threads_count
preload_app!                                            # mémoire partagée (copy-on-write) entre workers
bind "unix:///run/appli/puma.sock"
environment ENV.fetch("RAILS_ENV", "production")
pidfile "/run/appli/puma.pid"
worker_timeout 60
plugin :tmp_restart
```

Le nombre de **threads** doit rester inférieur ou égal à la taille du pool de connexions à la base (`pool:` dans `database.yml`).

```ini /etc/systemd/system/appli.service
[Unit]
Description=Application Rails (Puma)
After=network-online.target

[Service]
Type=notify
User=appli
WorkingDirectory=/srv/appli/current
EnvironmentFile=/etc/appli/env
RuntimeDirectory=appli
ExecStart=/srv/appli/.rbenv/shims/bundle exec puma -C config/puma.rb
ExecReload=/bin/kill -USR1 $MAINPID
Restart=on-failure
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
```

`USR1` déclenche un **redémarrage progressif** (*phased restart*) des workers (sans `preload_app!`) ; `systemctl restart` pour une nouvelle version de Ruby ou de gems natives. nginx pointe vers `unix:/run/appli/puma.sock` comme pour les autres serveurs d'applications ([[07-python/01-environnements-gunicorn-uvicorn|exemple Python]]), et sert `public/` directement.

## Rails en production

```bash
# Variables : RAILS_ENV=production, RAILS_MASTER_KEY (déchiffre config/credentials.yml.enc), DATABASE_URL
RAILS_ENV=production bundle exec rails assets:precompile
RAILS_ENV=production bundle exec rails db:migrate
RAILS_ENV=production bundle exec rails runner 'puts Rails.application.config.force_ssl'
```

- `config.force_ssl = true`, `config.assume_ssl = true` derrière un proxy TLS ; `config.hosts` renseigné.
- Journaux vers la sortie standard (`RAILS_LOG_TO_STDOUT`) en JSON (lograge).
- Tâches de fond : **Sidekiq** (Redis) ou **Solid Queue** (base de données, par défaut dans Rails 8) en service séparé.

## Sécurité

```bash
gem install bundler-audit brakeman
bundle-audit check --update       # gems vulnérables
brakeman -q -o rapport.html       # analyse statique de l'application Rails
```

- [ ] Ruby et Rails dans des versions supportées ; mises à jour de sécurité suivies
- [ ] `RAILS_MASTER_KEY` et secrets hors du dépôt, fichier d'environnement protégé
- [ ] Utilisateur dédié, code non inscriptible, `public/uploads` sans exécution
- [ ] En-têtes et CSP (`config/initializers/content_security_policy.rb`)

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| 502 du proxy | Puma arrêté, socket ou droits | `journalctl -u appli`, droits de `/run/appli` |
| `ActiveRecord::ConnectionTimeoutError` | Plus de threads que de connexions au pool | `pool` ≥ `RAILS_MAX_THREADS` (× workers côté serveur de base) |
| `Missing secret_key_base` / identifiants illisibles | `RAILS_MASTER_KEY` absente | Variable d'environnement |
| Gems natives en échec (`nokogiri`, `pg`) | Bibliothèques de développement absentes | Paquets `-dev`, reconstruire après montée de Ruby |
| Assets 404 | Précompilation non faite, `public_file_server` | `assets:precompile`, nginx sert `public/` |
| Mémoire élevée | Fragmentation (glibc) | `MALLOC_ARENA_MAX=2` ou jemalloc, YJIT selon le besoin |
