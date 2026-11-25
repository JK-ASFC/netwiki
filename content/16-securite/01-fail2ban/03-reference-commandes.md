---
title: Référence complète des commandes
description: Référence exhaustive de fail2ban — options de fail2ban-client, commandes de base (start, restart, reload, stop, status, ping, unban, banned), commandes de journalisation et de base de données, contrôle des prisons (add, start, stop, status), toutes les sous-commandes set et get d'une prison (ignoreip, logpath, failregex, findtime, bantime, banip, actions), configuration des actions, fail2ban-regex et fail2ban-server, pour fail2ban 1.x.
tags: [fail2ban, fail2ban-client, référence, commandes, fail2ban-regex, prison, action]
icon: terminal
---

Référence exhaustive des commandes de **fail2ban 1.x** (`fail2ban-client`, `fail2ban-regex`, `fail2ban-server`). Explications et configuration : [[01-presentation-configuration|fail2ban]] ; filtres et exploitation : [[02-filtres-exploitation|filtres]].

`fail2ban-client` dialogue avec le démon via le socket ; toute commande de configuration appliquée à chaud est **perdue au `reload`** (modifier `jail.local` pour la rendre permanente).

## Options de `fail2ban-client`

```bash
fail2ban-client [OPTIONS] <COMMANDE>
```

| Option | Rôle |
| --- | --- |
| `-c, --conf <DIR>` | Répertoire de configuration (défaut `/etc/fail2ban`) |
| `-s, --socket <FILE>` | Chemin du socket |
| `-p, --pidfile <FILE>` | Chemin du fichier PID |
| `--pname <NAME>` | Nom du processus pour identifier l'instance |
| `--loglevel <LEVEL>` / `--logtarget <TARGET>` | Niveau / cible de journalisation |
| `--syslogsocket auto\|<FILE>` | Socket syslog |
| `-d` | Vider la configuration (débogage) ; `--dp`/`--dump-pretty` = version lisible |
| `-t, --test` | **Tester** la configuration |
| `-i` | Mode **interactif** |
| `-v` / `-q` | Plus / moins de verbosité |
| `-x` | Forcer l'exécution du serveur (supprimer le socket résiduel) |
| `-b` / `-f` | Démarrer en arrière-plan (défaut) / au premier plan |
| `--str2sec <STRING>` | Convertir une durée abrégée (`1d`, `1h`) en secondes |
| `-h, --help` · `-V, --version` | Aide · version |

## Commandes de base

```bash
fail2ban-client start                      # démarre serveur + prisons
fail2ban-client stop                       # arrête tout
fail2ban-client restart                    # redémarre le serveur
fail2ban-client restart [--unban] [--if-exists] <PRISON>   # redémarre une prison
fail2ban-client reload [--restart] [--unban] [--all]       # recharge la config sans couper le serveur
fail2ban-client reload [--restart] [--unban] [--if-exists] <PRISON>
fail2ban-client status                     # état du serveur (prisons actives)
fail2ban-client ping                       # le serveur répond-il ?
fail2ban-client version                    # version du serveur
fail2ban-client unban --all                # débannir TOUTES les IP (prisons + base)
fail2ban-client unban <IP> ... <IP>        # débannir une ou plusieurs IP partout
fail2ban-client banned                     # dictionnaire {prison: [IP bannies]}
fail2ban-client banned <IP> ... <IP>       # prisons où chaque IP est bannie
```

## Journalisation

```bash
fail2ban-client set loglevel <NIVEAU>      # CRITICAL ERROR WARNING NOTICE INFO DEBUG TRACEDEBUG HEAVYDEBUG
fail2ban-client get loglevel
fail2ban-client set logtarget <CIBLE>      # STDOUT STDERR SYSLOG SYSTEMD-JOURNAL ou un fichier
fail2ban-client get logtarget
fail2ban-client set syslogsocket auto|<SOCKET> ; fail2ban-client get syslogsocket
fail2ban-client flushlogs                  # rouvrir le fichier de log (rotation)
```

## Base de données (bans persistants)

```bash
fail2ban-client set dbfile <FICHIER>       # None pour désactiver la persistance
fail2ban-client get dbfile
fail2ban-client set dbmaxmatches <N>       # nb de correspondances stockées par ticket
fail2ban-client get dbmaxmatches
fail2ban-client set dbpurgeage <SECONDES>  # âge max conservé de l'historique des bans
fail2ban-client get dbpurgeage
```

## Contrôle d'une prison

```bash
fail2ban-client add <PRISON> <BACKEND>     # créer une prison (backend : auto, systemd, pyinotify, polling…)
fail2ban-client start <PRISON>
fail2ban-client stop <PRISON>              # arrête et retire la prison
fail2ban-client status <PRISON> [FLAVOR]   # FLAVOR : basic (défaut), cymru, short, stats
```

## Régler une prison (`set <PRISON> …`)

