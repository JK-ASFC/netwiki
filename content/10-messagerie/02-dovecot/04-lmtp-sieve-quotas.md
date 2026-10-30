---
title: LMTP, Sieve, apprentissage anti-spam et quotas
description: Livraison LMTP depuis Postfix (socket, sous-adressage), filtres Sieve côté serveur (Pigeonhole — script global anti-spam, scripts utilisateurs, répondeur d'absence, ManageSieve), apprentissage du spam par déplacement de messages (IMAPSieve + Rspamd), quotas avec service quota-status pour Postfix, et recherche plein texte.
tags: [dovecot, lmtp, sieve, pigeonhole, managesieve, imapsieve, quota, fts, rspamd]
icon: filter
---

## LMTP

```dovecot /etc/dovecot/conf.d/10-master.conf
service lmtp {
  unix_listener /var/spool/postfix/private/dovecot-lmtp {
    mode = 0600
    user = postfix
    group = postfix
  }
}
```

```dovecot /etc/dovecot/conf.d/20-lmtp.conf
protocol lmtp {
  mail_plugins = $mail_plugins sieve quota
  postmaster_address = postmaster@exemple.fr
}
lmtp_save_to_detail_mailbox = yes        # alice+factures@ → dossier « factures » s'il existe
recipient_delimiter = +
```

Côté Postfix : `virtual_transport = lmtp:unix:private/dovecot-lmtp` ([[01-postfix/04-domaines-virtuels-dovecot|Postfix]]).

## Sieve (Pigeonhole)

```dovecot /etc/dovecot/conf.d/90-sieve.conf
plugin {
  sieve = file:~/sieve;active=~/.dovecot.sieve
  sieve_before = /etc/dovecot/sieve/avant.d/      # scripts globaux exécutés avant ceux de l'utilisateur
  sieve_after = /etc/dovecot/sieve/apres.d/
  sieve_max_script_size = 1M
  sieve_max_actions = 32
  sieve_max_redirects = 4
}
```

### Script global : indésirables

```sieve /etc/dovecot/sieve/avant.d/10-spam.sieve
require ["fileinto", "mailbox"];
# En-tête ajouté par Rspamd (action « add header ») ou SpamAssassin
if anyof (header :contains "X-Spam" "Yes", header :contains "X-Spam-Flag" "YES") {
    fileinto :create "Junk";
    stop;
}
```

```bash
sudo mkdir -p /etc/dovecot/sieve/avant.d
sudo sievec /etc/dovecot/sieve/avant.d/10-spam.sieve       # compiler (fichier .svbin)
sudo chown -R vmail:vmail /etc/dovecot/sieve
```

### Scripts des utilisateurs

Les utilisateurs gèrent leurs règles via **ManageSieve** (port 4190) depuis Roundcube, Thunderbird (extension) ou tout client compatible.

```sieve Exemple de script utilisateur (tri et absence)
require ["fileinto", "mailbox", "vacation", "date", "relational"];

if address :is "from" "factures@fournisseur.fr" {
    fileinto :create "Factures";
}

if currentdate :value "ge" "date" "2025-12-22" {
  if currentdate :value "le" "date" "2026-01-04" {
    vacation :days 7 :subject "Absence"
      "Je suis absent jusqu'au 4 janvier. Pour toute urgence : support@exemple.fr";
  }
}
```

```dovecot /etc/dovecot/conf.d/20-managesieve.conf
service managesieve-login {
  inet_listener sieve {
    port = 4190
  }
}
```

## Apprentissage anti-spam par déplacement (IMAPSieve)

Quand un utilisateur **déplace** un message vers *Junk*, Dovecot l'envoie à Rspamd pour apprentissage ; quand il le sort de *Junk*, il est appris comme légitime.

```dovecot /etc/dovecot/conf.d/90-imapsieve.conf
protocol imap {
  mail_plugins = $mail_plugins imap_sieve
}
plugin {
  sieve_plugins = sieve_imapsieve sieve_extprograms
  sieve_global_extensions = +vnd.dovecot.pipe
  sieve_pipe_bin_dir = /etc/dovecot/sieve/bin

  imapsieve_mailbox1_name = Junk
  imapsieve_mailbox1_causes = COPY APPEND
  imapsieve_mailbox1_before = file:/etc/dovecot/sieve/apprendre-spam.sieve

  imapsieve_mailbox2_name = *
  imapsieve_mailbox2_from = Junk
  imapsieve_mailbox2_causes = COPY
  imapsieve_mailbox2_before = file:/etc/dovecot/sieve/apprendre-ham.sieve
}
```

```sieve /etc/dovecot/sieve/apprendre-spam.sieve
require ["vnd.dovecot.pipe", "copy", "imapsieve"];
pipe :copy "rspamd-apprendre-spam.sh";
```

```sieve /etc/dovecot/sieve/apprendre-ham.sieve
require ["vnd.dovecot.pipe", "copy", "imapsieve", "environment", "variables"];
if environment :matches "imap.mailbox" "*" {
  set "dossier" "${1}";
}
if string "${dossier}" "Trash" {
  stop;
}
pipe :copy "rspamd-apprendre-ham.sh";
```

```bash /etc/dovecot/sieve/bin/rspamd-apprendre-spam.sh
#!/bin/sh
exec /usr/bin/rspamc -h 127.0.0.1:11334 learn_spam
```

```bash
# Le script « ham » est identique avec learn_ham
sudo chmod 755 /etc/dovecot/sieve/bin/*.sh
sudo sievec /etc/dovecot/sieve/apprendre-spam.sieve && sudo sievec /etc/dovecot/sieve/apprendre-ham.sieve
```

Voir [[04-rspamd/03-exploitation-depannage|l'apprentissage côté Rspamd]] (mot de passe du contrôleur, Bayes).

## Quotas

```dovecot /etc/dovecot/conf.d/10-mail.conf
mail_plugins = $mail_plugins quota
```

```dovecot /etc/dovecot/conf.d/20-imap.conf
protocol imap {
  mail_plugins = $mail_plugins imap_quota imap_sieve
}
```

```dovecot /etc/dovecot/conf.d/90-quota.conf
plugin {
  quota = count:Quota utilisateur
  quota_vsizes = yes
  quota_rule = *:storage=5G
  quota_rule2 = Trash:storage=+500M
  quota_grace = 10%%
  quota_warning = storage=95%% quota-alerte 95 %u
  quota_warning2 = storage=80%% quota-alerte 80 %u

  quota_status_success = DUNNO
  quota_status_nouser = DUNNO
  quota_status_overquota = "552 5.2.2 Mailbox is full"
}

service quota-status {
  executable = quota-status -p postfix
  inet_listener {
    address = 127.0.0.1
    port = 12340
  }
  client_limit = 1
}

service quota-alerte {
  executable = script /usr/local/bin/quota-alerte.sh
  user = vmail
  unix_listener quota-alerte {
    user = vmail
  }
}
```

```postfix /etc/postfix/main.cf (rejeter dès la session SMTP si la boîte est pleine)
smtpd_recipient_restrictions = …, check_policy_service inet:127.0.0.1:12340
```

```bash
sudo doveadm quota get -u alice@exemple.fr
sudo doveadm quota recalc -u alice@exemple.fr
```

Un quota spécifique par utilisateur vient de la userdb (`quota_rule=*:storage=10G`, voir [[03-authentification-ldap-sql]]).

## Recherche plein texte

| Moteur | Remarque |
| --- | --- |
| **fts-flatcurve** | Index Xapian intégré (2.3.21+ en greffon, natif en 2.4) : recommandé |
| fts-xapian | Greffon tiers, même principe |
| Solr / Tika | Grandes installations, indexation des pièces jointes |

Sans moteur FTS, une recherche dans le corps des messages parcourt tous les fichiers : lent sur les grandes boîtes.
