---
title: "mod_sed"
description: "Module Apache mod_sed — Filtre les contenus en entrée (requêtes) et en sortie (réponses) en utilisant la syntaxe de sed. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_sed]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Filtre les contenus en entrée (requêtes) et en sortie (réponses) en utilisant la syntaxe de sed |
| **Statut** | Expérimental |
| **Identificateur** | `sed_module` |
| **Fichier source** | `mod_sed.c sed0.c sed1.c regexp.c regexp.h sed.h` |
| **Compatibilité** | Disponible depuis la version 2.3 d'Apache |

## Sommaire

[[12-modules/mod_sed|mod_sed]] est un filtre de contenu "in-process". Le filtre [[12-modules/mod_sed|mod_sed]] fournit les commandes d'édition de `sed` implémentées par le programme `sed` de Solaris 10 comme décrit dans la [page de manuel](http://www.gnu.org/software/sed/manual/sed.txt). Cependant, à la différence de `sed`, [[12-modules/mod_sed|mod_sed]] ne reçoit pas de données sur son entrée standard. Au lieu de cela, le filtre agit sur les données échangées entre le client et le serveur. [[12-modules/mod_sed|mod_sed]] peut être utilisé comme filtre en entrée ou en sortie. [[12-modules/mod_sed|mod_sed]] est un filtre de contenu, ce qui signifie qu'on ne peut pas l'utiliser pour modifier les en-têtes http du client ou du serveur.

Le filtre en sortie [[12-modules/mod_sed|mod_sed]] accepte un tronçon de données, exécute le script `sed` sur ces données, puis génère une sortie qui est transmise au filtre suivant dans la chaîne.

Le filtre en entrée [[12-modules/mod_sed|mod_sed]] reçoit des données en provenance du filtre suivant dans la chaîne, exécute les scripts `sed`, et renvoie les données générées au filtre appelant dans la chaîne de filtrage.

Les filtres en entrée ou en sortie ne traitent les données que si des caractères newline sont détectés dans le contenu à filtrer. A la fin des données, ce qui reste est traité comme la dernière ligne. A partir de la version 2.4.54 du serveur HTTP Apache, les lignes d'une taille supérieure à 8 Mo provoquent une erreur.

## Exemple de configuration

**Ajout d'un filtre en sortie**

```apache
# Dans l'exemple suivant, le filtre sed va remplacer la chaîne
     # "monday" par "MON" et la chaîne "sunday" par "SUN" dans les
     # documents html avant de les envoyer au client.
<Directory "/var/www/docs/sed">
    AddOutputFilter Sed html
    OutputSed "s/monday/MON/g"
    OutputSed "s/sunday/SUN/g"
</Directory>
```

**Ajout d'un filtre en entrée**

```apache
         # Dans l'exemple suivant, le filtre sed va remplacer la chaîne
     # "monday" par "MON" et la chaîne "sunday" par "SUN" dans les
     # données POST envoyées à PHP.
        <Directory "/var/www/docs/sed">
    AddInputFilter Sed php
    InputSed "s/monday/MON/g"
    InputSed "s/sunday/SUN/g"
</Directory>
```

## Commandes sed

Vous trouverez tous les détails à propos de la commande `sed` dans sa [page de manuel](http://www.gnu.org/software/sed/manual/sed.txt).

**`b`**

Saut vers le label spécifié (similaire à goto).

**`h`**

Copie la ligne courante dans le tampon.

**`H`**

Ajoute la ligne courante au tampon.

**`g`**

Copie le contenu du tampon dans la ligne courante.

**`G`**

Ajoute le contenu du tampon à la ligne courante.

**`x`**

Echange les contenus du tampon et de la ligne courante.

## Directives

- [[13-directives/outputsed|OutputSed]]
- [[13-directives/inputsed|InputSed]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
