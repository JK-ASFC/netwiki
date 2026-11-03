---
title: "RegexDefaultOptions"
description: "Directive Apache RegexDefaultOptions (core) — Configuration des options globales par défaut pour les expressions rationnelles. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Configuration des options globales par défaut pour les expressions rationnelles |
| **Syntaxe** | `RegexDefaultOptions [none] [+\|-]option [[+\|-]option] ...` |
| **Valeur par défaut** | `RegexDefaultOptions DOTALL DOLLAR_ENDONLY` |
| **Contexte** | configuration du serveur |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Disponible à partir de la version 2.4.30 du serveur HTTP Apache. |

## Utilisation

Cette directive permet d'ajouter certains comportements par défaut à TOUTES les expressions rationnelles utilisées ultérieurement.

Toute option précédée d'un '+' est ajoutée aux options déjà définies.
Toute option précédée d'un '-' est enlevée des options déjà définies.
Toute option non suffixée par '+' ou '-' sera définie et remplacera l'option correspondante éventuellement déjà définie.
Le mot-clé `none` annule toutes les options déjà définies.

*option* peut être :

**`ICASE`**

Utilise une recherche de correspondance insensible à la casse.

**`EXTENDED`**

Le drapeau Perl /x ; ignore les espaces non échappés et les commentaires dans le modèle.

**`DOTALL`**

Le drapeau Perl /s ; '.' correspond aux caractères nouvelle ligne.

**`DOLLAR_ENDONLY`**

'$' n'est actif qu'à la fin de la chaîne de référence.

```apache
# Ajoute l'option ICASE par défaut pour toutes les expressions rationnelles
RegexDefaultOptions +ICASE
...
# Supprime l'option DOLLAR_ENDONLY par défaut et conserve toutes les autres
# options
RegexDefaultOptions -DOLLAR_ENDONLY
...
# Définit l'option DOTALL seule et annule toutes les autres options
RegexDefaultOptions DOTALL
...
# Annule toutes les options définies
RegexDefaultOptions none
...
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
