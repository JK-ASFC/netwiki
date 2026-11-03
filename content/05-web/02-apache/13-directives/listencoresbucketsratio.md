---
title: "ListenCoresBucketsRatio"
description: "Directive Apache ListenCoresBucketsRatio (mpm_common) — Rapport entre le nombre de coeurs de processeur activés et le nombre de segments d'écoute. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mpm_common]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Rapport entre le nombre de coeurs de processeur activés et le nombre de segments d'écoute |
| **Syntaxe** | `ListenCoresBucketsRatio ratio` |
| **Valeur par défaut** | `ListenCoresBucketsRatio 0 (disabled)` |
| **Contexte** | configuration du serveur |
| **Statut** | MPM |
| **Module** | [[12-modules/mpm_common\|mpm_common]] |
| **Compatibilité** | Disponible à partir de la version 2.4.13 du serveur HTTP Apache, avec un noyau supportant l'option de socket `SO_REUSEPORT`, et distribuant uniformément les nouvelles connexions aux sockets d'écoute des processus (ou threads) qui l'utilisent (par exemple Linux versions 3.9 et ultérieures, mais pas l'implémentation courante de `SO_REUSEPORT` par les plateformes de type BSD. |

## Utilisation

Vous pouvez utiliser la directive `ListenCoresBucketsRatio` pour spécifier un *ratio* entre le nombre de coeurs de CPU activés et le nombre de segments d'écoute (listeners' buckets) souhaités ; le serveur HTTP Apache va alors créer`num_cpu_cores / ratio` segments d'écoute, chacun contenant son propre socket d'écoute [[13-directives/listen|Listen]] sur le ou les mêmes ports ; chaque processus enfant sera associé à un seul segment d'écoute (avec une distribution de type round-robin des segments à la création des processus enfants).

> [!NOTE]
> **Définition du terme coeur de CPU activé ("online")**
>
> Sous Linux et BSD, un coeur de CPU peut être activé ou désactivé si [Hotplug](https://www.kernel.org/doc/Documentation/cpu-hotplug.txt) a été configuré ; la directive `ListenCoresBucketsRatio` doit donc tenir compte de ce paramètre pour calculer le nombre de segments d'écoute à créer.

La directive `ListenCoresBucketsRatio` peut améliorer le support de la montée en charge lorsque l'arrivée de nouvelles connexions est/devient un goulot d'étranglement. Le test de cette fonctionnalité avec des machines possédant un nombre de coeurs de CPU important a permit de constater une amélioration des performances significative et des temps de réponse plus courts.

Pour que cette fonctionnalité soit activée, le nombre de coeurs de CPU doit être égal au moins au double du *ratio* spécifié. Si vous spécifiez la valeur recommandée pour *ratio*, à savoir `8`, le nombre minimum de coeurs de processeurs disponibles sera alors de `16`. La valeur optimale de *ratio* permettant d'obtenir des performances maximales doit être calculée pour chaque système cible, en testant plusieurs valeurs et en observant les résultats.

Cette directive influence le calcul des valeurs limites inférieures de [[13-directives/minsparethreads|MinSpareThreads]] et [[13-directives/maxsparethreads|MaxSpareThreads]]. En effet, pour accepter les connexions de manière optimale, le nombre de processus enfants doit être un multiple du nombre de segments d'écoute.

> [!NOTE]
> **Cas où plusieurs `Listen`ers ou serveurs HTTP Apache partagent la même adresse IP et port**
>
> La définition de l'option `SO_REUSEPORT` pour les sockets d'écoute permet à plusieurs processus (partageant le même `EUID`, par exemple `root`) de se rattacher à la même adresse IP et port, sans obtenir l'erreur de rattachement que le système génère habituellement lorsque ce cas se produit.
>
> Cela signifie aussi que plusieurs instances d'Apache httpd configurées avec le même `IP:port` et avec une valeur `ListenCoresBucketsRatio` positive pourraient démarrer sans erreur, et fonctionner ensuite avec une répartition uniforme des connexions entrantes sur ces différentes instances (ce n'est PAS une recommandation et ne constitue pas un usage approprié à tous les cas, mais juste un avertissement sur le fait qu'un véritable problème de rattachement multiple à un `IP:port` pourrait alors être occulté).
>
> Au sein d'une même instance, Apache httpd vérifie la présence de directives `Listen` multiples avec la même adresse IP (ou nom d'hôte) et le même port, et refuse de démarrer si c'est le cas, ce qui permet d'éviter la création de segments d'écoute dupliqués qui seraient du coup inutiles et affecteraient les performances. Cependant, il ne peut pas (et n'essaiera pas de le faire) intercepter tous les cas possibles de recouvrement (comme un nom d'hôte correspondant à une adresse IP utilisée quelque part ailleurs).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
