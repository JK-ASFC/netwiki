---
title: "H2ModernTLSOnly"
description: "Directive Apache H2ModernTLSOnly (mod_http2) — Impose les connexions HTTP/2 en mode \"TLS moderne\" seulement. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Impose les connexions HTTP/2 en mode "TLS moderne" seulement |
| **Syntaxe** | `H2ModernTLSOnly on\|off` |
| **Valeur par défaut** | `H2ModernTLSOnly on` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |
| **Compatibilité** | Disponible à partir de la version 2.4.18 du serveur HTTP Apache. |

## Utilisation

Cette directive permet de définir si les vérifications de sécurité sur les connexions HTTP/2 doivent être exclusivement en mode TLS (https:). Elle peut être placée au niveau du serveur principal ou dans une section [[13-directives/virtualhost|<VirtualHost>]].

Les vérifications de sécurité nécessitent TLSv1.2 au minimum et l'absence de tout algorithme de chiffrement listé dans la RFC 7540, Appendix A. Ces vérifications seront étendues lorsque de nouveaux prérequis en matière de sécurité seront mis en place.

Le nom provient des définitions Mozilla [Security/Server Side TLS](https://wiki.mozilla.org/Security/Server_Side_TLS) où il est question de "modern compatibility". Mozilla Firefox et d'autres navigateurs imposent la "modern compatibility" pour les connexions HTTP/2. Comme toute chose en matière de sécurité opérationnelle, c'est une cible mouvante susceptible d'évoluer dans le futur.

Un des buts de ces vérifications dans [[12-modules/mod_http2|mod_http2]] tend à imposer ce niveau de sécurité pour toutes les connexions, et non seulement celles en provenance des navigateurs web. Un autre but est l'interdiction d'utiliser HTTP/2 en tant que protocole dans les négociations si les prérequis ne sont pas respectés.

En fin de compte, la sécurité de la connexion TLS est déterminée par les directives de configuration du serveur pour [[12-modules/mod_ssl|mod_ssl]].

**Exemple**

```apache
H2ModernTLSOnly off
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
