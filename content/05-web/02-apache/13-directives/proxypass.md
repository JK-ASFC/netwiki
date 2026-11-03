---
title: "ProxyPass"
description: "Directive Apache ProxyPass (mod_proxy) — Référencer des serveurs distants depuis l'espace d'URLs du serveur local. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Référencer des serveurs distants depuis l'espace d'URLs du serveur local |
| **Syntaxe** | `ProxyPass [chemin] !\|url [clé=valeur [clé=valeur ...]] [nocanon] [interpolate] [noquery]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |
| **Compatibilité** | Les sockets de style Unix (Unix Domain Socket - UDS) sont supportés à partir de la version 2.4.7 du serveur HTTP Apache |

## Utilisation

Cette directive permet de référencer des serveurs distants depuis l'espace d'URLs du serveur local. Le serveur local n'agit pas en tant que mandataire au sens conventionnel, mais plutôt comme miroir du serveur distant. Le serveur local est souvent nommé *mandataire inverse* ou *passerelle*. L'argument *chemin* est le nom d'un chemin virtuel local ; *url* est une URL partielle pour le serveur distant et ne doit pas contenir de chaîne d'arguments.

> [!NOTE]
> Il est fortement recommandé de revoir le concept de Worker avant d'aller plus loin.

> [!NOTE]
> Cette directive n'est pas supportée au sein des sections [[13-directives/directory|<Directory>]], [[13-directives/if|<If>]] et [[13-directives/files|<Files>]].

> [!WARNING]
> En général, la directive [[13-directives/proxyrequests|ProxyRequests]] doit être définie à **off** lorsqu'on utilise la directive `ProxyPass`.

Les sockets de style Unix sont supportés à partir de la version 2.4.7 du serveur HTTP Apache ; pour utiliser cette fonctionnalité, il suffit d'utiliser une URL cible préfixée par `unix:/path/lis.sock|`. Par exemple, pour mandater HTTP et cibler l'UDS /home/www.socket, vous devez utiliser `unix:/home/www.socket|http://localhost/whatever/`.

> [!NOTE]
> Le chemin associé à l'URL `unix:` tient compte de la directive `DefaultRuntimeDir`.

Lorsque cette directive est utilisée dans une section [[13-directives/location|<Location>]], le premier argument est omis et le répertoire local est obtenu à partir de l'argument de la directive [[13-directives/location|<Location>]]. Lorsque cette directive est utilisée en dehors d'une section [[13-directives/location|<Location>]] ou [[13-directives/locationmatch|<LocationMatch>]], l'argument *chemin* est requis. Il en est de même à l'intérieur d'une section [[13-directives/locationmatch|<LocationMatch>]], mais le résultat ne sera probablement pas celui attendu car ProxyPassReverse va interpréter l'expression rationnelle littéralement comme un chemin ; si besoin est dans ce cas, définissez la directive ProxyPassReverse en dehors de la section, ou dans une section [[13-directives/location|<Location>]] séparée.

Supposons que le serveur local a pour adresse `http://example.com/` ; alors la ligne

```apache
<Location "/mirror/foo/">
    ProxyPass "http://backend.example.com/"
</Location>
```

va convertir en interne toute requête pour `http://example.com/mirror/foo/bar` en une requête mandatée pour `http://backend.example.com/bar`.

Si vous avez besoin d'un configuration de mandataire inverse plus souple, reportez-vous à la documentaion de la directive [[13-directives/rewriterule|RewriteRule]] et son drapeau `[P]`.

La syntaxe alternative suivante est valide, bien qu'elle puisse induire une dégradation des performances lorsqu'elle est présente en très grand nombre. Elle possède l'avantage de permettre un contrôle dynamique via l'interface [[12-modules/mod_proxy_balancer|Balancer Manager]] :

```apache
ProxyPass "/mirror/foo/" "http://backend.example.com/"
```

