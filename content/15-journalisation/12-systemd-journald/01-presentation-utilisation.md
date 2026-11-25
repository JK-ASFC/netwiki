---
title: Présentation et utilisation
description: systemd-journald — journal binaire structuré de systemd : architecture et champs, lecture et filtrage avec journalctl (par unité, priorité, intervalle, amorçage, identifiant, noyau, suivi en direct), formats de sortie (short, json, cat, verbose), stockage volatile ou persistant (/var/log/journal), configuration journald.conf (Storage, quotas SystemMaxUse, rétention, RateLimit), transfert vers syslog et rsyslog, rotation et vacuum, vérification d'intégrité (FSS), espaces de noms et journal distant (systemd-journal-remote/upload/gatewayd).
tags: [journald, systemd, journalctl, journal, logs, linux, rsyslog]
icon: info
---

**systemd-journald** est le service de journalisation intégré à **systemd** : il collecte les messages du noyau, des services (sortie standard des unités), de syslog et de l'API `sd_journal` dans un **journal binaire structuré** (chaque entrée porte des champs indexés : unité, priorité, PID, UID, horodatage…). On le lit et on le filtre avec **`journalctl`**. Il coexiste avec [[01-rsyslog/01-presentation-installation|rsyslog]], auquel il peut transmettre les messages pour une centralisation réseau.

## Sources et champs

Le journal agrège : messages **noyau** (`dmesg`), **stdout/stderr** des unités systemd, appels `syslog(3)`, et l'API native. Chaque entrée est un ensemble de champs `CLÉ=valeur` :

| Champ | Rôle |
| --- | --- |
| `_SYSTEMD_UNIT` | Unité émettrice (`nginx.service`) |
| `PRIORITY` | Gravité 0 (emerg) → 7 (debug) |
| `SYSLOG_IDENTIFIER` | Nom du programme (`sshd`, `kernel`) |
| `_PID`, `_UID`, `_GID` | Processus et utilisateur |
| `_BOOT_ID`, `_MACHINE_ID` | Amorçage et machine |
| `MESSAGE` | Le texte du message |

`journalctl -N` liste tous les champs disponibles ; `journalctl -F <champ>` liste les valeurs prises par un champ.

## Lire et filtrer

```bash
journalctl                      # tout le journal (du plus ancien au plus récent)
journalctl -e                   # sauter à la fin ; -r : ordre inverse (récent d'abord)
journalctl -f                   # suivre en direct (comme tail -f)
journalctl -n 100               # les 100 dernières lignes
journalctl -u nginx.service     # une unité ; -u 'ssh*' avec joker
journalctl -u nginx -u php-fpm  # plusieurs unités
journalctl _PID=1               # par champ (filtre exact, combinable)
journalctl /usr/sbin/sshd       # par exécutable
journalctl -k                   # messages du noyau uniquement (dmesg)
journalctl -p err               # priorité err et au-dessus (emerg..err) ; -p warning..notice pour une plage
journalctl -g "Failed|refused"  # grep (expression rationnelle, --case-sensitive=false par défaut)
```

### Par intervalle et par amorçage

```bash
journalctl --since "2026-11-25 08:00" --until "2026-11-25 09:30"
journalctl --since "-1h"        # dernière heure ; "yesterday", "today" acceptés
journalctl -b                   # amorçage courant ; -b -1 : précédent ; --list-boots
journalctl -u nginx --since today -p warning
```

### Formats de sortie

```bash
journalctl -u nginx -o short-iso     # horodatage ISO 8601
journalctl -u nginx -o cat           # message seul (sans métadonnées)
journalctl -u nginx -o verbose       # tous les champs d'une entrée
journalctl -u nginx -o json-pretty   # JSON (exploitation, export vers un SIEM)
journalctl -u nginx --output-fields=MESSAGE,_PID -o json
```

## Stockage : volatile ou persistant

Par défaut, le journal peut être en mémoire (`/run/log/journal`, perdu au redémarrage). Pour le **conserver entre les redémarrages** :

```bash
sudo mkdir -p /var/log/journal
sudo systemd-tmpfiles --create --prefix /var/log/journal
sudo systemctl restart systemd-journald      # ou Storage=persistent dans journald.conf
```

```ini /etc/systemd/journald.conf
[Journal]
Storage=persistent            # auto (défaut), persistent, volatile, none
Compress=yes
SystemMaxUse=2G               # taille max du journal sur disque
SystemKeepFree=1G
SystemMaxFileSize=128M        # taille d'un fichier avant rotation
MaxRetentionSec=1month        # purge au-delà de cette durée
MaxFileSec=1week              # rotation périodique
ForwardToSyslog=yes           # transmettre à rsyslog/syslog
RateLimitIntervalSec=30s
RateLimitBurst=10000          # messages max par intervalle et par service
```

> [!NOTE]
> Sans stockage persistant, un incident disparaît au redémarrage. Sur un serveur, activer `Storage=persistent` et fixer `SystemMaxUse` / `MaxRetentionSec` pour borner l'espace et la durée.

## Rotation, quotas et vérification

```bash
journalctl --disk-usage                      # espace occupé
sudo journalctl --vacuum-size=500M           # réduire à 500 Mo
sudo journalctl --vacuum-time=2weeks         # supprimer au-delà de 2 semaines
sudo journalctl --vacuum-files=5             # ne garder que 5 fichiers d'archive
sudo journalctl --rotate                     # forcer une rotation immédiate
journalctl --verify                          # vérifier l'intégrité des fichiers
```

**FSS** (*Forward Secure Sealing*) scelle cryptographiquement le journal pour détecter toute altération *a posteriori* :

```bash
sudo journalctl --setup-keys                 # génère une clé de scellement et de vérification
journalctl --verify                          # signale « PASS » ou une corruption
```

## Transfert vers syslog et centralisation

`ForwardToSyslog=yes` envoie une copie à [[01-rsyslog/01-presentation-installation|rsyslog]] (qui relaie ensuite vers un collecteur TLS). Pour exporter directement le journal **structuré** vers un autre hôte, la famille `systemd-journal-remote` :

| Composant | Rôle |
| --- | --- |
| `systemd-journal-upload` | Pousse le journal local vers un récepteur distant (HTTP/HTTPS) |
| `systemd-journal-remote` | Reçoit et stocke des journaux distants |
| `systemd-journal-gatewayd` | Expose le journal en HTTP/JSON (lecture à distance, port 19531) |

Les agents modernes ([[03-fluent-bit/02-kubernetes-exploitation|Fluent Bit]], [[10-fluentd-vector/02-vector|Vector]], Promtail) lisent nativement le journal (`systemd`/`journald` input) et l'envoient vers Loki, Elasticsearch ou un SIEM.

## Espaces de noms et par service

```bash
journalctl --user -u mon-app.service         # journal de session utilisateur
journalctl --namespace rp                    # espace de noms dédié (LogNamespace= dans l'unité)
journalctl -u nginx --follow -o cat          # suivi d'un service en direct, message seul
```

Commandes : [[90-aide-memoire|aide-mémoire]].
