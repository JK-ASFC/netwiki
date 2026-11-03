---
title: "mod_proxy_balancer"
description: "Module Apache mod_proxy_balancer — Extension de mod_proxy pour le support de la répartition de charge. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_proxy_balancer]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Extension de mod\_proxy pour le support de la répartition de charge |
| **Statut** | Extension |
| **Identificateur** | `proxy_balancer_module` |
| **Fichier source** | `mod_proxy_balancer.c` |
| **Compatibilité** | Disponible depuis la version 2.1 d'Apache |

## Sommaire

Pour pouvoir fonctionner, ce module *requiert* le chargement de [[12-modules/mod_proxy|mod_proxy]], et il fournit le support de la répartition de charge pour tous les protocoles supportés. Parmi ces protocoles, les plus importants sont :

- HTTP, avec le module [[12-modules/mod_proxy_http|mod_proxy_http]]
- FTP, avec le module [[12-modules/mod_proxy_ftp|mod_proxy_ftp]]
- AJP13, avec le module [[12-modules/mod_proxy_ajp|mod_proxy_ajp]]
- WebSocket, avec le module [[12-modules/mod_proxy_wstunnel|mod_proxy_wstunnel]]

L'algorithme de planification de la répartition de charge n'est pas fourni par ce module, mais par ceux-ci :

- [[12-modules/mod_lbmethod_byrequests|mod_lbmethod_byrequests]]
- [[12-modules/mod_lbmethod_bytraffic|mod_lbmethod_bytraffic]]
- [[12-modules/mod_lbmethod_bybusyness|mod_lbmethod_bybusyness]]
- [[12-modules/mod_lbmethod_heartbeat|mod_lbmethod_heartbeat]]

Ainsi, pour mettre en oeuvre la répartition de charge, [[12-modules/mod_proxy|mod_proxy]], [[12-modules/mod_proxy_balancer|mod_proxy_balancer]] et au moins un des modules fournissant l'algorithme de planification de la répartition de charge doivent être chargés dans le serveur.

> [!WARNING]
> **Avertissement**
>
> N'activez pas la fonctionnalité de mandataire avant d'avoir [[12-modules/mod_proxy|sécurisé votre serveur]]. Les serveurs mandataires ouverts sont dangereux non seulement pour votre réseau, mais aussi pour l'Internet au sens large.

## L'algorithme de planification de la répartition de charge

A l'heure actuelle, 4 algorithmes de planification de la répartition de charge sont disponibles : ils se basent respectivement sur le comptage des requêtes ([[12-modules/mod_lbmethod_byrequests|mod_lbmethod_byrequests]]), la mesure de l'intensité du trafic ([[12-modules/mod_lbmethod_bytraffic|mod_lbmethod_bytraffic]]), le comptage des requêtes en attente ([[12-modules/mod_lbmethod_bybusyness|mod_lbmethod_bybusyness]]) et la mesure de l'activité du serveur ([[12-modules/mod_lbmethod_heartbeat|mod_lbmethod_heartbeat]]). Ils sont contrôlés par la valeur de `lbmethod` dans la définition du répartiteur. Voir la directive [[13-directives/proxypass|ProxyPass]] pour plus de détails, et en particulier la configuration du répartiteur et de ses membres.

## Répartition de charge avec abonnement utilisateur (stickiness)

Le répartiteur supporte l'abonnement utilisateur. Lorsqu'une requête est mandatée vers un serveur d'arrière-plan particulier, toutes les requêtes suivantes du même utilisateur seront alors mandatées vers le même serveur d'arrière-plan. De nombreux répartiteurs de charge implémentent cette fonctionnalité via une table qui associe les adresses IP des clients aux serveurs d'arrière-plan. Cette approche est transparente aux clients et aux serveurs d'arrière-plan, mais induit certains problèmes : distribution de charge inégale si les clients se trouvent eux-mêmes derrière un mandataire, erreurs d'abonnement lorsqu'un client possède une adresse IP dynamique qui peut changer au cours d'une session et perte d'abonnement en cas de dépassement de la table de correspondances.

Le module [[12-modules/mod_proxy_balancer|mod_proxy_balancer]] implémente l'abonnement selon deux alternatives : les cookies et le codage d'URL. Le cookie peut être fourni par le serveur d'arrière-plan ou par le serveur web Apache lui-même, alors que le codage d'URL est en général effectué par le serveur d'arrière-plan.

## Exemples de configuration d'un répartiteur

Avant de nous plonger dans les détails techniques, voici un exemple d'utilisation de [[12-modules/mod_proxy_balancer|mod_proxy_balancer]] mettant en oeuvre la répartition de charge entre deux serveurs d'arrière-plan :

```apache
<Proxy "balancer://mycluster">
    BalancerMember "http://192.168.1.50:80"
    BalancerMember "http://192.168.1.51:80"
</Proxy>
ProxyPass        "/test" "balancer://mycluster"
ProxyPassReverse "/test" "balancer://mycluster"
```

