---
title: Utilisateurs, HBAC, sudo, certificats et DNS
description: Administrer FreeIPA — utilisateurs, groupes, politiques de mots de passe et OTP, groupes d'hôtes, règles HBAC (qui se connecte où), règles sudo centralisées, clés SSH, services et keytabs, certificats d'hôtes et de services avec certmonger, DNS intégré, automount et délégation des droits d'administration.
tags: [freeipa, hbac, sudo, otp, certmonger, keytab, dns, rbac]
icon: settings-2
---

## Utilisateurs et groupes

```bash
kinit admin
ipa user-add alice --first=Alice --last=Martin --email=alice.martin@exemple.fr --password
ipa user-mod alice --sshpubkey="ssh-ed25519 AAAAC3… alice@poste"
ipa group-add admins-reseau --desc="Administrateurs réseau"
ipa group-add-member admins-reseau --users=alice
ipa user-disable bob
ipa pwpolicy-mod --minlength=14 --minclasses=3 --maxlife=365 --history=10 --maxfail=6 --lockouttime=600
```

### Double authentification (OTP)

```bash
ipa config-mod --user-auth-type=otp --user-auth-type=password      # OTP autorisé globalement
ipa user-mod alice --user-auth-type=otp                            # exigé pour alice
ipa otptoken-add --owner=alice --type=totp                         # QR code à scanner
```

## Groupes d'hôtes et HBAC

Par défaut, la règle `allow_all` autorise tout utilisateur sur tout hôte : remplacez-la par des règles explicites.

```bash
ipa hostgroup-add serveurs-reseau
ipa hostgroup-add-member serveurs-reseau --hosts=netbox.linux.exemple.fr --hosts=oxidized.linux.exemple.fr

ipa hbacrule-add acces-serveurs-reseau
ipa hbacrule-add-user acces-serveurs-reseau --groups=admins-reseau
ipa hbacrule-add-host acces-serveurs-reseau --hostgroups=serveurs-reseau
ipa hbacrule-add-service acces-serveurs-reseau --hbacsvcs=sshd --hbacsvcs=sudo
ipa hbactest --user=alice --host=netbox.linux.exemple.fr --service=sshd     # simulation
ipa hbacrule-disable allow_all
```

## sudo centralisé

```bash
ipa sudocmdgroup-add commandes-reseau
ipa sudocmd-add "/usr/bin/systemctl restart netbox"
ipa sudocmdgroup-add-member commandes-reseau --sudocmds="/usr/bin/systemctl restart netbox"

ipa sudorule-add reseau-redemarrage
ipa sudorule-add-user reseau-redemarrage --groups=admins-reseau
ipa sudorule-add-host reseau-redemarrage --hostgroups=serveurs-reseau
ipa sudorule-add-allow-command reseau-redemarrage --sudocmdgroups=commandes-reseau
ipa sudorule-add-option reseau-redemarrage --sudooption='!authenticate'
```

Les clients appliquent ces règles via SSSD (`sudo -l` pour vérifier ; cache de quelques minutes).

## Services et keytabs

```bash
ipa service-add HTTP/netbox.linux.exemple.fr
sudo ipa-getkeytab -p HTTP/netbox.linux.exemple.fr -k /etc/httpd/conf/http.keytab
```

Les services web peuvent ainsi proposer l'authentification **Kerberos/SPNEGO** (SSO) aux postes du domaine.

## Certificats

```bash
# Sur un client : certificat de service émis par l'AC FreeIPA et renouvelé automatiquement par certmonger
sudo ipa-getcert request -f /etc/pki/tls/certs/netbox.crt -k /etc/pki/tls/private/netbox.key \
  -K HTTP/netbox.linux.exemple.fr -D netbox.linux.exemple.fr -C "systemctl reload nginx"
sudo ipa-getcert list
ipa cert-find --subject=netbox.linux.exemple.fr
```

L'AC de FreeIPA (`/etc/ipa/ca.crt`) doit être approuvée par les postes et navigateurs qui accèdent à ces services. FreeIPA prend aussi en charge **ACME** (`ipa-acme-manage enable`) pour les outils compatibles (certbot, cert-manager).

## DNS intégré

```bash
ipa dnszone-find
ipa dnsrecord-add linux.exemple.fr netbox --a-rec=10.0.20.30
ipa dnsrecord-add linux.exemple.fr _ldap._tcp --srv-rec="0 100 389 ipa1.linux.exemple.fr."
ipa dnsforwardzone-add corp.exemple.fr --forwarder=10.0.10.11 --forward-policy=only    # zone AD
```

Les clients inscrits mettent à jour leur propre enregistrement (`--enable-dns-updates`), de façon sécurisée (GSS-TSIG).

## Automount et clés SSH

- **Automount** : cartes stockées dans FreeIPA (`ipa automountlocation-add`, `automountmap-add`) — dossiers personnels sur NFS avec Kerberos (voir [[02-nfs/04-nfsv4-kerberos-idmap|NFS et Kerberos]]).
- **Clés SSH** : clés publiques des utilisateurs (`sshpubkey`) et des hôtes publiées dans l'annuaire ; SSSD les fournit à `sshd` (`AuthorizedKeysCommand`) et aux clients (`known_hosts` automatique).

## Délégation des droits

```bash
ipa role-add "Gestion des comptes réseau"
ipa role-add-privilege "Gestion des comptes réseau" --privileges="User Administrators"
ipa role-add-member "Gestion des comptes réseau" --groups=responsables-reseau
```

Le **RBAC** de FreeIPA évite de distribuer le compte `admin`.
