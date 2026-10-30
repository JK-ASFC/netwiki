---
title: "Authentification : fichiers, SQL, LDAP / Active Directory"
description: Sources d'authentification de Dovecot (passdb et userdb) — base SQL (requêtes password_query, user_query, iterate_query), annuaire LDAP ou Active Directory (liaison authentifiée, filtres, comptes désactivés, attributs), cache d'authentification, utilisateurs maîtres pour l'administration et les migrations, Kerberos/GSSAPI, et socket SASL pour Postfix.
tags: [dovecot, passdb, userdb, ldap, active directory, sql, sasl, master user, kerberos]
icon: key-round
---

## passdb et userdb

| Base | Question à laquelle elle répond |
| --- | --- |
| **passdb** | Le mot de passe est-il correct ? (et éventuellement : nom canonique, refus, redirection proxy) |
| **userdb** | Où se trouve la boîte, sous quel UID/GID, avec quel quota ? |

Les deux peuvent provenir de sources différentes : par exemple mots de passe vérifiés dans **Active Directory**, emplacement calculé par une **userdb statique**.

## LDAP / Active Directory (liaison authentifiée)

```dovecot /etc/dovecot/conf.d/10-auth.conf
!include auth-ldap.conf.ext
```

```dovecot /etc/dovecot/conf.d/auth-ldap.conf.ext
passdb {
  driver = ldap
  args = /etc/dovecot/dovecot-ldap.conf.ext
}
userdb {
  driver = static
  args = uid=vmail gid=vmail home=/var/mail/vhosts/%d/%n allow_all_users=yes
}
```

```dovecot /etc/dovecot/dovecot-ldap.conf.ext (chmod 600)
uris = ldaps://dc1.corp.exemple.fr ldaps://dc2.corp.exemple.fr
dn = CN=svc_dovecot,OU=Services,DC=corp,DC=exemple,DC=fr
dnpass = MotDePasseDuCompteDeService
auth_bind = yes
base = OU=Utilisateurs,DC=corp,DC=exemple,DC=fr
scope = subtree
# Compte actif, membre du groupe Messagerie, identifié par son adresse
pass_filter = (&(objectClass=user)(mail=%u)(memberOf=CN=GG_Messagerie,OU=Groupes,DC=corp,DC=exemple,DC=fr)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))
pass_attrs = mail=user
user_filter = (&(objectClass=user)(mail=%u))
iterate_filter = (&(objectClass=user)(mail=*)(memberOf=CN=GG_Messagerie,OU=Groupes,DC=corp,DC=exemple,DC=fr))
iterate_attrs = mail=user
tls_require_cert = hard
```

| Paramètre | Rôle |
| --- | --- |
| `auth_bind = yes` | Dovecot vérifie le mot de passe en se **connectant à l'annuaire avec le compte de l'utilisateur** (aucun hachage à lire dans AD) |
| `pass_attrs = mail=user` | Normalise le nom d'utilisateur sur l'adresse de l'annuaire |
| `memberOf=…` | Restreint l'accès aux membres d'un groupe |
| `userAccountControl:…:=2` | Exclut les comptes désactivés |
| `iterate_filter` | Liste des utilisateurs pour `doveadm … -A` (opérations sur toutes les boîtes) |
| `allow_all_users=yes` | La userdb statique accepte tout utilisateur pour la livraison LMTP (Postfix a déjà validé le destinataire) |

> [!TIP]
> Pour un quota par utilisateur stocké dans AD, utilisez une **userdb LDAP** avec `user_attrs = =uid=vmail,=gid=vmail,=home=/var/mail/vhosts/%d/%n,extensionAttribute5=quota_rule=*:storage=%$` (attribut au choix).

## Base SQL

```dovecot /etc/dovecot/dovecot-sql.conf.ext
driver = mysql
connect = host=127.0.0.1 dbname=messagerie user=dovecot password=MotDePasse
default_pass_scheme = SHA512-CRYPT

password_query = SELECT adresse AS user, mot_de_passe AS password \
  FROM boites WHERE adresse = '%u' AND actif = 1

user_query = SELECT CONCAT('/var/mail/vhosts/', domaine, '/', partie_locale) AS home, \
  5000 AS uid, 5000 AS gid, CONCAT('*:storage=', quota_mo, 'M') AS quota_rule \
  FROM boites WHERE adresse = '%u' AND actif = 1

iterate_query = SELECT adresse AS user FROM boites WHERE actif = 1
```

```dovecot /etc/dovecot/conf.d/auth-sql.conf.ext
passdb {
  driver = sql
  args = /etc/dovecot/dovecot-sql.conf.ext
}
userdb {
  driver = sql
  args = /etc/dovecot/dovecot-sql.conf.ext
}
```

## Cache et protection

```dovecot /etc/dovecot/conf.d/10-auth.conf
auth_cache_size = 10M
auth_cache_ttl = 1 hour
auth_cache_negative_ttl = 5 mins
auth_failure_delay = 2 secs
```

Le cache réduit la charge sur l'annuaire ; `doveadm auth cache flush` après un changement de mot de passe si nécessaire.

## Utilisateurs maîtres

Permettent à un administrateur (ou à un outil de migration) d'ouvrir **n'importe quelle boîte** avec son propre mot de passe : `alice@exemple.fr*admin`.

```dovecot
auth_master_user_separator = *
passdb {
  driver = passwd-file
  master = yes
  args = /etc/dovecot/maitres
  result_success = continue
}
```

Usage à encadrer (traçabilité, comptes nominatifs, journalisation) : il donne accès à toutes les correspondances.

## Kerberos / GSSAPI

Pour une connexion IMAP **sans mot de passe** depuis des postes du domaine :

```dovecot
auth_mechanisms = plain login gssapi
auth_gssapi_hostname = mail.exemple.fr
auth_krb5_keytab = /etc/dovecot/dovecot.keytab      # principal imap/mail.exemple.fr@CORP.EXEMPLE.FR
```

## Socket d'authentification pour Postfix

```dovecot /etc/dovecot/conf.d/10-master.conf
service auth {
  unix_listener /var/spool/postfix/private/auth {
    mode = 0660
    user = postfix
    group = postfix
  }
  unix_listener auth-userdb {
    mode = 0600
    user = vmail
  }
}
```

Postfix l'utilise via `smtpd_sasl_type = dovecot` et `smtpd_sasl_path = private/auth` — voir [[01-postfix/04-domaines-virtuels-dovecot|Postfix : submission]].

```bash
sudo doveadm auth test -x service=smtp alice@exemple.fr
sudo doveadm user -A | head          # parcourt iterate_filter / iterate_query
```
