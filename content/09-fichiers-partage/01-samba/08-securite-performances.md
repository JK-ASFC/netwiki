---
title: Sécurité et performances
description: Durcir Samba (SMB1 désactivé, signature obligatoire, chiffrement SMB3, NTLMv2 seul, restrictions d'hôtes et d'interfaces, accès anonyme), auditer les accès (vfs_full_audit), filtrer antivirus et rançongiciels, et optimiser les performances (multicanal, E/S asynchrones, io_uring, sendfile, grands répertoires).
tags: [samba, sécurité, signature, chiffrement, smb1, audit, full_audit, performances, multicanal]
icon: shield-check
---

## Configuration durcie

```smb /etc/samba/smb.conf (extrait [global])
[global]
   # Protocole
   server min protocol = SMB2_10          # SMB3_00 si tous les clients sont ≥ Windows 8 / 2012
   client min protocol = SMB2_10

   # Intégrité et confidentialité
   server signing = mandatory
   server smb encrypt = desired           # « required » pour imposer le chiffrement à tout le serveur

   # Authentification
   ntlm auth = ntlmv2-only                # « disabled » pour n'accepter que Kerberos (environnement AD)
   lanman auth = no
   restrict anonymous = 2
   map to guest = never

   # Exposition réseau
   interfaces = lo ens192
   bind interfaces only = yes
   hosts allow = 10.0.0.0/8 127.0.0.1
   hosts deny = 0.0.0.0/0
   disable netbios = yes
   smb ports = 445

   # Divers
   unix extensions = no                   # sinon possibilité de suivre des liens symboliques hors partage
   follow symlinks = yes
   wide links = no
```

| Mesure | Effet |
| --- | --- |
| SMB1 désactivé | Supprime une surface d'attaque majeure (par défaut depuis Samba 4.11) |
| **Signature obligatoire** | Bloque le relais NTLM et l'altération ; exigée par Windows 11 24H2 |
| Chiffrement SMB3 | Confidentialité sur le réseau (AES-GCM accéléré par AES-NI) |
| NTLMv2 seul / Kerberos seul | Interdit LM, NTLMv1 |
| `hosts allow` | Limite les réseaux clients (ne remplace pas le pare-feu) |
| `wide links = no` | Empêche de sortir du partage par un lien symbolique |

### Chiffrement par partage

```smb
[rh]
   path = /srv/samba/rh
   server smb encrypt = required          # clients sans SMB3 refusés sur ce partage
```

Vérification côté Windows : `Get-SmbConnection | Select ServerName, ShareName, Dialect, Encrypted, Signed`.

## Audit des accès

```smb
[donnees]
   vfs objects = acl_xattr full_audit
   full_audit:prefix = %u|%I|%m|%S
   full_audit:success = connect disconnect mkdirat renameat unlinkat
   full_audit:failure = connect
   full_audit:facility = LOCAL5
   full_audit:priority = NOTICE
```

```text /etc/rsyslog.d/samba-audit.conf
local5.notice    /var/log/samba/audit.log
& stop
```

Les noms d'opérations correspondent aux versions récentes (≥ 4.14 : `mkdirat`, `renameat`, `unlinkat`, `openat`) ; ne journalisez pas `openat`/`pread` sur un partage actif sans prévoir le volume. Centralisez le journal vers un SIEM.

## Antivirus et rançongiciels

| Mesure | Mise en œuvre |
| --- | --- |
| Analyse à l'accès | `vfs_virusfilter` (ClamAV via `clamd`, Sophos, F-Secure) : fichiers infectés bloqués ou mis en quarantaine |
| Extensions interdites | `veto files = /*.locky/*.crypt/*.encrypted/` (liste à maintenir, utile mais contournable) |
| Détection de comportement | Supervision du volume de renommages/écritures via `full_audit` + fail2ban ou SIEM (bannir l'IP source) |
| Instantanés en lecture seule | `shadow_copy2` (voir [[07-fonctions-avancees]]) |
| Moindre privilège | Groupes en lecture seule là où c'est possible |

```smb
[donnees]
   vfs objects = acl_xattr virusfilter
   virusfilter:scanner = clamav
   virusfilter:socket path = /var/run/clamav/clamd.ctl
   virusfilter:infected file action = quarantine
   virusfilter:quarantine directory = /srv/quarantaine
   virusfilter:scan on open = yes
   virusfilter:scan on close = yes
```

## Performances

| Paramètre | Recommandation |
| --- | --- |
| `server multi channel support = yes` | Multicanal SMB3 (défaut depuis 4.15 sous Linux) : plusieurs connexions TCP, cartes multiples |
| `aio read size` / `aio write size` | E/S asynchrones (actives par défaut) |
| `vfs objects = … io_uring` | E/S via io_uring (noyau récent) |
| `use sendfile = yes` | Lecture sans copie mémoire (attention aux clients anciens) |
| `strict sync = no` | Ignore les demandes de vidage du client : plus rapide, risque en cas de coupure |
| `socket options` | Ne plus régler : les valeurs par défaut du noyau sont meilleures |
| Grands répertoires (> 100 000 fichiers) | `case sensitive = yes`, `default case = lower`, `preserve case = no`, `short preserve case = no` (impose des noms en minuscules) |

```bash
# Test de débit depuis un client Linux
dd if=/dev/zero of=/mnt/commun/test.bin bs=1M count=4096 oflag=direct status=progress
```

Côté Windows : `Get-SmbMultichannelConnection`, `Get-SmbClientNetworkInterface` (RSS, vitesse des liens).

## Liste de contrôle

- [ ] SMB1 désactivé, signature obligatoire, chiffrement sur les partages sensibles
- [ ] Pare-feu : 445/TCP depuis les réseaux clients uniquement
- [ ] Pas d'accès invité, pas d'`admin users`
- [ ] Droits par groupes, revue périodique
- [ ] Audit centralisé des suppressions et renommages
- [ ] Instantanés + sauvegarde externe avec ACL (xattr)
- [ ] Mises à jour de sécurité Samba suivies (avis sur samba.org)
