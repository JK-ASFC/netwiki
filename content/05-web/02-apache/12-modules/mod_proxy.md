---
title: "mod_proxy"
description: "Module Apache mod_proxy — Serveur mandataire/passerelle multi-protocole. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_proxy]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Serveur mandataire/passerelle multi-protocole |
| **Statut** | Extension |
| **Identificateur** | `proxy_module` |
| **Fichier source** | `mod_proxy.c` |

## Sommaire

> [!WARNING]
> **Avertissement**
>
> N'activez pas la fonctionnalité de mandataire avec la directive [[13-directives/proxyrequests|ProxyRequests]] avant d'avoir sécurisé votre serveur. Les serveurs mandataires ouverts sont dangereux pour votre réseau, mais aussi pour l'Internet au sens large.

[[12-modules/mod_proxy|mod_proxy]] et ses modules associés implémentent un mandataire/passerelle pour le serveur HTTP Apache, et supportent de nombreux protocoles courants, ainsi que plusieurs algorithmes de répartition de charge. Le support de protocoles et d'algorithmes de répartition de charge supplémentaires peut être assuré par des modules tiers.

Un jeu de modules chargés dans le serveur permet de fournir les fonctionnalités souhaitées. Ces modules peuvent être inclus statiquement à la compilation, ou dynamiquement via la directive [[13-directives/loadmodule|LoadModule]]. Ce jeu de module doit comporter :

- [[12-modules/mod_proxy|mod_proxy]], qui fournit les fonctionnalités de base d'un mandataire
- [[12-modules/mod_proxy_balancer|mod_proxy_balancer]] et un ou plusieurs modules de répartition, si la répartition de charge doit être mise en oeuvre (Voir la documentation de [[12-modules/mod_proxy_balancer|mod_proxy_balancer]] pour plus de détails).
- un ou plusieurs modules de types de mandataire, ou protocoles :

  | Protocole | Module |
  | --- | --- |
  | AJP13 (Protocole Apache JServe version 1.3) | [[12-modules/mod_proxy_ajp\|mod_proxy_ajp]] |
  | CONNECT (pour SSL) | [[12-modules/mod_proxy_connect\|mod_proxy_connect]] |
  | FastCGI | [[12-modules/mod_proxy_fcgi\|mod_proxy_fcgi]] |
  | ftp | [[12-modules/mod_proxy_ftp\|mod_proxy_ftp]] |
  | HTTP/0.9, HTTP/1.0, et HTTP/1.1 | [[12-modules/mod_proxy_http\|mod_proxy_http]] |
  | HTTP/2.0 | [[12-modules/mod_proxy_http2\|mod_proxy_http2]] |
  | SCGI | [[12-modules/mod_proxy_scgi\|mod_proxy_scgi]] |
  | UWSGI | [[12-modules/mod_proxy_uwsgi\|mod_proxy_uwsgi]] |
  | WS and WSS (Web-sockets) | [[12-modules/mod_proxy_wstunnel\|mod_proxy_wstunnel]] |

En outre, d'autres modules fournissent des fonctionnalités étendues. [[12-modules/mod_cache|mod_cache]] et ses modules associés fournissent la mise en cache. Les directives `SSLProxy*` du module [[12-modules/mod_ssl|mod_ssl]] permettent de contacter des serveurs distants en utilisant le protocole SSL/TLS. Ces modules additionnels devront être chargés et configurés pour pouvoir disposer de ces fonctionnalités.

## Mandataires directs et mandataires/passerelles inverses

Le serveur HTTP Apache peut être configuré dans les deux modes mandataire *direct* et mandataire *inverse* (aussi nommé mode *passerelle*).

Un *mandataire direct* standard est un serveur intermédiaire qui s'intercale entre le client et le *serveur demandé*. Pour obtenir un contenu hébergé par le serveur demandé, le client envoie une requête au mandataire en nommant le serveur demandé comme cible. Le mandataire extrait alors le contenu depuis le serveur demandé et le renvoie enfin au client. Le client doit être configuré de manière appropriée pour pouvoir utiliser le mandataire direct afin d'accéder à d'autres sites.

