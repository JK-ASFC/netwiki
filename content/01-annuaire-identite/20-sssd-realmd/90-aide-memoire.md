---
title: SSSD et realmd — aide-mémoire des commandes
description: Commandes realmd et SSSD avec exemples — realm (discover, join, leave, list, permit, deny), adcli (testjoin, update), sssctl (domain-status, user-checks, config-check, logs-fetch, cache-remove), sss_cache, getent, id, kinit, klist, authselect et pam-auth-update.
tags: [aide-mémoire, sssd, realmd, active directory, kerberos]
icon: terminal
---

Référence rapide ; explications dans [[01-presentation-configuration|SSSD et realmd]].

```bash
realm discover corp.exemple.fr
sudo realm join corp.exemple.fr -U adm-jonction --computer-ou="OU=Serveurs Linux,DC=corp,DC=exemple,DC=fr"
sudo realm leave corp.exemple.fr -U adm-jonction
realm list
sudo realm permit alice ; sudo realm permit -g GG-Admins-Linux ; sudo realm deny --all ; sudo realm permit --all
sudo adcli testjoin ; sudo adcli update --computer-password-lifetime=30
id alice ; getent passwd alice ; getent group GG-Admins-Linux
sudo sssctl domain-list ; sudo sssctl domain-status corp.exemple.fr
sudo sssctl user-checks alice -s sshd
sudo sssctl config-check
sudo sssctl cache-remove ; sudo sss_cache -E ; sudo sss_cache -u alice
sudo sssctl logs-fetch /tmp/sssd-logs.tar ; sudo sssctl debug-level 6
kinit alice@CORP.EXEMPLE.FR ; klist ; kdestroy
sudo klist -k /etc/krb5.keytab                       # clés du compte machine
sudo authselect current ; sudo authselect select sssd with-mkhomedir --force   # RHEL
sudo pam-auth-update --enable mkhomedir              # Debian/Ubuntu
journalctl -u sssd --since "10 min ago"
```
