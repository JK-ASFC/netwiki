---
title: "H2Upgrade"
description: "Directive Apache H2Upgrade (mod_http2) — Activation/Désactivation du protocole de mise à jour H2. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Activation/Désactivation du protocole de mise à jour H2 |
| **Syntaxe** | `H2Upgrade on\|off` |
| **Valeur par défaut** | `H2Upgrade on pour h2c, off pour h2` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |

## Utilisation

Cette directive permet d'activer/désactiver l'utilisation de la méthode de mise à jour pour passer de HTTP/1.1 à HTTP/2. Elle doit être placée dans une section [[13-directives/virtualhost|<VirtualHost>]] afin d'activer la mise à jour vers HTTP/2 pour le serveur virtuel considéré.

Cette méthode de changement de protocole est définie dans HTTP/1.1 et utilise l'en-tête "Upgrade" (d'où son nom) pour indiquer l'intention d'utiliser un autre protocole. Cet en-tête peut être présent dans toute requête sur une connexion HTTP/1.1.

Elle activée par défaut pour les transmissions en clair (h2c), et désactivée avec TLS (h2), comme préconisé par la RFC 7540.

Sachez cependant que les mises à jour ne sont acceptées que pour les requêtes qui ne possèdent pas de corps. Le requêtes de type POST et PUT avec un contenu ne feront jamais l'objet d'une mise à jour vers HTTP/2. Se référer à la documentation de la directive [[13-directives/h2direct|H2Direct]] pour envisager une alternative à Upgrade.

Cette directive n'a d'effet que si h2 ou h2c est activé via la directive [[13-directives/protocols|Protocols]].

**Exemple**

```apache
H2Upgrade on
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
