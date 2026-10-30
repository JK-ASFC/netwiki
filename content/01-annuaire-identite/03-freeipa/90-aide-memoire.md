---
title: FreeIPA — aide-mémoire des commandes
description: Commandes FreeIPA avec exemples — installation serveur, réplique et client (ipa-server-install, ipa-replica-install, ipa-client-install), authentification (kinit), utilisateurs, groupes, hôtes et services, mots de passe et OTP, règles HBAC et sudo, DNS intégré, certificats, approbation Active Directory, réplication (ipa-replica-manage, topologie), sauvegarde et restauration, diagnostic (ipactl, ipa-healthcheck).
tags: [aide-mémoire, freeipa, ipa, kerberos, hbac, sudo, idm]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|FreeIPA]]. Domaine d'exemple : `ipa.exemple.fr`, royaume `IPA.EXEMPLE.FR`.

## Installation

```bash
# Serveur avec DNS intégré et redirecteurs
sudo ipa-server-install --domain=ipa.exemple.fr --realm=IPA.EXEMPLE.FR --setup-dns --forwarder=10.0.10.53 --no-ntp --unattended --ds-password='MotDePasseDS' --admin-password='MotDePasseAdmin'
# Réplique (sur un hôte déjà inscrit comme client)
sudo ipa-replica-install --setup-dns --forwarder=10.0.10.53 --setup-ca
# Client
sudo ipa-client-install --domain=ipa.exemple.fr --server=ipa1.ipa.exemple.fr --mkhomedir --principal=admin --unattended -W
# Désinscrire un client
sudo ipa-client-install --uninstall
```

## Session et service

```bash
kinit admin
klist
ipa ping
sudo ipactl status
sudo ipactl restart
ipa config-show
```

## Utilisateurs et groupes

```bash
ipa user-add amartin --first=Alice --last=Martin --email=alice.martin@exemple.fr --shell=/bin/bash --password
ipa user-show amartin --all
ipa user-find --last=Martin
ipa user-mod amartin --title="Architecte réseau" --phone="+33123456701"
ipa user-mod amartin --sshpubkey="ssh-ed25519 AAAA... amartin@poste"
ipa user-disable amartin
ipa user-enable amartin
ipa user-unlock amartin
ipa user-del amartin --preserve           # conserver dans les utilisateurs préservés
ipa passwd amartin                         # réinitialiser le mot de passe (changement exigé)
ipa group-add reseau --desc="Équipe réseau"
ipa group-add-member reseau --users=amartin,bpetit
ipa group-remove-member reseau --users=bpetit
ipa group-show reseau
# Politique de mots de passe
ipa pwpolicy-show
ipa pwpolicy-mod --minlength=14 --maxfail=10 --lockouttime=900
```

## Hôtes, services, certificats

```bash
ipa host-add srv-web01.ipa.exemple.fr --ip-address=10.0.30.10
ipa host-find
ipa service-add HTTP/srv-web01.ipa.exemple.fr
ipa-getkeytab -s ipa1.ipa.exemple.fr -p HTTP/srv-web01.ipa.exemple.fr -k /etc/httpd/http.keytab
# Certificat de service suivi par certmonger
sudo ipa-getcert request -f /etc/pki/tls/certs/web.crt -k /etc/pki/tls/private/web.key -K HTTP/srv-web01.ipa.exemple.fr -D srv-web01.ipa.exemple.fr
sudo ipa-getcert list
ipa cert-find --subject=srv-web01
```

## HBAC et sudo

```bash
ipa hbacrule-disable allow_all
ipa hbacrule-add admins-ssh-serveurs
ipa hbacrule-add-user admins-ssh-serveurs --groups=reseau
ipa hostgroup-add serveurs-lin
ipa hostgroup-add-member serveurs-lin --hosts=srv-web01.ipa.exemple.fr
ipa hbacrule-add-host admins-ssh-serveurs --hostgroups=serveurs-lin
ipa hbacrule-add-service admins-ssh-serveurs --hbacsvcs=sshd
ipa hbactest --user=amartin --host=srv-web01.ipa.exemple.fr --service=sshd
ipa sudorule-add reseau-sudo --cmdcat=all
ipa sudorule-add-user reseau-sudo --groups=reseau
ipa sudorule-add-host reseau-sudo --hostgroups=serveurs-lin
# Sur le client : vider le cache SSSD après modification
sudo sss_cache -E
sudo -l -U amartin
```

## DNS intégré

```bash
ipa dnszone-find
ipa dnsrecord-add ipa.exemple.fr www --a-rec=10.0.30.10
ipa dnsrecord-add ipa.exemple.fr www --aaaa-rec=2001:db8::10
ipa dnsrecord-add 30.0.10.in-addr.arpa. 10 --ptr-rec=www.ipa.exemple.fr.
ipa dnsrecord-del ipa.exemple.fr www --a-rec=10.0.30.10
ipa dnsforwardzone-add exemple.lan --forwarder=10.0.10.53 --forward-policy=only
```

## Approbation Active Directory

```bash
sudo ipa-adtrust-install --netbios-name=IPA -a 'MotDePasseAdmin'
ipa trust-add --type=ad corp.exemple.fr --admin Administrateur --password
ipa trust-show corp.exemple.fr
id 'amartin@corp.exemple.fr'
```

## Réplication et topologie

```bash
ipa server-find
ipa topologysegment-find domain
ipa topologysuffix-verify domain
ipa-replica-manage list -v ipa1.ipa.exemple.fr
ipa-replica-manage force-sync --from=ipa2.ipa.exemple.fr
ipa server-role-find --role "CA server"
ipa config-show | grep "CA renewal"
```

## Sauvegarde, restauration, santé

```bash
sudo ipa-backup                           # complète (service arrêté pendant la sauvegarde)
sudo ipa-backup --data --online           # données seules, à chaud
ls /var/lib/ipa/backup/
sudo ipa-restore /var/lib/ipa/backup/ipa-full-2026-10-29-02-00-00
sudo ipa-healthcheck --output-type human --failures-only
sudo journalctl -u sssd -u krb5kdc -u dirsrv@IPA-EXEMPLE-FR --since "1 hour ago"
```
