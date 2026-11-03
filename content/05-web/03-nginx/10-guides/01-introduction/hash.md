---
title: "Réglage des tables de hachage"
description: "Nginx — Réglage des tables de hachage. Pour traiter rapidement des ensembles de données statiques comme les noms de serveurs, les valeurs de la directive map, les types MIME ou les noms des en-têtes de requête, nginx utilise des tables de hachage. Au…"
tags: [nginx, guide]
icon: book-open
---

Pour traiter rapidement des ensembles de données statiques comme les noms de serveurs, les valeurs de la directive [[12-directives/map-http-map|map]], les types MIME ou les noms des en-têtes de requête, nginx utilise des tables de hachage. Au démarrage et à chaque reconfiguration, nginx choisit les plus petites tailles de tables possibles telles que la taille d'un compartiment, qui contient les clés de même valeur de hachage, ne dépasse pas le paramètre configuré (*hash bucket size*). La taille d'une table s'exprime en compartiments. L'ajustement se poursuit jusqu'à ce que la taille de la table dépasse le paramètre *hash max size*. La plupart des tables ont des directives permettant de modifier ces paramètres ; par exemple, pour la table des noms de serveurs, [[12-directives/server-names-hash-max-size-http-core|server_names_hash_max_size]] et [[12-directives/server-names-hash-bucket-size-http-core|server_names_hash_bucket_size]].

Le paramètre *hash bucket size* est aligné sur un multiple de la taille de ligne de cache du processeur. Cela accélère la recherche des clés sur les processeurs modernes en réduisant le nombre d'accès à la mémoire. Si *hash bucket size* est égal à la taille d'une ligne de cache, la recherche d'une clé nécessite au pire deux accès mémoire : le premier pour calculer l'adresse du compartiment, le second pour chercher la clé dans le compartiment. Si nginx demande d'augmenter *hash max size* ou *hash bucket size*, il faut donc augmenter d'abord le premier paramètre.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
