---
title: Référence complète des commandes
description: Référence exhaustive de Suricata — options en ligne de commande de suricata (capture AF_PACKET/AF_XDP/PF_RING/NETMAP/NFQUEUE/IPFW/pcap, règles, journal, démon, runmode, --set, introspection --list-keywords/--dump-config/--build-info/--engine-analysis), commandes du socket de contrôle suricatasc (reload-rules, ruleset-*, tenants, hostbit, memcap, pcap-file) et suricata-update (update, sources, filtres enable/disable/modify/drop).
tags: [suricata, suricatasc, suricata-update, référence, ids, ips, commandes]
icon: terminal
---

Référence exhaustive de **Suricata 7.x** (`suricata`, `suricatasc`, `suricata-update`). Explications, règles et intégration : [[01-presentation-installation|Suricata]] · [[02-regles-ips|règles et IPS]] · [[03-exploitation-integration|exploitation]].

## `suricata` — options en ligne de commande

```bash
suricata [OPTIONS] [FILTRE BPF]
suricata -c /etc/suricata/suricata.yaml -i eth0 --af-packet      # capture live AF_PACKET
suricata -c /etc/suricata/suricata.yaml -r capture.pcap -l ./sortie   # relecture d'un pcap
suricata -T -c /etc/suricata/suricata.yaml -v                    # tester la configuration
```

### Général et configuration

| Option | Rôle |
| --- | --- |
| `-c <fichier>` · `--include <fichier>` | Configuration · fichier(s) de config additionnels |
| `-T` | **Tester** la configuration et quitter |
| `-v` / `-vv` / `-vvv` / `-vvvv` | Verbosité (INFO → DEBUG) |
| `--set clé=valeur` | Surcharger un paramètre (`--set outputs.1.eve-log.enabled=no`) |
| `-V` · `-h` | Version · aide |

### Capture (modes d'entrée)

| Option | Mode |
| --- | --- |
| `-r <fichier/rép>` | Relecture **pcap** hors ligne (répertoire = tous les fichiers) |
| `--pcap-file-continuous` · `--pcap-file-recursive` · `--pcap-file-delete` | Variantes de `-r` |
| `-i <interface>` | Capture **live** (répétable) |
| `--pcap[=<dev>]` · `--af-packet[=<dev>]` · `--af-xdp[=<dev>]` | PCAP / **AF_PACKET** / AF_XDP (Linux) |
| `--netmap[=<dev>]` · `--pfring[=<dev>]` (+`--pfring-cluster-id`/`--pfring-cluster-type`) | NETMAP / PF_RING |
| `-q <id>` | **NFQUEUE** inline (IPS) sur la file donnée (répétable) |
| `-d <port>` | IPFW divert inline (IPS) |
| `--dag <dev>` · `--napatech` · `--erf-in=<f>` | Cartes DAG / Napatech / fichier ERF |
| `--simulate-ips` | Simuler le mode IPS hors d'un mode inline |
| `--reject-dev=<dev>` | Interface d'envoi des RST/ICMP du mot-clé `reject` |
| `-F <fichier>` · `--pcap-buffer-size=<n>` · `-k [all\|none]` | Filtre BPF depuis un fichier · tampon · vérif. de somme de contrôle |

### Règles

| Option | Rôle |
| --- | --- |
| `-s <fichier.rules>` | Règles **en plus** du YAML (globbing permis) |
| `-S <fichier.rules>` | Règles **exclusivement** (ignore le YAML) |
| `--init-errors-fatal` | Échec si une signature ne charge pas |
| `--strict-rule-keywords[=all\|<kw>]` | Traiter les mots-clés manquants comme des erreurs |
| `--disable-detection` · `--disable-hashing` | Désactiver le moteur de détection · le hachage md5/sha |
| `--engine-analysis` | Rapport d'analyse du moteur (puis quitter) |

### Journal, démon, processus

| Option | Rôle |
| --- | --- |
| `-l <répertoire>` | Répertoire de journal (surcharge `default-log-dir`) |
| `-D` | Mode **démon** |
| `--runmode <workers\|autofp\|single>` | Mode d'exécution |
| `--user=<u>` · `--group=<g>` · `--pidfile <f>` | Identité du processus · PID |
| `--unix-socket=<f>` | Chemin du socket de contrôle |

### Introspection (quittent après exécution)

