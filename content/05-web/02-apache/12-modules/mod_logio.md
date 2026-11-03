---
title: "mod_logio"
description: "Module Apache mod_logio — Journalisation des octets en entrée et en sortie pour chaque requête. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_logio]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Journalisation des octets en entrée et en sortie pour chaque requête |
| **Statut** | Extension |
| **Identificateur** | `logio_module` |
| **Fichier source** | `mod_logio.c` |

## Sommaire

Ce module permet d'enregistrer le nombre d'octets reçus et envoyés pour chaque requête. Ce nombre reflète le nombre réel d'octets transmis sur le réseau, et prend en compte les en-têtes et corps des requêtes et des réponses. Le décompte est effectué avant SSL/TLS en entrée et après SSL/TLS en sortie, si bien que le résultat reflètera toute modification introduite par le chiffrement.

Pour fonctionner, ce module requiert le chargement du module [[12-modules/mod_log_config|mod_log_config]].

> [!NOTE]
> Lorsqu'on utilise les connexions persistantes avec SSL, le supplément de trafic induit par la négociation SSL est enregistré dans le décompte des octets transmis dans le cadre de la première requête de la connexion. Lors d'une renégociation SSL au niveau d'un répertoire, le décompte d'octets est associé à la requête qui a déclenché la renégociation.

## Formats de journaux personnalisés

Ce module introduit trois nouvelles directives de journalisation. Les caractéristiques de la requête en elle-même sont journalisées en insérant des directives "`%`" dans la chaîne de format, qui seront remplacées comme suit dans le fichier journal :

| Chaîne de Format | Description |
| --- | --- |
| `%I` | Octets reçus, en-têtes et corps de requête inclus ; ne peut pas être nul. |
| `%O` | Octets envoyés, en-têtes inclus. Peut être égal à zéro dans de rares cas ; par exemple lorsqu'une requête est interrompue avant l'envoi de la réponse. |
| `%S` | Nombre d'octets transmis (en émission et réception), y compris corps et en-têtes de requête. Ce nombre ne peut pas être nul, et il correspond à la combinaison des formats %I et %O. Disponible depuis la version 2.4.7 du serveur HTTP Apache. |
| `%^FB` | Délai en microsecondes entre l'arrivée de la requête et l'écriture du premier octet des en-têtes de la réponse. Disponible uniquement si la directive `LogIOTrackTTFB` a été définie à ON. Disponible à partir de la version 2.4.13 du serveur HTTP Apache |

En général, cette fonctionnalité s'utilise comme suit :

**Format de journal d'entrées/sorties combiné :**

`"%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-agent}i\" %I %O"`

## Directives

- [[13-directives/logiotrackttfb|LogIOTrackTTFB]]

## Voir aussi

- [[12-modules/mod_log_config|mod_log_config]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
