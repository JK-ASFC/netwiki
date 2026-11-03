---
title: "ErrorLogFormat"
description: "Directive Apache ErrorLogFormat (core) — Spécification du format des entrées du journal des erreurs. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Spécification du format des entrées du journal des erreurs |
| **Syntaxe** | `ErrorLogFormat [connection\|request] format` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

La directive `ErrorLogFormat` permet de spécifier quelles informations supplémentaires vont être enregistrées dans le journal des erreurs en plus du message habituel.

```apache
# Exemple simple
ErrorLogFormat "[%t] [%l] [pid %P] %F: %E: [client %a] %M"
```

La spécification de `connection` ou `request` comme premier paramètre permet de définir des formats supplémentaires, ce qui a pour effet de journaliser des informations additionnelles lorsque le premier message est enregistré respectivement pour une connexion ou une requête spécifique. Ces informations additionnelles ne sont enregistrées qu'une seule fois par connexion/requête. Si le traitement d'une connexion ou d'une requête ne génère aucun message dans le journal, alors aucune information additionnelle n'est enregistrée.

Il peut arriver que certains spécificateurs de format ne produisent aucune sortie. Par exemple, l'en-tête Referer n'est présent que si le message du journal est associé à une requête et s'il est généré à un moment où l'en-tête Referer a déjà été lu par le client. Si aucune sortie n'est générée, le comportement par défaut consiste à supprimer tout ce qui se trouve entre l'espace précédent et le suivant. Ceci implique que la chaîne de format est divisée en champs ne contenant pas d'espace séparés par des espaces. Si un spécificateur de format ne génère aucune sortie, l'ensemble du champ est omis. Par exemple, si l'adresse distante `%a` du format `[%t] [%l] [%a] %M` n'est pas disponible, les crochets qui l'entourent ne seront eux-mêmes pas enregistrés. Il est possible d'échapper les espaces par un anti-slash afin qu'ils ne soient pas considérés comme séparateurs de champs. La combinaison '% ' (pourcentage espace) est un délimiteur de champ de taille nulle qui ne génère aucune sortie.

Ce comportement peut être changé en ajoutant des modificateurs à l'item de la chaîne de format. Le modificateur `-` (moins) provoque l'enregistrement d'un signe moins si l'item considéré ne génère aucune sortie. Pour les formats à enregistrement unique par connexion/requête, il est aussi possible d'utiliser le modificateur `+` (plus). Si un item ne générant aucune sortie possède le modificateur plus, la ligne dans son ensemble est omise.

Un modificateur de type entier permet d'assigner un niveau de sévérité à un item de format. L'item considéré ne sera journalisé que si le message journalisé possède un niveau de sévérité du nombre spécifié ou supérieur (c’est-à-dire que le nombre correspondant au niveau de sévérité du message est inférieur ou égal au modificateur). Les valeurs possibles vont de 1 (alert) à 15 (trace8), en passant par 4 (warn) ou 7 (debug).

Par exemple, voici ce qui arriverait si vous ajoutiez des modificateurs à l'item `%{Referer}i` qui enregistre le contenu de l'en-tête `Referer`.

| Item modifié | Signification |
| --- | --- |
| `%-{Referer}i` | Enregistre le caractère `-` si l'en-tête `Referer` n'est pas défini. |
| `%+{Referer}i` | N'enregistre rien si l'en-tête `Referer` n'est pas défini. |
| `%4{Referer}i` | N'enregistre le contenu de l'en-tête `Referer` que si la sévérité du message de journalisation est 4 (avertissement) ou supérieure (niveaux 1 à 4 : alerte, critique, erreur, avertissement). |

Certains spécificateurs de format acceptent des paramètres supplémentaires entre accolades.

