---
title: "RewriteOptions"
description: "Directive Apache RewriteOptions (mod_rewrite) — Configure certaines options spéciales pour le moteur de réécriture. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_rewrite]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Configure certaines options spéciales pour le moteur de réécriture |
| **Syntaxe** | `RewriteOptions Options` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_rewrite\|mod_rewrite]] |

## Utilisation

La directive `RewriteOptions` définit certaines options spéciales pour la configuration au niveau du serveur ou du répertoire. La chaîne de caractères *Option* ne peut actuellement prendre qu'une des valeurs suivantes :

**`Inherit`**

Ceci force la configuration locale à hériter de la configuration du niveau supérieur. Dans le contexte des hôtes virtuels, cela signifie que les correspondances, conditions et règles du serveur principal sont héritées. Dans le contexte des répertoires, cela signifie que les conditions et règles de la configuration `.htaccess` ou les sections [[13-directives/directory|<Directory>]] du répertoire parent sont héritées. Les règles héritées sont virtuellement copiées dans la section où cette directive est utilisée. Si elles sont utilisées avec des règles locales, les règles héritées sont placées après ces dernières. La place de cette directive - avant ou après les règles locales - n'a aucune influence sur ce comportement. Si des règles locales ont forcé l'arrêt de la réécriture, les règles héritées ne seront pas traitées.

> [!WARNING]
> Les règles héritées du niveau parent sont appliquées **after** après les règles spécifiées dans le niveau enfant.

**`InheritBefore`**

Même effet que l'option `Inherit` ci-dessus, mais les règles spécifiées dans le niveau parent s'appliquent **avant** les règles spécifiées dans le niveau enfant.
Disponible depuis la version 2.3.10 du serveur HTTP Apache.

**`InheritDown`**

Si cette option est activée, toutes les configurations enfants hériteront de la configuration courante. Il en est de même si l'on spécifie `RewriteOptions Inherit` dans toutes les configurations enfants. Voir l'option `Inherit` pour plus de détails à propos de la manière dont les relations parent-enfants sont traitées.
Cette option est disponible à partir de la version 2.4.8 du serveur HTTP Apache.

**`InheritDownBefore`**

L'effet de cette option est équivalent à celui de l'option `InheritDown` ci-dessus, mais les règles de la configuration parente s'appliquent **avant** toute règle de la configuration enfant.
Cette option est disponible à partir de la version 2.4.8 du serveur HTTP Apache.

**`IgnoreInherit`**

Si cette option est activée, les configurations courante et enfants ignoreront toute règle héritée d'une configuration parente via les options `InheritDown` ou `InheritDownBefore`.
Cette option est disponible à partir de la version 2.4.8 du serveur HTTP Apache.

**`AllowNoSlash`**

Par défaut, [[12-modules/mod_rewrite|mod_rewrite]] ignore les URLs qui correspondent à un répertoire sur disque, mais ne comportent pas de slash final, afin que le module [[12-modules/mod_dir|mod_dir]] redirige le client vers l'URL canonique avec un slash final.

Lorsque la directive [[13-directives/directoryslash|DirectorySlash]] est définie à off, il est possible de spécifier l'option `AllowNoSlash` pour s'assurer que les règles de réécriture ne soient plus ignorées. Si on le souhaite, cette option permet de faire s'appliquer des règles de réécriture qui correspondent à un répertoire sans slash final au sein de fichiers .htaccess.
Elle est disponible à partir de la version 2.4.0 du serveur HTTP Apache.

**`AllowAnyURI`**

A partir de la version 2.2.22 de httpd, lorsqu'une directive [[13-directives/rewriterule|RewriteRule]] se situe dans un contexte de `serveur virtuel` ou de serveur principal, [[12-modules/mod_rewrite|mod_rewrite]] ne traitera les règles de réécriture que si l'URI de la requête respecte la syntaxe d'un chemin URL. Ceci permet d'éviter certains problèmes de sécurité où des règles particulières pourraient permettre des développements de modèles inattendus (voir [CVE-2011-3368](http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2011-3368) et [CVE-2011-4317](http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2011-4317)). Pour s'affranchir de la restriction relative à la syntaxe des chemins URL, on peut utiliser l'option `AllowAnyURI`, afin de permettre à [[12-modules/mod_rewrite|mod_rewrite]] d'appliquer le jeu de règles à toute chaîne de requête URI, sans vérifier si cette dernière respecte la grammaire des chemins URL définie dans la spécification HTTP.
Disponible depuis la version 2.4.3 du serveur HTTP Apache.

> [!WARNING]
> **Avertissement à propos de la sécurité**
>
> L'utilisation de cette option rendra le serveur vulnérable à certains problèmes de sécurité si les règles de réécritures concernées n'ont pas été rédigées avec soin. Il est par conséquent **fortement recommandé** de ne pas utiliser cette option. En particulier, prêtez attention aux chaînes en entrée contenant le caractère '`@`', qui peuvent modifier l'interprétation de l'URI réécrite, comme indiqué dans les liens ci-dessus.

**`MergeBase`**

Avec cette option, la valeur de la directive [[13-directives/rewritebase|RewriteBase]] est recopiée depuis une valeur explicitement définie dans tout sous-répertoire qui ne définit pas sa propre directive [[13-directives/rewritebase|RewriteBase]]. Il s'agissait du comportement par défaut avec les versions 2.4.0 à 2.4.3, et ce drapeau qui permet de retrouver ce comportement est disponible depuis la version 2.4.4 du serveur HTTP Apache.

**`IgnoreContextInfo`**

Lors d'une substitution relative dans un contexte de répertoire (htaccess), et si la directive [[13-directives/rewritebase|RewriteBase]] n'a pas été définie, ce module utilise des informations en provenance d'une extension d'URL et du contexte du système de fichiers pour transformer la sustitution relative en URL. Par exemple, les modules [[12-modules/mod_userdir|mod_userdir]] et [[12-modules/mod_alias|mod_alias]] utilisent ces informations de contexte étendu. Disponible à partir de la version 2.4.16 du serveur HTTP Apache.

**`LegacyPrefixDocRoot`**

Avant la version 2.4.26, si une substitution était une URL absolue qui correspondait au serveur virtuel courant, l'URL pouvait être tout d'abord réduite à sa partie chemin, puis enfin en chemin local. Comme l'URL peut être réduite en chemin local, le chemin doit être préfixé par la valeur de la directive DocumentRoot, ce qui permet d'interdire l'accès à un fichier tel que /tmp/myfile suite à une requête pour http://host/file/myfile avec la [[13-directives/rewriterule|RewriteRule]] suivante :

```apache
RewriteRule /file/(.*) http://localhost/tmp/$1
```

Cette option permet de restaurer l'ancien comportement lorsqu'un chemin local obtenu à partir de la réduction d'une URL n'est pas préfixé par la valeur de la directive DocumentRoot. Disponible à partir de la version 2.4.26 du serveur HTTP Apache.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
