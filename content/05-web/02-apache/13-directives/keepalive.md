---
title: "KeepAlive"
description: "Directive Apache KeepAlive (core) — Active les connexions HTTP persistantes. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active les connexions HTTP persistantes |
| **Syntaxe** | `KeepAlive On\|Off` |
| **Valeur par défaut** | `KeepAlive On` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

L'extension Keep-Alive de HTTP/1.0 et l'implémentation des connexions persistantes dans HTTP/1.1 ont rendu possibles des sessions HTTP de longue durée, ce qui permet de transmettre plusieurs requêtes via la même connexion TCP. Dans certains cas, le gain en rapidité pour des documents comportant de nombreuses images peut atteindre 50%. Pour activer les connexions persistantes, définissez `KeepAlive On`.

Pour les clients HTTP/1.0, les connexions persistantes ne seront mises en oeuvre que si elles ont été spécialement demandées par un client. De plus, une connexion persistante avec un client HTTP/1.0 ne peut être utilisée que si la taille du contenu est connue d'avance. Ceci implique que les contenus dynamiques comme les sorties CGI, les pages SSI, et les listings de répertoires générés par le serveur n'utiliseront en général pas les connexions persistantes avec les clients HTTP/1.0. Avec les clients HTTP/1.1, les connexions persistantes sont utilisées par défaut, sauf instructions contraires. Si le client le demande, le transfert par tronçons de taille fixe (chunked encoding) sera utilisé afin de transmettre un contenu de longueur inconnue via une connexion persistante.

Lorsqu'un client utilise une connexion persistante, elle comptera pour une seule requête pour la directive [[13-directives/maxconnectionsperchild|MaxConnectionsPerChild]], quel que soit le nombre de requêtes transmises via cette connexion.

## Voir aussi

- [[13-directives/maxkeepaliverequests|MaxKeepAliveRequests]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
