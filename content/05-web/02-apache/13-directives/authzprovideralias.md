---
title: "<AuthzProviderAlias>"
description: "Directive Apache <AuthzProviderAlias> (mod_authz_core) — Regroupe des directives représentant une extension d'un fournisseur d'autorisation de base qui pourra être référencée à l'aide de l'alias spécifié. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authz_core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Regroupe des directives représentant une extension d'un fournisseur d'autorisation de base qui pourra être référencée à l'aide de l'alias spécifié |
| **Syntaxe** | `<AuthzProviderAlias baseProvider Alias Require-Parameters> ... </AuthzProviderAlias>` |
| **Contexte** | configuration du serveur |
| **Statut** | Base |
| **Module** | [[12-modules/mod_authz_core\|mod_authz_core]] |

## Utilisation

Les balises `<AuthzProviderAlias>` et `</AuthzProviderAlias>` permettent de regrouper des directives d'autorisation auxquelles on pourra faire référence à l'aide de l'alias spécifié dans une directive [[13-directives/require|Require]].

Si *Require-Parameters* comporte plusieurs paramètres, la liste de ces derniers doit être entourée de guillemets. Dans le cas contraire, seul le premier paramètre de la liste sera pris en compte.

```apache
# Dans cet exemple, pour que les deux adresses IP soient prises en compte, elles
# DOIVENT être entourées de guillemets
<AuthzProviderAlias ip reject-ips "XXX.XXX.XXX.XXX YYY.YYY.YYY.YYY">
</AuthzProviderAlias>

<Directory "/path/to/dir">
    <RequireAll>
        Require not reject-ips
        Require all granted
    </RequireAll>
</Directory>
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
