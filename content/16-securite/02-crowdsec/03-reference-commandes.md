---
title: Référence complète des commandes
description: Référence exhaustive de cscli (CrowdSec) — drapeaux globaux, décisions et alertes, hub et objets (collections, parseurs, scénarios, postoverflows, contexts, appsec-configs, appsec-rules), bouncers et machines, métriques, LAPI/CAPI/PAPI, console, notifications, config, hubtest, explain, simulation, setup, allowlists, support et dashboard, avec la syntaxe et les drapeaux de chaque sous-commande.
tags: [crowdsec, cscli, référence, commandes, hub, décisions, bouncers, appsec]
icon: terminal
---

Référence exhaustive de **`cscli`** (CrowdSec 1.6–1.8). Certains groupes ont évolué selon la version (gestion du hub, **AppSec**, **allowlists**, abandon du *dashboard* Metabase) : `cscli <groupe> --help` donne l'arbre exact de votre version. Explications : [[01-presentation-installation|CrowdSec]] ; remédiation : [[02-remediation-exploitation|bouncers]].

## Drapeaux globaux

| Drapeau | Rôle |
| --- | --- |
| `-o, --output <human\|json\|raw>` | Format de sortie (scripting : `json`/`raw`) |
| `-c, --config <FICHIER>` | Fichier de configuration (`/etc/crowdsec/config.yaml`) |
| `--debug` / `--info` / `--warning` / `--error` / `--trace` | Niveau de journalisation |
| `--help` · `completion <shell>` · `version` | Aide · complétion shell · version |

## Décisions

```bash
cscli decisions list [--ip <IP>|--range <CIDR>|--scope <SCOPE>|--value <V>|--type <ban|captcha>|--origin <O>] [-a] [-o json]
cscli decisions add --ip 203.0.113.50 --duration 24h --reason "scan" [--type ban]
cscli decisions add --range 198.51.100.0/24 --duration 4h
cscli decisions add --scope Username --value alice --duration 1h
cscli decisions delete --ip 203.0.113.50        # ou --range / --id <ID> / --all / --scenario
cscli decisions import -i blocklist.txt [--format values|json|csv] [--duration 24h] [--reason ...]
```

| Drapeau (`add`/`list`) | Rôle |
| --- | --- |
| `--ip` / `--range` | Adresse / sous-réseau |
| `--scope` / `--value` | Portée (`Ip`, `Range`, `Country`, `AS`, `Username`…) et valeur |
| `--type` | `ban` (défaut), `captcha`, ou type personnalisé |
| `--duration` | Durée (`4h`, `24h`, `168h`) |
| `--reason` | Motif affiché |
| `--origin` | Filtrer par origine (`crowdsec`, `cscli`, `lists`, `CAPI`…) |

## Alertes

```bash
cscli alerts list [--since 24h] [--until 1h] [--scope Ip] [--value <IP>] [--scenario <S>] [--range <CIDR>] [-o json]
cscli alerts inspect <ID> [-d|--details]
cscli alerts delete [--scope ... --value ... | --scenario ... | --range ... | --all]
cscli alerts flush                         # purge selon la rétention
```

## Hub et objets

```bash
cscli hub list [-a] ; cscli hub update ; cscli hub upgrade [--force] ; cscli hub types
```

Chaque type d'objet partage `list`, `install`, `remove`, `upgrade`, `inspect` :

```bash
cscli collections list ; cscli collections install crowdsecurity/nginx [--force] [--ignore]
cscli collections inspect crowdsecurity/sshd [--diff] [--rev] ; cscli collections remove crowdsecurity/nginx [--purge] [--all]
cscli parsers install crowdsecurity/syslog-logs
cscli scenarios inspect crowdsecurity/ssh-bf [-o json]
cscli postoverflows list ; cscli contexts list
# WAF (AppSec, versions récentes)
cscli appsec-configs list ; cscli appsec-rules install crowdsecurity/vpatch-* [--force]
```

| Sous-commande | Rôle | Drapeaux |
| --- | --- | --- |
| `list` | Objets installés (ou `-a` tous) | `-a/--all`, `-o json` |
| `install <auteur/nom>` | Installer depuis le hub | `--force`, `--ignore`, `--download-only` |
| `remove <nom>` | Désinstaller | `--purge`, `--all`, `--force` |
| `upgrade [<nom>]` | Mettre à jour | `--all`, `--force` |
| `inspect <nom>` | Détails et métriques | `--diff`, `--rev`, `--no-metrics`, `-o json` |

