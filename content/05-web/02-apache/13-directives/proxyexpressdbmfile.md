---
title: "ProxyExpressDBMFile"
description: "Directive Apache ProxyExpressDBMFile (mod_proxy_express) — Chemin du fichier DBM. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy_express]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Chemin du fichier DBM. |
| **Syntaxe** | `ProxyExpressDBMFile pathname` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy_express\|mod_proxy_express]] |

## Utilisation

La directive `ProxyExpressDBMFile` permet de définir le chemin du fichier DBM de correspondance Express. Ce fichier permet de faire correspondre le nom de serveur extrait de l'en-tête `Host:` de la requête entrante avec une URL d'arrière-plan.

> [!NOTE]
> **Note**
>
> Ce fichier est élaboré à partir d'un fichier texte à l'aide de l'utilitaire `httxt2dbm`.
>
> **Fichier de correspondances ProxyExpress**
>
> ```
> ##
> ##express-map.txt:
> ##
>
> www1.example.com   http://192.168.211.2:8080
> www2.example.com   http://192.168.211.12:8088
> www3.example.com   http://192.168.212.10
> ```
>
> **Création du fichier DBM**
>
> ```
> httxt2dbm -i express-map.txt -o emap
> ```
>
> **Configuration**
>
> ```apache
> ProxyExpressEnable on
> ProxyExpressDBMFile emap
> ```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
