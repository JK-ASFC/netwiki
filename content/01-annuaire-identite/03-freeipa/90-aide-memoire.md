---
title: FreeIPA — aide-mémoire des commandes
description: Référence complète des commandes FreeIPA (et Red Hat IdM) avec exemples — installation (paquets, ipa-server-install avec DNS et CA externe, répliques, CA et KRA, clients RHEL et Debian, pare-feu), session et service (kinit, ipactl), configuration globale, utilisateurs (actifs, en attente, préservés, état des échecs), groupes (POSIX, non POSIX, externes AD, automember), politiques de mots de passe, OTP, rôles et délégation (RBAC), hôtes, groupes d'hôtes, services et keytabs (ipa-getkeytab -r), certificats (certmonger, révocation, CA externe, ipa-certupdate), HBAC, sudo (commandes, groupes, options), clés SSH, DNS intégré, approbation Active Directory (vues d'ID, groupes externes), réplication et topologie (segments, réinitialisation, retrait d'un serveur, maître de renouvellement CA), sauvegarde et restauration, santé (ipa-healthcheck), client SSSD et journaux.
tags: [aide-mémoire, freeipa, idm, ipa, kerberos, hbac, sudo, sssd, certmonger, dns]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|FreeIPA]], [[02-politiques-hbac-sudo|politiques, HBAC et sudo]] et [[03-approbation-ad-exploitation|approbation AD et exploitation]]. Exemples : domaine `ipa.exemple.fr`, royaume `IPA.EXEMPLE.FR`, serveurs `ipa1` et `ipa2.ipa.exemple.fr`, domaine AD approuvé `corp.exemple.fr`.

> [!TIP]
> Toutes les commandes `ipa …` demandent un ticket Kerberos (`kinit admin`). `ipa help commands` liste les commandes, `ipa <commande> --help` leurs options ; `--all --raw` affiche tous les attributs LDAP bruts.

## Installation

```bash
# Paquets (RHEL 9, Rocky, Alma, Fedora)
sudo dnf install ipa-server ipa-server-dns ipa-server-trust-ad
sudo dnf install ipa-client                               # client
sudo apt install freeipa-client                           # client Debian / Ubuntu

# Nom d'hôte complet et résolution directe obligatoires
sudo hostnamectl set-hostname ipa1.ipa.exemple.fr
getent hosts ipa1.ipa.exemple.fr

# Premier serveur : DNS intégré, zone inverse automatique, redirecteur
sudo ipa-server-install --domain=ipa.exemple.fr --realm=IPA.EXEMPLE.FR --hostname=ipa1.ipa.exemple.fr --ip-address=10.0.10.21 --setup-dns --forwarder=10.0.10.53 --auto-reverse --ds-password='MotDePasseDS' --admin-password='MotDePasseAdmin' --unattended

# Autorité de certification subordonnée à une AC d'entreprise (deux étapes)
sudo ipa-server-install --external-ca --domain=ipa.exemple.fr --realm=IPA.EXEMPLE.FR --setup-dns --forwarder=10.0.10.53
#   → signer /root/ipa.csr par l'AC d'entreprise, puis :
sudo ipa-server-install --external-cert-file=/root/ipa.crt --external-cert-file=/root/ca-entreprise.crt

# Réplique (hôte déjà inscrit comme client), avec DNS et CA
sudo ipa-replica-install --setup-dns --forwarder=10.0.10.53 --setup-ca
sudo ipa-replica-conncheck --master=ipa1.ipa.exemple.fr   # tester les ports avant
sudo ipa-ca-install                                       # ajouter la CA à une réplique existante
sudo ipa-kra-install                                      # coffre de clés (ipa vault)
sudo ipa-dns-install --forwarder=10.0.10.53               # ajouter le DNS à un serveur

# Client
sudo ipa-client-install --domain=ipa.exemple.fr --server=ipa1.ipa.exemple.fr --mkhomedir --principal=admin -W --unattended
sudo ipa-client-install --mkhomedir --enable-dns-updates --unattended --principal=admin -W   # découverte DNS des serveurs
sudo ipa-client-install --uninstall
sudo ipa-client-automount --location=paris                 # montages automatiques NFS

# Pare-feu (serveur)
sudo firewall-cmd --permanent --add-service=freeipa-4 --add-service=dns --add-service=ntp
sudo firewall-cmd --reload
```

