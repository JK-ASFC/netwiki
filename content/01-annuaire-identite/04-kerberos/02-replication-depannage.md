---
title: Réplication, approbations, durcissement et dépannage
description: Répliquer un KDC MIT (kprop/kpropd, propagation incrémentale iprop), approbation inter-royaumes avec Active Directory, politiques de mots de passe, durcissement (chiffrements AES, pré-authentification, protection de la base), sauvegarde, journaux et erreurs Kerberos fréquentes (décalage d'horloge, principal introuvable, numéro de version de clé, chiffrement).
tags: [kerberos, kprop, iprop, approbation, active directory, durcissement, dépannage]
icon: bug
---

## Réplication des KDC

| Mode | Principe |
| --- | --- |
| **kprop / kpropd** | Copie complète périodique de la base du KDC primaire vers les secondaires (tâche planifiée) |
| **iprop** | Propagation incrémentale quasi immédiate des modifications |

```ini kdc.conf (primaire et secondaires, ajout dans le royaume)
iprop_enable = true
iprop_port = 754
```

```text /etc/krb5kdc/kpropd.acl (sur les secondaires)
host/kdc1.exemple.lan@EXEMPLE.LAN
host/kdc2.exemple.lan@EXEMPLE.LAN
```

```bash
# Primaire : principaux des hôtes et keytabs, puis première propagation complète
sudo kdb5_util dump /var/lib/krb5kdc/replica_datatrans
sudo kprop -f /var/lib/krb5kdc/replica_datatrans kdc2.exemple.lan
# Secondaire : service kpropd (krb5-kpropd), fichier stash copié de façon sécurisée
```

Les secondaires servent l'authentification (lecture) ; l'administration (kadmind) reste sur le primaire.

## Approbation avec Active Directory

Permet aux comptes AD d'accéder aux services du royaume MIT (ou l'inverse) :

```bash
# Côté MIT : principal partagé (même mot de passe des deux côtés)
sudo kadmin.local -q "addprinc -e aes256-cts-hmac-sha1-96:normal krbtgt/EXEMPLE.LAN@CORP.EXEMPLE.FR"
```

```powershell
# Côté AD : approbation de royaume (unidirectionnelle ou bidirectionnelle)
netdom trust EXEMPLE.LAN /Domain:corp.exemple.fr /add /realm /passwordt:MotDePasseApprobation
ksetup /setenctypeattr EXEMPLE.LAN AES256-CTS-HMAC-SHA1-96
```

```ini /etc/krb5.conf (ajouts)
[realms]
    CORP.EXEMPLE.FR = {
        kdc = dc1.corp.exemple.fr
    }
[domain_realm]
    .corp.exemple.fr = CORP.EXEMPLE.FR
```

Pour un parc Linux important avec AD, l'approbation **FreeIPA ↔ AD** est plus complète (identités, HBAC, sudo) : voir [[03-freeipa/03-approbation-ad-exploitation|FreeIPA]].

## Politiques de mots de passe

```bash
sudo kadmin.local -q "addpol -minlength 14 -minclasses 3 -history 10 -maxlife '365 days' -maxfailure 6 -lockoutduration '10 min' standard"
sudo kadmin.local -q "modprinc -policy standard alice"
```

## Durcissement

- [ ] Chiffrements **AES** uniquement (`supported_enctypes`, `permitted_enctypes` côté clients) ; pas de DES ni RC4
- [ ] **Pré-authentification** exigée (`+requires_preauth`, défaut pour les nouveaux principaux) contre l'attaque hors ligne des mots de passe
- [ ] KDC dédiés, accès réseau limité (88/464 depuis les clients ; 749 depuis l'administration)
- [ ] Fichier `stash` et base protégés ; sauvegardes chiffrées
- [ ] Principaux `*/admin` distincts des comptes du quotidien

## Sauvegarde

```bash
sudo kdb5_util dump /srv/sauvegardes/kdc-$(date +%F).dump      # + fichier stash et kdc.conf, kadm5.acl
# Restauration : kdb5_util load /srv/sauvegardes/kdc-2025-10-29.dump
```

## Journaux

```ini kdc.conf (section [logging])
[logging]
    kdc = FILE:/var/log/krb5kdc.log
    admin_server = FILE:/var/log/kadmin.log
    default = SYSLOG:INFO:DAEMON
```

```bash
KRB5_TRACE=/dev/stderr kinit alice          # trace détaillée côté client
```

## Erreurs fréquentes

| Message | Cause | Solution |
| --- | --- | --- |
| `Clock skew too great` (`KRB5KRB_AP_ERR_SKEW`) | Horloges décalées de plus de 5 minutes | NTP partout |
| `Server not found in Kerberos database` | Principal du service absent, nom DNS utilisé différent (alias CNAME, résolution inverse) | Créer le principal correspondant au nom réellement utilisé, `rdns = false` |
| `Preauthentication failed` | Mot de passe erroné | Vérifier le mot de passe ; compte verrouillé ? |
| `Key table entry not found` / `Wrong principal in request` | Keytab ne contenant pas le principal demandé, nom d'hôte | `klist -k`, nom d'hôte du service |
| `Decrypt integrity check failed` / `kvno` incorrect | Clé changée (`ktadd` relancé) sans mettre à jour la keytab du service | Régénérer la keytab sur le service |
| `KDC has no support for encryption type` | Chiffrement non commun (RC4 vs AES) | Aligner `supported_enctypes` et les clés des principaux |
| `Cannot contact any KDC for realm` | DNS SRV, pare-feu 88 | `dig SRV _kerberos._udp.exemple.lan`, `krb5.conf` |
