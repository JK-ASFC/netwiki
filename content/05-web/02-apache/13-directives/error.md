---
title: "Error"
description: "Directive Apache Error (core) — Interrompt la lecture de la configuration avec un message d'erreur personnalisé. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Interrompt la lecture de la configuration avec un message d'erreur personnalisé |
| **Syntaxe** | `Error message` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | à partir de la version 2.3.9 |

## Utilisation

Si une erreur peut être détectée dans la configuration, souvent un module manquant, cette directive peut être utilisée pour générer un message d'erreur personnalisé, et interrompre la lecture de la configuration.

```apache
# Exemple
# vérification du chargement de mod_include
<IfModule !include_module>
  Error "mod_include is required by mod_foo.  Load it with LoadModule."
</IfModule>

# vérification de la définition de SSL ou (exclusif) NOSSL
<IfDefine SSL>
<IfDefine NOSSL>
  Error "Both SSL and NOSSL are defined.  Define only one of them."
</IfDefine>
</IfDefine>
<IfDefine !SSL>
<IfDefine !NOSSL>
  Error "Either SSL or NOSSL must be defined."
</IfDefine>
</IfDefine>
```

> [!WARNING]
> **Note**
>
> Cette directive est évaluée lors du traitement de la configuration, et non à l'exécution. Par conséquent, elle ne peut pas être évaluée de manière conditionnelle en l'incluant dans une section [[13-directives/if|<If>]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
