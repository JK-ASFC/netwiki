---
title: "<Proxy>"
description: "Directive Apache <Proxy> (mod_proxy) — Conteneur de directives s'appliquant à des ressources mandatées. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Conteneur de directives s'appliquant à des ressources mandatées |
| **Syntaxe** | `<Proxy url-avec-jokers> ...</Proxy>` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |

## Utilisation

Les directives situées dans une section `<Proxy>` ne s'appliquent qu'au contenu mandaté concerné en utilisant une recherche de correspondance simple entre le préfixe de type chaîne et l’URL. Les jokers de style shell sont autorisés.

Par exemple, les lignes suivantes n'autoriseront à accéder à un contenu via votre serveur mandataire que les hôtes appartenant à `votre-reseau.example.com` :

```apache
<Proxy "*">
  Require host votre-reseau.example.com
</Proxy>
```

Dans l'exemple suivant, tous les fichiers du répertoire `foo` de `example.com` seront traités par le filtre `INCLUDES` lorsqu'ils seront envoyés par l'intermédiaire du serveur mandataire :

```apache
<Proxy "http://example.com/foo/*">
  SetOutputFilter INCLUDES
</Proxy>
```

> [!WARNING]
> **Avertissement**
>
> Cette section de configuration ne rend canonique aucune partie de la chaîne comparée, comme les protocoles, les noms d’hôte, les adresses IP, etc. Il faut être très prudent si on l’utilise pour le contrôle d’accès en ne se limitant pas à interdire l’accès par défaut et en autorisant certains noms d’hôte donnés plutôt que l’inverse, où une interdiction pourrait être court-circuitée en utilisant des formes alternatives.

> [!NOTE]
> **Différences avec la section de configuration Location**
>
> Une URL d'arrière-plan sera concernée par le conteneur Proxy si elle commence par la *url-avec-jokers*, même si le dernier segment de chemin de la directive ne correspond qu'à un préfixe de segment dee chemin de l'URL d'arrière-plan. Par exemple, \<Proxy "http://example.com/foo"\> correspondra entre autres aux URLs http://example.com/foo, http://example.com/foo/bar, et http://example.com/foobar. La correspondance de l'URL finale diffère du comportement de la section [[13-directives/location|<Location>]] qui, pour le cas de cette note, traitera le segment de chemin final comme s'il se terminait par un slash.
>
> Pour un contrôle plus fin de la correspondance des URL, voir la directive `<ProxyMatch>`.

## Voir aussi

- [[13-directives/proxymatch|<ProxyMatch>]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
