---
title: "mod_proxy_fcgi"
description: "Module Apache mod_proxy_fcgi — Module fournissant le support de FastCGI à mod_proxy. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_proxy_fcgi]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Module fournissant le support de FastCGI à mod\_proxy |
| **Statut** | Extension |
| **Identificateur** | `proxy_fcgi_module` |
| **Fichier source** | `mod_proxy_fcgi.c` |
| **Compatibilité** | Disponible depuis la version 2.3 d'Apache |

## Sommaire

Pour fonctionner, ce module *nécessite* le chargement de [[12-modules/mod_proxy|mod_proxy]]. Il fournit le support du protocole [FastCGI](https://fastcgi-archives.github.io/).

Ainsi, pour pouvoir traiter le protocole `FastCGI`, [[12-modules/mod_proxy|mod_proxy]] et [[12-modules/mod_proxy_fcgi|mod_proxy_fcgi]] doivent être chargés dans le serveur.

A la différence de [mod\_fcgid](http://httpd.apache.org/mod_fcgid/), [[12-modules/mod_proxy_fcgi|mod_proxy_fcgi]] n'est pas en mesure de démarrer le processus de l'application ; [[10-commandes/fcgistarter|fcgistarter]] est fourni à cet effet sur certaines plateformes. Le framework applicatif FastCGI utilisé peut aussi fournir la gestion des processus ou des lancements de programmes externes.

> [!WARNING]
> **Avertissement**
>
> N'activez pas la fonctionnalité de mandataire avant d'avoir [[12-modules/mod_proxy|sécurisé votre serveur]]. Les serveurs mandataires ouverts sont dangereux non seulement pour votre réseau, mais aussi pour l'Internet au sens large.

## Exemples

Pour que ces exemples fonctionnent, vous ne devez pas oublier d'activer [[12-modules/mod_proxy|mod_proxy]] et [[12-modules/mod_proxy_fcgi|mod_proxy_fcgi]].

**Instance d'application unique**

```apache
ProxyPass "/mon_appli/" "fcgi://localhost:4000/"
```

[[12-modules/mod_proxy_fcgi|mod_proxy_fcgi]] interdisant par défaut la réutilisation des connexions, lorsqu'une requête a été traitée, la connexion ne sera pas maintenue ouverte par le processus enfant httpd, et ne sera donc pas réutilisée. Cependant, si l'application FastCGI supporte les connexions httpd simultanées, vous pouvez opter pour la réutilisation des connexions comme dans l'exemple suivant :

**Instance d'application unique, réutilisation des connexions (versions 2.4.11 et supérieures)**

```apache
ProxyPass "/myapp/" "fcgi://localhost:4000/" enablereuse=on
```

> [!NOTE]
> **Active la réutilisation des connexions vers un serveur FCGI d'arrière-plan tel que PHP-FPM**
>
> Il faut garder à l'esprit que PHP-FPM (en février 2018) utilise un modèle du style prefork ; autrement dit, chacun de ses processus de travail ne peut gérer qu'une connexion à la fois.
> Par défaut et lorsqu'il est configuré avec `enablereuse=on` et lorsqu'un MPM à base de threads est utilisé (comme [[12-modules/worker|worker]] ou [[12-modules/event|event]]), mod\_proxy autorise un jeu de [[13-directives/threadsperchild|ThreadsPerChild]] connexions vers le serveur d'arrière-plan pour chaque processus httpd, et par conséquent, il faut prêter une attention particulière aux situations suivantes :
>
> - Avec une charge en HTTP/1, il est fort probable que le nombre de connexions vers le serveur FCGI d'arrière-plan augmente jusqu'à atteindre [[13-directives/maxrequestworkers|MaxRequestWorkers]].
> - Avec une charge en HTTP/2, et vue la manière dont [[12-modules/mod_http2|mod_http2]] est implémenté, il y a des threads de travail h2 additionnels qui peuvent forcer la création de connexions supplémentaires vers le serveur d'arrière-plan. Le nombre total de connexions que contiennent les jeux de connexions peut alors dépasser [[13-directives/maxrequestworkers|MaxRequestWorkers]].
>
> Le nombre maximum de processus de travail PHP-FPM doit être défini judicieusement car il est possible qu'ils finissent par rester dans l'état occupé ("busy") pour ne gérer que des connexions persistantes inactives, sans avoir la possibilité d'en établir de nouvelles ; ce qui se traduira pour l'utilisateur final par une pile de "HTTP request timeouts".

Dans l'exemple suivant, l'URI de la requête est transmis en tant que chemin du système de fichiers pour l'exécution du démon PHP-FPM. L'URL de la requête est implicitement ajoutée au second paramètre. PHP-FPM est à l'écoute de l'hôte et du port qui suivent fcgi://. La conservation/réutilisation des connexions est activée.

**PHP-FPM**

```apache
ProxyPassMatch "^/myapp/.*\.php(/.*)?$" "fcgi://localhost:9000/var/www/" enablereuse=on
```

Dans l'exemple suivant, l'URI de la requête est transmis en tant que chemin du système de fichiers pour l'exécution du démon PHP-FPM. Dans ce cas cependant, PHP-FPM est à l'écoute d'un socket de domaine unix (UDS). Cette fonctionnalité est disponible à partir de la version 2.4.9. Avec cette syntaxe, si un nom d'hôte et un port sont ajoutés après fcgi://, ils seront ignorés.

**PHP-FPM with UDS**

```apache
ProxyPassMatch "^/(.*\.php(/.*)?)$" "unix:/var/run/php5-fpm.sock|fcgi://localhost/var/www/"
```

La passerelle à répartition de charge nécessite le chargement du module [[12-modules/mod_proxy_balancer|mod_proxy_balancer]] et d'au moins un module fournissant un algorithme de répartition de charge, comme [[12-modules/mod_lbmethod_byrequests|mod_lbmethod_byrequests]] en plus des modules déjà cités. [[12-modules/mod_lbmethod_byrequests|mod_lbmethod_byrequests]] est le module par défaut et sera utilisé dans cet exemple de configuration.

**Passerelle à répartition de charge vers plusieurs instances de l'application**

```apache
ProxyPass "/myapp/" "balancer://myappcluster/"
<Proxy "balancer://myappcluster/">
    BalancerMember "fcgi://localhost:4000"
    BalancerMember "fcgi://localhost:4001"
</Proxy>
```

Vous pouvez aussi forcer le traitement d'une requête en tant que requête de mandataire inverse en créant un court-circuiteur de gestionnaire approprié. Dans l'exemple ci-dessous, toutes les requêtes pour des scripts PHP seront transmises au serveur FastCGI spécifié par mandat inverse. Cette fonctionnalité est disponible à partir de la version 2.4.10 du serveur HTTP Apache. Pour des raisons de performances, il est recommandé de définir un [[12-modules/mod_proxy|worker (configuration d'un mandataire)]] représentant le même serveur fcgi:// d'arrière-plan. Avec cette configuration, il est possible d'effectuer une correspondance directe entre l'URI et le chemin du fichier sur le serveur, et le chemin local du fichier sera alors transmis au serveur d'arrière-plan. Lorsque FastCGI est configuré ainsi, le serveur est en mesure de calculer le PATH\_INFO le plus approprié.

**Mandataire via un gestionnaire**

```apache
<FilesMatch "\.php$">
    # Note : la seule partie variable est /path/to/app.sock
    SetHandler  "proxy:unix:/path/to/app.sock|fcgi://localhost/"
</FilesMatch>
   # Définition d'une configuration de mandataire qui convient.
   # La partie qui est mise en correspondance avec la valeur de
   # SetHandler est la partie qui suit le "pipe". Si vous devez faire
   # une distinction, "localhost" peut être changé en un nom de serveur
   # unique.
   <Proxy "fcgi://localhost/" enablereuse=on max=10>
   </Proxy>

<FilesMatch ...>
    SetHandler  "proxy:fcgi://localhost:9000"
</FilesMatch>

<FilesMatch ...>
    SetHandler  "proxy:balancer://myappcluster/"
</FilesMatch>
```

## Variables d'environnement

En plus des directives de configuration qui contrôlent le comportement de [[12-modules/mod_proxy|mod_proxy]], de nombreuses *variables d'environnement* permettent de piloter le fournisseur du protocole FCGI :

**proxy-fcgi-pathinfo**

Lorsqu'il est configuré via les directives [[13-directives/proxypass|ProxyPass]] ou [[13-directives/proxypassmatch|ProxyPassMatch]], [[12-modules/mod_proxy_fcgi|mod_proxy_fcgi]] ne définit pas la variable d'environnement *PATH\_INFO*, ce qui permet au serveur FCGI d'arrière-plan de déterminer correctement *SCRIPT\_NAME* et *Script-URI*, et de se conformer à la section 3.3 de la RFC 3875. Si au contraire vous avez souhaitez que [[12-modules/mod_proxy_fcgi|mod_proxy_fcgi]] génère une "estimation la plus exacte possible" de *PATH\_INFO*, définissez la variable d'environnement *proxy-fcgi-pathinfo*. Ceci peut servir de contournement pour une bogue présente dans certaines implémentations de FCGI. Cette variable peut être multivaluée afin de pouvoir choisir la valeur la plus appropriée (versions 2.4.11 et supérieures) :

**first-dot**

PATH\_INFO est extrait à partir du slash qui suit le *premier* "." de l'URL.

**last-dot**

PATH\_INFO est extrait à partir du slash qui suit le *dernier* "." de l'URL.

**full**

PATH\_INFO est calculé en supposant que l'URL correspond au chemin du système de fichiers.

**unescape**

PATH\_INFO correspond à la partie chemin de l'URL avec ses séquences d'échappement décodées.

**toute autre valeur**

PATH\_INFO correspond à la partie chemin de l'URL. Auparavant, c'était la seule option pour proxy-fcgi-pathinfo.

## Directives

- [[13-directives/proxyfcgibackendtype|ProxyFCGIBackendType]]
- [[13-directives/proxyfcgisetenvif|ProxyFCGISetEnvIf]]

## Voir aussi

- [[10-commandes/fcgistarter|fcgistarter]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
