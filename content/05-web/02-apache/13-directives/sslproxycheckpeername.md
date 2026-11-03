---
title: "SSLProxyCheckPeerName"
description: "Directive Apache SSLProxyCheckPeerName (mod_ssl) — Configure la vérification du nom d'hôte dans les certificats serveur distants. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Configure la vérification du nom d'hôte dans les certificats serveur distants |
| **Syntaxe** | `SSLProxyCheckPeerName on\|off` |
| **Valeur par défaut** | `SSLProxyCheckPeerName on` |
| **Contexte** | configuration du serveur, serveur virtuel, proxy section |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Disponible à partir de la version 2.4.5 du serveur HTTP Apache Le contexte d'une section proxy est supporté à partir de la version 2.4.30 du serveur HTTP Apache |

## Utilisation

Cette directive permet de configurer la vérification du nom d'hôte pour les certificats serveur lorsque mod\_ssl agit en tant que client SSL. La vérification réussit si le nom d'hôte de l'URI de la requête correspond à un des attributs CN du sujet du certificat, ou à l'extension subjectAltName. Si la vérification échoue, la requête SSL avorte, et un code d'erreur 502 (Bad Gateway) est renvoyé.

Les caractères génériques sont supportés dans certains cas bien spécifiques : une entrée subjectAltName de type dNSName ou les attributs CN commençant par `*.` correspondront à tout nom d'hôte comportant le même nombre de champs et le même suffixe ; par exemple, `*.example.org` correspondra à `foo.example.org`, mais pas à `foo.bar.example.org` car le nombre d'éléments dans les nom est différent.

Cette fonctionnalité a été introduite avec la version 2.4.5 et l'emporte sur la directive [[13-directives/sslproxycheckpeercn|SSLProxyCheckPeerCN]] qui ne comparait que la valeur exacte du premier attribut CN avec le nom d'hôte. Cependant, de nombreux utilisateurs étaient déconcertés par le comportement induit par l'utilisation de ces deux directives individuellement, si bien que ce comportement a été amélioré avec la version 2.4.21. Voir la description de la directive [[13-directives/sslproxycheckpeercn|SSLProxyCheckPeerCN]] pour le comportement original et des détails à propos de ces améliorations.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
