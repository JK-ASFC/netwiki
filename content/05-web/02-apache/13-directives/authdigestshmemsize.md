---
title: "AuthDigestShmemSize"
description: "Directive Apache AuthDigestShmemSize (mod_auth_digest) — La quantité de mémoire partagée à allouer afin de conserver les informations à propos des clients. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_auth_digest]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | La quantité de mémoire partagée à allouer afin de conserver les informations à propos des clients |
| **Syntaxe** | `AuthDigestShmemSize taille` |
| **Valeur par défaut** | `AuthDigestShmemSize 1000` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_auth_digest\|mod_auth_digest]] |

## Utilisation

La directive `AuthDigestShmemSize` permet de définir la quantité de mémoire partagée à allouer au démarrage du serveur afin de conserver les informations à propos des clients. Notez que le segment de mémoire partagée ne peut pas être défini à une taille inférieure à l'espace nécessaire pour conserver les informations à propos d'*un* client. Cette valeur dépend de votre système. Si vous voulez en déterminer la valeur exacte, vous pouvez simplement définir `AuthDigestShmemSize` à `0` et consulter le message d'erreur que renverra le serveur lorsqu'on essaiera de le démarrer.

L'argument *size* s'exprime par défaut en octets, mais vous pouvez suffixer le nombre par un `K` ou un `M` pour spécifier respectivement des KiloOctets ou des MégaOctets. Par exemple, les directives qui suivent sont toutes équivalentes :

```apache
AuthDigestShmemSize 1048576
AuthDigestShmemSize 1024K
AuthDigestShmemSize 1M
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
