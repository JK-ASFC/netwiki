---
title: "UseCanonicalName"
description: "Directive Apache UseCanonicalName (core) — Définit la manière dont le serveur détermine son propre nom et son port. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit la manière dont le serveur détermine son propre nom et son port |
| **Syntaxe** | `UseCanonicalName On\|Off\|DNS` |
| **Valeur par défaut** | `UseCanonicalName Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Dans de nombreuses situations, Apache httpd doit construire une URL *auto-identifiante* -- c'est à dire une URL qui fait référence au serveur lui-même. Avec `UseCanonicalName On`, Apache httpd va utiliser le nom d'hôte et le port spécifiés par la directive [[13-directives/servername|ServerName]] pour construire le nom canonique du serveur. Ce nom est utilisé dans toutes les URLs auto-identifiantes, et affecté aux variables `SERVER_NAME` et `SERVER_PORT` dans les programmes CGI.

Avec `UseCanonicalName Off`, Apache httpd va construire ses URLs auto-identifiantes à l'aide du nom d'hôte et du port fournis par le client, si ce dernier en a fourni un (dans la négative, Apache utilisera le nom canonique, de la même manière que ci-dessus). Ces valeurs sont les mêmes que celles qui sont utilisées pour implémenter les [[11-guides/03-serveurs-virtuels/support-apache-des-serveurs-virtuels-par-nom|serveurs virtuels à base de nom]], et sont disponibles avec les mêmes clients. De même, les variables CGI `SERVER_NAME` et `SERVER_PORT` seront affectées des valeurs fournies par le client.

Cette directive peut s'avérer utile, par exemple, sur un serveur intranet auquel les utilisateurs se connectent en utilisant des noms courts tels que `www`. Si les utilisateurs tapent un nom court suivi d'une URL qui fait référence à un répertoire, comme `http://www/splat`, *sans le slash terminal*, vous remarquerez qu'Apache httpd va les rediriger vers `http://www.example.com/splat/`. Si vous avez activé l'authentification, ceci va obliger l'utilisateur à s'authentifier deux fois (une première fois pour `www` et une seconde fois pour `www.example.com` -- voir [la foire aux questions sur ce sujet pour plus d'informations](https://cwiki.apache.org/confluence/display/httpd/FAQ#Why_does_Apache_ask_for_my_password_twice_before_serving_a_file.3F)). Par contre, si `UseCanonicalName` est définie à `Off`, Apache httpd redirigera l'utilisateur vers `http://www/splat/`.

Pour l'hébergement virtuel en masse à base d'adresse IP, on utilise une troisième option, `UseCanonicalName DNS`, pour supporter les clients anciens qui ne fournissent pas d'en-tête `Host:`. Apache httpd effectue alors une recherche DNS inverse sur l'adresse IP du serveur auquel le client s'est connecté afin de construire ses URLs auto-identifiantes.

> [!WARNING]
> **Avertissement**
>
> Les programmes CGI risquent d'être perturbés par cette option s'ils tiennent compte de la variable `SERVER_NAME`. Le client est pratiquement libre de fournir la valeur qu'il veut comme nom d'hôte. Mais si le programme CGI n'utilise `SERVER_NAME` que pour construire des URLs auto-identifiantes, il ne devrait pas y avoir de problème.

## Voir aussi

- [[13-directives/usecanonicalphysicalport|UseCanonicalPhysicalPort]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
