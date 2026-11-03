---
title: "ProxyPassReverse"
description: "Directive Apache ProxyPassReverse (mod_proxy) — Ajuste l'URL dans les en-têtes de la réponse HTTP envoyée par un serveur mandaté en inverse. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ajuste l'URL dans les en-têtes de la réponse HTTP envoyée par un serveur mandaté en inverse |
| **Syntaxe** | `ProxyPassReverse [chemin] url [interpolate]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |

## Utilisation

Cette directive permet de faire en sorte qu'Apache httpd ajuste l'URL dans les en-têtes `Location`, `Content-Location` et `URI` des réponses de redirection HTTP. Ceci est essentiel lorsqu'Apache httpd est utilisé en tant que mandataire inverse (ou passerelle), afin d'éviter de court-circuiter le mandataire inverse suite aux redirections HTTP sur le serveur d'arrière-plan qui restent derrière le mandataire inverse.

Seuls les en-têtes de réponse HTTP spécialement mentionnés ci-dessus seront réécrits. Apache httpd ne réécrira ni les autres en-têtes de réponse, ni par défaut les références d'URLs dans les pages HTML. Cela signifie que dans le cas où un contenu mandaté contient des références à des URLs absolues, elles court-circuiteront le mandataire. Pour réécrire un contenu HTML afin qu'il corresponde au mandataire, vous devez charger et activer le module [[12-modules/mod_proxy_html|mod_proxy_html]].

*chemin* est le nom d'un chemin virtuel local. *url* est une URL partielle pour le serveur distant. Ces paramètres s'utilisent de la même façon qu'avec la directive [[13-directives/proxypass|ProxyPass]].

Supposons par exemple que le serveur local a pour adresse `http://example.com/` ; alors

```apache
ProxyPass         "/mirror/foo/" "http://backend.example.com/"
ProxyPassReverse  "/mirror/foo/" "http://backend.example.com/"
ProxyPassReverseCookieDomain  "backend.example.com" "public.example.com"
ProxyPassReverseCookiePath  "/"  "/mirror/foo/"
```

ne va pas seulement provoquer la conversion interne d'une requête locale pour `http://example.com/mirror/foo/bar` en une requête mandatée pour `http://backend.example.com/bar` (la fonctionnalité fournie par `ProxyPass`). Il va aussi s'occuper des redirections que le serveur `backend.example.com` envoie lorsqu'il redirige `http://backend.example.com/bar` vers `http://backend.example.com/quux`. Apache httpd corrige ceci en `http://example.com/mirror/foo/quux` avant de faire suivre la redirection HTTP au client. Notez que le nom d'hôte utilisé pour construire l'URL est choisi en respectant la définition de la directive [[13-directives/usecanonicalname|UseCanonicalName]].

Notez que la directive `ProxyPassReverse` peut aussi être utilisée en conjonction avec la fonctionnalité de mandataire (`RewriteRule ... [P]`) du module [[12-modules/mod_rewrite|mod_rewrite]], car elle ne dépend pas d'une directive [[13-directives/proxypass|ProxyPass]] correspondante.

Le mot-clé optionnel `interpolate`, en combinaison avec la directive [[13-directives/proxypassinterpolateenv|ProxyPassInterpolateEnv]], permet l'interpolation des variables d'environnement spécifiées en utilisant le format *${VARNAME}* Notez que l'interpolation n'est pas supportée dans la partie protocole d'une URL.

Lorsque cette directive est utilisée dans une section [[13-directives/location|<Location>]], le premier argument est omis et le répertoire local est obtenu à partir de l'argument de la directive [[13-directives/location|<Location>]]. En dehors d'une section [[13-directives/location|<Location>]] ou [[13-directives/locationmatch|<LocationMatch>]], l'argument *chemin* est requis. Il en est de même à l'intérieur d'une section [[13-directives/locationmatch|<LocationMatch>]], mais le résultat ne sera probablement pas celui attendu car ProxyPassReverse va interpréter l'expression rationnelle littéralement comme un chemin ; si besoin est dans ce cas, définissez la directive ProxyPassReverse en dehors de la section, ou dans une section [[13-directives/location|<Location>]] séparée.

Cette directive ne peut pas être placée dans une section [[13-directives/directory|<Directory>]] ou [[13-directives/files|<Files>]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