Voici un autre exemple de répartiteur de charge avec abonnement utilisant [[12-modules/mod_headers|mod_headers]], fonctionnant même si le serveur d'arrière-plan ne définit pas de cookie de session approprié :

```apache
Header add Set-Cookie "ROUTEID=.%{BALANCER_WORKER_ROUTE}e; path=/" env=BALANCER_ROUTE_CHANGED
<Proxy "balancer://mycluster">
    BalancerMember "http://192.168.1.50:80" route=1
    BalancerMember "http://192.168.1.51:80" route=2
    ProxySet stickysession=ROUTEID
</Proxy>
ProxyPass        "/test" "balancer://mycluster"
ProxyPassReverse "/test" "balancer://mycluster"
```

## Variables d'environnement exportées

A l'heure actuelle, 6 variables d'environnement sont exportées :

***BALANCER\_SESSION\_STICKY***

Cette variable se voir assignée la valeur de *stickysession* pour la requête courante. Il s'agit du nom du cookie ou du paramètre de requête utilisé pour les sessions avec abonnement.

***BALANCER\_SESSION\_ROUTE***

Cette variable se voit assignée la *route* interprétée pour la requête courante.

***BALANCER\_NAME***

Cette variable se voit assigné le nom du répartiteur pour la requête courante. Il s'agit d'une valeur du style `balancer://foo`.

***BALANCER\_WORKER\_NAME***

Cette variable se voit assigné le nom du membre du groupe de répartition de charge utilisé pour la requête courante. Il s'agit d'une valeur du style `http://hostA:1234`.

***BALANCER\_WORKER\_ROUTE***

Cette variable se voit assignée la *route* du membre du groupe de répartition de charge qui sera utilisé pour la requête courante.

***BALANCER\_ROUTE\_CHANGED***

Cette variable est définie à 1 si la route de la session ne correspond pas à celle du membre du groupe de répartition de charge (BALANCER\_SESSION\_ROUTE != BALANCER\_WORKER\_ROUTE), ou si la session ne possède pas encore de route établie. Elle peut servir à déterminer quand il est éventuellement nécessaire d'envoyer au client une route mise à jour lorsque les sessions persistantes sont utilisées.

## Activation du support du gestionnaire de répartiteur

Cette fonctionnalité *nécessite* le chargement du module [[12-modules/mod_status|mod_status]]. Le gestionnaire de répartiteur permet la mise à jour dynamique des membres du groupe de répartition de charge. Vous pouvez utiliser le gestionnaire de répartiteur pour modifier le facteur de charge d'un membre particulier, ou passer ce dernier en mode hors ligne.

Ainsi, pour mettre en oeuvre la gestion du répartiteur de charge, [[12-modules/mod_status|mod_status]] et [[12-modules/mod_proxy_balancer|mod_proxy_balancer]] doivent être chargés dans le serveur.

Pour permettre la gestion du répartiteur de charge aux navigateurs appartenant au domaine example.com, ajoutez ces lignes à votre fichier de configuration `httpd.conf` :

```apache
<Location "/balancer-manager">
    SetHandler balancer-manager
    Require host example.com
</Location>
```

Vous pourrez alors accéder au gestionnaire du répartiteur de charge en utilisant un navigateur web pour afficher la page `http://nom.de.votre.serveur/balancer-manager`. Notez que pour pouvoir contrôler dynamiquement un membre de groupe de répartition, ce dernier ne doit pas être défini au sein d'une section `<Location ...>`.

## Détails à propos de la répartition de charge par abonnement (stickiness)

Si l'abonnement s'appuie sur un cookie, vous devez définir le nom de ce cookie dont le contenu précise le serveur d'arrière-plan à utiliser. Pour ce faire, on utilise l'attribut *stickysession* avec la directive [[13-directives/proxypass|ProxyPass]] ou [[13-directives/proxyset|ProxySet]]. Le nom du cookie est sensible à la casse. Le répartiteur extrait le contenu du cookie et recherche un serveur membre dont la *route* correspond à cette valeur. La route doit aussi être définie dans la directive [[13-directives/proxypass|ProxyPass]] ou [[13-directives/proxyset|ProxySet]]. Le cookie peut être défini soit par le serveur d'arrière-plan, soit, comme indiqué dans l'exemple ci-dessus par le serveur web Apache lui-même.

Certains serveurs d'arrière-plan, tels qu'Apache Tomcat, utilisent une forme sensiblement différente de cookie d'abonnement. Tomcat ajoute le nom de l'instance Tomcat à la fin de son identifiant de session, précédé par un point. Ainsi, si le serveur web Apache trouve un point dans la valeur du cookie d'abonnement, il n'utilisera que la partie située après ce point pour rechercher sa route. Pour que Tomcat puisse connaître son nom d'instance, vous devez définir l'attribut `jvmRoute` dans son fichier de configuration `conf/server.xml` à la valeur de la *route* du serveur qui se connecte au Tomcat considéré. Le nom du cookie de session utilisé par Tomcat (et plus généralement par les applications web Java à base de servlets) est `JSESSIONID` (en majuscules), mais peut être modifié.

