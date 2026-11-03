---
title: "SSLPassPhraseDialog"
description: "Directive Apache SSLPassPhraseDialog (mod_ssl) — Méthode utilisée pour entrer le mot de passe pour les clés privées chiffrées. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Méthode utilisée pour entrer le mot de passe pour les clés privées chiffrées |
| **Syntaxe** | `SSLPassPhraseDialog type` |
| **Valeur par défaut** | `SSLPassPhraseDialog builtin` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |

## Utilisation

Lors de son démarrage, Apache doit lire les différents fichiers de certificats (voir la directive [[13-directives/sslcertificatefile|SSLCertificateFile]]) et de clés privées (voir la directive [[13-directives/sslcertificatekeyfile|SSLCertificateKeyFile]]) des serveurs virtuels où SSL est activé. Comme, pour des raisons de sécurité, les fichiers de clés privées sont en général chiffrés, mod\_ssl doit demander à l'administrateur un mot de passe pour déchiffrer ces fichiers. L'argument *type* permet de choisir la manière dont cette demande peut être formulée parmi les trois suivantes :

- `builtin`

  C'est la méthode par défaut, et un dialogue interactive de terminal s'ouvre au cours du démarrage juste avant qu'Apache ne se détache du terminal. A ce moment, l'administrateur doit entrer manuellement un mot de passe pour chaque fichier de clé privée chiffré. Etant donné qu'il peut y avoir un grand nombre de serveurs virtuels configurés avec SSL activé, le protocole de réutilisation suivant est utilisé pour minimiser le dialogue : lorsqu'un fichier de clé privée est chiffré, tous les mots de passe connus (au début, il n'y en a aucun, bien entendu) sont essayés. Si l'un de ces mots de passe connus convient, aucun dialogue ne s'ouvrira pour ce fichier de clé privée particulier. Si aucun ne convient, un autre mot de passe sera demandé à partir du terminal et sera mis en mémoire pour le fichier de clé privée suivant (pour lequel il pourra éventuellement être réutilisé).

  Cette méthode confère à mod\_ssl une grande souplesse (car pour N fichiers de clé privée chiffrés, vous *pouvez* utiliser N mots de passe différents - mais vous devrez alors tous les fournir, bien entendu), tout en minimisant le dialogue de terminal (vous pouvez en effet utiliser un seul mot de passe pour les N fichiers de clé privée et vous n'aurez alors à l'entrer qu'une seule fois).
- `|/chemin/vers/programme [arguments...]`

  Ce mode permet d'utiliser un programme externe qui va se présenter comme une redirection vers un périphérique d'entrée particulier ; le texte de prompt standard utilisé pour le mode `builtin` est envoyé au programme sur `stdin`, et celui-ci doit renvoyer des mots de passe sur `stdout`. Si plusieurs mots de passe sont requis (ou si un mot de passe incorrect a été entré), un texte de prompt supplémentaire sera écrit après le retour du premier mot de passe, et d'autres mots de passe devront alors être réécrits.
- `exec:/chemin/vers/programme`

  Ici, un programme externe est appelé au démarrage du serveur pour chaque fichier de clé privée chiffré.Il est appelé avec deux arguments (le premier est de la forme \`\``nom-serveur:port`'', le second est \`\``RSA`'', \`\``DSA`'', \`\``ECC`'' ou un index entier commençant à 3 si plus de 3 clés ont été configurées), qui indiquent pour quels serveur et algorithme il doit écrire le mot de passe correspondant sur `stdout`. Avec les versions 2.4.8 (non réalisée) et 2.4.9, il est appelé avec un seul argument, une chaîne de la forme "`servername:portnumber:index`" (où `index` est un nombre entier commençant à zéro), qui spécifie le serveur, le port TCP et un numéro de certificat. Le but recherché est l'exécution de vérifications de sécurité préalables permettant de s'assurer que le système n'est pas victime d'une attaque, et de ne fournir le mot de passe que si toutes les vérifications ont été effectuées avec succès.

  Ces vérifications de sécurité, ainsi que la manière dont le mot de passe est déterminé peuvent être aussi sophistiqués que vous le désirez. Mod\_ssl ne définit que l'interface : un programme exécutable qui écrit le mot de passe sur `stdout`. Ni plus, ni moins ! Ainsi, si vous êtes vraiment paranoïaque en matière de sécurité, voici votre interface. Tout le reste doit être confié à l'administrateur à titre d'exercice, car les besoins en sécurité locale sont très différents.

  L'algorithme de réutilisation est utilisé ici aussi. En d'autres termes, le programme externe n'est appelé qu'une fois par mot de passe unique.

**Exemple**

```apache
SSLPassPhraseDialog "exec:/usr/local/apache/sbin/pp-filter"
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
