---
title: "MDMessageCmd"
description: "Directive Apache MDMessageCmd (mod_md) — Gère les évènements pour les domaines gérés. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Gère les évènements pour les domaines gérés |
| **Syntaxe** | `MDMessageCmd path-to-cmd optional-args` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |

## Utilisation

Cette directive permet de définir la commande à appeler lorsqu'un des évènements "renewed", "installed", "expiring", "errored", "renewing", "challenge-setup:type:domain", "ocsp-renewed" ou "ocsp-errored" se produit pour un domaine géré. La commande sera probablement invoquée pour d'autres évènements dans le futur et ignorera les évènements pour lesquels elle n'aura pas été préparée.

Il s'agit d'une version plus souple de la directive [[13-directives/mdnotifycmd|MDNotifyCmd]].

**Exemple**

```apache
MDMessageCmd /etc/apache/md-message
```

```
# sera invoquée sous la forme "/etc/apache/md-message renewed mydomain.com"
# lorsqu'un nouveau certificat sera disponible pour le domaine mydomain.com
```

Le programme ne doit pas être bloquant car le module attend qu'il se termine. Un code de retour autre que 0 doit indiquer une erreur d'exécution.

"errored" n'est pas l'évènement à surveiller en priorité car le renouvellement du certificat est censé se produire suffisammant tôt pour éviter toute interruption de service. Cet évènement est signalé au plus une fois par heure.

L'évènement "expiring", quant à lui, doit être pris au sérieux. Il se produit lorsque la valeur de [[13-directives/mdwarnwindow|MDWarnWindow]] est atteinte. Par défaut, cette valeur correspond à 10% de la durée de vie du certificat, donc actuellement pour Let's Encrypt, 9 jours avant expiration du certificat. Le message d'avertissement est répété au plus une fois par jour.

'renewed' indique qu'un nouveau certificat a été obtenu et se trouve dans la zone intermédiaire du magasin MD. Il sera activé au prochain restart/reload du serveur.

'installed' indique qu'un nouveau certificat a été transféré depuis la zone intermédiaire vers la zone des domaines du magasin MD. Cet évènement se produit lors d'un restart/reload du serveur. A la différence des autres commandes, `MDMessageCmd` s'exécute avec les permissions de root (sur les systèmes \*nix) et a donc accès aux fichiers de certificats (et aux clés). Les certificats nécessaires à d'autres applications ou possédant des formats différents peuvent être traités suite à cet évènement.

Un évènement de type 'renewing' est déclenché avant le démarrage du processus de renouvellement pour le domaine géré. Si dans ce cas la commande renvoie une valeur non nulle, le renouvellement sera interrompu et tenté à nouveau au cycle suivant. Certaines configurations de clusters l'utilisent pour n'effectuer le renouvellement que sur un seul noeud.

Un évènement de type 'challenge-setup:type:domain' est déclenché lorsque les données de vérification pour un domaine ont été créées. Il est invoqué avant qu'il soit demandé au serveur ACME de les vérifier. type contient une des méthodes de vérification ACME. Il est invoqué pour chaque nom DNS d'un MDomain. Les configurations de clusters peuvent utiliser cet évènement pour distribuer les fichiers de vérification à tous les noeuds.

Un évènement de type "ocsp-errored" est déclenché lorsque le [[13-directives/mdstapling|MDStapling]] est activé pour un domaine, et indique qu'une erreur s'est produite en essayant d'obtenir la réponse OCSP de l'autorité de certification. mod\_md essaiera à nouveau d'obtenir cette réponse.

Un évènement de type "ocsp-renewed" est déclenché lorsqu'une nouvelle réponse OCSP a été obtenu avec succès pour un certificat de domaine. Cet évènement de produit au plus une fois par jour.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
