---
title: "Utiliser des modules Node avec njs"
description: "Nginx — Utiliser des modules Node avec njs. Un développeur souhaite souvent utiliser du code tiers, généralement disponible sous forme de bibliothèque. Dans le monde JavaScript, la notion de module est relativement récente et il n'existait pas de norme jusqu'à…"
tags: [nginx, guide]
icon: book-open
---

Un développeur souhaite souvent utiliser du code tiers, généralement disponible sous forme de bibliothèque. Dans le monde JavaScript, la notion de module est relativement récente et il n'existait pas de norme jusqu'à récemment. Beaucoup de plates-formes (navigateurs) ne prennent toujours pas en charge les modules, ce qui complique la réutilisation du code. Cet article décrit des moyens de réutiliser du code [Node.js](https://nodejs.org/) dans njs.

> [!NOTE]
> Les exemples de cet article utilisent des fonctions apparues dans [[10-guides/04-njs/00-index|njs]] 0.3.8

Plusieurs problèmes peuvent survenir lors de l'ajout de code tiers dans njs :

- Plusieurs fichiers qui se référencent entre eux et leurs dépendances
- API propres à une plate-forme
- Constructions modernes du langage

Ces problèmes ne sont ni nouveaux ni propres à njs : les développeurs JavaScript y sont confrontés chaque jour pour prendre en charge des plates-formes très différentes. Des outils existent pour les résoudre.

- Plusieurs fichiers qui se référencent entre eux, et leurs dépendances

  On résout ce problème en regroupant tout le code interdépendant dans un seul fichier. Des outils comme [browserify](http://browserify.org/) ou [webpack](https://webpack.js.org/) prennent un projet entier et produisent un seul fichier contenant votre code et toutes ses dépendances.
- API propres à une plate-forme

  On peut utiliser des bibliothèques qui mettent en œuvre ces API de façon indépendante de la plate-forme (au prix des performances). Certaines fonctions peuvent aussi être mises en œuvre par l'approche des [polyfills](https://polyfill.io/v3/).
- Constructions modernes du langage

  Ce code peut être transpilé : une série de transformations réécrit les fonctions récentes du langage selon une norme plus ancienne. On peut par exemple utiliser le projet [babel](https://babeljs.io/).

Dans ce guide, nous utilisons deux bibliothèques assez volumineuses hébergées sur npm :

- [protobufjs](https://www.npmjs.com/package/protobufjs) : bibliothèque de création et d'analyse des messages protobuf utilisés par le protocole [gRPC](https://grpc.io/)
- [dns-packet](https://www.npmjs.com/package/dns-packet) : bibliothèque de traitement des paquets du protocole DNS

## Environnement

> [!NOTE]
> Ce document adopte surtout une approche générique et évite les conseils de bonnes pratiques propres à Node.js et JavaScript. Consultez le manuel de chaque paquet avant de suivre les étapes proposées ici.

Commençons (Node.js étant installé et fonctionnel) par créer un projet vide et installer quelques dépendances ; les commandes ci-dessous supposent que nous sommes dans le répertoire de travail :

```nginx
$ mkdir my_project && cd my_project
$ npx license choose_your_license_here > LICENSE
$ npx gitignore node

$ cat > package.json <<EOF
{
  "name":        "foobar",
  "version":     "0.0.1",
  "description": "",
  "main":        "index.js",
  "keywords":    [],
  "author":      "somename <some.email@example.com> (https://example.com)",
  "license":     "some_license_here",
  "private":     true,
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
EOF
$ npm init -y
$ npm install browserify
```

## Protobufjs

La bibliothèque fournit un analyseur des définitions d'interface `.proto` et un générateur de code pour analyser et produire les messages.

Dans cet exemple, nous utilisons le fichier [helloworld.proto](https://github.com/grpc/grpc/blob/master/examples/protos/helloworld.proto) des exemples gRPC. L'objectif est de créer deux messages : `HelloRequest` et `HelloResponse`. Nous utilisons le mode [statique](https://github.com/protobufjs/protobuf.js/blob/master/README.md#reflection-vs-static-code) de protobufjs plutôt que la génération dynamique de classes, car njs ne permet pas d'ajouter dynamiquement de nouvelles fonctions pour des raisons de sécurité.

On installe ensuite la bibliothèque et on génère, à partir de la définition du protocole, le code JavaScript de sérialisation des messages :

```nginx
$ npm install protobufjs
$ npx pbjs -t static-module helloworld.proto > static.js
```

Le fichier `static.js` devient ainsi notre nouvelle dépendance ; il contient tout le code nécessaire au traitement des messages. La fonction `set_buffer()` utilise la bibliothèque pour créer un tampon contenant le message `HelloRequest` sérialisé. Ce code se trouve dans le fichier `code.js` :

```nginx
var pb = require('./static.js');

// Example usage of protobuf library: prepare a buffer to send
function set_buffer(pb)
{
    // set fields of gRPC payload
    var payload = { name: "TestString" };

    // create an object
    var message = pb.helloworld.HelloRequest.create(payload);

    // serialize object to buffer
    var buffer = pb.helloworld.HelloRequest.encode(message).finish();

    var n = buffer.length;

    var frame = new Uint8Array(5 + buffer.length);

    frame[0] = 0;                        // 'compressed' flag
    frame[1] = (n & 0xFF000000) >>> 24;  // length: uint32 in network byte order
    frame[2] = (n & 0x00FF0000) >>> 16;
    frame[3] = (n & 0x0000FF00) >>>  8;
    frame[4] = (n & 0x000000FF) >>>  0;

    frame.set(buffer, 5);

    return frame;
}

var frame = set_buffer(pb);
```

Pour vérifier qu'il fonctionne, exécutons le code avec node :

```nginx
$ node ./code.js
Uint8Array [
    0,   0,   0,   0,  12, 10,
   10,  84, 101, 115, 116, 83,
  116, 114, 105, 110, 103
]
```

On obtient bien une trame `gRPC` correctement encodée. Exécutons maintenant le code avec njs :

```nginx
$ njs ./code.js
Thrown:
Error: Cannot find module "./static.js"
    at require (native)
    at main (native)
```

Les modules ne sont pas pris en charge : nous obtenons une exception. Pour contourner ce problème, utilisons `browserify` ou un outil similaire.

Traiter tel quel notre fichier `code.js` produirait un code JS destiné à s'exécuter dans un navigateur, c'est-à-dire dès son chargement, ce que nous ne voulons pas. Nous voulons plutôt une fonction exportée qu'on peut appeler depuis la configuration de nginx, ce qui nécessite un peu de code d'enrobage.

> [!NOTE]
> Dans ce guide, nous utilisons l'[[10-guides/04-njs/cli|utilitaire en ligne de commande]] njs dans tous les exemples, par simplicité. En pratique, vous utiliserez le module njs de nginx pour exécuter votre code.

Le fichier `load.js` contient le code de chargement de la bibliothèque, qui conserve sa référence dans l'espace de noms global :

```nginx
global.hello = require('./static.js');
```

Ce code sera remplacé par le contenu regroupé. Notre code utilisera la référence « `global.hello` » pour accéder à la bibliothèque.

Traitons-le ensuite avec `browserify` pour réunir toutes les dépendances dans un seul fichier :

```nginx
$ npx browserify load.js -o bundle.js -d
```

On obtient un énorme fichier qui contient toutes nos dépendances :

```nginx
(function(){function......
...
...
},{"protobufjs/minimal":9}]},{},[1])
//# sourceMappingURL..............
```

Pour obtenir le fichier final « `njs_bundle.js` », nous concaténons « `bundle.js` » et le code suivant :

```nginx
// Example usage of protobuf library: prepare a buffer to send
function set_buffer(pb)
{
    // set fields of gRPC payload
    var payload = { name: "TestString" };

    // create an object
    var message = pb.helloworld.HelloRequest.create(payload);

    // serialize object to buffer
    var buffer = pb.helloworld.HelloRequest.encode(message).finish();

    var n = buffer.length;

    var frame = new Uint8Array(5 + buffer.length);

    frame[0] = 0;                        // 'compressed' flag
    frame[1] = (n & 0xFF000000) >>> 24;  // length: uint32 in network byte order
    frame[2] = (n & 0x00FF0000) >>> 16;
    frame[3] = (n & 0x0000FF00) >>>  8;
    frame[4] = (n & 0x000000FF) >>>  0;

    frame.set(buffer, 5);

    return frame;
}

// functions to be called from outside
function setbuf()
{
    return set_buffer(global.hello);
}

// call the code
var frame = setbuf();
console.log(frame);
```

Exécutons le fichier avec node pour vérifier que tout fonctionne encore :

```nginx
$ node ./njs_bundle.js
Uint8Array [
    0,   0,   0,   0,  12, 10,
   10,  84, 101, 115, 116, 83,
  116, 114, 105, 110, 103
]
```

Poursuivons maintenant avec njs :

```nginx
$ njs ./njs_bundle.js
Uint8Array [0,0,0,0,12,10,10,84,101,115,116,83,116,114,105,110,103]
```

Il reste à utiliser l'API propre à njs pour convertir le tableau en chaîne d'octets, utilisable par le module nginx. Ajoutons le fragment suivant avant la ligne `return frame; }` :

```nginx
if (global.njs) {
    return String.bytesFrom(frame)
}
```

Enfin, cela fonctionne :

```nginx
$ njs ./njs_bundle.js |hexdump -C
00000000  00 00 00 00 0c 0a 0a 54  65 73 74 53 74 72 69 6e  |.......TestStrin|
00000010  67 0a                                             |g.|
00000012
```

C'est le résultat attendu. L'analyse de la réponse se met en œuvre de façon similaire :

```nginx
function parse_msg(pb, msg)
{
    // convert byte string into integer array
    var bytes = msg.split('').map(v=>v.charCodeAt(0));

    if (bytes.length < 5) {
        throw 'message too short';
    }

    // first 5 bytes is gRPC frame (compression + length)
    var head = bytes.splice(0, 5);

    // ensure we have proper message length
    var len = (head[1] << 24)
              + (head[2] << 16)
              + (head[3] << 8)
              + head[4];

    if (len != bytes.length) {
        throw 'header length mismatch';
    }

    // invoke protobufjs to decode message
    var response = pb.helloworld.HelloReply.decode(bytes);

    console.log('Reply is:' + response.message);
}
```

## DNS-packet

Cet exemple utilise une bibliothèque de génération et d'analyse de paquets DNS. Le cas est intéressant, car la bibliothèque et ses dépendances utilisent des constructions modernes du langage que njs ne prend pas encore en charge. Cela nous impose une étape supplémentaire : transpiler le code source.

Des paquets Node supplémentaires sont nécessaires :

```nginx
$ npm install @babel/core @babel/cli @babel/preset-env babel-loader
$ npm install webpack webpack-cli
$ npm install buffer
$ npm install dns-packet
```

Le fichier de configuration webpack.config.js :

```nginx
const path = require('path');

module.exports = {
    entry: './load.js',
    mode: 'production',
    output: {
        filename: 'wp_out.js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimize: false
    },
    node: {
        global: true,
    },
    module : {
        rules: [{
            test: /\.m?js$$/,
            exclude: /(bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    }
};
```

Nous utilisons le mode « `production` » : dans ce mode, webpack n'utilise pas la construction « `eval` », non prise en charge par njs. Le fichier `load.js` référencé est notre point d'entrée :

```nginx
global.dns = require('dns-packet')
global.Buffer = require('buffer/').Buffer
```

Commençons de la même façon, en produisant un seul fichier pour les bibliothèques :

```nginx
$ npx browserify load.js -o bundle.js -d
```

Traitons ensuite le fichier avec webpack, qui appelle lui-même babel :

```nginx
$ npx webpack --config webpack.config.js
```

Cette commande produit le fichier `dist/wp_out.js`, version transpilée de `bundle.js`. Il faut le concaténer avec `code.js`, qui contient notre code :

```nginx
function set_buffer(dnsPacket)
{
    // create DNS packet bytes
    var buf = dnsPacket.encode({
        type: 'query',
        id: 1,
        flags: dnsPacket.RECURSION_DESIRED,
        questions: [{
            type: 'A',
            name: 'google.com'
        }]
    })

    return buf;
}
```

Dans cet exemple, le code généré n'est pas enrobé dans une fonction et il n'est pas nécessaire de l'appeler explicitement. Le résultat se trouve dans le répertoire « `dist` » :

```nginx
$ cat dist/wp_out.js code.js > njs_dns_bundle.js
```

Appelons notre code à la fin du fichier :

```nginx
var b = set_buffer(global.dns);
console.log(b);
```

Et exécutons-le avec node :

```nginx
$ node ./njs_dns_bundle_final.js
Buffer [Uint8Array] [
    0,   1,   1, 0,  0,   1,   0,   0,
    0,   0,   0, 0,  6, 103, 111, 111,
  103, 108, 101, 3, 99, 111, 109,   0,
    0,   1,   0, 1
]
```

Vérifiez que cela fonctionne comme prévu, puis exécutez-le avec njs :

```nginx
$ njs ./njs_dns_bundle_final.js
Uint8Array [0,1,1,0,0,1,0,0,0,0,0,0,6,103,111,111,103,108,101,3,99,111,109,0,0,1,0,1]
```

La réponse peut être analysée ainsi :

```nginx
function parse_response(buf)
{
    var bytes = buf.split('').map(v=>v.charCodeAt(0));

    var b = global.Buffer.from(bytes);

    var packet = dnsPacket.decode(b);

    var resolved_name = packet.answers[0].name;

    // expected name is 'google.com', according to our request above
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
