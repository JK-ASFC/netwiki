---
title: "Satisfy"
description: "Directive Apache Satisfy (mod_access_compat) — Interaction entre le contrôle d'accès en fonction de l'hôte et l'authentification utilisateur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_access_compat]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Interaction entre le contrôle d'accès en fonction de l'hôte et l'authentification utilisateur |
| **Syntaxe** | `Satisfy Any\|All` |
| **Valeur par défaut** | `Satisfy All` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Deprecated |
| **Module** | [[12-modules/mod_access_compat\|mod_access_compat]] |
| **Compatibilité** | Affecté par [[13-directives/limit\|<Limit>]] et [[13-directives/limitexcept\|<LimitExcept>]] à partir de la version 2.0.51 |

## Utilisation

Politique d'accès dans le cas où on utilise à la fois [[13-directives/allow|Allow]] et [[13-directives/require|Require]]. L'argument est soit `All`, soit `Any`. L'utilisation de cette directive n'a de sens que si l'accès à une zone particulière du serveur est restreinte par utilisateur/mot de passe et en fonction de l'adresse IP de l'hôte client. Dans ce cas, par défaut (`All`), le client doit satisfaire à la restriction d'adresse, *et* fournir un couple utilisateur/mot de passe valide. Avec l'argument `Any`, le client se verra accorder l'accès s'il satisfait à la restriction d'adresse ou fournit un couple utilisateur/mot de passe valide. On peut utiliser cette dernière définition pour restreindre l'accès à une zone par mot de passe, mais accorder l'accès aux clients possédant certaines adresses IP sans qu'ils aient à fournir de mot de passe.

Par exemple, si vous souhaitez que les utilisateurs de votre réseau accèdent à une zone de votre site web sans restriction, mais que l'accès à cette zone nécessite un mot de passe pour les autres utilisateurs, vous pouvez utiliser une configuration du style :

```apache
Require valid-user
Allow from 192.168.1
Satisfy Any
```

Une autre utilisation fréquente de la directive `Satisfy` est l'allègement des restrictions d'accès à un sous-répertoire par rapport aux restrictions d'accès au répertoire parent :

```apache
<Directory "/var/www/private">
    Require valid-user
</Directory>

<Directory "/var/www/private/public">
    Allow from all
    Satisfy Any
</Directory>
```

Dans l'exemple ci-dessus, l'accès au répertoire `/var/www/private` nécessitera une authentification, alors que l'accès au répertoire `/var/www/private/public` sera accordé sans restriction.

Depuis la version 2.0.51, les directives `Satisfy` peuvent être restreintes à certaines méthodes particulières à l'aide des sections [[13-directives/limit|<Limit>]] et [[13-directives/limitexcept|<LimitExcept>]].

> [!NOTE]
> **Fusion des sections de configuration**
>
> Lorsqu'une directive fournie par ce module est utilisée dans une nouvelle section de configuration, cette dernière n'hérite d'aucune directive définie dans une section précédente.

## Voir aussi

- [[13-directives/allow|Allow]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
