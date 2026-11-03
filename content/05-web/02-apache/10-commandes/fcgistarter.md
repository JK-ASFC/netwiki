---
title: "fcgistarter"
description: "Commande fcgistarter d’Apache HTTP Server — fcgistarter - Démarrer un programme FastCGI : syntaxe, options et exemples."
tags: [apache, commande, fcgistarter]
icon: terminal
---

*fcgistarter - Démarrer un programme FastCGI*



## Note

Ne fonctionne actuellement que sur les systèmes de type Unix.

## Syntaxe

`fcgistarter -c commande -p port [ -i interface ] -N nombre`

## Options

**`-c commande`**

Le chemin absolu du programme FastCGI

**`-p port`**

Port sur lequel le programme va se mettre en écoute

**`-i interface`**

Interface sur laquelle le programme va se mettre en écoute

**`-N nombre`**

Nombre d'instances du programme

## Voir aussi

- [[12-modules/mod_proxy_fcgi|mod_proxy_fcgi]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
