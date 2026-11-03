---
title: "H2Push"
description: "Directive Apache H2Push (mod_http2) — Activation/désactivation du server push H2. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Activation/désactivation du server push H2 |
| **Syntaxe** | `H2Push on\|off` |
| **Valeur par défaut** | `H2Push on` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |
| **Compatibilité** | Disponible à partir de la version 2.4.18 du serveur HTTP Apache. |

## Utilisation

Cette directive permet d'activer/désactiver l'utilisation de la fonctionnalité server push du protocole HTTP/2.

Lorsqu'un client demande une ressource particulière, le protocole HTTP/2 permet au serveur de lui fournir des ressources supplémentaires. Ceci s'avère utile lorsque ces ressources sont reliées entre elles, ce qui peut laisser supposer que le client va probablement les demander dans un délai plus ou moins long. Le mécanisme de pushing permet alors au client d'économiser le temps qu'il lui aurait fallu pour demander ces ressources supplémentaires lui-même. Par contre, fournir au client des ressources dont il n'a pas besoin ou qu'il possède déjà constitue une perte de bande passante.

Les server pushes sont détectés en inspectant les en-têtes `Link` des réponses (voir [RFC 8288](https://www.rfc-editor.org/rfc/rfc8288) pour la spécification des liens du web). Lorsqu'un lien spécifié de cette manière possède l'attribut `rel=preload`, il est considéré comme devant faire l'objet d'un push.

Les en-têtes link des réponses sont soit définis par l'application, soit configurés via [[13-directives/h2pushresource|H2PushResource]] ou [[12-modules/mod_headers|mod_headers]] comme suit :

**Exemple de configuration d'en-tête link via mod\_headers**

```apache
<Location /index.html>
    Header add Link "</css/site.css>;rel=preload"
    Header add Link "</images/logo.jpg>;rel=preload"
</Location>
```

Comme le montre l'exemple, il est possible d'ajouter autant d'en-têtes link que l'on souhaite à une réponse, ce qui déclenchera autant de pushes. Cette fonctionnalité doit donc être utilisée avec prudence car le module ne vérifie pas si une ressource n'a pas déjà été "pushée" vers un client.

Les PUSH HTTP/2 sont activés par défaut. Vous pouvez activer/désactiver cette fonctionnalité pour toute connexion au serveur au niveau global ou serveur virtuel. Vous pouvez en outre désactiver PUSH pour un jeu de ressources dans une section Directory/Location. Notez que ceci permet de contrôler quelles ressources peuvent déclencher un PUSH, mais pas les ressources qui peuvent être envoyées via PUSH.

**Exemple**

```apache
H2Push off
```

Enfin, il est important de savoir que les pushes ne se produisent que si le client en manifeste le désir ; la plupart des navigateurs le font, mais certains, comme Safari 9, ne le font pas. En outre, les pushes ne se produisent que pour les ressources de la même *autorité* que celle de la réponse originale.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
