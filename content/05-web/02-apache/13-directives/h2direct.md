---
title: "H2Direct"
description: "Directive Apache H2Direct (mod_http2) — Activation du protocole H2 Direct. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Activation du protocole H2 Direct |
| **Syntaxe** | `H2Direct on\|off` |
| **Valeur par défaut** | `H2Direct on pour h2c, off pour le protocole h2` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |

## Utilisation

Cette directive permet d'activer/désactiver l'utilisation du mode HTTP/2 Direct. Elle doit être située dans une section [[13-directives/virtualhost|<VirtualHost>]] afin d'activer la communication directe HTTP/2 pour le serveur virtuel considéré.

La notion de communication directe signifie que si les premiers octets reçus par le serveur correspondent à un en-tête HTTP/2, le protocole HTTP/2 est utilisé sans négociation supplémentaire. Ce mode est défini pour les transmissions en clair (h2c) dans la RFC 7540. Son utilisation avec les connexions TLS n'est pas officiellement supportée.

Lorsque le protocole h2 ou h2c n'est pas activé via la directive [[13-directives/protocols|Protocols]], la recherche d'un en-tête HTTP/2 n'est jamais effectuée au sein d'une connexion. La directive `H2Direct` ne produit alors aucun effet. Ceci est important pour les connexions qui utilisent un protocole pour lequel une lecture initiale peut entraîner un blocage définitif comme NNTP.

Pour un client qui sait qu'un serveur supporte h2c, la communication directe HTTP/2 dispense le client d'une mise à jour HTTP/1.1, ce qui entraîne une amélioration des performances et évite les restrictions sur les corps de requête suite à une mise à jour.

Cette directive rend aussi h2c plus attractif pour les communications de serveur à serveur lorsque la connexion est sure ou peut être sécurisée d'une manière ou d'une autre.

**Exemple**

```apache
H2Direct on
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
