---
title: Installation et arborescence
description: Installer FreeRADIUS 3.2 sur Debian/Ubuntu et RHEL/Rocky/Alma (paquets distribution ou dépôts NetworkRADIUS), modules optionnels, arborescence de configuration, mode debug, pare-feu et premier test radtest.
tags: [freeradius, installation, debian, rhel, raddb]
icon: download
---

## Debian / Ubuntu

```bash
sudo apt update
sudo apt install freeradius freeradius-utils
# Modules selon les besoins
sudo apt install freeradius-mysql freeradius-postgresql freeradius-ldap freeradius-krb5 freeradius-rest freeradius-redis freeradius-python3
freeradius -v | head -1
systemctl status freeradius
```

## RHEL / Rocky Linux / AlmaLinux

```bash
sudo dnf install freeradius freeradius-utils
sudo dnf install freeradius-mysql freeradius-postgresql freeradius-ldap freeradius-krb5 freeradius-rest
sudo systemctl enable --now radiusd
sudo firewall-cmd --permanent --add-service=radius     # 1812-1813/udp
sudo firewall-cmd --reload
```

## Paquets officiels NetworkRADIUS (dernière 3.2.x)

Les distributions livrent parfois une version ancienne. NetworkRADIUS (les mainteneurs) publie des dépôts à jour :

```bash
# Debian 12 (adapter le nom de version)
sudo install -d -o root -g root -m 0755 /etc/apt/keyrings
curl -s 'https://packages.networkradius.com/pgp/packages%40networkradius.com' | sudo tee /etc/apt/keyrings/packages.networkradius.com.asc > /dev/null
echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/packages.networkradius.com.asc] http://packages.networkradius.com/freeradius-3.2/debian/bookworm bookworm main" | sudo tee /etc/apt/sources.list.d/networkradius.list
sudo apt update && sudo apt install freeradius
```

> [!TIP]
> Vérifiez la version avant un déploiement 802.1X : les versions **≥ 3.2.5** intègrent les protections contre **BlastRADIUS** (CVE-2024-3596). Voir [[11-securite-depannage]].

## Arborescence

| Debian / Ubuntu | RHEL | Contenu |
| --- | --- | --- |
| `/etc/freeradius/3.0/` | `/etc/raddb/` | Racine de configuration (`${confdir}` / `${raddbdir}`) |
| `radiusd.conf` | idem | Configuration principale (threads, journaux, sécurité) |
| `clients.conf` | idem | **Les NAS autorisés** et leurs secrets |
| `users` → `mods-config/files/authorize` | idem | Utilisateurs « fichier plat » |
| `sites-available/` / `sites-enabled/` | idem | **Serveurs virtuels** (`default`, `inner-tunnel`, `status`, `tls`…) |
| `mods-available/` / `mods-enabled/` | idem | **Modules** (eap, sql, ldap, mschap, files…) — activés par lien symbolique |
| `mods-config/` | idem | Fichiers de données des modules (requêtes SQL, users, attrs…) |
| `policy.d/` | idem | Politiques unlang réutilisables (canonicalisation, filtres) |
| `certs/` | idem | Certificats EAP (générés à l'installation pour test) |
| `proxy.conf` | idem | Realms et serveurs distants |
| `dictionary` | idem | Dictionnaire local (attributs personnalisés) |
| `/usr/share/freeradius/` | idem | Dictionnaires constructeurs |
| `/var/log/freeradius/` | `/var/log/radius/` | `radius.log`, `radacct/` (detail) |
| Utilisateur `freerad` | Utilisateur `radiusd` | Compte du service |
| Service `freeradius` | Service `radiusd` | systemd |

> [!NOTE]
> Dans la suite du wiki, les chemins sont donnés relatifs à la racine de configuration (`mods-available/eap`, `sites-enabled/default`…), et la commande `radiusd -X` désigne `freeradius -X` sous Debian.

## Activer ou désactiver un module / un site

```bash
cd /etc/freeradius/3.0
sudo ln -s ../mods-available/sql mods-enabled/sql          # activer
sudo rm mods-enabled/sql                                   # désactiver
sudo ln -s ../sites-available/status sites-enabled/status
# Les fichiers doivent appartenir au groupe du service
sudo chgrp -h freerad mods-enabled/sql
```

## Mode debug : l'outil n°1

```bash
sudo systemctl stop freeradius
sudo freeradius -X          # RHEL : sudo radiusd -X
```

Le serveur démarre au premier plan et affiche **toute** la configuration lue puis chaque paquet traité, module par module. En cas d'erreur de configuration, le message exact et la ligne apparaissent juste avant l'arrêt. Terminez par `Ctrl+C` puis redémarrez le service.

> [!IMPORTANT]
> Règle d'or de FreeRADIUS : **toute** question de dépannage commence par la sortie de `radiusd -X`. Le fichier `radius.log` ne contient que des résumés.

Vérifier la configuration sans démarrer :

```bash
sudo freeradius -XC          # charge la configuration, affiche les erreurs, s'arrête
```

## Premier test

Le fichier `clients.conf` livré déclare déjà `localhost` avec le secret `testing123`. Ajoutez un utilisateur de test en **tête** de `mods-config/files/authorize` :

```radius mods-config/files/authorize
bob     Cleartext-Password := "MotDePasseTest"
        Reply-Message := "Bonjour %{User-Name}"
```

```bash
sudo freeradius -X &         # ou dans un autre terminal
radtest bob MotDePasseTest 127.0.0.1 0 testing123
```

```text
Sent Access-Request Id 213 from 0.0.0.0:41725 to 127.0.0.1:1812 length 73
        User-Name = "bob"
        User-Password = "MotDePasseTest"
        ...
Received Access-Accept Id 213 from 127.0.0.1:1812 to 127.0.0.1:41725 length 39
        Reply-Message = "Bonjour bob"
```

## Pare-feu

```bash
# nftables : n'autoriser que les NAS connus
nft add rule inet filter input ip saddr { 10.0.1.0/24, 10.0.80.0/24 } udp dport { 1812, 1813 } accept
# UFW
sudo ufw allow from 10.0.1.0/24 to any port 1812:1813 proto udp
```

## Haute disponibilité

Les NAS supportent tous **plusieurs serveurs RADIUS** : déployez au moins **deux** FreeRADIUS avec une configuration identique (Git + Ansible), une base SQL répliquée (Galera, réplication PostgreSQL) si utilisée, et déclarez-les tous les deux sur les équipements avec un mécanisme de détection de panne (`deadtime`, `dead-criteria`).