```bash
fail2ban-client set <PRISON> idle on|off
fail2ban-client set <PRISON> ignoreself true|false
fail2ban-client set <PRISON> addignoreip <IP|CIDR> ; set <PRISON> delignoreip <IP|CIDR>
fail2ban-client set <PRISON> ignorecommand <CMD> ; set <PRISON> ignorecache <VALEUR>
fail2ban-client set <PRISON> addlogpath <FICHIER> ['tail'] ; set <PRISON> dellogpath <FICHIER>
fail2ban-client set <PRISON> logencoding <ENCODAGE>
fail2ban-client set <PRISON> addjournalmatch <MATCH> ; set <PRISON> deljournalmatch <MATCH>
fail2ban-client set <PRISON> addfailregex <REGEX> ; set <PRISON> delfailregex <INDEX>
fail2ban-client set <PRISON> addignoreregex <REGEX> ; set <PRISON> delignoreregex <INDEX>
fail2ban-client set <PRISON> findtime <DUREE> ; set <PRISON> bantime <DUREE>
fail2ban-client set <PRISON> maxretry <N> ; set <PRISON> maxmatches <N> ; set <PRISON> maxlines <N>
fail2ban-client set <PRISON> datepattern <MOTIF> ; set <PRISON> usedns <yes|no|warn|raw>
fail2ban-client set <PRISON> attempt <IP> [<echec1> …]    # notifier manuellement un échec
fail2ban-client set <PRISON> banip <IP> ... <IP>          # bannir manuellement
fail2ban-client set <PRISON> unbanip [--report-absent] <IP> ... <IP>
fail2ban-client set <PRISON> addaction <ACT> [<FICHIER.py> <JSONKWARGS>] ; set <PRISON> delaction <ACT>
```

## Interroger une prison (`get <PRISON> …`)

```bash
fail2ban-client get <PRISON> banned [<IP> …]      # IP bannies (ou 1/0 par IP testée)
fail2ban-client get <PRISON> banip [<SEP>|--with-time]
fail2ban-client get <PRISON> logpath ; get <PRISON> logencoding ; get <PRISON> journalmatch
fail2ban-client get <PRISON> ignoreip ; get <PRISON> ignoreself ; get <PRISON> ignorecommand
fail2ban-client get <PRISON> failregex ; get <PRISON> ignoreregex
fail2ban-client get <PRISON> findtime ; get <PRISON> bantime ; get <PRISON> datepattern ; get <PRISON> usedns
fail2ban-client get <PRISON> maxretry ; get <PRISON> maxmatches ; get <PRISON> maxlines
fail2ban-client get <PRISON> actions
```

## Configurer une action

```bash
# Action « commande » : scripts exécutés aux étapes du cycle de vie
fail2ban-client set <PRISON> action <ACT> actionstart <CMD>
fail2ban-client set <PRISON> action <ACT> actionstop  <CMD>
fail2ban-client set <PRISON> action <ACT> actioncheck <CMD>
fail2ban-client set <PRISON> action <ACT> actionban   <CMD>
fail2ban-client set <PRISON> action <ACT> actionunban <CMD>
fail2ban-client set <PRISON> action <ACT> timeout <SECONDES>
# Générique : propriété ou méthode
fail2ban-client set <PRISON> action <ACT> <PROPRIETE> <VALEUR>
fail2ban-client set <PRISON> action <ACT> <METHODE> [<JSONKWARGS>]
# Lecture
fail2ban-client get <PRISON> action <ACT> actionban      # etc. : actionstart/stop/check/unban/timeout
fail2ban-client get <PRISON> actionproperties <ACT> ; get <PRISON> actionmethods <ACT>
```

## `fail2ban-regex` — mettre au point un filtre

```bash
fail2ban-regex <LOG> <FILTRE|REGEX> [IGNOREREGEX]
fail2ban-regex /var/log/auth.log /etc/fail2ban/filter.d/sshd.conf
fail2ban-regex systemd-journal sshd                      # depuis le journal systemd
fail2ban-regex --print-all-matched /var/log/nginx/access.log nginx-botsearch
```

| Option | Rôle |
| --- | --- |
| `--print-all-matched` / `--print-all-missed` | Afficher toutes les lignes reconnues / non reconnues |
| `--print-no-missed` / `--print-no-ignored` | Masquer les non-reconnues / ignorées |
| `-d, --datepattern <MOTIF>` | Forcer le motif de date |
| `-L, --maxlines <N>` | Lignes bufferisées (regex multi-lignes) |
| `--usedns <yes\|no\|warn\|raw>` | Résolution DNS |
| `-o, --out <FORMAT>` | Format de sortie (ex. `IP`, `MATCHES`, un *tag* précis) |
| `-v` / `-vv` | Verbosité croissante |

## `fail2ban-server` et dépannage

```bash
fail2ban-server -t                      # tester la configuration (équivaut à fail2ban-client -t)
fail2ban-server -f -x                   # premier plan, forcer (supprime un socket résiduel)
fail2ban-client -d | less               # configuration effective complète (débogage)
fail2ban-client --str2sec 1d            # convertir une durée en secondes
```

> [!NOTE]
> `reload` relit `jail.local`/`jail.d` sans couper les prisons ; `reload --restart --unban <prison>` repart propre. Les modifications via `set …` ne survivent pas à un `reload` : pérenniser dans la configuration.

Prisons, filtres et actions prêtes à l'emploi : [[02-filtres-exploitation|filtres et exploitation]] · aide-mémoire condensé : [[90-aide-memoire|aide-mémoire]].
