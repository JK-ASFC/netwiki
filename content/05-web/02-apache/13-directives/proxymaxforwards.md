---
title: "ProxyMaxForwards"
description: "Directive Apache ProxyMaxForwards (mod_proxy) — Nombre maximum de mandataires à travers lesquelles une requête peut être redirigée. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre maximum de mandataires à travers lesquelles une requête peut être redirigée |
| **Syntaxe** | `ProxyMaxForwards nombre` |
| **Valeur par défaut** | `ProxyMaxForwards -1` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |
| **Compatibilité** | Comportement par défaut modifié dans 2.2.7 |

## Utilisation

La directive `ProxyMaxForwards` permet de spécifier le nombre maximum de mandataires à travers lesquels une requête peut passer dans le cas où la la requête ne contient pas d'en-tête `Max-Forwards`. Ceci permet de se prémunir contre les boucles infinies de mandataires ou contre les attaques de type déni de service.

**Exemple**

```apache
ProxyMaxForwards 15
```

Notez que la définition de la directive `ProxyMaxForwards` constitue une violation du protocole HTTP/1.1 (RFC2616), qui interdit à un mandataire de définir `Max-Forwards` si le client ne l'a pas fait lui-même. Les versions précédentes d'Apache httpd la définissaient systématiquement. Une valeur négative de `ProxyMaxForwards`, y compris la valeur par défaut -1, implique un comportement compatible avec le protocole, mais vous expose aux bouclages infinis.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
