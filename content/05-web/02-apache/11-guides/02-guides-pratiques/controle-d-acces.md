---
title: "Contrôle d'accès"
description: "Apache HTTP Server — Contrôle d'accès. Le contrôle d'accès fait référence à tout concept de contrôle d'accès à une ressource quelconque. Il est distinct du processus d'authentification et d'autorisation."
tags: [apache, guide]
icon: book-open
---

Le contrôle d'accès fait référence à tout concept de contrôle d'accès à une ressource quelconque. Il est distinct du processus d'[[11-guides/02-guides-pratiques/authentification-et-autorisation|authentification et d'autorisation]].

## Modules et directives concernés

Plusieurs modules peuvent intervenir dans le contrôle d'accès. Les plus importants sont [[12-modules/mod_authz_core|mod_authz_core]] et [[12-modules/mod_authz_host|mod_authz_host]]. Ce document également aussi comment utiliser [[12-modules/mod_rewrite|mod_rewrite]] pour le contrôle d'accès.

## Contrôle d'accès en fonction de l'hôte du client

Si vous souhaitez restreindre l'accès à certaines parties de votre site web en fonction de l'adresse de l'hôte de vos visiteurs, utilisez le module [[12-modules/mod_authz_host|mod_authz_host]].

La directive [[13-directives/require|Require]] permet d'accorder ou d'interdire l'accès à certaines ressources de différentes manières. Ces critères d'accès, en conjonction avec les directives [[13-directives/requireall|<RequireAll>]], [[13-directives/requireany|<RequireAny>]], et [[13-directives/requirenone|<RequireNone>]], peuvent être combinés d'une manière suffisamment complexe pour satisfaire votre politique de contrôle d'accès.

> [!WARNING]
> Les directives [[13-directives/allow|Allow]], [[13-directives/deny|Deny]], et [[13-directives/order|Order]] fournies par le module [[12-modules/mod_access_compat|mod_access_compat]] sont obsolètes, et sont appelées à disparaître dans les versions futures. Il est donc déconseillé de les utiliser, et de se fier aux tutoriels qui recommandent leur utilisation.

Les directives Require s'utilisent comme suit :

```apache
Require host address
Require ip ip.address
```

Dans la première forme, *nom-hôte* est un nom de domaine pleinement qualifié (fqdn), ou un nom de domaine partiel ; vous pouvez spécifier plusieurs noms de domaines, si vous le désirez.

Dans la seconde forme, *adresse-ip* est une adresse IP complète, une adresse IP partielle, une paire réseau/masque de sous-réseau ou une spécification CIDR de la forme réseau/nnn. Il est possible de spécifier des adresses IPv4 ou IPv6.

**Exemples de formats d’adresse IP**

```apache
# Adresse IP complète
Require ip 10.2.3.4
# Adresse IP partielle (correspond à tout hôte dans la tranche 172.20.0.0/16)
Require ip 172.20
# Paire réseau/masque
Require ip 192.168.1.0/255.255.255.0
# Spécification réseau/CIDR
Require ip 192.168.1.0/24
# Adresse IPv6
Require ip 2001:db8::a00:20ff:fea7:ccea
# Adresse IPv6 avec CIDR
Require ip 2001:db8:1::/48
```

Voir [[12-modules/mod_authz_host|la documentation de mod_authz_host]] pour d'autres exemples de cette syntaxe.

Vous pouvez insérer le mot-clé `not` pour inverser un critère particulier. Le mot `not` réalise la négation sur la valeur, et ne peut pas être utilisé seul pour autoriser ou interdire une requête, car *non vrai* ne veut pas ici forcément dire *faux*. Ainsi, pour interdire la visite d'une page à l'aide d'une négation, le bloc doit contenir un élément, qui sera évalué à l'une des valeurs vrai ou faux. Par exemple, si quelqu'un est en train de spamer votre forum, vous pouvez ajouter cette ligne pour lui refuser l'accès :

```apache
<RequireAll>
Require all granted
Require not ip 10.252.46.165
</RequireAll>
```

