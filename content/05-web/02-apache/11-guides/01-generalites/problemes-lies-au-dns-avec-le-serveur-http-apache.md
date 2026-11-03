---
title: "Problèmes liés au DNS avec le serveur HTTP Apache"
description: "Apache HTTP Server — Problèmes liés au DNS avec le serveur HTTP Apache. Cette page pourrait se résumer ainsi : configurez le serveur HTTP Apache de façon à ce qu'il n'ait pas besoin de résolution DNS pour interpréter les fichiers de configuration. Si httpd doit effectuer des résolutions DNS pour interpréter les"
tags: [apache, guide]
icon: book-open
---

Cette page pourrait se résumer ainsi : configurez le serveur HTTP Apache de façon à ce qu'il n'ait pas besoin de résolution DNS pour interpréter les fichiers de configuration. Si httpd doit effectuer des résolutions DNS pour interpréter les fichiers de configuration, votre serveur pourra présenter des problèmes de fiabilité (en d'autres termes, il est possible qu'il refuse de démarrer), ou d'attaques par déni ou usurpation de service (y compris l'attribution de requêtes à un serveur virtuel autre que le serveur virtuel voulu).

## Un exemple simple

```apache
# Ceci est un exemple de mauvaise configuration ; ne l'utilisez pas comme base
# de configuration
<VirtualHost www.example.dom>
  ServerAdmin webgirl@example.dom
  DocumentRoot "/www/example"
</VirtualHost>
```

Pour fonctionner correctement, le serveur a absolument besoin de deux informations à propos de chaque serveur virtuel : le nom du serveur défini par la directive [[13-directives/servername|ServerName]], et au moins une adresse IP à laquelle le serveur va se rattacher et répondre. L'exemple ci-dessus ne comporte pas d'adresse IP, si bien que httpd devra utiliser le DNS pour trouver l'adresse IP de `www.example.dom`. Si pour une raison quelconque, le DNS n'est pas disponible au moment où votre serveur interprète son fichier de configuration, ce serveur virtuel **ne sera pas pris en compte dans la configuration**. Il sera incapable de répondre à toute requête pour ce serveur virtuel.

Supposons que l'adresse de `www.example.dom` soit 192.0.2.1, et examinons cet extrait de configuration :

```apache
# Ceci est un exemple de mauvaise configuration ; ne l'utilisez pas comme base
# de configuration
<VirtualHost 192.0.2.1>
  ServerAdmin webgirl@example.dom
  DocumentRoot "/www/example"
</VirtualHost>
```

Cette fois, httpd doit effectuer une recherche DNS inverse pour trouver le nom `ServerName` de ce serveur virtuel. Si cette recherche inverse échoue, le serveur virtuel sera partiellement désactivé. Si le serveur virtuel est à base de nom, il sera en fait totalement désactivé, mais s'il est à base d'adresse IP, il fonctionnera probablement. Cependant, httpd échouera s'il doit générer une URL complète pour le serveur qui inclut ce nom de serveur (comme dans le cas d'une redirection).

Voici un extrait de configuration qui permet d'éviter ces deux types de problèmes :

```apache
<VirtualHost 192.0.2.1>
  ServerName www.example.dom
  ServerAdmin webgirl@example.dom
  DocumentRoot "/www/example"
</VirtualHost>
```

## Déni de service

Considérons cet extrait de configuration :

```apache
<VirtualHost www.example1.dom>
  ServerAdmin webgirl@example1.dom
  DocumentRoot "/www/example1"
</VirtualHost>
<VirtualHost www.example2.dom>
  ServerAdmin webguy@example2.dom
  DocumentRoot "/www/example2"
</VirtualHost>
```

Supposons que vous ayez assigné 192.0.2.1 à `www.example1.dom` et 192.0.2.2 à `www.example2.dom`. En outre, supposons que `example1.dom` gère son propre DNS. Avec cette configuration, `example1.dom` sera en mesure de détourner tout trafic destiné à `example2.dom`. Pour y parvenir, tout ce qu'ils ont à faire consiste à assigner 192.0.2.2 à `www.example1.dom`. Comme ils gèrent leur propre DNS, vous ne pouvez pas les empêcher de faire pointer l'enregistrement `www.example1.dom` vers l'adresse qu'ils veulent.

Les requêtes à destination de 192.0.2.2 (y compris toutes celles où l'utilisateur à tapé une URL de la forme `http://www.example2.dom/quelquepart`), seront toutes servies par le serveur virtuel `example1.dom`. Une meilleur compréhension de la raison pour laquelle ceci peut se produire nécessite une discussion plus approfondie à propos de la manière dont httpd associe les requêtes entrantes aux différents serveurs virtuels qui vont les servir. Un document de base décrivant ceci [[11-guides/03-serveurs-virtuels/details-sur-le-fonctionnement-des-serveurs-virtuels|est disponible]].

## L'adresse du "serveur principal"

[[11-guides/03-serveurs-virtuels/support-apache-des-serveurs-virtuels-par-nom|Le support des serveurs virtuels à base de nom]] oblige httpd à connaître la/les adresse(s) IP de l'hôte sur lequel [[10-commandes/httpd|httpd]] s'exécute. Pour obtenir cette adresse, soit il utilise la directive [[13-directives/servername|ServerName]] globale (si elle est présente), soit il fait appel à la fonction C `gethostname` (qui doit renvoyer le même nom que la commande shell "hostname"). Il effectue ensuite une recherche DNS sur cette adresse. Pour le moment, il n'existe aucun moyen d'éviter cette recherche DNS.

Si vous craignez que cette recherche DNS échoue parce que votre serveur DNS est arrêté, vous pouvez insérer le nom d'hôte dans le fichier `/etc/hosts` (où il est probablement déjà enregistré afin que la machine démarre correctement). Assurez-vous ensuite que la machine est configurée pour utiliser `/etc/hosts` dans le cas où la recherche DNS échoue. Suivant le système d'exploitation que vous utilisez, vous y parviendrez en éditant `/etc/resolv.conf`, ou `/etc/nsswitch.conf`.

Si votre serveur n'a aucune autre raison d'effectuer des recherches DNS, vous pouvez définir la variable d'environnement `HOSTRESORDER` à "local", et vous serez alors en mesure d'exécuter httpd. Tout dépend du système d'exploitation et des bibliothèques de résolution de noms que vous utilisez. Elle affecte aussi les programmes CGI, à moins que vous n'utilisiez [[12-modules/mod_env|mod_env]] pour contrôler l'environnement. Il est conseillé de consulter les pages de manuel ou les FAQs de votre système d'exploitation.

## Conseils pour éviter ce genre de problème

- utilisez des adresses IP au sein des [[13-directives/virtualhost|<VirtualHost>]]
- utilisez des adresses IP avec la directive [[13-directives/listen|Listen]]
- vérifiez que tous les serveurs virtuels possèdent un nom [[13-directives/servername|ServerName]] explicite
- créez un serveur virtuel `<VirtualHost _default_:*>` qui n'a aucune page à servir

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