La seconde méthode pour implémenter l'abonnement est le codage d'URL. Ici, le serveur web recherche un paramètre dans l'URL de la requête. Le nom du paramètre est spécifié par l'attribut *stickysession*. Pour trouver un serveur membre, on recherche un serveur dont la *route* est égale à la valeur du paramètre. Comme il n'est pas aisé d'extraire et de manipuler tous les liens URL contenus dans les réponses, le travail consistant à ajouter les paramètres à chaque lien est généralement effectué par le serveur d'arrière-plan qui génère le contenu. Bien qu'il soit possible dans certains cas d'effectuer ces ajouts au niveau du serveur web via les modules [[12-modules/mod_substitute|mod_substitute]] ou [[12-modules/mod_sed|mod_sed]], cette méthode peut dégrader les performances.

Les standards Java implémentent le codage d'URL de manière sensiblement différente. Ils ajoutent une information de chemin à l'URL en utilisant un point-virgule (`;`) comme séparateur, puis ajoutent enfin l'identifiant de session. Comme dans le cas des cookies, Apache Tomcat peut insérer la valeur de l'attribut `jvmRoute` dans cette information de chemin. Pour qu'Apache puisse trouver ce genre d'information de chemin, vous devez définir `scolonpathdelim` à `On` dans la directive [[13-directives/proxypass|ProxyPass]] ou [[13-directives/proxyset|ProxySet]].

Enfin, vous pouvez utiliser simultanément les cookies et le codage d'URL en définissant le nom du cookie et le nom du paramètre d'URL séparés par une barre verticale (`|`) comme dans l'exemple suivant :

```apache
ProxyPass "/test" "balancer://mycluster" stickysession=JSESSIONID|jsessionid scolonpathdelim=On
<Proxy "balancer://mycluster">
    BalancerMember "http://192.168.1.50:80" route=node1
    BalancerMember "http://192.168.1.51:80" route=node2
</Proxy>
```

Si le cookie et le paramètre de requête fournissent tous deux une information de route correcte pour la même requête, c'est l'information en provenance du paramètre de requête qui sera retenue.

## Résolution des problèmes liés à la répartition de charge par abonnement

Si vous êtes confronté à des erreurs d'abonnement, comme la nécessité pour les utilisateurs de se reconnecter suite à une perte de session d'application, vous devez tout d'abord vérifier si ceci n'est pas du à une indisponibilité sporadique des serveurs d'arrière-plan ou à une erreur de configuration. La présence de messages d'erreur de type proxy dans le journal des erreurs d'Apache pourra révéler des problèmes de stabilité au niveau des serveurs d'arrière-plan.

Pour contrôler votre configuration, regardez tout d'abord si l'abonnement est à base de cookie ou de codage d'URL. L'étape suivante consiste à enregistrer certaines données dans le journal des accès en utilisant un `format de journalisation` personnalisé. Les champs intéressants sont les suivants :

**`%{MONCOOKIE}C`**

La valeur que contient le cookie de nom `MONCOOKIE`. Le nom doit correspondre au nom défini par l'attribut *stickysession*.

**`%{Set-Cookie}o`**

Ce champ contient tout cookie défini par le serveur d'arrière-plan. Vous pouvez ainsi vérifier si le serveur d'arrière-plan définit bien le cookie de session auquel vous vous attendez, et à quelle valeur il est défini.

**`%{BALANCER_SESSION_STICKY}e`**

Le nom du cookie ou du paramètre de requête utilisé pour la recherche de l'information de routage.

**`%{BALANCER_SESSION_ROUTE}e`**

L'information de routage extraite de la requête.

**`%{BALANCER_WORKER_ROUTE}e`**

La route du serveur choisi.

**`%{BALANCER_ROUTE_CHANGED}e`**

Contient la valeur `1` si la route extraite de la requête est différente de la route du serveur ; autrement dit, le traitement de la requête n'a pas pu être effectué dans le cadre d'une répartition de charge par abonnement.

Les pertes de session sont souvent dues à des expirations de session dont la valeur peut en général être configurée au niveau du serveur d'arrière-plan.

Si le niveau de journalisation est défini à `debug` ou plus, le répartiteur journalise aussi des informations détaillées à propos de l'abonnement dans le journal des erreurs, ce qui facilite la résolution des problèmes d'abonnement. Notez cependant que le volume de journalisation pourra alors s'avérer trop important pour un serveur en production sous forte charge.

## Voir aussi

- [[12-modules/mod_proxy|mod_proxy]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
