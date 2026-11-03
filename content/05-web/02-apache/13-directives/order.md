---
title: "Order"
description: "Directive Apache Order (mod_access_compat) — Définit le statut d'accès par défaut et l'ordre dans lequel les directives Allow et Deny sont évaluées. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_access_compat]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le statut d'accès par défaut et l'ordre dans lequel les directives `Allow` et `Deny` sont évaluées. |
| **Syntaxe** | `Order ordre` |
| **Valeur par défaut** | `Order Deny,Allow` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | Limit |
| **Statut** | Deprecated |
| **Module** | [[12-modules/mod_access_compat\|mod_access_compat]] |

## Utilisation

La directive `Order`, associée aux directives [[13-directives/allow|Allow]] et [[13-directives/deny|Deny]], implémente un système de contrôle d'accès en trois passes. Au cours de la première passe, ce sont soit toutes les directives [[13-directives/allow|Allow]], soit toutes les directives [[13-directives/deny|Deny]] qui sont traitées, selon la définition de la directive [[13-directives/order|Order]]. Le reste des directives ([[13-directives/deny|Deny]] ou [[13-directives/allow|Allow]]) est traité au cours de la seconde passe. La troisième passe s'applique à toutes les requêtes qui ne sont concernées par aucune des deux premières passes.

Notez que toutes les directives [[13-directives/allow|Allow]] et [[13-directives/deny|Deny]] sont traitées, à la différence d'un pare-feu classique où seule la première règle qui correspond est utilisée. La dernière directive qui correspond s'applique ( à la différence là encore d'un pare-feu classique). De plus, l'ordre dans lequel les lignes apparaissent dans le fichier de configuration n'a pas d'incidence -- toutes les lignes [[13-directives/allow|Allow]] sont considérées comme un groupe, toutes les lignes [[13-directives/deny|Deny]] comme un autre, et le statut par défaut a son existence propre.

*Ordre* peut être :

**`Allow,Deny`**

Dans un premier temps, toutes les directives [[13-directives/allow|Allow]] sont évaluées ; au moins une d'entre elles doit correspondre, sinon la requête est rejetée. Ensuite, toutes les directives [[13-directives/deny|Deny]] sont évaluées. Si au moins l'une d'entre elles correspond, la requête est rejetée. Enfin, toute requête qui ne correspond à aucune directive [[13-directives/allow|Allow]] ou [[13-directives/deny|Deny]] est rejetée par défaut.

**`Deny,Allow`**

Dans un premier temps, toutes les directives [[13-directives/deny|Deny]] sont évaluées ; Si au moins une d'entre elles correspond, la requête est rejetée, **à moins** qu'elle corresponde aussi à une directive [[13-directives/allow|Allow]]. Toute requête qui ne correspond à aucune directive [[13-directives/allow|Allow]] ou [[13-directives/deny|Deny]] est autorisée.

**`Mutual-failure`**

Cet argument a le même effet que `Allow,Deny` et est devenu de ce fait obsolète.

Les mots-clés ne peuvent être séparés que par des virgules ; *aucun espace* ne doit s'intercaler entre eux.

| Match | Résultat Allow,Deny | Résultat Deny,Allow |
| --- | --- | --- |
| Correspond à Allow seulement | Requête autorisée | Requête autorisée |
| Correspond à Deny seulement | Requête rejetée | Requête rejetée |
| Aucune correspondance | Par défaut la seconde directive : rejet | Par défaut la seconde directive : autorisation |
| Correspond à Allow & Deny | La dernière correspondance l'emporte : rejet | La dernière correspondance l'emporte : autorisation |

Dans cet exemple, tous les hôtes du domaine example.org ont l'autorisation d'accès ; tous les autres voient leur accès refusé.

```apache
Order Deny,Allow
Deny from all
Allow from example.org
```

Dans l'exemple suivant, tous les hôtes du domaine example.org ont l'autorisation d'accès, sauf ceux du sous-domaine foo.example.org qui voient leur accès refusé. Tous les hôtes qui ne sont pas dans le domaine example.org sont rejetés car le statut par défaut est positionné sur [[13-directives/deny|Deny]], et consiste donc en un refus d'accès.

```apache
Order Allow,Deny
Allow from example.org
Deny from foo.example.org
```

Par contre, si la valeur de la directive `Order`, dans l'exemple précédent, est `Deny,Allow`, tout le monde a l'autorisation d'accès. Ceci est dû au fait que `Allow from example.org` sera évalué en dernier, sans tenir compte de l'ordre réel dans lequel les directives apparaissent dans le fichier de configuration, et va l'emporter sur `Deny from foo.example.org`. Tout hôte qui n'est pas dans le domaine `example.org` aura aussi l'autorisation d'accès car le statut par défaut est positionné sur [[13-directives/allow|Allow]] et constitue donc une autorisation d'accès.

La présence d'une directive `Order` peut affecter le contrôle d'accès à une partie du serveur même en l'abscence de directives [[13-directives/allow|Allow]] et [[13-directives/deny|Deny]] associées, à cause de son influence sur le statut par défaut. Par exemple,

```apache
<Directory "/www">
    Order Allow,Deny
</Directory>
```

va interdire tout accès au répertoire `/www` à cause du statut d'accès par défaut qui est défini à [[13-directives/deny|Deny]].

La directive `Order` ne contrôle l'ordre dans lequel sont traitées les directives d'accès qu'au cours de chaque phase du traitement de la configuration du serveur. Ceci implique, par exemple, qu'une directive [[13-directives/allow|Allow]] ou [[13-directives/deny|Deny]] située dans une section [[13-directives/location|<Location>]] sera toujours évaluée après une directive [[13-directives/allow|Allow]] ou [[13-directives/deny|Deny]] située dans une section [[13-directives/directory|<Directory>]] ou un fichier `.htaccess`, sans tenir compte de la définition de la directive `Order`. Pour plus de détails à propos de la fusion des sections de configuration, voir le document [[11-guides/01-generalites/sections-de-configuration|Comment fonctionnent les sections Directory, Location et Files]].

> [!NOTE]
> **Fusion des sections de configuration**
>
> Lorsqu'une directive fournie par ce module est utilisée dans une nouvelle section de configuration, cette dernière n'hérite d'aucune directive définie dans une section précédente.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