## Session, service et configuration

```bash
kinit admin
klist
kdestroy
ipa ping
ipa env | grep -E "server|domain|realm"
sudo ipactl status
sudo ipactl restart
sudo ipactl stop && sudo ipactl start

ipa config-show
ipa config-mod --defaultshell=/bin/bash --emaildomain=exemple.fr --searchrecordslimit=2000
ipa config-mod --user-auth-type=password --user-auth-type=otp   # méthodes autorisées par défaut
```

## Utilisateurs

```bash
ipa user-add amartin --first=Alice --last=Martin --email=alice.martin@exemple.fr --shell=/bin/bash --title="Architecte réseau" --password
ipa user-show amartin --all
ipa user-find --last=Martin
ipa user-find --in-groups=reseau --sizelimit=0
ipa user-find --disabled=true
ipa user-mod amartin --phone="+33123456701" --manager=bpetit
ipa user-mod amartin --addattr="mobile=+33612345678"
ipa user-mod amartin --sshpubkey="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIExempleCleAlice amartin@poste"
ipa user-disable amartin
ipa user-enable amartin

# Mot de passe et verrouillage
ipa passwd amartin                                        # mot de passe temporaire (changement exigé)
ipa user-status amartin                                   # échecs et verrouillage sur chaque serveur
ipa user-unlock amartin
kinit amartin                                             # première connexion : change le mot de passe temporaire

# Cycle de vie : en attente (stage) → actif → préservé
ipa stageuser-add cdupont --first=Claire --last=Dupont --email=claire.dupont@exemple.fr
ipa stageuser-activate cdupont
ipa user-del cdupont --preserve
ipa user-undel cdupont
ipa user-del cdupont                                      # suppression définitive
```

## Groupes et règles d'appartenance automatique

```bash
ipa group-add reseau --desc="Équipe réseau"
ipa group-add partage-docs --nonposix                     # sans gidNumber (droits applicatifs)
ipa group-add-member reseau --users=amartin,bpetit
ipa group-add-member admins-infra --groups=reseau         # imbrication
ipa group-remove-member reseau --users=bpetit
ipa group-show reseau --all
ipa group-find --private=false

# Rattacher automatiquement selon un attribut
ipa automember-add --type=group reseau
ipa automember-add-condition reseau --type=group --key=title --inclusive-regex="^Architecte"
ipa automember-rebuild --type=group --users=amartin
ipa automember-add --type=hostgroup serveurs-lin
ipa automember-add-condition serveurs-lin --type=hostgroup --key=fqdn --inclusive-regex="^srv-.*\.ipa\.exemple\.fr$"
```

## Politiques de mots de passe et OTP

```bash
ipa pwpolicy-show
ipa pwpolicy-mod --minlength=14 --minclasses=3 --history=10 --maxlife=180 --minlife=1 --maxfail=10 --failinterval=60 --lockouttime=900
ipa pwpolicy-add admins --priority=1 --minlength=20 --maxlife=90 --maxfail=5
ipa pwpolicy-show --user=amartin                          # politique effective

# Mots de passe à usage unique (TOTP)
ipa otptoken-add --type=totp --owner=amartin --desc="Téléphone d'Alice"
ipa otptoken-find --owner=amartin
ipa user-mod amartin --user-auth-type=otp                 # exiger mot de passe + code
ipa otptoken-del <identifiant-du-jeton>
```

## Rôles et délégation (RBAC)

