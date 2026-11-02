---
title: Présentation, installation et exploitation
description: Firebird — base de données relationnelle libre (IPL/IDPL) issue d'InterBase, serveur ou embarquée : versions 3, 4 et 5, architectures SuperServer, Classic et SuperClassic, installation Linux (paquets ou archive officielle install.sh), Windows (installeur, service), macOS, Docker, port 3050, firebird.conf et databases.conf (alias), compte SYSDBA et utilisateurs SQL, isql, sauvegarde gbak et nbackup, gfix (sweep, arrêt, réparation), gstat, sécurité (WireCrypt, AuthServer, pare-feu), outils graphiques (FlameRobin, DBeaver) et applications métier qui l'utilisent.
tags: [firebird, sql, base de données, gbak, isql, interbase]
icon: info
---

**Firebird** est une base SQL robuste et légère, très présente dans les **logiciels métier** (comptabilité, gestion commerciale, santé, ERP de PME) où elle tourne souvent sans administrateur dédié. Elle fonctionne en **serveur** (port **3050**) ou **embarquée** dans une application (une simple bibliothèque).

| Version | Remarques |
| --- | --- |
| **5.0** | Courante : requêtes parallèles (sauvegarde, sweep, index), plans améliorés |
| 4.0 | Encore répandue : fuseaux horaires, `INT128`, réplication intégrée |
| 3.0 | Ancienne mais très présente dans les applications (format ODS 12) |
| 2.5 et avant | Fin de vie : migrer par sauvegarde/restauration |

## Installation

```bash
# Linux — archive officielle (toutes distributions)
tar xzf Firebird-5.0.*-linux-x64.tar.gz && cd Firebird-5.0.*-linux-x64
sudo ./install.sh                        # demande le mot de passe SYSDBA ; installe dans /opt/firebird, service firebird
# Paquets de la distribution (version selon la distribution)
sudo apt install firebird3.0-server       # Debian/Ubuntu (ou firebird4.0-server selon la version)
```

| Système | Méthode |
| --- | --- |
| Windows | Installeur officiel (service « Firebird Server », choix SuperServer) |
| macOS | Paquet `.pkg` officiel |
| Docker | Image `firebirdsql/firebird` (variables `FIREBIRD_ROOT_PASSWORD`, `FIREBIRD_DATABASE`) |

Choisissez **SuperServer** (un processus, cache partagé) sauf exigence particulière de l'éditeur de l'application.

## Configuration

```ini
# /opt/firebird/databases.conf — alias
compta = /srv/firebird/compta.fdb
# /opt/firebird/firebird.conf — extraits
RemoteBindAddress = 10.0.20.40
DefaultDbCachePages = 50K
WireCrypt = Required          ; chiffrement du protocole (clients Firebird 3+)
AuthServer = Srp256
```

```sql
-- isql -user SYSDBA -password **** localhost:compta
CREATE USER app_compta PASSWORD 'MdpApp2026';
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE ECRITURES TO USER app_compta;
SHOW TABLES;
```

## Sauvegarde et maintenance

```bash
gbak -b -v -user SYSDBA -password "$MDP" localhost:compta /sauvegardes/compta-$(date +%F).fbk   # sauvegarde logique (à chaud)
gbak -c -v -user SYSDBA -password "$MDP" /sauvegardes/compta.fbk localhost:/srv/firebird/compta-test.fdb   # restauration
nbackup -U SYSDBA -P "$MDP" -B 0 compta /sauvegardes/compta.nbk0     # sauvegarde physique incrémentale (niveau 0, 1…)
gfix -sweep -user SYSDBA -password "$MDP" localhost:compta            # nettoyage des versions obsolètes
gfix -shut full -force 60 -user SYSDBA -password "$MDP" localhost:compta   # arrêt de la base pour maintenance
gfix -online -user SYSDBA -password "$MDP" localhost:compta
gstat -h localhost:compta                                             # en-tête : transactions, ODS
```

> [!TIP]
> Une sauvegarde **gbak** suivie d'une restauration de test est le seul moyen de vérifier qu'une base est saine ; c'est aussi la méthode de migration entre versions majeures et la façon de « compacter » une base.

Ne copiez jamais le fichier `.fdb` d'une base ouverte : la copie serait incohérente. Outils graphiques : FlameRobin (libre) et [[04-developpement/07-dbeaver|DBeaver]].

Commandes : [[90-aide-memoire|aide-mémoire]].
