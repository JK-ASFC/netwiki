---
title: Perl et Lua — aide-mémoire des commandes
description: Commandes Perl (perl -v, -c, -e, -n, -p, -i, -l, -a, -F, -M, perldoc, cpanm, local::lib, carton, perlbrew) et Lua (lua, luac -p, luarocks install/list/remove, --local, LUA_PATH) avec exemples.
tags: [aide-mémoire, perl, lua, cpan, luarocks]
icon: terminal
---

Explications : [[01-perl|Perl]] · [[02-lua|Lua]].

## Perl

```bash
perl -v ; perl -c script.pl ; perl -wE 'say "ok"'
perl -ne 'print if /motif/' fichier ; perl -pi -e 's/ancien/nouveau/g' fichier
perl -lane 'print $F[2]' fichier ; perl -F: -lane 'print $F[0]' /etc/passwd
perl -MData::Dumper -e 'print Dumper(\%ENV)'
perldoc perlrun ; perldoc -f sprintf ; perldoc -m Module::Nom
cpanm Module::Nom ; cpanm --installdeps . ; carton install ; carton exec perl app.pl
perlbrew list ; perlbrew switch perl-5.40.0
```

## Lua

```bash
lua -v ; lua script.lua ; lua -e 'print(_VERSION)' ; luac -p *.lua
luarocks search json ; luarocks install --local lua-cjson ; luarocks list ; luarocks remove lua-cjson
eval "$(luarocks path)"          # LUA_PATH et LUA_CPATH pour les modules locaux
```
