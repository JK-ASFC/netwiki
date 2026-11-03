---
title: "EnableMMAP"
description: "Directive Apache EnableMMAP (core) — Utilise la projection en mémoire (Memory-Mapping) pour lire les fichiers pendant qu'ils sont servis. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Utilise la projection en mémoire (Memory-Mapping) pour lire les fichiers pendant qu'ils sont servis |
| **Syntaxe** | `EnableMMAP On\|Off` |
| **Valeur par défaut** | `EnableMMAP On` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Cette directive définit si [[10-commandes/httpd|httpd]] peut utiliser la projection en mémoire (Memory-Mapping) quand il doit lire le contenu d'un fichier pendant qu'il est servi. Par défaut, lorsque le traitement d'une requête requiert l'accès aux données contenues dans un fichier -- par exemple, pour servir un fichier interprété par le serveur à l'aide de [[12-modules/mod_include|mod_include]] -- Apache httpd projette le fichier en mémoire si le système d'exploitation le permet.

Cette projection en mémoire induit parfois une amélioration des performances. Sur certains systèmes cependant, il est préférable de désactiver la projection en mémoire afin d'éviter certains problèmes opérationnels :

- Sur certains systèmes multi-processeurs, la projection en mémoire peut dégrader les performances du programme [[10-commandes/httpd|httpd]].
- S'il fait l'objet d'une projection en mémoire par [[10-commandes/httpd|httpd]], la suppression ou la troncature d'un fichier peut provoquer un crash de [[10-commandes/httpd|httpd]] avec une erreur de segmentation.

Pour les configurations de serveur sujettes à ce genre de problème, il est préférable de désactiver la projection en mémoire des fichiers servis en spécifiant :

```apache
EnableMMAP Off
```

Pour les montages NFS, cette fonctionnalité peut être explicitement désactivée pour les fichiers concernés en spécifiant :

```apache
<Directory "/path-to-nfs-files">
  EnableMMAP Off
</Directory>
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