L'accès à Internet depuis des clients situés derrière un pare-feu est une utilisation typique du mandataire direct. Le mandataire direct peut aussi utiliser la mise en cache (fournie par [[12-modules/mod_cache|mod_cache]]) pour réduire la charge du réseau.

La fonctionnalité de mandataire direct est activée via la directive [[13-directives/proxyrequests|ProxyRequests]]. Comme les mandataires directs permettent aux clients d'accéder à des sites quelconques via votre serveur et de dissimuler leur véritable origine, il est indispensable de sécuriser votre serveur de façon à ce que seuls les clients autorisés puissent accéder à votre serveur avant d'activer la fonctionnalité de mandataire direct.

Un *mandataire inverse* (ou *passerelle*), quant à lui, apparaît au client comme un serveur web standard. Aucune configuration particulière du client n'est nécessaire. Le client adresse ses demandes de contenus ordinaires dans l'espace de nommage du mandataire inverse. Ce dernier décide alors où envoyer ces requêtes, et renvoie le contenu au client comme s'il l'hébergeait lui-même.

L'accès d'utilisateurs depuis Internet vers un serveur situé derrière un pare-feu est une utilisation typique du mandataire inverse. On peut aussi utiliser les mandataires inverses pour mettre en oeuvre une répartition de charge entre plusieurs serveurs en arrière-plan, ou fournir un cache pour un serveur d'arrière-plan plus lent. Les mandataires inverses peuvent aussi tout simplement servir à rassembler plusieurs serveurs dans le même espace de nommage d'URLs.

La fonctionnalité de mandataire inverse est activée via la directive [[13-directives/proxypass|ProxyPass]] ou le drapeau `[P]` de la directive [[13-directives/rewriterule|RewriteRule]]. Il n'est **pas** nécessaire de définir [[13-directives/proxyrequests|ProxyRequests]] pour configurer un mandataire inverse.

## Exemples simples

Les exemples ci-dessous illustrent de manière très basique la mise en oeuvre de la fonctionnalité de mandataire et ne sont là que pour vous aider à démarrer. Reportez-vous à la documentation de chaque directive.

Si en outre, vous désirez activer la mise en cache, consultez la documentation de [[12-modules/mod_cache|mod_cache]].

**Mandataire inverse**

```apache
ProxyPass "/foo" "http://foo.example.com/bar"
ProxyPassReverse "/foo" "http://foo.example.com/bar"
```

**Mandataire direct**

```apache
ProxyRequests On
ProxyVia On

<Proxy "*">
  Require host internal.example.com
</Proxy>
```

**Promotion de protocole vers Websocket (versions 2.4.47 et ultérieures)**

```apache
ProxyPass "/some/ws/capable/path/" "http://example.com/some/ws/capable/path/" upgrade=websocket
```

## Accès via un gestionnaire

Vous pouvez aussi forcer le traitement d'une requête en tant que requête de mandataire inverse en créant un gestionnaire de transfert approprié. Dans l'exemple suivant, toutes les requêtes pour des scripts PHP seront transmises au serveur FastCGI spécifié via un mandat inverse :

**Scripts PHP et mandataire inverse**

```apache
<FilesMatch "\.php$">
    # Les sockets Unix nécessitent une version 2.4.7 ou supérieure du
    # serveur HTTP Apache
    SetHandler  "proxy:unix:/path/to/app.sock|fcgi://localhost"
</FilesMatch>
```

Cette fonctionnalité est disponible à partir de la version 2.4.10 du serveur HTTP Apache.

## Workers

Le mandataire gère la configuration et les paramètres de communication des serveurs originaux au sein d'objets nommés *workers*. Deux types de worker sont fournis : le worker par défaut du mandataire direct et le worker par défaut du mandataire inverse. Il est aussi possible de définir explicitement des workers supplémentaires.

