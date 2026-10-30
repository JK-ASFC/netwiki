---
title: Installation, configuration et utilisation
description: AIDE (Advanced Intrusion Detection Environment) — contrôle d'intégrité des fichiers par base d'empreintes, installation sous Debian/Ubuntu et RHEL, aide.conf (groupes d'attributs, règles, exclusions), initialisation et protection de la base, vérifications planifiées et rapports, mise à jour après changement légitime, intégration à la supervision et alternatives.
tags: [aide, intégrité, fim, hids, empreintes, sécurité, conformité]
icon: info
---

**AIDE** construit une **base de référence** des fichiers sensibles (empreintes SHA-512, droits, propriétaires, taille, dates, attributs étendus, ACL, contexte SELinux) puis compare régulièrement le système à cette base : toute modification, ajout ou suppression inattendue est signalée. C'est une exigence classique des référentiels (PCI DSS, CIS, ANSSI) pour détecter la compromission d'un serveur.

## Installation

```bash
sudo apt install aide aide-common        # Debian / Ubuntu
sudo dnf install aide                    # RHEL / Rocky / Alma
```

| Distribution | Configuration | Base |
| --- | --- | --- |
| Debian / Ubuntu | `/etc/aide/aide.conf` + `/etc/aide/aide.conf.d/` | `/var/lib/aide/aide.db` |
| RHEL | `/etc/aide.conf` | `/var/lib/aide/aide.db.gz` |

## Configuration

```aide /etc/aide/aide.conf.d/90_local (extrait)
# Groupes d'attributs
CONTENU = sha512+ftype
PERMS   = p+u+g+acl+selinux+xattrs
COMPLET = CONTENU+PERMS+i+n+s+m+c

# Fichiers surveillés
/etc            COMPLET
/usr/bin        COMPLET
/usr/sbin       COMPLET
/usr/lib        COMPLET
/boot           COMPLET
/root/.ssh      COMPLET
/var/www/html   CONTENU+PERMS

# Fichiers qui changent normalement : seulement les droits
/var/log        PERMS

# Exclusions
!/etc/mtab
!/etc/adjtime
!/var/lib/aide
!/var/log/journal
```

| Attribut | Signification |
| --- | --- |
| `p`, `u`, `g` | Droits, propriétaire, groupe |
| `i`, `n`, `s` | Inode, nombre de liens, taille |
| `m`, `c` | Dates de modification et de changement |
| `sha512`, `sha256` | Empreintes du contenu |
| `acl`, `xattrs`, `selinux` | ACL, attributs étendus, contexte SELinux |
| `!chemin` | Exclusion ; `=chemin` : le répertoire seul, sans son contenu |

## Initialiser et protéger la base

```bash
# Debian / Ubuntu
sudo aideinit                                      # crée /var/lib/aide/aide.db.new puis la copie en aide.db
# RHEL
sudo aide --init && sudo mv /var/lib/aide/aide.db.new.gz /var/lib/aide/aide.db.gz
```

> [!IMPORTANT]
> Un attaquant devenu root peut **régénérer** la base. Copiez la base de référence (et la configuration) **hors du serveur** ou sur un support en lecture seule après chaque initialisation/mise à jour, et comparez leurs empreintes avant de faire confiance à un rapport.

## Vérifier

```bash
sudo aide --check                     # RHEL ; Debian : sudo aide -c /etc/aide/aide.conf --check
echo $?                               # 0 : aucun changement ; autre valeur : différences ou erreur
```

Debian installe une tâche quotidienne (`/etc/cron.daily/dailyaidecheck`, ou minuteur `dailyaidecheck.timer`) qui envoie le rapport par courriel (`MAILTO` dans `/etc/default/aide`). Sous RHEL, créez un minuteur :

```ini /etc/systemd/system/aide-check.service
[Unit]
Description=Vérification d'intégrité AIDE

[Service]
Type=oneshot
ExecStart=/bin/sh -c '/usr/sbin/aide --check > /var/log/aide/aide-$(date +%%F).log 2>&1 || logger -t aide -p authpriv.warning "AIDE : différences détectées"'
```

```ini /etc/systemd/system/aide-check.timer
[Timer]
OnCalendar=*-*-* 04:30:00
Persistent=true

[Install]
WantedBy=timers.target
```

## Après un changement légitime

```bash
sudo apt upgrade                       # ou modification de configuration validée
sudo aide --update                     # génère aide.db.new avec l'état actuel
sudo mv /var/lib/aide/aide.db.new /var/lib/aide/aide.db      # (.gz sous RHEL)
# puis recopier la nouvelle base hors du serveur
```

Intégrez cette étape aux procédures de changement (mises à jour, déploiements) pour que les rapports ne soient pas noyés de faux positifs.

## Intégration et alternatives

| Besoin | Solution |
| --- | --- |
| Alerte centralisée | Message syslog en cas de différence (voir ci-dessus) → SIEM |
| Surveillance en temps réel, multi-serveurs | Module FIM de [[05-wazuh/01-presentation-installation\|Wazuh]] |
| Autres outils | Tripwire (Open Source / Enterprise), Samhain, OSSEC |

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Rapport immense après chaque mise à jour | Base non mise à jour après les changements | `aide --update` dans la procédure de mise à jour |
| `Couldn't open file /var/lib/aide/aide.db` | Base non initialisée ou mal nommée | `aideinit` / renommer `aide.db.new` |
| Vérification très longue | Répertoires volumineux surveillés (données, journaux) | Exclure ou réduire les attributs (`PERMS`) |
| Faux positifs sur fichiers qui changent toujours | Fichiers d'état | Exclusions `!` |
