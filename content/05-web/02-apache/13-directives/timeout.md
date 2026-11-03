---
title: "TimeOut"
description: "Directive Apache TimeOut (core) — Temps pendant lequel le serveur va attendre certains évènements avant de considérer qu'une requête a échoué. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Temps pendant lequel le serveur va attendre certains évènements avant de considérer qu'une requête a échoué |
| **Syntaxe** | `TimeOut secondes` |
| **Valeur par défaut** | `TimeOut 60` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

La directive `TimeOut` permet de définir le temps maximum pendant lequel Apache httpd va attendre des entrées/sorties selon les circonstances :

- Lors de la lecture de données en provenance du client, le temps maximum jusqu'à l'arrivée d'un paquet TCP si le tampon est vide.

  Pour les données initiales d'une nouvelle connexion, et tant qu'une directive [[13-directives/acceptfilter|AcceptFilter]] n'aura pas transmis cette nouvelle connexion au serveur, cette directive n'aura aucun effet.
- Lors de l'écriture de données destinées au client, le temps maximum jusqu'à l'arrivée de l'accusé-réception d'un paquet si le tampon d'envoi est plein.
- Avec [[12-modules/mod_cgi|mod_cgi]] et [[12-modules/mod_cgid|mod_cgid]], le temps d'attente maximum pour un bloc individuel en sortie d'un script CGI.
- Avec [[12-modules/mod_ext_filter|mod_ext_filter]], le temps d'attente maximum des sorties d'un processus de filtrage.
- Avec [[12-modules/mod_proxy|mod_proxy]], la valeur du délai par défaut si [[13-directives/proxytimeout|ProxyTimeout]] n'est pas défini.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
