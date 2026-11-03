---
title: "Anonymous"
description: "Directive Apache Anonymous (mod_authn_anon) — Définit la liste des identifiants utilisateur autorisés à accéder sans vérification du mot de passe. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authn_anon]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit la liste des identifiants utilisateur autorisés à accéder sans vérification du mot de passe |
| **Syntaxe** | `Anonymous utilisateur [utilisateur] ...` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authn_anon\|mod_authn_anon]] |

## Utilisation

Une liste d'un ou plusieurs identifiants utilisateur spéciaux autorisés à accéder sans vérification du mot de passe. Les identifiants doivent être séparés par un espace. Pour spécifier un identifiant contenant un espace, on peut utiliser les guillemets ' ou ", ou le caractère d'échappement \\.

Veuillez noter que la vérification **n'est pas sensible à la casse**.
Il est fortement conseillé d'intégrer l'utilisateur spécial '`anonymous`' dans la liste des identifiants.

**Exemple:**

```apache
Anonymous anonymous "Not Registered" "I don't know"
```

Dans cet exemple, l'utilisateur peut accéder au site sans vérification du mot de passe en utilisant l'identifiant "anonymous", "Not Registered", "I Don't Know" ou encore "AnonyMous".

Depuis Apache 2.1, il est possible de remplacer la liste des identifiants autorisés par le caractère "`*`", ce qui permet d'utiliser *n'importe quel* identifiant pour pouvoir accéder au site.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
