---
title: "SSLProxyMachineCertificateFile"
description: "Directive Apache SSLProxyMachineCertificateFile (mod_ssl) — Fichier contenant la concaténation des clés et certificats clients codés en PEM que le mandataire doit utiliser. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fichier contenant la concaténation des clés et certificats clients codés en PEM que le mandataire doit utiliser |
| **Syntaxe** | `SSLProxyMachineCertificateFile chemin-fichier` |
| **Contexte** | configuration du serveur, serveur virtuel, proxy section |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Le contexte d'une section proxy est pris en charge à partir de la version 2.4.30 du serveur HTTP Apache L'inclusion de certificats non-feuilles (CA) est prise en charge à partir de la version 2.4.59. |

## Utilisation

Cette directive permet de définir le fichier tout-en-un où sont stockés les clés et certificats permettant au serveur mandataire de s'authentifier auprès des serveurs distants.

Le fichier spécifié est la simple concaténation des différents fichiers de certificats codés en PEM. Cette directive s'utilise à la place ou en complément de la directive `SSLProxyMachineCertificatePath`. Le fichier spécifié peut contenir un nombre quelconque de paires certificat client/clé privée associée, et chaque paire peut être spécifiée selon l'ordre (certificat, clé) ou (clé, certificat). Des certificats non-feuilles (CA) peuvent aussi être inclus dans le fichier et sont traités comme s'ils avaient été définis à l'aide de la directive [[13-directives/sslproxymachinecertificatechainfile|SSLProxyMachineCertificateChainFile]].

Lorsqu'un serveur distant sollicite le serveur pour obtenir un certificat client, ce dernier doit fournir une liste de *noms d'autorités de certification acceptables* au cours de la négociation. Si cette liste n'est *pas* fournie, [[12-modules/mod_ssl|mod_ssl]] utilisera la première paire certificat/clé client définie. Si par contre cette liste *est* fournie, [[12-modules/mod_ssl|mod_ssl]] va la parcourir afin de trouver un certificat client défini qui a été fourni soit directement par l'autorité de certification considérée, soit indirectement via un nombre quelconque de certificats d'autorités de certification intermédiaires. La chaîne de certificats d'autorités de certification intermédiaires peut être construite à partir de ceux qui sont inclus dans le fichier ou configurés à l'aide de la directive [[13-directives/sslproxymachinecertificatechainfile|SSLProxyMachineCertificateChainFile]]. Le premier certificat défini correspondant sera alors fourni comme réponse au cours de la négociation

Si la liste de noms de CA *est* fournie au serveur distant, et si *aucun* certificat client correspondant n'est trouvé, aucun certificat client ne sera fourni par [[12-modules/mod_ssl|mod_ssl]], ce qui fera probablement échouer la négociation SSL/TLS (en fonction de la configuration du serveur distant).

> [!WARNING]
> Actuellement, les clés privées chiffrées ne sont pas supportées.

> [!WARNING]
> Seules les clés au format PKCS1 RSA, DSA ou EC sont supportées. Les clés au format PKCS8, autrement dit celles commençant par "`-----BEGIN PRIVATE KEY-----`", doivent être converties via une commande du style "`openssl rsa -in private-pkcs8.pem -outform pem`".

**Exemple**

```apache
SSLProxyMachineCertificateFile
"/usr/local/apache2/conf/ssl.crt/proxy.pem"
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
