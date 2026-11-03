---
title: "suexec"
description: "Commande suexec d’Apache HTTP Server — suexec - Change d'utilisateur avant l'exécution d'un programme externe : syntaxe, options et exemples."
tags: [apache, commande, suexec]
icon: terminal
---

*suexec - Change d'utilisateur avant l'exécution d'un programme externe*

[[10-commandes/suexec|suexec]] permet au serveur HTTP Apache de changer d'utilisateur avant d'exécuter un programme CGI. Pour ce faire, il doit être exécuté par `root`. A cet effet, comme le démon HTTP ne s'exécute en général pas en tant que `root`, l'exécutable [[10-commandes/suexec|suexec]] doit posséder le bit setuid et avoir comme propriétaire `root`. Seul `root` doit en posséder les droits en écriture.

Pour plus d'informations à propos des concepts et du modèle de sécurité du programme suexec, veuillez vous reporter à sa documentation : [http://httpd.apache.org/docs/2.4/suexec.html](http://httpd.apache.org/docs/2.4/suexec.html).

## Synopsis

`suexec -V`

## Options

**`-V`**

Si vous êtes `root`, cette option permet d'afficher les options de compilation du programme [[10-commandes/suexec|suexec]]. Pour des raisons de sécurité, toutes les options de configuration ne sont modifiables qu'à la compilation.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