> [!WARNING]
> Si le premier argument se termine par un slash **/**, il doit en être de même pour le second argument et vice versa. Dans le cas contraire, il risque de manquer des slashes nécessaires dans la requête résultante vers le serveur d'arrière-plan et les résulats ne seront pas ceux attendus.

Le drapeau `!` permet de soustraire un sous-répertoire du mandat inverse, comme dans l'exemple suivant :

```apache
<Location "/mirror/foo/">
    ProxyPass "http://backend.example.com/"
</Location>
<Location "/mirror/foo/i">
    ProxyPass "!"
</Location>
```

```apache
ProxyPass "/mirror/foo/i" "!"
ProxyPass "/mirror/foo" "http://backend.example.com"
```

va mandater toutes les requêtes pour `/mirror/foo` vers `backend.example.com`, *sauf* les requêtes pour `/mirror/foo/i`.

Mélanger plusieurs configurations ProxyPass dans différents contextes ne fonctionne pas :

```apache
ProxyPass "/mirror/foo/i" "!"
<Location "/mirror/foo/">
    ProxyPass "http://backend.example.com/"
</Location>
```

Dans ce cas, une requête pour `/mirror/foo/i` sera tout de même mandatée car c'est la directive `ProxyPass` de la section Location qui sera évaluée en premier. Le fait que la directive `ProxyPass` supporte les deux contextes serveur principal et répertoire ne signifie pas que sa portée et sa position dans le fichier de configuration va garantir une quelconque priorité et/ou chronologie de prise en compte.

> [!WARNING]
> **Ordre de classement des directives ProxyPass**
>
> Les directives [[13-directives/proxypass|ProxyPass]] et [[13-directives/proxypassmatch|ProxyPassMatch]] sont évaluées dans l'ordre de leur apparition dans le fichier de configuration. La première règle qui correspond s'applique. Vous devez donc en général classer les règles [[13-directives/proxypass|ProxyPass]] qui entrent en conflit de l'URL la plus longue à la plus courte. Dans le cas contraire, les règles situées après une règle dont l'URL correspond au début de leur propre URL seront ignorées. Notez que tout ceci est en relation avec le partage de workers.

> [!WARNING]
> **Chronologie de prise en compte des directives ProxyPass au sein des sections Locations**
>
> On ne peut placer qu'une seule directive [[13-directives/proxypass|ProxyPass]] dans une section [[13-directives/location|<Location>]], et c'est la dernière section [[13-directives/location|<Location>]] correspondante qui l'emportera, suivant en cela les règles standards de [[11-guides/01-generalites/sections-de-configuration|fusion des sections]]. Placez les sections [[13-directives/location|<Location>]] les plus spécifiques *après* les moins spécifiques afin de s'assurer que la directive [[13-directives/proxypass|ProxyPass]] attendue s'applique.

> [!WARNING]
> **Exclusions et variable d'environnement no-proxy**
>
> Les exclusions doivent se situer *avant* les directives `ProxyPass` générales. A partir de la version 2.4.26 du serveur HTTP Apache, la variable d'environnement "no-proxy" est une alternative aux exclusions et constitue le seul moyen de configurer une exclusion pour une directive `ProxyPass` dans le contexte d'une section [[13-directives/location|<Location>]]. Cette variable doit être définie via la directive [[13-directives/setenvif|SetEnvIf]] car la directive [[13-directives/setenv|SetEnv]] n'est pas évaluée assez tôt.

**ProxyPass `clé=valeur` Paramètres**

Depuis la version 2.1 du serveur HTTP Apache, mod\_proxy supporte les groupements de connexions vers un serveur d'arrière-plan. Les connexions créées à la demande peuvent être enregistrées dans un groupement pour une utilisation ultérieure. La taille du groupe ainsi que d'autres caractéristiques peuvent être définies via la directive `ProxyPass` au moyen de paramètres `clé=valeur` dont la description fait l'objet des tableaux ci-dessous.

> [!WARNING]
> **Nombre maximum de connexions vers l'arrière-plan**
>
> Par défaut, mod\_proxy permet et met en réserve le nombre maximum de connexions pouvant être utilisées simultanément par le processus enfant concerné du serveur web. Le paramètre `max` permet de réduire cette valeur par défaut. Le jeu de connexions est maintenu au niveau de chaque processus enfant du serveur web, `max` et les autres réglages n'étant pas coordonnés entre ces différents processus, sauf bien entendu lorsqu'un seul processus enfant n'est autorisé par la configuration ou le MPM utilisé.

> [!NOTE]
> **Mise en commun des connexions avec le MPM prefork**
>
> Avec le MPM prefork, les connexions avec les serveurs dorsaux ne sont pas mises en commun (chaque processus enfant gère une connexion à la fois). Les paramètres `acquire` et `ttl` qui contrôlent le comportement des pools de connexions n'ont aucun effet si on utilise prefork. Les paramètres de dimensionnement `min`, `smax` et `hmax` sont eux aussi ignorés.

Le paramètre `ttl`, quant à lui, permet de définir une durée de vie optionnelle ; les connexions qui n'ont pas été utilisées pendant au moins `ttl` secondes seront fermées. `ttl` permet aussi d'empêcher l'utilisation d'une connexion susceptible d'être fermée suite à une fin de vie de connexion persistante sur le serveur d'arrière-plan.

**Exemple**

```apache
ProxyPass "/example" "http://backend.example.com" max=20 ttl=120 retry=300
```

| Paramètres de worker (directive BalancerMember) |
| --- |

| Paramètre | Défaut | Description |
| --- | --- | --- |
| min | 0 | Nombre minimum d'entrées dans le pool de connexions, distinct du nombre de connexions effectif. La valeur par défaut ne doit être modifiée que dans des circonstances particulières où la mémoire associée aux connexions avec le serveur d'arrière-plan doit être préallouée ou réservée dans le tas. |
| max | 1...n | Nombre maximum de connexions autorisées vers le serveur d'arrière-plan. La valeur par défaut correspond au nombre de threads par processus pour le MPM (Module Multi Processus) actif. La valeur sera toujours 1 pour le MPM Prefork, alors qu'elle dépendra de la définition de la directive `ThreadsPerChild` pour les autres MPMs. |
| smax | max | Les entrées du pool de connexions conservées au delà de cette limite sont libérées au cours de certaines opérations si elles n'ont pas été utilisées au cours de leur durée de vie, définie par le paramètre `ttl`. Si l'entrée du pool de connexions est associée à une connexion, cette dernière sera fermée. La valeur par défaut ne doit être modifiée que dans des circonstances particulières où les entrées du pool de connexions et toutes connexions associées qui ont dépassé leur durée de vie doivent être libérées ou fermées de manière plus autoritaire. |
| acquire | - | Cette clé permet de définir le délai maximum d'attente pour une connexion libre dans le jeu de connexions, en millisecondes. S'il n'y a pas de connexion libre dans le jeu, Apache httpd renverra l'état `SERVER_BUSY` au client. |
| connectiontimeout | timeout | Délai d'attente d'une connexion en secondes. La durée en secondes pendant laquelle Apache httpd va attendre pour l'établissement d'une connexion vers le serveur d'arrière-plan. Le délai peut être spécifié en millisecondes en ajoutant le suffixe ms. |
| disablereuse | Off | Vous pouvez utiliser cette clé pour forcer mod\_proxy à fermer immédiatement une connexion vers le serveur d'arrière-plan après utilisation, et ainsi désactiver le jeu de connexions permanentes vers ce serveur. Ceci peut s'avérer utile dans des situations où un pare-feu situé entre Apache httpd et le serveur d'arrière-plan (quelque soit le protocole) interrompt des connexions de manière silencieuse, ou lorsque le serveur d'arrière-plan lui-même est accessible par rotation de DNS (round-robin DNS). Lorsque la réutilisation des connexions est activée, chaque domaine d'arrière-plan n'est résolu (via une requête DNS) qu'une seule fois par chaque processus enfant et mis en cache pour toutes les connexions ultérieures jusqu'au recyclage du processus concerné. Pour désactiver la réutilisation du jeu de connexions, définissez cette clé à `On`. |
| enablereuse | On | Ce paramètre est utilisé par les gestionnaires de protocole pour lesquels la réutilisation des connexions est optionnelle (comme [[12-modules/mod_proxy_fcgi\|mod_proxy_fcgi]]). C'est le contraire du paramètre 'disablereuse' ci-dessus, et il est supporté par les versions 2.4.11 et supérieures du serveur HTTP Apache. |
| flushpackets | off | Permet de définir si le module mandataire doit vider automatiquement le tampon de sortie après chaque tronçon de données. 'off' signifie que le tampon sera vidé si nécessaire ; 'on' signifie que le tampon sera vidé après chaque envoi d'un tronçon de données, et 'auto' que le tampon sera vidé après un délai de 'flushwait' millisecondes si aucune entrée n'est reçue. Actuellement, cette clé n'est supportée que par mod\_proxy\_ajp et mod\_proxy\_fcgi. |
| flushwait | 10 | Le délai d'attente pour une entrée additionnelle, en millisecondes, avant le vidage du tampon en sortie dans le cas où 'flushpackets' est à 'auto'. |
| iobuffersize | 8192 | Permet de définir la taille du tampon d'entrées/sorties du bloc-notes interne. Cette clé vous permet d'outrepasser la directive `ProxyIOBufferSize` pour un serveur cible spécifique. La valeur doit être au minimum 512 ou définie à 0 pour la valeur par défaut du système de 8192. |
| responsefieldsize | 8192 | Contrôle la taille du tampon pour le champ de la réponse mandatée. Cette taille doit être au moins égale à la taille attendue du plus grand en-tête d'une réponse mandatée. Une valeur de 0 implique l'utilisation de la valeur par défaut du système, à savoir 8192 octets. Disponible à partir de la version 2.4.34 du serveur HTTP Apache. |
| keepalive | Off | Cette clé doit être utilisée lorsque vous avez un pare-feu entre Apache httpd et le serveur d'arrière-plan, et si ce dernier tend à interrompre les connexions inactives. Cette clé va faire en sorte que le système d'exploitation envoie des messages `KEEP_ALIVE` sur chacune des connexions inactives et ainsi éviter la fermeture de la connexion par le pare-feu. Pour conserver les connexions persistantes, definissez cette propriété à `On`.  La fréquence de vérification des connexions TCP persistantes initiale et subséquentes dépend de la configuration globale de l'OS, et peut atteindre 2 heures. Pour être utile, la fréquence configurée dans l'OS doit être inférieure au seuil utilisé par le pare-feu. |
| lbset | 0 | Définit le groupe de répartition de charge dont le serveur cible est membre. Le répartiteur de charge va essayer tous les membres d'un groupe de répartition de charge de numéro inférieur avant d'essayer ceux dont le groupe possède un numéro supérieur. |
| ping | 0 | Avec la clé Ping, le serveur web va "tester" la connexion vers le serveur d'arrière-plan avant de transmettre la requête. Avec AJP, [[12-modules/mod_proxy_ajp\|mod_proxy_ajp]] envoie une requête `CPING` sur la connexion ajp13 (implémenté sur Tomcat 3.3.2+, 4.1.28+ et 5.0.13+). Avec HTTP, [[12-modules/mod_proxy_http\|mod_proxy_http]] envoie `100-Continue` au serveur d'arrière-plan (seulement avecHTTP/1.1 - pour les serveurs d'arrière-plan non HTTP/1.1, cette clé ne produit aucun effet). Dans les deux cas, ce paramètre correspond au délai en secondes pour l'attente de la réponse. Cette fonctionnalité a été ajoutée pour éviter les problèmes avec les serveurs d'arrière-plan bloqués ou surchargés. Le trafic réseau peut s'en trouver augmenté en fonctionnement normal, ce qui peut poser problème, mais peut s'en trouver diminué dans les cas où les noeuds de cluster sont arrêtés ou surchargés. Le délai peut aussi être défini en millisecondes en ajoutant le suffixe ms. |
| receivebuffersize | 0 | Définit la taille du tampon réseau explicite (TCP/IP) pour les connexions mandatées. Cette clé vous permet d'outrepasser la directive `ProxyReceiveBufferSize` pour un serveur cible spécifique. Sa valeur doit être au minimum 512 ou définie à 0 pour la valeur par défaut du système. |
| redirect | - | Route pour la redirection du serveur cible. Cette valeur est en général définie dynamiquement pour permettre une suppression sécurisée du noeud du cluster. Si cette clé est définie, toutes les requêtes sans identifiant de session seront redirigées vers le membre de groupe de répartition de charge dont la route correspond à la valeur de la clé. |
| retry | 60 | Délai entre deux essais du serveur cible du jeu de connexions en secondes. Si le serveur cible du jeu de connexions vers le serveur d'arrière-plan est dans un état d'erreur, Apache httpd ne redirigera pas de requête vers ce serveur avant l'expiration du délai spécifié. Ceci permet d'arrêter le serveur d'arrière-plan pour maintenance, et de le remettre en ligne plus tard. Une valeur de 0 implique de toujours essayer les serveurs cibles dans un état d'erreur sans délai. |
| route | - | La route du serveur cible lorsqu'il est utilisé au sein d'un répartiteur de charge. La route est une valeur ajoutée à l'identifiant de session. |
| status | - | Valeur constituée d'une simple lettre et définissant l'état initial de ce serveur cible.  \| \| \| --- \| \| D: le serveur cible est désactivé et n'accepte aucune requête. \| \| S: le serveur cible est arrêté. \| \| I: le serveur cible est en mode "erreurs ignorées", et sera toujours considéré comme disponible. \| \| R: Le serveur cible sert de remplaçant à chaud. Lorsqu'un serveur cible avec un lbset donné est inutilisable (maintenance, arrêt, en erreur, etc...), un serveur de remplacement à chaud libre de même lbset sera utilisé à sa place. Les remplaçants à chaud permettent de s'assurer qu'un nombre déterminé de serveurs cibles sera toujours disponible pour un répartiteur de charge. \| \| H: le serveur cible est en mode d'attente et ne sera utilisé que si aucun autre serveur ou remplaçant à chaud n'est disponible dans le jeu de serveurs cibles. \| \| E: le serveur cible est en erreur. \| \| N: le serveur cible est en mode vidage, n'acceptera que les sessions persistantes qui lui appartiennent, et refusera toutes les autres requêtes. \|  Une valeur d'état peut être définie (ce qui correspond au comportement par défaut) en préfixant la valeur par '+', ou annulée en préfixant la valeur par '-'. Ainsi, la valeur 'S-E' définit l'état de ce serveur cible à "arrêté" et supprime le drapeau "en-erreur". |
| D: le serveur cible est désactivé et n'accepte aucune requête. |   |   |
| S: le serveur cible est arrêté. |   |   |
| I: le serveur cible est en mode "erreurs ignorées", et sera toujours considéré comme disponible. |   |   |
| R: Le serveur cible sert de remplaçant à chaud. Lorsqu'un serveur cible avec un lbset donné est inutilisable (maintenance, arrêt, en erreur, etc...), un serveur de remplacement à chaud libre de même lbset sera utilisé à sa place. Les remplaçants à chaud permettent de s'assurer qu'un nombre déterminé de serveurs cibles sera toujours disponible pour un répartiteur de charge. |   |   |
| H: le serveur cible est en mode d'attente et ne sera utilisé que si aucun autre serveur ou remplaçant à chaud n'est disponible dans le jeu de serveurs cibles. |   |   |
| E: le serveur cible est en erreur. |   |   |
| N: le serveur cible est en mode vidage, n'acceptera que les sessions persistantes qui lui appartiennent, et refusera toutes les autres requêtes. |   |   |
| timeout | [[13-directives/proxytimeout\|ProxyTimeout]] | Délai d'attente du socket en secondes. Le nombre de secondes pendant lesquelles Apache httpd attend l'envoi de données vers le serveur d'arrière-plan. |
| ttl | - | Durée de vie des connexions inactives et des entrées du pool de connexions associées en secondes. Une fois cette limite atteinte, une connexion ne sera pas réutilisée ; elle sera fermée après un délai variable. |
| flusher | flush | Nom du fournisseur utilisé par [[12-modules/mod_proxy_fdpass\|mod_proxy_fdpass]]. Voir la documentation de ce module pour plus de détails. |
| secret | - | Le mot de passe utilisé par [[12-modules/mod_proxy_ajp\|mod_proxy_ajp]]. Il doit identique au mot de passe configuré sur le côté serveur de la connexion AJP. Disponible à partir de la version 2.4.42 du serveur HTTP Apache. |
| upgrade | - | Protocole pris en charge par [[12-modules/mod_proxy_http\|mod_proxy_http]] ou [[12-modules/mod_proxy_wstunnel\|mod_proxy_wstunnel]] pour le mécanisme de promotion de protocole HTTP lors d'une négociation du client/navigateur HTTP (en accord avec la [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110) - Upgrade). Voir la note Promotion de protocole ci-dessous |
| mapping | - | Type de mappage entre le *chemin* et l'*url*. Détermine la normalisation et/ou le (non-)décodage que [[12-modules/mod_proxy\|mod_proxy]] appliquera au *chemin de l'uri* demandé avant de rechercher une correspondance avec le *chemin*. Si un mappage correspond, il est appliqué au *chemin de l'uri* de façon à ce que tous les contextes de répertoire qui utilisent un chemin (comme `<Location>`) fassent l'objet d'une recherche de correspondance en utilisant le même mappage.  `mapping=encoded` empêche le décodage des caractères % contenus dans le *chemin de l'uri* de façon à ce que l'on puisse par exemple utiliser des configurations telles que :  ```apache ProxyPass "/special%3Fsegment" "https://example.com/special%3Fsegment" mapping=encoded ```  ```apache <Location "/special%3Fsegment"> Require ip 172.17.2.0/24 </Location> ```  `mapping=servlet` se réfère à la normalisation définie par la spécification de la Servlet qui sera par exemple appliquée par Apache Tomcat pour les conteneurs de servlet (en particulier, les paramètres du chemin sont ignorés pour le mappage). Un *chemin d'uri* comme `/some;foo/path` sera alors mappé comme `/some/path` et correspondra donc à tout ce qui suit sans tenir compte des paramètres du chemin demandé :  ```apache ProxyPass "/some/path" "https://servlet.example.com/some/path" mapping=servlet ```  ```apache <Location "/some/path"> Require valid-user </Location> ```  > [!NOTE] > **Note** > > Il est recommandé d'utiliser le même mappage côté Apache httpd que celui utilisé côté arrière-plan. Par exemple, lors de la configuration des autorisations dans les sections `<Location>` pour des chemins mappés par [[12-modules/mod_proxy\|mod_proxy]] comme conteneurs de servlet (comme les applications s'exécutant sous Apache Tomcat), on doit utiliser la définition `mapping=servlet` pour éviter que les paramètres du chemin et similaires n'interfèrent avec les autorisations qui doivent être définies par Apache httpd. |
| addressttl | -1 | Durée de vie (TTL) en secondes des résolutions DNS de l'adresse du serveur d'arrière-plan dans le cache. -1 signifie jusqu'au redémarrage de Apache httpd. |

Si l'URL de la directive Proxy débute par `balancer://` (par exemple: `balancer://cluster`, toute information relative au chemin est ignorée), alors un serveur cible virtuel ne communiquant pas réellement avec le serveur d'arrière-plan sera créé. Celui-ci sera en fait responsable de la gestion de plusieurs serveurs cibles "réels". Dans ce cas, un jeu de paramètres particuliers s'applique à ce serveur cible virtuel. Voir [[12-modules/mod_proxy_balancer|mod_proxy_balancer]] pour plus d'informations à propos du fonctionnement du répartiteur de charge.

| Paramètres du répartiteur |
| --- |

| Paramètre | Défaut | Description |
| --- | --- | --- |
| lbmethod | byrequests | Méthode de répartition de charge utilisée. Permet de sélectionner la méthode de planification de la répartition de charge à utiliser. La valeur est soit `byrequests`, pour effectuer un décompte de requêtes pondérées, soit `bytraffic`, pour effectuer une répartition en fonction du décompte des octets transmis, soit `bybusyness`, pour effectuer une répartition en fonction des requêtes en attente. La valeur par défaut est `byrequests`. |
| maxattempts | 1 de moins que le nombre de workers, ou 1 avec un seul worker | Nombre maximum d'échecs avant abandon. |
| nofailover | Off | Si ce paramètre est défini à `On`, la session va s'interrompre si le serveur cible est dans un état d'erreur ou désactivé. Définissez ce paramètre à `On` si le serveur d'arrière-plan ne supporte pas la réplication de session. |
| stickysession | - | Nom de session persistant du répartiteur. La valeur est généralement du style `JSESSIONID` ou `PHPSESSIONID`, et dépend du serveur d'application d'arrière-plan qui supporte les sessions. Si le serveur d'application d'arrière-plan utilise un nom différent pour les cookies et les identifiants codés d'URL (comme les conteneurs de servlet), séparez-les par le caractère '\|'. La première partie contient le cookie et la seconde le chemin. Disponible depuis la version 2.4.4 du serveur HTTP Apache. |
| stickysessionsep | "." | Définit le caractère de séparation dans le cookie de session. Certains serveurs d'application d'arrière-plan n'utilisent pas le caractère '.' comme séparateur. Par exemple le serveur Oracle Weblogic utilise le caractère '!'. Cette option permet d'attribuer au caractère de séparation la valeur appropriée. Si elle est définie à 'Off', aucun caractère de séparation n'est utilisé. |
| scolonpathdelim | Off | Si ce paramètre est défini à `On`, le caractère ';' sera utilisé comme séparateur de chemin de session persistante additionnel. Ceci permet principalement de simuler le comportement de mod\_jk lorsqu'on utilise des chemins du style `JSESSIONID=6736bcf34;foo=aabfa`. |
| timeout | 0 | Délai du répartiteur en secondes. Si ce paramètre est défini, sa valeur correspond à la durée maximale d'attente pour un serveur cible libre. Le comportement par défaut est de ne pas attendre. |
| failonstatus | - | Une liste de codes d'état HTTP séparés par des virgules. Si ce paramètre est présent, le worker se mettra en erreur si le serveur d'arrière-plan renvoie un des codes d'état spécifiés dans la liste. La récupération du worker s'effectue comme dans le cas des autres erreurs de worker. |
| failontimeout | Off | Si ce paramètre est défini à "On", un délai d'attente dépassé en entrée/sortie après envoi d'une requête au serveur d'arrière-plan va mettre le processus en état d'erreur. La sortie de cet état d'erreur se passe de la même façon que pour les autres erreurs. Disponible à partir de la version 2.4.5 du serveur HTTP Apache. |
| nonce | \<auto\> | Le nombre à usage unique de protection utilisé dans la page de l'application `balancer-manager`. Par défaut, la protection de la page est assurée par un nombre à usage unique automatique à base d'UUID. Si une valeur est précisée, elle sera utilisée comme nombre à usage unique. La valeur `None` désactive la vérification du nombre à usage unique.  > [!NOTE] > **Note** > > En plus du nombre à usage unique, la page de l'application `balancer-manager` peut être protégée par une ACL. |
| growth | 0 | Nombre de membres supplémentaires que l'on peut ajouter à ce répartiteur en plus de ceux définis au niveau de la configuration. |
| forcerecovery | On | Force la relance immédiate de tous les membres sans tenir compte de leur paramètre retry dans le cas où ils sont tous en état d'erreur. Il peut cependant arriver qu'un membre déjà surchargé entre dans une situation critique si la relance de tous les membres est forcée sans tenir compte du paramètre retry de chaque membre. Dans ce cas, définissez ce paramètre à `Off`. Disponible depuis la version 2.4.2 du serveur HTTP Apache. |

Exemple de configuration d'un répartiteur de charge

```apache
ProxyPass "/special-area" "http://special.example.com" smax=5 max=10
ProxyPass "/" "balancer://mycluster/" stickysession=JSESSIONID|jsessionid nofailover=On
<Proxy "balancer://mycluster">
    BalancerMember "ajp://1.2.3.4:8009"
    BalancerMember "ajp://1.2.3.5:8009" loadfactor=20
    # Less powerful server, don't send as many requests there,
    BalancerMember "ajp://1.2.3.6:8009" loadfactor=5
</Proxy>
```

La définition de remplaçants à chaud permet de s'assurer qu'un nombre déterminé de serveurs sera toujours disponible dans le jeu de serveurs cibles :

```apache
ProxyPass "/" "balancer://sparecluster/"
<Proxy balancer://sparecluster>
    BalancerMember ajp://1.2.3.4:8009
    BalancerMember ajp://1.2.3.5:8009
    # Les serveurs ci-dessous sont des remplaçants à chaud. Pour chaque serveur
    # ci-dessus qui viendrait à être inutilisable (maintenance, arrêt, non
    # contactable, en erreur, etc...), un de ces remplaçants à chaud prendra sa
    # place. Deux serveurs seront toujours disponibles pour traiter une requête
    # (à moins qu'un ou plusieurs remplaçant à chaud soit lui aussi
    # indisponible).
    BalancerMember ajp://1.2.3.6:8009 status=+R
    BalancerMember ajp://1.2.3.7:8009 status=+R
</Proxy>
```

Configuration d'un serveur cible de réserve qui ne sera utilisé que si aucun autre serveur cible ou remplaçant à chaud n'est disponible dans le jeu de serveurs cibles :

```apache
ProxyPass "/" "balancer://hotcluster/"
<Proxy "balancer://hotcluster">
    BalancerMember "ajp://1.2.3.4:8009" loadfactor=1
    BalancerMember "ajp://1.2.3.5:8009" loadfactor=2.25
    # The server below is on hot standby
    BalancerMember "ajp://1.2.3.6:8009" status=+H
    ProxySet lbmethod=bytraffic
</Proxy>
```

**Mots-clés additionnels de ProxyPass**

Normalement, mod\_proxy va mettre sous leur forme canonique les URLs traitées par ProxyPass. Mais ceci peut être incompatible avec certains serveurs d'arrière-plan, et en particulier avec ceux qui utilisent *PATH\_INFO*. Le mot-clé optionnel *nocanon* modifie ce comportement et permet de transmettre le chemin d'URL sous sa forme brute au serveur d'arrière-plan. Notez que ceci peut affecter la sécurité de votre serveur d'arrière-plan, car la protection limitée contre les attaques à base d'URL que fournit le mandataire est alors supprimée.

Par défaut, mod\_proxy inclut la chaîne de paramètres lors de la génération de la variable d'environnement *SCRIPT\_FILENAME*. Le mot-clé optionnel *noquery* (disponible à partir de la version 2.4.1) permet d'exclure cette chaîne.

Lorsque la directive ProxyPass est utilisée à l'intérieur d'une section [[13-directives/location|<Location>]], le premier argument est omis et le répertoire local est obtenu à partir de la section [[13-directives/location|<Location>]]. Il en sera de même dans une section [[13-directives/locationmatch|<LocationMatch>]] ; cependant, ProxyPass n'interprète pas les expressions rationnelles, et il sera ici nécessaire d'utiliser la directive `ProxyPassMatch` à la place.

Cette directive ne peut pas être placée dans une section [[13-directives/directory|<Directory>]] ou [[13-directives/files|<Files>]].

Si vous avez besoin d'un configuration de mandataire inverse plus souple, reportez-vous à la documentaion de la directive [[13-directives/rewriterule|RewriteRule]] et son drapeau `[P]`.

Le mot-clé optionnel `interpolate`, en combinaison avec la directive [[13-directives/proxypassinterpolateenv|ProxyPassInterpolateEnv]], permet à ProxyPass d'interpoler les variables d'environnement à l'aide de la syntaxe *${VARNAME}*. Notez que de nombreuses variables d'environnement standard dérivées de CGI n'existeront pas lorsque l'interpolation se produit ; vous devrez alors encore avoir avoir recours à [[12-modules/mod_rewrite|mod_rewrite]] pour des règles complexes. Notez aussi que l'interpolation n'est supportée dans la partie protocole/hostname/port d'une URL que pour les variables qui sont disponibles au moment où la directive est interprétée (comme pour la directive [[13-directives/define|Define]]). La détermination dynamique de ces champs peut être effectuée à l'aide de [[12-modules/mod_rewrite|mod_rewrite]], et l'exemple suivant décrit comment utiliser [[12-modules/mod_rewrite|mod_rewrite]] pour définir dynamiquement le protocole à http ou https :

```apache
RewriteEngine On

RewriteCond "%{HTTPS}" =off
RewriteRule "". "-" [E=protocol:http]
RewriteCond "%{HTTPS}" =on
RewriteRule "." "-" [E=protocol:https]

RewriteRule "^/mirror/foo/(.*)" "%{ENV:protocol}://backend.example.com/$1" [P]
ProxyPassReverse  "/mirror/foo/" "http://backend.example.com/"
ProxyPassReverse  "/mirror/foo/" "https://backend.example.com/"
```

> [!NOTE]
> **Promotion de protocole**
>
> Depuis la version 2.4.47 du serveur HTTP Apache, la promotion de protocole (tunneling) peut être géré bout à bout par [[12-modules/mod_proxy_http|mod_proxy_http]] en utilisant le paramètre *upgrade*.
>
> Bout à bout signifie que la requête de promotion de protocole en provenance du client/navigateur est tout d'abord transmise par [[12-modules/mod_proxy_http|mod_proxy_http]] au serveur origine et que le protocole de la connexion ne sera modifié (et « tunnelisé » par [[12-modules/mod_proxy_http|mod_proxy_http]]) que si le serveur origine accepte/initie la promotion (réponse HTTP `101 Switching Protocols`). Si le serveur origine renvoie une réponse différente, [[12-modules/mod_proxy_http|mod_proxy_http]] continuera la transmission en utilisant (et en forçant) le protocole HTTP habituel pour cette connexion.
>
> Voir Promotion de protocole vers Websocket (versions 2.4.47 et ultérieures) pour un exemple de configuration qui utilise[[12-modules/mod_proxy_http|mod_proxy_http]].
>
> Avec les versions 2.4.46 et antérieures du serveur HTTP Apache (ou si la directive [[13-directives/proxywebsocketfallbacktoproxyhttp|ProxyWebsocketFallbackToProxyHttp]] des versions 2.4.48 et ultérieures désactive la prise en charge par [[12-modules/mod_proxy_http|mod_proxy_http]]), voir la documentation de [[12-modules/mod_proxy_wstunnel|mod_proxy_wstunnel]] pour la méthode permettant de mandater le protocole WebSocket.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
