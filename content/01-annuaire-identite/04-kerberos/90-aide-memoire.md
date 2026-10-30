---
title: Kerberos (MIT) — aide-mémoire des commandes
description: Commandes Kerberos MIT avec exemples — création du royaume (kdb5_util), administration (kadmin, kadmin.local) des principaux, politiques et keytabs, tickets côté client (kinit, klist, kdestroy, kvno, kpasswd), propagation vers les KDC secondaires (kprop, kpropd), tests et diagnostic (KRB5_TRACE), équivalents Windows (klist, setspn, ktpass).
tags: [aide-mémoire, kerberos, kadmin, kinit, keytab, krb5]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Kerberos]]. Royaume d'exemple : `EXEMPLE.FR`.

## Royaume et service

```bash
sudo kdb5_util create -s -r EXEMPLE.FR          # créer la base et le fichier de stash
sudo systemctl enable --now krb5-kdc krb5-admin-server     # Debian (RHEL : krb5kdc kadmin)
sudo kdb5_util dump /var/backups/krb5-$(date +%F).dump     # sauvegarde de la base
sudo kdb5_util load /var/backups/krb5-2026-10-29.dump      # restauration
```

## Administration (kadmin.local sur le KDC, kadmin à distance)

```bash
sudo kadmin.local -q "addprinc admin/admin"
sudo kadmin.local -q "addprinc amartin"
sudo kadmin.local -q "addprinc -randkey host/srv-web01.exemple.fr"
sudo kadmin.local -q "addprinc -randkey HTTP/srv-web01.exemple.fr"
sudo kadmin.local -q "ktadd -k /etc/krb5.keytab host/srv-web01.exemple.fr"
sudo kadmin.local -q "listprincs"
sudo kadmin.local -q "getprinc amartin"
sudo kadmin.local -q "cpw amartin"                       # changer le mot de passe
sudo kadmin.local -q "modprinc -maxlife 10h -maxrenewlife 7d amartin"
sudo kadmin.local -q "modprinc -unlock amartin"          # après trop d'échecs
sudo kadmin.local -q "delprinc -force ancien"
sudo kadmin.local -q "addpol -minlength 12 -minclasses 3 -maxfailure 10 -lockoutduration 15m standard"
sudo kadmin.local -q "modprinc -policy standard amartin"
kadmin -p admin/admin -q "listprincs host/*"              # depuis un poste d'administration
```

## Keytabs

```bash
klist -k -t -e /etc/krb5.keytab                           # contenu (principaux, kvno, chiffrements)
kinit -k -t /etc/krb5.keytab host/srv-web01.exemple.fr    # tester la keytab
ktutil                                                    # fusionner, extraire (rkt, wkt, list)
```

## Côté client

```bash
kinit amartin                 # obtenir un TGT
kinit -r 7d amartin           # TGT renouvelable
kinit -R                      # renouveler
klist                         # tickets en cache
klist -e                      # avec les types de chiffrement
kvno HTTP/srv-web01.exemple.fr    # obtenir un ticket de service (vérifie le SPN et le kvno)
kpasswd                       # changer son mot de passe
kdestroy                      # détruire le cache
KRB5_TRACE=/dev/stdout kinit amartin      # trace détaillée (DNS, KDC contactés, erreurs)
```

## Réplication vers un KDC secondaire

```bash
# Sur le principal
sudo kdb5_util dump /var/lib/krb5kdc/replica_datatrans
sudo kprop -f /var/lib/krb5kdc/replica_datatrans kdc2.exemple.fr
# Sur le secondaire : kpropd en écoute (TCP 754) et fichier kpropd.acl listant host/kdc1.exemple.fr@EXEMPLE.FR
```

## Windows

```powershell
klist                                  # tickets de la session
klist purge                            # vider (puis reconnexion ou gpupdate)
klist get HTTP/srv-web01.corp.exemple.fr
setspn -L svc-web                      # SPN d'un compte
setspn -S HTTP/intranet.corp.exemple.fr CORP\svc-web     # ajouter en vérifiant les doublons
setspn -X                              # doublons dans la forêt
ktpass -princ HTTP/srv-linux.corp.exemple.fr@CORP.EXEMPLE.FR -mapuser CORP\svc-linux -crypto AES256-SHA1 -ptype KRB5_NT_PRINCIPAL -pass * -out C:\Temp\srv-linux.keytab
```

## Erreurs courantes

| Message | Cause |
| --- | --- |
| `Clock skew too great` | Horloges décalées de plus de 5 min (NTP) |
| `Server not found in Kerberos database` | SPN absent ou mal orthographié (nom DNS vs alias) |
| `Preauthentication failed` | Mot de passe faux |
| `Key version number for principal in key table is incorrect` | Keytab obsolète (mot de passe du compte changé) : régénérer |
| `Cannot find KDC for realm` | `krb5.conf` ou enregistrements DNS SRV `_kerberos._udp` manquants |
