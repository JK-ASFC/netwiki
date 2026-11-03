---
title: "Référence"
description: "Nginx — Référence. njs fournit des objets, méthodes et propriétés pour étendre les fonctions de nginx."
tags: [nginx, guide]
icon: book-open
---

[[10-guides/04-njs/00-index|njs]] fournit des objets, méthodes et propriétés pour étendre les fonctions de nginx.

Cette référence ne contient que les propriétés, méthodes et modules propres à njs, non conformes à ECMAScript. Les définitions des propriétés et méthodes de njs conformes à ECMAScript se trouvent dans la [spécification ECMAScript](http://www.ecma-international.org/ecma-262/). La liste de toutes les propriétés et méthodes de njs figure dans [[10-guides/04-njs/compatibility|Compatibilité]].

## Objets nginx

### Requête HTTP

|   |
| --- |
| `r.args{}` |
| `r.decline()` |
| `r.done()` |
| `r.error()` |
| `r.finish()` |
| `r.headersIn{}` |
| `r.headersOut{}` |
| `r.httpVersion` |
| `r.internal` |
| `r.internalRedirect()` |
| `r.jsVarNames()` |
| `r.log()` |
| `r.method` |
| `r.parent` |
| `r.readRequestArrayBuffer()` |
| `r.readRequestForm()` |
| `r.readRequestJSON()` |
| `r.readRequestText()` |
| `r.remoteAddress` |
| `r.requestBody` |
| `r.requestBuffer` |
| `r.requestText` |
| `r.rawHeadersIn[]` |
| `r.rawHeadersOut[]` |
| `r.responseBody` |
| `r.responseBuffer` |
| `r.responseText` |
| `r.return()` |
| `r.send()` |
| `r.sendBuffer()` |
| `r.sendHeader()` |
| `r.setReturnValue()` |
| `r.status` |
| `r.subrequest()` |
| `r.uri` |
| `r.rawVariables{}` |
| `r.variables{}` |
| `r.warn()` |

L'objet requête HTTP n'est disponible que dans le module [[11-modules/02-http/ngx_http_js_module|ngx_http_js_module]]. Avant la version 0.8.5, toutes les propriétés chaîne de l'objet étaient des chaînes d'octets.

- **`r.args{}`**

  objet des arguments de la requête, en lecture seule.

  La chaîne de requête est renvoyée sous forme d'objet. Depuis la version 0.7.6, les clés en double sont renvoyées sous forme de tableau, les clés sont sensibles à la casse, et clés comme valeurs sont décodées (percent-decoding).

  Par exemple, la chaîne de requête

  ```nginx
  'a=1&b=%32&A=3&b=4&B=two%20words'
  ```

  est convertie en `r.args` ainsi :

  ```nginx
  {a: "1", b: ["2", "4"], A: "3", B: "two words"}
  ```

  Des analyses plus élaborées sont possibles avec le module Query String et la variable [[13-variables/args|$args]], par exemple :

  ```nginx
  import qs from 'querystring';

  function args(r) {
      return qs.parse(r.variables.args);
  }
  ```

  L'objet des arguments est évalué au premier accès à `r.args`. Si un seul argument est nécessaire, par exemple `foo`, on peut utiliser les variables nginx :

  ```nginx
  r.variables.arg_foo
  ```

  Ici, l'objet des variables nginx renvoie la première valeur pour une clé donnée, sans tenir compte de la casse et sans décodage.

  Pour reconvertir `r.args` en chaîne, on peut utiliser la méthode `stringify` de Query String.

- **`r.decline()`**

  fait que le gestionnaire [[12-directives/js-access-http-js|js_access]] ne se prononce pas sur l'accès et laisse la décision aux autres vérificateurs sous [[12-directives/satisfy|satisfy any]] (0.9.9). Un gestionnaire qui rend la main sans appeler `r.decline()` ni `r.return()` accorde implicitement l'accès. Ne peut être appelée que depuis la fonction [[12-directives/js-access-http-js|js_access]].

- **`r.done()`**

  après l'appel de cette fonction, les blocs de données suivants sont transmis au client sans appeler [[12-directives/js-body-filter|js_body_filter]] (0.5.2). Ne peut être appelée que depuis la fonction [[12-directives/js-body-filter|js_body_filter]]

- **`r.error(string)`**

  écrit une `string` dans le journal d'erreurs au niveau `error`

  > [!NOTE]
  > Comme nginx a une longueur de ligne maximale [[10-guides/06-developpement/development-guide|codée en dur]], seuls les 2048 premiers octets de la chaîne peuvent être journalisés.

- **`r.finish()`**

  termine l'envoi de la réponse au client

- **`r.headersIn{}`**

  objet des en-têtes entrants, en lecture seule.

  L'en-tête de requête `Foo` est accessible avec la syntaxe : `headersIn.foo` ou `headersIn['Foo']`.

  Les en-têtes de requête `Authorization`, `Content-Length`, `Content-Range`, `Content-Type`, `ETag`, `Expect`, `From`, `Host`, `If-Match`, `If-Modified-Since`, `If-None-Match`, `If-Range`, `If-Unmodified-Since`, `Max-Forwards`, `Proxy-Authorization`, `Referer`, `Transfer-Encoding` et `User-Agent` ne peuvent avoir qu'une valeur (0.4.1). Les valeurs en double des en-têtes `Cookie` sont séparées par un point-virgule (`;`). Celles de tous les autres en-têtes de requête sont séparées par des virgules.

- **`r.headersOut{}`**

  objet des en-têtes sortants de la requête principale, modifiable.

  Si `r.headersOut{}` est l'objet réponse d'une sous-requête, il représente les en-têtes de réponse. Dans ce cas, les valeurs des en-têtes de réponse `Accept-Ranges`, `Connection`, `Content-Disposition`, `Content-Encoding`, `Content-Length`, `Content-Range`, `Date`, `Keep-Alive`, `Server`, `Transfer-Encoding`, `X-Accel-*` peuvent être omises.

  L'en-tête de réponse `Foo` est accessible avec la syntaxe : `headersOut.foo` ou `headersOut['Foo']`.

  Les en-têtes sortants doivent être définis avant l'envoi de l'en-tête de réponse au client, sinon la modification est ignorée. `r.headersOut{}` n'est donc réellement modifiable que dans :

  - le gestionnaire [[12-directives/js-content|js_content]], avant l'appel de `r.sendHeader()` ou `r.return()`
  - le gestionnaire [[12-directives/js-header-filter|js_header_filter]]

  Les valeurs des en-têtes de réponse multivaleurs (0.4.0) se définissent avec la syntaxe :

  ```nginx
  r.headersOut['Foo'] = ['a', 'b']
  ```

  ce qui donne en sortie :

  ```nginx
  Foo: a
  Foo: b
  ```

  Toutes les valeurs précédentes de l'en-tête de réponse `Foo` sont supprimées.

  Pour les en-têtes de réponse standard qui n'acceptent qu'une valeur, comme `Content-Type`, seul le dernier élément du tableau est pris en compte. Les valeurs de l'en-tête de réponse `Set-Cookie` sont toujours renvoyées sous forme de tableau. Les valeurs en double des en-têtes de réponse `Age`, `Content-Encoding`, `Content-Length`, `Content-Type`, `ETag`, `Expires`, `Last-Modified`, `Location`, `Retry-After` sont ignorées. Celles de tous les autres en-têtes de réponse sont séparées par des virgules.

- **`r.httpVersion`**

  version HTTP, en lecture seule

- **`r.internal`**

  booléen, vrai pour les locations [[12-directives/internal|internal]]

- **`r.internalRedirect(uri)`**

  effectue une [[10-guides/06-developpement/development-guide|redirection interne]] vers l'`uri` indiquée. Si l'URI commence par le préfixe « `@` », elle est considérée comme une location nommée. Dans la nouvelle location, tout le traitement de la requête est repris à partir de [[10-guides/06-developpement/development-guide|NGX_HTTP_SERVER_REWRITE_PHASE]] pour les locations ordinaires et de [[10-guides/06-developpement/development-guide|NGX_HTTP_REWRITE_PHASE]] pour les locations nommées. En conséquence, une redirection vers une location nommée ne vérifie pas la limite [[12-directives/client-max-body-size|client_max_body_size]]. Voir le [[10-guides/06-developpement/development-guide|guide du développeur]] pour plus de détails. Les requêtes redirigées deviennent internes et peuvent accéder aux locations [[12-directives/internal|internal]]. La redirection effective a lieu après la fin de l'exécution du gestionnaire.

  > [!NOTE]
  > Après la redirection, une nouvelle machine virtuelle njs démarre dans la location cible et celle de la location d'origine est arrêtée. Les valeurs des variables nginx sont conservées et peuvent servir à transmettre des informations à la location cible. Depuis la version 0.5.3, la variable déclarée avec la directive `js_var` pour [[12-directives/js-var-http-js|http]] ou [[12-directives/js-var-stream-js|stream]] peut être utilisée.

  > [!NOTE]
  > Depuis la version 0.7.4, la méthode accepte les URI échappées.

- **`r.log(string)`**

  écrit une `string` dans le journal d'erreurs au niveau `info`

  > [!NOTE]
  > Comme nginx a une longueur de ligne maximale [[10-guides/06-developpement/development-guide|codée en dur]], seuls les 2048 premiers octets de la chaîne peuvent être journalisés.

- **`r.method`**

  méthode HTTP, en lecture seule

- **`r.parent`**

  référence l'objet requête parent pour un objet réponse de sous-requête reçu via une fonction de rappel de fin ou la `Promise` renvoyée par `r.subrequest()`. Pour un objet requête passé à un gestionnaire JavaScript, y compris un gestionnaire de sous-requête, renvoie `undefined`.

- **`r.remoteAddress`**

  adresse du client, en lecture seule

- **`r.readRequestArrayBuffer()`**

  renvoie une `Promise` résolue avec le corps de la requête client sous forme d'`ArrayBuffer` (0.9.9). Voir `r.readRequestText()` pour la disponibilité, la mise en cache du corps et la concurrence.

- **`r.readRequestForm([options])`**

  lit le corps de la requête client et l'analyse comme un formulaire HTML ; renvoie une `Promise` résolue avec un objet formulaire (0.9.9). Types de contenu pris en charge : `application/x-www-form-urlencoded` et `multipart/form-data`.

  L'objet formulaire fournit les méthodes suivantes :

  - **`get(name)`**

    renvoie la première valeur de *name*, ou `null` si elle est absente.

  - **`getAll(name)`**

    renvoie un tableau de toutes les valeurs de *name*.

  - **`has(name)`**

    renvoie `true` s'il existe au moins une entrée pour *name*.

  - **`forEach(callback[, thisArg])`**

    appelle *callback* pour chaque entrée avec les arguments `(value, key, form)`.

  - **`hasFiles()`**

    renvoie `true` si le formulaire contient des parties fichier.

  Pour les champs texte, les valeurs sont des chaînes décodées. Pour les parties fichier, la valeur est un objet dont la propriété `name` contient le nom de fichier fourni par le client ; le contenu du fichier n'est pas exposé. Ce nom de fichier, fourni par le client, n'est pas assaini.

  L'objet facultatif *options* accepte les propriétés suivantes :

  - **`maxKeys` *number***

    nombre maximal de champs à analyser, `128` par défaut. Dépasser la limite rejette la promesse renvoyée.

  Voir `r.readRequestText()` pour la disponibilité, la mise en cache du corps et la concurrence. Le formulaire analysé est lui-même mis en cache dans la requête : un appel ultérieur renvoie le même objet formulaire et ignore tout nouvel argument *options*.

- **`r.readRequestJSON()`**

  renvoie une `Promise` résolue avec le corps de la requête client analysé en JSON (0.9.9). Voir `r.readRequestText()` pour la disponibilité, la mise en cache du corps et la concurrence.

- **`r.readRequestText()`**

  renvoie une `Promise` résolue avec le corps de la requête client sous forme de chaîne (0.9.9). La taille du corps est limitée par [[12-directives/client-max-body-size|client_max_body_size]]. La méthode est disponible dans les directives [[12-directives/js-access-http-js|js_access]] et [[12-directives/js-content|js_content]].

  Le corps est lu une fois et mis en cache dans la requête : les appels suivants à `r.readRequestText()`, `r.readRequestArrayBuffer()`, `r.readRequestJSON()` ou `r.readRequestForm()` sont résolus à partir du corps en cache, sans relecture réseau. Un second appel lancé alors qu'une lecture précédente est en cours lève `"request body is already being read"`.

  Notez que les octets invalides en UTF-8 peuvent être convertis en caractère de remplacement.

- **`r.requestBody`**

  la propriété est devenue obsolète en 0.5.0 et a été supprimée en 0.8.0. Utilisez plutôt la propriété `r.requestBuffer` ou `r.requestText`.

- **`r.requestBuffer`**

  corps de la requête client s'il n'a pas été écrit dans un fichier temporaire (depuis 0.5.0). Pour garantir que le corps est en mémoire, limitez sa taille avec [[12-directives/client-max-body-size|client_max_body_size]] et fixez une taille de tampon suffisante avec [[12-directives/client-body-buffer-size|client_body_buffer_size]]. La propriété n'est disponible que dans la directive [[12-directives/js-content|js_content]]. Pour un accès asynchrone, ou dans [[12-directives/js-access-http-js|js_access]], voir `r.readRequestText()` et les autres méthodes « `r.readRequest*()` ».

- **`r.requestText`**

  comme `r.requestBuffer`, mais renvoie une `string`. Notez que les octets invalides en UTF-8 peuvent être convertis en caractère de remplacement. Pour un accès asynchrone, ou dans [[12-directives/js-access-http-js|js_access]], voir `r.readRequestText()`.

- **`r.rawHeadersIn[]`**

  renvoie un tableau de paires clé-valeur exactement telles que reçues du client (0.4.1).

  Par exemple, avec les en-têtes de requête suivants :

  ```nginx
  Host: localhost
  Foo:  bar
  foo:  bar2
  ```

  la sortie de `r.rawHeadersIn` sera :

  ```nginx
  [
      ['Host', 'localhost'],
      ['Foo', 'bar'],
      ['foo', 'bar2']
  ]
  ```

  Tous les en-têtes `foo` peuvent être collectés avec la syntaxe :

  ```nginx
  r.rawHeadersIn.filter(v=>v[0].toLowerCase() == 'foo').map(v=>v[1])
  ```

  la sortie sera :

  ```nginx
  ['bar', 'bar2']
  ```

  Les noms des champs d'en-tête ne sont pas convertis en minuscules et les valeurs en double ne sont pas fusionnées.

- **`r.rawHeadersOut[]`**

  renvoie un tableau de paires clé-valeur des en-têtes de réponse (0.4.1). Les noms des champs ne sont pas convertis en minuscules et les valeurs en double ne sont pas fusionnées.

- **`r.responseBody`**

  la propriété est devenue obsolète en 0.5.0 et a été supprimée en 0.8.0. Utilisez plutôt la propriété `r.responseBuffer` ou `r.responseText`.

- **`r.responseBuffer`**

  contient le corps de la réponse de la sous-requête, en lecture seule (depuis 0.5.0). La taille de `r.responseBuffer` est limitée par la directive [[12-directives/subrequest-output-buffer-size|subrequest_output_buffer_size]].

- **`r.responseText`**

  comme `r.responseBuffer`, mais renvoie une chaîne (depuis 0.5.0). Notez que les octets invalides en UTF-8 peuvent être convertis en caractère de remplacement.

- **`r.return(status[, string | Buffer])`**

  envoie au client la réponse complète avec le `status` indiqué. La réponse peut être une chaîne ou un Buffer (0.5.0).

  Peut être appelée depuis le gestionnaire [[12-directives/js-content|js_content]] ou, depuis la version 0.9.9, [[12-directives/js-access-http-js|js_access]].

  On peut indiquer en second argument soit une URL de redirection (pour les codes 301, 302, 303, 307 et 308), soit le texte du corps de réponse (pour les autres codes)

- **`r.send(string | Buffer)`**

  envoie une partie du corps de la réponse au client. Les données envoyées peuvent être une chaîne ou un Buffer (0.5.0)

- **`r.sendBuffer(data[, options])`**

  ajoute des données à la chaîne des blocs de données à transmettre au filtre de corps suivant (0.5.2). La transmission effective a lieu plus tard, quand tous les blocs de la chaîne courante ont été traités.

  Les données peuvent être une chaîne ou un Buffer. `options` est un objet qui permet de remplacer les indicateurs de tampon nginx issus du tampon de données entrant. Les indicateurs suivants peuvent être remplacés :

  - **`last`**

    booléen, vrai si le tampon est le dernier

  - **`flush`**

    booléen, vrai si le tampon doit porter l'indicateur `flush`

  La méthode ne peut être appelée que depuis la fonction [[12-directives/js-body-filter|js_body_filter]].

- **`r.sendHeader()`**

  envoie les en-têtes HTTP au client

- **`r.setReturnValue(value)`**

  définit la valeur de retour du gestionnaire [[12-directives/js-set-http-js|js_set]] (0.7.0).

  La méthode est devenue obsolète en 0.9.5. Depuis cette version, un gestionnaire `async` peut renvoyer sa valeur avec une instruction return ordinaire :

  ```nginx
  async function js_set(r) {
      const digest = await crypto.subtle.digest('SHA-256', r.headersIn.host);
      return Buffer.from(digest).toString('hex');
  }
  ```

- **`r.status`**

  état, modifiable

- **`r.subrequest(uri[, options[, callback]])`**

  crée une sous-requête avec l'`uri` et les `options` données, et installe une fonction de rappel de fin `callback` facultative.

  Une sous-requête partage ses en-têtes d'entrée avec la requête client. Pour envoyer à un serveur mandaté des en-têtes différents des originaux, utilisez la directive [[12-directives/proxy-set-header|proxy_set_header]]. Pour lui envoyer un tout nouvel ensemble d'en-têtes, utilisez la directive [[12-directives/proxy-pass-request-headers|proxy_pass_request_headers]].

  Si `options` est une chaîne, elle contient la chaîne des arguments de la sous-requête. Sinon, `options` doit être un objet avec les clés suivantes :

  - **`args`**

    chaîne des arguments, chaîne vide par défaut

  - **`body`**

    corps de la requête, par défaut celui de l'objet requête parent

  - **`method`**

    méthode HTTP, `GET` par défaut

  - **`detached`**

    booléen (0.3.9) ; si `true`, la sous-requête créée est détachée. Les réponses aux sous-requêtes détachées sont ignorées. Contrairement aux sous-requêtes ordinaires, une sous-requête détachée peut être créée dans un gestionnaire de variable. L'indicateur `detached` et l'argument callback sont mutuellement exclusifs.

  La fonction de rappel de fin `callback` reçoit un objet réponse de sous-requête dont les méthodes et propriétés sont identiques à celles de l'objet requête parent.

  Depuis la version 0.3.8, si aucun `callback` n'est fourni, un objet `Promise` résolu avec l'objet réponse de la sous-requête est renvoyé.

  Par exemple, pour afficher tous les en-têtes de réponse de la sous-requête :

  ```nginx
  async function handler(r) {
      const reply = await r.subrequest('/path');

      for (const h in reply.headersOut) {
          r.log(`${h}: ${reply.headersOut[h]}`);
      }

      r.return(200);
  }
  ```

- **`r.uri`**

  [[13-variables/uri|URI]] courante de la requête, [[12-directives/location|normalisée]], en lecture seule

- **`r.rawVariables{}`**

  variables nginx sous forme de Buffers, modifiables (depuis 0.5.0)

- **`r.jsVarNames([prefix])`**

  renvoie un nouveau tableau des noms des variables nginx déclarées avec la directive [[12-directives/js-var-http-js|js_var]] (depuis 0.9.9). L'argument facultatif *prefix* doit être une chaîne ; s'il est indiqué, seuls les noms commençant par ce préfixe sont renvoyés.

- **`r.variables{}`**

  objet des variables nginx, modifiable (depuis 0.2.8).

  Par exemple, pour obtenir la variable `$foo`, l'une des syntaxes suivantes peut être utilisée :

  ```nginx
  r.variables['foo']
  r.variables.foo
  ```

  Depuis la version 0.8.6, les captures d'expressions régulières sont accessibles avec la syntaxe suivante :

  ```nginx
  r.variables['1']
  r.variables[1]
  ```

  nginx traite différemment les variables référencées dans `nginx.conf` et les autres. Une variable référencée peut être mise en cache, une variable non référencée ne l'est jamais. Par exemple, quand la variable [[13-variables/request-id|$request_id]] n'est lue que depuis njs, elle a une nouvelle valeur à chaque évaluation. Mais quand [[13-variables/request-id|$request_id]] est référencée, par exemple :

  ```nginx
  proxy_set_header X-Request-Id $request_id;
  ```

  `r.variables.request_id` renvoie la même valeur à chaque fois.

  Une variable est modifiable si :

  - elle a été créée avec la directive `js_var` pour [[12-directives/js-var-http-js|http]] ou [[12-directives/js-var-stream-js|stream]] (depuis 0.5.3)
  - elle est référencée dans le fichier de configuration de nginx

  Même ainsi, certaines variables intégrées ne peuvent toujours pas recevoir de valeur (par exemple [[11-modules/02-http/ngx_http_core_module|$http_]]).

- **`r.warn(string)`**

  écrit une `string` dans le journal d'erreurs au niveau `warning`

  > [!NOTE]
  > Comme nginx a une longueur de ligne maximale [[10-guides/06-developpement/development-guide|codée en dur]], seuls les 2048 premiers octets de la chaîne peuvent être journalisés.

### Session stream

|   |
| --- |
| `s.allow()` |
| `s.decline()` |
| `s.deny()` |
| `s.done()` |
| `s.error()` |
| `s.jsVarNames()` |
| `s.log()` |
| `s.off()` |
| `s.on()` |
| `s.remoteAddress` |
| `s.rawVariables{}` |
| `s.send()` |
| `s.sendDownstream()` |
| `s.sendUpstream()` |
| `s.status` |
| `s.setReturnValue()` |
| `s.variables{}` |
| `s.warn()` |

L'objet session stream n'est disponible que dans le module [[11-modules/03-stream/ngx_stream_js_module|ngx_stream_js_module]]. Avant la version 0.8.5, toutes les propriétés chaîne de l'objet étaient des chaînes d'octets.

- **`s.allow()`**

  alias de `s.done(0)` (0.2.4)

- **`s.decline()`**

  alias de `s.done(-5)` (0.2.4)

- **`s.deny()`**

  alias de `s.done(403)` (0.2.4)

- **`s.done([code]`)**

  fixe le `code` de sortie du gestionnaire de la [[10-guides/03-stream/stream-processing|phase]] courante, `0` par défaut. La finalisation effective a lieu quand le gestionnaire js est terminé et que tous les événements en attente, par exemple de `ngx.fetch()` ou `setTimeout()`, sont traités (0.2.4).

  Valeurs possibles du code :

  - `0` — finalisation réussie, passage à la phase suivante
  - `-5` — indécis, passage au gestionnaire suivant de la phase courante (s'il existe)
  - `403` — accès interdit

  Ne peut être appelée que depuis une fonction de gestionnaire de phase : [[12-directives/js-access-stream-js|js_access]] ou [[12-directives/js-preread|js_preread]].

- **`s.error(string)`**

  écrit la `string` envoyée dans le journal d'erreurs au niveau `error`

  > [!NOTE]
  > Comme nginx a une longueur de ligne maximale [[10-guides/06-developpement/development-guide|codée en dur]], seuls les 2048 premiers octets de la chaîne peuvent être journalisés.

- **`s.log(string)`**

  écrit la *string* envoyée dans le journal d'erreurs au niveau `info`

  > [!NOTE]
  > Comme nginx a une longueur de ligne maximale [[10-guides/06-developpement/development-guide|codée en dur]], seuls les 2048 premiers octets de la chaîne peuvent être journalisés.

- **`s.off(eventName)`**

  désenregistre la fonction de rappel définie par la méthode s.on() (0.2.4)

- **`s.on(event, callback)`**

  enregistre une fonction de rappel `callback` pour l'`event` indiqué (0.2.4).

  Un `event` peut être l'une des chaînes suivantes :

  - **`upload`**

    nouvelles données (chaîne) venant d'un client

  - **`download`**

    nouvelles données (chaîne) destinées à un client

  - **`upstream`**

    nouvelles données (Buffer) venant d'un client (depuis 0.5.0)

  - **`downstream`**

    nouvelles données (Buffer) destinées à un client (depuis 0.5.0)

  La fonction de rappel a le prototype suivant : `callback(data, flags)`, où `data` est une chaîne ou un Buffer (selon le type d'événement) et `flags` un objet avec les propriétés suivantes :

  - **`last`**

    un booléen, vrai si les données sont le dernier tampon.

- **`s.remoteAddress`**

  adresse du client, en lecture seule

- **`s.rawVariables`**

  variables nginx sous forme de Buffers, modifiables (depuis 0.5.0)

- **`s.jsVarNames([prefix])`**

  renvoie un nouveau tableau des noms des variables nginx déclarées avec la directive [[12-directives/js-var-stream-js|js_var]] (depuis 0.9.9). L'argument facultatif *prefix* doit être une chaîne ; s'il est indiqué, seuls les noms commençant par ce préfixe sont renvoyés.

- **`s.send(data[, options])`**

  ajoute des données à la chaîne des blocs de données à transmettre dans le sens courant : vers le client dans un rappel de téléchargement, vers un serveur amont dans un envoi (0.2.4). La transmission effective a lieu plus tard, quand tous les blocs de la chaîne courante ont été traités.

  Les données peuvent être une chaîne ou un Buffer (0.5.0). `options` est un objet qui permet de remplacer les indicateurs de tampon nginx issus du tampon de données entrant. Les indicateurs suivants peuvent être remplacés :

  - **`last`**

    booléen, vrai si le tampon est le dernier

  - **`flush`**

    booléen, vrai si le tampon doit porter l'indicateur `flush`

  La méthode peut être appelée plusieurs fois par invocation de la fonction de rappel.

- **`s.sendDownstream()`**

  identique à s.send(), sauf qu'elle envoie toujours les données vers le client (depuis 0.7.8).

- **`s.sendUpstream()`**

  identique à s.send(), sauf qu'elle envoie toujours les données depuis le client (depuis 0.7.8).

- **`s.status`**

  code d'état de la session, alias de la variable [[13-variables/status-stream-core|$status]], en lecture seule (depuis 0.5.2)

- **`s.setReturnValue(value)`**

  définit la valeur de retour du gestionnaire [[12-directives/js-set-stream-js|js_set]] (0.7.0).

  La méthode est devenue obsolète en 0.9.5. Depuis cette version, un gestionnaire `async` peut renvoyer sa valeur avec une instruction return ordinaire :

  ```nginx
  async function js_set(s) {
      const digest = await crypto.subtle.digest('SHA-256', s.remoteAddress);
      return Buffer.from(digest).toString('hex');
  }
  ```

- **`s.variables{}`**

  objet des variables nginx, modifiable (depuis 0.2.8). Une variable n'est modifiable que si elle est référencée dans le fichier de configuration de nginx. Même ainsi, certaines variables intégrées ne peuvent toujours pas recevoir de valeur.

- **`s.warn(string)`**

  écrit la `string` envoyée dans le journal d'erreurs au niveau `warning`

  > [!NOTE]
  > Comme nginx a une longueur de ligne maximale [[10-guides/06-developpement/development-guide|codée en dur]], seuls les 2048 premiers octets de la chaîne peuvent être journalisés.

### Session périodique

|   |
| --- |
| `PeriodicSession.rawVariables{}` |
| `PeriodicSession.variables{}` |

L'objet `Periodic Session` est fourni en premier argument au gestionnaire `js_periodic` pour [[12-directives/js-periodic-http-js|http]] et [[12-directives/js-periodic-stream-js|stream]] (depuis 0.8.1).

- **`PeriodicSession.rawVariables{}`**

  variables nginx sous forme de Buffers, modifiables.

- **`PeriodicSession.variables{}`**

  objet des variables nginx, modifiable.

### En-têtes

|   |
| --- |
| `Headers()` |
| `Headers.append()` |
| `Headers.delete()` |
| `Headers.get()` |
| `Headers.getAll()` |
| `Headers.forEach()` |
| `Headers.has()` |
| `Headers.set()` |

L'interface `Headers` de l'`API Fetch` est disponible depuis la version 0.5.1.

Un nouvel objet `Headers` peut être créé avec le constructeur `Headers()` (depuis 0.7.10) :

- **`Headers([init])`**

  - **`init`**

    Objet contenant des en-têtes HTTP pour préremplir l'objet `Headers` : une `string`, un `array` de paires nom-valeur ou un objet `Headers` existant.

Un nouvel objet `Headers` peut être créé avec les propriétés et méthodes suivantes :

- **`append()`**

  Ajoute une nouvelle valeur à un en-tête existant de l'objet `Headers`, ou ajoute l'en-tête s'il n'existe pas (depuis 0.7.10).

- **`delete()`**

  Supprime un en-tête de l'objet `Headers` (depuis 0.7.10).

- **`get()`**

  Renvoie une chaîne contenant les valeurs de tous les en-têtes du nom indiqué, séparées par une virgule et un espace.

- **`getAll(name)`**

  Renvoie un tableau des valeurs de tous les en-têtes du nom indiqué.

- **`forEach()`**

  Exécute une fonction donnée une fois pour chaque paire clé/valeur de l'objet `Headers` (depuis 0.7.10).

- **`has()`**

  Renvoie un booléen indiquant si un en-tête du nom indiqué existe.

- **`set()`**

  Définit une nouvelle valeur pour un en-tête existant de l'objet `Headers`, ou ajoute l'en-tête s'il n'existe pas (depuis 0.7.10).

### Requête

|   |
| --- |
| `Request()` |
| `Request.arrayBuffer()` |
| `Request.bodyUsed` |
| `Request.cache` |
| `Request.credentials` |
| `Request.headers` |
| `Request.json()` |
| `Request.method` |
| `Request.mode` |
| `Request.text()` |
| `Request.url` |

L'interface `Request` de l'`API Fetch` est disponible depuis la version 0.7.10.

Un nouvel objet `Request` peut être créé avec le constructeur `Request()` :

- **`Request[resource[, options]])`**

  Crée un objet `Request` qui pourra ensuite être passé à `ngx.fetch()`. `resource` peut être une URL ou un objet `Request` existant. `options` est un argument facultatif, un objet avec les clés suivantes :

  - **`body`**

    Corps de la requête, vide par défaut.

  - **`headers`**

    Objet des en-têtes de réponse — objet contenant des en-têtes HTTP pour préremplir l'objet `Headers` : une `string`, un `array` de paires nom-valeur ou un objet `Headers` existant.

  - **`method`**

    Méthode HTTP, GET par défaut.

Un nouvel objet `Request` peut être créé avec les propriétés et méthodes suivantes :

- **`arrayBuffer()`**

  Renvoie une `Promise` résolue avec un `ArrayBuffer`.

- **`bodyUsed`**

  Booléen, `true` si le corps a été utilisé dans la requête.

- **`cache`**

  Contient le mode de cache de la requête.

- **`credentials`**

  Contient les identifiants (credentials) de la requête, `same-origin` par défaut.

- **`headers`**

  Objet `Headers` en lecture seule associé à la `Request`.

- **`json()`**

  Renvoie une `Promise` résolue avec le résultat de l'analyse JSON du corps de la requête.

- **`method`**

  Contient la méthode de la requête.

- **`mode`**

  Contient le mode de la requête.

- **`text()`**

  Renvoie une `Promise` résolue avec une représentation textuelle du corps de la requête.

- **`url`**

  Contient l'URL de la requête.

### Réponse

|   |
| --- |
| `Response()` |
| `Response.arrayBuffer()` |
| `Response.bodyUsed` |
| `Response.headers` |
| `Response.json()` |
| `Response.ok` |
| `Response.redirected` |
| `Response.status` |
| `Response.statusText` |
| `Response.text()` |
| `Response.type` |
| `Response.url` |

L'interface `Response` est disponible depuis la version 0.5.1.

Un nouvel objet `Response` peut être créé avec le constructeur `Response()` (depuis 0.7.10) :

- **`Response[body[, options]])`**

  Crée un objet `Response`. `body` est un argument facultatif, `string` ou `buffer`, `null` par défaut. `options` est un argument facultatif, un objet avec les clés suivantes :

  - **`headers`**

    Objet des en-têtes de réponse — objet contenant des en-têtes HTTP pour préremplir l'objet `Headers` : une `string`, un `array` de paires nom-valeur ou un objet `Headers` existant.

  - **`status`**

    Code d'état de la réponse.

  - **`statusText`**

    Message d'état correspondant au code d'état.

Un nouvel objet `Response()` peut être créé avec les propriétés et méthodes suivantes :

- **`arrayBuffer()`**

  Lit un flux `Response` jusqu'au bout. Renvoie une `Promise` résolue avec un `ArrayBuffer`.

- **`bodyUsed`**

  Booléen, `true` si le corps a été lu.

- **`headers`**

  Objet `Headers` en lecture seule associé à la `Response`.

- **`json()`**

  Lit un flux `Response` jusqu'au bout. Renvoie une `Promise` résolue avec le résultat de l'analyse JSON du texte du corps.

- **`ok`**

  Booléen, `true` si la réponse a réussi (codes d'état de 200 à 299).

- **`redirected`**

  Booléen, `true` si la réponse résulte d'une redirection.

- **`status`**

  Code d'état de la réponse.

- **`statusText`**

  Message d'état correspondant au code d'état.

- **`text()`**

  Lit un flux `Response` jusqu'au bout. Renvoie une `Promise` résolue avec une chaîne.

- **`type`**

  Type de la réponse.

- **`url`**

  URL de la réponse.

### ngx

|   |
| --- |
| `ngx.build` |
| `ngx.conf_file_path` |
| `ngx.conf_prefix` |
| `ngx.error_log_path` |
| `ngx.fetch()` |
| `ngx.log()` |
| `ngx.prefix` |
| `ngx.version` |
| `ngx.version_number` |
| `ngx.worker_id` |

L'objet global `ngx` est disponible depuis la version 0.5.0.

- **`ngx.build`**

  chaîne contenant le nom de build facultatif de nginx, correspondant à l'argument [[10-guides/01-introduction/configure|--build=name]] du script [[10-guides/01-introduction/configure|configure]], `""` par défaut (0.8.0)

- **`ngx.conf_file_path`**

  chaîne contenant le chemin du fichier de configuration courant de nginx (0.8.0)

- **`ngx.conf_prefix`**

  chaîne contenant le chemin du [[10-guides/01-introduction/configure|préfixe de configuration de nginx]] — le répertoire où nginx cherche actuellement sa configuration (0.7.8)

- **`ngx.error_log_path`**

  chaîne contenant le chemin du fichier [[12-directives/error-log|journal d'erreurs]] courant (0.8.0)

- **`ngx.fetch(resource, [options])`**

  Effectue une requête pour récupérer une *resource* (0.5.1), qui peut être une URL ou un objet `Request` (0.7.10). Renvoie une `Promise` résolue avec l'objet `Response`. Depuis la version 0.7.0, le schéma `https://` est pris en charge ; les redirections ne sont pas suivies.

  Si l'URL de la *resource* est un nom de domaine, elle est résolue à l'aide d'un [[12-directives/resolver-http-core|résolveur]]. Avec le schéma `https://`, la directive [[12-directives/js-fetch-trusted-certificate-http-js|js_fetch_trusted_certificate]] doit être configurée pour authentifier le serveur HTTPS de la *resource*.

  Le paramètre `options` doit être un objet avec les clés suivantes :

  - **`body`**

    corps de la requête, vide par défaut

  - **`buffer_size`**

    taille du tampon de lecture de la réponse, `4096` par défaut

  - **`headers`**

    objet des en-têtes de la requête

  - **`max_response_body_size`**

    taille maximale du corps de la réponse en octets, `32768` par défaut

  - **`method`**

    méthode HTTP, `GET` par défaut

  - **`verify`**

    active ou désactive la vérification du certificat du serveur HTTPS, `true` par défaut (0.7.0)

  Exemple :

  ```nginx
  let reply = await ngx.fetch('http://nginx.org/');
  let body = await reply.text();

  r.return(200, body);
  ```

- **`ngx.log`(*level*, *message*)**

  écrit un message dans le journal d'erreurs au niveau indiqué. Le paramètre *level* précise l'un des niveaux, le paramètre *message* peut être une chaîne ou un Buffer. Niveaux possibles : `ngx.INFO`, `ngx.WARN` et `ngx.ERR`.

  > [!NOTE]
  > Comme nginx a une longueur de ligne maximale [[10-guides/06-developpement/development-guide|codée en dur]], seuls les 2048 premiers octets de la chaîne peuvent être journalisés.

- **`ngx.prefix`**

  chaîne contenant le chemin du [[10-guides/01-introduction/configure|préfixe de nginx]] — un répertoire qui contient les fichiers du serveur (0.8.0)

- **`ngx.version`**

  chaîne contenant la version de nginx, par exemple : `1.25.0` (0.8.0)

- **`ngx.version_number`**

  nombre contenant la version de nginx, par exemple : `1025000` (0.8.0)

- **`ngx.worker_id`**

  nombre correspondant à l'identifiant interne du processus de travail nginx, compris entre `0` et la valeur de la directive [[12-directives/worker-processes|worker_processes]] (0.8.0)

### ngx.shared

L'objet global `ngx.shared` est disponible depuis la version 0.8.0.

#### SharedDict

|   |
| --- |
| `ngx.shared.SharedDict.add()` |
| `ngx.shared.SharedDict.capacity` |
| `ngx.shared.SharedDict.clear()` |
| `ngx.shared.SharedDict.delete()` |
| `ngx.shared.SharedDict.freeSpace()` |
| `ngx.shared.SharedDict.get()` |
| `ngx.shared.SharedDict.has()` |
| `ngx.shared.SharedDict.incr()` |
| `ngx.shared.SharedDict.items()` |
| `ngx.shared.SharedDict.keys()` |
| `ngx.shared.SharedDict.name` |
| `ngx.shared.SharedDict.pop()` |
| `ngx.shared.SharedDict.replace()` |
| `ngx.shared.SharedDict.set()` |
| `ngx.shared.SharedDict.size()` |
| `ngx.shared.SharedDict.ttl()` |
| `ngx.shared.SharedDict.type` |

L'objet dictionnaire partagé est disponible depuis la version 0.8.0. Le nom, le type et la taille du dictionnaire partagé se définissent avec la directive `js_shared_dict_zone` dans [[12-directives/js-shared-dict-zone-http-js|http]] ou [[12-directives/js-shared-dict-zone-stream-js|stream]].

Un objet `SharedDict()` a les propriétés et méthodes suivantes :

- **`ngx.shared.SharedDict.add(key, value [,timeout])`**

  Définit la `value` de la `key` indiquée dans le dictionnaire, seulement si la clé n'existe pas encore. `key` est une chaîne représentant la clé de l'élément à ajouter, `value` la valeur de l'élément.

  L'argument facultatif `timeout`, en millisecondes, remplace le paramètre `timeout` de la directive `js_shared_dict_zone` dans [[12-directives/js-shared-dict-zone-http-js|http]] ou [[12-directives/js-shared-dict-zone-stream-js|stream]] (depuis 0.8.5). Utile quand certaines clés doivent avoir leur propre délai.

  Renvoie `true` si la valeur a été ajoutée au dictionnaire `SharedDict`, `false` si la clé existe déjà. Lève `SharedMemoryError` s'il n'y a pas assez d'espace libre dans le dictionnaire `SharedDict`. Lève `TypeError` si `value` n'est pas du type attendu par ce dictionnaire.

- **`ngx.shared.SharedDict.capacity`**

  Renvoie la capacité du dictionnaire `SharedDict`, correspondant au paramètre `size` de la directive `js_shared_dict_zone` dans [[12-directives/js-shared-dict-zone-http-js|http]] ou [[12-directives/js-shared-dict-zone-stream-js|stream]].

- **`ngx.shared.SharedDict.clear()`**

  Supprime tous les éléments du dictionnaire `SharedDict`.

- **`ngx.shared.SharedDict.delete(key)`**

  Supprime du dictionnaire `SharedDict` l'élément associé à la clé indiquée ; renvoie `true` si l'élément existait et a été supprimé, `false` sinon.

- **`ngx.shared.SharedDict.freeSpace()`**

  Renvoie la taille des pages libres en octets. Si elle est nulle, le dictionnaire `SharedDict` accepte encore de nouvelles valeurs s'il reste de la place dans les pages occupées.

- **`ngx.shared.SharedDict.get(key)`**

  Récupère l'élément par sa `key` ; renvoie la valeur associée à la `key`, ou `undefined` s'il n'y en a pas.

- **`ngx.shared.SharedDict.has(key)`**

  Cherche un élément par sa `key` ; renvoie `true` s'il existe, `false` sinon.

- **`ngx.shared.SharedDict.incr(key,delta[[,init], timeout]))`**

  Incrémente de `delta` la valeur entière associée à la `key`. `key` est une chaîne, `delta` le nombre à ajouter ou retrancher. Si la clé n'existe pas, l'élément est initialisé avec l'argument facultatif `init`, `0` par défaut.

  L'argument facultatif `timeout`, en millisecondes, remplace le paramètre `timeout` de la directive `js_shared_dict_zone` dans [[12-directives/js-shared-dict-zone-http-js|http]] ou [[12-directives/js-shared-dict-zone-stream-js|stream]] (depuis 0.8.5). Sans argument `timeout`, la durée de vie existante de l'entrée est conservée (depuis 0.9.7). Avant la version 0.9.7, omettre `timeout` remettait l'expiration de l'entrée à la valeur par défaut de la directive.

  Renvoie la nouvelle valeur. Lève `SharedMemoryError` s'il n'y a pas assez d'espace libre dans le dictionnaire `SharedDict`. Lève `TypeError` si ce dictionnaire n'attend pas de nombres.

  > [!NOTE]
  > Cette méthode n'est utilisable que si le type du dictionnaire a été déclaré avec le paramètre `type=number` de la directive `js_shared_dict_zone` dans [[12-directives/js-shared-dict-zone-http-js|http]] ou [[12-directives/js-shared-dict-zone-stream-js|stream]].

- **`ngx.shared.SharedDict.items([maxCount])`**

  Renvoie un tableau des éléments clé-valeur du dictionnaire `SharedDict` (depuis 0.8.1). Le paramètre `maxCount` fixe le nombre maximal d'éléments à récupérer, `1024` par défaut.

- **`ngx.shared.SharedDict.keys([maxCount])`**

  Renvoie un tableau des clés du dictionnaire `SharedDict`. Le paramètre `maxCount` fixe le nombre maximal de clés à récupérer, `1024` par défaut.

- **`ngx.shared.SharedDict.name`**

  Renvoie le nom du dictionnaire `SharedDict`, correspondant au paramètre `zone=` de la directive `js_shared_dict_zone` dans [[12-directives/js-shared-dict-zone-http-js|http]] ou [[12-directives/js-shared-dict-zone-stream-js|stream]].

- **`ngx.shared.SharedDict.pop(key)`**

  Supprime du dictionnaire `SharedDict` l'élément associé à la `key` indiquée ; renvoie la valeur associée à la `key`, ou `undefined` s'il n'y en a pas.

- **`ngx.shared.SharedDict.replace(key, value)`**

  Remplace la `value` de la `key` indiquée seulement si la clé existe déjà ; renvoie `true` si la valeur a été remplacée, `false` si la clé n'existe pas dans le dictionnaire `SharedDict`. Lève `SharedMemoryError` s'il n'y a pas assez d'espace libre dans le dictionnaire `SharedDict`. Lève `TypeError` si `value` n'est pas du type attendu par ce dictionnaire.

- **`ngx.shared.SharedDict.set(key, value [,timeout])`**

  Définit la `value` de la `key` indiquée ; renvoie ce dictionnaire `SharedDict` (pour le chaînage des méthodes).

  L'argument facultatif `timeout`, en millisecondes, remplace le paramètre `timeout` de la directive `js_shared_dict_zone` dans [[12-directives/js-shared-dict-zone-http-js|http]] ou [[12-directives/js-shared-dict-zone-stream-js|stream]] (depuis 0.8.5). Utile quand certaines clés doivent avoir leur propre délai.

- **`ngx.shared.SharedDict.size()`**

  Renvoie le nombre d'éléments du dictionnaire `SharedDict`.

- **`ngx.shared.SharedDict.ttl(key)`**

  Renvoie la durée de vie restante en millisecondes de la `key` indiquée, ou `undefined` si la clé n'existe pas ou a expiré (depuis 0.9.7).

  Lève `TypeError` si le dictionnaire a été déclaré sans le paramètre `timeout` de la directive `js_shared_dict_zone` dans [[12-directives/js-shared-dict-zone-http-js|http]] ou [[12-directives/js-shared-dict-zone-stream-js|stream]].

- **`ngx.shared.SharedDict.type`**

  Renvoie `string` ou `number`, selon le type du dictionnaire `SharedDict` défini par le paramètre `type=` de la directive `js_shared_dict_zone` dans [[12-directives/js-shared-dict-zone-http-js|http]] ou [[12-directives/js-shared-dict-zone-stream-js|stream]].

## objets intégrés

### console

|   |
| --- |
| `console.error()` |
| `console.info()` |
| `console.log()` |
| `console.time()` |
| `console.timeEnd()` |
| `console.warn()` |

L'objet `console` est disponible dans nginx depuis la version 0.8.2, et dans la CLI depuis la version 0.2.6.

- **`console.error(msg[, msg2 ...])`**

  Affiche un ou plusieurs messages d'erreur. Le message peut être une chaîne ou un objet.

- **`console.info(msg[, msg2 ...])`**

  Affiche un ou plusieurs messages d'information. Le message peut être une chaîne ou un objet.

- **`console.log(msg[, msg2 ...])`**

  Affiche un ou plusieurs messages de journal. Le message peut être une chaîne ou un objet.

- **`console.time(label)`**

  Démarre un chronomètre qui mesure la durée d'une opération. Le paramètre `label` permet de nommer différents chronomètres. Si `console.timeEnd()` est appelée avec le même nom, le temps écoulé depuis le démarrage est affiché, en millisecondes.

- **`console.timeEnd(label)`**

  Arrête un chronomètre démarré par `console.time()`. Le paramètre `label` permet de nommer différents chronomètres.

- **`console.warn(msg[, msg2 ...])`**

  Affiche un ou plusieurs messages d'avertissement. Le message peut être une chaîne ou un objet.

### crypto

|   |
| --- |
| `сrypto.getRandomValues()` |
| `сrypto.randomUUID()` |
| `сrypto.subtle.encrypt()` |
| `сrypto.subtle.decrypt()` |
| `сrypto.subtle.deriveBits()` |
| `сrypto.subtle.deriveKey()` |
| `сrypto.subtle.digest()` |
| `сrypto.subtle.exportKey()` |
| `сrypto.subtle.generateKey()` |
| `сrypto.subtle.importKey()` |
| `сrypto.subtle.sign()` |
| `сrypto.subtle.verify()` |
| `сrypto.subtle.wrapKey()` |
| `сrypto.subtle.unwrapKey()` |

L'objet `crypto` est un objet global qui donne accès aux fonctions cryptographiques (depuis 0.7.0). Depuis la version 0.9.7, toute la spécification [Web Crypto API](https://www.w3.org/TR/webcrypto-2/) est prise en charge.

- **`сrypto.getRandomValues`(`typedArray`)**

  Obtient des valeurs aléatoires cryptographiquement fortes. Renvoie le tableau passé en `typedArray`, avec son contenu remplacé par les nombres aléatoires générés. Valeurs possibles :

  - **`typedArray`**

    peut être `Int8Array`, `Int16Array`, `Uint16Array`, `Int32Array` ou `Uint32Array`

- **`сrypto.randomUUID`()**

  Renvoie une chaîne UUID v4 aléatoire de 36 caractères, par exemple `"36b8f84d-df4e-4d49-b662-bcde71a8764f"` (depuis 0.9.7).

- **`сrypto.subtle.encrypt`(`algorithm`, `key`, `data`)**

  Chiffre `data` avec l'`algorithm` et la `key` fournis. Renvoie une `Promise` résolue avec un `ArrayBuffer` contenant le texte chiffré. Valeurs possibles :

  - **`algorithm`**

    objet indiquant l'algorithme à utiliser et les éventuels paramètres supplémentaires :

    - pour `RSA-OAEP`, passez l'objet avec les clés suivantes :

      - `name` est une chaîne, à fixer à `RSA-OAEP` :

        ```nginx
        crypto.subtle.encrypt({name: "RSA-OAEP"}, key, data)
        ```
    - pour `AES-CTR`, passez l'objet avec les clés suivantes :

      - `name` est une chaîne, à fixer à `AES-CTR`
      - `counter` est un `ArrayBuffer`, `TypedArray` ou `DataView` — valeur initiale du bloc compteur, de 16 octets (taille d'un bloc AES). Les length bits de droite servent de compteur, le reste de nonce. Par exemple, si length vaut 64, la première moitié du compteur est le nonce et la seconde sert de compteur
      - `length` est le nombre de bits du bloc compteur utilisés pour le compteur proprement dit. Le compteur doit être assez grand pour ne pas reboucler.
    - pour `AES-CBC`, passez l'objet avec les clés suivantes :

      - `name` est une chaîne, à fixer à `AES-CBC`
      - `iv`, le vecteur d'initialisation, est un `ArrayBuffer`, `TypedArray` ou `DataView` de 16 octets, imprévisible et de préférence aléatoire au sens cryptographique. Il n'a pas besoin d'être secret : il peut par exemple être transmis en clair avec le texte chiffré.
    - pour `AES-GCM`, passez l'objet avec les clés suivantes :

      - `name` est une chaîne, à fixer à `AES-GCM`
      - `iv`, le vecteur d'initialisation, est un `ArrayBuffer`, `TypedArray` ou `DataView` de 16 octets, unique pour chaque opération de chiffrement avec une clé donnée
      - `additionalData` (facultatif) est un `ArrayBuffer`, `TypedArray` ou `DataView` contenant des données supplémentaires non chiffrées mais authentifiées avec les données chiffrées. Si `additionalData` est indiqué, les mêmes données doivent être passées à l'appel `decrypt()` correspondant : si elles ne correspondent pas, le déchiffrement lève une exception. La longueur en bits de `additionalData` doit être inférieure à `2^64 - 1`.
      - `tagLength` (facultatif, `128` par défaut) - `number` qui fixe la taille en bits de l'étiquette d'authentification générée lors du chiffrement et utilisée lors du déchiffrement correspondant. Valeurs possibles : `32`, `64`, `96`, `104`, `112`, `120` ou `128`. La spécification AES-GCM recommande `96`, `104`, `112`, `120` ou `128`, bien que `32` ou `64` bits puissent convenir à certaines applications.

  - **`key`**

    `CryptoKey` contenant la clé de chiffrement

  - **`data`**

    `ArrayBuffer`, `TypedArray` ou `DataView` contenant les données à chiffrer (le texte en clair)

- **`сrypto.subtle.decrypt`(`algorithm`, `key`, `data`)**

  Déchiffre des données chiffrées. Renvoie une `Promise` avec les données déchiffrées. Valeurs possibles :

  - **`algorithm`**

    objet indiquant l'algorithme à utiliser et les éventuels paramètres supplémentaires. Ces paramètres doivent correspondre à ceux passés à l'appel `encrypt()` correspondant.

    - pour `RSA-OAEP`, passez l'objet avec les clés suivantes :

      - `name` est une chaîne, à fixer à `RSA-OAEP` :

        ```nginx
        crypto.subtle.encrypt({name: "RSA-OAEP"}, key, data)
        ```
    - pour `AES-CTR`, passez l'objet avec les clés suivantes :

      - `name` est une chaîne, à fixer à `AES-CTR`
      - `counter` est un `ArrayBuffer`, `TypedArray` ou `DataView` — valeur initiale du bloc compteur, de 16 octets (taille d'un bloc AES). Les length bits de droite servent de compteur, le reste de nonce. Par exemple, si length vaut 64, la première moitié du compteur est le nonce et la seconde sert de compteur.
      - `length` est le nombre de bits du bloc compteur utilisés pour le compteur proprement dit. Le compteur doit être assez grand pour ne pas reboucler.
    - pour `AES-CBC`, passez l'objet avec les clés suivantes :

      - `name` est une chaîne, à fixer à `AES-CBC`
      - `iv`, le vecteur d'initialisation, est un `ArrayBuffer`, `TypedArray` ou `DataView` de 16 octets, imprévisible et de préférence aléatoire au sens cryptographique. Il n'a pas besoin d'être secret (il peut par exemple être transmis en clair avec le texte chiffré).
    - pour `AES-GCM`, passez l'objet avec les clés suivantes :

      - `name` est une chaîne, à fixer à `AES-GCM`
      - `iv`, le vecteur d'initialisation, est un `ArrayBuffer`, `TypedArray` ou `DataView` de 16 octets, unique pour chaque opération de chiffrement avec une clé donnée
      - `additionalData` (facultatif) est un `ArrayBuffer`, `TypedArray` ou `DataView` contenant des données supplémentaires non chiffrées mais authentifiées avec les données chiffrées. Si `additionalData` est indiqué, les mêmes données doivent être passées à l'appel `decrypt()` correspondant : si elles ne correspondent pas, le déchiffrement lève une exception. La longueur en bits de `additionalData` doit être inférieure à `2^64 - 1`.
      - `tagLength` (facultatif, `128` par défaut) - `number` qui fixe la taille en bits de l'étiquette d'authentification générée lors du chiffrement et utilisée lors du déchiffrement correspondant. Valeurs possibles : `32`, `64`, `96`, `104`, `112`, `120` ou `128`. La spécification AES-GCM recommande `96`, `104`, `112`, `120` ou `128`, bien que `32` ou `64` bits puissent convenir à certaines applications.

  - **`key`**

    `CryptoKey` contenant la clé de déchiffrement. Avec `RSA-OAEP`, c'est la propriété `privateKey` de l'objet `CryptoKeyPair`.

  - **`data`**

    `ArrayBuffer`, `TypedArray` ou `DataView` contenant les données à déchiffrer (le texte chiffré)

- **`сrypto.subtle.deriveBits`(`algorithm`, `baseKey`, `length`)**

  Dérive un tableau de bits à partir d'une clé de base. Renvoie une `Promise` résolue avec un `ArrayBuffer` contenant les bits dérivés. Valeurs possibles :

  - **`algorithm`**

    objet qui définit l'algorithme de dérivation :

    - pour `HKDF`, passez l'objet avec les clés suivantes :

      - `name` est une chaîne, à fixer à `HKDF`
      - `hash` est une chaîne indiquant l'algorithme de condensat : `SHA-1`, `SHA-256`, `SHA-384` ou `SHA-512`
      - `salt` est un `ArrayBuffer`, `TypedArray` ou `DataView` représentant une valeur aléatoire ou pseudo-aléatoire de même longueur que la sortie de la fonction `digest`. Contrairement au matériau de clé passé à `deriveKey()`, le sel n'a pas besoin d'être secret.
      - `info` est un `ArrayBuffer`, `TypedArray` ou `DataView` représentant des informations de contexte propres à l'application, qui lient la clé dérivée à une application ou un contexte et permettent de dériver des clés différentes pour des contextes différents à partir du même matériau de clé. Cette propriété est obligatoire mais peut être un tampon vide.
    - pour `PBKDF2`, passez l'objet avec les clés suivantes :

      - `name` est une chaîne, à fixer à `PBKDF2`
      - `hash` est une chaîne indiquant l'algorithme de condensat : `SHA-1`, `SHA-256`, `SHA-384` ou `SHA-512`
      - `salt` est un `ArrayBuffer`, `TypedArray` ou `DataView` représentant une valeur aléatoire ou pseudo-aléatoire d'au moins `16` octets. Contrairement au matériau de clé passé à `deriveKey()`, le sel n'a pas besoin d'être secret.
      - `iterations` est un `number` représentant le nombre d'exécutions de la fonction de hachage dans `deriveKey()`
    - pour `ECDH`, passez l'objet avec les clés suivantes (depuis 0.9.1) :

      - `name` est une chaîne, à fixer à `ECDH`
      - `public` est une `CryptoKey` représentant la clé publique de l'autre partie. Elle doit être générée avec la même courbe que la clé de base.
    - pour `X25519`, passez l'objet avec les clés suivantes (depuis 0.9.7) :

      - `name` est une chaîne, à fixer à `X25519`
      - `public` est une `CryptoKey` représentant la clé publique de l'autre partie

  - **`baseKey`**

    `CryptoKey` représentant l'entrée de l'algorithme de dérivation — le matériau de clé initial de la fonction de dérivation : par exemple, pour `PBKDF2`, un mot de passe importé en `CryptoKey` avec `сrypto.subtle.importKey()`

  - **`length`**

    nombre de bits à dériver. Pour la compatibilité avec les navigateurs, il doit être un multiple de `8`

- **`сrypto.subtle.deriveKey`(`algorithm`, `baseKey`, `derivedKeyAlgorithm`, `extractable`, `keyUsages`)**

  Dérive une clé secrète à partir d'une clé maîtresse. Valeurs possibles :

  - **`algorithm`**

    objet qui définit l'algorithme de dérivation :

    - pour `HKDF`, passez l'objet avec les clés suivantes :

      - `name` est une chaîne, à fixer à `HKDF`
      - `hash` est une chaîne indiquant l'algorithme de condensat : `SHA-1`, `SHA-256`, `SHA-384` ou `SHA-512`
      - `salt` est un `ArrayBuffer`, `TypedArray` ou `DataView` représentant une valeur aléatoire ou pseudo-aléatoire de même longueur que la sortie de la fonction `digest`. Contrairement au matériau de clé passé à `deriveKey()`, le sel n'a pas besoin d'être secret.
      - `info` est un `ArrayBuffer`, `TypedArray` ou `DataView` représentant des informations de contexte propres à l'application, qui lient la clé dérivée à une application ou un contexte et permettent de dériver des clés différentes pour des contextes différents à partir du même matériau de clé. Cette propriété est obligatoire mais peut être un tampon vide.
    - pour `PBKDF2`, passez l'objet avec les clés suivantes :

      - `name` est une chaîne, à fixer à `PBKDF2`
      - `hash` est une chaîne indiquant l'algorithme de condensat : `SHA-1`, `SHA-256`, `SHA-384` ou `SHA-512`
      - `salt` est un `ArrayBuffer`, `TypedArray` ou `DataView` représentant une valeur aléatoire ou pseudo-aléatoire d'au moins `16` octets. Contrairement au matériau de clé passé à `deriveKey()`, le sel n'a pas besoin d'être secret.
      - `iterations` est un `number` représentant le nombre d'exécutions de la fonction de hachage dans `deriveKey()`
    - pour `ECDH`, passez l'objet avec les clés suivantes (depuis 0.9.1) :

      - `name` est une chaîne, à fixer à `ECDH`
      - `public` est une `CryptoKey` représentant la clé publique de l'autre partie. Elle doit être générée avec la même courbe que la clé de base.
    - pour `X25519`, passez l'objet avec les clés suivantes (depuis 0.9.7) :

      - `name` est une chaîne, à fixer à `X25519`
      - `public` est une `CryptoKey` représentant la clé publique de l'autre partie

  - **`baseKey`**

    `CryptoKey` représentant l'entrée de l'algorithme de dérivation — le matériau de clé initial de la fonction de dérivation : par exemple, pour `PBKDF2`, un mot de passe importé en `CryptoKey` avec `сrypto.subtle.importKey()`.

  - **`derivedKeyAlgorithm`**

    objet qui définit l'algorithme auquel servira la clé dérivée :

    - pour `HMAC`, passez l'objet avec les clés suivantes :

      - `name` est une chaîne, à fixer à `HMAC`
      - `hash` est une chaîne indiquant le nom de la fonction de condensat : `SHA-1`, `SHA-256`, `SHA-384` ou `SHA-512`
      - `length` (facultatif) est un `number` représentant la longueur de la clé en bits. Sans lui, la longueur de la clé est égale à la taille de bloc de la fonction de hachage choisie
    - pour `AES-CTR`, `AES-CBC`, `AES-GCM` ou `AES-KW` (depuis 0.9.7), passez l'objet avec les clés suivantes :

      - `name` est une chaîne, à fixer à `AES-CTR`, `AES-CBC`, `AES-GCM` ou `AES-KW` selon l'algorithme utilisé
      - `length` est un `number` représentant la longueur en bits de la clé à générer : `128`, `192` ou `256`

  - **`extractable`**

    booléen indiquant s'il sera possible d'exporter la clé

  - **`keyUsages`**

    `Array` indiquant ce que l'on peut faire avec la clé dérivée. Les usages doivent être autorisés par l'algorithme fixé dans `derivedKeyAlgorithm`. Valeurs possibles :

    - **`encrypt`**

      clé de chiffrement de messages

    - **`decrypt`**

      clé de déchiffrement de messages

    - **`sign`**

      clé de signature de messages

    - **`verify`**

      clé de vérification de signatures

    - **`deriveKey`**

      clé de dérivation d'une nouvelle clé

    - **`deriveBits`**

      clé de dérivation de bits

    - **`wrapKey`**

      clé d'enveloppement d'une clé

    - **`unwrapKey`**

      clé de désenveloppement d'une clé

- **`сrypto.subtle.digest`(`algorithm`, `data`)**

  Calcule le condensat des données fournies. Prend en arguments l'identifiant de l'algorithme de condensat et les données. Renvoie une `Promise` résolue avec le condensat. Valeurs possibles :

  - **`algorithm`**

    chaîne définissant la fonction de hachage : `SHA-1` (pas pour des usages cryptographiques), `SHA-256`, `SHA-384` ou `SHA-512`

  - **`data`**

    `ArrayBuffer`, `TypedArray` ou `DataView` contenant les données à condenser

- **`сrypto.subtle.exportKey`(`format`, `key`)**

  Exporte une clé : prend une clé sous forme d'objet `CryptoKey` et la renvoie dans un format externe portable (depuis 0.7.10). Si `format` vaut `jwk`, la `Promise` est résolue avec un objet JSON contenant la clé ; sinon avec un `ArrayBuffer` contenant la clé. Valeurs possibles :

  - **`format`**

    chaîne décrivant le format de données dans lequel exporter la clé, parmi :

    - **`raw`**

      le format de données brut

    - **`pkcs8`**

      le format [PKCS #8](https://datatracker.ietf.org/doc/html/rfc5208)

    - **`spki`**

      le format [SubjectPublicKeyInfo](https://datatracker.ietf.org/doc/html/rfc5280#section-4.1)

    - **`jwk`**

      le format [JSON Web Key](https://datatracker.ietf.org/doc/html/rfc7517) (JWK) (depuis 0.7.10)

  - **`key`**

    la `CryptoKey` contenant la clé à exporter

- **`сrypto.subtle.generateKey`(`algorithm`, `extractable`, `usage`)**

  Génère une nouvelle clé pour les algorithmes symétriques ou une paire de clés pour les algorithmes à clé publique (depuis 0.7.10). Renvoie une `Promise` résolue avec la clé générée sous forme d'objet `CryptoKey` ou `CryptoKeyPair`. Valeurs possibles :

  - **`algorithm`**

    objet dictionnaire qui définit le type de clé à générer et fournit les paramètres propres à l'algorithme :

    - pour `RSASSA-PKCS1-v1_5`, `RSA-PSS` ou `RSA-OAEP`, passez l'objet avec les clés suivantes :

      - `name` est une chaîne, à fixer à `RSASSA-PKCS1-v1_5`, `RSA-PSS` ou `RSA-OAEP` selon l'algorithme utilisé
      - `hash` est une chaîne représentant le nom de la fonction `digest` : `SHA-256`, `SHA-384` ou `SHA-512`
    - pour `ECDSA`, passez l'objet avec les clés suivantes :

      - `name` est une chaîne, à fixer à `ECDSA`
      - `namedCurve` est une chaîne représentant le nom de la courbe elliptique : `P-256`, `P-384` ou `P-521`
    - pour `HMAC`, passez l'objet avec les clés suivantes :

      - `name` est une chaîne, à fixer à `HMAC`
      - `hash` est une chaîne représentant le nom de la fonction `digest` : `SHA-256`, `SHA-384` ou `SHA-512`
      - `length` (facultatif) est un nombre représentant la longueur de la clé en bits. Sans lui, la longueur de la clé est égale à celle du condensat produit par la fonction choisie.
    - pour `AES-CTR`, `AES-CBC`, `AES-GCM` ou `AES-KW` (depuis 0.9.7), passez la chaîne identifiant l'algorithme ou un objet de la forme `{ "name": "ALGORITHM" }`, où `ALGORITHM` est le nom de l'algorithme
    - pour `ECDH`, passez l'objet avec les clés suivantes (depuis 0.9.1) :

      - `name` est une chaîne, à fixer à `ECDH`
      - `namedCurve` est une chaîne représentant le nom de la courbe elliptique : `P-256`, `P-384` ou `P-521`
    - pour `Ed25519`, passez la chaîne `Ed25519` ou un objet de la forme `{ "name": "Ed25519" }` (depuis 0.9.7)
    - pour `X25519`, passez la chaîne `X25519` ou un objet de la forme `{ "name": "X25519" }` (depuis 0.9.7)

  - **`extractable`**

    booléen indiquant s'il est possible d'exporter la clé

  - **`usage`**

    `array` indiquant les actions possibles avec la clé :

    - **`encrypt`**

      clé de chiffrement de messages

    - **`decrypt`**

      clé de déchiffrement de messages

    - **`sign`**

      clé de signature de messages

    - **`verify`**

      clé de vérification de signatures

    - **`deriveKey`**

      clé de dérivation d'une nouvelle clé

    - **`deriveBits`**

      clé de dérivation de bits

    - **`wrapKey`**

      clé d'enveloppement d'une clé

    - **`unwrapKey`**

      clé de désenveloppement d'une clé

- **`сrypto.subtle.importKey`(`format`, `keyData`, `algorithm`, `extractable`, `keyUsages`)**

  Importe une clé : prend une clé dans un format externe portable et produit un objet `CryptoKey`. Renvoie une `Promise` résolue avec la clé importée sous forme d'objet `CryptoKey`. Valeurs possibles :

  - **`format`**

    chaîne décrivant le format de données de la clé à importer, parmi :

    - **`raw`**

      le format de données brut

    - **`pkcs8`**

      le format [PKCS #8](https://datatracker.ietf.org/doc/html/rfc5208)

    - **`spki`**

      le format [SubjectPublicKeyInfo](https://datatracker.ietf.org/doc/html/rfc5280#section-4.1)

    - **`jwk`**

      le format [JSON Web Key](https://datatracker.ietf.org/doc/html/rfc7517) (JWK) (depuis 0.7.10)

  - **`keyData`**

    objet `ArrayBuffer`, `TypedArray` ou `DataView` contenant la clé dans le format indiqué

  - **`algorithm`**

    objet dictionnaire qui définit le type de clé à importer et fournit les paramètres propres à l'algorithme :

    - pour `RSASSA-PKCS1-v1_5`, `RSA-PSS` ou `RSA-OAEP`, passez l'objet avec les clés suivantes :

      - `name` est une chaîne, à fixer à `RSASSA-PKCS1-v1_5`, `RSA-PSS` ou `RSA-OAEP` selon l'algorithme utilisé
      - `hash` est une chaîne représentant le nom de la fonction `digest` : `SHA-1`, `SHA-256`, `SHA-384` ou `SHA-512`
    - pour `ECDSA`, passez l'objet avec les clés suivantes :

      - `name` est une chaîne, à fixer à `ECDSA`
      - `namedCurve` est une chaîne représentant le nom de la courbe elliptique : `P-256`, `P-384` ou `P-521`
    - pour `HMAC`, passez l'objet avec les clés suivantes :

      - `name` est une chaîne, à fixer à `HMAC`
      - `hash` est une chaîne représentant le nom de la fonction `digest` : `SHA-256`, `SHA-384` ou `SHA-512`
      - `length` (facultatif) est un nombre représentant la longueur de la clé en bits. Sans lui, la longueur de la clé est égale à celle du condensat produit par la fonction choisie.
    - pour `AES-CTR`, `AES-CBC`, `AES-GCM` ou `AES-KW` (depuis 0.9.7), passez la chaîne identifiant l'algorithme ou un objet de la forme `{ "name": "ALGORITHM" }`, où `ALGORITHM` est le nom de l'algorithme
    - pour `PBKDF2`, passez la chaîne `PBKDF2`
    - pour `HKDF`, passez la chaîne `HKDF`
    - pour `ECDH`, passez l'objet avec les clés suivantes (depuis 0.9.1) :

      - `name` est une chaîne, à fixer à `ECDH`
      - `namedCurve` est une chaîne représentant le nom de la courbe elliptique : `P-256`, `P-384` ou `P-521`
    - pour `Ed25519`, passez la chaîne `Ed25519` ou un objet de la forme `{ "name": "Ed25519" }` (depuis 0.9.7)
    - pour `X25519`, passez la chaîne `X25519` ou un objet de la forme `{ "name": "X25519" }` (depuis 0.9.7)

  - **`extractable`**

    booléen indiquant s'il est possible d'exporter la clé

  - **`keyUsages`**

    `array` indiquant les actions possibles avec la clé :

    - **`encrypt`**

      clé de chiffrement de messages

    - **`decrypt`**

      clé de déchiffrement de messages

    - **`sign`**

      clé de signature de messages

    - **`verify`**

      clé de vérification de signatures

    - **`deriveKey`**

      clé de dérivation d'une nouvelle clé

    - **`deriveBits`**

      clé de dérivation de bits

    - **`wrapKey`**

      clé d'enveloppement d'une clé

    - **`unwrapKey`**

      clé de désenveloppement d'une clé

- **`сrypto.subtle.sign`(`algorithm`, `key`, `data`)**

  Renvoie `signature` sous forme de `Promise` résolue avec un `ArrayBuffer` contenant la signature. Valeurs possibles :

  - **`algorithm`**

    chaîne ou objet indiquant l'algorithme de signature et ses paramètres :

    - pour `RSASSA-PKCS1-v1_5`, passez la chaîne identifiant l'algorithme ou un objet de la forme `{ "name": "ALGORITHM" }`
    - pour `RSA-PSS`, passez l'objet avec les clés suivantes :

      - `name` est une chaîne, à fixer à `RSA-PSS`
      - `saltLength` est un `integer` long représentant la longueur du sel aléatoire, en octets
    - pour `ECDSA`, passez l'objet avec les clés suivantes :

      - `name` est une chaîne, à fixer à `ECDSA`
      - `hash` est l'identifiant de l'algorithme de condensat : `SHA-256`, `SHA-384` ou `SHA-512`
    - pour `HMAC`, passez la chaîne identifiant l'algorithme ou un objet de la forme `{ "name": "ALGORITHM" }`
    - pour `Ed25519`, passez la chaîne `Ed25519` ou un objet de la forme `{ "name": "Ed25519" }` (depuis 0.9.7)

  - **`key`**

    objet `CryptoKey` contenant la clé de signature. Si l'algorithme est un cryptosystème à clé publique, c'est la clé privée.

  - **`data`**

    objet `ArrayBuffer`, `TypedArray` ou `DataView` contenant les données à signer

- **`сrypto.subtle.verify`(`algorithm`, `key`, `signature`, `data`)**

  Vérifie une signature numérique ; renvoie une `Promise` résolue avec un booléen : `true` si la signature est valide, `false` sinon. Valeurs possibles :

  - **`algorithm`**

    chaîne ou objet indiquant l'algorithme et ses paramètres :

    - pour `RSASSA-PKCS1-v1_5`, passez la chaîne identifiant l'algorithme ou un objet de la forme `{ "name": "ALGORITHM" }`
    - pour `RSA-PSS`, passez l'objet avec les clés suivantes :

      - `name` est une chaîne, à fixer à `RSA-PSS`
      - `saltLength` est un `integer` long représentant la longueur du sel aléatoire, en octets
    - pour `ECDSA`, passez l'objet avec les clés suivantes :

      - `name` est une chaîne, à fixer à `ECDSA`
      - `hash` est l'identifiant de l'algorithme de condensat : `SHA-256`, `SHA-384` ou `SHA-512`
    - pour `HMAC`, passez la chaîne identifiant l'algorithme ou un objet de la forme `{ "name": "ALGORITHM" }`
    - pour `Ed25519`, passez la chaîne `Ed25519` ou un objet de la forme `{ "name": "Ed25519" }` (depuis 0.9.7)

  - **`key`**

    objet `CryptoKey` contenant la clé de vérification : la clé secrète pour un algorithme symétrique, la clé publique pour un système à clé publique.

  - **`signature`**

    `ArrayBuffer`, `TypedArray` ou `DataView` contenant la signature à vérifier

  - **`data`**

    objet `ArrayBuffer`, `TypedArray` ou `DataView` contenant les données dont la signature est à vérifier

- **`сrypto.subtle.wrapKey`(`format`, `key`, `wrappingKey`, `wrapAlgorithm`)**

  Enveloppe une clé : l'exporte dans un format externe portable, puis chiffre la clé exportée (depuis 0.9.7). Renvoie une `Promise` résolue avec un `ArrayBuffer` contenant la clé exportée chiffrée. Valeurs possibles :

  - **`format`**

    chaîne décrivant le format de données de la clé à exporter avant chiffrement, parmi :

    - **`raw`**

      le format de données brut

    - **`pkcs8`**

      le format [PKCS #8](https://datatracker.ietf.org/doc/html/rfc5208)

    - **`spki`**

      le format [SubjectPublicKeyInfo](https://datatracker.ietf.org/doc/html/rfc5280#section-4.1)

    - **`jwk`**

      le format [JSON Web Key](https://datatracker.ietf.org/doc/html/rfc7517) (JWK)

  - **`key`**

    `CryptoKey` contenant la clé à envelopper. Elle doit avoir `CryptoKey.extractable` à `true`.

  - **`wrappingKey`**

    `CryptoKey` contenant la clé servant à chiffrer la clé exportée. Elle doit avoir l'usage `wrapKey`.

  - **`wrapAlgorithm`**

    objet indiquant l'algorithme de chiffrement de la clé exportée et les éventuels paramètres supplémentaires :

    - pour `AES-CBC`, `AES-CTR` ou `AES-GCM`, passez les paramètres d'algorithme correspondants décrits dans `сrypto.subtle.encrypt()`
    - pour `AES-KW`, passez la chaîne `AES-KW` ou un objet de la forme `{ "name": "AES-KW" }`
    - pour `RSA-OAEP`, passez les paramètres d'algorithme correspondants décrits dans `сrypto.subtle.encrypt()`

- **`сrypto.subtle.unwrapKey`(`format`, `wrappedKey`, `unwrappingKey`, `unwrapAlgorithm`, `unwrappedKeyAlgorithm`, `extractable`, `keyUsages`)**

  Désenveloppe une clé : déchiffre une clé enveloppée et crée un objet `CryptoKey` à partir du résultat (depuis 0.9.7). Renvoie une `Promise` résolue avec la clé désenveloppée sous forme de `CryptoKey`. Valeurs possibles :

  - **`format`**

    chaîne décrivant le format de données de la clé enveloppée, parmi :

    - **`raw`**

      le format de données brut

    - **`pkcs8`**

      le format [PKCS #8](https://datatracker.ietf.org/doc/html/rfc5208)

    - **`spki`**

      le format [SubjectPublicKeyInfo](https://datatracker.ietf.org/doc/html/rfc5280#section-4.1)

    - **`jwk`**

      le format [JSON Web Key](https://datatracker.ietf.org/doc/html/rfc7517) (JWK)

  - **`wrappedKey`**

    `ArrayBuffer`, `TypedArray` ou `DataView` contenant la clé enveloppée dans le format indiqué

  - **`unwrappingKey`**

    `CryptoKey` contenant la clé servant à déchiffrer la clé enveloppée. Elle doit avoir l'usage `unwrapKey`.

  - **`unwrapAlgorithm`**

    objet indiquant l'algorithme de déchiffrement de la clé enveloppée et les éventuels paramètres supplémentaires :

    - pour `AES-CBC`, `AES-CTR` ou `AES-GCM`, passez les paramètres d'algorithme correspondants décrits dans `сrypto.subtle.encrypt()`
    - pour `AES-KW`, passez la chaîne `AES-KW` ou un objet de la forme `{ "name": "AES-KW" }`
    - pour `RSA-OAEP`, passez les paramètres d'algorithme correspondants décrits dans `сrypto.subtle.encrypt()`

  - **`unwrappedKeyAlgorithm`**

    objet dictionnaire qui définit le type de clé à désenvelopper et fournit les paramètres propres à l'algorithme. Les mêmes descriptions d'algorithmes que pour `сrypto.subtle.importKey()` s'appliquent.

  - **`extractable`**

    booléen indiquant s'il est possible d'exporter la clé

  - **`keyUsages`**

    `array` indiquant les actions possibles avec la clé :

    - **`encrypt`**

      clé de chiffrement de messages

    - **`decrypt`**

      clé de déchiffrement de messages

    - **`sign`**

      clé de signature de messages

    - **`verify`**

      clé de vérification de signatures

    - **`deriveKey`**

      clé de dérivation d'une nouvelle clé

    - **`deriveBits`**

      clé de dérivation de bits

    - **`wrapKey`**

      clé d'enveloppement d'une clé

    - **`unwrapKey`**

      clé de désenveloppement d'une clé

### CryptoKey

|   |
| --- |
| `CryptoKey.algorithm` |
| `CryptoKey.extractable` |
| `CryptoKey.type` |
| `CryptoKey.usages` |

L'objet `CryptoKey` représente une `key` cryptographique obtenue par l'une des méthodes de `SubtleCrypto` : `сrypto.subtle.generateKey()`, `сrypto.subtle.deriveKey()`, `сrypto.subtle.importKey()`.

- **`CryptoKey.algorithm`**

  renvoie un objet décrivant l'algorithme pour lequel la clé peut être utilisée et les éventuels paramètres associés (depuis 0.8.0), en lecture seule

- **`CryptoKey.extractable`**

  booléen, `true` si la clé peut être exportée (depuis 0.8.0), en lecture seule

- **`CryptoKey.type`**

  chaîne indiquant le type de clé représenté par l'objet, en lecture seule. Valeurs possibles :

  - **`secret`**

    Clé secrète destinée à un algorithme symétrique.

  - **`private`**

    Moitié privée de la `CryptoKeyPair` d'un algorithme asymétrique

  - **`public`**

    Moitié publique de la `CryptoKeyPair` d'un algorithme asymétrique.

- **`CryptoKey.usages`**

  Tableau de chaînes indiquant les usages possibles de la clé (depuis 0.8.0), en lecture seule. Valeurs possibles du tableau :

  - **`encrypt`**

    clé de chiffrement de messages

  - **`decrypt`**

    clé de déchiffrement de messages

  - **`sign`**

    clé de signature de messages

  - **`verify`**

    clé de vérification de signatures

  - **`deriveKey`**

    clé de dérivation d'une nouvelle clé

  - **`deriveBits`**

    clé de dérivation de bits

### CryptoKeyPair

|   |
| --- |
| `CryptoKeyPair.privateKey` |
| `CryptoKeyPair.publicKey` |

`CryptoKeyPair` est un objet dictionnaire de l'API WebCrypto qui représente une paire de clés asymétriques.

- **`CryptoKeyPair.privateKey`**

  Objet `CryptoKey` représentant la clé privée.

- **`CryptoKeyPair.publicKey`**

  Objet `CryptoKey` représentant la clé publique.

### njs

|   |
| --- |
| `njs.version` |
| `njs.version_number` |
| `njs.dump()` |
| `njs.memoryStats` |
| `njs.on()` |

L'objet `njs` est un objet global qui représente l'instance courante de la machine virtuelle (depuis 0.2.0).

- **`njs.version`**

  Renvoie une chaîne contenant la version courante de njs (par exemple « 0.7.4 »).

- **`njs.version_number`**

  Renvoie un nombre contenant la version courante de njs. Par exemple, « 0.7.4 » est renvoyé sous la forme `0x000704` (depuis 0.7.4).

- **`njs.dump(value)`**

  Renvoie une représentation textuelle mise en forme d'une valeur.

- **`njs.memoryStats`**

  Objet contenant les statistiques mémoire de l'instance courante de la machine virtuelle (depuis 0.7.8).

  - **`size`**

    quantité de mémoire en octets réclamée au système d'exploitation par le pool mémoire de njs.

- **`njs.on(event, callback)`**

  Enregistre une fonction de rappel pour l'événement de machine virtuelle indiqué (depuis 0.5.2). Un événement peut être l'une des chaînes suivantes :

  - **`exit`**

    appelée avant la destruction de la machine virtuelle, sans argument.

### process

|   |
| --- |
| `process.argv` |
| `process.env` |
| `process.kill()` |
| `process.pid` |
| `process.ppid` |

L'objet `process` est un objet global qui fournit des informations sur le processus courant (0.3.3).

- **`process.argv`**

  Renvoie un tableau contenant les arguments de ligne de commande passés au lancement du processus courant.

- **`process.env`**

  Renvoie un objet contenant l'environnement utilisateur.

  > [!NOTE]
  > Par défaut, nginx supprime toutes les variables d'environnement héritées de son processus parent, sauf TZ. Utilisez la directive [[12-directives/env|env]] pour conserver certaines variables héritées.

- **`process.kill(pid, number | string)`**

  Envoie le signal au processus identifié par `pid`. Les noms de signaux sont des nombres ou des chaînes comme 'SIGINT' ou 'SIGHUP'. Voir [kill(2)](https://man7.org/linux/man-pages/man2/kill.2.html) pour plus d'informations.

- **`process.pid`**

  Renvoie le PID du processus courant.

- **`process.ppid`**

  Renvoie le PID du processus parent courant.

### Chaînes

Par défaut, toutes les chaînes de njs sont des chaînes Unicode. Elles correspondent aux chaînes ECMAScript contenant des caractères Unicode. Avant la version 0.8.0, les chaînes d'octets étaient aussi prises en charge.

#### Chaînes d'octets

> [!NOTE]
> Depuis la version 0.8.0, la prise en charge des chaînes d'octets et de leurs méthodes a été supprimée. Pour manipuler des suites d'octets, utilisez l'objet Buffer et les propriétés `Buffer`, comme `r.requestBuffer`, `r.rawVariables`.

Les chaînes d'octets contiennent une suite d'octets et servent à sérialiser des chaînes Unicode vers des données externes ou à les désérialiser depuis des sources externes. Par exemple, la méthode toUTF8() sérialise une chaîne Unicode en chaîne d'octets encodée en UTF-8 :

```nginx
>> '£'.toUTF8().toString('hex')
'c2a3'  /* C2 A3 is the UTF-8 representation of 00A3 ('£') code point */
```

La méthode toBytes() sérialise une chaîne Unicode dont les points de code ne dépassent pas 255 en chaîne d'octets ; sinon, `null` est renvoyé :

```nginx
>> '£'.toBytes().toString('hex')
'a3'  /* a3 is a byte equal to 00A3 ('£') code point  */
```

- **`String.bytesFrom(array | string, encoding)`**

  La méthode est devenue obsolète en 0.4.4 et a été supprimée en 0.8.0. Utilisez plutôt la méthode `Buffer.from` :

  ```nginx
  >> Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]).toString()
  'buffer'

  >> Buffer.from('YnVmZmVy', 'base64').toString()
  'buffer'
  ```

  Avant la version 0.4.4, créait une chaîne d'octets soit à partir d'un tableau d'octets, soit à partir d'une chaîne encodée (0.2.3), l'encodage pouvant être `hex`, `base64` ou `base64url`.

- **`String.prototype.fromBytes(start[, end])`**

  la propriété est devenue obsolète en 0.7.7 et a été supprimée en 0.8.0. Avant la version 0.7.7, renvoyait une nouvelle chaîne Unicode à partir d'une chaîne d'octets, chaque octet étant remplacé par le point de code Unicode correspondant.

- **`String.prototype.fromUTF8(start[, end])`**

  la propriété est devenue obsolète en 0.7.7 et a été supprimée en 0.8.0. Utilisez plutôt la méthode `TextDecoder`. Avant la version 0.7.7, convertissait une chaîne d'octets contenant une chaîne UTF-8 valide en chaîne Unicode, sinon renvoyait `null`.

- **`String.prototype.toBytes(start[, end])`**

  la propriété est devenue obsolète en 0.7.7 et a été supprimée en 0.8.0. Avant la version 0.7.7, sérialisait une chaîne Unicode en chaîne d'octets, et renvoyait `null` si un caractère supérieur à 255 était trouvé.

- **`String.prototype.toString(encoding)`**

  la propriété est devenue obsolète en 0.7.7 et a été supprimée en 0.8.0. Avant la version 0.7.7, encodait une chaîne en `hex`, `base64` ou `base64url` :

  ```nginx
  >>  'αβγδ'.toString('base64url')
  'zrHOss6zzrQ'
  ```

  Avant la version 0.4.3, seule une chaîne d'octets pouvait être encodée :

  ```nginx
  >>  'αβγδ'.toUTF8().toString('base64url')
  'zrHOss6zzrQ'
  ```

- **`String.prototype.toUTF8(start[, end])`**

  la propriété est devenue obsolète en 0.7.7 et a été supprimée en 0.8.0. Utilisez plutôt la méthode `TextEncoder`. Avant la version 0.7.7, sérialisait une chaîne Unicode en chaîne d'octets encodée en UTF-8 :

  ```nginx
  >> 'αβγδ'.toUTF8().length
  8
  >> 'αβγδ'.length
  4
  ```

## API web

### Text Decoder

|   |
| --- |
| `TextDecoder()` |
| `TextDecoder.prototype.encoding` |
| `TextDecoder.prototype.fatal` |
| `TextDecoder.prototype.ignoreBOM` |
| `TextDecoder.prototype.decode()` |

`TextDecoder` produit un flux de points de code à partir d'un flux d'octets (0.4.3).

- **`TextDecoder([[encoding], options])`**

  Crée un nouvel objet `TextDecoder` pour l'`encoding` indiqué ; seul UTF-8 est actuellement pris en charge. `options` est un dictionnaire `TextDecoderOptions` avec la propriété :

  - **`fatal`**

    booléen indiquant si `TextDecoder.decode()` doit lever l'exception *TypeError* en cas d'erreur d'encodage, `false` par défaut.

- **`TextDecoder.prototype.encoding`**

  Renvoie une chaîne contenant le nom de l'encodage utilisé par `TextDecoder()`, en lecture seule.

- **`TextDecoder.prototype.fatal`**

  booléen, `true` si le mode d'erreur est fatal, en lecture seule.

- **`TextDecoder.prototype.ignoreBOM`**

  booléen, `true` si l'indicateur d'ordre des octets (BOM) est ignoré, en lecture seule.

- **`TextDecoder.prototype.decode(buffer, [options])`**

  Renvoie une chaîne contenant le texte décodé du `buffer` par `TextDecoder()`. Le tampon peut être un `ArrayBuffer`. `options` est un dictionnaire `TextDecodeOptions` avec la propriété :

  - **`stream`**

    booléen indiquant si d'autres données suivront dans des appels ultérieurs à `decode()` : `true` lors d'un traitement par blocs, `false` pour le dernier bloc ou des données non découpées. `false` par défaut.

  ```nginx
  >> (new TextDecoder()).decode(new Uint8Array([206,177,206,178]))
  αβ
  ```

### Text Encoder

|   |
| --- |
| `TextEncoder()` |
| `TextEncoder.prototype.encode()` |
| `TextEncoder.prototype.encodeInto()` |

L'objet `TextEncoder` produit un flux d'octets encodé en UTF-8 à partir d'un flux de points de code (0.4.3).

- **`TextEncoder()`**

  Renvoie un nouvel objet `TextEncoder` qui générera un flux d'octets encodé en UTF-8.

- **`TextEncoder.prototype.encode(string)`**

  Encode `string` dans un `Uint8Array` contenant le texte encodé en UTF-8.

- **`TextEncoder.prototype.encodeInto(string, uint8Array)`**

  Encode une `string` en UTF-8, place le résultat dans le `Uint8Array` de destination et renvoie un objet dictionnaire montrant la progression de l'encodage. Cet objet contient deux membres :

  - **`read`**

    nombre d'unités de code UTF-16 de la `string` source converties en UTF-8

  - **`written`**

    nombre d'octets modifiés dans le `Uint8Array` de destination

## minuteurs

|   |
| --- |
| `clearTimeout()` |
| `setTimeout()` |

- **`clearTimeout(timeout)`**

  Annule un objet `timeout` créé par `setTimeout()`.

- **`setTimeout(function, milliseconds[, argument1, argumentN])`**

  Appelle une `function` après le nombre de `milliseconds` indiqué. Un ou plusieurs `arguments` facultatifs peuvent être passés à la fonction. Renvoie un objet `timeout`.

  ```nginx
  function handler(v)
  {
      // ...
  }

  t = setTimeout(handler, 12);

  // ...

  clearTimeout(t);
  ```

### Fonctions globales

|   |
| --- |
| `atob()` |
| `btoa()` |

- **`atob(encodedData)`**

  Décode une chaîne de données encodée en `Base64`. Le paramètre `encodedData` est une chaîne binaire contenant les données encodées en Base64. Renvoie une chaîne contenant les données décodées de `encodedData`.

  La méthode similaire `btoa()` permet d'encoder et de transmettre des données qui poseraient sinon des problèmes de communication, puis d'utiliser `atob()` pour les décoder. On peut par exemple encoder, transmettre et décoder des caractères de contrôle comme les valeurs ASCII `0` à `31`.

  ```nginx
  const encodedData = btoa("text to encode"); // encode a string
  const decodedData = atob(encodedData); // decode the string
  ```

- **`btoa(stringToEncode)`**

  Crée une chaîne ASCII encodée en Base64 à partir d'une chaîne binaire. Le paramètre `stringToEncode` est la chaîne binaire à encoder. Renvoie une chaîne ASCII contenant la représentation Base64 de `stringToEncode`.

  La méthode permet d'encoder des données qui poseraient sinon des problèmes de communication, de les transmettre, puis d'utiliser `atob()` pour les décoder. On peut par exemple encoder des caractères de contrôle comme les valeurs ASCII `0` à `31`.

  ```nginx
  const encodedData = btoa("text to encode"); // encode a string
  const decodedData = atob(encodedData); // decode the string
  ```

## modules intégrés

### Tampon

|   |
| --- |
| `Buffer.alloc()` |
| `Buffer.allocUnsafe()` |
| `Buffer.byteLength()` |
| `Buffer.compare()` |
| `Buffer.concat()` |
| `Buffer.from(array)` |
| `Buffer.from(arrayBuffer)` |
| `Buffer.from(buffer)` |
| `Buffer.from(object)` |
| `Buffer.from(string)` |
| `Buffer.isBuffer()` |
| `Buffer.isEncoding()` |
| `buffer[]` |
| `buf.buffer` |
| `buf.byteOffset` |
| `buf.compare()` |
| `buf.copy()` |
| `buf.equals()` |
| `buf.fill()` |
| `buf.includes()` |
| `buf.indexOf()` |
| `buf.lastIndexOf()` |
| `buf.length` |
| `buf.readIntBE()` |
| `buf.readIntLE()` |
| `buf.readUIntBE()` |
| `buf.readUIntLE()` |
| `buf.readDoubleBE` |
| `buf.readDoubleLE()` |
| `buf.readFloatBE()` |
| `buf.readFloatLE()` |
| `buf.subarray()` |
| `buf.slice()` |
| `buf.swap16()` |
| `buf.swap32()` |
| `buf.swap64()` |
| `buf.toJSON()` |
| `buf.toString()` |
| `buf.write()` |
| `buf.writeIntBE()` |
| `buf.writeIntLE()` |
| `buf.writeUIntBE()` |
| `buf.writeUIntLE()` |
| `buf.writeDoubleBE()` |
| `buf.writeDoubleLE()` |
| `buf.writeFloatBE()` |
| `buf.writeFloatLE()` |

- **`Buffer.alloc(size[, fill[, encoding]]))`**

  Alloue un nouveau Buffer de la *size* indiquée. Sans *fill*, le Buffer est rempli de zéros. Avec *fill*, il est initialisé par `buf.fill(fill)`. Avec *fill* et *encoding*, il est initialisé par `buf.fill(fill, encoding)`.

  Le paramètre *fill* peut être une *string*, un *Buffer*, un *Uint8Array* ou un *integer*.

- **`Buffer.allocUnsafe(size)`**

  Comme `Buffer.alloc()`, sauf que la mémoire allouée n'est pas initialisée : le contenu du nouveau tampon est inconnu et peut contenir des données sensibles.

- **`Buffer.byteLength(value[, encoding])`**

  Renvoie la longueur en octets d'une valeur encodée avec *encoding*. La valeur peut être une `string`, un `Buffer`, un `TypedArray`, un `DataView` ou un `ArrayBuffer`. Si c'est une *string*, le paramètre `encoding` est son encodage : *utf8*, *hex*, *base64*, *base64url* ; *utf8* par défaut.

- **`Buffer.compare(buffer1, buffer2)`**

  Compare *buffer1* et *buffer2* lors du tri de tableaux d'instances Buffer. Renvoie `0` si *buffer1* est identique à *buffer2*, `1` si *buffer2* doit précéder *buffer1* dans le tri, ou `-1` si *buffer2* doit suivre *buffer1*.

- **`Buffer.concat(list[, totalLength])`**

  Renvoie un nouveau Buffer résultant de la concaténation de toutes les instances Buffer de la liste. Si la liste est vide ou que la longueur totale vaut 0, un Buffer de longueur nulle est renvoyé. Sans *totalLength*, la longueur est calculée en additionnant celles des Buffers de la liste. Si *totalLength* est indiqué, il est converti en entier non signé. Si la longueur cumulée des Buffers dépasse *totalLength*, le résultat est tronqué à *totalLength*.

- **`Buffer.from(array)`**

  Alloue un nouveau Buffer à partir d'un tableau d'octets compris entre `0` et `255`. Les entrées hors de cette plage sont tronquées.

- **`Buffer.from(arrayBuffer, byteOffset[, length]])`**

  Crée une vue sur l'*ArrayBuffer* sans copier la mémoire sous-jacente. Les arguments facultatifs *byteOffset* et *length* indiquent la plage mémoire de l'*arrayBuffer* partagée par le Buffer.

- **`Buffer.from(buffer)`**

  Copie les données du tampon passé dans une nouvelle instance Buffer.

- **`Buffer.from(object[, offsetOrEncoding[, length]])`**

  Pour les objets dont la fonction `valueOf()` renvoie une valeur non strictement égale à l'objet, renvoie `Buffer.from(object.valueOf()`, `offsetOrEncoding`, `length`).

- **`Buffer.from(string[, encoding])`**

  Crée un nouveau Buffer à partir d'une *string*. Le paramètre *encoding* indique l'encodage des caractères à utiliser pour convertir la chaîne en octets : `utf8`, `hex`, `base64`, `base64url` ; `utf8` par défaut.

- **`Buffer.isBuffer(object)`**

  Booléen, renvoie `true` si *object* est un Buffer.

- **`Buffer.isEncoding(encoding)`**

  Booléen, renvoie `true` si encoding est le nom d'un encodage de caractères pris en charge.

- **`buffer[index]`**

  Opérateur d'indice permettant de lire et définir l'octet à la position `index` dans `buffer`. Les valeurs désignent des octets individuels ; la plage autorisée va donc de 0 à 255 (en décimal).

- **`buf.buffer`**

  Objet `ArrayBuffer` sous-jacent à partir duquel ce Buffer est créé.

- **`buf.byteOffset`**

  Entier indiquant le `byteOffset` de l'objet `ArrayBuffer` sous-jacent du Buffer.

- **`buf.compare(target[, targetStart[, targetEnd[, sourceStart[, sourceEnd]]]])`**

  Compare le tampon à *target* et renvoie un nombre indiquant s'il vient avant, après, ou au même rang que *target* dans l'ordre de tri. La comparaison repose sur la suite réelle des octets de chaque Buffer. `targetStart` est l'entier donnant le décalage dans *target* où commencer la comparaison, 0 par défaut. `targetEnd` est le décalage dans *target* où l'arrêter, `target.length` par défaut. `sourceStart` est le décalage dans le tampon où commencer la comparaison, 0 par défaut. `sourceEnd` est le décalage dans le tampon où l'arrêter (non inclus), `buf.length` par défaut.

- **`buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])`**

  Copie les données d'une zone du tampon vers une zone de *target*, même si les zones mémoire se chevauchent. Le paramètre `target` est le *Buffer* ou *Uint8Array* de destination.

  `targetStart` est l'entier donnant le décalage dans la cible où commencer l'écriture, 0 par défaut. `sourceStart` est le décalage dans le tampon où commencer la copie, 0 par défaut. `sourceEnd` est le décalage dans le tampon où arrêter la copie (non inclus), *buf.length* par défaut.

- **`buf.equals(otherBuffer)`**

  Booléen, renvoie `true` si le Buffer et *otherBuffer* contiennent exactement les mêmes octets.

- **`buf.fill(value[, offset[, end]][, encoding])`**

  Remplit le Buffer avec la *value* indiquée. Sans *offset* ni *end*, tout le Buffer est rempli. La *value* est convertie en *uint32* si ce n'est ni une `string`, ni un `Buffer`, ni un `integer`. Si l'entier obtenu dépasse 255, le Buffer est rempli avec *value* et 255.

- **`buf.includes(value[, byteOffset][, encoding])`**

  Équivalent à `buf.indexOf()` `!== -1` ; renvoie `true` si la *value* a été trouvée dans le Buffer.

- **`buf.indexOf(value[, byteOffset][, encoding])`**

  Renvoie l'indice de la première occurrence de *value* dans le Buffer, ou *-1* si elle est absente. La *value* peut être une `string` avec l'*encoding* indiqué (*utf8* par défaut), un `Buffer`, un `Unit8Array` ou un nombre entre 0 et 255.

- **`buf.lastIndexOf(value[, byteOffset][, encoding])`**

  Comme `buf.indexOf()`, mais cherche la dernière occurrence de *value* au lieu de la première. La *value* peut être une chaîne, un Buffer ou un entier entre 1 et 255. Si *value* est une chaîne ou un Buffer vide, `byteOffset` est renvoyé.

- **`buf.length`**

  Renvoie le nombre d'octets du Buffer.

- **`buf.readIntBE(offset, byteLength)`**

  Lit *byteLength* octets de `buf` à l'*offset* indiqué et interprète le résultat comme une valeur signée en complément à deux, gros-boutiste, avec une précision allant jusqu'à 48 bits. Le paramètre *byteLength* est un entier entre 1 et 6 indiquant le nombre d'octets à lire.

  Les méthodes similaires suivantes sont aussi prises en charge : `buf.readInt8([offset])`, `buf.readInt16BE([offset])`, `buf.readInt32BE([offset])`.

- **`buf.readIntLE(offset, byteLength)`**

  Lit *byteLength* octets de `buf` à l'*offset* indiqué et interprète le résultat comme une valeur signée en complément à deux, petit-boutiste, avec une précision allant jusqu'à 48 bits. Le paramètre *byteLength* est un entier entre 1 et 6 indiquant le nombre d'octets à lire.

  Les méthodes similaires suivantes sont aussi prises en charge : `buf.readInt8([offset])`, `buf.readInt16LE([offset])`, `buf.readInt32LE([offset])`.

- **`buf.readUIntBE(offset, byteLength)`**

  Lit *byteLength* octets de `buf` à l'*offset* indiqué et interprète le résultat comme un entier gros-boutiste avec une précision allant jusqu'à 48 bits. Le paramètre *byteLength* est un entier entre 1 et 6 indiquant le nombre d'octets à lire.

  Les méthodes similaires suivantes sont aussi prises en charge : `buf.readUInt8([offset])`, `buf.readUInt16BE([offset])`, `buf.readUInt32BE([offset])`.

- **`buf.readUIntLE(offset, byteLength)`**

  Lit *byteLength* octets de `buf` à l'*offset* indiqué et interprète le résultat comme un entier petit-boutiste avec une précision allant jusqu'à 48 bits. Le paramètre *byteLength* est un entier entre 1 et 6 indiquant le nombre d'octets à lire.

  Les méthodes similaires suivantes sont aussi prises en charge : `buf.readUInt8([offset])`, `buf.readUInt16LE([offset])`, `buf.readUInt32LE([offset])`.

- **`buf.readDoubleBE`(\[*offset*\])**

  Lit un double 64 bits gros-boutiste de `buf` à l'*offset* indiqué.

- **`buf.readDoubleLE`(\[*offset*\])**

  Lit un double 64 bits petit-boutiste de `buf` à l'*offset* indiqué.

- **`buf.readFloatBE`(\[*offset*\])**

  Lit un flottant 32 bits gros-boutiste de `buf` à l'*offset* indiqué.

- **`buf.readFloatLE`(\[*offset*\])**

  Lit un flottant 32 bits petit-boutiste de `buf` à l'*offset* indiqué.

- **`buf.subarray([start[, end]])`**

  Renvoie un nouveau `buf` qui référence la même mémoire que l'original, mais décalé et rogné par *start* et *end*. Si *end* dépasse `buf.length`, le résultat est le même qu'avec end égal à `buf.length`.

- **`buf.slice([start[, end]])`**

  Renvoie un nouveau `buf` qui référence la même mémoire que l'original, mais décalé et rogné par les valeurs *start* et *end*. La méthode n'est pas compatible avec `Uint8Array.prototype.slice()`, superclasse de Buffer. Pour copier la tranche, utilisez `Uint8Array.prototype.slice()`.

- **`buf.swap16`()**

  Interprète `buf` comme un tableau de nombres non signés de 16 bits et inverse l'ordre des octets sur place. Lève une erreur si `buf.length` n'est pas un multiple de 2.

- **`buf.swap32`()**

  Interprète `buf` comme un tableau de nombres non signés de 32 bits et inverse l'ordre des octets sur place. Lève une erreur si `buf.length` n'est pas un multiple de 4.

- **`buf.swap64`()**

  Interprète `buf` comme un tableau de nombres de 64 bits et inverse l'ordre des octets sur place. Lève une erreur si `buf.length` n'est pas un multiple de 8.

- **`buf.toJSON`()**

  Renvoie une représentation JSON de `buf.` `JSON.stringify()` appelle implicitement cette fonction lors de la sérialisation d'une instance Buffer.

- **`buf.toString([encoding[, start[, end]]])`**

  Décode `buf` en chaîne selon l'*encoding* de caractères indiqué : *utf8*, *hex*, *base64*, *base64url*. Les paramètres *start* et *end* permettent de ne décoder qu'une partie du Buffer.

- **`buf.write(string[, offset[, length]][, encoding])`**

  Écrit une *string* dans `buf` à l'*offset* indiqué selon l'*encoding* de caractères. Le paramètre *length* est le nombre d'octets à écrire. Si le Buffer n'a pas assez de place pour toute la chaîne, seule une partie est écrite, mais les caractères partiellement encodés ne le sont pas. L'*encoding* peut être *utf8*, *hex*, *base64*, *base64url*.

- **`buf.writeIntBE(value, offset, byteLength)`**

  Écrit *byteLength* octets de *value* dans `buf` à l'*offset* indiqué, en gros-boutiste. Précision jusqu'à 48 bits. Le paramètre *byteLength* est un entier entre 1 et 6 indiquant le nombre d'octets.

  Les méthodes similaires suivantes sont aussi prises en charge : `buf.writeInt8`, `buf.writeInt16BE`, `buf.writeInt32BE`.

- **`buf.writeIntLE(value, offset, byteLength)`**

  Écrit *byteLength* octets de *value* dans `buf` à l'*offset* indiqué, en petit-boutiste. Précision jusqu'à 48 bits. Le paramètre *byteLength* est un entier entre 1 et 6 indiquant le nombre d'octets.

  Les méthodes similaires suivantes sont aussi prises en charge : `buf.writeInt8`, `buf.writeInt16LE`, `buf.writeInt32LE`.

- **`buf.writeUIntBE(value, offset, byteLength)`**

  Écrit *byteLength* octets de *value* dans `buf` à l'*offset* indiqué, en gros-boutiste. Précision jusqu'à 48 bits. Le paramètre *byteLength* est un entier entre 1 et 6 indiquant le nombre d'octets.

  Les méthodes similaires suivantes sont aussi prises en charge : `buf.writeUInt8`, `buf.writeUInt16BE`, `buf.writeUInt32BE`.

- **`buf.writeUIntLE(value, offset, byteLength)`**

  Écrit *byteLength* octets de *value* dans `buf` à l'*offset* indiqué, en petit-boutiste. Précision jusqu'à 48 bits. Le paramètre *byteLength* est un entier entre 1 et 6 indiquant le nombre d'octets.

  Les méthodes similaires suivantes sont aussi prises en charge : `buf.writeUInt8`, `buf.writeUInt16LE`, `buf.writeUInt32LE`.

- **`buf.writeDoubleBE(value, [offset])`**

  Écrit la *value* dans `buf` à l'*offset* indiqué, en gros-boutiste.

- **`buf.writeDoubleLE(value, [offset])`**

  Écrit la *value* dans `buf` à l'*offset* indiqué, en petit-boutiste.

- **`buf.writeFloatBE(value, [offset])`**

  Écrit la *value* dans `buf` à l'*offset* indiqué, en gros-boutiste.

- **`buf.writeFloatLE(value, [offset])`**

  Écrit la *value* dans `buf` à l'*offset* indiqué, en petit-boutiste.

### Crypto

|   |
| --- |
| `crypto.createHash()` |
| `crypto.createHmac()` |

> [!NOTE]
> Depuis la version 0.7.0, une API crypto étendue est disponible sous forme d'objet global crypto.

Le module Crypto fournit des fonctions cryptographiques. L'objet module s'importe avec `import crypto from 'crypto'`.

> [!NOTE]
> Depuis la version 0.9.7, le module Crypto nécessite OpenSSL et utilise OpenSSL EVP pour le hachage, ce qui rend disponible au code JavaScript tout algorithme de condensat pris en charge par la bibliothèque OpenSSL liée.

- **`crypto.createHash(algorithm)`**

  Crée et renvoie un objet Hash permettant de produire des condensats avec l'*algorithm* indiqué : `md5`, `sha1`, `sha256`, `sha384`, `sha512` ou tout autre condensat pris en charge par la bibliothèque OpenSSL liée (depuis 0.9.7). Avant la version 0.9.7, seuls `md5`, `sha1` et `sha256` étaient pris en charge.

- **`crypto.createHmac(algorithm, secret key)`**

  Crée et renvoie un objet HMAC utilisant l'*algorithm* et la *secret key* indiqués. L'algorithme peut être `md5`, `sha1`, `sha256`, `sha384`, `sha512` ou tout autre condensat pris en charge par la bibliothèque OpenSSL liée (depuis 0.9.7). Avant la version 0.9.7, seuls `md5`, `sha1` et `sha256` étaient pris en charge.

#### Table de hachage

|   |
| --- |
| `hash.update()` |
| `hash.digest()` |

- **`hash.update(data)`**

  Met à jour le contenu du hachage avec les *data* fournies.

- **`hash.digest([encoding])`**

  Calcule le condensat de toutes les données passées avec `hash.update()`. L'encodage peut être `hex`, `base64` ou `base64url`. Sans encodage, un objet Buffer (0.4.4) est renvoyé.

  > [!NOTE]
  > Avant la version (0.4.4), une chaîne d'octets était renvoyée au lieu d'un objet Buffer.

- **`hash.copy()`**

  Fait une copie de l'état courant du hachage (depuis 0.7.12).

```nginx
import crypto from 'crypto';

crypto.createHash('sha1').update('A').update('B').digest('base64url');
/* BtlFlCqiamG-GMPiK_GbvKjdK10 */
```

#### HMAC

|   |
| --- |
| `hmac.update()` |
| `hmac.digest()` |

- **`hmac.update(data)`**

  Met à jour le contenu HMAC avec les *data* fournies.

- **`hmac.digest([encoding])`**

  Calcule le condensat HMAC de toutes les données passées avec `hmac.update()`. L'encodage peut être `hex`, `base64` ou `base64url`. Sans encodage, un objet Buffer (0.4.4) est renvoyé.

  > [!NOTE]
  > Avant la version 0.4.4, une chaîne d'octets était renvoyée au lieu d'un objet Buffer.

```nginx
import crypto from 'crypto';

crypto.createHmac('sha1', 'secret.key').update('AB').digest('base64url');
/* Oglm93xn23_MkiaEq_e9u8zk374 */
```

### Système de fichiers

|   |
| --- |
| `fs.accessSync()` |
| `fs.appendFileSync()` |
| `fs.closeSync()` |
| `fs.existsSync()` |
| `fs.fstatSync()` |
| `fs.lstatSync()` |
| `fs.mkdirSync()` |
| `fs.openSync()` |
| `fs.promises.open()` |
| `fs.readdirSync()` |
| `fs.readFileSync()` |
| `fs.readlinkSync()` |
| `fs.readSync()` |
| `fs.realpathSync()` |
| `fs.renameSync()` |
| `fs.rmdirSync()` |
| `fs.statSync()` |
| `fs.symlinkSync()` |
| `fs.unlinkSync()` |
| `fs.writeFileSync()` |
| `fs.writeSync()` |
| `fs.writeSync()` |

|   |
| --- |
| `fs.Dirent` |
| `fs.FileHandle` |
| `fs.Stats` |
| `File Access Constants` |
| `File System Flags` |

Le module File System fournit des opérations sur les fichiers.

L'objet module s'importe avec `import fs from 'fs'`. Depuis la version 0.3.9, des versions à base de promesses des méthodes sont disponibles via l'objet `fs.promises` après import avec `import fs from 'fs'` :

```nginx
import fs from 'fs';

fs.promises.readFile("/file/path").then((data) => {
    /* <file data> */
});
```

- **`accessSync(path[, mode])`**

  Teste de façon synchrone les permissions d'un fichier ou répertoire indiqué par `path` (0.3.9). Si la vérification échoue, une erreur est renvoyée ; sinon, la méthode renvoie undefined.

  - **`mode`**

    entier facultatif indiquant les vérifications d'accessibilité à effectuer, `fs.constants.F_OK` par défaut

    ```nginx
    try {
        fs.accessSync('/file/path', fs.constants.R_OK | fs.constants.W_OK);
        console.log('has access');
    } catch (e) {
        console.log('no access');)
    }
    ```

- **`appendFileSync(filename, data[, options])`**

  Ajoute de façon synchrone les `data` indiquées au fichier `filename`. `data` doit être une chaîne ou un objet Buffer (0.4.4). Si le fichier n'existe pas, il est créé. Le paramètre `options` doit être un objet avec les clés suivantes :

  - **`mode`**

    option mode, `0o666` par défaut

  - **`flag`**

    indicateur de système de fichiers, `a` par défaut

- **`closeSync(fd)`**

  Ferme le descripteur de fichier `fd`, entier utilisé par la méthode. Renvoie `undefined`.

- **`existsSync(path)`**

  Booléen, renvoie `true` si le *path* indiqué existe. (0.8.2)

- **`fstatSync(fd)`**

  Récupère l'objet `fs.Stats` du descripteur de fichier (0.7.7). Le paramètre `fd` est un entier représentant le descripteur utilisé par la méthode.

- **`lstatSync(path[, options])`**

  Récupère de façon synchrone l'objet `fs.Stats` du lien symbolique désigné par `path` (0.7.1). Le paramètre `options` doit être un objet avec les clés suivantes :

  - **`throwIfNoEntry`**

    booléen indiquant si une exception est levée quand aucune entrée n'existe, au lieu de renvoyer `undefined`, `false` par défaut.

- **`mkdirSync(path[, options])`**

  Crée de façon synchrone un répertoire au `path` indiqué (0.4.2). Le paramètre `options` doit être un `integer` indiquant le mode, ou un objet avec les clés suivantes :

  - **`mode`**

    option mode, `0o777` par défaut.

- **`openSync(path[, flags[, mode]])`**

  Renvoie un entier représentant le descripteur du fichier ouvert `path` (0.7.7).

  - **`flags`**

    indicateur de système de fichiers, `r` par défaut

  - **`mode`**

    option mode, `0o666` par défaut

- **`promises.open(path[, flags[, mode]])`**

  Renvoie un objet `FileHandle` représentant le fichier ouvert `path` (0.7.7).

  - **`flags`**

    indicateur de système de fichiers, `r` par défaut

  - **`mode`**

    option mode, `0o666` par défaut

- **`readdirSync(path[, options])`**

  Lit de façon synchrone le contenu du répertoire au `path` indiqué (0.4.2). Le paramètre `options` doit être une chaîne indiquant l'encodage ou un objet avec les clés suivantes :

  - **`encoding`**

    encodage, `utf8` par défaut. L'encodage peut être `utf8` ou `buffer` (0.4.4).

  - **`withFileTypes`**

    si `true`, le tableau de fichiers contient des objets `fs.Dirent`, `false` par défaut.

- **`readFileSync(filename[, options])`**

  Renvoie de façon synchrone le contenu du fichier `filename`. Le paramètre `options` contient une `string` indiquant l'encodage. Avec un encodage, une chaîne est renvoyée ; sinon, un objet Buffer (0.4.4).

  > [!NOTE]
  > Avant la version 0.4.4, une chaîne d'octets était renvoyée sans encodage indiqué.

  Sinon, `options` doit être un objet avec les clés suivantes :

  - **`encoding`**

    encodage, non défini par défaut. L'encodage peut être `utf8`, `hex` (0.4.4), `base64` (0.4.4), `base64url` (0.4.4).

  - **`flag`**

    indicateur de système de fichiers, `r` par défaut

  ```nginx
  import fs from 'fs';

  var file = fs.readFileSync('/file/path.tar.gz');
  console.log(file.slice(0,2).toString('hex')) /* '1f8b' */
  ```

- **`readlinkSync(path[, options])`**

  Obtient de façon synchrone le contenu du lien symbolique `path` avec [readlink(2)](https://man7.org/linux/man-pages/man2/readlink.2.html) (0.8.7). L'argument `options` peut être une chaîne indiquant un encodage, ou un objet dont la propriété `encoding` indique l'encodage des caractères. Si `encoding` vaut *buffer*, le résultat est renvoyé sous forme d'objet `Buffer`, sinon sous forme de chaîne.

- **`readSync(fd, buffer, offset[, length[, position]])`**

  Lit le contenu d'un fichier via le descripteur `fd` ; renvoie le nombre d'octets lus (0.7.7).

  - **`buffer`**

    la valeur `buffer` peut être un `Buffer`, un `TypedArray` ou un `DataView`

  - **`offset`**

    `integer` représentant la position dans le tampon où écrire les données

  - **`length`**

    `integer` représentant le nombre d'octets à lire

  - **`position`**

    indique où commencer la lecture dans le fichier ; `integer` ou `null`, `null` par défaut. Si `position` vaut `null`, les données sont lues à la position courante et celle-ci est mise à jour. Si c'est un `integer`, la position courante reste inchangée

- **`realpathSync(path[, options])`**

  Calcule de façon synchrone le chemin canonique en résolvant `.`, `..` et les liens symboliques avec [realpath(3)](http://man7.org/linux/man-pages/man3/realpath.3.html). L'argument `options` peut être une chaîne indiquant un encodage, ou un objet dont la propriété encoding indique l'encodage du chemin passé à la fonction de rappel (0.3.9).

- **`renameSync(oldPath, newPath)`**

  Change de façon synchrone le nom ou l'emplacement d'un fichier de `oldPath` à `newPath` (0.3.4).

  ```nginx
  import fs from 'fs';

  fs.renameSync('hello.txt', 'HelloWorld.txt');
  ```

- **`rmdirSync(path)`**

  Supprime de façon synchrone le répertoire au `path` indiqué (0.4.2).

- **`statSync(path,[ options])`**

  Récupère de façon synchrone l'objet `fs.Stats` du `path` indiqué (0.7.1). `path` peut être une `string` ou un `buffer`. Le paramètre `options` doit être un objet avec les clés suivantes :

  - **`throwIfNoEntry`**

    booléen indiquant si une exception est levée quand aucune entrée n'existe, au lieu de renvoyer `undefined`, `true` par défaut.

- **`symlinkSync(target, path)`**

  Crée de façon synchrone le lien `path` pointant vers `target` avec [symlink(2)](http://man7.org/linux/man-pages/man2/symlink.2.html) (0.3.9). Les cibles relatives le sont par rapport au répertoire parent du lien.

- **`unlinkSync(path)`**

  Supprime de façon synchrone le fichier `path` (0.3.9).

- **`writeFileSync(filename, data[, options])`**

  Écrit de façon synchrone `data` dans le fichier `filename`. `data` doit être une chaîne ou un objet Buffer (0.4.4). Si le fichier n'existe pas, il est créé ; s'il existe, il est remplacé. Le paramètre `options` doit être un objet avec les clés suivantes :

  - **`mode`**

    option mode, `0o666` par défaut

  - **`flag`**

    indicateur de système de fichiers, `w` par défaut

  ```nginx
  import fs from 'fs';

  fs.writeFileSync('hello.txt', 'Hello world');
  ```

- **`writeSync(fd, buffer, offset[, length[, position]])`**

  Écrit un tampon dans un fichier via un descripteur ; renvoie le `number` d'octets écrits (0.7.7).

  - **`fd`**

    `integer` représentant le descripteur de fichier

  - **`buffer`**

    la valeur `buffer` peut être un `Buffer`, un `TypedArray` ou un `DataView`

  - **`offset`**

    `integer` déterminant la partie du tampon à écrire, `0` par défaut

  - **`length`**

    `integer` indiquant le nombre d'octets à écrire, par défaut un décalage de Buffer.byteLength

  - **`position`**

    décalage depuis le début du fichier où écrire les données ; `integer` ou `null`, `null` par défaut. Voir aussi [pwrite(2)](https://man7.org/linux/man-pages/man2/write.2.html).

- **`writeSync(fd, string[, position[, encoding]])`**

  Écrit une `string` dans un fichier via le descripteur `fd` ; renvoie le `number` d'octets écrits (0.7.7).

  - **`fd`**

    `integer` représentant un descripteur de fichier

  - **`position`**

    décalage depuis le début du fichier où écrire les données ; `integer` ou `null`, `null` par défaut. Voir aussi [pwrite(2)](https://man7.org/linux/man-pages/man2/write.2.html)

  - **`encoding`**

    `string`, `utf8` par défaut

#### fs.Dirent

`fs.Dirent` représente une entrée de répertoire — un fichier ou un sous-répertoire. Quand `readdirSync()` est appelée avec l'option `withFileTypes`, le tableau obtenu contient des objets `fs.Dirent`.

- `dirent.isBlockDevice()` — renvoie `true` si l'objet `fs.Dirent` décrit un périphérique en mode bloc.

- `dirent.isCharacterDevice()` — renvoie `true` si l'objet `fs.Dirent` décrit un périphérique en mode caractère.

- `dirent.isDirectory()` — renvoie `true` si l'objet `fs.Dirent` décrit un répertoire.

- `dirent.isFIFO()` — renvoie `true` si l'objet `fs.Dirent` décrit un tube FIFO (premier entré, premier sorti).

- `dirent.isFile()` — renvoie `true` si l'objet `fs.Dirent` décrit un fichier ordinaire.

- `dirent.isSocket()` — renvoie `true` si l'objet `fs.Dirent` décrit une socket.

- `dirent.isSymbolicLink()` — renvoie `true` si l'objet `fs.Dirent` décrit un lien symbolique.

- `dirent.name` — nom du fichier auquel l'objet `fs.Dirent` fait référence.

#### fs.FileHandle

|   |
| --- |
| `filehandle.close()` |
| `filehandle.fd` |
| `filehandle.read()` |
| `filehandle.stat()` |
| `filehandle.write(buf)` |
| `filehandle.write(str)` |

L'objet `FileHandle` enrobe un descripteur de fichier numérique (0.7.7). Ses instances sont créées par la méthode `fs.promises.open()`. Si un `FileHandle` n'est pas fermé avec la méthode `filehandle.close()`, il tente de fermer automatiquement le descripteur pour éviter les fuites de mémoire. Ne comptez pas sur ce comportement, peu fiable : fermez toujours explicitement un `FileHandle`.

- **`filehandle.close()`**

  Ferme le descripteur après avoir attendu la fin des opérations en attente. Renvoie une `promise`, résolue avec undefined en cas de succès.

- **`filehandle.fd`**

  Descripteur de fichier numérique géré par l'objet `FileHandle`.

- **`filehandle.read(buffer, offset[, length[, position]])`**

  Lit des données du fichier et les stocke dans le tampon fourni.

  - **`buffer`**

    tampon qui sera rempli avec les données lues ; `Buffer`, `TypedArray` ou `DataView`

  - **`offset`**

    `integer` représentant la position dans le tampon où commencer le remplissage

  - **`length`**

    `integer` représentant le nombre d'octets à lire

  - **`position`**

    position où commencer la lecture dans le fichier ; `integer` ou `null`. Avec `null`, les données sont lues à la position courante et celle-ci est mise à jour. Avec un `integer`, la position courante reste inchangée.

  Renvoie une `Promise` résolue en cas de succès avec un objet à deux propriétés :

  - **`bytesRead`**

    `integer` représentant le nombre d'octets lus

  - **`buffer`**

    référence à l'argument buffer passé ; `Buffer`, `TypedArray` ou `DataView`

- **`filehandle.stat()`**

  Résolue avec un fs.Stats du fichier ; renvoie une `promise`.

- **`filehandle.write(buffer, offset[, length[, position]])`**

  Écrit un tampon dans le fichier.

  - **`buffer`**

    la valeur `buffer` peut être un `Buffer`, un `TypedArray` ou un `DataView`

  - **`offset`**

    `integer` représentant la position de départ, dans le tampon, des données à écrire

  - **`length`**

    `integer` représentant le nombre d'octets du tampon à écrire, par défaut un décalage de Buffer.byteLength

  - **`position`**

    décalage depuis le début du fichier où écrire les données du tampon ; `integer` ou `null`, `null` par défaut. Si `position` n'est pas un `number`, les données sont écrites à la position courante. Voir la documentation POSIX de [pwrite(2)](https://man7.org/linux/man-pages/man2/write.2.html) pour les détails.

  Renvoie une `Promise` résolue avec un objet à deux propriétés :

  - **`bytesWritten`**

    `integer` représentant le nombre d'octets écrits

  - **`buffer`**

    référence au tampon écrit ; `Buffer`, `TypedArray` ou `DataView`

  > [!NOTE]
  > Il est dangereux d'appeler plusieurs fois `filehandle.write()` sur le même fichier sans attendre la résolution ou le rejet de la promesse.

- **`filehandle.write(string[, position[, encoding]])`**

  Écrit une `string` dans le fichier.

  - **`position`**

    décalage depuis le début du fichier où écrire les données du tampon ; `integer` ou `null`, `null` par défaut. Si `position` n'est pas un `number`, les données sont écrites à la position courante. Voir la documentation POSIX de [pwrite(2)](https://man7.org/linux/man-pages/man2/write.2.html) pour les détails.

  - **`encoding`**

    encodage attendu de la chaîne, `utf8` par défaut

  Renvoie une `Promise` résolue avec un objet à deux propriétés :

  - **`bytesWritten`**

    `integer` représentant le nombre d'octets écrits

  - **`buffer`**

    référence au tampon écrit ; `Buffer`, `TypedArray` ou `DataView`

  > [!NOTE]
  > Il est dangereux d'appeler plusieurs fois `filehandle.write()` sur le même fichier sans attendre la résolution ou le rejet de la promesse.

#### fs.Stats

L'objet `fs.Stats` fournit des informations sur un fichier. Il est renvoyé par fs.statSync() et fs.lstatSync().

- `stats.isBlockDevice()` — renvoie `true` si l'objet `fs.Stats` décrit un périphérique en mode bloc.

- `stats.isDirectory()` — renvoie `true` si l'objet `fs.Stats` décrit un répertoire.

- `stats.isFIFO()` — renvoie `true` si l'objet `fs.Stats` décrit un tube FIFO (premier entré, premier sorti).

- `stats.isFile()` — renvoie `true` si l'objet `fs.Stats` décrit un fichier ordinaire.

- `stats.isSocket()` — renvoie `true` si l'objet `fs.Stats` décrit une socket.

- `stats.isSymbolicLink()` — renvoie `true` si l'objet `fs.Stats` décrit un lien symbolique.

- `stats.dev` — identifiant numérique du périphérique contenant le fichier.

- `stats.ino` — numéro d'`Inode` du fichier, propre au système de fichiers.

- `stats.mode` — champ de bits décrivant le type et le mode du fichier.

- `stats.nlink` — nombre de liens physiques du fichier.

- `stats.uid` — identifiant numérique de l'utilisateur propriétaire du fichier (POSIX).

- `stats.gid` — identifiant numérique du groupe propriétaire du fichier (POSIX).

- `stats.rdev` — identifiant numérique du périphérique si le fichier en représente un.

- `stats.size` — taille du fichier en octets.

- `stats.blksize` — taille de bloc du système de fichiers pour les E/S.

- `stats.blocks` — nombre de blocs alloués au fichier.

- `stats.atimeMs` — horodatage du dernier accès au fichier, en millisecondes depuis l'Epoch POSIX.

- `stats.mtimeMs` — horodatage de la dernière modification du contenu, en millisecondes depuis l'Epoch POSIX.

- `stats.ctimeMs` — horodatage du dernier changement du fichier, en millisecondes depuis l'Epoch POSIX.

- `stats.birthtimeMs` — horodatage de création du fichier, en millisecondes depuis l'Epoch POSIX.

- `stats.atime` — horodatage du dernier accès au fichier.

- `stats.mtime` — horodatage de la dernière modification du contenu.

- `stats.ctime` — horodatage du dernier changement du fichier.

- `stats.birthtime` — horodatage de création du fichier.

#### Constantes d'accès aux fichiers

La méthode `access()` accepte les indicateurs suivants, exportés par `fs.constants` :

- `F_OK` — le fichier est visible par le processus appelant ; utilisé par défaut si aucun mode n'est indiqué

- `R_OK` — le fichier peut être lu par le processus appelant

- `W_OK` — le fichier peut être écrit par le processus appelant

- `X_OK` — le fichier peut être exécuté par le processus appelant

#### Indicateurs de système de fichiers

L'option `flag` accepte les valeurs suivantes :

- `a` — ouvre un fichier en ajout. Le fichier est créé s'il n'existe pas

- `ax` — comme `a`, mais échoue si le fichier existe déjà

- `a+` — ouvre un fichier en lecture et ajout. Le fichier est créé s'il n'existe pas

- `ax+` — comme `a+`, mais échoue si le fichier existe déjà

- `as` — ouvre un fichier en ajout en mode synchrone. Le fichier est créé s'il n'existe pas

- `as+` — ouvre un fichier en lecture et ajout en mode synchrone. Le fichier est créé s'il n'existe pas

- `r` — ouvre un fichier en lecture. Une exception est levée si le fichier n'existe pas

- `r+` — ouvre un fichier en lecture et écriture. Une exception est levée si le fichier n'existe pas

- `rs+` — ouvre un fichier en lecture et écriture en mode synchrone. Demande au système d'exploitation de contourner le cache local du système de fichiers

- `w` — ouvre un fichier en écriture. Le fichier est créé s'il n'existe pas, remplacé s'il existe

- `wx` — comme `w`, mais échoue si le fichier existe déjà

- `w+` — ouvre un fichier en lecture et écriture. Le fichier est créé s'il n'existe pas, remplacé s'il existe

- `wx+` — comme `w+`, mais échoue si le fichier existe déjà

### Query String

|   |
| --- |
| `querystring.decode()` |
| `querystring.encode()` |
| `querystring.escape()` |
| `querystring.parse()` |
| `querystring.stringify()` |
| `querystring.unescape()` |

Le module Query String permet d'analyser et de formater les chaînes de requête d'URL (0.4.3). L'objet module s'importe avec `import qs from 'querystring'`.

- **`querystring.decode()`**

  alias de `querystring.parse()`.

- **`querystring.encode()`**

  alias de `querystring.stringify()`.

- **`querystring.escape(string)`**

  Encode pour URL la `string` fournie ; renvoie une chaîne de requête échappée. Utilisée par `querystring.stringify()`, elle ne doit pas être appelée directement.

- **`querystring.parse(string[, separator[, equal[, options]]])`**

  Analyse la chaîne de requête d'URL et renvoie un objet.

  Le paramètre `separator` est la sous-chaîne qui sépare les paires clé-valeur dans la chaîne de requête, « `&` » par défaut.

  Le paramètre `equal` est la sous-chaîne qui sépare clés et valeurs dans la chaîne de requête, « `=` » par défaut.

  Le paramètre `options` doit être un objet avec les clés suivantes :

  - **`decodeURIComponent` *function***

    Fonction de décodage des caractères encodés en pourcentage dans la chaîne de requête, `querystring.unescape()` par défaut

  - **`maxKeys` *number***

    nombre maximal de clés à analyser, `1000` par défaut. La valeur `0` supprime la limite.

  Par défaut, les caractères encodés en pourcentage dans la chaîne de requête sont supposés être en UTF-8 ; les séquences UTF-8 invalides sont remplacées par le caractère de remplacement `U+FFFD`.

  Par exemple, pour la chaîne de requête suivante

  ```nginx
  'foo=bar&abc=xyz&abc=123'
  ```

  la sortie sera :

  ```nginx
  {
    foo: 'bar',
    abc: ['xyz', '123']
  }
  ```

- **`querystring.stringify(object[, separator[, equal[, options]]])`**

  Sérialise un objet et renvoie une chaîne de requête d'URL.

  Le paramètre `separator` est la sous-chaîne qui sépare les paires clé-valeur dans la chaîne de requête, « `&` » par défaut.

  Le paramètre `equal` est la sous-chaîne qui sépare clés et valeurs dans la chaîne de requête, « `=` » par défaut.

  Le paramètre `options` doit être un objet avec les clés suivantes :

  - **`encodeURIComponent` *function***

    Fonction utilisée pour encoder en pourcentage les caractères non sûrs pour une URL dans la chaîne de requête, `querystring.escape()` par défaut.

  Par défaut, les caractères à encoder en pourcentage dans la chaîne de requête sont encodés en UTF-8. Pour un autre encodage, indiquez l'option `encodeURIComponent`.

  Par exemple, pour la commande suivante

  ```nginx
  querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], 123: '' });
  ```

  la chaîne de requête sera :

  ```nginx
  'foo=bar&baz=qux&baz=quux&123='
  ```

- **`querystring.unescape(string)`**

  Décode les caractères encodés en pourcentage de la `string` ; renvoie une chaîne de requête non échappée. Utilisée par `querystring.parse()`, elle ne doit pas être appelée directement.

### XML

|   |
| --- |
| `xml.parse()` |
| `xml.c14n()` |
| `xml.exclusiveC14n()` |
| `xml.serialize()` |
| `xml.serializeToString()` |
| `XMLDoc` |
| `XMLNode` |
| `XMLAttr` |

Le module XML permet de manipuler des documents XML (depuis 0.7.10). L'objet module s'importe avec `import xml from 'xml'`.

Exemple :

```nginx
import xml from 'xml';

let data = `<note><to b="bar" a= "foo" >Tove</to><from>Jani</from></note>`;
let doc = xml.parse(data);

console.log(doc.note.to.$text) /* 'Tove' */
console.log(doc.note.to.$attr$b) /* 'bar' */
console.log(doc.note.$tags[1].$text) /* 'Jani' */

let dec = new TextDecoder();
let c14n = dec.decode(xml.exclusiveC14n(doc.note));
console.log(c14n) /* '<note><to a="foo" b="bar">Tove</to><from>Jani</from></note>' */

c14n = dec.decode(xml.exclusiveC14n(doc.note.to));
console.log(c14n) /* '<to a="foo" b="bar">Tove</to>' */

c14n = dec.decode(xml.exclusiveC14n(doc.note, doc.note.to /* excluding 'to' */));
console.log(c14n) /* '<note><from>Jani</from></note>' */
```

- **`parse(string | Buffer)`**

  Analyse une chaîne ou un Buffer contenant un document XML ; renvoie un objet enveloppe `XMLDoc` représentant le document analysé.

- **`c14n(root_node[, excluding_node])`**

  Canonicalise `root_node` et ses enfants selon [Canonical XML Version 1.1](https://www.w3.org/TR/xml-c14n). `root_node` peut être un objet enveloppe `XMLNode` ou `XMLDoc` autour de la structure XML. Renvoie un objet Buffer contenant la sortie canonicalisée.

  - **`excluding_node`**

    permet d'omettre une partie du document dans la sortie

- **`exclusiveC14n(root_node[, excluding_node[, withComments [,prefix_list]]])`**

  Canonicalise `root_node` et ses enfants selon [Exclusive XML Canonicalization Version 1.0](https://www.w3.org/TR/xml-exc-c14n/).

  - **`root_node`**

    objet enveloppe `XMLNode` ou `XMLDoc` autour de la structure XML

  - **`excluding_node`**

    permet d'omettre de la sortie la partie du document correspondant au nœud et à ses enfants

  - **`withComments`**

    booléen, `false` par défaut. Avec `true`, la canonicalisation correspond à [Exclusive XML Canonicalization Version 1.0](http://www.w3.org/2001/10/xml-exc-c14n#WithComments). Renvoie un objet Buffer contenant la sortie canonicalisée.

  - **`prefix_list`**

    chaîne facultative de préfixes d'espaces de noms, séparés par des espaces, à inclure aussi dans la sortie

- **`serialize()`**

  Comme `xml.c14n()` (depuis 0.7.11).

- **`serializeToString()`**

  Comme `xml.c14n()`, mais renvoie le résultat sous forme de `string` (depuis 0.7.11).

- **`XMLDoc`**

  Objet enveloppe XMLDoc autour de la structure XML, nœud racine du document.

  - **`doc.$root`**

    la racine du document par son nom, ou undefined

  - **`doc.abc`**

    la première balise racine nommée *abc*, sous forme d'objet enveloppe `XMLNode`

- **`XMLNode`**

  Objet enveloppe XMLNode autour d'un nœud de balise XML. Depuis la version 1.0.2, les enveloppes existantes d'un nœud continuent à y faire référence après modification. Les nœuds retirés restent lisibles mais ne peuvent plus être modifiés.

  - **`node.abc`**

    comme `node.$tag$abc`, sauf si *abc* est le nom d'une méthode de XMLNode

  - **`node.$attr$abc`**

    valeur de l'attribut *abc* du nœud, modifiable depuis 0.7.11

  - **`node.$attr$abc`=*xyz***

    comme `node.setAttribute('abc', xyz)` (depuis 0.7.11)

  - **`node.$attrs`**

    objet enveloppe `XMLAttr` pour tous les attributs du nœud

  - **`node.$name`**

    nom du nœud

  - **`node.$ns`**

    espace de noms du nœud

  - **`node.$parent`**

    nœud parent du nœud courant, ou `undefined` pour la racine d'un document. Depuis la version 1.0.2, la valeur est aussi `undefined` pour un nœud retiré

  - **`node.$tag$abc`**

    première balise enfant du nœud nommée *abc*. Cette forme est obligatoire si *abc* est aussi le nom d'une méthode de XMLNode. L'affectation n'est pas prise en charge. Supprimer la propriété retire les balises enfants correspondantes

  - **`node.$tags`**

    tableau de toutes les balises enfants

  - **`node.$tags = [node1, node2, ...]`**

    comme `node.removeChildren`(); `node.addChild(node1)`; `node.addChild(node2)` (depuis 0.7.11). Depuis la version 1.0.2, les sources XMLDoc sont prises en charge et les nœuds source ne doivent pas avoir d'espace de noms

  - **`node.$tags$abc`**

    toutes les balises enfants du nœud nommées *abc*. Affectation et suppression non prises en charge

  - **`node.$text`**

    contenu du nœud, modifiable depuis 0.7.11. Depuis la version 1.0.2, affecter une chaîne remplace tous les nœuds enfants, tandis qu'affecter `null` ou `undefined` les retire

  - **`node.$text = 'abc'`**

    comme `node.setText('abc')` (depuis 0.7.11)

  - **`node.addChild(nd)`**

    ajoute un XMLNode comme enfant du nœud (depuis 0.7.11). `nd` est copié récursivement avant l'ajout. Depuis la version 1.0.2, les sources XMLDoc sont prises en charge et les nœuds source ne doivent pas avoir d'espace de noms

  - **`node.getAttributeNS(namespaceURI, localName)`**

    renvoie la valeur du premier attribut correspondant à `namespaceURI` et `localName`, ou `undefined` s'il n'y en a pas. `namespaceURI` est une chaîne ou `null` ; une chaîne vide et `null` correspondent aux attributs sans espace de noms. Un attribut sans préfixe n'a pas d'espace de noms, même si un espace de noms par défaut est déclaré. Depuis 1.0.2

  - **`node.getChildNS(namespaceURI, localName)`**

    renvoie la première balise enfant correspondant à `namespaceURI` et `localName`, ou `undefined` s'il n'y en a pas. `namespaceURI` est une chaîne ou `null` ; une chaîne vide et `null` correspondent aux balises sans espace de noms. Depuis 1.0.2

  - **`node.removeAllAttributes()`**

    supprime tous les attributs du nœud (depuis 0.7.11)

  - **`node.removeAttribute(attr_name)`**

    supprime l'attribut nommé `attr_name` (depuis 0.7.11)

  - **`node.removeChildren(tag_name)`**

    supprime toutes les balises enfants nommées `tag_name` (depuis 0.7.11). Sans `tag_name`, tous les nœuds enfants sont supprimés

  - **`node.removeText()`**

    supprime tous les nœuds enfants (0.7.11)

  - **`node.setAttribute(attr_name, value)`**

    définit la valeur de `attr_name` (depuis 0.7.11). Depuis la version 1.0.2, une chaîne est affectée à l'attribut, tandis que `null` ou `undefined` le supprime

  - **`node.setText(value)`**

    définit le texte du nœud (depuis 0.7.11). Depuis la version 1.0.2, une chaîne remplace tous les nœuds enfants, tandis que `null` ou `undefined` les supprime tous

- **`XMLAttr`**

  Objet enveloppe XMLAttrs autour des attributs d'un nœud XML.

  - **`attr.abc`**

    valeur de l'attribut *abc*

### zlib

|   |
| --- |
| `zlib.deflateRawSync()` |
| `zlib.deflateSync()` |
| `zlib.inflateRawSync()` |
| `zlib.inflateSync()` |

Le module zlib fournit des fonctions de compression avec les algorithmes « deflate » et « inflate » (depuis 0.7.12). L'objet module s'importe avec `import zlib from 'zlib'`.

- **`deflateRawSync(string | Buffer[, options])`**

  Compresse avec l'algorithme « deflate » des données fournies sous forme de chaîne ou de Buffer, sans ajouter d'en-tête zlib. La valeur peut être un `Buffer`, un `TypedArray` ou un `DataView`. `Options` est un objet facultatif contenant des `zlib_options`. Renvoie une instance Buffer contenant les données compressées.

- **`deflateSync(string | Buffer[, options])`**

  Compresse avec l'algorithme « deflate » des données fournies sous forme de chaîne ou de Buffer. La valeur peut être un `Buffer`, un `TypedArray` ou un `DataView`. `Options` est un objet facultatif contenant des `zlib_options`. Renvoie une instance Buffer contenant les données compressées.

- **`inflateRawSync(string | Buffer)`**

  Décompresse un flux brut avec l'algorithme « deflate ». Renvoie une instance Buffer contenant les données décompressées.

- **`inflateSync(string | Buffer)`**

  Décompresse un flux avec l'algorithme « deflate ». Renvoie une instance Buffer contenant les données décompressées.

#### Options zlib

- `chunkSize` — entier, `1024` par défaut

- `dictionary` — `Buffer`, `TypedArray` ou `DataView`, vide par défaut

- `level` — entier, compression uniquement ; voir `zlib_compression_levels`

- `memLevel` — entier de `1` à `9`, compression uniquement

- `strategy` — entier, compression uniquement ; voir `zlib_compression_strategy`

- `windowBits` — entier de `-15` à `-9` pour des données brutes, de `9` à `15` pour un flux ordinaire

#### Niveaux de compression zlib

|   |   |
| --- | --- |
| Nom | Description |
| `zlib.constants.Z_NO_COMPRESSION` | pas de compression |
| `zlib.constants.Z_BEST_SPEED` | le plus rapide, compression la plus faible |
| `zlib.constants.Z_DEFAULT_COMPRESSION` | compromis entre vitesse et compression |
| `zlib.constants.Z_BEST_COMPRESSION` | le plus lent, compression la plus forte |

#### Stratégie de compression zlib

|   |   |
| --- | --- |
| Nom | Description |
| `zlib.constants.Z_FILTERED` | Stratégie filtrée : pour les données produites par un filtre ou un prédicteur |
| `zlib.constants.Z_HUFFMAN_ONLY` | Stratégie Huffman seul : codage de Huffman uniquement, sans recherche de chaînes |
| `zlib.constants.Z_RLE` | Stratégie RLE (Run Length Encoding) : limite les distances de correspondance à un, meilleure compression des images PNG |
| `zlib.constants.Z_FIXED` | Stratégie à table fixe : empêche l'utilisation de codes de Huffman dynamiques, décodeur plus simple pour des applications particulières |
| `zlib.constants.Z_DEFAULT_STRATEGY` | Stratégie par défaut, adaptée à la compression générale |

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