Les deux workers par défaut possèdent une configuration figée et seront utilisés si aucun autre worker ne correspond à la requête. Ils ne réutilisent pas les connexions et n'utilisent pas les connexions HTTP persistantes (Keep-Alive). En effet, les connexions TCP vers le serveur original sont fermées et ouvertes pour chaque requête.

Les workers définis explicitement sont identifiés par leur URL. Ils sont en général définis via les directives [[13-directives/proxypass|ProxyPass]] ou [[13-directives/proxypassmatch|ProxyPassMatch]] lorsqu'on les utilise dans le cadre d'un mandataire inverse :

```apache
ProxyPass "/example" "http://backend.example.com" connectiontimeout=5 timeout=30
```

Cette directive va créer un worker associé à l'URL du serveur original `http://backend.example.com` qui utilisera les valeurs de timeout données. Lorsqu'ils sont utilisés dans le cadre d'un mandataire direct, les workers sont en général définis via la directive [[13-directives/proxyset|ProxySet]],

```apache
ProxySet "http://backend.example.com" connectiontimeout=5 timeout=30
```

ou encore via les directives [[13-directives/proxy|<Proxy>]] et [[13-directives/proxyset|ProxySet]] :

```apache
<Proxy "http://backend.example.com">
  ProxySet connectiontimeout=5 timeout=30
</Proxy>
```

L'utilisation de workers définis explicitement dans le mode mandataire direct n'est pas très courante, car les mandataires directs communiquent en général avec de nombreux serveurs originaux. La création explicite de workers pour certains serveurs originaux peut cependant s'avérer utile si ces serveurs sont très souvent sollicités. A leur niveau, les workers explicitement définis ne possèdent aucune notion de mandataire direct ou inverse. Ils encapsulent un concept de communication commun avec les serveurs originaux. Un worker créé via la directive [[13-directives/proxypass|ProxyPass]] pour être utilisé dans le cadre d'un mandataire inverse sera aussi utilisé dans le cadre d'un mandataire directe chaque fois que l'URL vers le serveur original correspondra à l'URL du worker, et vice versa.

L'URL qui identifie un worker correspond à l'URL de son serveur original, y compris un éventuel chemin donné :

```apache
ProxyPass "/examples" "http://backend.example.com/examples"
ProxyPass "/docs" "http://backend.example.com/docs"
```

Dans cet exemple, deux workers différents sont définis, chacun d'eux utilisant des configurations et jeux de connexions séparés.

> [!WARNING]
> **Partage de workers**
>
> Le partage de workers intervient lorsque les URLs des workers s'entrecoupent, ce qui arrive lorsque l'URL d'un worker correspond au début de l'URL d'un autre worker défini plus loin dans le fichier de configuration. Dans l'exemple suivant,
>
> ```apache
> ProxyPass "/apps" "http://backend.example.com/" timeout=60
> ProxyPass "/examples" "http://backend.example.com/examples" timeout=10
> ```
>
> le second worker n'est pas vraiment créé. C'est le premier worker qui est en fait utilisé. L'avantage de ceci réside dans le fait qu'il n'existe qu'un seul jeu de connexions, ces dernières étant donc réutilisées plus souvent. Notez que tous les attributs de configuration définis explicitement pour le deuxième worker seront ignorés, ce qui sera journalisé en tant qu'avertissement. Ainsi, dans l'exemple ci-dessus, la valeur de timeout retenue pour l'URL `/exemples` sera `60`, et non `10` !
>
> Si vous voulez empêcher le partage de workers, classez vos définitions de workers selon la longueur des URLs, de la plus longue à la plus courte. Si au contraire vous voulez favoriser ce partage, utilisez l'ordre de classement inverse. Voir aussi l'avertissement à propos de l'ordre de classement des directives [[13-directives/proxypass|ProxyPass]].

Les workers définis explicitement sont de deux sortes : *workers directs* et *workers de répartition (de charge)*. Ils supportent de nombreux attributs de configuration importants décrits dans la directive [[13-directives/proxypass|ProxyPass]]. Ces mêmes attributs peuvent aussi être définis via la directive [[13-directives/proxyset|ProxySet]].