Les visiteurs possédant cette adresse (`10.252.46.165`) ne pourront pas voir le contenu concerné par cette directive. Si vous voulez interdir l'accès à une machine en fonction de son nom, vous pouvez ajouter ceci :

```apache
Require not host host.example.com
```

Et si vous voulez interdire l'accès à un domaine particulier, vous pouvez spécifier des adresses IP partielles ou des noms de domaine, comme ceci :

```apache
Require not ip 192.168.205
Require not host phishers.example.com badguys.example
Require not host gov
```

Les directives [[13-directives/requireall|<RequireAll>]], [[13-directives/requireany|<RequireAny>]], et [[13-directives/requirenone|<RequireNone>]] ouvrent le champ à des critères d'accès plus complexes.

## Contrôle d'accès en fonction de variables arbitraires

Vous pouvez accorder ou refuser l'accès en fonction de variables d'environnement arbitraires ou de valeurs d'en-têtes de la requête en utilisant la directive [[13-directives/if|<If>]]. Par exemple, pour interdire l'accès en fonction du user-agent (le type de navigateur), vous pouvez spécifier ceci :

```apache
<If "%{HTTP_USER_AGENT} == 'BadBot'">
Require all denied
</If>
```

En utilisant la syntaxe `expr` de la directive [[13-directives/require|Require]], l'exemple précédent peut aussi s'écrire :

```apache
Require expr %{HTTP_USER_AGENT} != 'BadBot'
```

> [!NOTE]
> **Avertissement :**
>
> Contrôler l'accès en fonction de l'en-tête `User-Agent` n'est pas une technique fiable, car cet en-tête peut être défini à une valeur quelconque, selon le bon vouloir de l'utilisateur.

Voir le document à propos des [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|expressions]] pour une description plus approfondie des syntaxes d'expressions et des variables disponibles.

## Utilisation de mod\_rewrite pour le contrôle d'accès

Le drapeau `[F]` de la directive [[13-directives/rewriterule|RewriteRule]] permet d'envoyer une réponse de type 403 Forbidden. Il vous permet donc d'interdire l'accès à une ressource en fonction d'un critère arbitraire.

Par exemple, pour bloquer l'accès à une ressources entre 20h et 7h du matin, vous pouvez utiliser [[12-modules/mod_rewrite|mod_rewrite]] :

```apache
RewriteEngine On
RewriteCond "%{TIME_HOUR}" ">=20" [OR]
RewriteCond "%{TIME_HOUR}" "<07"
RewriteRule "^/fridge" "-" [F]
```

Toute requête arrivant après 20h ou avant 7h du matin provoquera l'envoi d'une réponse de type 403 Forbidden. Vous pouvez utiliser cette technique pour vérifier toutes sortes de critères. En outre, si vous le préférez, vous pouvez rediriger ou réécrire la requête.

Notez que la directive [[13-directives/if|<If>]], ajoutée à partir de la version 2.4, permet de remplacer le module [[12-modules/mod_rewrite|mod_rewrite]] dans de nombreuses situations où il était traditionnellement utilisé, et il sera probablement préférable pour vous de tenter de l'utiliser avant de vous tourner vers mod\_rewrite.

## Informations complémentaires

Le [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|moteur d'expressions]] vous fournit une grande puissance d'action en fonction de variables du serveur arbitraires, et il vous est conseillé de consulter le document correspondant pour plus de détails.

De même, vous devez lire la documentation du module [[12-modules/mod_authz_core|mod_authz_core]] pour des exemples de combinaison de critères d'accès multiples, et en particulier la manière dont ces derniers interagissent.

Voir aussi le How-To [[11-guides/02-guides-pratiques/authentification-et-autorisation|Authentification and autorisation]].

Voir la [[11-guides/01-generalites/sections-de-configuration|documentation sur la fusion des sections de configuration]] pour un avertissement à propos de la manière dont la directive [[13-directives/limit|<Limit>]] au sein d’une section [[13-directives/location|<Location>]] peut outrepasser silencieusement les restrictions d’accès d’une section [[13-directives/directory|<Directory>]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
