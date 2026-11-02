---
title: Perl
description: Perl 5 — langage de traitement de texte et de scripts d'administration, présent par défaut sur Linux, BSD et macOS : versions, installation Windows (Strawberry Perl), perlbrew et plenv, CPAN, cpanminus, local::lib, Carton, uniligne (perl -ne, -pe, -i, -a, -F) pour remplacer sed et awk, exemples d'administration (journaux, CSV, réseau), perldoc, et outils système écrits en Perl.
tags: [perl, scripts, cpan, administration, texte, regex]
icon: info
---

**Perl** reste omniprésent dans l'administration Unix : de nombreux outils système en dépendent (Debconf, `exiftool`, `logwatch`, `mysqltuner`, `nagios` historiques, `ack`, Munin, SpamAssassin…). Ses **expressions régulières** ont servi de modèle à presque tous les langages.

## Installation

| Système | Commande |
| --- | --- |
| Linux, BSD, macOS | Déjà installé (`perl -v`) ; modules : `sudo apt install libjson-perl`, `sudo dnf install perl-JSON` |
| Windows | **Strawberry Perl** : `winget install StrawberryPerl.StrawberryPerl` (compilateur inclus pour les modules CPAN) |
| Version dédiée | `perlbrew` : `curl -L https://install.perlbrew.pl \| bash`, puis `perlbrew install perl-5.40.0` |

Évitez de modifier le Perl du système avec `cpan` en root : préférez les paquets de la distribution, ou **local::lib** / **perlbrew** pour vos applications.

```bash
sudo apt install cpanminus liblocal-lib-perl
cpanm --local-lib=~/perl5 local::lib && eval "$(perl -I ~/perl5/lib/perl5 -Mlocal::lib)"
cpanm Mojolicious Text::CSV_XS
carton install          # dépendances figées d'une application (cpanfile + cpanfile.snapshot)
```

## Uniligne utiles

```bash
perl -ne 'print if /ERROR|CRIT/' /var/log/syslog                         # filtrer
perl -pi.bak -e 's/^#?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config   # éditer avec sauvegarde .bak
perl -lane 'print $F[0] if $F[8] == 404' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head   # IP en 404
perl -F';' -lane 'print "$F[1];$F[3]"' export.csv                        # colonnes d'un CSV simple
perl -MJSON::PP -0777 -ne 'print decode_json($_)->{version}, "\n"' package.json
perl -e 'printf "%.1f Go\n", (-s shift)/1024**3' image.iso
```

## Script

```perl
#!/usr/bin/perl
use strict;
use warnings;
use IO::Socket::INET;

# Vérifie l'ouverture de ports sur une liste d'hôtes
my @cibles = ('srv-web-01:443', 'srv-db-01:5432');
for my $cible (@cibles) {
    my $s = IO::Socket::INET->new(PeerAddr => $cible, Timeout => 3);
    printf "%-25s %s\n", $cible, $s ? 'ouvert' : "fermé ($@)";
}
```

Documentation hors ligne : `perldoc perlre`, `perldoc -f split`, `perldoc Text::CSV_XS`. Suite : [[02-lua|Lua]] · [[90-aide-memoire|aide-mémoire]].