```bash
suricata --build-info           # options de compilation (AF_PACKET, Rust, NFQ, PF_RING…)
suricata --dump-config          # configuration effective
suricata --dump-features        # fonctionnalités des modules
suricata --list-app-layer-protos ; suricata --list-runmodes
suricata --list-keywords[=all|csv|<kw>]      # mots-clés de règles disponibles
```

> [!NOTE]
> Rechargement à chaud des règles : signal **`SIGUSR2`** (ou `suricatasc -c reload-rules`). **`SIGHUP`** rouvre les fichiers de journaux (rotation). Les options `--dpdk` et `--list-enabled-sources` existent dans d'autres builds/versions ; vérifier `suricata --build-info` pour les modes compilés.

## `suricatasc` — socket de contrôle

```bash
suricatasc                                   # shell interactif ; suricatasc -c "<commande>" pour un appel direct
```

| Commande | Rôle |
| --- | --- |
| `shutdown` · `uptime` · `version` · `running-mode` · `capture-mode` | Contrôle et état |
| `command-list` · `help` | Commandes disponibles · aide |
| `conf-get <variable>` · `dump-counters` | Lire un paramètre · vider les compteurs de performance |
| `reload-rules` / `ruleset-reload-rules` | Recharger les règles (bloquant) |
| `ruleset-reload-nonblocking` · `ruleset-reload-time` | Rechargement non bloquant · heure du dernier |
| `ruleset-stats` · `ruleset-failed-rules` | Nombre de règles chargées/en échec · liste des échecs |
| `register-tenant <id> <f>` · `reload-tenant <id> [f]` · `reload-tenants` · `unregister-tenant <id>` | Multi-tenant |
| `register-tenant-handler <id> <htype> [args]` · `unregister-tenant-handler …` | Association de trafic à un tenant |
| `add-hostbit <ip> <bit> <expire>` · `remove-hostbit` · `list-hostbit <ip>` | *Hostbits* dynamiques |
| `memcap-set <config> <valeur>` · `memcap-show <config>` · `memcap-list` | Limites mémoire à chaud |
| `reopen-log-files` | Rouvrir les journaux (rotation) |

### Mode pcap (runmode unix-socket)

```bash
suricata --unix-socket -c /etc/suricata/suricata.yaml        # démarrer en mode socket
suricatasc -c "pcap-file /chemin/abs/capture.pcap /chemin/abs/sortie"
```

`pcap-file <f> <dir> [tenant] [continuous] [delete-when-done]`, `pcap-file-continuous`, `pcap-file-number`, `pcap-file-list`, `pcap-last-processed`, `pcap-current`, `pcap-interrupt`.

## `suricata-update` — gestion des règles

```bash
suricata-update                              # sous-commande « update » par défaut
suricata-update update-sources               # mettre à jour l'index des sources
suricata-update list-sources                 # sources disponibles
suricata-update enable-source et/open         # activer une source de l'index
suricata-update enable-source oisf/trafficid
suricata-update disable-source <nom> ; suricata-update remove-source <nom>
suricata-update add-source maison https://rules.corp.exemple.fr/local.rules
suricata-update check-versions
```

| Option (de `update`) | Rôle |
| --- | --- |
| `-D, --data-dir <rép>` | Données (défaut `/var/lib/suricata`) |
| `-c, --config <f>` · `--suricata-conf <f>` · `--suricata <chemin>` | Config de l'outil · de Suricata · binaire |
| `--suricata-version <v>` | Forcer la version de Suricata |
| `-o, --output <rép>` | Répertoire d'écriture des règles |
| `-f, --force` · `--offline` · `--fail` | Forcer · hors ligne (cache) · échec sur erreur |
| `--no-test` · `--no-reload` | Ne pas tester les règles · ne pas recharger Suricata |
| `--disable-conf <f>` · `--enable-conf <f>` · `--modify-conf <f>` · `--drop-conf <f>` | Filtres : désactiver / activer / modifier / passer en *drop* des règles |
| `-s, --show-advanced` · `-v` · `-q` | Options avancées · verbeux · silencieux |

Fichiers de filtres : `disable.conf`, `enable.conf`, `modify.conf`, `drop.conf` (dans `/etc/suricata/`). `--modify-conf` applique des substitutions `sid "regex" "remplacement"` ; `--drop-conf` fait passer des SID en action *drop* (IPS).

Règles, signatures et mode IPS : [[02-regles-ips|règles et IPS]] · EVE JSON, intégration SIEM et exploitation : [[03-exploitation-integration|exploitation]] · aide-mémoire condensé : [[90-aide-memoire|aide-mémoire]].
