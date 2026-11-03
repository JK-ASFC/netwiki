---
title: "MDRequireHttps"
description: "Directive Apache MDRequireHttps (mod_md) — Redirige le trafic http: vers https: pour les domaines gérés. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Redirige le trafic http: vers https: pour les domaines gérés. |
| **Syntaxe** | `MDRequireHttps off\|temporary\|permanent` |
| **Valeur par défaut** | `MDRequireHttps off` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |

## Utilisation

Cette directive facilite la migration de vos domaines gérés de http: vers https:. Dans l'exemple suivant,

**Exemple**

```apache
MDRequireHttps temporary
```

vous indiquez que vous désirez que pour l'instant, tout le trafic via des URLs en http: doit être redirigé vers des URLs en https:. Cette directive est sans risque et vous pouvez la désactiver à tout moment.

**Ce qui suit par contre, a des conséquences :**si vous souhaitez que les clients **n'utilisent plus** d'URLs en http:, spécifiez :

**Permanent (pour au moins 6 mois !)**

```apache
MDRequireHttps permanent
```

Cette directive a deux effets :

1. Toutes les requêtes pour une ressource en `http:` sont redirigées vers la même requête en remplaçant le protocole `http:` par `https:` et en renvoyant le code d'état `301`. Ce dernier indique aux clients que cette modification est permanente et qu'ils doivent mettre à jour leurs liens en conséquence.
2. Toutes les réponses aux requêtes en `https:` comporteront l'en-tête `Strict-Transport-Security` avec une durée de vie de six mois. Cela indique au navigateur qu'il ne devra **jamais** utiliser `http:` (pendant six mois) lorsqu'il formulera une requête pour le domaine concerné. Avec cette information, les navigateurs refuseront de contacter votre site en mode non chiffré. Ceci interdit à des middlewares malicieux de dégrader les connexions et d'écouter/manipuler le trafic. C'est une bonne chose, mais cette configuration ne peut pas être désactivée aussi simplement que la configuration temporaire ci-dessus.

Vous pouvez obtenir le même résultat de manière simple avec [[12-modules/mod_alias|mod_alias]] et une configuration basée sur la directive [[13-directives/redirect|Redirect]]. Si vous le faites vous-même, assurez-vous d'exclure les chemins /.well-known/\* de votre redirection, sinon mod\_md aura des difficultés pour signer les nouveaux certificats.

Si vous effectuez cette configuration au niveau global, elle s'appliquera à tous les domaines gérés. Si vous souhaitez qu'elle ne s'applique qu'à un domaine spécifique, utilisez :

**Exemple**

```apache
<MDomain xxx.yyy>
  MDRequireHttps temporary
</MDomain>
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
