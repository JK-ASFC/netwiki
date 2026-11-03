---
title: "<VirtualHost>"
description: "Directive Apache <VirtualHost> (core) — Contient des directives qui ne s'appliquent qu'à un nom d'hôte spécifique ou à une adresse IP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Contient des directives qui ne s'appliquent qu'à un nom d'hôte spécifique ou à une adresse IP |
| **Syntaxe** | `<VirtualHost adresse IP[:port] [adresse IP[:port]] ...> ... </VirtualHost>` |
| **Contexte** | configuration du serveur |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Les balises `<VirtualHost>` et `</VirtualHost>` permettent de rassembler un groupe de directives qui ne s'appliquent qu'à un serveur virtuel particulier. Toute directive autorisée dans un contexte de serveur virtuel peut être utilisée. Lorsque le serveur reçoit un requête pour un document hébergé par un serveur virtuel particulier, il applique les directives de configuration rassemblées dans la section `<VirtualHost>`. *adresse IP* peut être une des entités suivantes, éventuellement suivies d'un caractère ':' et d'un numéro de port (ou \*) :

- L'adresse IP du serveur virtuel ;
- Un nom de domaine entièrement qualifié correspondant à l'adresse IP du serveur virtuel (non recommandé) ;
- Le caractère `*`, qui agit comme un caractère générique, et correspond à toute adresse IP.
- La chaîne `_default_`, dont la signification est identique à celle du caractère `*`

```apache
<VirtualHost 10.1.2.3:80>
  ServerAdmin webmaster@host.example.com
  DocumentRoot "/www/docs/host.example.com"
  ServerName host.example.com
  ErrorLog "logs/host.example.com-error_log"
  TransferLog "logs/host.example.com-access_log"
</VirtualHost>
```

Les adresses IPv6 doivent être entourées de crochets car dans le cas contraire, un éventuel port optionnel ne pourrait pas être déterminé. Voici un exemple de serveur virtuel avec adresse IPv6 :

```apache
<VirtualHost [2001:db8::a00:20ff:fea7:ccea]:80>
  ServerAdmin webmaster@host.example.com
  DocumentRoot "/www/docs/host.example.com"
  ServerName host.example.com
  ErrorLog "logs/host.example.com-error_log"
  TransferLog "logs/host.example.com-access_log"
</VirtualHost>
```

Chaque serveur virtuel doit correspondre à une adresse IP, un port ou un nom d'hôte spécifique ; dans le premier cas, le serveur doit être configuré pour recevoir les paquets IP de plusieurs adresses (si le serveur n'a qu'une interface réseau, on peut utiliser à cet effet la commande `ifconfig alias` -- si votre système d'exploitation le permet).

> [!NOTE]
> **Note**
>
> L'utilisation de la directive `<VirtualHost>` n'affecte en rien les adresses IP sur lesquelles Apache httpd est en écoute. Vous devez vous assurer que les adresses des serveurs virtuels sont bien incluses dans la liste des adresses précisées par la directive [[13-directives/listen|Listen]].

Tout bloc `<VirtualHost>` doit comporter une directive [[13-directives/servername|ServerName]]. Dans le cas contraire, le serveur virtuel héritera de la valeur de la directive [[13-directives/servername|ServerName]] issue de la configuration du serveur principal.

A l'arrivée d'une requête, le serveur tente de la faire prendre en compte par la section `<VirtualHost>` qui correspond le mieux en ne se basant que sur la paire adresse IP/port. Les chaînes sans caractères génériques l'emportent sur celles qui en contiennent. Si aucune correspondance du point de vue de l'adresse IP/port n'est trouvée, c'est la configuration du serveur "principal" qui sera utilisée.

Si plusieurs serveurs virtuels correspondent du point de vue de l'adresse IP/port, le serveur sélectionne celui qui correspond le mieux du point de vue du nom d'hôte de la requête. Si aucune correspondance du point de vue du nom d'hôte n'est trouvée, c'est le premier serveur virtuel dont l'adresse IP/port correspond qui sera utilisé. Par voie de conséquence, le premier serveur virtuel comportant une certaine paire adresse IP/port est le serveur virtuel par défaut pour cette paire adresse IP/port.

> [!WARNING]
> **Sécurité**
>
> Voir le document sur les [[11-guides/06-divers/conseils-sur-la-securite|conseils à propos de sécurité]] pour une description détaillée des raisons pour lesquelles la sécurité de votre serveur pourrait être compromise, si le répertoire contenant les fichiers journaux est inscriptible par tout autre utilisateur que celui qui démarre le serveur.

## Voir aussi

- [[11-guides/03-serveurs-virtuels/00-documentation-sur-les-serveurs-virtuels-apache|Documentation des serveurs virtuels du serveur HTTP Apache]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