Le jeu d'options disponibles pour un worker direct dépend du protocole spécifié dans l'URL du serveur original. Les protocoles disponibles comprennent `ajp`, `fcgi`, `ftp`, `http` et `scgi`.

Les workers de répartition sont des workers virtuels qui utilisent les workers directs, connus comme faisant partie de leurs membres, pour le traitement effectif des requêtes. Chaque répartiteur peut comporter plusieurs membres. Lorsqu'il traite une requête, il choisit un de ses membres en fonction de l'algorithme de répartition de charge défini.

Un worker de répartition est créé si son URL de worker comporte `balancer` comme indicateur de protocole. L'URL du répartiteur permet d'identifier de manière unique le worker de répartition. La directive [[13-directives/balancermember|BalancerMember]] permet d'ajouter des membres au répartiteur.

> [!NOTE]
> **Résolution DNS pour les domaines originaux**
>
> La résolution DNS s'effectue lorsque le socket vers le domaine original est créé pour la première fois. Lorsque la réutilisation des connexions est activée, chaque domaine d'arrière-plan n'est résolu qu'une seule fois pour chaque processus enfant, et cette résolution est mise en cache pour toutes les connexions ultérieures jusqu'à ce que le processus enfant soit recyclé. Ce comportement doit être pris en considération lorsqu'on planifie des tâches de maintenance du DNS impactant les domaines d'arrière-plan. Veuillez aussi vous reporter aux paramètres de la directive [[13-directives/proxypass|ProxyPass]] pour plus de détails à propos de la réutilisation des connexions.

## Contrôler l'accès à votre mandataire

Vous pouvez restreindre l'accès à votre mandataire via le bloc de contrôle [[13-directives/proxy|<Proxy>]] comme dans l'exemple suivant :

```apache
<Proxy "*">
  Require ip 192.168.0
</Proxy>
```

> [!NOTE]
> **Requêtes HTTPS/CONNECT**
>
> L'instruction générique `<Proxy "*">` ci-dessus correspond à toutes les requêtes, y compris les requêtes HTTPS sous tunnel via la méthode CONNECT. Notez que le contrôle d'accès pour les tunnels CONNECT ne peut fonctionner qu'avec l'hôte et le port — le contrôle avec le chemin (par exemple `<Proxy "https://example.com/path/">`) ne fonctionnera pas, car les requêtes CONNECT ne comportent pas de chemin.

Pour plus de détails sur les directives de contrôle d'accès, voir la documentation du module [[12-modules/mod_authz_host|mod_authz_host]].

Restreindre l'accès de manière stricte est essentiel si vous mettez en oeuvre un mandataire direct (en définissant la directive [[13-directives/proxyrequests|ProxyRequests]] à "on"). Dans le cas contraire, votre serveur pourrait être utilisé par n'importe quel client pour accéder à des serveurs quelconques, tout en masquant sa véritable identité. Ceci représente un danger non seulement pour votre réseau, mais aussi pour l'Internet au sens large. Dans le cas de la mise en oeuvre d'un mandataire inverse (en utilisant la directive [[13-directives/proxypass|ProxyPass]] avec `ProxyRequests Off`), le contrôle d'accès est moins critique car les clients ne peuvent contacter que les serveurs que vous avez spécifiés.

**Voir aussi** la variable d'environnement [[12-modules/mod_proxy_http|Proxy-Chain-Auth]].

## Ralentissement au démarrage

Si vous utilisez la directive [[13-directives/proxyblock|ProxyBlock]], les noms d'hôtes sont résolus en adresses IP puis ces dernières mises en cache au cours du démarrage à des fins de tests de comparaisons ultérieurs. Ce processus peut durer plusieurs secondes (ou d'avantage) en fonction de la vitesse à laquelle s'effectue la résolution des noms d'hôtes.

## Mandataire en Intranet

