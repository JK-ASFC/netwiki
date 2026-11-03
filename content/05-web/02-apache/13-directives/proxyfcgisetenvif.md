---
title: "ProxyFCGISetEnvIf"
description: "Directive Apache ProxyFCGISetEnvIf (mod_proxy_fcgi) — Permet d'adapter la valeur des variables envoyées aux serveurs FastCGI. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy_fcgi]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Permet d'adapter la valeur des variables envoyées aux serveurs FastCGI |
| **Syntaxe** | `ProxyFCGISetEnvIf conditional-expression [!]environment-variable-name [value-expression]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy_fcgi\|mod_proxy_fcgi]] |
| **Compatibilité** | Disponible à partir de la version 2.4.26 du serveur HTTP Apache. |

## Utilisation

Juste avant la transmission d'une requête au serveur FastCGI configuré, le coeur du programme du serveur web définit un certain nombre de variables d'environnement en fonction de certains détails de la requête considérée. Les programmes FastCGI utilisent souvent ces variables comme données en entrée afin de déterminer quels scripts sous-jacents ils vont exécuter, ou quelles données en sortie doivent être produites.

Voici quelques exemples de variables d'environnement importantes :

- SCRIPT\_NAME
- SCRIPT\_FILENAME
- REQUEST\_URI
- PATH\_INFO
- PATH\_TRANSLATED

Cette directive permet de passer outre les variables d'environnement ci-dessus, entre autres. Elle est évaluée après la définition de la valeur initiale de ces variables ; elle peuvent donc être utilisées comme entrées dans les expressions définissants les conditions et les valeurs.

Syntaxe des paramètres :

**conditional-expression**

Définit une condition en fonction de laquelle la variable d'environnement qui suit sera modifiée ou non. Pour la syntaxe de cette expression, reportez-vous aux exemples qui suivent ou à la spécification détaillée dans le document [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|ap_expr]].

**environment-variable-name**

Spécifie le nom de la variable d'environnement à modifier, par exemple PATH\_INFO. Si elle est précédée d'un point d'exclamation, la définition de la variable sera annulée.

**value-expression**

Spécifie la nouvelle valeur de la variable "environment-variable-name". On peut inclure des références arrières, comme "$1", issues de captures en provenance de l'expression rationnelle *conditional-expression*. Si cette valeur est omise, la variable est définie (ou sa valeur est écrasée) par une chaîne vide — voir cependant la note ci-après.

```apache
# Une modification basique, inconditionnelle
ProxyFCGISetEnvIf "true" PATH_INFO "/example"

# Utilisation d'une variable d'environnement pour spécifier la nouvelle valeur
ProxyFCGISetEnvIf "true" PATH_INFO "%{reqenv:SCRIPT_NAME}"

# Utilisation de captures dans la condition et de références arrières dans la
# nouvelle valeur
ProxyFCGISetEnvIf "reqenv('PATH_TRANSLATED') =~ m#(/.*prefix)(\d+)(.*)#" PATH_TRANSLATED "$1$3"
```

> [!NOTE]
> **Note : Annulation définition ou valeur vide**
>
> La ligne suivante annule la définition de la variable `VARIABLE`, ce qui l'empêche d'être envoyée au serveur FastCGI :
>
> ```apache
> ProxyFCGISetEnvIf true !VARIABLE
> ```
>
> La ligne suivante, quant à elle, efface la *valeur* de la variable `VARIABLE` en lui affectant la chaîne vide ; cette variable `VARIABLE` sera alors tout de même envoyée au serveur FastCGI :
>
> ```apache
> ProxyFCGISetEnvIf true VARIABLE
> ```
>
> La spécification CGI/1.1 ne fait pas de distinction ([RFC 3875](https://www.rfc-editor.org/rfc/rfc3875)) entre une variable contenant une chaîne vide et une variable qui n'existe pas. De nombreuses implémentations CGI et FastCGI font cependant cette distinction (ou permettent aux scripts de la faire). Le choix de celle que vous allez utiliser dépend de votre implémentation et de la raison qui vous pousse à modifier cette variable.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
