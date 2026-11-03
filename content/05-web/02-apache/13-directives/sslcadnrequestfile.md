---
title: "SSLCADNRequestFile"
description: "Directive Apache SSLCADNRequestFile (mod_ssl) — Fichier contenant la concaténation des certificats de CA codés en PEM pour la définition de noms de CA acceptables. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fichier contenant la concaténation des certificats de CA codés en PEM pour la définition de noms de CA acceptables |
| **Syntaxe** | `SSLCADNRequestFile file-path` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |

## Utilisation

Lorsque mod\_ssl demande un certificat client, une liste de *noms d'Autorités de Certification acceptables* est envoyée au client au cours de la phase d'initialisation de la connexion SSL. Le client peut alors utiliser cette liste de noms de CA pour sélectionner un certificat client approprié parmi ceux dont il dispose.

Si aucune des directives [[13-directives/sslcadnrequestpath|SSLCADNRequestPath]] ou [[13-directives/sslcadnrequestfile|SSLCADNRequestFile]] n'est définie, la liste de noms de CsA acceptables envoyée au client est la liste des noms de tous les certificats de CA spécifiés par les directives [[13-directives/sslcacertificatefile|SSLCACertificateFile]] et [[13-directives/sslcacertificatepath|SSLCACertificatePath]] ; en d'autres termes, c'est la liste des noms de CAs qui sera effectivement utilisée pour vérifier le certificat du client.

Dans certaines situations, il est utile de pouvoir envoyer une liste de noms de CA acceptables qui diffère de la liste des CAs effectivement utilisés pour vérifier le certificat du client ; considérons par exemple le cas où le certificat du client est signé par des CAs intermédiaires. On peut ici utiliser les directives [[13-directives/sslcadnrequestpath|SSLCADNRequestPath]] et/ou [[13-directives/sslcadnrequestfile|SSLCADNRequestFile]], et les noms de CA acceptables seront alors extraits de l'ensemble des certificats contenus dans le répertoire et/ou le fichier définis par cette paire de directives.

[[13-directives/sslcadnrequestfile|SSLCADNRequestFile]] doit spécifier un fichier *tout-en-un* contenant une concaténation des certificats de CA codés en PEM.

**Exemple**

```apache
SSLCADNRequestFile "/usr/local/apache2/conf/ca-names.crt"
```

Ce fichier est lu au démarrage du serveur, alors que ce dernier s'exécute encore en tant que `root` (avant la restriction de ses privilèges) ; il ne doit donc être la propriété que de `root` et lisible uniquement par ce dernier. Le fichier n'est pas relu en fonctionnement normal ; un redémarrage du serveur est requis pour que les changements prennent effet.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
