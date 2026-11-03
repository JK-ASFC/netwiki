---
title: "Modèle d'exécution et points d'intégration"
description: "Nginx — Modèle d'exécution et points d'intégration. Le code JavaScript de njs ne s'exécute jamais de lui-même. nginx l'appelle à un ensemble fixe de points d'intégration, chacun lié à un gestionnaire par une directive de configuration. Il n'y a ni script de démarrage, ni…"
tags: [nginx, guide]
icon: book-open
---

Le code JavaScript de [[10-guides/04-njs/00-index|njs]] ne s'exécute jamais de lui-même. nginx l'appelle à un ensemble fixe de points d'intégration, chacun lié à un gestionnaire par une directive de configuration. Il n'y a ni script de démarrage, ni thread d'arrière-plan, ni boucle d'événements propre : nginx appelle un gestionnaire, celui-ci s'exécute, puis la main revient à nginx.

Cet article décrit quand les gestionnaires sont appelés et comment choisir le bon. Le contrat exact de chaque directive est documenté dans [[11-modules/02-http/ngx_http_js_module|ngx_http_js_module]] et [[11-modules/03-stream/ngx_stream_js_module|ngx_stream_js_module]].

## Modèle d'exécution

1. Au chargement de la configuration, la directive [[12-directives/js-import-http-js|js_import]] compile les modules JavaScript. Les erreurs de syntaxe sont signalées à ce moment, avant que nginx ne commence à servir le trafic.
2. Lorsqu'une requête ou une session stream atteint l'un des points d'intégration, un contexte JavaScript est créé, les modules importés y sont évalués et les gestionnaires configurés sont appelés.
3. À la fin de la requête ou de la session, le contexte est détruit ou, avec le moteur [[10-guides/04-njs/engine|QuickJS]], remis dans un groupe de contextes réutilisables. Rien ne lui survit, sauf les données explicitement stockées dans un [[10-guides/04-njs/reference|dictionnaire partagé]] ou envoyées ailleurs.

Le seul point d'intégration qui ne dépend pas d'une requête client est `js_periodic`, piloté par un minuteur de nginx. Le code JavaScript ne peut pas créer son propre point d'intégration : il ne peut ni ouvrir de socket d'écoute, ni lancer de thread, ni se faire rappeler en dehors des gestionnaires activés par la configuration.

## Points d'intégration HTTP

Les gestionnaires reçoivent l'objet [[10-guides/04-njs/reference|requête HTTP]] en premier argument, sauf `js_periodic`, qui reçoit un objet [[10-guides/04-njs/reference|session périodique]].

|   |   |   |
| --- | --- | --- |
| **Directive** | **Moment d'exécution** | **Opérations asynchrones** |
| [[12-directives/js-access-http-js\|js_access]] | phase d'accès, avant que la requête ne soit transmise plus loin | prises en charge |
| [[12-directives/js-content\|js_content]] | phase de contenu, à la place d'un serveur amont ou d'un fichier statique | prises en charge |
| [[12-directives/js-header-filter\|js_header_filter]] | une fois, quand l'en-tête de réponse est prêt à être envoyé | non prises en charge |
| [[12-directives/js-body-filter\|js_body_filter]] | pour chaque bloc du corps de la réponse | non prises en charge |
| [[12-directives/js-set-http-js\|js_set]] | lors du premier accès à la variable, quelle que soit la phase, ou à chaque accès avec `nocache` | non prises en charge |
| [[12-directives/js-periodic-http-js\|js_periodic]] | à intervalle régulier, sans requête client | prises en charge |

Les gestionnaires qui ne prennent pas en charge les opérations asynchrones doivent produire leur résultat avant de rendre la main : ils ne peuvent pas attendre une sous-requête, un fetch ou un minuteur. Un tel gestionnaire peut quand même être déclaré `async`, à condition que tout ce qu'il attend se résolve immédiatement.

Il n'existe pas de gestionnaire pour les phases de réécriture et de journalisation. Une variable `js_set` utilisée dans une directive de la phase correspondante est évaluée à cette phase : c'est le moyen habituel d'exécuter du code à la fin d'une requête.

## Points d'intégration stream

Les gestionnaires reçoivent l'objet [[10-guides/04-njs/reference|session stream]] en premier argument, sauf `js_periodic`, qui reçoit un objet [[10-guides/04-njs/reference|session périodique]].

|   |   |   |
| --- | --- | --- |
| **Directive** | **Moment d'exécution** | **Opérations asynchrones** |
| [[12-directives/js-access-stream-js\|js_access]] | phase d'accès | dans les fonctions de rappel de [[10-guides/04-njs/reference\|s.on()]] |
| [[12-directives/js-preread\|js_preread]] | phase de prélecture, avant la connexion au serveur amont | dans les fonctions de rappel de [[10-guides/04-njs/reference\|s.on()]] |
| [[12-directives/js-filter\|js_filter]] | phase de contenu, pour enregistrer des filtres de données dans les deux sens | non prises en charge |
| [[12-directives/js-set-stream-js\|js_set]] | lors du premier accès à la variable, quelle que soit la phase, ou à chaque accès avec `nocache` | non prises en charge |
| [[12-directives/js-periodic-stream-js\|js_periodic]] | à intervalle régulier, sans session client | prises en charge |

