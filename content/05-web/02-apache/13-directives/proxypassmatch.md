---
title: "ProxyPassMatch"
description: "Directive Apache ProxyPassMatch (mod_proxy) — Fait correspondre des serveurs distants dans l'espace d'URL du serveur local en utilisant des expressions rationnelles. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fait correspondre des serveurs distants dans l'espace d'URL du serveur local en utilisant des expressions rationnelles |
| **Syntaxe** | `ProxyPassMatch [regex] !\|url [key=value [key=value ...]]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |
| **Compatibilité** | Depuis la version 2.4.47, les paramètres *key=value* sont pris en compte lorsque le paramètre *url* contient des références arrières (voir note ci-dessous). |

## Utilisation

Cette directive est identique à la directive [[13-directives/proxypass|ProxyPass]], mais fait usage des expressions rationnelles, au lieu d'une simple comparaison de préfixes. L'expression rationnelle spécifiée est comparée à l'*url*, et si elle correspond, le serveur va substituer toute correspondance entre parenthèses dans la chaîne donnée et l'utiliser comme nouvelle *url*.

> [!NOTE]
> Cette directive ne peut pas être utilisée dans un contexte de niveau répertoire.

> [!WARNING]
> **Correspondance de worker avec les références arrières**
>
> Quand `ProxyPassMatch` contient des références arrières (par exemple `$1`) dans l'URL cible, chaque requête produit un URL résolu différent. Comme la recherche de correspondance des workers s'effectue par URL, ces requêtes ne correspondront pas au worker créé par cette directive et utiliseront à la place le worker du mandataire inverse par défaut, qui ne réutilise pas les connexions, ni ne met en cache les recherches DNS. Pour activer la mise en commun des connexions, définissez un worker explicite pour le serveur dorsal séparément :
>
> ```apache
> ProxyPass        "/notused" "http://backend.example.com/" connectiontimeout=5 timeout=30
> ProxyPassMatch   "^/(.*\.gif)$" "http://backend.example.com/$1"
> ```
>
> La définition explicite du worker `ProxyPass` permet de s'assurer que le jeu de connexions d'arrière-plan est disponible pour les requêtes `ProxyPassMatch`.

Supposons que le serveur local a pour adresse `http://example.com/` ; alors

```apache
ProxyPassMatch "^(/.*\.gif)$" "http://backend.example.com/$1"
```

va provoquer la conversion interne de la requête locale `http://example.com/foo/bar.gif` en une requête mandatée pour `http://backend.example.com/foo/bar.gif`.

Le drapeau `!` vous permet de ne pas mandater un sous-répertoire donné.

Dans une section [[13-directives/locationmatch|<LocationMatch>]], le premier argument est omis et l'expression rationnelle est obtenue à partir de la directive [[13-directives/locationmatch|<LocationMatch>]]. En dehors d'une section [[13-directives/location|<Location>]] ou [[13-directives/locationmatch|<LocationMatch>]], l'argument *regex* est requis.

Si vous avez besoin d'une configuration du mandataire inverse plus flexible, voyez la directive [[13-directives/rewriterule|RewriteRule]] avec le drapeau `[P]`.

> [!NOTE]
> **Substitution par défaut**
>
> Lorsque le paramètre URL n'utilise pas de références arrières dans l'expression rationnelle, l'URL originale sera ajoutée au paramètre URL.

> [!NOTE]
> **Paramètres `key=value` et *url* avec références arrières**
>
> Depuis la version 2.4.47, les paramètres `key=value` ne sont plus ignorés dans une directive `ProxyPassMatch` lorsqu'on utilise une *url* contenant des références arrières. Cependant, pour conserver le comportement précédent relatif à la réutilisation/conservation des connexions d'arrière-plan (qui n'avaient jamais été réutilisées auparavant pour ces URLs), les paramètres *enablereuse* et *disablereuse* prendront dans ce cas respectivement comme valeurs par défaut `off` et `on`. Définir explicitement `enablereuse=on` permet de réutiliser les connexions, **sauf si** des références arrières se trouvent dans la partie `authority` (nom d'hôte et/ou port) de l'*url* (cette condition est imposée depuis la version 2.4.55 du serveur HTTP Apache et provoque un avertissement au démarrage car ces URLs ne sont pas réutilisables sous cette forme).

> [!WARNING]
> **Avertissement à propos de la sécurité**
>
> Lors de la construction de l'URL cible de la règle, il convient de prendre en compte l'impact en matière de sécurité qu'aura le fait de permettre au client d'influencer le jeu d'URLs pour lesquelles votre serveur agira en tant que mandataire. Assurez-vous que la partie protocole://nom-serveur de l'URL soit fixe, ou ne permette pas au client de l'influencer induement.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
