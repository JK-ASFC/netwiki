---
title: "CGIVar"
description: "Directive Apache CGIVar (core) — Contrôle la manière dont certaines variables CGI sont définies. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Contrôle la manière dont certaines variables CGI sont définies |
| **Syntaxe** | `CGIVar variable rule` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Disponible à partir de la version 2.4.21 du serveur HTTP Apache |

## Utilisation

Cette directive permet de contrôler la manière dont certaines variables CGI sont définies lorsque des requêtes sont transmises à des scripts CGI ou d’autres gestionnaires qui reçoivent un environnement CGI. Actuellement, la seule variable prise en charge est `REQUEST_URI`.

Par défaut, la variable d’environnement CGI `REQUEST_URI` contient l’URI original de la requête du client. Cela implique que même si [[12-modules/mod_rewrite|mod_rewrite]] ou une redirection interne modifie la ressource qui va être servie, le script CGI verra quand-même l’URI original que le client a envoyé.

Avec `CGIVar REQUEST_URI current-uri`, la valeur est définie à l’URI actuel après l’application de toute réécriture ou redirection interne.

**Valeurs autorisées :**

**`original-uri` (valeur par défaut)**

Définit `REQUEST_URI` avec l’URI de la requête originale du client, sans tenir compte d’une réécriture ou redirection interne quelconque.

**`current-uri`**

Définit `REQUEST_URI` avec l’URI de la ressource en train d’être traitée, qui peut être différente de la requête originale en cas de réécriture ou de redirection interne.

```apache
# Montrer aux scripts CGI l’URI réécrit à la place de l’original
CGIVar REQUEST_URI current-uri
```

> [!NOTE]
> **Note**
>
> Dans tous les cas, la variable d’environnement CGI `REQUEST_URI` contient l’URI complet, y compris la chaîne de paramètres. Cela est différent pour la variable de serveur `%{REQUEST_URI}` utilisée dans [[12-modules/mod_rewrite|mod_rewrite]] et les expressions de [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|ap_expr]], qui ne contient que la partie chemin (pas la chaîne de paramètres).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
