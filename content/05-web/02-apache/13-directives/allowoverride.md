---
title: "AllowOverride"
description: "Directive Apache AllowOverride (core) — Types de directives autorisées dans les fichiers .htaccess. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Types de directives autorisées dans les fichiers `.htaccess` |
| **Syntaxe** | `AllowOverride All\|None\|type directive [type directive] ...` |
| **Valeur par défaut** | `AllowOverride None` |
| **Contexte** | répertoire |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Lorsque le serveur trouve un fichier de configuration distribuée (nommé en général `.htaccess` — configurable à l’aide de la directive [[13-directives/accessfilename|AccessFileName]]), il doit savoir lesquelles des directives placées dans ce fichier sont autorisées à modifier la configuration préexistante.

> [!NOTE]
> **Valable seulement dans les sections \<Directory\>**
>
> La directive `AllowOverride` ne peut être utilisée que dans les sections [[13-directives/directory|<Directory>]] définies sans expressions rationnelles, et non dans les sections [[13-directives/location|<Location>]], [[13-directives/directorymatch|<DirectoryMatch>]] ou [[13-directives/files|<Files>]].

Lorsque cette directive et la directive [[13-directives/allowoverridelist|AllowOverrideList]] sont définies à `None`, les fichiers .htaccess sont totalement ignorés. Dans ce cas, le serveur n'essaiera même pas de lire les fichiers `.htaccess` du système de fichiers.

Lorsque cette directive est définie à `All`, toute directive valable dans le Contexte .htaccess sera autorisée dans les fichiers `.htaccess`.

L'argument *type directive* peut contenir les groupements de directives suivants (voir ce document pour obtenir la liste à jour des directives activées pour chaque type de directive) :

**AuthConfig**

Permet l'utilisation des directives d'autorisation ([[13-directives/authdbmgroupfile|AuthDBMGroupFile]], [[13-directives/authdbmuserfile|AuthDBMUserFile]], [[13-directives/authgroupfile|AuthGroupFile]], [[13-directives/authname|AuthName]], [[13-directives/authtype|AuthType]], [[13-directives/authuserfile|AuthUserFile]], [[13-directives/require|Require]], *etc...*).

**FileInfo**

Permet l'utilisation des directives qui contrôlent les types de documents (directives [[13-directives/errordocument|ErrorDocument]], [[13-directives/forcetype|ForceType]], [[13-directives/languagepriority|LanguagePriority]], [[13-directives/sethandler|SetHandler]], [[13-directives/setinputfilter|SetInputFilter]], [[13-directives/setoutputfilter|SetOutputFilter]], et directives du module [[12-modules/mod_mime|mod_mime]] Add\* et Remove\*), des metadonnées des documents ([[13-directives/header|Header]], [[13-directives/requestheader|RequestHeader]], [[13-directives/setenvif|SetEnvIf]], [[13-directives/setenvifnocase|SetEnvIfNoCase]], [[13-directives/browsermatch|BrowserMatch]], [[13-directives/cookieexpires|CookieExpires]], [[13-directives/cookiedomain|CookieDomain]], [[13-directives/cookiestyle|CookieStyle]], [[13-directives/cookietracking|CookieTracking]], [[13-directives/cookiename|CookieName]]), des directives du module [[12-modules/mod_rewrite|mod_rewrite]] directives ([[13-directives/rewriteengine|RewriteEngine]], [[13-directives/rewriteoptions|RewriteOptions]], [[13-directives/rewritebase|RewriteBase]], [[13-directives/rewritecond|RewriteCond]], [[13-directives/rewriterule|RewriteRule]]), des directives du module [[12-modules/mod_alias|mod_alias]] directives ([[13-directives/redirect|Redirect]], [[13-directives/redirecttemp|RedirectTemp]], [[13-directives/redirectpermanent|RedirectPermanent]], [[13-directives/redirectmatch|RedirectMatch]]), et de la directive [[13-directives/action|Action]] du module [[12-modules/mod_actions|mod_actions]].

**Indexes**