```bash
ipa role-find
ipa role-show helpdesk                                    # rôle fourni : modifier les utilisateurs, réinitialiser les mots de passe
ipa role-add-member helpdesk --groups=support
ipa privilege-find --sizelimit=0 | grep "Privilege name"
ipa role-add "Gestion DNS"
ipa role-add-privilege "Gestion DNS" --privileges="DNS Administrators"
ipa role-add-member "Gestion DNS" --groups=reseau
```

## Hôtes, groupes d'hôtes, services et keytabs

```bash
ipa host-add srv-web01.ipa.exemple.fr --ip-address=10.0.30.10
ipa host-add srv-appliance.ipa.exemple.fr --force         # sans contrôle DNS
ipa host-show srv-web01.ipa.exemple.fr
ipa host-find --hostgroups=serveurs-lin
ipa host-disable srv-web01.ipa.exemple.fr                 # invalide les keytabs et certificats
ipa host-del srv-web01.ipa.exemple.fr --updatedns
ipa hostgroup-add serveurs-lin --desc="Serveurs Linux"
ipa hostgroup-add-member serveurs-lin --hosts=srv-web01.ipa.exemple.fr

# Service Kerberos et keytab
ipa service-add HTTP/srv-web01.ipa.exemple.fr
ipa service-add-host HTTP/srv-web01.ipa.exemple.fr --hosts=srv-web01.ipa.exemple.fr
ipa-getkeytab -s ipa1.ipa.exemple.fr -p HTTP/srv-web01.ipa.exemple.fr -k /etc/httpd/http.keytab
ipa-getkeytab -s ipa1.ipa.exemple.fr -p HTTP/srv-web01.ipa.exemple.fr -k /etc/httpd/http.keytab -r   # récupérer sans régénérer (2e serveur)
ipa-rmkeytab -p HTTP/srv-web01.ipa.exemple.fr -k /etc/httpd/http.keytab
klist -kte /etc/httpd/http.keytab
kvno HTTP/srv-web01.ipa.exemple.fr                        # ticket de service obtenu ?
sudo kinit -k host/$(hostname -f)                         # keytab de l'hôte valide ?
```

## Certificats

```bash
# Certificat de service suivi et renouvelé par certmonger
sudo ipa-getcert request -f /etc/pki/tls/certs/web.crt -k /etc/pki/tls/private/web.key -K HTTP/srv-web01.ipa.exemple.fr -D srv-web01.ipa.exemple.fr -D intranet.ipa.exemple.fr -C "systemctl reload httpd"
sudo ipa-getcert list
sudo getcert list -i 20261115120000                       # détail d'une demande (identifiant de « getcert list »)
sudo ipa-getcert resubmit -i 20261115120000
sudo ipa-getcert stop-tracking -i 20261115120000

# Depuis une CSR
ipa cert-request /tmp/srv-app.csr --principal=HTTP/srv-app.ipa.exemple.fr
ipa cert-find --subject=srv-web01
ipa cert-show 12 --out=/tmp/cert-12.pem
ipa cert-revoke 12 --revocation-reason=1                  # 1 = clé compromise
ipa certprofile-find
ipa caacl-find

# Certificats d'AC : ajouter une AC externe, propager, renouveler
sudo ipa-cacert-manage install /root/ca-partenaire.crt -n ca-partenaire -t C,,
sudo ipa-certupdate                                       # sur chaque serveur et client
sudo ipa-cacert-manage renew
sudo ipa-cacert-manage list
```

## HBAC (contrôle d'accès aux hôtes)

