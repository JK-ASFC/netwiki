---
title: "SetEnvIf"
description: "Directive Apache SetEnvIf (mod_setenvif) — Définit des variables d'environnement en fonction des attributs de la requête. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_setenvif]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit des variables d'environnement en fonction des attributs de la requête |
| **Syntaxe** | `SetEnvIf attribut regex [!]env-variable[=valeur] [[!]env-variable[=valeur]] ...` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_setenvif\|mod_setenvif]] |

## Utilisation

La directive `SetEnvIf` permet de définir des variables d'environnement en fonction des attributs de la requête. L'*attribut* spécifié comme premier argument peut se présenter sous l'une des trois formes suivantes :

1. Un champ d'en-tête de requête HTTP (voir la [RFC 2616](https://www.rfc-editor.org/rfc/rfc2616) pour plus d'information à leur propos) ; par exemple : `Host`, `User-Agent`, `Referer`, ou `Accept-Language`. Il est possible d'utiliser une expression rationnelle pour spécifier un jeu d'en-têtes de requête.
2. Une des caractéristiques de la requête suivantes :

   - `Remote_Host` - le nom d'hôte (s'il est disponible) du client qui effectue la requête
   - `Remote_Addr` - l'adresse IP du client qui effectue la requête
   - `Server_Addr` - l'adresse IP du serveur qui a reçu la requête (uniquement à partir des versions supérieures à 2.0.43)
   - `Request_Method` - Le nom de la méthode HTTP utilisée (`GET`, `POST`, *et cetera...*)
   - `Request_Protocol` - le nom et la version du protocole utilisé pour la requête (par exemple "HTTP/0.9", "HTTP/1.1", *etc...*)
   - `Request_URI` - la ressource demandée dans la ligne de requête HTTP -- en général la partie de l'URL suivant le protocole et le nom du serveur, sans la chaîne d'arguments. Voir la directive [[13-directives/rewritecond|RewriteCond]] du module [[12-modules/mod_rewrite|mod_rewrite]] pour plus d'informations sur la manière de mettre en correspondance votre chaîne d'arguments.
3. Le nom d'une variable d'environnement parmi la liste de celles qui sont associées à la requête. Ceci permet à la directive `SetEnvIf` d'effectuer des tests en fonction du résultat de comparaisons précédentes. Seules les variables d'environnement définies par des directives `SetEnvIf[NoCase]` précédentes sont disponibles pour effectuer des tests de cette manière. 'Précédentes' signifie qu'elles se trouvent à un niveau plus global de la configuration (par exemple au niveau du serveur principal), ou plus haut chronologiquement dans le contexte de la directive. Les variables d'environnement ne seront prises en compte que si aucune correspondance n'a été trouvée parmi les caractéristiques de la requête, et si *attribut* n'a pas été spécifié sous la forme d'une expression rationnelle.

Le second argument (*regex*) est une expression rationnelle. Si *regex* correspond à l'*attribut*, les arguments suivants sont évalués.

Le reste des arguments constitue les noms des variables à définir, ainsi que les valeurs optionnelles qui doivent leur être affectées. Ils peuvent se présenter sous les formes suivantes :

1. `nom-variable`, ou
2. `!nom-variable`, ou
3. `nom-variable=valeur`

Dans la première forme, la valeur sera définie à "1". Dans la seconde forme, la variable sera supprimée si elle a été définie au préalable, et dans la troisième forme, la variable sera définie à la valeur littérale spécifiée par `valeur`. Depuis la version 2.0.51, Apache httpd reconnaît les occurrences de variables `$1`..`$9` à l'intérieur de `valeur`, et les remplace par les sous-expressions entre parenthèses correspondantes de *regex*. `$0` permet d'accéder à l'ensemble de la chaîne qui correspond à ce modèle.

```apache
SetEnvIf Request_URI "\.gif$" object_is_image=gif
SetEnvIf Request_URI "\.jpg$" object_is_image=jpg
SetEnvIf Request_URI "\.xbm$" object_is_image=xbm

SetEnvIf Referer www\.mydomain\.example\.com intra_site_referral

SetEnvIf object_is_image xbm XBIT_PROCESSING=1

SetEnvIf Request_URI "\.(.*)$" EXTENSION=$1

SetEnvIf ^TS  ^[a-z]  HAVE_TS
```

Les trois premières lignes définissent la variable d'environnement `objet_est_une_image` si l'objet de la requête est un fichier image, et la quatrième définit la variable `intra_site_referral` si la page référante se trouve quelque part dans le site web `www.mydomain.example.com`.

La dernière ligne définit la variable d'environnement `HAVE_TS` si la requête contient un en-tête dont le nom commence par "TS" et dont la valeur commence par tout caractère du jeu \[a-z\].

## Voir aussi

- [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement|Les variables d'environnement et le serveur HTTP Apache]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
