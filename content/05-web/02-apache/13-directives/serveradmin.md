---
title: "ServerAdmin"
description: "Directive Apache ServerAdmin (core) — L'adresse électronique que le serveur inclut dans les messages d'erreur envoyés au client. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | L'adresse électronique que le serveur inclut dans les messages d'erreur envoyés au client |
| **Syntaxe** | `ServerAdmin adresse électronique\|URL` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

La directive `ServerAdmin` permet de définir l'adresse de contact que le serveur va inclure dans tout message d'erreur qu'il envoie au client. Si le programme `httpd` ne reconnait pas l'argument fourni comme une URL, il suppose que c'est une *adresse électronique*, et lui ajoute le préfixe `mailto:` dans les cibles des hyperliens. Il est cependant recommandé d'utiliser exclusivement une adresse électronique, car de nombreux scripts CGI considèrent ceci comme implicite. Si vous utilisez une URL, elle doit pointer vers un autre serveur que vous contrôlez. Dans le cas contraire, les utilisateurs seraient dans l'impossibilité de vous contacter en cas de problème.

Il peut s'avérer utile de définir une adresse dédiée à l'administration du serveur, par exemple :

```apache
ServerAdmin www-admin@foo.example.com
```

car les utilisateurs ne mentionnent pas systématiquement le serveur dont ils parlent !

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
