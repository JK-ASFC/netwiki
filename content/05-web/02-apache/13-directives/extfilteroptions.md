---
title: "ExtFilterOptions"
description: "Directive Apache ExtFilterOptions (mod_ext_filter) — Configure les options de mod_ext_filter. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ext_filter]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Configure les options de [[12-modules/mod_ext_filter\|mod_ext_filter]] |
| **Syntaxe** | `ExtFilterOptions option [option] ...` |
| **Valeur par défaut** | `ExtFilterOptions NoLogStderr` |
| **Contexte** | répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ext_filter\|mod_ext_filter]] |

## Utilisation

La directive `ExtFilterOptions` spécifie des options de traitement particulières pour [[12-modules/mod_ext_filter|mod_ext_filter]]. Les arguments *option* peuvent contenir :

**`LogStderr | NoLogStderr`**

Le mot-clé `LogStderr` indique que les messages envoyés par le programme de filtrage externe sur la sortie d'erreurs standard doivent être enregistrés dans le journal des erreurs d'Apache. `NoLogStderr` inverse ce comportement.

**`Onfail=[abort|remove]`**

Indique la marche à suivre si le programme de filtrage externe ne peut pas démarrer. Avec `abort` (la valeur par défaut), le traitement de la requête sera abandonné. Avec `remove`, le filtre est supprimé, et le traitement de la requête se poursuit sans lui.

```apache
ExtFilterOptions LogStderr
```

Les messages envoyés vers la sortie d'erreurs standard du filtre seront enregistrés dans le journal des erreurs d'Apache.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
