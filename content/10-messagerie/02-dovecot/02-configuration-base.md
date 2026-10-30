---
title: "Configuration de base : boîtes virtuelles, TLS, dossiers"
description: Configurer Dovecot 2.3 pour des utilisateurs virtuels — compte système vmail, emplacement Maildir par domaine, utilisateurs dans un fichier avec mots de passe hachés (doveadm pw), TLS obligatoire, dossiers spéciaux créés automatiquement, limites de connexions, et premiers tests IMAP.
tags: [dovecot, maildir, vmail, tls, passwd-file, doveadm pw, special-use]
icon: settings-2
---

## Compte système et arborescence

Tous les utilisateurs virtuels sont stockés sous un compte système unique :

```bash
sudo groupadd -g 5000 vmail
sudo useradd -u 5000 -g vmail -d /var/mail/vhosts -s /usr/sbin/nologin vmail
sudo mkdir -p /var/mail/vhosts && sudo chown -R vmail:vmail /var/mail/vhosts && sudo chmod 770 /var/mail/vhosts
```

## Protocoles et stockage

```dovecot /etc/dovecot/dovecot.conf (extrait)
protocols = imap lmtp sieve
listen = *, ::
```

```dovecot /etc/dovecot/conf.d/10-mail.conf
mail_location = maildir:/var/mail/vhosts/%d/%n/Maildir
mail_uid = vmail
mail_gid = vmail
first_valid_uid = 5000
last_valid_uid = 5000
mail_privileged_group = vmail

namespace inbox {
  inbox = yes
  separator = /
}
```

`%d` = domaine, `%n` = partie locale de l'adresse : `alice@exemple.fr` → `/var/mail/vhosts/exemple.fr/alice/Maildir`.

## Dossiers spéciaux

```dovecot /etc/dovecot/conf.d/15-mailboxes.conf
namespace inbox {
  mailbox Drafts {
    special_use = \Drafts
    auto = subscribe
  }
  mailbox Sent {
    special_use = \Sent
    auto = subscribe
  }
  mailbox Junk {
    special_use = \Junk
    auto = subscribe
    autoexpunge = 30d
  }
  mailbox Trash {
    special_use = \Trash
    auto = subscribe
    autoexpunge = 60d
  }
  mailbox Archive {
    special_use = \Archive
    auto = create
  }
}
```

Les attributs *special-use* (RFC 6154) permettent aux clients d'utiliser automatiquement les bons dossiers, quelle que soit la langue affichée. `autoexpunge` vide automatiquement les vieux messages des Indésirables et de la Corbeille.

## Utilisateurs dans un fichier

```bash
doveadm pw -s SHA512-CRYPT              # ou ARGON2ID si disponible ; saisir le mot de passe
# {SHA512-CRYPT}$6$…
```

```text /etc/dovecot/utilisateurs (chmod 640, root:dovecot)
alice@exemple.fr:{SHA512-CRYPT}$6$rounds=5000$…::::::
bob@exemple.fr:{SHA512-CRYPT}$6$…::::::userdb_quota_rule=*:storage=2G
```

```dovecot /etc/dovecot/conf.d/auth-passwdfile.conf.ext
passdb {
  driver = passwd-file
  args = scheme=SHA512-CRYPT username_format=%u /etc/dovecot/utilisateurs
}
userdb {
  driver = static
  args = uid=vmail gid=vmail home=/var/mail/vhosts/%d/%n
}
```

```dovecot /etc/dovecot/conf.d/10-auth.conf
disable_plaintext_auth = yes
auth_mechanisms = plain login
auth_username_format = %Lu                 # adresses en minuscules
#!include auth-system.conf.ext
!include auth-passwdfile.conf.ext
```

Pour un annuaire ou une base de données, voir [[03-authentification-ldap-sql]].

## TLS

```dovecot /etc/dovecot/conf.d/10-ssl.conf
ssl = required
ssl_cert = </etc/letsencrypt/live/mail.exemple.fr/fullchain.pem
ssl_key = </etc/letsencrypt/live/mail.exemple.fr/privkey.pem
ssl_min_protocol = TLSv1.2
ssl_prefer_server_ciphers = yes
ssl_dh = </usr/share/dovecot/dh.pem
```

Le `<` signifie « lire le contenu du fichier ». Après renouvellement du certificat : `systemctl reload dovecot` (crochet `deploy` de certbot).

```dovecot /etc/dovecot/conf.d/10-master.conf (n'ouvrir que les ports chiffrés)
service imap-login {
  inet_listener imap {
    port = 0
  }
  inet_listener imaps {
    port = 993
    ssl = yes
  }
}
service pop3-login {
  inet_listener pop3 {
    port = 0
  }
}
```

## Limites et options IMAP

```dovecot /etc/dovecot/conf.d/20-imap.conf
protocol imap {
  mail_max_userip_connections = 20        # par utilisateur et par IP (clients avec beaucoup de dossiers)
  imap_idle_notify_interval = 2 mins
}
```

```dovecot /etc/dovecot/conf.d/10-logging.conf (diagnostic)
auth_verbose = yes
auth_verbose_passwords = no
#auth_debug = yes
#mail_debug = yes
```

## Tester

```bash
sudo doveadm auth test alice@exemple.fr          # authentification
sudo doveadm user alice@exemple.fr               # attributs (home, uid, quota)
openssl s_client -connect mail.exemple.fr:993 -quiet
# a LOGIN alice@exemple.fr MotDePasse
# b LIST "" "*"
# c LOGOUT
```

Configuration des clients : IMAP `mail.exemple.fr:993` (SSL/TLS), SMTP `mail.exemple.fr:465` ou `587`, identifiant = adresse complète. L'**autoconfiguration** (Thunderbird `autoconfig.exemple.fr`, Outlook `autodiscover`) évite la saisie manuelle.
