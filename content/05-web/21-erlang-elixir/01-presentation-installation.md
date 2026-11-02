---
title: Présentation, installation et exploitation
description: Erlang/OTP et Elixir — machine virtuelle BEAM pour systèmes concurrents, distribués et tolérants aux pannes : produits qui l'utilisent (RabbitMQ, ejabberd, CouchDB, VerneMQ, Phoenix), installation (paquets des distributions, dépôts, asdf ou mise, Windows, macOS, Docker), compatibilité des versions OTP, rebar3, mix, releases, distribution Erlang (epmd port 4369, cookie, ports), console distante, observer, et sécurité.
tags: [erlang, otp, elixir, beam, rabbitmq, phoenix, mix, rebar3]
icon: info
---

**Erlang/OTP** (Apache 2.0) et **Elixir** (même machine virtuelle **BEAM**) sont conçus pour des milliers de processus légers isolés, supervisés et redémarrés automatiquement. L'administrateur les rencontre surtout à travers [[03-rabbitmq/01-presentation-installation|RabbitMQ]], ejabberd, [[07-couchdb/01-presentation-installation|CouchDB]] ou des applications **Phoenix**.

> [!NOTE]
> Chaque produit exige une plage de versions **OTP** précise (par exemple, RabbitMQ publie sa matrice de compatibilité) : installez Erlang depuis le dépôt recommandé par l'éditeur du produit plutôt qu'une version quelconque.

## Installation

| Système | Erlang | Elixir |
| --- | --- | --- |
| Debian/Ubuntu | `sudo apt install erlang` (ou dépôt du produit, ex. Team RabbitMQ) | `sudo apt install elixir` |
| RHEL/Fedora | `sudo dnf install erlang` (EPEL / dépôts RabbitMQ) | `sudo dnf install elixir` |
| Alpine | `sudo apk add erlang` | `sudo apk add elixir` |
| macOS | `brew install erlang` | `brew install elixir` |
| Windows | Installeur officiel (erlang.org) | Installeur officiel (elixir-lang.org) |
| Version précise | `asdf install erlang 27.2` ou `mise use erlang@27` | `mise use elixir@1.18` |
| Docker | `erlang:27` | `elixir:1.18` |

```bash
erl -noshell -eval 'io:format("~s~n", [erlang:system_info(otp_release)]), halt().'
elixir --version
```

## Construire et livrer

```bash
# Erlang
rebar3 new release passerelle && cd passerelle && rebar3 compile && rebar3 as prod release
# Elixir
mix new collecteur --sup && cd collecteur
mix deps.get ; mix test ; MIX_ENV=prod mix release
_build/prod/rel/collecteur/bin/collecteur daemon      # démarrer
_build/prod/rel/collecteur/bin/collecteur remote      # console sur le nœud en marche
_build/prod/rel/collecteur/bin/collecteur stop
```

Une **release** embarque l'ERTS : la machine cible n'a pas besoin d'Erlang installé (même architecture et glibc compatibles).

## Distribution et sécurité

Les nœuds Erlang se connectent entre eux via **epmd** (TCP **4369**) et une plage de ports dynamiques, authentifiés par un **cookie** partagé (`~/.erlang.cookie`, droits `400`).

```bash
erl -sname admin -setcookie "$(sudo cat /var/lib/rabbitmq/.erlang.cookie)" -remsh rabbit@srv-mq-01   # console distante
```

- Limiter la plage : `-kernel inet_dist_listen_min 25672 inet_dist_listen_max 25672` et filtrer 4369/25672 au pare-feu.
- Le cookie donne un **contrôle total** du nœud (exécution de code) : ne jamais l'exposer ; TLS de distribution possible (`-proto_dist inet_tls`).

Commandes : [[90-aide-memoire|aide-mémoire]].
