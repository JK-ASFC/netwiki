---
title: "Utiliser Apache sur les systèmes à base de paquets RPM (Redhat / CentOS / Fedora)"
description: "Apache HTTP Server — Utiliser Apache sur les systèmes à base de paquets RPM (Redhat / CentOS / Fedora). Alors que de nombreuses distributions mettent à disposition des paquets Apache httpd supportés par le système d'exploitation sous-jacent, il peut s'avérer nécessaire d'installer et d'utiliser la version de base d'Apache httpd en remplacemen"
tags: [apache, guide]
icon: book-open
---

Alors que de nombreuses distributions mettent à disposition des paquets Apache httpd supportés par le système d'exploitation sous-jacent, il peut s'avérer nécessaire d'installer et d'utiliser la version de base d'Apache httpd en remplacement de la version des paquets.

Bien que le projet Apache httpd ne crée pas actuellement de paquets RPM pour les différentes distributions, il est aisé de construire votre propre paquet RPM à partir du tarball de base d'Apache httpd.

Ce document explique comment construire, installer, configurer et exécuter Apache httpd 2.4 sur les systèmes Unix à base de paquets RPM.

## Création d'un paquet RPM source

Le tarball d'Apache httpd peut être converti en paquet SRPM de la manière suivante :

```
rpmbuild -ts httpd-2.4.x.tar.bz2
```

## Création d'un paquet RPM

Le tarball d'Apache httpd peut être converti en paquet RPM de la manière suivante :

```
rpmbuild -tb httpd-2.4.x.tar.bz2
```

Il sera nécessaire d'installer les paquets "-devel" correspondants avant de construire les RPMs ; à cet effet, la commande `rpmbuild` détecte automatiquement les RPMs requis et en donne la liste sous forme de dépendances manquantes sur votre système. Ces paquets "-devel" ne seront d'ailleurs plus nécessaires une fois la création des RPMs terminée, et pourront alors être supprimés sans risque.

Si tout va bien, les RPMs suivants seront créés :

**httpd-2.4.x-1.i686.rpm**

Le serveur de base et le jeu de modules standards.

**httpd-debuginfo-2.4.x-1.i686.rpm**

Les symboles de débogage pour le serveur et tous les modules.

**httpd-devel-2.4.x-1.i686.rpm**

Les en-têtes et fichiers de développement pour le serveur.

**httpd-manual-2.4.x-1.i686.rpm**

Le manuel du serveur web.

**httpd-tools-2.4.x-1.i686.rpm**

Les utilitaires du serveur web.

**mod\_authnz\_ldap-2.4.x-1.i686.rpm**

Les modules [[12-modules/mod_ldap|mod_ldap]] et [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] avec les dépendances correspondantes sur openldap.

**mod\_lua-2.4.x-1.i686.rpm**

Le module [[12-modules/mod_lua|mod_lua]] avec les dépendances correspondantes sur lua.

**mod\_proxy\_html-2.4.x-1.i686.rpm**

Le module [[12-modules/mod_proxy_html|mod_proxy_html]] avec les dépendances correspondantes sur libxml2.

**mod\_socache\_dc-2.4.x-1.i686.rpm**

Le module [[12-modules/mod_socache_dc|mod_socache_dc]] avec les dépendances correspondantes sur distcache.

**mod\_ssl-2.4.x-1.i686.rpm**

Le module [[12-modules/mod_ssl|mod_ssl]] avec les dépendances correspondantes sur openssl.

## Installation du serveur

Le RPM `httpd` est le seul paquet nécessaire pour obtenir un serveur de base fonctionnel. Vous pouvez l'installer comme suit :

```
rpm -U httpd-2.4.x-1.i686.rpm
```

Le jeu de modules standards est inclus dans le serveur. Les modules qui dépendent de bibliothèques externes sont fournis en tant que paquets RPM séparés et doivent être installés si nécessaire.

## Configuration de l'instance par défaut d'Apache httpd

Les répertoires par défaut sont `/etc/httpd` pour la configuration du serveur, et `/var/log/httpd` pour la journalisation. L'environnement par défaut du serveur web est défini dans le répertoire optionnel `/etc/sysconfig/httpd`.

Démarrez le serveur comme suit :

```
service httpd restart
```

## Configuration d'instances d'Apache httpd supplémentaires sur la même machine

Il est possible d'exécuter simultanément plusieurs instances du serveur Apache httpd sur la même machine. Chaque instance peut posséder sa propre configuration et en fonction de cette dernière, s'exécuter sous un utilisateur différent.

Pour parvenir à ce résultat, on a fait en sorte que le script de démarrage de httpd ait connaissance de son propre nom. Ce nom est par la suite utilisé pour trouver le fichier d'environnement associé au serveur, et par conséquent, la racine de l'instance du serveur considéré.

Pour créer une instance supplémentaire appelée `httpd-additional`, suivez ces étapes :

- Créez un lien symbolique vers le script de démarrage pour l'instance supplémentaire :

  ```
  ln -s /etc/rc.d/init.d/httpd /etc/rc.d/init.d/httpd-additional
  chkconfig --add httpd-additional
  ```
- Créez un fichier d'environnement pour l'instance supplémentaire, en utilisant le fichier `/etc/sysconfig/httpd` comme modèle :

  ```
  # création du fichier d'environnement à partir du modèle httpd
  cp /etc/sysconfig/httpd /etc/sysconfig/httpd-additional
  ```

  ```
  # création du fichier d'environnement à partir de zéro
  touch /etc/sysconfig/httpd-additional
  ```

  Editez le fichier `/etc/sysconfig/httpd-additional` et définissez la racine de la nouvelle instance du serveur via la variable d'environnement `OPTIONS`.

  ```
  OPTIONS="-d /etc/httpd-additional -f conf/httpd-additional.conf"
  ```
- Editez le fichier de configuration du serveur supplémentaire `/etc/httpd-additional/conf/httpd-additional.conf` et assurez-vous que les ports et chemins sont correctement définis.
- Démarrez le serveur supplémentaire comme suit :

  ```
  service httpd-additional restart
  ```
- Répétez ces opérations pour chaque instance supplémentaire souhaitée.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
