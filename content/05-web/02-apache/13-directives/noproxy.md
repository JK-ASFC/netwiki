---
title: "NoProxy"
description: "Directive Apache NoProxy (mod_proxy) — Serveurs, domaines ou réseaux auquels on se connectera directement. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Serveurs, domaines ou réseaux auquels on se connectera directement |
| **Syntaxe** | `NoProxy domaine [domaine] ...` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |

## Utilisation

Cette directive n'a d'utilité que pour les serveurs mandataires Apache httpd au sein d'Intranets. La directive `NoProxy` permet de spécifier une liste de sous-réseaux, d'adresses IP, de serveurs et/ou de domaines séparés par des espaces. Une requête pour un serveur qui correspond à un ou plusieurs critères sera toujours servie par ce serveur directement, sans être redirigée vers le(s) serveur(s) mandataire(s) défini(s) par la directive [[13-directives/proxyremote|ProxyRemote]].

**Exemple**

```apache
ProxyRemote  "*"  "http://firewall.example.com:81"
NoProxy         ".example.com" "192.168.112.0/21"
```

Le type des arguments *serveur* de la directive `NoProxy` appartiennent à la liste suivante :

***Domaine***

Un *domaine* est ici un nom de domaine DNS partiellement qualifié précédé d'un point. Il représente une liste de serveurs qui appartiennent logiquement au même domaine ou à la même zonz DNS (en d'autres termes, les nom des serveurs se terminent tous par *domaine*).

**Exemple**

```
.com .example.org.
```

Pour faire la distinction entre *domaine*s et *nom d'hôte*s (des points de vue à la fois syntaxique et sémantique, un domaine DNS pouvant aussi avoir un enregistrement DNS de type A !), les *domaine*s sont toujours spécifiés en les préfixant par un point.

> [!NOTE]
> **Note**
>
> Les comparaisons de noms de domaines s'effectuent sans tenir compte de la casse, et les parties droites des *Domaine*s sont toujours censées correspondre à la racine de l'arborescence DNS, si bien que les domaines `.ExEmple.com` et `.exemple.com.` (notez le point à la fin du nom) sont considérés comme identiques. Comme une comparaison de domaines ne nécessite pas de recherche DNS, elle est beaucoup plus efficace qu'une comparaison de sous-réseaux.

***Sous-réseau***

Un *Sous-réseau* est une adresse internet partiellement qualifiée sous forme numérique (quatre nombres séparés par des points), optionnellement suivie d'un slash et du masque de sous-réseau spécifiant le nombre de bits significatifs dans le *Sous-réseau*. Il représente un sous-réseau de serveurs qui peuvent être atteints depuis la même interface réseau. En l'absence de masque de sous-réseau explicite, il est sous-entendu que les digits manquants (ou caractères 0) de fin spécifient le masque de sous-réseau (Dans ce cas, le masque de sous-réseau ne peut être qu'un multiple de 8). Voici quelques exemples :

**`192.168` ou `192.168.0.0`**

le sous-réseau 192.168.0.0 avec un masque de sous-réseau implicite de 16 bits significatifs (parfois exprimé sous la forme `255.255.0.0`)

**`192.168.112.0/21`**

le sous-réseau `192.168.112.0/21` avec un masque de sous-réseau implicite de 21 bits significatifs (parfois exprimé sous la forme`255.255.248.0`)

Comme cas extrêmes, un *Sous-réseau* avec un masque de sous-réseau de 32 bits significatifs est équivalent à une *adresse IP*, alors qu'un *Sous-réseau* avec un masque de sous-réseau de 0 bit significatif (c'est à dire 0.0.0.0/0) est identique à la constante *\_Default\_*, et peut correspondre à toute adresse IP.

***Adresse IP***

Une *Adresse IP* est une adresse internet pleinement qualifiée sous forme numérique (quatre nombres séparés par des points). En général, cette adresse représente un serveur, mais elle ne doit pas nécessairement correspondre à un nom de domaine DNS.

**Exemple**

```
192.168.123.7
```

> [!NOTE]
> **Note**
>
> Une *Adresse IP* ne nécessite pas de résolution DNS, et peut ainsi s'avérer plus efficace quant aux performances d'Apache.

***Nom de serveur***

Un *Nom de serveur* est un nom de domaine DNS pleinement qualifié qui peut être résolu en une ou plusieurs adresses IP par le service de noms de domaines DNS. Il représente un hôte logique (par opposition aux *Domaine*s, voir ci-dessus), et doit pouvoir être résolu en une ou plusieurs *adresses IP* (ou souvent en une liste d'hôtes avec différentes *adresses IP*).

**Exemples**

```
prep.ai.example.edu
www.example.org
```

> [!NOTE]
> **Note**
>
> Dans de nombreuses situations, il est plus efficace de spécifier une *adresse IP* qu'un *Nom de serveur* car cela évite d'avoir à effectuer une recherche DNS. La résolution de nom dans Apache httpd peut prendre un temps très long lorsque la connexion avec le serveur de noms utilise une liaison PPP lente.
>
> Les comparaisons de *Nom de serveur* s'effectuent sans tenir compte de la casse, et les parties droites des *Noms de serveur* sont toujours censées correspondre à la racine de l'arborescence DNS, si bien que les domaines `WWW.ExEmple.com` et `www.example.com.` (notez le point à la fin du nom) sont considérés comme identiques.

## Voir aussi

- [[11-guides/01-generalites/problemes-lies-au-dns-avec-le-serveur-http-apache|Problèmes liés au DNS]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
