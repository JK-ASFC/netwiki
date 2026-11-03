---
title: "mod_example_hooks"
description: "Module Apache mod_example_hooks — Illustration de l'API des modules Apache. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_example_hooks]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Illustration de l'API des modules Apache |
| **Statut** | Expérimental |
| **Identificateur** | `example_hooks_module` |
| **Fichier source** | `mod_example_hooks.c` |

## Sommaire

Certains fichiers situés dans le répertoire `modules/examples` de l'arborescence de la distribution d'Apache sont fournis à titre d'exemples pour ceux qui souhaitent écrire des modules qui utilisent l'API d'Apache.

Le fichier principal est `mod_example_hooks.c`, qui constitue une illustration exhaustive des différents mécanismes et syntaxes d'appels. En aucun cas un module additionnel n'aura à inclure des routines pour tous les appels - il n'en nécessitera au contraire qu'un petit nombre !

Le module example\_hooks fonctionne réellement. Si vous le chargez dans votre serveur, activez le gestionnaire "example-hooks-handler" dans une section location, et essayez d'accéder à la zone du site web correspondante, vous verrez s'afficher certaines sorties que le module example\_hooks produit au cours des différents appels.

## Compilation du module example\_hooks

Pour inclure le module example\_hooks dans votre serveur, effectuez les étapes suivantes :

1. Exécutez [[10-commandes/configure|configure]] avec l'option `--enable-example-hooks`.
2. Compilez le serveur (exécutez la commande "`make`").

Pour ajouter votre propre module :

1. `cp modules/examples/mod_example_hooks.c modules/nouveau_module/mod_monexemple.c`
2. Modifiez le fichier.
3. Créez `modules/nouveau_module/config.m4`.

   1. Ajoutez `APACHE_MODPATH_INIT(nouveau_module)`.
   2. Copiez la ligne APACHE\_MODULE contenant "example\_hooks" depuis `modules/examples/config.m4`.
   3. Remplacez le premier argument "example-hooks" par *monexemple*.
   4. Remplacez le second argument par une brève description de votre module. Cette description sera utilisée par la commande `configure --help`.
   5. Si la compilation de votre module nécessite des drapeaux de compilation C, des drapeaux d'édition de liens, ou de bibliothèques supplémentaires, ajoutez les respectivement à CFLAGS, LDFLAGS et LIBS. Reportez-vous aux fichiers `config.m4` des répertoires des autres modules pour plus d'exemples.
   6. Ajoutez `APACHE_MODPATH_FINISH`.
4. Créez le fichier `module/nouveau_module/Makefile.in`. Si la compilation de votre module ne nécessite pas d'instructions particulières, ce fichier ne doit contenir que la ligne `include $(top_srcdir)/build/special.mk`.
5. Exécutez ./buildconf à la racine du répertoire.
6. Compilez le serveur après avoir exécuté la commande configure avec l'option --enable-monexemple.

## Utilisation du module `mod_example_hooks`

Pour activer le module example\_hooks, ajoutez à votre fichier `httpd.conf` un bloc du style :

```apache
<Location "/example-hooks-info">
   SetHandler example-hooks-handler
</Location>
```

Vous pouvez aussi ajouter ce qui suit dans un fichier [[13-directives/accessfilename|.htaccess]], puis accéder au fichier "test.example" à partir du répertoire correspondant :

```apache
AddHandler example-hooks-handler ".example"
```

Après avoir rechargé la configuration ou redémarré votre serveur, vous devriez pouvoir accéder à ce fichier et voir s'afficher ce qui a été décrit plus haut.

## Directives

- [[13-directives/example|Example]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
