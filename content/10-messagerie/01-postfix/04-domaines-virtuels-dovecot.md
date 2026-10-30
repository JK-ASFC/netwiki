---
title: Domaines virtuels, Dovecot et submission
description: Serveur de messagerie complet avec Postfix — domaines d'alias et de boîtes virtuelles, tables des boîtes et des alias (fichiers, SQL, LDAP/Active Directory), livraison LMTP vers Dovecot, authentification SASL déléguée à Dovecot, services submission (587) et submissions (465) dans master.cf, et contrôle de l'adresse d'expédition.
tags: [postfix, virtual, domaines virtuels, lmtp, dovecot, sasl, submission, ldap, active directory]
icon: inbox
---

## Types de domaines

| Classe | Paramètre | Usage |
| --- | --- | --- |
| Locaux | `mydestination` | Comptes Unix du serveur |
| **Alias virtuels** | `virtual_alias_domains` + `virtual_alias_maps` | Domaine sans boîtes : tout est redirigé ailleurs |
| **Boîtes virtuelles** | `virtual_mailbox_domains` + `virtual_mailbox_maps` | Boîtes indépendantes des comptes Unix (cas général) |
| Relais | `relay_domains` | Domaines pour lesquels on est passerelle (voir [[08-relais-routage-avance]]) |

Un domaine ne doit figurer **que dans une seule** classe.

## Boîtes virtuelles livrées à Dovecot

```postfix /etc/postfix/main.cf
mydestination = localhost
virtual_mailbox_domains = exemple.fr, exemple.com
virtual_mailbox_maps = lmdb:/etc/postfix/boites_virtuelles
virtual_alias_maps = lmdb:/etc/postfix/alias_virtuels
virtual_transport = lmtp:unix:private/dovecot-lmtp
```

```text /etc/postfix/boites_virtuelles
alice@exemple.fr     ok
bob@exemple.fr       ok
contact@exemple.com  ok
```

```text /etc/postfix/alias_virtuels
postmaster@exemple.fr    alice@exemple.fr
abuse@exemple.fr         alice@exemple.fr
equipe@exemple.fr        alice@exemple.fr, bob@exemple.fr
@exemple.com             contact@exemple.com
```

```bash
sudo postmap /etc/postfix/boites_virtuelles /etc/postfix/alias_virtuels
sudo postfix reload
```

> [!NOTE]
> La valeur de `virtual_mailbox_maps` sert seulement à **savoir si le destinataire existe** (rejet immédiat des adresses inconnues, sans rétrodiffusion) ; c'est Dovecot qui détermine l'emplacement réel de la boîte. Évitez les alias « attrape-tout » (`@domaine`) qui attirent le spam.

Côté Dovecot, le service LMTP doit exposer la socket dans la prison de Postfix — voir [[02-dovecot/04-lmtp-sieve-quotas|LMTP, Sieve et quotas]].

## Utilisateurs en base de données

```postfix /etc/postfix/mysql-boites.cf
hosts = 127.0.0.1
user = postfix_lecture
password = MotDePasse
dbname = messagerie
query = SELECT 1 FROM boites WHERE adresse = '%s' AND actif = 1
```

```postfix
virtual_mailbox_maps = mysql:/etc/postfix/mysql-boites.cf
virtual_mailbox_domains = mysql:/etc/postfix/mysql-domaines.cf
virtual_alias_maps = mysql:/etc/postfix/mysql-alias.cf
```

Des interfaces comme **PostfixAdmin** gèrent domaines, boîtes et alias dans ce schéma.

## Utilisateurs dans Active Directory (LDAP)

```postfix /etc/postfix/ldap-boites.cf
server_host = ldaps://dc1.corp.exemple.fr ldaps://dc2.corp.exemple.fr
version = 3
search_base = OU=Utilisateurs,DC=corp,DC=exemple,DC=fr
bind = yes
bind_dn = CN=svc_postfix,OU=Services,DC=corp,DC=exemple,DC=fr
bind_pw = MotDePasse
query_filter = (&(objectClass=user)(|(mail=%s)(proxyAddresses=smtp:%s))(!(userAccountControl:1.2.840.113556.1.4.803:=2)))
result_attribute = mail
```

```bash
sudo postmap -q alice@exemple.fr ldap:/etc/postfix/ldap-boites.cf
```

Le filtre exclut les comptes désactivés ; les alias SMTP proviennent de l'attribut `proxyAddresses` (comme Exchange).

## Authentification SASL via Dovecot

Postfix délègue la vérification des mots de passe à Dovecot (socket `private/auth`) :

```postfix /etc/postfix/main.cf
smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth
smtpd_sasl_auth_enable = no                  # activé uniquement sur submission/submissions
smtpd_tls_auth_only = yes
```

## Services submission et submissions

```mastercf /etc/postfix/master.cf (extrait)
# service type  private unpriv  chroot  wakeup  maxproc command
submission inet n       -       y       -       -       smtpd
  -o syslog_name=postfix/submission
  -o smtpd_tls_security_level=encrypt
  -o smtpd_sasl_auth_enable=yes
  -o smtpd_tls_auth_only=yes
  -o smtpd_client_restrictions=permit_sasl_authenticated,reject
  -o smtpd_sender_restrictions=reject_sender_login_mismatch
  -o smtpd_relay_restrictions=permit_sasl_authenticated,reject
  -o smtpd_recipient_restrictions=
  -o milter_macro_daemon_name=ORIGINATING
submissions inet n      -       y       -       -       smtpd
  -o syslog_name=postfix/submissions
  -o smtpd_tls_wrappermode=yes
  -o smtpd_sasl_auth_enable=yes
  -o smtpd_client_restrictions=permit_sasl_authenticated,reject
  -o smtpd_sender_restrictions=reject_sender_login_mismatch
  -o smtpd_relay_restrictions=permit_sasl_authenticated,reject
  -o smtpd_recipient_restrictions=
  -o milter_macro_daemon_name=ORIGINATING
```

`milter_macro_daemon_name=ORIGINATING` indique aux filtres (Rspamd, OpenDKIM) qu'il s'agit d'un envoi sortant à **signer** plutôt qu'à analyser comme du courrier entrant.

### Empêcher l'usurpation d'expéditeur

```postfix /etc/postfix/main.cf
smtpd_sender_login_maps = lmdb:/etc/postfix/expediteurs_autorises
```

```text /etc/postfix/expediteurs_autorises
alice@exemple.fr        alice@exemple.fr
contact@exemple.com     alice@exemple.fr, bob@exemple.fr
```

Avec `reject_sender_login_mismatch`, un utilisateur authentifié ne peut envoyer qu'avec les adresses qui lui sont associées.

## Tests

```bash
swaks --to bob@exemple.fr --server mx1.exemple.fr                       # réception (port 25)
swaks --to externe@gmail.com --from alice@exemple.fr --server mx1.exemple.fr:587 \
      --tls --auth LOGIN --auth-user alice@exemple.fr                   # envoi authentifié
swaks --to externe@gmail.com --server mx1.exemple.fr:465 --tls-on-connect --auth-user alice@exemple.fr
```
