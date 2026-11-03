---
title: "Substitute"
description: "Directive Apache Substitute (mod_substitute) — Modèle de substition dans le contenu de la réponse. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_substitute]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Modèle de substition dans le contenu de la réponse |
| **Syntaxe** | `Substitute s/modèle/substitution/[infq]` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_substitute\|mod_substitute]] |

## Utilisation

La directive `Substitute` permet de spécifier un modèle de recherche/remplacement à appliquer au corps de la réponse.

La signification du modèle peut être modifiée via toute combinaison de ces drapeaux :

**`i`**

Effectue une comparaison sans tenir compte de la casse.

**`n`**

Par défaut, le modèle est traité en tant qu'expression rationnelle. Le drapeau `n` force le traitement du modèle en tant que chaîne fixe.

**`f`**

Avec le drapeau `f`, `mod_substitute` met à plat le résultat d'une substitution (les conteneurs ou buckets ne sont pas dissociés), ce qui permet à d'éventuelles substitutions ultérieures de s'effectuer sur cette dernière. C'est le comportement par défaut.

**`q`**

Avec le drapeau `q`, `mod_substitute` dissocie les conteneurs (ou buckets) après chaque substitution. Ceci peut améliorer la rapidité de la réponse et diminuer la quantité de mémoire utilisée, mais ne doit être utilisé que s'il n'existe aucune possibilité pour que le résultat d'une substitution ne corresponde au modèle ou à l'expression rationnelle d'une substitution ultérieure.

*substitution* peut contenir du texte et des références arrières d'expressions rationnelles.

**Exemple**

```apache
<Location "/">
    AddOutputFilterByType SUBSTITUTE text/html
    Substitute "s/foo/bar/ni"
</Location>
```

Le caractère utilisé pour séparer (ou "délimiter") les différentes partie de la valeur de substitution est référencé sous le nom de "délimiteur", et il s'agit le plus souvent d'un "slash".

Si le modèle ou la chaîne de substitution contient un caractère slash '/', il est possible d'utiliser un autre délimiteur afin de rendre la directive plus lisible :

**Exemple d'utilisation d'un délimiteur alternatif**

```apache
<Location "/">
    AddOutputFilterByType SUBSTITUTE text/html
    Substitute "s|<BR */?>|<br />|i"
</Location>
```

Lorsqu'on utilise des expressions rationnelles, on peut insérer des références arrières dans les opérations de comparaison et de substitution, comme illustré dans l'exemple suivant :

**Exemple d'utilisation de références arrières et de captures**

```apache
<Location "/">
    AddOutputFilterByType SUBSTITUTE text/html
    # "foo=k,bar=k" -> "foo/bar=k"
    Substitute "s|foo=(\w+),bar=\1|foo/bar=$1|"
</Location>
```

Un scénario courant d'utilisation de `mod_substitute` est la situation où un serveur frontal mandate des requêtes pour un serveur d'arrière-plan qui renvoie des documents HTML contenant des URLs intégrées codées en dur qui font référence à ce serveur d'arrière-plan. Ces URLs ne fonctionnent pas pour l'utilisateur final car le serveur d'arrière-plan est hors d'atteinte.

On peut, dans ce cas, utiliser `mod_substitute` pour réécrire ces URLs afin qu'elles soit utilisables dans la partie située derrière le mandataire :

**Réécriture des URLs intégrées à un contenu mandaté**

```apache
ProxyPass        "/blog/" "http://internal.blog.example.com/"
ProxyPassReverse "/blog/" "http://internal.blog.example.com/"

Substitute "s|http://internal.blog.example.com/|http://www.example.com/blog/|i"
```

La directive [[13-directives/proxypassreverse|ProxyPassReverse]] modifie tout en-tête `Location` (redirection) envoyé par le serveur d'arrière-plan et, dans cet exemple, la directive `Substitute` se charge à son tour de la modification de la réponse HTML.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
