---
title: "CacheLastModifiedFactor"
description: "Directive Apache CacheLastModifiedFactor (mod_cache) — Le facteur utilisé pour générer une date d'expiration en fonction de la date de dernière modification. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Le facteur utilisé pour générer une date d'expiration en fonction de la date de dernière modification. |
| **Syntaxe** | `CacheLastModifiedFactor flottant` |
| **Valeur par défaut** | `CacheLastModifiedFactor 0.1` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache\|mod_cache]] |

## Utilisation

Si un document ne possède pas de date d'expiration, elle peut être calculée en fonction de la date de dernière modification, si elle existe. La directive `CacheLastModifiedFactor` permet de spécifier un *facteur* à utiliser pour la génération de cette date d'expiration au sein de la formule suivante : `délai-expiration = durée-depuis-date-dernière-modification * facteur date-expiration = date-courante + délai-expiration` Par exemple, si la dernière modification du document date de 10 heures, et si *facteur* a pour valeur 0.1, le délai d'expiration sera de 10\*0.1 = 1 heure. Si l'heure courante est 3:00pm, la date d'expiration calculée sera 3:00pm + 1 heure = 4:00pm. Si le délai d'expiration est supérieur à celui spécifié par la directive [[13-directives/cachemaxexpire|CacheMaxExpire]], c'est ce dernier qui l'emporte.

```apache
CacheLastModifiedFactor 0.5
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
