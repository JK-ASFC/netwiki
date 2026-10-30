---
title: Ruby et Rails — aide-mémoire des commandes
description: Commandes Ruby avec exemples — versions (rbenv, ruby-build, chruby, RubyInstaller), gems et Bundler (install, deployment, update, audit), Rails (new, server, console, db:migrate, assets:precompile, credentials, routes), Puma (configuration, phased restart, pumactl), tâches (rake, rails runner), Sidekiq, service systemd et diagnostic.
tags: [aide-mémoire, ruby, rails, bundler, puma, rbenv]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-ruby-puma-production|Ruby et Puma]].

## Versions

```bash
ruby -v && gem -v && bundle -v
rbenv install -l | tail -5
rbenv install 3.3.6
rbenv global 3.3.6
rbenv local 3.3.6                          # écrit .ruby-version
rbenv rehash
```

```powershell
winget install RubyInstallerTeam.RubyWithDevKit.3.3     # Windows (RubyInstaller + DevKit)
```

## Gems et Bundler

```bash
gem install bundler
gem list rails
bundle install
bundle config set --local deployment true
bundle config set --local without 'development test'
bundle install --jobs 4
bundle update rails
bundle outdated
bundle exec rake -T
gem install bundler-audit && bundle audit check --update
bundle lock --add-platform x86_64-linux
```

## Rails

```bash
rails new mon-app --database=postgresql
RAILS_ENV=production bin/rails db:create db:migrate
bin/rails db:migrate:status
bin/rails db:rollback STEP=1
RAILS_ENV=production bin/rails assets:precompile
bin/rails credentials:edit --environment production
bin/rails routes | grep users
bin/rails console -e production
bin/rails runner 'puts User.count' -e production
bin/rails server -b 127.0.0.1 -p 3000
bin/rails log:clear tmp:clear
```

## Puma

```ruby
# config/puma.rb
workers Integer(ENV.fetch("WEB_CONCURRENCY", 4))
threads 5, 5
bind "unix:///run/app/puma.sock"
environment ENV.fetch("RAILS_ENV", "production")
preload_app!
pidfile "tmp/pids/puma.pid"
state_path "tmp/pids/puma.state"
activate_control_app "unix:///run/app/pumactl.sock", { no_token: true }
```

```bash
bundle exec puma -C config/puma.rb
bundle exec pumactl -S tmp/pids/puma.state phased-restart     # redémarrage progressif
bundle exec pumactl -S tmp/pids/puma.state stats
bundle exec pumactl -S tmp/pids/puma.state stop
```

## Tâches de fond

```bash
bundle exec sidekiq -C config/sidekiq.yml -e production
bundle exec rake jobs:work                                    # delayed_job
```

## Service systemd

```ini
# /etc/systemd/system/app.service
[Service]
User=app
WorkingDirectory=/opt/app
Environment=RAILS_ENV=production
ExecStart=/home/app/.rbenv/shims/bundle exec puma -C config/puma.rb
ExecReload=/bin/kill -USR1 $MAINPID
RuntimeDirectory=app
Restart=on-failure
```

## Diagnostic

```bash
tail -f log/production.log
RAILS_LOG_LEVEL=debug bin/rails server
ruby -e 'require "openssl"; puts OpenSSL::OPENSSL_VERSION'
```
