---
title: "mod_proxy_hcheck"
description: "Module Apache mod_proxy_hcheck — Check up dynamique des membres du groupe de répartition de charge (équipiers) pour mod_proxy. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_proxy_hcheck]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Check up dynamique des membres du groupe de répartition de charge (équipiers) pour mod\_proxy |
| **Statut** | Extension |
| **Identificateur** | `proxy_hcheck_module` |
| **Fichier source** | `mod_proxy_hcheck.c` |
| **Compatibilité** | Disponible à partir de la version 2.4.21 du serveur HTTP Apache |

## Sommaire

Ce module permet d'effectuer un check up dynamique des membres du groupe de répartition de charge (équipiers). Ce check up peut être activé pour un ou plusieurs équipiers et il est indépendant des requêtes de mandataire inverse proprement dites.

Pour fonctionner, ce module *nécessite* le chargement préalable de [[12-modules/mod_watchdog|mod_watchdog]].

> [!NOTE]
> **Paramètres**
>
> Le mécanisme de check up est activé via l'utilisation de paramètres supplémentaires de la directive [[13-directives/balancermember|BalancerMember]] configurés de manière standard via la directive [[13-directives/proxypass|ProxyPass]] :
>
> Ce module définit un nouveau drapeau d'état [[12-modules/mod_proxy|status]] pour BalancerMember : "`C`". Lorsque l'équipier est mis hors service suite à un disfonctionnement déterminé par le module de check up, ce drapeau est activé et peut être lu (et modifié) via le `balancer-manager`.
>
> | Paramètre | Défaut | Description |
> | --- | --- | --- |
> | hcmethod | None | Aucun check up dynamique n'est effectué. Les choix possibles sont :  \| Method \| Description \| Note \| \| --- \| --- \| --- \| \| None \| Aucun check up dynamique effectué \| \| \| TCP \| Vérifie qu'un socket vers le serveur d'arrière-plan peut être créé ; par exemple "es-tu en état de fonctionner" \| \| \| OPTIONS \| Envoie une requête `HTTP OPTIONS` au serveur d'arrière-plan via `HTTP/1.0` \| \* \| \| HEAD \| Envoie une requête `HTTP HEAD` au serveur d'arrière-plan via `HTTP/1.0` \| \* \| \| GET \| Envoie une requête `HTTP GET` au serveur d'arrière-plan via `HTTP/1.0` \| \* \| \| OPTIONS11 \| Envoie une requête `HTTP OPTIONS` au serveur d'arrière-plan via `HTTP/1.1` \| \* \| \| HEAD11 \| Envoie une requête `HTTP HEAD` au serveur d'arrière-plan via `HTTP/1.1` \| \* \| \| GET11 \| Envoie une requête `HTTP GET` au serveur d'arrière-plan via `HTTP/1.1` \| \* \| \| \| \| \| \| \*: si hcexpr n'est pas utilisé, un retour HTTP 2xx ou 3xx sera interprété comme un passage avec succès du check up. \| \| \| |
> | Method | Description | Note |
> | None | Aucun check up dynamique effectué |   |
> | TCP | Vérifie qu'un socket vers le serveur d'arrière-plan peut être créé ; par exemple "es-tu en état de fonctionner" |   |
> | OPTIONS | Envoie une requête `HTTP OPTIONS` au serveur d'arrière-plan via `HTTP/1.0` | \* |
> | HEAD | Envoie une requête `HTTP HEAD` au serveur d'arrière-plan via `HTTP/1.0` | \* |
> | GET | Envoie une requête `HTTP GET` au serveur d'arrière-plan via `HTTP/1.0` | \* |
> | OPTIONS11 | Envoie une requête `HTTP OPTIONS` au serveur d'arrière-plan via `HTTP/1.1` | \* |
> | HEAD11 | Envoie une requête `HTTP HEAD` au serveur d'arrière-plan via `HTTP/1.1` | \* |
> | GET11 | Envoie une requête `HTTP GET` au serveur d'arrière-plan via `HTTP/1.1` | \* |
> |   |   |   |
> | \*: si hcexpr n'est pas utilisé, un retour HTTP 2xx ou 3xx sera interprété comme un passage avec succès du check up. |   |   |
> | hcpasses | 1 | Nombre de check up à passer avec succès avant de remettre en service l'équipier |
> | hcfails | 1 | Nombre de check up échoués avant mettre hors service l'équipier |
> | hcinterval | 30 | Intervalle entre deux check up en secondes (par défaut effectué toutes les 30 secondes) |
> | hcuri |   | URI supplémentaire à ajouter à l'URL de l'équipier pour le check up. |
> | hctemplate |   | Nom du modèle créé via [[13-directives/proxyhctemplate\|ProxyHCTemplate]] à utiliser pour définir les paramètres de check up de cet équipier |
> | hcexpr |   | Nom de l'expression créée via [[13-directives/proxyhcexpr\|ProxyHCExpr]] utilisée pour analyser les en-têtes de la réponse du check up. *Si ce paramètre est absent, un état HTTP de 2xx à 3xx est interprété comme un check up réussi.* |

> [!NOTE]
> **Compatibilité :**
>
> `OPTIONS11`, `HEAD11` et `GET11` sont disponibles à partir de la version 2.4.55 du serveur HTTP Apache.

## Exemples d'utilisation

L'exemple suivant montre comment configurer le check up pour différents serveurs d'arrière-plan :

```apache
ProxyHCExpr ok234 {%{REQUEST_STATUS} =~ /^[234]/}
ProxyHCExpr gdown {%{REQUEST_STATUS} =~ /^[5]/}
ProxyHCExpr in_maint {hc('body') !~ /Under maintenance/}

<Proxy balancer://foo>
  BalancerMember http://www.example.com/  hcmethod=GET hcexpr=in_maint hcuri=/status.php
  BalancerMember http://www2.example.com/ hcmethod=HEAD hcexpr=ok234 hcinterval=10
  BalancerMember http://www3.example.com/ hcmethod=TCP hcinterval=5 hcpasses=2 hcfails=3
  BalancerMember http://www4.example.com/
</Proxy>

ProxyPass "/" "balancer://foo"
ProxyPassReverse "/" "balancer://foo"
```

Dans ce scénario, on teste l'équipier `http://www.example.com/` en lui envoyant une requête `GET /status.php` et en regardant si la réponse contient la chaîne *Under maintenance*. Si c'est le cas, le check up est considéré comme ayant échoué et l'équipier est mis hors service. Ce check up dynamique est effectué toutes les 30 secondes, ce qui correspond à la valeur par défaut.

On teste l'équipier `http://www2.example.com/` en lui envoyant simplement une requête `HEAD` toutes les 10 secondes et en vérifiant que la réponse HTTP est bien un code d'état de 2xx, 3xx ou 4xx. On teste l'équipier `http://www3.example.com/` en vérifiant simplement toutes les 5 secondes que le socket vers ce serveur est bien opérationnel. Si ce serveur est marqué "hors service", il lui faudra 2 check up réussis pour être réactivé et participer à nouveau à la répartition de charge. Si à ce moment-là il échoue à 3 check up successifs, il sera à nouveau mis hors service. Enfin, l'équipier `http://www4.example.com/` ne fait l'objet d'aucun check up.

## Directives

- [[13-directives/proxyhcexpr|ProxyHCExpr]]
- [[13-directives/proxyhctemplate|ProxyHCTemplate]]
- [[13-directives/proxyhctpsize|ProxyHCTPsize]]

## Voir aussi

- [[12-modules/mod_proxy|mod_proxy]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
