---
title: "Documentation sur les serveurs virtuels Apache"
description: "Apache HTTP Server — Documentation sur les serveurs virtuels Apache. Le principe des Serveurs Virtuels consiste à faire fonctionner un ou plusieurs serveurs Web (comme www.company1.example.com et www.company2.example.com) sur une même machine. Les serveurs virtuels peuvent être soit \"par-IP\" où une adresse I"
tags: [apache, guide]
icon: book-open
---

Le principe des *Serveurs Virtuels* consiste à faire fonctionner un ou plusieurs serveurs Web (comme `www.company1.example.com` et `www.company2.example.com`) sur une même machine. Les serveurs virtuels peuvent être soit "[[11-guides/03-serveurs-virtuels/support-apache-des-serveurs-virtuels-par-ip|par-IP]]" où une adresse IP est attribuée pour chaque serveur Web, soit "[[11-guides/03-serveurs-virtuels/support-apache-des-serveurs-virtuels-par-nom|par-nom]]" où plusieurs noms de domaine se côtoient sur des mêmes adresses IP. L'utilisateur final ne perçoit pas qu'en fait il s'agit d'un même serveur physique.

Apache a été le précurseur des serveurs proposant cette méthode de serveurs virtuels basés sur les adresses IP. Ses versions 1.1 et suivantes proposent les deux méthodes de serveurs virtuels : par-IP et par-nom. Cette deuxième méthode est parfois également appelée *host-based* ou *serveur virtuel non-IP*.

Vous trouverez ci-dessous une liste documentaire qui vous expliquera en détails le fonctionnement du support des serveurs virtuels par le serveur HTTP Apache.

## Support des serveurs virtuels

- [[11-guides/03-serveurs-virtuels/support-apache-des-serveurs-virtuels-par-nom|Serveurs Virtuels par-Nom]] (Un ou plusieurs sites Web par adresse IP)
- [[11-guides/03-serveurs-virtuels/support-apache-des-serveurs-virtuels-par-ip|Serveurs Virtuels par-IP]] (Une adresse IP pour chaque site Web)
- [[11-guides/03-serveurs-virtuels/exemples-d-utilisations-de-virtualhost|Exemples de configurations classiques de Serveurs Virtuels]]
- [[11-guides/03-serveurs-virtuels/limites-des-descripteurs-de-fichiers|Limites des descripteurs de fichiers]] (ou, *trop de fichiers journaux*)
- [[11-guides/03-serveurs-virtuels/hebergement-virtuel-de-masse-configure-dynamiquement|Configuration dynamique en masse de Serveurs Virtuels]]
- [[11-guides/03-serveurs-virtuels/details-sur-le-fonctionnement-des-serveurs-virtuels|Explication approfondie des critères de sélection d'un Serveur Virtuel]]

## Directives de configuration

- [[13-directives/virtualhost|<VirtualHost>]]
- [[13-directives/servername|ServerName]]
- [[13-directives/serveralias|ServerAlias]]
- [[13-directives/serverpath|ServerPath]]

Pour vérifier et analyser la configuration de vos serveurs virtuels, vous pouvez utiliser l'argument `-S` sur la ligne de commande.

**Exemple Unix**

```
apachectl -S
```

**Exemple Windows**

```
httpd.exe -S
```

Cette commande affichera dans le détail comment Apache a traité son fichier de configuration. Les erreurs de configuration peuvent être corrigées par l'examen attentif des adresses IP et des noms de serveurs. (Consultez la documentation du programme [[10-commandes/httpd|httpd]] pour les autres arguments de la ligne de commande)

## Voir aussi

- [[12-modules/mod_vhost_alias|mod_vhost_alias]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
