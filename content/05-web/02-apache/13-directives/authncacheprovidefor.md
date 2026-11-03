---
title: "AuthnCacheProvideFor"
description: "Directive Apache AuthnCacheProvideFor (mod_authn_socache) — Spécifie le fournisseur pour lequel on veut effectuer une mise en cache. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authn_socache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Spécifie le fournisseur pour lequel on veut effectuer une mise en cache |
| **Syntaxe** | `AuthnCacheProvideFor fournisseur-authn [...]` |
| **Valeur par défaut** | `None` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Base |
| **Module** | [[12-modules/mod_authn_socache\|mod_authn_socache]] |

## Utilisation

Cette directive permet de spécifier un ou plusieurs fournisseurs pour le(s)quel(s) on veut effectuer une mise en cache. Les données d'authentification trouvées par un fournisseur non spécifié dans une directive `AuthnCacheProvideFor` ne seront pas mises en cache.

Par exemple, pour mettre en cache les données d'authentification trouvées par [[12-modules/mod_authn_dbd|mod_authn_dbd]] ou par un fournisseur personnalisé *mon-fournisseur*, et ne pas mettre en cache celles trouvées par les fournisseurs légers comme file ou dbm :

```apache
AuthnCacheProvideFor dbd mon-fournisseur
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
