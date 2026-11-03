---
title: "<IfVersion>"
description: "Directive Apache <IfVersion> (mod_version) — Contient des portions de configuration dépendantes de la version. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_version]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Contient des portions de configuration dépendantes de la version |
| **Syntaxe** | `<IfVersion [[!]opérateur] version> ... </IfVersion>` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_version\|mod_version]] |

## Utilisation

La section `<IfVersion>` rassemble des directives de configuration qui ne sont exécutées que si la version de httpd satisfait aux critères spécifiés. Pour une comparaison normale (numérique), l'argument *version* doit être spécifié sous le format `majeur[.mineur[.patch]]`, comme par exemple `2.1.0` ou `2.2`. *mineur* et *patch* sont optionnels. Si ces numéros sont absents, il se voient affectée implicitement la valeur 0. Les *opérateur*s numériques suivants sont autorisés :

| *opérateur* | description |
| --- | --- |
| `=` ou `==` | La version de httpd est égale à la valeur spécifiée |
| `>` | La version de httpd est supérieure à la valeur spécifiée |
| `>=` | La version de httpd est supérieure ou égale à la valeur spécifiée |
| `<` | La version de httpd est inférieure à la valeur spécifiée |
| `<=` | La version de httpd est inférieure ou égale à la valeur spécifiée |

**Exemple**

```apache
<IfVersion >= 2.3>
    # la condition n'est satisfaite que pour les versions de httpd
    # supérieures ou égales à 2.3
</IfVersion>
```

En plus d'une comparaison numérique, il est possible de comparer la version de httpd avec une expression rationnelle. Il existe deux méthodes pour spécifier cette dernière :

| *opérateur* | description |
| --- | --- |
| `=` ou `==` | *version* est de la forme `/regex/` |
| `~` | *version* est de la forme `regex` |

**Exemple**

```apache
<IfVersion = /^2.4.[01234]$/>
    # exemple de contournement pour les versions boguées
</IfVersion>
```

Pour inverser la condition, tous les opérateurs peuvent être préfixés par un point d'exclamation (`!`) :

```apache
<IfVersion !~ ^2.4.[01234]$>
    # pas pour ces versions
</IfVersion>
```

Si *opérateur* est absent, sa valeur implicite est `=`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
