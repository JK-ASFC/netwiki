---
title: "SSLCADNRequestPath"
description: "Directive Apache SSLCADNRequestPath (mod_ssl) — Répertoire contenant des fichiers de certificats de CA codés en PEM pour la définition de noms de CA acceptables. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Répertoire contenant des fichiers de certificats de CA codés en PEM pour la définition de noms de CA acceptables |
| **Syntaxe** | `SSLCADNRequestPath chemin-répertoire` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |

## Utilisation

Cette directive optionnelle permet de définir la liste de *noms de CAs acceptables* qui sera envoyée au client lorsqu'un certificat de client est demandé. Voir la directive [[13-directives/sslcadnrequestfile|SSLCADNRequestFile]] pour plus de détails.

Les fichiers de ce répertoire doivent être codés en PEM et ils sont accédés via des noms de fichier sous forme de condensés ou hash. Il ne suffit donc pas de placer les fichiers de certificats dans ce répertoire : vous devez aussi créer des liens symboliques nommés *valeur-de-hashage*`.N`, et vous devez toujours vous assurer que ce répertoire contient les liens symboliques appropriés.

**Exemple**

```apache
SSLCADNRequestPath "/usr/local/apache2/conf/ca-names.crt/"
```

Les fichiers de ce répertoire sont lus au démarrage du serveur, alors que ce dernier s'exécute encore en tant que `root` (avant la restriction de ses privilèges) ; il ne doit donc être la propriété que de `root` et lisible uniquement par ce dernier. Le fichier n'est pas relu en fonctionnement normal ; un redémarrage du serveur est requis pour que les changements prennent effet.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
