---
title: "Configuration : ACL, routeurs, transports, TLS, DKIM"
description: Configurer Exim — options principales et listes nommées, ACL de contrôle des destinataires et des données (relais, vérifications, DNSBL, Rspamd), routeurs (dnslookup, manualroute vers un smarthost, livraison Dovecot LMTP), transports, authentification SMTP via Dovecot et vers un smarthost, TLS, ports de soumission et signature DKIM.
tags: [exim, acl, routeurs, transports, smarthost, dovecot, tls, dkim, rspamd]
icon: settings-2
---

Les exemples suivent la syntaxe d'Exim ; sous Debian, placez-les dans des fichiers de `conf.d/` (ou utilisez les **macros** prévues), puis `update-exim4.conf`.

## Options principales

```exim
primary_hostname = mx1.exemple.fr
domainlist local_domains = @ : exemple.fr : exemple.com
domainlist relay_to_domains =
hostlist   relay_from_hosts = 127.0.0.1 : ::1 : 10.0.20.0/24

acl_smtp_rcpt = acl_check_rcpt
acl_smtp_data = acl_check_data

daemon_smtp_ports = 25 : 465 : 587
tls_on_connect_ports = 465
message_size_limit = 50M
```

## ACL des destinataires

```exim
acl_check_rcpt:
  # Messages locaux (non SMTP)
  accept  hosts = :

  # Caractères suspects dans les adresses locales
  deny    domains = +local_domains
          local_parts = ^[.] : ^.*[@%!/|]

  accept  local_parts = postmaster
          domains = +local_domains

  # Envoi depuis le réseau interne ou après authentification
  accept  hosts = +relay_from_hosts
          control = submission
  accept  authenticated = *
          control = submission/domain=

  # Ports de soumission : authentification obligatoire
  deny    condition = ${if or {{eq{$received_port}{587}}{eq{$received_port}{465}}}}
          message = Authentification requise

  # Interdire le relais pour des tiers
  require message = Relais non autorisé
          domains = +local_domains : +relay_to_domains

  # Le destinataire doit exister
  require verify = recipient

  # Listes de blocage
  deny    dnslists = zen.spamhaus.org
          message = Rejeté : $sender_host_address listée par $dnslist_domain

  require verify = sender
  accept
```

| Verbe | Effet |
| --- | --- |
| `accept` | Accepter si toutes les conditions sont vraies |
| `deny` | Refuser si toutes les conditions sont vraies |
| `require` | Refuser si une condition est fausse |
| `warn` | Ne décide rien : journaliser, ajouter un en-tête |
| `defer` | Erreur temporaire (greylisting) |
| `drop` | Refuser et fermer la connexion |

## ACL des données : filtrage Rspamd

Avec `exim4-daemon-heavy` :

```exim
# Section main
spamd_address = 127.0.0.1 11333 variant=rspamd

acl_check_data:
  warn    spam = nobody:true
          add_header = X-Spam-Score: $spam_score ($spam_bar)
          add_header = X-Spam-Action: $spam_action
  deny    condition = ${if eq{$spam_action}{reject}}
          message = Message refusé (spam)
  defer   condition = ${if eq{$spam_action}{soft reject}}
          message = Réessayez plus tard
  warn    condition = ${if eq{$spam_action}{add header}}
          add_header = X-Spam: Yes
  accept
```

L'antivirus s'ajoute avec `av_scanner = clamd:/var/run/clamav/clamd.ctl` et une condition `malware = *`.

## Routeurs

```exim
begin routers

# Courrier vers Internet via un smarthost
smarthost:
  driver = manualroute
  domains = ! +local_domains
  transport = remote_smtp_smarthost
  route_list = * smtp.fournisseur.fr::587 byname
  host_find_failed = defer
  no_more

# Ou envoi direct selon les MX
dnslookup:
  driver = dnslookup
  domains = ! +local_domains
  transport = remote_smtp
  ignore_target_hosts = 0.0.0.0 : 127.0.0.0/8
  no_more

# Alias locaux
system_aliases:
  driver = redirect
  data = ${lookup{$local_part}lsearch{/etc/aliases}}

# Boîtes gérées par Dovecot
dovecot_boites:
  driver = accept
  domains = +local_domains
  condition = ${lookup{$local_part@$domain}lsearch{/etc/exim4/boites}{yes}{no}}
  transport = dovecot_lmtp
```

L'**ordre** des routeurs est déterminant : chaque adresse est proposée aux routeurs successivement jusqu'à ce que l'un l'accepte.

## Transports

```exim
begin transports

remote_smtp:
  driver = smtp
  dkim_domain = ${lc:${domain:$h_from:}}
  dkim_selector = s2025
  dkim_private_key = ${if exists{/etc/exim4/dkim/$dkim_domain.key}{/etc/exim4/dkim/$dkim_domain.key}{0}}
  dkim_canon = relaxed

remote_smtp_smarthost:
  driver = smtp
  hosts_require_auth = *
  hosts_require_tls = *

dovecot_lmtp:
  driver = lmtp
  socket = /var/run/dovecot/lmtp
  batch_max = 200
```

Sous Debian, la signature DKIM s'active par macros dans `00_local_macros` : `DKIM_DOMAIN`, `DKIM_SELECTOR`, `DKIM_PRIVATE_KEY`, `DKIM_CANON`. Enregistrements DNS : voir [[01-postfix/06-spf-dkim-dmarc|SPF, DKIM et DMARC]].

## Authentification

```exim
begin authenticators

# Serveur : mots de passe vérifiés par Dovecot
dovecot_plain:
  driver = dovecot
  public_name = PLAIN
  server_socket = /var/run/dovecot/auth-client
  server_set_id = $auth1
  server_advertise_condition = ${if def:tls_in_cipher}

dovecot_login:
  driver = dovecot
  public_name = LOGIN
  server_socket = /var/run/dovecot/auth-client
  server_set_id = $auth1
  server_advertise_condition = ${if def:tls_in_cipher}

# Client : identifiants pour le smarthost (Debian lit /etc/exim4/passwd.client)
smarthost_login:
  driver = plaintext
  public_name = LOGIN
  client_send = : compte@exemple.fr : MotDePasse
```

`server_advertise_condition` n'annonce l'authentification qu'une fois TLS établi. Le socket `auth-client` de Dovecot doit être accessible au groupe `Debian-exim`.

## TLS

```exim /etc/exim4/conf.d/main/00_local_macros (Debian)
MAIN_TLS_ENABLE = yes
MAIN_TLS_CERTIFICATE = /etc/letsencrypt/live/mx1.exemple.fr/fullchain.pem
MAIN_TLS_PRIVATEKEY = /etc/letsencrypt/live/mx1.exemple.fr/privkey.pem
```

Options natives équivalentes : `tls_certificate`, `tls_privatekey`, `tls_advertise_hosts = *`, `tls_require_ciphers`. L'utilisateur `Debian-exim` doit pouvoir lire la clé (groupe dédié ou copie par un crochet de renouvellement).
