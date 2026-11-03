---
title: "mod_ext_filter"
description: "Module Apache mod_ext_filter — Fait traiter le corps de la réponse par un programme externe avant de l'envoyer au client. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_ext_filter]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fait traiter le corps de la réponse par un programme externe avant de l'envoyer au client |
| **Statut** | Extension |
| **Identificateur** | `ext_filter_module` |
| **Fichier source** | `mod_ext_filter.c` |

## Sommaire

[[12-modules/mod_ext_filter|mod_ext_filter]] représente un modèle de programmation simple et bien connu pour les [[11-guides/01-generalites/filtres|filtres]]. Avec ce module, tout programme qui lit l'entrée standard stdin et écrit sur la sortie standard stdout (autrement dit une commande filtre de style Unix) peut servir de filtre pour Apache. Ce mécanisme de filtrage est beaucoup plus lent qu'un filtre spécialement écrit pour l'API d'Apache et faisant partie intégrante du processus du serveur Apache, mais il présente les avantages suivants :

- le modèle de programmation est beaucoup plus simple
- tout langage de script ou de programmation peut être utilisé, pourvu qu'il permette au programme de lire l'entrée standard et d'écrire sur la sortie standard.
- on peut utiliser des programmes existants comme filtres Apache sans modification.

Même dans le cas où le niveau de performance est insuffisant pour une utilisation en production, on peut utiliser [[12-modules/mod_ext_filter|mod_ext_filter]] comme prototype d'environnement pour les filtres.

## Exemples

### Générer du HTML à partir d'un autre type de contenu

```apache
# la directive de mod_ext_filter définissant un filtre
# permettant de mettre des fichiers text/c au format HTML en
# utilisant le programme externe /usr/bin/enscript, le type du
# fichier résultant étant défini à text/html
ExtFilterDefine c-to-html mode=output \
    intype=text/c outtype=text/html \
    cmd="/usr/bin/enscript --color -w html -Ec -o -"

<Directory "/export/home/trawick/apacheinst/htdocs/c">
    # directive de base permettant de traiter la sortie avec le
    # nouveau filtre
    SetOutputFilter c-to-html

    # directive de mod_mime définissant le type des fichiers dont
    # le nom possède l'extension .c à text/c
    AddType text/c .c
</Directory>
```

### Implémentation d'un filtre de codage de contenu

Note : cet exemple avec gzip n'est fourni qu'à titre d'illustration. Veuillez vous reporter à la documentation de [[12-modules/mod_deflate|mod_deflate]] pour un exemple d'implémentation plus pratique.

```apache
# la directive de mod_ext_filter qui définit le filtre externe
ExtFilterDefine gzip mode=output cmd=/bin/gzip

<Location "/gzipped">

    # directive de base permettant de traiter la sortie avec le
  # filtre gzip
    SetOutputFilter gzip

    # la directive de mod_headers permettant d'ajouter le champ
  # d'en-tête "Content-Encoding: gzip"
    Header set Content-Encoding gzip
</Location>
```

### Ralentissement du serveur

```apache
# directive de mod_ext_filter définissant un filtre qui fait
# passer tous les flux en sortie par la commande cat ; cat ne
# modifie rien ; elle ne fait que compliquer le cheminement des
# flux et consommer des ressources supplémentaires
       ExtFilterDefine slowdown mode=output cmd=/bin/cat \
ExtFilterDefine slowdown mode=output cmd=/bin/cat \
    preservescontentlength

<Location "/">
    # directive de base permettant de traiter plusieurs fois la
    # sortie avec le filtre slowdown
    #
    SetOutputFilter slowdown;slowdown;slowdown
</Location>
```

### Utilisation de sed pour remplacer du texte dans la réponse

```apache
# directive de mod_ext_filter définissant un filtre qui
# remplace du texte dans la réponse
#
ExtFilterDefine fixtext mode=output intype=text/html \
    cmd="/bin/sed s/verdana/arial/g"

<Location "/">
    # directive de base permettant de traiter la sortie avec le
    # filtre fixtext
    SetOutputFilter fixtext
</Location>
```

> [!NOTE]
> Vous pouvez aussi utiliser [[12-modules/mod_substitute|mod_substitute]] pour effectuer le même traitement sans avoir à invoquer un programme externe.

### Tracer un autre filtre

```apache
# Trace les données lues et écrites par mod_deflate pour un
# client particulier (IP 192.168.1.31) qui a des problèmes de
# compression.
# Ce premier filtre va tracer ce qui entre dans mod_deflate.
ExtFilterDefine tracebefore \
    cmd="/bin/tracefilter.pl /tmp/tracebefore" \
    EnableEnv=trace_this_client

# Ce second filtre va tracer ce qui sort de mod_deflate.
# Notez que sans le paramètre ftype, le type de filtre par
# défaut AP_FTYPE_RESOURCE placerait le filtre *avant*
# mod_deflate dans la chaîne de filtrage. Le fait d'affecter
# à ce paramètre une valeur numérique sensiblement supérieure à
# AP_FTYPE_CONTENT_SET permet de s'assurer que le filtre sera
# placé après mod_deflate.
ExtFilterDefine traceafter \
    cmd="/bin/tracefilter.pl /tmp/traceafter" \
    EnableEnv=trace_this_client ftype=21

<Directory "/usr/local/docs">
    SetEnvIf Remote_Addr 192.168.1.31 trace_this_client
    SetOutputFilter tracebefore;deflate;traceafter
</Directory>
```

**Voici le filtre qui trace les données :**

```perl
#!/usr/local/bin/perl -w
use strict;

open(SAVE, ">$ARGV[0]")
    or die "can't open $ARGV[0]: $?";

while (<STDIN>) {
    print SAVE $_;
    print $_;
}

close(SAVE);
```

## Directives

- [[13-directives/extfilterdefine|ExtFilterDefine]]
- [[13-directives/extfilteroptions|ExtFilterOptions]]

## Voir aussi

- [[11-guides/01-generalites/filtres|Filtres]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
