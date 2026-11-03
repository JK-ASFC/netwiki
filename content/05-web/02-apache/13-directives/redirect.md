---
title: "Redirect"
description: "Directive Apache Redirect (mod_alias) — Envoie une redirection externe demandant au client d'effectuer une autre requête avec une URL différente. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_alias]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Envoie une redirection externe demandant au client d'effectuer une autre requête avec une URL différente |
| **Syntaxe** | `Redirect [état] [URL-path] URL` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_alias\|mod_alias]] |

## Utilisation

La directive `Redirect` permet de faire correspondre une ancienne URL à une nouvelle en demandant au client d'aller chercher la ressource à une autre localisation.

L'ancien *URL-path* est un chemin sensible à la casse (décodé à l'aide de caractères %) commençant par un slash. Les chemins relatifs ne sont pas autorisés.

La nouvelle *URL* peut être une URL absolue commençant par un protocole et un nom d'hôte, mais on peut aussi utiliser un chemin URL commençant par un slash, auquel cas le protocole et le nom d'hôte du serveur local seront ajoutés.

Ensuite, toute requête commençant par *URL-path* va renvoyer une redirection au client vers l'*URL* cible. Tout élément de chemin supplémentaire situé en aval du *URL-path* sera ajouté à l'URL cible.

```apache
# Redirige vers une URL sur un serveur différent
Redirect "/service" "http://foo2.example.com/service"

# Redirige vers une URL sur le même serveur
Redirect "/one" "/two"
```

Si le client effectue une requête pour l'URL `http://example.com/service/foo.txt`, il lui sera demandé d'en effectuer une autre pour l'URL `http://foo2.example.com/service/foo.txt`. Ceci concerne les requêtes avec paramètres `GET`, comme `http://example.com/service/foo.pl?q=23&a=42`, qui seront redirigées vers `http://foo2.example.com/service/foo.pl?q=23&a=42`. Notez que les `POST`s seront ignorés.
Seuls les éléments de chemin complets sont testés, si bien que l'exemple précédent ne s'appliquera pas à l'URL `http://example.com/servicefoo.txt`. Pour des mises en correspondance plus complexes utilisant la [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|syntaxe des expressions]], ne spécifiez pas d'argument *URL-path* comme décrit ci-dessous. En outre, pour une mise en correspondance en utilisant les expressions rationnelles, veuillez vous reporter à la directive [[13-directives/redirectmatch|RedirectMatch]].

> [!NOTE]
> **Note**
>
> Les directives `Redirect` ont priorité sur les directives [[13-directives/alias|Alias]] et [[13-directives/scriptalias|ScriptAlias]], quel que soit leur ordre d'apparition dans le fichier de configuration. Les directives `Redirect` définies au sein d'une section Location l'emportent sur les directives `Redirect` et [[13-directives/alias|Alias]] comportant un argument *URL-path*.

Si aucun argument *état* n'est spécifié, la redirection sera temporaire (code HTTP 302). Le client est alors informé que la ressource a été temporairement déplacée. On peut utiliser l'argument *état* pour renvoyer d'autres codes HTTP :

**permanent**

Renvoie un code de redirection permanente (301), indiquant que la ressource a été définitivement déplacée.

**temp**

Renvoie un code de redirection temporaire (302). C'est le comportement par défaut.

**seeother**

Renvoie un code "See Other" (303) indiquant que la ressource a été remplacée par une autre.

**gone**

Renvoie un code "Gone" (410) indiquant que la ressource a été définitivement supprimée. Lorsque ce code est utilisé, on ne doit pas utiliser l'argument *URL*.

On peut renvoyer d'autres codes en spécifiant le code numérique comme valeur de l'argument of *état*. Si le code est compris entre 300 et 399, l'argument *URL* doit être présent. Si le code n'est *pas* compris entre 300 et 399, l'argument *URL* ne doit pas apparaître. Le code doit être un code HTTP valide, connu du serveur HTTP Apache (voir la fonction `send_error_response` dans http\_protocol.c).

```apache
Redirect permanent "/one" "http://example.com/two"
Redirect 303 "/three" "http://example.com/other"
```

Si une directive `Redirect` est définie au sein d'une section [[13-directives/location|<Location>]] ou [[13-directives/locationmatch|<LocationMatch>]] et si l'argument *URL-path* est omis, l'argument *URL* sera interprété en utilisant la [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|syntaxe des expressions]].
Cette syntaxe est disponible à partir de la version 2.4.19 du serveur HTTP Apache.

```apache
<Location "/one">
    Redirect permanent "http://example.com/two"
</Location>
<Location "/three">
    Redirect 303 "http://example.com/other"
</Location>
<LocationMatch "/error/(?<NUMBER>[0-9]+)">
    Redirect permanent "http://example.com/errors/%{env:MATCH_NUMBER}.html"
</LocationMatch>
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
