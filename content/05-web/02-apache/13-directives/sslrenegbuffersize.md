---
title: "SSLRenegBufferSize"
description: "Directive Apache SSLRenegBufferSize (mod_ssl) — Définit la taille du tampon de renégociation SSL. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit la taille du tampon de renégociation SSL |
| **Syntaxe** | `SSLRenegBufferSize taille` |
| **Valeur par défaut** | `SSLRenegBufferSize 131072` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |

## Utilisation

Si une renégociation SSL est requise dans un contexte de répertoire, par exemple avec l'utilisation de [[13-directives/sslverifyclient|SSLVerifyClient]] dans un bloc Directory ou Location, mod\_ssl doit mettre en tampon en mémoire tout corps de requête HTTP en attendant qu'une nouvelle initialisation de connexion SSL puisse être effectuée. Cette directive permet de définir la quantité de mémoire à allouer pour ce tampon.

> [!WARNING]
> Notez que dans de nombreuses configurations, le client qui envoie un corps de requête n'est pas forcément digne de confiance, et l'on doit par conséquent prendre en considération la possibilité d'une attaque de type déni de service lorsqu'on modifie la valeur de cette directive.

**Exemple**

```apache
SSLRenegBufferSize 262144
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