```bash
ipa hbacrule-find
ipa hbacrule-disable allow_all                            # après avoir créé les règles nécessaires
ipa hbacrule-add admins-ssh-serveurs --desc="Équipe réseau sur les serveurs Linux"
ipa hbacrule-add-user admins-ssh-serveurs --groups=reseau
ipa hbacrule-add-host admins-ssh-serveurs --hostgroups=serveurs-lin
ipa hbacrule-add-service admins-ssh-serveurs --hbacsvcs=sshd --hbacsvcs=sudo
ipa hbacrule-show admins-ssh-serveurs
ipa hbacsvc-find
ipa hbacsvcgroup-find
ipa hbactest --user=amartin --host=srv-web01.ipa.exemple.fr --service=sshd
ipa hbactest --user=amartin --host=srv-web01.ipa.exemple.fr --service=sshd --rules=admins-ssh-serveurs
```

## sudo centralisé

```bash
ipa sudocmd-add /usr/bin/systemctl
ipa sudocmd-add /usr/bin/journalctl
ipa sudocmdgroup-add services --desc="Gestion des services"
ipa sudocmdgroup-add-member services --sudocmds=/usr/bin/systemctl --sudocmds=/usr/bin/journalctl

ipa sudorule-add reseau-services
ipa sudorule-add-user reseau-services --groups=reseau
ipa sudorule-add-host reseau-services --hostgroups=serveurs-lin
ipa sudorule-add-allow-command reseau-services --sudocmdgroups=services
ipa sudorule-mod reseau-services --runasusercat=all
ipa sudorule-add-option reseau-services --sudooption='!authenticate'
ipa sudorule-show reseau-services

ipa sudorule-add admins-tout --cmdcat=all --hostcat=all
ipa sudorule-add-user admins-tout --groups=admins

# Sur le client
sudo sss_cache -E
sudo -l -U amartin
```

## Clés SSH et automount

```bash
ipa user-mod amartin --sshpubkey="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIExempleCleAlice amartin@poste"
sss_ssh_authorizedkeys amartin                            # clés vues par sshd sur le client
ipa automountlocation-add paris
ipa automountmap-add paris auto.home
ipa automountkey-add paris auto.master --key=/home --info=auto.home
ipa automountkey-add paris auto.home --key='*' --info="nfs.ipa.exemple.fr:/export/home/&"
```

## DNS intégré

```bash
ipa dnszone-find
ipa dnszone-show ipa.exemple.fr
ipa dnszone-mod ipa.exemple.fr --dynamic-update=TRUE --allow-sync-ptr=TRUE
ipa dnszone-add 30.0.10.in-addr.arpa.
ipa dnsrecord-find ipa.exemple.fr
ipa dnsrecord-add ipa.exemple.fr www --a-rec=10.0.30.10
ipa dnsrecord-add ipa.exemple.fr www --aaaa-rec=2001:db8::10
ipa dnsrecord-add ipa.exemple.fr intranet --cname-rec=www.ipa.exemple.fr.
ipa dnsrecord-add 30.0.10.in-addr.arpa. 10 --ptr-rec=www.ipa.exemple.fr.
ipa dnsrecord-del ipa.exemple.fr www --a-rec=10.0.30.10
ipa dnsforwardzone-add exemple.lan --forwarder=10.0.10.53 --forward-policy=only
ipa dnsconfig-mod --forwarder=9.9.9.9 --forward-policy=first
ipa dns-update-system-records                             # recréer les SRV et TXT de FreeIPA
dig +short SRV _ldap._tcp.ipa.exemple.fr
dig +short SRV _kerberos._udp.ipa.exemple.fr
```

## Approbation Active Directory

