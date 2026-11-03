---
title: "CacheIgnoreURLSessionIdentifiers"
description: "Directive Apache CacheIgnoreURLSessionIdentifiers (mod_cache) — Ignore les identifiants de session définis encodés dans l'URL lors de la mise en cache. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ignore les identifiants de session définis encodés dans l'URL lors de la mise en cache |
| **Syntaxe** | `CacheIgnoreURLSessionIdentifiers identifiant [identifiant] ...` |
| **Valeur par défaut** | `CacheIgnoreURLSessionIdentifiers None` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache\|mod_cache]] |

## Utilisation

Certaines applications encodent l'identifiant de session dans l'URL comme dans l'exemple suivant :

- `/une-application/image.gif;jsessionid=123456789`
- `/une-application/image.gif?PHPSESSIONID=12345678`

Ceci implique la mise en cache des ressources séparément pour chaque session, ce qui n'est en général pas souhaité. La directive `CacheIgnoreURLSessionIdentifiers` permet de définir une liste d'identifiants qui seront supprimés de la clé utilisée pour identifier une entité dans le cache, de façon à ce que les ressources ne soient pas stockées séparément pour chaque session.

`CacheIgnoreURLSessionIdentifiers None` vide la liste des identifiants ignorés. Autrement, chaque identifiant spécifié est ajouté à la liste.

**Exemple 1**

```apache
CacheIgnoreURLSessionIdentifiers jsessionid
```

**Exemple 2**

```apache
CacheIgnoreURLSessionIdentifiers None
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