Un serveur mandataire Apache httpd situé à l'intérieur d'un Intranet doit faire suivre les requêtes destinées à un serveur externe à travers le pare-feu de l'entreprise (pour ce faire, définissez la directive [[13-directives/proxyremote|ProxyRemote]] de façon à ce qu'elle fasse suivre le *protocole* concerné vers le mandataire du pare-feu). Cependant, lorsqu'il doit accéder à des ressources situées dans l'Intranet, il peut se passer du pare-feu pour accéder aux serveurs. A cet effet, la directive [[13-directives/noproxy|NoProxy]] permet de spécifier quels hôtes appartiennent à l'Intranet et peuvent donc être accédés directement.

Les utilisateurs d'un Intranet ont tendance à oublier le nom du domaine local dans leurs requêtes WWW, et demandent par exemple "http://un-serveur/" au lieu de `http://un-serveur.example.com/`. Certains serveurs mandataires commerciaux acceptent ce genre de requête et les traitent simplement en utilisant un nom de domaine local implicite. Lorsque la directive [[13-directives/proxydomain|ProxyDomain]] est utilisée et si le serveur est configuré comme mandataire, Apache httpd peut renvoyer une réponse de redirection et ainsi fournir au client l'adresse de serveur correcte, entièrement qualifiée. C'est la méthode à privilégier car le fichier des marque-pages de l'utilisateur contiendra alors des noms de serveurs entièrement qualifiés.

## Ajustements relatifs au protocole

Pour les cas où [[12-modules/mod_proxy|mod_proxy]] envoie des requêtes vers un serveur qui n'implémente pas correctement les connexions persistantes ou le protocole HTTP/1.1, il existe deux variables d'environnement qui permettent de forcer les requêtes à utiliser le protocole HTTP/1.0 avec connexions non persistantes. Elles peuvent être définies via la directive [[13-directives/setenv|SetEnv]].

Il s'agit des variables `force-proxy-request-1.0` et `proxy-nokeepalive`.

```apache
<Location "/buggyappserver/">
  ProxyPass "http://buggyappserver:7001/foo/"
  SetEnv force-proxy-request-1.0 1
  SetEnv proxy-nokeepalive 1
</Location>
```

Notez que `force-proxy-request-1.0` implique aussi `proxy-sendcl`, car HTTP/1.0 ne prend pas en charge l'encodage de transfert fractionné. La redirection des corps de requête fractionnés (via `proxy-sendchunked`) est désactivée si cette option est définie.

A partir de la version 2.4.26 du serveur HTTP Apache, la définition de la variable d'environnement "no-proxy" permet de désactiver [[12-modules/mod_proxy|mod_proxy]] dans le traitement de la requête courante. Cette variable doit être définie via la directive [[13-directives/setenvif|SetEnvIf]] car la directive [[13-directives/setenv|SetEnv]] n'est pas évaluée assez tôt.

## Corps de requêtes

Certaines méthodes de requêtes comme POST comportent un corps de requête. Le protocole HTTP stipule que les requêtes qui comportent un corps doivent soit utiliser un codage de transmission fractionnée (chunked transfer encoding), soit envoyer un en-tête de requête `Content-Length`. Lorsqu'il fait suivre ce genre de requête vers le serveur demandé, [[12-modules/mod_proxy_http|mod_proxy_http]] s'efforce toujours d'envoyer l'en-tête `Content-Length`. Par contre, si la taille du corps est importante, et si la requête originale utilise un codage à fractionnement, ce dernier peut aussi être utilisé dans la requête montante. Ce comportement peut être contrôlé à l'aide de [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement|variables d'environnement]]. Ainsi, si elle est définie, la variable `proxy-sendcl` assure une compatibilité maximale avec les serveurs demandés en imposant l'envoi de l'en-tête `Content-Length`, alors que `proxy-sendchunked` diminue la consommation de ressources en imposant l'utilisation d'un codage à fractionnement.

Dans certaines circonstances, le serveur doit mettre en file d'attente sur disque les corps de requêtes afin de satisfaire le traitement demandé des corps de requêtes. Par exemple, cette mise en file d'attente se produira si le corps original a été envoyé selon un codage morcelé (et possède une taille importante), alors que l'administrateur a demandé que les requêtes du serveur d'arrière-plan soient envoyées avec l'en-tête Content-Length ou en HTTP/1.0. Cette mise en file d'attente se produira aussi si le corps de la requête contient déjà un en-tête Content-Length, alors que le serveur est configuré pour filtrer les corps des requêtes entrantes.

