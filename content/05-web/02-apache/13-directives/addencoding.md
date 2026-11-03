---
title: "AddEncoding"
description: "Directive Apache AddEncoding (mod_mime) — Associe les extensions de noms de fichiers données au type de codage spécifié. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_mime]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Associe les extensions de noms de fichiers données au type de codage spécifié |
| **Syntaxe** | `AddEncoding codage extension [extension] ...` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_mime\|mod_mime]] |

## Utilisation

La directive `AddEncoding` permet d'associer les extensions de noms de fichiers données au codage de contenu HTTP spécifié. *codage* est le codage de contenu HTTP à ajouter à la valeur du champ d'en-tête Content-Encoding pour les documents possédant l'*extension* spécifiée. Cette association est ajoutée à toutes les autres déjà en vigueur, et écrase toute association préexistante pour la même *extension*.

**Exemple**

```apache
AddEncoding x-gzip .gz
AddEncoding x-compress .Z
```

Avec cet exemple, les noms de fichiers possédant l'extension `.gz` seront marqués comme codés à l'aide du codage `x-gzip`, et les noms de fichiers possédant l'extension `.Z` comme codés avec `x-compress`.

Les clients anciens n'acceptent que `x-gzip` et `x-compress`, bien que les standards stipulent qu'ils sont respectivement équivalents à `gzip` et `compress`. Apache effectue ses comparaisons de codages de contenu en ignorant tout préfixe `x-`. Lorsqu'il répond avec un codage, Apache utilise l'une ou l'autre forme (c'est à dire `x-foo` ou `foo`) selon les besoins du client. Si le client n'a pas besoin d'une forme particulière, Apache utilisera la forme employée par la directive `AddEncoding`. Pour résumer, vous devez toujours utiliser `x-gzip` et `x-compress` pour ces deux codages spécifiques. Certains codages plus récents, comme `deflate`, doivent être spécifiés sans le préfixe `x-`.

L'argument *extension* est insensible à la casse et peut être spécifié avec ou sans le point initial. Les noms de fichiers peuvent posséder plusieurs extensions, et l'argument *extension* sera comparé à chacune d'entre elles.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
