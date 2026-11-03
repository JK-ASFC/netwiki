---
title: "FallbackResource"
description: "Directive Apache FallbackResource (mod_dir) — Définit une URL par défaut pour les requêtes qui ne ciblent aucun fichier ou gestionnaire. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_dir]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit une URL par défaut pour les requêtes qui ne ciblent aucun fichier ou gestionnaire |
| **Syntaxe** | `FallbackResource disabled \| url-locale` |
| **Valeur par défaut** | `Désactivé - httpd renvoie un code d'erreur 404 (Not Found)` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Base |
| **Module** | [[12-modules/mod_dir\|mod_dir]] |
| **Compatibilité** | L'argument `disabled` est disponible depuis la version 2.4.4 du serveur HTTP Apache |

## Utilisation

Cette directive permet de définir un traitement pour toute URL qui ne correspond à aucune ressource de votre système de fichiers, et qui provoquerait sans cela l'envoi d'un code d'erreur HTTP 404 (Not Found). Par exemple

```apache
FallbackResource /not-404.php
```

fait en sorte que les requêtes ne correspondant à aucun fichier soient traitées par `non-404.php`, sans affecter les requêtes pour des fichiers existants.

Il est souvent souhaitable qu'un seul fichier ou ressource traite toutes les requêtes à destination d'un répertoire particulier, sauf pour les requêtes qui correspondent à un fichier ou script existant. On y fait souvent référence sous le terme 'contrôleur frontal'.

Dans les versions plus anciennes de httpd, cet effet nécessitait en général [[12-modules/mod_rewrite|mod_rewrite]], et l'utilisation des tests conditionnels `-f` et `-d` pour vérifier l'existence des fichiers et répertoires. Maintenant, une seule ligne de configuration est nécessaire.

```apache
FallbackResource /index.php
```

Les fichiers existants comme des images, des fichiers css, etc... seront traités normalement.

Utilisez l'argument `disabled` pour désactiver cette fonctionnalité si l'héritage d'un répertoire parent n'est pas souhaité.

Pour un URI intermédiaire tel que *http://example.com/blog/*, cet URI intermédiaire doit être spécifié en tant que *url-locale* :

```apache
<Directory "/web/example.com/htdocs/blog">
    FallbackResource /blog/index.php
</Directory>
<Directory "/web/example.com/htdocs/blog/images">
    FallbackResource disabled
</Directory>
```

Un gestionnaire de ressource par défaut (dans l'exemple ci-dessus `/blog/index.php`) peut accéder à l'URL de la requête originale via la variable de serveur `REQUEST_URI`. Pour accéder à cette variable en PHP, par exemple, utilisez `$_SERVER['REQUEST_URI']`.

> [!NOTE]
> **Interaction avec les autres gestionnaires**
>
> La directive `FallbackResource` n'a d'effet que si aucun autre gestionnaire n'a été assigné à la requête. Si une directive comme [[13-directives/sethandler|SetHandler]] ou [[13-directives/addhandler|AddHandler]] a déjà assigné un gestionnaire à un URL ou à une extension de fichier, la directive `FallbackResource` ne l'outrepassera pas. Par exemple, si vous utilisez `SetHandler application/x-httpd-php` dans une section [[13-directives/directory|<Directory>]], ce gestionnaire s'appliquera à toutes les requêtes dans ce répertoire, même aux requêtes pour des fichiers qui n'existent pas ; la directive `FallbackResource` ne sera alors jamais invoquée.

## Voir aussi

- [[13-directives/sethandler|SetHandler]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
