---
title: "mod_macro"
description: "Module Apache mod_macro — Ce module permet d'utiliser des macros dans les fichiers de configuration Apache. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_macro]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ce module permet d'utiliser des macros dans les fichiers de configuration Apache. |
| **Statut** | Base |
| **Identificateur** | `macro_module` |
| **Fichier source** | `mod_macro.c` |
| **Compatibilité** | Disponible à partir de la version 2.4.5 du serveur HTTP Apache |

## Sommaire

Ce module permet d'utiliser des macros dans les fichiers de configuration à l'exécution du serveur HTTP Apache afin de faciliter la création de nombreux blocs de configuration similaires. Quand le serveur démarre, les macros sont exécutées avec les paramètres fournis, et le résultat obtenu est traité au même titre que le reste du fichier de configuration.

## Utilisation

On définit une macro à l'aide des blocs [[13-directives/macro|<Macro>]] qui contiennent la portion de votre configuration qui intervient de manière répétitive, y compris les variables pour les parties qui devront être substituées.

Par exemple, vous pouvez utiliser une macro pour définir un bloc [[13-directives/virtualhost|<VirtualHost>]], afin de pouvoir définir de nombreux serveurs virtuels similaires :

```apache
<Macro VHost $name $domain>
<VirtualHost *:80>
    ServerName $domain
    ServerAlias www.$domain

    DocumentRoot "/var/www/vhosts/$name"
    ErrorLog "/var/log/httpd/$name.error_log"
    CustomLog "/var/log/httpd/$name.access_log" combined
</VirtualHost>
</Macro>
```

Comme les directives de configuration httpd, les noms des macros sont insensibles à la casse, à la différence des variables qui y sont, elles, sensibles.

Vous pouvez alors invoquer cette macro autant de fois que vous le voulez pour créer des serveurs virtuels

```apache
Use VHost example example.com
Use VHost myhost hostname.org
Use VHost apache apache.org

UndefMacro VHost
```

Au démarrage du serveur, chacune de ces invocations [[13-directives/use|Use]] sera remplacée par une définition de serveur virtuel complète, comme décrit dans la définition de la [[13-directives/macro|<Macro>]].

La directive [[13-directives/undefmacro|UndefMacro]] permet d'éviter les conflits de définitions qui pourraient provenir de l'utilisation ultérieure de macros contenant les mêmes noms de variables.

Vous trouverez une version plus élaborée de cet exemple plus loin dans la section Exemples.

## Conseils

Les noms de paramètres doivent commencer par un sigil tel que `$`, `%`, ou `@`, de façon à ce qu'ils soient clairement identifiables, mais aussi afin de faciliter les interactions avec les autres directives, comme la directive de base [[13-directives/define|Define]]. Dans le cas contraire, vous recevrez un avertissement. En tout état de cause, il est conseillé d'avoir une bonne connaissance globale de la configuration du serveur, afin d'éviter la réutilisation des mêmes variables à différents niveaux, ce qui peut être à l'origine de confusions.

Les paramètres préfixés par `$` ou `%` ne sont pas échappés. Les paramètres préfixés par `@` sont échappés entre guillemets.

Evitez de préfixer un paramètre par le nom d'un autre paramètre (par exemple, présence simultanée des paramètres `$win` et `$winter`), car ceci peut introduire de la confusion lors de l'évaluation des expressions. Si cela se produit, c'est le nom de paramètre le plus long possible qui sera utilisé.

Si vous désirez insérer une valeur dans une chaîne, il est conseillé de l'entourer de parenthèses afin d'éviter toute confusion. La syntaxe `$(...)` doit être utilisée à la place de la syntaxe `${...}`, car cette dernière entre en conflit avec la syntaxe de la variable [[13-directives/define|Define]] :

```apache
<Macro DocRoot $(docroot)>
    DocumentRoot "/var/www/$(docroot)/htdocs"
</Macro>
```

## Exemples

### Définition de serveurs virtuels

Un exemple typique d'utilisation de [[12-modules/mod_macro|mod_macro]] est la création dynamique de serveurs virtuels.

```apache
## Définition d'une macro VHost pour les configurations répétitives

<Macro VHost $host $port $dir>
  Listen $port
  <VirtualHost *:$port>

    ServerName $host
    DocumentRoot "$dir"

    # Racine des documents publique
    <Directory "$dir">
      Require all granted
    </Directory>

    # restriction d'accès au sous-répertoire intranet.
    <Directory "$dir/intranet">
      Require ip 10.0.0.0/8
    </Directory>
  </VirtualHost>
</Macro>

## Utilisation de la macro VHost avec différents arguments.

Use VHost www.apache.org 80 /vhosts/apache/htdocs
Use VHost example.org 8080 /vhosts/example/htdocs
Use VHost www.example.fr 1234 /vhosts/example.fr/htdocs
```

### Suppression d'une définition de macro

Il est recommandé de supprimer la définition d'une macro après l'avoir utilisée. Ceci permet d'éviter les confusions au sein d'un fichier de configuration complexe où des conflits entre noms de variables peuvent survenir.

```apache
<Macro DirGroup $dir $group>
  <Directory "$dir">
    Require group $group
  </Directory>
</Macro>

Use DirGroup /www/apache/private private
Use DirGroup /www/apache/server  admin

UndefMacro DirGroup
```

## Directives

- [[13-directives/macro|<Macro>]]
- [[13-directives/use|Use]]
- [[13-directives/undefmacro|UndefMacro]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