Permet l'utilisation des directives qui contrôlent l'indexation des répertoires ([[13-directives/adddescription|AddDescription]], [[13-directives/addicon|AddIcon]], [[13-directives/addiconbyencoding|AddIconByEncoding]], [[13-directives/addiconbytype|AddIconByType]], [[13-directives/defaulticon|DefaultIcon]], [[13-directives/directoryindex|DirectoryIndex]], [[12-modules/mod_autoindex|FancyIndexing]], [[13-directives/headername|HeaderName]], [[13-directives/indexignore|IndexIgnore]], [[13-directives/indexoptions|IndexOptions]], [[13-directives/readmename|ReadmeName]], *etc...*).

**Limit**

Permet l'utilisation des directives patrimoniales de contrôle d'accès au serveur ([[13-directives/allow|Allow]], [[13-directives/deny|Deny]] et [[13-directives/order|Order]]). Pour un équivalent moderne, voir la directive [[13-directives/require|Require]] contrôlée par `AuthConfig`.

**Nonfatal=\[Override|Unknown|All\]**

Permet d'utiliser l'option AllowOverride pour rendre les erreurs de syntaxe non fatales dans les fichiers .htaccess : au lieu de causer une Internal Server Error, les directives non autorisées ou non reconnues seront ignorées et un avertissement enregistré dans le journal :

- **Nonfatal=Override** rend les directives interdite par AllowOverride non fatales.
- **Nonfatal=Unknown** rend les directives inconnues non fatales. Sont concernées les erreurs de frappe et les directives implémentées par un module non chargé.
- **Nonfatal=All** rend toutes les directives précédentes non fatales.

Notez qu'une erreur de syntaxe dans une directive valide causera toujours une internal server error.

> [!WARNING]
> **Sécurité**
>
> Les erreurs non fatales peuvent être à l'origine de problèmes de sécurité pour les utilisateurs de fichiers .htaccess. Par exemple, si AllowOverride interdit AuthConfig, toute configuration utilisateur destinée à restreindre l'accès à un site ne sera pas prise en compte.

**Options\[=*Option*,...\]**

Permet l'utilisation des directives contrôlant les fonctionnalités spécifiques d'un répertoire ([[13-directives/options|Options]] et [[13-directives/xbithack|XBitHack]]). Pour restreindre les options pouvant être outrepassées, ajoutez un signe "égal" suivi d'une liste d'options, séparées par des virgules (sans espaces), pouvant être définies à l'aide de la directive [[13-directives/options|Options]].

> [!WARNING]
> **Désactivation implicite des options**
>
> Cette restriction ne contrôle que les options qu’un fichier `.htaccess` peut *activer*. Elle n’empêche pas la *désactivation* des options héritées.
>
> Lorsqu’une directive [[13-directives/options|Options]] dans un fichier `.htaccess` utilise une syntaxe absolue (sans préfixe `+` ou `-`), elle *remplace* la totalité du jeu d’options héritées. Toute option auparavant active qui n’est pas listée est implicitement désactivée—il en est de même pour les options qui ne sont pas dans la liste `AllowOverride` des options permises.
>
> Par exemple, si la configuration définit :
>
> ```apache
> Options Indexes FollowSymLinks ExecCGI
> AllowOverride Options=Indexes
> ```
>
> et si un fichier `.htaccess` contient :
>
> ```apache
> Options Indexes
> ```
>
> les options `FollowSymLinks` et `ExecCGI` seront implicitement désactivée pour le répertoire concerné, même si la ligne `AllowOverride` ne fait que permettre la définition de l’option `Indexes`.
>
> En bref, ce mécanisme ne peut pas forcer une option spécifique à rester *définie* tout en permettant la définition de toutes les autres.

```apache
AllowOverride Options=Indexes,MultiViews
```

Exemple :

```apache
AllowOverride AuthConfig Indexes
```

Dans l'exemple ci-dessus, toutes les directives qui ne font partie ni du groupe `AuthConfig`, ni du groupe `Indexes`, provoquent une erreur "internal server error".

> [!NOTE]
> Pour des raisons de sécurité et de performance, ne définissez pas `AllowOverride` à autre chose que `None` dans votre bloc `<Directory "/">`. Recherchez plutôt (ou créez) le bloc `<Directory>` qui se réfère au répertoire où vous allez précisément placer un fichier `.htaccess`.

## Voir aussi

- [[13-directives/accessfilename|AccessFileName]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
