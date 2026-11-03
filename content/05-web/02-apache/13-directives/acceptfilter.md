---
title: "AcceptFilter"
description: "Directive Apache AcceptFilter (core) — Permet d'optimiser la configuration d'une socket pour l'écoute d'un protocole. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Permet d'optimiser la configuration d'une socket pour l'écoute d'un protocole |
| **Syntaxe** | `AcceptFilter protocole filtre d'acceptation` |
| **Contexte** | configuration du serveur |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Cette directive permet d'effectuer une optimisation de la socket d'écoute d'un type de protocole en fonction du système d'exploitation. Le but premier est de faire en sorte que le noyau n'envoie pas de socket au processus du serveur jusqu'à ce que des données soient reçues, ou qu'une requête HTTP complète soit mise en tampon. Seuls les [Filtres d'acceptation de FreeBSD](http://www.freebsd.org/cgi/man.cgi?query=accept_filter& sektion=9), le filtre plus primitif `TCP_DEFER_ACCEPT` sous Linux, et la version optimisée d'AcceptEx() de Windows sont actuellement supportés.

L'utilisation de l'argument `none` va désactiver tout filtre d'acceptation pour ce protocole. Ceci s'avère utile pour les protocoles qui nécessitent l'envoi de données par le serveur en premier, comme `ftp:` ou `nntp`:

```apache
AcceptFilter nntp none
```

Les noms de protocoles par défaut sont `https` pour le port 443 et `http` pour tous les autres ports. Pour spécifier un autre protocole à utiliser avec un port en écoute, ajoutez l'argument *protocol* à la directive [[13-directives/listen|Listen]].

Sous FreeBSD, les valeurs par défaut sont :

```apache
AcceptFilter http httpready
AcceptFilter https dataready
```

Le filtre d'acceptation `httpready` met en tampon des requêtes HTTP entières au niveau du noyau. Quand une requête entière a été reçue, le noyau l'envoie au serveur. Voir la page de manuel de [accf\_http(9)](http://www.freebsd.org/cgi/man.cgi?query=accf_http& sektion=9) pour plus de détails. Comme les requêtes HTTPS sont chiffrées, celles-ci n'autorisent que le filtre [accf\_data(9)](http://www.freebsd.org/cgi/man.cgi?query=accf_data& sektion=9).

Sous Linux, les valeurs par défaut sont :

```apache
AcceptFilter http data
AcceptFilter https data
```

Le filtre `TCP_DEFER_ACCEPT` de Linux ne supporte pas la mise en tampon des requêtes http. Toute valeur autre que `none` active le filtre `TCP_DEFER_ACCEPT` pour ce protocole. Pour plus de détails, voir la page de manuel Linux de [tcp(7)](http://man7.org/linux/man-pages/man7/tcp.7.html).

Sous Windows, les valeurs par défaut sont :

```apache
AcceptFilter http connect
AcceptFilter https connect
```

Le module MPM pour Windows mpm\_winnt utilise la directive AcceptFilter comme commutateur de l'API AcceptEx(), et ne supporte pas la mise en tampon du protocole http. `connect` utilise l'API AcceptEx(), extrait aussi les adresses réseau finales, mais à l'instar de `none`, la valeur `connect` n'attend pas la transmission des données initiales.

Sous Windows, `none` utilise accept() au lieu d'AcceptEx(), et ne recycle pas les sockets entre les connexions. Ceci s'avère utile pour les interfaces réseau dont le pilote est défectueux, ainsi que pour certains fournisseurs de réseau comme les pilotes vpn, ou les filtres anti-spam, anti-virus ou anti-spyware.

> [!WARNING]
> **L'AcceptFilter `data` (Windows)**
>
> Jusqu'à la version 2.4.23, le filtre d'acceptation `data` attendait que des données aient été transmises et que le tampon de données initial et l'adresse réseau finale aient été déterminés par l'invocation AcceptEx(). Cette implémentation étant vulnérable à une attaque de type denial of service, elle a été désactivée.
>
> La version actuelle de httpd prend par défaut le filtre `connect` sous Windows, et reprendra la valeur `data` si `data` est spécifié. Il est fortement conseillé aux utilisateurs des versions plus anciennes de définir explicitement le filtre `connect` pour leurs AcceptFilter comme indiqué plus haut.

## Voir aussi

- [[13-directives/protocol|Protocol]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
