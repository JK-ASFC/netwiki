---
title: "ErrorDocument"
description: "Directive Apache ErrorDocument (core) — Document que le serveur renvoie au client en cas d'erreur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Document que le serveur renvoie au client en cas d'erreur |
| **Syntaxe** | `ErrorDocument code erreur document` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Apache httpd peut traiter les problèmes et les erreurs de quatre manières,

1. afficher un simple message d'erreur au contenu fixe
2. afficher un message personnalisé
3. rediriger en interne vers un *chemin d'URL* local pour traiter le problème ou l'erreur
4. rediriger vers une *URL* externe pour traiter le problème ou l'erreur

La première option constitue le comportement par défaut; pour choisir une des trois autres options, il faut configurer Apache à l'aide de la directive `ErrorDocument`, suivie du code de la réponse HTTP et d'une URL ou d'un message. Apache httpd fournit parfois des informations supplémentaires à propos du problème ou de l'erreur.

A partir de la version 2.4.13, il est possible d'utiliser la [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|syntaxe des expressions]] dans cette directive afin de générer des chaînes et URLs dynamiques.

Les URLs peuvent commencer par un slash (/) pour les chemins web locaux (relatifs au répertoire défini par la directive [[13-directives/documentroot|DocumentRoot]]), ou se présenter sous la forme d'une URL complète que le client pourra résoudre. Alternativement, un message à afficher par le navigateur pourra être fourni. Notez que la décision de considérer le paramètre comme URL, chemin ou message intervient avant toute interprètation d'expression. Exemples :

```apache
ErrorDocument 500 http://example.com/cgi-bin/server-error.cgi
ErrorDocument 404 /errors/bad_urls.php
ErrorDocument 401 /subscription_info.html
ErrorDocument 403 "Sorry can't allow you access today"
ErrorDocument 403 Forbidden!
ErrorDocument 403 /errors/forbidden.py?referrer=%{escape:%{HTTP_REFERER}}
```

Quand l’argument est une chaîne de texte (c’est-à-dire ni un chemin, ni un URL), il est envoyé au client avec `text/html` comme type de contenu, si bien que vous pouvez inclure des balises HTML. Vous pouvez utiliser une controblique comme caractère de continuation de ligne afin de répartir le document sur plusieurs lignes :

```apache
ErrorDocument 403 "\
<html><head>\
<title>403 Forbidden</title>\
</head><body>\
<h1>Forbidden</h1>\
<p> Vous n’êtes pas autorisé à accéder à cette ressource.</p>\
</body></html>"
```

De plus, on peut spécifier la valeur spéciale `default` pour indiquer l'utilisation d'un simple message d'Apache httpd codé en dur. Bien que non nécessaire dans des circonstances normales, la spécification de la valeur `default` va permettre de rétablir l'utilisation du simple message d'Apache httpd codé en dur pour les configurations qui sans cela, hériteraient d'une directive `ErrorDocument` existante.

```apache
ErrorDocument 404 /cgi-bin/bad_urls.pl

<Directory "/web/docs">
  ErrorDocument 404 default
</Directory>
```

Notez que lorsque vous spécifiez une directive `ErrorDocument` pointant vers une URL distante (c'est à dire tout ce qui commence par le préfixe http), le serveur HTTP Apache va envoyer une redirection au client afin de lui indiquer où trouver le document, même dans le cas où ce document se trouve sur le serveur local. Ceci a de nombreuses conséquences dont la plus importante réside dans le fait que le client ne recevra pas le code d'erreur original, mais au contraire un code de statut de redirection. Ceci peut en retour semer la confusion chez les robots web et divers clients qui tentent de déterminer la validité d'une URL en examinant le code de statut. De plus, si vous utilisez une URL distante avec `ErrorDocument 401`, le client ne saura pas qu'il doit demander un mot de passe à l'utilisateur car il ne recevra pas le code de statut 401. C'est pourquoi, **si vous utilisez une directive `ErrorDocument 401`, elle devra faire référence à un document par le biais d'un chemin local.**

Bien que la plupart des messages d'erreur internes originaux puissent être remplacés, ceux-ci sont cependant conservés dans certaines circonstances sans tenir compte de la définition de la directive [[13-directives/errordocument|ErrorDocument]]. En particulier, en cas de détection d'une requête mal formée, le processus de traitement normal des requêtes est immédiatement interrompu, et un message d'erreur interne est renvoyé, ceci afin de se prémunir contre les problèmes de sécurité liés aux requêtes mal formées.

Si vous utilisez mod\_proxy, il est en général préférable d'activer [[13-directives/proxyerroroverride|ProxyErrorOverride]] afin d'être en mesure de produire des messages d'erreur personnalisés pour le compte de votre serveur d'origine. Si vous n'activez pas ProxyErrorOverride, Apache httpd ne générera pas de messages d'erreur personnalisés pour le contenu mandaté.

## Voir aussi

- [[11-guides/01-generalites/messages-d-erreur-personnalises|documentation sur la personnalisation des réponses]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
