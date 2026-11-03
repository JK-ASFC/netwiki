---
title: "htcacheclean"
description: "Commande htcacheclean d’Apache HTTP Server — htcacheclean - Nettoyage du cache sur disque : syntaxe, options et exemples."
tags: [apache, commande, htcacheclean]
icon: terminal
---

*htcacheclean - Nettoyage du cache sur disque*

[[10-commandes/htcacheclean|htcacheclean]] permet de maintenir la taille de l'espace de stockage réservé à `mod_disk_cache` en dessous d'une limite de taille donnée ou d'inodes utilisés. Cet utilitaire peut s'exécuter soit manuellement, soit en mode démon. Lorsqu'il fonctionne en mode démon, il se met en attente en arrière-plan et recherche à intervalles réguliers dans le répertoire du cache les contenus à supprimer. Pour arrêter proprement le démon, vous pouvez lui envoyer un signal TERM ou INT. Lorsqu'il est lancé manuellement, une recherche des contenus du cache qui peuvent être supprimés est effectuée une seule fois. Si une ou plusieurs URLs sont spécifiées, chacune d'entre elles sera supprimée du cache, si elle est présente.

## Syntaxe

`htcacheclean [ -D ] [ -v ] [ -t ] [ -r ] [ -n ] [ -Rarrondi ] -pchemin [ -llimite ] [ -Llimite ]`

`htcacheclean [ -n ] [ -t ] [ -i ] [ -Pfichier-pid ] [ -Rarrondi ] -dintervalle -pchemin [ -llimite ] [ -Llimite ]`

`htcacheclean [ -v ] [ -Rarrondi ] -pchemin [ -a ] [ -A ]`

`htcacheclean [ -D ] [ -v ] [ -t ] [ -Rarrondi ] -pchemin url`

## Options

**`-dintervalle`**

Configure en mode démon et planifie le nettoyage du cache toutes les *intervalle* minutes. Cette option et les options `-D`, `-v` et `-r` s'excluent mutuellement. Pour arrêter le démon proprement, il suffit de lui envoyer un signal `SIGTERM` ou `SIGINT`.

**`-D`**

Le programme s'exécute mais ne supprime aucun contenu ("dry run"). Cette option et l'option `-d` s'excluent mutuellement. Si ce mode est combiné avec la suppression des répertoires avec `-t`, les inodes signalés comme supprimés dans les statistiques ne peuvent pas prendre en compte les répertoires supprimés, et seront marqués en tant qu'estimation.

**`-v`**

Exécution verbeuse et affichage de statistiques. Cette option et l'option `-d` s'excluent mutuellement.

**`-r`**

Nettoyage en profondeur. Le serveur web Apache doit être arrêté (dans le cas contraire, il risque de rester des déchets dans le cache). Cette option implique l'option `-t` et s'exclue mutuellement avec l'option `-d`.

**`-n`**

Exécution en retrait. L'exécution du programme est ralentie en faveur des autres processus. [[10-commandes/htcacheclean|htcacheclean]] s'interrompt de temps en temps de façon à ce que a) les entrées/sorties disque soient retardées et b) que le noyau puisse mettre ce temps processeur à disposition des autres processus.

**`-t`**

Supprime tous les répertoires vides. Par défaut, seuls les fichiers sont supprimés du cache ; avec certaines configurations, cependant, un grand nombre de répertoires sont créés et méritent que l'on y prête attention. Si votre configuration nécessite un grand nombre de répertoires, au point que le remplissage de la table d'inodes ou d'allocation de fichiers puisse poser problème, l'utilisation de cette option est conseillée.

**`-pchemin`**

Définit *chemin* comme répertoire racine du cache sur disque. Cette valeur doit correspondre à celle spécifiée par la directive [[13-directives/cacheroot|CacheRoot]].

**`-Pfichier-pid`**