```bash
sudo ipa-adtrust-install --netbios-name=IPA -a 'MotDePasseAdmin' --add-sids
ipa dnsforwardzone-add corp.exemple.fr --forwarder=10.0.10.11 --forward-policy=only
ipa trust-add --type=ad corp.exemple.fr --admin Administrateur --password
ipa trust-show corp.exemple.fr
ipa trust-fetch-domains corp.exemple.fr
ipa trustdomain-find corp.exemple.fr
ipa idrange-find

# Donner des droits FreeIPA à un groupe AD : groupe externe → groupe POSIX
ipa group-add ad-admins-externe --external
ipa group-add-member ad-admins-externe --external 'CORP\Admins du domaine'
ipa group-add ad-admins
ipa group-add-member ad-admins --groups=ad-admins-externe

# Surcharger des attributs POSIX d'un compte AD (vue par défaut)
ipa idoverrideuser-add 'Default Trust View' amartin@corp.exemple.fr --shell=/bin/bash --homedir=/home/amartin

# Côté client
id amartin@corp.exemple.fr
getent passwd amartin@corp.exemple.fr
sudo sss_cache -E
```

## Réplication et topologie

```bash
ipa server-find
ipa server-show ipa2.ipa.exemple.fr
ipa server-role-find --role "CA server"
ipa server-role-find --role "DNS server"
ipa topologysuffix-find
ipa topologysegment-find domain
ipa topologysegment-find ca
ipa topologysuffix-verify domain
ipa topologysegment-add domain ipa2-vers-ipa3 --leftnode=ipa2.ipa.exemple.fr --rightnode=ipa3.ipa.exemple.fr

# État et resynchronisation
ipa-replica-manage list -v ipa1.ipa.exemple.fr
ipa-replica-manage force-sync --from=ipa2.ipa.exemple.fr
ipa-replica-manage re-initialize --from=ipa1.ipa.exemple.fr       # sur le serveur à réinitialiser

# Retirer définitivement un serveur
ipa server-del ipa3.ipa.exemple.fr

# Maître de renouvellement de la CA et génération des CRL
ipa config-show | grep -i "renewal master"
ipa config-mod --ca-renewal-master-server=ipa1.ipa.exemple.fr
sudo ipa-crlgen-manage status
sudo ipa-crlgen-manage enable                              # sur le serveur qui doit produire la CRL
```

## Sauvegarde et restauration

```bash
sudo ipa-backup                                           # complète (services arrêtés pendant la sauvegarde)
sudo ipa-backup --data --online                           # données seules, à chaud
ls -l /var/lib/ipa/backup/
sudo ipa-restore /var/lib/ipa/backup/ipa-full-2026-11-15-02-00-00
sudo ipa-restore --data /var/lib/ipa/backup/ipa-data-2026-11-15-02-00-00
```

> [!WARNING]
> Une sauvegarde complète contient les clés de l'AC et du KDC : chiffrez-la et stockez-la hors du serveur. Dans une topologie à plusieurs serveurs, une restauration se fait sur un serveur isolé puis les autres sont réinitialisés depuis lui (`ipa-replica-manage re-initialize`).

## Santé, mises à jour et journaux

```bash
sudo ipa-healthcheck --failures-only --output-type human
sudo ipa-healthcheck --list-sources
sudo ipa-healthcheck --source ipahealthcheck.ipa.certs
sudo dnf update 'ipa-*' && sudo ipa-server-upgrade        # la mise à jour des paquets lance normalement l'upgrade
sudo journalctl -u krb5kdc -u httpd -u named --since "1 hour ago"
sudo tail -f /var/log/dirsrv/slapd-IPA-EXEMPLE-FR/errors
sudo tail -f /var/log/krb5kdc.log
sudo tail -f /var/log/httpd/error_log
sudo ls /var/log/pki/pki-tomcat/ca/                       # journaux de la CA (Dogtag)
```

## Client (SSSD)

```bash
sudo sssctl domain-list
sudo sssctl domain-status ipa.exemple.fr
sudo sssctl user-checks amartin -s sshd                   # l'utilisateur peut-il ouvrir une session SSH ?
sudo sssctl logs-remove && sudo systemctl restart sssd    # journaux propres avant un test
sudo sss_cache -E                                         # vider le cache
id amartin
getent group reseau
klist -k /etc/krb5.keytab
sudo tail -f /var/log/sssd/sssd_ipa.exemple.fr.log
```