## En-têtes de requête du mandataire inverse

Lorsqu'il est configuré en mode mandataire inverse (en utilisant par exemple la directive [[13-directives/proxypass|ProxyPass]]), [[12-modules/mod_proxy_http|mod_proxy_http]] ajoute plusieurs en-têtes de requête afin de transmettre des informations au serveur demandé. Ces en-têtes sont les suivants :

**`X-Forwarded-For`**

L'adresse IP du client.

**`X-Forwarded-Host`**

L'hôte d'origine demandé par le client dans l'en-tête de requête HTTP `Host`.

**`X-Forwarded-Server`**

Le nom d'hôte du serveur mandataire.

Ces en-têtes doivent être utilisés avec précautions sur le serveur demandé, car ils contiendront plus d'une valeur (séparées par des virgules) si la requête originale contenait déjà un de ces en-têtes. Par exemple, vous pouvez utiliser `%{X-Forwarded-For}i` dans la chaîne de format du journal du serveur demandé pour enregistrer les adresses IP des clients originaux, mais il est possible que vous obteniez plusieurs adresses si la requête passe à travers plusieurs mandataires.

Voir aussi les directives [[13-directives/proxypreservehost|ProxyPreserveHost]] et [[13-directives/proxyvia|ProxyVia]] directives, qui permettent de contrôler d'autres en-têtes de requête.

Note : Si vous devez ajouter des en-têtes particuliers à la requête mandatée, utilisez la directive [[13-directives/requestheader|RequestHeader]].

## Directives

- [[13-directives/proxy|<Proxy>]]
- [[13-directives/proxybadheader|ProxyBadHeader]]
- [[13-directives/proxymatch|<ProxyMatch>]]
- [[13-directives/proxypreservehost|ProxyPreserveHost]]
- [[13-directives/proxyrequests|ProxyRequests]]
- [[13-directives/proxyremote|ProxyRemote]]
- [[13-directives/proxyremotematch|ProxyRemoteMatch]]
- [[13-directives/balancergrowth|BalancerGrowth]]
- [[13-directives/balancerpersist|BalancerPersist]]
- [[13-directives/proxypassinherit|ProxyPassInherit]]
- [[13-directives/balancerinherit|BalancerInherit]]
- [[13-directives/balancermember|BalancerMember]]
- [[13-directives/proxyset|ProxySet]]
- [[13-directives/proxypass|ProxyPass]]
- [[13-directives/proxypassmatch|ProxyPassMatch]]
- [[13-directives/proxypassreverse|ProxyPassReverse]]
- [[13-directives/proxypassreversecookiedomain|ProxyPassReverseCookieDomain]]
- [[13-directives/proxypassreversecookiepath|ProxyPassReverseCookiePath]]
- [[13-directives/proxyblock|ProxyBlock]]
- [[13-directives/proxyreceivebuffersize|ProxyReceiveBufferSize]]
- [[13-directives/proxyiobuffersize|ProxyIOBufferSize]]
- [[13-directives/proxymaxforwards|ProxyMaxForwards]]
- [[13-directives/noproxy|NoProxy]]
- [[13-directives/proxytimeout|ProxyTimeout]]
- [[13-directives/proxydomain|ProxyDomain]]
- [[13-directives/proxyvia|ProxyVia]]
- [[13-directives/proxyerroroverride|ProxyErrorOverride]]
- [[13-directives/proxypassinterpolateenv|ProxyPassInterpolateEnv]]
- [[13-directives/proxystatus|ProxyStatus]]
- [[13-directives/proxyaddheaders|ProxyAddHeaders]]
- [[13-directives/proxy100continue|Proxy100Continue]]
- [[13-directives/proxysourceaddress|ProxySourceAddress]]

## Voir aussi

- [[12-modules/mod_cache|mod_cache]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
