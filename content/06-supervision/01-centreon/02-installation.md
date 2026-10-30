---
title: Installation du serveur central
description: Dimensionnement, prérequis, installation de Centreon sur AlmaLinux/RHEL 9 et Debian 12 par paquets, sécurisation de MariaDB, assistant d'installation web, démarrage des services, HTTPS, pare-feu et premières vérifications.
tags: [centreon, installation, almalinux, rhel, debian, mariadb, assistant]
icon: download
---

> [!NOTE]
> Les commandes ci-dessous utilisent la version **24.10** comme exemple. Remplacez-la par la version souhaitée (25.04, 25.10…) et vérifiez la version de PHP et de MariaDB exigée dans la documentation officielle (*docs.centreon.com → Installation*), qui évolue d'une version à l'autre.

## Dimensionnement indicatif

| Services supervisés | Central (CPU / RAM / disque) | Collecteurs |
| --- | --- | --- |
| < 500 | 2 vCPU / 4 Go / 40 Go + 20 Go données | Aucun |
| 500 – 2 000 | 4 vCPU / 8 Go / 80 Go données | Optionnel |
| 2 000 – 10 000 | 4-8 vCPU / 16 Go / 150 Go+ données | 1 collecteur par tranche de ~5 000 services |
| > 10 000 | Base déportée, 8+ vCPU / 32 Go | Plusieurs collecteurs |

Partitionnement LVM recommandé : `/var/lib/mysql` (base), `/var/lib/centreon` (RRD), `/var/log`, `/var/cache/centreon/backup` sur des volumes séparés pour éviter qu'un volume plein ne bloque tout.

## Prérequis système

- Serveur dédié, IP fixe, nom DNS, **heure synchronisée** (chrony).
- SELinux : Centreon recommande de le passer en mode **permissif** ou de le désactiver sur RHEL/Alma (voir la documentation de la version pour les politiques fournies).
- Accès Internet (ou miroir local) vers `packages.centreon.com` et les dépôts de la distribution.

```bash
sudo hostnamectl set-hostname centreon-central
sudo timedatectl set-timezone Europe/Paris
sudo dnf install -y chrony && sudo systemctl enable --now chronyd
sudo setenforce 0 && sudo sed -i 's/^SELINUX=.*/SELINUX=permissive/' /etc/selinux/config
```

## AlmaLinux / RHEL / Oracle Linux 9

```bash
# Dépôts nécessaires
sudo dnf install -y dnf-plugins-core
sudo dnf config-manager --set-enabled crb          # RHEL : subscription-manager repos --enable codeready-builder-for-rhel-9-x86_64-rpms
sudo dnf install -y epel-release

# PHP (version exigée par la version de Centreon, ex. 8.2)
sudo dnf module reset php -y
sudo dnf module install php:8.2 -y

# MariaDB (dépôt officiel MariaDB, version supportée par Centreon)
curl -LsS https://r.mariadb.com/downloads/mariadb_repo_setup | sudo bash -s -- --os-type=rhel --skip-check-installed --os-version=9 --mariadb-server-version="mariadb-10.11"

# Dépôt Centreon
sudo dnf config-manager --add-repo https://packages.centreon.com/rpm-standard/24.10/el9/centreon-24.10.repo
sudo dnf clean all --enablerepo=*
sudo dnf update -y

# Central avec base locale
sudo dnf install -y centreon centreon-mariadb
sudo systemctl daemon-reload
sudo systemctl restart mariadb
```

## Debian 12

```bash
sudo apt update && sudo apt install -y lsb-release ca-certificates apt-transport-https software-properties-common wget gnupg2 curl

# PHP (dépôt Sury)
echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/sury-php.list
wget -O- https://packages.sury.org/php/apt.gpg | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/php.gpg > /dev/null

# MariaDB
curl -LsS https://r.mariadb.com/downloads/mariadb_repo_setup | sudo bash -s -- --os-type=debian --os-version=12 --mariadb-server-version="mariadb-10.11"

# Centreon
echo "deb https://packages.centreon.com/apt-standard-24.10-stable/ $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/centreon.list
echo "deb https://packages.centreon.com/apt-plugins-stable/ $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/centreon-plugins.list
wget -O- https://apt-key.centreon.com | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/centreon.gpg > /dev/null
sudo apt update
sudo apt install -y centreon centreon-mariadb
sudo systemctl daemon-reload
sudo systemctl restart mariadb
```

## Base de données déportée (option)

Sur le serveur de base : `dnf install centreon-database` (paquet qui applique les réglages MariaDB recommandés), puis créer un utilisateur pouvant se connecter depuis le central :

```sql
CREATE USER 'dbadmin'@'<IP_CENTRAL>' IDENTIFIED BY '<motdepasse>';
GRANT ALL PRIVILEGES ON *.* TO 'dbadmin'@'<IP_CENTRAL>' WITH GRANT OPTION;
```

Sur le central, installer `centreon-central` (sans `centreon-mariadb`) et indiquer l'adresse de la base pendant l'assistant. Une fois l'installation terminée, l'utilisateur `dbadmin` peut être supprimé.

