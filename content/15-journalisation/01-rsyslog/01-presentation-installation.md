---
title: Présentation, protocole syslog et installation
description: Le protocole syslog (RFC 3164 et 5424, facilités, gravités, transports UDP, TCP, TLS, RELP), rsyslog face à syslog-ng et journald, installation, structure de la configuration (RainerScript, modules, règles, modèles), sélecteurs classiques et premiers tests avec logger.
tags: [rsyslog, syslog, rfc 5424, journald, facilités, gravités, installation]
icon: info
---

**rsyslog** est le démon syslog par défaut de Debian, Ubuntu et RHEL. Au-delà de l'écriture des journaux locaux, c'est un **routeur de journaux** très performant : réception depuis les serveurs et **équipements réseau**, filtrage, mise en forme, files d'attente sur disque, envoi chiffré vers un serveur central, Elasticsearch/OpenSearch, Kafka, bases de données…

## Le protocole syslog

| Format | Exemple |
| --- | --- |
| RFC 3164 (BSD, historique) | `<189>Oct 29 09:30:12 r1-paris %LINK-3-UPDOWN: Interface Gi0/0/0, changed state to down` |
| **RFC 5424** | `<189>1 2025-10-29T09:30:12.123+01:00 r1-paris ios - - - Interface Gi0/0/0, changed state to down` |

La **priorité** `<PRI>` = facilité × 8 + gravité.

| Gravité | Code | Usage |
| --- | --- | --- |
| emerg | 0 | Système inutilisable |
| alert | 1 | Action immédiate |
| crit | 2 | Critique |
| err | 3 | Erreur |
| warning | 4 | Avertissement |
| notice | 5 | Normal mais significatif |
| info | 6 | Information |
| debug | 7 | Débogage |

| Facilité | Usage |
| --- | --- |
| `kern`, `user`, `mail`, `daemon`, `auth`, `authpriv`, `cron`, `syslog` | Sous-systèmes Unix |
| `local0` … `local7` | Libres : souvent utilisées par les **équipements réseau** (Cisco : `local7` par défaut) |

| Transport | Port | Remarque |
| --- | --- | --- |
| UDP | 514 | Simple, sans garantie de livraison |
| TCP | 514 (ou 601) | Fiable |
| **TCP + TLS** | **6514** | Chiffré, authentifié (RFC 5425) |
| RELP | 2514 (usage) | Accusés applicatifs : aucune perte même si la connexion tombe |

## rsyslog, syslog-ng, journald

| Outil | Rôle |
| --- | --- |
| **systemd-journald** | Journal local binaire de systemd ; rsyslog lit le journal (module `imjournal`) ou reçoit sa copie (`imuxsock`) |
| **rsyslog** | Démon par défaut, très rapide, configuration RainerScript |
| syslog-ng | Alternative (OSE libre / Premium), syntaxe de configuration différente, parseurs riches |

## Installation

```bash
sudo apt install rsyslog rsyslog-gnutls rsyslog-relp     # Debian / Ubuntu (rsyslog souvent déjà présent)
sudo dnf install rsyslog rsyslog-gnutls rsyslog-relp      # RHEL
sudo systemctl enable --now rsyslog
rsyslogd -v
```

macOS utilise son propre système de journaux unifié (`log show`, `log stream`) ; rsyslog peut s'installer par Homebrew mais c'est rare. Sous **Windows**, il n'y a pas de syslog natif : on transfère les journaux d'événements avec un agent (NXLog, Fluent Bit, Winlogbeat, rsyslog Windows Agent).

## Structure de la configuration

| Fichier | Rôle |
| --- | --- |
| `/etc/rsyslog.conf` | Modules, paramètres globaux, règles par défaut |
| `/etc/rsyslog.d/*.conf` | Fichiers additionnels (lus par ordre alphabétique) : y placer vos règles |

```rsyslog /etc/rsyslog.d/10-exemples.conf
# Syntaxe classique (sélecteur facilité.gravité → action)
authpriv.*                          /var/log/secure
mail.err                            /var/log/mail.err
local7.*                            /var/log/reseau.log

# Syntaxe RainerScript (recommandée pour les règles complexes)
if $programname == "sshd" and $msg contains "Failed password" then {
    action(type="omfile" file="/var/log/ssh-echecs.log")
}

# Expression avec propriété et arrêt du traitement
if $fromhost-ip startswith "10.0.0." then {
    action(type="omfile" file="/var/log/reseau-coeur.log")
    stop
}
```

| Élément | Exemples |
| --- | --- |
| Propriétés | `$msg`, `$hostname`, `$fromhost-ip`, `$programname`, `$syslogseverity-text`, `$syslogfacility-text`, `$timereported` |
| Modules d'entrée | `imjournal`, `imuxsock`, `imudp`, `imtcp`, `imrelp`, `imfile` (lecture de fichiers) |
| Modules de sortie | `omfile`, `omfwd`, `omrelp`, `omelasticsearch`, `omkafka`, `ompgsql`, `omprog` |
| `stop` | Arrête le traitement du message (évite les doublons dans `/var/log/syslog`) |

## Vérifier et tester

```bash
sudo rsyslogd -N1                                        # validation de la configuration
sudo systemctl restart rsyslog
logger -p local7.warning -t test "Message de test"       # envoyer un message local
logger -n syslog.corp.exemple.fr -P 514 -d -t test "Test UDP vers le serveur central"
logger -n syslog.corp.exemple.fr -P 514 -T -t test "Test TCP"
sudo tail -f /var/log/syslog                             # /var/log/messages sous RHEL
```

## Suite du parcours

1. [[02-centralisation-tls|Centralisation, TLS, files d'attente et équipements réseau]]
2. [[03-exploitation-depannage|Exploitation, rotation, envoi vers d'autres outils et dépannage]]
