---
title: "SSLCARevocationFile"
description: "Directive Apache SSLCARevocationFile (mod_ssl) — Fichier contenant la concaténation des CRLs des CA codés en PEM pour l'authentification des clients. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fichier contenant la concaténation des CRLs des CA codés en PEM pour l'authentification des clients |
| **Syntaxe** | `SSLCARevocationFile file-path` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |

## Utilisation

Cette directive permet de définir le fichier *tout-en-un* où sont rassemblées les Listes de Révocation de Certificats (CRLs) des Autorités de certification (CAs) pour les clients auxquels vous avez à faire. On les utilise pour l'authentification des clients. Un tel fichier contient la simple concaténation des différents fichiers de CRLs codés en PEM, dans l'ordre de préférence. Cette directive peut être utilisée à la place et/ou en complément de la directive [[13-directives/sslcarevocationpath|SSLCARevocationPath]].

**Exemple**

```apache
SSLCARevocationFile
"/usr/local/apache2/conf/ssl.crl/ca-bundle-client.crl"
```

Ce fichier est lu au démarrage du serveur, alors que ce dernier s'exécute encore en tant que `root` (avant la restriction de ses privilèges) ; il ne doit donc être la propriété que de `root` et lisible uniquement par ce dernier. Le fichier n'est pas relu en fonctionnement normal ; un redémarrage du serveur est requis pour que les changements prennent effet.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