## Fuseau horaire PHP et sécurisation de MariaDB

```bash
# RHEL/Alma
echo "date.timezone = Europe/Paris" | sudo tee /etc/php.d/50-centreon.ini
sudo systemctl restart php-fpm
# Debian : /etc/php/8.2/mods-available/centreon.ini puis restart php8.2-fpm

sudo mariadb-secure-installation      # définir le mot de passe root, supprimer les comptes anonymes et la base test
```

> [!IMPORTANT]
> Pendant `mariadb-secure-installation`, répondez **non** à *Switch to unix_socket authentication* : l'assistant web de Centreon doit pouvoir se connecter en tant que `root` avec un mot de passe.

## Démarrage automatique des services

```bash
# RHEL/Alma
sudo systemctl enable php-fpm httpd mariadb centreon cbd centengine gorgoned snmptrapd centreontrapd snmpd
sudo systemctl start php-fpm httpd snmpd snmptrapd
# Debian
sudo systemctl enable php8.2-fpm apache2 mariadb centreon cbd centengine gorgoned snmptrapd centreontrapd snmpd
sudo systemctl start php8.2-fpm apache2 snmpd snmptrapd
```

## Pare-feu

```bash
sudo firewall-cmd --permanent --add-service=http --add-service=https
sudo firewall-cmd --permanent --add-port=5669/tcp        # Broker (collecteurs → central)
sudo firewall-cmd --permanent --add-port=162/udp         # traps SNMP
sudo firewall-cmd --reload
```

## Assistant d'installation web

Ouvrir `http://<ip_du_serveur>/centreon` :

| Étape | Contenu |
| --- | --- |
| 1. Bienvenue | |
| 2. Vérification des dépendances | Modules PHP, timezone : tout doit être **OK** |
| 3. Moteur de supervision | Chemins de Centreon Engine (valeurs par défaut) |
| 4. Module Broker | Chemins de Centreon Broker (valeurs par défaut) |
| 5. Compte administrateur | Login `admin`, mot de passe fort, e-mail |
| 6. Base de données | Hôte (`localhost` ou IP), port, **mot de passe root**, noms des bases (`centreon`, `centreon_storage`), utilisateur `centreon` + mot de passe |
| 7. Installation | Création des bases et de la configuration |
| 8. Modules | Installation des modules et widgets |
| 9. Fin | |

Puis :

```bash
sudo systemctl restart cbd centengine gorgoned
```

Connexion avec `admin`, puis **Configuration → Collecteurs → Collecteurs** → sélectionner *Central* → **Exporter la configuration** (cocher *Générer*, *Lancer le débogage*, *Déplacer les fichiers*, *Redémarrer*). Le collecteur central doit apparaître **en cours d'exécution** (vert).

## Activer HTTPS

```bash
sudo dnf install -y mod_ssl                    # Debian : a2enmod ssl
sudo cp centreon.crt /etc/pki/tls/certs/ && sudo cp centreon.key /etc/pki/tls/private/
```

Dans `/etc/httpd/conf.d/10-centreon.conf` (Debian : `/etc/apache2/sites-available/centreon.conf`), ajouter un `VirtualHost *:443` avec `SSLEngine on`, les chemins du certificat, `SSLProtocol all -SSLv3 -TLSv1 -TLSv1.1`, et une redirection 80 → 443. Le modèle complet est fourni dans la documentation *« Sécuriser l'interface web »*. Redémarrer `httpd`/`apache2`, puis dans **Administration → Paramètres → Centreon UI** vérifier l'URL.

> [!TIP]
> Profitez-en pour : désactiver la signature du serveur (`ServerTokens Prod`, `ServerSignature Off`), ajouter les en-têtes de sécurité, et changer le mot de passe de l'utilisateur `centreon` du système si nécessaire.

## Vérifications

```bash
systemctl status centengine cbd gorgoned --no-pager
ss -tlnp | grep -E '5669|5556|443|3306'
tail -n 50 /var/log/centreon-engine/centengine.log
tail -n 50 /var/log/centreon-broker/central-broker-master.log
tail -n 50 /var/log/centreon-gorgone/gorgoned.log
curl -s http://127.0.0.1:8085/api/internal/constatus | python3 -m json.tool      # état des connexions Gorgone
```

## Étapes suivantes

1. Installer les **connecteurs de supervision** de base (*Base Generic*, *Linux SNMP*, *Cisco Standard*…).
2. Superviser le serveur Centreon lui-même (hôte *Central* : CPU, mémoire, disques, processus Centreon).
3. Configurer le relais **SMTP** pour les notifications ([[06-notifications-escalades]]).
4. Activer la **sauvegarde** ([[10-maintenance-sauvegarde-ha]]).
5. Créer des comptes nominatifs et des **ACL** pour les équipes (Administration → ACL), connecter l'**authentification LDAP/AD** (*Administration → Authentification → LDAP*) ou **OpenID Connect / SAML**.