Permet de spécifier *fichier-pid* comme nom du fichier dans le lequel sera enregistré l'identifiant du processus en mode démon.

**`-Rround`**

Permet de spécifier le plus petit commun multiple de la taille du cache, afin de tenir compte de la taille des blocs. Définir ce paramètre à la taille d'un bloc de la partition du cache.

**`-llimite`**

Définit *limite* comme la taille maximale du cache sur disque. La valeur s'exprime par défaut en octets (ou en ajoutant le suffixe `B` à la valeur). Ajoutez le suffixe `K` pour Ko, `M` pour Mo ou `G` pour Go.

**`-Llimite`**

Spécifie *limite* comme la limite totale en inodes du cache disque. Là aussi, on peut ajouter le suffixe `K` pour Ko, `M` pour Mo ou `G` pour Go.

**`-i`**

Exécution intelligente. Le programme ne s'exécute que lorsque le cache sur disque a été modifié. Cette option ne peut s'utiliser qu'avec l'option `-d`.

**`-a`**

Affiche la liste des URLs actuellement stockées dans le cache. Les variantes de la même URL seront listées une seule fois par variante.

**`-A`**

Affiche la liste des URLs actuellement stockées dans le cache, ainsi que leurs attributs dans l'ordre suivant : url, header size, body size, status, entity version, date, expiry, request time, response time, body present, head request.

## Suppression d'une URL particulière

Si une ou plusieurs URLs sont passées en argument à [[10-commandes/htcacheclean|htcacheclean]], chacune d'entre elles sera supprimée du cache. S'il existe plusieurs variantes de ces URLs, elles seront toutes supprimées.

Lorsqu'une URL mandatée en inverse doit être supprimée, l'URL effective est construite à partir de l'en-tête **Host**, du **port**, du **chemin** et de la **requête**. Notez que le '?' doit toujours être spécifié explicitement dans l'URL, qu'une chaîne de paramètres soit présente ou non. Par exemple, pour supprimer le chemin **/** du serveur **localhost**, l'URL devra être spécifiée comme suit : **http://localhost:80/?**.

## Affichage des URLs présentes dans le cache

Les options `-a` ou `-A` permettent d'afficher les URLs présentes dans le cache telles qu'elles s'y trouvent, une URL par ligne. L'option `-A` affiche l'entrée du cache complète pour chaque URL, avec ses différents champs dans l'ordre suivant :

**url**

L'URL de l'entrée considérée.

**header size**

La taille de l'en-tête en octets.

**body size**

La taille du corps en octets.

**status**

Etat de la réponse en cache.

**entity version**

Le nombre de fois que cette entrée a été revalidée sans être effacée.

**date**

Date de la réponse.

**expiry**

Date d'expiration de la réponse.

**request time**

Date du début de la requête.

**response time**

Date de la fin de la requête.

**body present**

Ce champ contient la valeur 0 si aucun corps n'est stocké avec cette requête, 1 dans le cas contraire.

**head request**

Ce champ contient la valeur 1 si l'entrée comporte une requête HEAD en cache sans corps, 0 dans le cas contraire.

## Valeur renvoyée

[[10-commandes/htcacheclean|htcacheclean]] renvoie zéro ("true") si toutes les opérations se sont déroulées normalement, et `1` dans le cas contraire. Si une URL est spécifiée, et si cette URL était présente dans le cache et a été supprimée avec succès, [[10-commandes/htcacheclean|htcacheclean]] renvoie `0`, et `2` dans le cas contraire. Si une erreur est survenue au cours de la suppression de l'URL, [[10-commandes/htcacheclean|htcacheclean]] renvoie `1`.

## Fichiers

Le répertoire racine du cache est spécifié en tant qu’argument de la ligne de commande et doit correspondre à la directive `CacheRoot` de la configuration globale du serveur.

***chemin***

Le répertoire racine du cache sur disque à nettoyer.

## Voir aussi

- `mod_disk_cache`

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
