---
title: "EnableSendfile"
description: "Directive Apache EnableSendfile (core) — Utilise le support sendfile du noyau pour servir les fichiers aux clients. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Utilise le support sendfile du noyau pour servir les fichiers aux clients |
| **Syntaxe** | `EnableSendfile On\|Off` |
| **Valeur par défaut** | `EnableSendfile Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Par défaut à Off depuis la version 2.3.9. |

## Utilisation

Cette directive définit si le programme [[10-commandes/httpd|httpd]] peut utiliser le support sendfile du noyau pour transmettre le contenu des fichiers aux clients. Par défaut, lorsque le traitement d'une requête ne requiert pas l'accès aux données contenues dans un fichier -- par exemple, pour la transmission d'un fichier statique -- Apache httpd utilise sendfile pour transmettre le contenu du fichier sans même lire ce dernier, si le système d'exploitation le permet.

Ce mécanisme sendfile évite la séparation des opérations de lecture et d'envoi, ainsi que les réservations de tampons. sur certains systèmes cependant, ou sous certains systèmes de fichiers, il est préférable de désactiver cette fonctionnalité afin d'éviter certains problèmes opérationnels :

- Certains systèmes peuvent présenter un support sendfile défectueux que le système de compilation n'a pas détecté, en particulier si les exécutables ont été compilés sur une autre machine, puis copiés sur la première avec un support sendfile défectueux.
- Sous Linux, l'utilisation de sendfile induit des bogues lors de la récupération des paquets de vérification TCP (TCP-checksum) avec certaines cartes réseau lorsqu'on utilise IPv6.
- Sous Linux sur Itanium, `sendfile` peut s'avérer incapable de traiter les fichiers de plus de 2 Go.
- Avec un montage réseau de [[13-directives/documentroot|DocumentRoot]] (par exemple NFS, SMB, CIFS, FUSE), le noyau peut s'avérer incapable de servir un fichier de ce montage réseau en passant par son propre cache.

Pour les configurations de serveur non sujettes à ce genre de problème, vous pouvez activer cette fonctionnalité en spécifiant :

```apache
EnableSendfile On
```

Pour les montages réseau, cette fonctionnalité peut être explicitement désactivée pour les fichiers concernés en spécifiant :

```apache
<Directory "/path-to-nfs-files">
  EnableSendfile Off
</Directory>
```

Veuillez noter que la configuration de la directive `EnableSendfile` dans un contexte de répertoire ou de fichier .htaccess n'est pas supportée par [[12-modules/mod_cache_disk|mod_cache_disk]]. Le module ne prend en compte la définition de `EnableSendfile` que dans un contexte global.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
