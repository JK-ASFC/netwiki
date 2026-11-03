---
title: "Compatibilité"
description: "Nginx — Compatibilité. Cette page décrit la partie de JavaScript fournie par njs :"
tags: [nginx, guide]
icon: book-open
---

Cette page décrit la partie de JavaScript fournie par njs :

- les objets njs et nginx, les modules intégrés et l'objet `Buffer`, disponibles avec les moteurs [[10-guides/04-njs/engine|QuickJS]] et [[10-guides/04-njs/engine|njs]] ;

- les fonctionnalités du langage ECMAScript mises en œuvre par le moteur [[10-guides/04-njs/engine|njs]].

Les propriétés et méthodes propres à njs, non conformes à ECMAScript, sont définies dans la [[10-guides/04-njs/reference|Référence]]. Les objets et méthodes ECMAScript standard sont définis dans la [spécification ECMAScript](http://www.ecma-international.org/ecma-262/).

## Objets njs et nginx, modules et Buffer

Les objets, modules et méthodes ci-dessous sont disponibles avec les moteurs [[10-guides/04-njs/engine|QuickJS]] et [[10-guides/04-njs/engine|njs]], sauf mention contraire.

- Méthodes de `Buffer` (0.4.4) :

  - [[10-guides/04-njs/reference|alloc]], [[10-guides/04-njs/reference|allocUnsafe]], [[10-guides/04-njs/reference|byteLength]], [[10-guides/04-njs/reference|compare]], [[10-guides/04-njs/reference|concat]], [[10-guides/04-njs/reference|from]], [[10-guides/04-njs/reference|isBuffer]], [[10-guides/04-njs/reference|isEncoding]]

- Méthodes du prototype de `Buffer` (0.4.4) :

  - [[10-guides/04-njs/reference|compare]], [[10-guides/04-njs/reference|copy]], [[10-guides/04-njs/reference|equals]], [[10-guides/04-njs/reference|fill]], [[10-guides/04-njs/reference|includes]], [[10-guides/04-njs/reference|indexOf]], [[10-guides/04-njs/reference|lastIndexOf]], [[10-guides/04-njs/reference|readIntBE]], `readInt8`, `readInt16BE`, `readInt32BE`, [[10-guides/04-njs/reference|readIntLE]], `readInt16LE`, `readInt32LE`, [[10-guides/04-njs/reference|readUIntBE]], `readUInt8`, `readUInt16BE`, `readUInt32BE`, [[10-guides/04-njs/reference|readUIntLE]], `readUInt16LE`, `readUInt32LE`, [[10-guides/04-njs/reference|readDoubleBE]], [[10-guides/04-njs/reference|readDoubleLE]], [[10-guides/04-njs/reference|readFloatBE]], [[10-guides/04-njs/reference|readFloatLE]], [[10-guides/04-njs/reference|subarray]], [[10-guides/04-njs/reference|slice]], [[10-guides/04-njs/reference|swap16]], [[10-guides/04-njs/reference|swap32]], [[10-guides/04-njs/reference|swap64]], [[10-guides/04-njs/reference|toJSON]], [[10-guides/04-njs/reference|toString]], [[10-guides/04-njs/reference|write]], [[10-guides/04-njs/reference|writeIntBE]], `writeInt8`, `writeInt16BE`, `writeInt32BE`, [[10-guides/04-njs/reference|writeIntLE]], `writeInt16LE`, `writeInt32LE`, [[10-guides/04-njs/reference|writeUIntBE]], `writeUInt8`, `writeUInt16BE`, `writeUInt32BE`, [[10-guides/04-njs/reference|writeUIntLE]], `writeUInt16LE`, `writeUInt32LE`, [[10-guides/04-njs/reference|writeDoubleBE]], [[10-guides/04-njs/reference|writeDoubleLE]], [[10-guides/04-njs/reference|writeFloatBE]], [[10-guides/04-njs/reference|writeFloatLE]]

- [[10-guides/04-njs/reference|Crypto]] : méthodes (0.2.0): [[10-guides/04-njs/reference|crypto.createHash]], [[10-guides/04-njs/reference|crypto.createHmac]]

- [[10-guides/04-njs/reference|Query String]] : méthodes (0.4.3): [[10-guides/04-njs/reference|querystring.decode]], [[10-guides/04-njs/reference|querystring.encode]], [[10-guides/04-njs/reference|querystring.escape]], [[10-guides/04-njs/reference|querystring.parse]], [[10-guides/04-njs/reference|querystring.stringify]], [[10-guides/04-njs/reference|querystring.unescape]]

- [[10-guides/04-njs/reference|TextDecoder]] : méthodes (0.4.3): [[10-guides/04-njs/reference|encoding]], [[10-guides/04-njs/reference|fatal]], [[10-guides/04-njs/reference|ignoreBOM]], [[10-guides/04-njs/reference|decode]]

- [[10-guides/04-njs/reference|TextEncoder]] : méthodes (0.4.3): [[10-guides/04-njs/reference|encode]], [[10-guides/04-njs/reference|encodeInto]]

- [[10-guides/04-njs/reference|XML]] : méthodes (0.7.10): [[10-guides/04-njs/reference|parse]], [[10-guides/04-njs/reference|xml.c14n]], [[10-guides/04-njs/reference|xml.exclusiveC14n]]

- [[10-guides/04-njs/reference|zlib]] : méthodes (0.7.12): [[10-guides/04-njs/reference|deflateRawSync]], [[10-guides/04-njs/reference|deflateSync]], [[10-guides/04-njs/reference|inflateRawSync]], [[10-guides/04-njs/reference|inflateSync]]

- `File system` — méthodes : [[10-guides/04-njs/reference|fs.accessSync]] (0.3.9), [[10-guides/04-njs/reference|fs.appendFileSync]], [[10-guides/04-njs/reference|fs.closeSync]], [[10-guides/04-njs/reference|fs.existsSync]] (0.8.2), [[10-guides/04-njs/reference|fs.FileHandle]] (0.7.7), [[10-guides/04-njs/reference|fs.fstatSync]] (0.7.7), [[10-guides/04-njs/reference|fs.lstatSync]] (0.7.1), [[10-guides/04-njs/reference|fs.mkdirSync]] (0.4.2), [[10-guides/04-njs/reference|fs.openSync]] (0.7.7), [[10-guides/04-njs/reference|fs.promises.open]] (0.7.7), [[10-guides/04-njs/reference|fs.readdirSync]] (0.4.2), [[10-guides/04-njs/reference|fs.readFileSync]], [[10-guides/04-njs/reference|fs.readSync]] (0.7.7), [[10-guides/04-njs/reference|fs.realpathSync]] (0.3.9), [[10-guides/04-njs/reference|fs.renameSync]] (0.3.4), [[10-guides/04-njs/reference|fs.rmdirSync]] (0.4.2), [[10-guides/04-njs/reference|fs.symlinkSync]] (0.3.9), [[10-guides/04-njs/reference|fs.unlinkSync]] (0.3.9), [[10-guides/04-njs/reference|fs.writeFileSync]], [[10-guides/04-njs/reference|fs.writeSync]] (0.7.7)

- API `fs.promises` (0.3.9), version asynchrone des méthodes du système de fichiers.

- Fonctions globales : [[10-guides/04-njs/reference|atob]], [[10-guides/04-njs/reference|btoa]] (disponibles avec le moteur njs depuis 0.7.6 et avec QuickJS depuis 1.0.1)

- [[10-guides/04-njs/reference|clearTimeout]] et [[10-guides/04-njs/reference|setTimeout]] fonctions (0.2.0)

- Objets globaux (0.3.3) :

  - [[10-guides/04-njs/reference|console]] (0.8.2): [[10-guides/04-njs/reference|error]], [[10-guides/04-njs/reference|info]], [[10-guides/04-njs/reference|log]], [[10-guides/04-njs/reference|time]], [[10-guides/04-njs/reference|timeEnd]], [[10-guides/04-njs/reference|warn]]
  - [[10-guides/04-njs/reference|crypto]] (0.7.0): [[10-guides/04-njs/reference|getRandomValues]], [[10-guides/04-njs/reference|randomUUID]] (0.9.7), [[10-guides/04-njs/reference|subtle.encrypt]], [[10-guides/04-njs/reference|subtle.decrypt]], [[10-guides/04-njs/reference|subtle.deriveBits]], [[10-guides/04-njs/reference|subtle.deriveKey]], [[10-guides/04-njs/reference|subtle.digest]], [[10-guides/04-njs/reference|subtle.exportKey]] (0.7.10), [[10-guides/04-njs/reference|subtle.generateKey]] (0.7.10), [[10-guides/04-njs/reference|subtle.importKey]], [[10-guides/04-njs/reference|subtle.sign]], [[10-guides/04-njs/reference|subtle.verify]], [[10-guides/04-njs/reference|subtle.wrapKey]] (0.9.7), [[10-guides/04-njs/reference|subtle.unwrapKey]] (0.9.7)
  - alias `globalThis` (0.3.8)
  - [[10-guides/04-njs/reference|njs]]: [[10-guides/04-njs/reference|version]], [[10-guides/04-njs/reference|version_number]] (0.7.4), [[10-guides/04-njs/reference|dump]] (moteur njs uniquement), [[10-guides/04-njs/reference|memoryStats]] (0.7.8, moteur njs uniquement), [[10-guides/04-njs/reference|on]] (0.5.2)
  - [[10-guides/04-njs/reference|process]]: [[10-guides/04-njs/reference|argv]], [[10-guides/04-njs/reference|env]], [[10-guides/04-njs/reference|pid]], [[10-guides/04-njs/reference|ppid]]

- Méthodes des objets nginx :

  - [[10-guides/04-njs/reference|HTTP Request]]: [[10-guides/04-njs/reference|r.done]] (0.5.2), [[10-guides/04-njs/reference|r.error]], [[10-guides/04-njs/reference|r.finish]], [[10-guides/04-njs/reference|r.internalRedirect]], [[10-guides/04-njs/reference|r.log]], [[10-guides/04-njs/reference|r.return]] (0.5.0), [[10-guides/04-njs/reference|r.send]] (0.5.0), [[10-guides/04-njs/reference|r.sendBuffer]] (0.5.2), [[10-guides/04-njs/reference|r.sendHeader]], [[10-guides/04-njs/reference|r.setReturnValue]] (0.7.0), [[10-guides/04-njs/reference|r.subrequest]], [[10-guides/04-njs/reference|r.warn]]
  - [[10-guides/04-njs/reference|Stream Session]]: [[10-guides/04-njs/reference|s.allow]] (0.2.4), [[10-guides/04-njs/reference|s.decline]] (0.2.4), [[10-guides/04-njs/reference|s.deny]] (0.2.4), [[10-guides/04-njs/reference|s.done]] (0.2.4), [[10-guides/04-njs/reference|s.error]], [[10-guides/04-njs/reference|s.log]], [[10-guides/04-njs/reference|s.off]] (0.2.4), [[10-guides/04-njs/reference|s.on]] (0.2.4), [[10-guides/04-njs/reference|s.send]] (0.2.4), [[10-guides/04-njs/reference|s.sendDownstream]] (0.7.8), [[10-guides/04-njs/reference|s.sendUpstream]] (0.7.8), [[10-guides/04-njs/reference|s.setReturnValue]] (0.7.0), [[10-guides/04-njs/reference|s.warn]]
  - [[10-guides/04-njs/reference|Headers]] (0.5.1): [[10-guides/04-njs/reference|append]], [[10-guides/04-njs/reference|delete]], [[10-guides/04-njs/reference|get]], [[10-guides/04-njs/reference|getAll]], [[10-guides/04-njs/reference|forEach]], [[10-guides/04-njs/reference|has]], [[10-guides/04-njs/reference|set]]
  - [[10-guides/04-njs/reference|Request]] (0.7.10): [[10-guides/04-njs/reference|arrayBuffer]], [[10-guides/04-njs/reference|headers]], [[10-guides/04-njs/reference|json]], [[10-guides/04-njs/reference|text]]
  - [[10-guides/04-njs/reference|Response]] (0.5.1): [[10-guides/04-njs/reference|arrayBuffer]], [[10-guides/04-njs/reference|headers]], [[10-guides/04-njs/reference|json]], [[10-guides/04-njs/reference|text]]
  - [[10-guides/04-njs/reference|ngx]] (0.5.0): [[10-guides/04-njs/reference|fetch]] (0.5.1), [[10-guides/04-njs/reference|log]]
  - [[10-guides/04-njs/reference|ngx.shared]] (0.8.0): [[10-guides/04-njs/reference|add]], [[10-guides/04-njs/reference|clear]], [[10-guides/04-njs/reference|delete]], [[10-guides/04-njs/reference|freeSpace]], [[10-guides/04-njs/reference|get]], [[10-guides/04-njs/reference|has]], [[10-guides/04-njs/reference|incr]], [[10-guides/04-njs/reference|items]], [[10-guides/04-njs/reference|keys]], [[10-guides/04-njs/reference|pop]], [[10-guides/04-njs/reference|replace]], [[10-guides/04-njs/reference|set]], [[10-guides/04-njs/reference|size]], [[10-guides/04-njs/reference|ttl]] (0.9.7)

- Propriétés des objets nginx :

  - [[10-guides/04-njs/reference|HTTP Request]]: [[10-guides/04-njs/reference|r.args]], [[10-guides/04-njs/reference|r.headersIn]], [[10-guides/04-njs/reference|r.headersOut]], [[10-guides/04-njs/reference|r.httpVersion]], [[10-guides/04-njs/reference|r.internal]], [[10-guides/04-njs/reference|r.jsVarNames]] (0.9.9), [[10-guides/04-njs/reference|r.method]], [[10-guides/04-njs/reference|r.parent]], [[10-guides/04-njs/reference|r.readRequestArrayBuffer]] (0.9.9), [[10-guides/04-njs/reference|r.readRequestForm]] (0.9.9), [[10-guides/04-njs/reference|r.readRequestJSON]] (0.9.9), [[10-guides/04-njs/reference|r.readRequestText]] (0.9.9), [[10-guides/04-njs/reference|r.rawHeadersIn]] (0.4.1), [[10-guides/04-njs/reference|r.rawHeadersOut]] (0.4.1), [[10-guides/04-njs/reference|r.rawVariables]] (0.5.0), [[10-guides/04-njs/reference|r.remoteAddress]], [[10-guides/04-njs/reference|r.requestBuffer]] (0.5.0), [[10-guides/04-njs/reference|r.requestText]], [[10-guides/04-njs/reference|r.responseBuffer]] (0.5.0), [[10-guides/04-njs/reference|r.responseText]] (0.5.0), [[10-guides/04-njs/reference|r.status]], [[10-guides/04-njs/reference|r.uri]], [[10-guides/04-njs/reference|r.variables]] (0.2.8)
  - [[10-guides/04-njs/reference|Stream Session]]: [[10-guides/04-njs/reference|s.jsVarNames]] (0.9.9), [[10-guides/04-njs/reference|s.remoteAddress]], [[10-guides/04-njs/reference|s.rawVariables]] (0.5.0), [[10-guides/04-njs/reference|s.status]] (0.5.2), [[10-guides/04-njs/reference|s.variables]] (0.2.8)
  - [[10-guides/04-njs/reference|Periodic Session]] (0.8.1): [[10-guides/04-njs/reference|PeriodicSession.rawVariables]], [[10-guides/04-njs/reference|PeriodicSession.variables]]
  - [[10-guides/04-njs/reference|Request]] (0.7.10): [[10-guides/04-njs/reference|bodyUsed]], [[10-guides/04-njs/reference|cache]], [[10-guides/04-njs/reference|credentials]], [[10-guides/04-njs/reference|method]], [[10-guides/04-njs/reference|mode]], [[10-guides/04-njs/reference|url]]
  - [[10-guides/04-njs/reference|Response]] (0.5.1): [[10-guides/04-njs/reference|bodyUsed]], [[10-guides/04-njs/reference|ok]], [[10-guides/04-njs/reference|redirected]], [[10-guides/04-njs/reference|status]], [[10-guides/04-njs/reference|statusText]], [[10-guides/04-njs/reference|type]], [[10-guides/04-njs/reference|url]]
  - [[10-guides/04-njs/reference|ngx]] (0.5.0): [[10-guides/04-njs/reference|build]] (0.8.0), [[10-guides/04-njs/reference|conf_file_path]] (0.8.0), [[10-guides/04-njs/reference|conf_prefix]] (0.7.8), [[10-guides/04-njs/reference|error_log_path]] (0.8.0), [[10-guides/04-njs/reference|prefix]] (0.8.0), [[10-guides/04-njs/reference|version]] (0.8.0), [[10-guides/04-njs/reference|version_number]] (0.8.0), [[10-guides/04-njs/reference|worker_id]] (0.8.0)
  - [[10-guides/04-njs/reference|ngx.shared]] (0.8.0): [[10-guides/04-njs/reference|capacity]], [[10-guides/04-njs/reference|name]], [[10-guides/04-njs/reference|type]]

## Conformité ECMAScript (moteur njs)

> [!NOTE]
> Les fonctionnalités ECMAScript ci-dessous concernent le moteur [[10-guides/04-njs/engine|njs]], obsolète depuis la version 1.0.0. Le moteur [[10-guides/04-njs/engine|QuickJS]] prend en charge ES2023 ; le nouveau code doit utiliser QuickJS.

Le moteur njs est conforme à [ECMAScript 5.1](http://www.ecma-international.org/ecma-262/5.1/) (mode strict), avec certaines extensions d'[ECMAScript 6](http://www.ecma-international.org/ecma-262/6.0/) et ultérieures. La conformité continue d'évoluer.

- Booléens, nombres, chaînes, objets, tableaux, fonctions, constructeurs de fonctions (0.3.6) et expressions régulières

- Opérateurs ES5.1, opérateur d'exponentiation ES7, chaînage optionnel ES2020 (0.9.6), opérateurs d'affectation logique ES2021 `||=`, `&&=`, `??=` (0.9.6)

- Instructions ES5.1 : `break`, `catch`, `continue`, `do while`, `else`, `finally`, `for`, `for in`, `if`, `return`, `switch`, `throw`, `try`, `var`, `while`, instructions étiquetées (0.2.8)

- Instructions ES6 : `let` (0.6.0), `const` (0.6.0), `async` (0.7.0), `await` (0.7.0)

- Propriétés de `Math` :

  - ES6: `E`, `LN10`, `LN2`, `LOG10E`, `LOG2E`, `PI`, `SQRT1_2`, `SQRT2`

- Méthodes de `Math` :

  - ES6: `abs`, `acos`, `acosh`, `asin`, `asinh`, `atan`, `atan2`, `atanh`, `cbrt`, `ceil`, `clz32`, `cos`, `cosh`, `exp`, `expm1`, `floor`, `fround`, `hypot`, `imul`, `log`, `log10`, `log1p`, `log2`, `max`, `min`, `pow`, `random`, `round`, `sign`, `sin`, `sinh`, `sqrt`, `tan`, `tanh`, `trunc`

- Propriétés de `Number` :

  - ES6: `EPSILON`, `MAX_SAFE_INTEGER`, `MAX_VALUE`, `MIN_SAFE_INTEGER`, `MIN_VALUE`, `NEGATIVE_INFINITY`, `NaN`, `POSITIVE_INFINITY`

- Méthodes de `Number` :

  - ES6: `isFinite`, `isInteger`, `isNaN`, `isSafeInteger`, `parseFloat`, `parseInt`

- Méthodes du prototype de `Number` :

  - ES6: `toExponential` (0.3.6), `toFixed` (0.3.6), `toPrecision` (0.3.6)

- Méthodes de `String` :

  - ES5.1: `fromCharCode`
  - ES6: `fromCodePoint`

- Méthodes du prototype de `String` :

  - ES5.1: `charAt`, `concat`, `indexOf`, `lastIndexOf`, `match`, `replace`, `search`, `slice`, `split`, `substr`, `substring`, `toLowerCase`, `trim`, `toUpperCase`
  - ES6: `codePointAt`, `endsWith`, `includes`, `repeat`, `startsWith`
  - ES8: `padEnd`, `padStart`
  - ES9: `trimEnd` (0.3.4), `trimStart` (0.3.4)
  - ES12: `replaceAll` (0.7.10)

- Méthodes de `Object` :

  - ES5.1: `create` (prise en charge sans liste de propriétés), `defineProperties` (descripteurs d'accesseurs pris en charge depuis 0.3.3), `defineProperty` (descripteurs d'accesseurs pris en charge depuis 0.3.3), `freeze`, `getOwnPropertyDescriptor`, `getOwnPropertyDescriptors` (0.3.1), `getOwnPropertyNames` (0.3.1), `getPrototypeOf`, `isExtensible`, `isFrozen`, `isSealed`, `keys`, `preventExtensions`, `seal`
  - ES6: `assign` (0.3.7), `is` (0.3.8), `setPrototypeOf` (0.3.8)
  - ES8: `entries` (0.2.7), `values` (0.2.7)

- Méthodes du prototype de `Object` :

  - ES5.1: `hasOwnProperty`, `isPrototypeOf` (0.3.0), `propertyIsEnumerable`, `toString`, `valueOf`

- Méthodes de `Array` :

  - ES5.1: `isArray`
  - ES6: `of`, `from` (0.8.0)

- Méthodes du prototype de `Array` :

  - ES5.1: `concat`, `every`, `filter`, `forEach`, `indexOf`, `join`, `lastIndexOf`, `map`, `pop`, `push`, `reduce`, `reduceRight`, `reverse`, `shift`, `slice`, `some`, `sort`, `splice`, `unshift`
  - ES6: `copyWithin` (0.3.7), `fill`, `find`, `findIndex`
  - ES7: `includes`
  - ES2023: `toReversed` (0.8.0), `toSorted` (0.8.0), `toSpliced` (0.8.0)

- Méthodes de `ArrayBuffer` (0.3.8) :

  - ES6: `isView`

- Méthodes du prototype de `ArrayBuffer` (0.3.8) :

  - ES6: `slice`

- Constructeurs de tableaux typés (`Typed-array`) (0.3.8) :

  - ES6: `Int8Array`, `Uint8Array`, `Uint8ClampedArray`, `Int16Array`, `Uint16Array`, `Int32Array`, `Uint32Array`, `Float32Array`, `Float64Array`

- Méthodes du prototype des tableaux typés (0.3.8) :

  - ES6: `copyWithin`, `every` (0.4.4), `fill`, `filter` (0.4.4), `find` (0.4.4), `findIndex` (0.4.4), `forEach` (0.4.4), `includes` (0.4.4), `indexOf` (0.4.4), `join`, `lastIndexOf` (0.4.4), `map` (0.4.4), `reduce` (0.4.4), `reduceRight` (0.4.4), `reverse` (0.4.4), `set`, `slice`, `some` (0.4.4), `sort` (0.4.2), `subarray`, `toString`
  - ES2023: `toReversed` (0.8.0), `toSorted` (0.8.0)

- Méthodes de `Promise` (0.3.8) :

  - ES6: `all` (0.6.2), `race` (0.6.2), `reject`, `resolve`
  - ES2020: `allSettled` (0.6.2)
  - ES2021: `any` (0.6.2)

- Méthodes du prototype de `Promise` (0.3.8) :

  - ES6: `catch`, `finally`, `then`

- Méthodes du prototype de `Function` :

  - ES5.1: `apply`, `bind`, `call`

- Propriétés accesseurs du prototype de `RegExp` :

  - `flags` (0.6.0), `global`, `ignoreCase`, `multiline`, `source`, `sticky` (0.6.0)

- Méthodes du prototype de `RegExp` :

  - `[@@replace]` (0.4.2), `[@@split]` (0.6.0)
  - ES5.1: `exec`, `test`, `toString`

- Propriétés d'instance de `RegExp` :

  - `lastIndex`

- Groupes de capture nommés ES9 de `RegExp` (0.3.2)

- Méthodes du prototype de `DataView` (0.4.4) :

  - ES6: `getFloat32`, `getFloat64`, `getInt16`, `getInt32`, `getInt8`, `getUint16`, `getUint32`, `getUint8`, `setFloat32`, `setFloat64`, `setInt16`, `setInt32`, `setInt8`, `setUint16`, `setUint32`, `setUint8`

- Méthodes de `Date` :

  - ES5.1: `now`, `parse`, `UTC`

- Méthodes du prototype de `Date` :

  - ES5.1: `getDate`, `getDay`, `getFullYear`, `getHours`, `getMilliseconds`, `getMinutes`, `getMonth`, `getSeconds`, `getTime`, `getTimezoneOffset`, `getUTCDate`, `getUTCDay`, `getUTCFullYear`, `getUTCHours`, `getUTCMilliseconds`, `getUTCMinutes`, `getUTCMonth`, `getUTCSeconds`, `toDateString`, `toISOString`, `toLocaleDateString`, `toLocaleString`, `toLocaleTimeString`, `toTimeString`, `toUTCString`, `setDate`, `setFullYear`, `setHours`, `setMinutes`, `setMilliseconds`, `setMonth`, `setSeconds`, `setTime`, `setUTCDate`, `setUTCFullYear`, `setUTCHours`, `setUTCMilliseconds`, `setUTCMinutes`, `setUTCMonth`, `setUTCSeconds`

- Méthodes de `JSON` :

  - ES5.1: `parse`, `stringify`

- Méthodes de `Symbol` (0.7.6) :

  - `for`, `keyFor`

- Objet `arguments` ES5.1 (0.2.5)

- Syntaxe des paramètres du reste ES6 (sans déstructuration) (0.2.7)

- Fonctions globales ES5.1 : `decodeURI`, `decodeURIComponent`, `encodeURI`, `encodeURIComponent`, `isFinite`, `isNaN`, `parseFloat`, `parseInt`

- Objets `Error` : `Error`, `EvalError`, `InternalError`, `RangeError`, `ReferenceError`, `SyntaxError`, `TypeError`, `URIError`

- Prise en charge des modules ES6 : instructions `export` et `import` par défaut (0.3.0)

- Fonctions fléchées ES6 (0.3.1)

- Littéraux de gabarit : chaînes multilignes, interpolation d'expressions, gabarits imbriqués (0.3.2)

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