## Bouncers et machines

```bash
cscli bouncers list ; cscli bouncers add <nom> [--key <CLE>]      # affiche la clé d'API
cscli bouncers delete <nom> ; cscli bouncers prune [--duration 60m] ; cscli bouncers inspect <nom>
cscli machines list ; cscli machines add <nom> [--auto|--password <MDP>|--file <f>] [--force]
cscli machines delete <nom> ; cscli machines prune ; cscli machines validate <nom> ; cscli machines inspect <nom>
```

## API locale, centrale et de polling

```bash
cscli lapi status                          # l'agent joint-il la LAPI ?
cscli lapi register [--machine <nom>] [--url <URL>]
cscli lapi context detect <type> ; cscli lapi context status    # contexte d'alerte envoyé
cscli capi status ; cscli capi register    # API centrale CrowdSec (signaux communautaires)
cscli papi status                          # Polling API (décisions poussées depuis la console)
```

## Console (SaaS CrowdSec)

```bash
cscli console enroll <JETON> [--name <nom>] [--tags <t1,t2>] [--overwrite]
cscli console enable <option>|--all ; cscli console disable <option>|--all ; cscli console status
```

Options d'échange avec la console : `console_management`, `context`, `manual`, `tainted`, `custom` (partage des décisions manuelles, du contexte, etc.).

## Métriques, notifications, simulation

```bash
cscli metrics                              # tableau : lignes lues/analysées, buckets, décisions, bouncers
cscli metrics show acquisition parsers scenarios lapi [-o json]
cscli notifications list ; cscli notifications inspect <nom> ; cscli notifications test <nom> ; cscli notifications reinject <ID>
cscli simulation enable [<scénario>|--global] ; cscli simulation disable ... ; cscli simulation status
```

## Configuration, diagnostic, mise au point

```bash
cscli config show [-o json] ; cscli config show-yaml ; cscli config backup <dir> ; cscli config restore <dir>
cscli config feature-flags
cscli explain --file /var/log/nginx/access.log --type nginx [-v] [--crowdsec /usr/bin/crowdsec]
cscli explain --log "Failed password for root from 203.0.113.50 ..." --type syslog
cscli explain -i --type syslog             # depuis l'entrée standard ; --dsn pour une source
cscli support dump -f support.zip          # archive de diagnostic pour le support
cscli version
```

## Hubtest (tests de parseurs/scénarios)

```bash
cscli hubtest create <nom> --parsers crowdsecurity/syslog-logs --scenarios crowdsecurity/ssh-bf
cscli hubtest run <nom>|--all [--clean] ; cscli hubtest info <nom> ; cscli hubtest list
cscli hubtest coverage ; cscli hubtest eval <nom> --expr '...' ; cscli hubtest clean <nom>
```

## Setup et allowlists (versions récentes)

```bash
# Détection automatique des services et des sources de journaux
cscli setup detect [--detect-config <f>] ; cscli setup install-hub detected.yaml ; cscli setup datasources detected.yaml
cscli setup unattended ; cscli setup validate detected.yaml
# Listes d'autorisation centralisées (remplacent le parseur whitelist pour beaucoup de cas)
cscli allowlists create <nom> -d "admins" ; cscli allowlists add <nom> 10.0.99.0/24 [-d "raison"] [-e 720h]
cscli allowlists list ; cscli allowlists inspect <nom> ; cscli allowlists check <IP>
cscli allowlists remove <nom> <IP> ; cscli allowlists delete <nom>
```

> [!NOTE]
> Le *dashboard* Metabase (`cscli dashboard setup/start/stop/remove`) est **déprécié** dans les versions récentes au profit de la console SaaS et des exports Prometheus (`cscli metrics`). La liste blanche par parseur (`parsers/s02-enrich`) reste valable mais les **allowlists** centralisées sont préférées à partir de 1.6.5.

Remédiation, bouncers prêts à l'emploi et exploitation : [[02-remediation-exploitation|remédiation]] · aide-mémoire condensé : [[90-aide-memoire|aide-mémoire]].