| Chaîne de format | Description |
| --- | --- |
| `%%` | Le signe pourcentage |
| `%a` | Adresse IP et port clients |
| `%{c}a` | Port et adresse IP sous-jacents du correspondant pour la connexion (voir le module [[12-modules/mod_remoteip\|mod_remoteip]]) |
| `%A` | Adresse IP et port locaux |
| `%{name}e` | Variable d'environnement de requête *name* |
| `%E` | Etat d'erreur APR/OS et chaîne |
| `%F` | Nom du fichier source et numéro de ligne de l'appel du journal |
| `%{name}i` | En-tête de requête *name* |
| `%k` | Nombre de requêtes persistantes pour cette connexion |
| `%l` | Sévérité du message |
| `%L` | Identifiant journal de la requête |
| `%{c}L` | Identifiant journal de la connexion |
| `%{C}L` | Identifiant journal de la connexion si utilisé dans la portée de la connexion, vide sinon |
| `%m` | Nom du module qui effectue la journalisation du message |
| `%M` | Le message effectif |
| `%{name}n` | Note de requête *name* |
| `%P` | Identifiant du processus courant |
| `%T` | Identifiant du thread courant |
| `%{g}T` | Identifiant unique de thread système du thread courant (l'identifiant affiché par la commande `top` par exemple ; seulement sous Linux pour l'instant) |
| `%t` | L'heure courante |
| `%{u}t` | L'heure courante avec les microsecondes |
| `%{cu}t` | L'heure courante au format ISO 8601 étendu (compact), avec les microsecondes |
| `%{cuz}t` | L'heure actuelle au format ISO 8601 étendu (compact), avec les microsecondes et la zone horaire au format standard ISO 8601:2000. Disponible depuis la version 2.4.58 seulement |
| `%{%-format}t` | L'heure actuelle formatée selon la fonction `strftime(3)`. Disponible depuis la version 2.4.58 seulement |
| `%v` | Le nom de serveur canonique [[13-directives/servername\|ServerName]] du serveur courant. |
| `%V` | Le nom de serveur du serveur qui sert la requête en accord avec la définition de la directive [[13-directives/usecanonicalname\|UseCanonicalName]]. |
| `\` (anti-slash espace) | Espace non délimiteur |
| `%` (pourcentage espace) | Délimiteur de champ (aucune sortie) |

L'item de format identifiant journal `%L` génère un identifiant unique pour une connexion ou une requête. Il peut servir à déterminer quelles lignes correspondent à la même connexion ou requête ou quelle requête est associée à tel connexion. Un item de format `%L` est aussi disponible dans le module [[12-modules/mod_log_config|mod_log_config]], mais il permet dans ce contexte de corréler les entrées du journal des accès avec celles du journal des erreurs. Si le module [[12-modules/mod_unique_id|mod_unique_id]] est chargé, c'est son identifiant unique qui sera utilisé comme identifiant de journal pour les requêtes.

```apache
# Exemple (format par défaut pour les MPMs threadés)
ErrorLogFormat "[%{u}t] [%-m:%l] [pid %P:tid %T] %7F: %E: [client\ %a] %M% ,\ referer\ %{Referer}i"
```

Cet exemple renverrait un message d'erreur du style :

```
[Thu May 12 08:28:57.652118 2011] [core:error] [pid 8777:tid 4326490112] [client ::1:58619] AH00124: Request exceeded the limit of 10 internal redirects due to probable configuration error
```

Notez que, comme indiqué plus haut, certains champs sont totalement supprimés s'ils n'ont pas été définis.

```apache
# Exemple (similaire au format 2.2.x)
ErrorLogFormat "[%t] [%l] %7F: %E: [client\ %a] %M% ,\ referer\ %{Referer}i"
```

```apache
# Exemple avancé avec identifiants journal de requête/connexion
ErrorLogFormat "[%{uc}t] [%-m:%-l] [R:%L] [C:%{C}L] %7F: %E: %M"
ErrorLogFormat request "[%{uc}t] [R:%L] Request %k on C:%{c}L pid:%P tid:%T"
ErrorLogFormat request "[%{uc}t] [R:%L] UA:'%+{User-Agent}i'"
ErrorLogFormat request "[%{uc}t] [R:%L] Referer:'%+{Referer}i'"
ErrorLogFormat connection "[%{uc}t] [C:%{c}L] remote\ %a local\ %A"
```

## Voir aussi

- [[13-directives/errorlog|ErrorLog]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
