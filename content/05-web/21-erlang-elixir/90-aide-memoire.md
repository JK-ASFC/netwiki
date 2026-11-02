---
title: Erlang/OTP et Elixir — aide-mémoire des commandes
description: Commandes Erlang et Elixir avec exemples — erl (-sname, -name, -setcookie, -remsh, -noshell -eval), epmd -names, observer, rebar3 (new, compile, eunit, ct, release, shell), mix (new, deps.get, compile, test, format, release, phx.server), iex -S mix, commandes de release (start, daemon, remote, rpc, eval, stop), mise et asdf.
tags: [aide-mémoire, erlang, elixir, mix, rebar3]
icon: terminal
---

Explications : [[01-presentation-installation|Erlang/OTP et Elixir]].

## Erlang

```bash
erl -sname test ; erl -noshell -eval 'io:format("~p~n",[node()]), halt().'
epmd -names                                              # nœuds enregistrés sur la machine
erl -sname dbg -setcookie MONCOOKIE -remsh noeud@hote     # console distante
erl -sname obs -hidden -setcookie MONCOOKIE -run observer # interface graphique observer
rebar3 new app outil ; rebar3 compile ; rebar3 eunit ; rebar3 ct ; rebar3 shell ; rebar3 as prod release
```

## Elixir

```bash
elixir --version ; iex ; iex -S mix
mix new app --sup ; mix deps.get ; mix compile ; mix test ; mix format ; mix hex.outdated
MIX_ENV=prod mix release
bin/app start ; bin/app daemon ; bin/app remote ; bin/app rpc 'IO.puts(node())' ; bin/app eval 'App.Migrations.run()' ; bin/app stop
mix phx.server                                           # application Phoenix en développement
mise use erlang@27 elixir@1.18 ; asdf current
```