Les gestionnaires `js_access`, `js_preread` et `js_filter` sont appelés une fois et doivent enregistrer des fonctions de rappel [[10-guides/04-njs/reference|s.on()]] pour les données qui arrivent ensuite. Le gestionnaire lui-même doit rendre la main immédiatement.

## Choisir un point d'intégration

- **générer une réponse au lieu de la relayer**

  [[12-directives/js-content|js_content]]

- **autoriser ou refuser une requête ou une connexion, éventuellement après avoir interrogé un service externe**

  [[12-directives/js-access-http-js|js_access]] pour les requêtes, [[12-directives/js-access-stream-js|js_access]] pour les connexions, ou [[12-directives/js-preread|js_preread]] lorsque la décision dépend des données envoyées par le client

- **calculer une valeur pour une autre directive nginx**

  [[12-directives/js-set-http-js|js_set]] associe un gestionnaire à une variable : c'est ainsi qu'une valeur calculée parvient à `proxy_pass`, `log_format` et aux autres directives qui acceptent des variables. Un gestionnaire appelé plus tôt peut aussi affecter une variable déclarée avec [[12-directives/js-var-http-js|js_var]] via [[10-guides/04-njs/reference|r.variables]]

- **modifier la réponse d'un serveur amont**

  [[12-directives/js-header-filter|js_header_filter]] pour l'en-tête, [[12-directives/js-body-filter|js_body_filter]] pour le corps

- **réécrire le flux d'octets d'une connexion relayée**

  [[12-directives/js-filter|js_filter]]

- **rafraîchir un cache, interroger une API ou publier des métriques sans requête client**

  [[12-directives/js-periodic-http-js|js_periodic]]

Plusieurs gestionnaires peuvent être combinés pour une même requête, par exemple une vérification d'accès suivie d'un filtre de corps. Chacun est un appel distinct, avec ses propres contraintes.

## État et durée de vie

Le code de premier niveau des modules est évalué pour chaque nouveau contexte JavaScript, c'est-à-dire pour chaque requête ou session stream qui appelle du JavaScript. Avec le moteur [[10-guides/04-njs/engine|QuickJS]], un contexte peut être pris dans un groupe de contextes réutilisables (voir [[12-directives/js-context-reuse-http-js|js_context_reuse]]) : les modules ne sont alors pas réévalués et les modifications faites auparavant à la portée du module sont héritées.

> [!NOTE]
> Les variables de module ne peuvent donc pas servir à transmettre des données entre requêtes ni à mettre des résultats en cache : selon le moteur et la réutilisation des contextes, ces données sont soit perdues, soit héritées d'une requête sans rapport. Une initialisation coûteuse dans la portée du module est en outre payée à chaque nouveau contexte.

nginx exécute plusieurs processus de travail qui, par défaut, ne partagent pas de mémoire. Le mécanisme de njs pour partager un état entre processus est le [[10-guides/04-njs/reference|dictionnaire partagé]] défini par la directive [[12-directives/js-shared-dict-zone-http-js|js_shared_dict_zone]].

Les opérations asynchrones comme [[10-guides/04-njs/reference|ngx.fetch()]], [[10-guides/04-njs/reference|r.subrequest()]] et [[10-guides/04-njs/reference|setTimeout()]] sont pilotées par la boucle d'événements de nginx. Il n'y a pas de threads : un gestionnaire qui calcule longtemps bloque tout le processus de travail, et avec lui toutes les autres connexions qu'il sert.

## Utiliser njs en dehors de nginx

- L'[[10-guides/04-njs/cli|utilitaire en ligne de commande]] exécute njs sans nginx, ce qui est pratique pour développer et déboguer les parties d'un script qui ne dépendent pas de la requête.
- njs n'est pas Node.js. Il met en œuvre le langage ECMAScript, un ensemble de [[10-guides/04-njs/reference|modules intégrés]] et les objets nginx, mais ni l'API Node.js ni la résolution de paquets. Des bibliothèques peuvent tout de même être utilisées si elles sont regroupées à l'avance ; voir [[10-guides/04-njs/node-modules|Utiliser des modules Node avec njs]].
- Les [[10-guides/04-njs/native-modules|modules natifs]] étendent njs avec du code écrit en C. La bibliothèque partagée est chargée lors de l'analyse de la configuration, puis le module qu'elle enregistre s'importe comme n'importe quel autre module.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
