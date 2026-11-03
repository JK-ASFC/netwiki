---
title: "mod_proxy_fdpass"
description: "Module Apache mod_proxy_fdpass — Module fournissant le support des processus externes fdpass à mod_proxy. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_proxy_fdpass]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Module fournissant le support des processus externes fdpass à mod\_proxy |
| **Statut** | Extension |
| **Identificateur** | `proxy_fdpass_module` |
| **Fichier source** | `mod_proxy_fdpass.c` |
| **Compatibilité** | Disponible pour unix depuis la version 2.3 d'Apache |

## Sommaire

Pour fonctionner, ce module *nécessite* le chargement de [[12-modules/mod_proxy|mod_proxy]]. Il permet le passage de la socket du client vers un autre processus.

`mod_proxy_fdpass` utilise la capacité des sockets de domaine AF\_UNIX à [transmettre un descripteur de fichier ouvert](http://www.freebsd.org/cgi/man.cgi?query=recv) afin de permettre à un autre processus de terminer le traitement de la requête.

Le module possède une interface de fournisseur `proxy_fdpass_flusher` qui permet éventuellement à un autre module d'envoyer les en-têtes de la réponse, ou même le début du corps de la réponse. Le fournisseur par défaut `flush` désactive la persistence, et envoie les en-têtes de la réponse, laissant le soin au processus externe d'envoyer le corps de la réponse.

Pour utiliser un autre fournisseur, vous devez spécifier le paramètre `flusher` de la directive [[13-directives/proxypass|ProxyPass]].

À l'heure actuelle, la seule donnée transmise au processus externe est la socket du client. Pour recevoir une socket client, appelez recvfrom avec une structure [`struct cmsghdr`](http://www.kernel.org/doc/man-pages/online/pages/man3/ cmsg.3.html) allouée. Les versions futures de ce module pourront transmettre d'autres données que le socket client.

## Voir aussi

- [[12-modules/mod_proxy|mod_proxy]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
