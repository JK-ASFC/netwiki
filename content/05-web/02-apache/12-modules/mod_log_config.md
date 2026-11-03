---
title: "mod_log_config"
description: "Module Apache mod_log_config — Journalisation des requêtes envoyées au serveur. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_log_config]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Journalisation des requêtes envoyées au serveur |
| **Statut** | Base |
| **Identificateur** | `log_config_module` |
| **Fichier source** | `mod_log_config.c` |

## Sommaire

Ce module apporte une grande souplesse dans la journalisation des requêtes des clients. Les journaux sont écrits sous un format personnalisable, et peuvent être enregistrés directement dans un fichier, ou redirigés vers un programme externe. La journalisation conditionnelle est supportée, si bien que des requêtes individuelles peuvent être incluses ou exclues des journaux en fonction de leur caractéristiques.

Ce module fournit trois directives : [[13-directives/transferlog|TransferLog]] crée un fichier journal, [[13-directives/logformat|LogFormat]] définit un format personnalisé, et [[13-directives/customlog|CustomLog]] définit un fichier journal et un format en une seule étape. Pour journaliser les requêtes dans plusieurs fichiers, vous pouvez utiliser plusieurs fois les directives `TransferLog` et `CustomLog` dans chaque serveur.

## Formats de journaux personnalisés

L'argument format des directives [[13-directives/logformat|LogFormat]] et [[13-directives/customlog|CustomLog]] est une chaîne de caractères. Cette chaîne définit le format de la journalisation des requêtes dans le fichier journal. Elle peut contenir des caractères littéraux qui seront reproduits dans le fichier journal, et les caractères de contrôle de style C "\\n" et "\\t" représentant respectivement une nouvelle ligne et une tabulation. Les guillemets et les anti-slashes littéraux doivent être échappés à l'aide d'anti-slashes.

Les caractéristiques de la requête en elle-même sont journalisées en insérant des directives "`%`" dans la chaîne de format, celles-ci étant remplacées dans le fichier journal par certaines valeurs comme suit :

| Chaîne de format | Description |
| --- | --- |
| `%%` | Le signe "pourcentage" |
| `%a` | L'adresse IP distante (voir le module [[12-modules/mod_remoteip\|mod_remoteip]]). |
| `%{c}a` | Adresse IP distante de la connexion(voir le module [[12-modules/mod_remoteip\|mod_remoteip]]) |
| `%A` | L'adresse IP locale |
| `%B` | La taille de la réponse en octets, en excluant les en-têtes HTTP. |
| `%b` | La taille de la réponse en octets, en excluant les en-têtes HTTP. Au format CLF , c'est à dire un '`-`' à la place d'un 0 lorsqu'aucun octet n'est renvoyé. |
| `%{NOMVAR}C` | Le contenu du cookie *NOMVAR* dans la requête envoyée au serveur. Seuls les cookies version 0 sont pleinement supportés. |
| `%D` | Le temps mis à servir la requête, en microsecondes. |
| `%{NOMVAR}e` | Le contenu de la variable d'environnement *NOMVAR* |
| `%f` | Nom de fichier |
| `%h` | Serveur distant. Contiendra l'adresse IP si la directive [[13-directives/hostnamelookups\|HostnameLookups]] est définie à `Off`, ce qui est sa valeur par défaut. Si cette adresse IP n'est enregistrée que pour certains serveurs, vous avez probablement défini des directives de contrôle d'accès qui mentionnent ces derniers par leurs noms. Voir la [[12-modules/mod_authz_host\|documentation de Require host]]. |
| `%{c}h` | Semblable à `%h`, mais exploite toujours le nom d'hôte de la connection TCP sous-jacente, en ignorant toute modification réalisée sur le nom d'hôte distant par des modules tels que [[12-modules/mod_remoteip\|mod_remoteip]]. |
| `%H` | Le protocole de la requête |
| `%{NOMVAR}i` | Le contenu des lignes d'en-tête `NOMVAR:` dans la requête envoyée au serveur. Ces en-têtes sont ajoutés par d'autres modules (par exemple [[12-modules/mod_headers\|mod_headers]]). Si vous êtes intéressé par ce qu'était l'en-tête de la requête avant d'être modifié par la plupart des modules, utilisez [[12-modules/mod_setenvif\|mod_setenvif]] pour copier l'en-tête dans une variable d'environnement interne et journaliser sa valeur via le champ `%{VARNAME}e` décrit plus haut. |
| `%k` | Nombre de requêtes persistantes en cours pour cette connexion. Interessant si la directive [[13-directives/keepalive\|KeepAlive]] est utilisée ; par exemple, '1' signifie la première requête après la requête initiale, '2' la seconde, etc... ; autrement, il s'agit toujours de 0 (indiquant la requête initiale). |
| `%l` | Le nom de connexion distant (en provenance d'identd, si disponible). Affiche un tiret, sauf si [[12-modules/mod_ident\|mod_ident]] est présent et si [[13-directives/identitycheck\|IdentityCheck]] est à `On`. |
| `%L` | L'identifiant du message de journalisation de la requête dans le journal des erreurs (ou '-' si aucun message n'a été enregistré dans le journal des erreurs pour cette requête) |
| `%m` | La méthode de la requête |
| `%{NOMVAR}n` | Le contenu de la note *NOMVAR* en provenance d'un autre module. |
| `%{NOMVAR}o` | Le contenu de la ligne d'en-tête `NOMVAR:` de la réponse. |
| `%p` | Le port canonique du serveur servant la requête |
| `%{format}p` | Le port canonique du serveur servant la requête ou le véritable port du serveur ou le véritable port du client. les formats valides sont `canonical`, `local`, ou `remote`. |
| `%P` | Le numéro de processus du processus enfant qui a servi la requête. |
| `%{format}P` | Le numéro de processus ou le numéro de thread du processus enfant qui a servi la requête. Les formats valides sont `pid`, `tid`, et `hextid`. |
| `%q` | La chaîne d'arguments (préfixée par un `?` si une chaîne d'arguments existe, sinon une chaîne vide) |
| `%r` | La première ligne de la requête. Ne tient pas compte de la directive [[13-directives/mergeslashes\|MergeSlashes]] (autrement dit, pas de fusion, même si cette dernière est à ON). |
| `%R` | Le gestionnaire qui génère la réponse (s'il y en a un). |
| `%s` | Statut. Pour les requêtes redirigées en interne, il s'agit du statut de la requête \*originale\* --- `%>s` pour la dernière. |
| `%t` | Date à laquelle la requête a été reçue (au format anglais standard) |
| `%{format}t` | La date, sous la forme spécifiée par format, qui devrait être au format étendu `strftime(3)` (éventuellement localisé). Si le format commence par `begin:` (valeur par défaut), la date est extraite au début du traitement de la requête ; s'il commence par `end:`, la date correspond au moment où l'entrée du journal est inscrite, par conséquent vers la fin du traitement de la requête. Hormis les formats supportés par `strftime(3)`, les formats suivants sont aussi disponibles :  \| \| \| \| --- \| --- \| \| `sec` \| nombre de secondes depuis Epoch \| \| `msec` \| nombre de millisecondes depuis Epoch \| \| `usec` \| nombre de microsecondes depuis Epoch \| \| `msec_frac` \| fraction de milliseconde \| \| `usec_frac` \| fraction de microseconde \|  Ces symboles ne peuvent pas être combinés entre eux ou avec un formatage `strftime(3)` dans la même chaîne de format. Par contre, vous pouvez utiliser plusieurs symboles `%{format}t`. |
| `sec` | nombre de secondes depuis Epoch |
| `msec` | nombre de millisecondes depuis Epoch |
| `usec` | nombre de microsecondes depuis Epoch |
| `msec_frac` | fraction de milliseconde |
| `usec_frac` | fraction de microseconde |
| `%T` | Le temps mis pour servir la requête, en secondes. |
| `%{UNIT}T` | Le temps mis pour traiter la requête dans une unité définie par `UNIT`. Les valeurs d'unité valides sont `ms` pour millisecondes, `us` pour microsecondes et `s` pour secondes. Si `UNIT` est omis, la valeur de l'unité par défaut est la seconde ; spécifier la valeur d'unité `us` revient à utiliser le format `%D`. La possibilité de spécifier une valeur d'unité avec le format `%T` est disponible depuis la version 2.4.13 du serveur HTTP Apache. |
| `%u` | L'utilisateur distant (en provenance d'auth ; peut être faux si le statut de retour (`%s`) est 401). |
| `%U` | Le chemin de la requête, à l'exclusion de toute chaîne d'arguments. Tient compte de la directive [[13-directives/mergeslashes\|MergeSlashes]] (autrement dit, les barres obliques sont fusionnées si cette dernière est à ON). |
| `%v` | Le nom canonique du serveur qui a servi la requête, défini par la directive [[13-directives/servername\|ServerName]]. |
| `%V` | La nom du serveur en tenant compte de la définition de la directive [[13-directives/usecanonicalname\|UseCanonicalName]]. |
| `%X` | Statut de la connexion lorsque la réponse a été renvoyée :  \| \| \| \| --- \| --- \| \| `X` = \| connexion abandonnée avant l'envoi de la réponse. \| \| `+` = \| la connexion peut rester ouverte après l'envoi de la réponse. \| \| `-` = \| la connexion sera fermée après l'envoi de la réponse. \| |
| `X` = | connexion abandonnée avant l'envoi de la réponse. |
| `+` = | la connexion peut rester ouverte après l'envoi de la réponse. |
| `-` = | la connexion sera fermée après l'envoi de la réponse. |
| `%I` | Le nombre d'octets reçus, en comptant la requête et les en-têtes, ne peut être nul. Nécessite l'activation de [[12-modules/mod_logio\|mod_logio]]. |
| `%O` | Nombre d'octets envoyés, y compris les en-têtes. Peut être nul dans les rares cas où une requête est avortée avant que la réponse ne soit envoyée. Nécessite l'activation de [[12-modules/mod_logio\|mod_logio]]. |
| `%S` | Nombre d'octets transmis (en émission et réception), y compris corps et en-têtes de requête. Ce nombre ne peut pas être nul, et il correspond à la combinaison des formats %I et %O. [[12-modules/mod_logio\|mod_logio]] doit être chargé pour pouvoir utiliser ce format. |
| `%{VARNAME}^ti` | Le contenu de `VARNAME:` dans les paramètres de la requête envoyée au serveur. |
| `%{VARNAME}^to` | Le contenu de `VARNAME:` dans les paramètres de la réponse envoyée par le serveur. |

### Modificateurs

Il est possible de restreindre l'enregistrement de certains éléments en fonction du code de statut de la réponse, en insérant une liste de codes de statut séparés par des virgules immédiatement après le caractère "%". Par exemple, `"%400,501{User-agent}i"` n'enregistrera l'en-tête `User-agent` que dans le cas d'une erreur 400 ou 501. Avec les autres codes de statut, c'est la chaîne littérale `"-"` qui sera enregistrée. La liste de codes peut être précédée d'un "`!`" pour inverser la condition : `"%!200,304,302{Referer}i"` enregistre l'en-tête `Referer` pour toutes les requêtes qui *ne* renvoient *pas* un des trois codes spécifiés.

Les modificateurs "\<" et "\>" peuvent être utilisés pour les requêtes qui ont été redirigées en interne afin de choisir si c'est respectivement la requête originale ou finale qui doit être consultée. Par défaut, les directives `%s, %U, %T, %D,` et `%r` consultent la requête originale, alors que toutes les autres consultent la requête finale. Ainsi, par exemple, on peut utiliser `%>s` pour enregistrer le statut final de la requête, et `%<u` pour enregistrer l'utilisateur authentifié à l'origine pour une requête redirigée en interne vers une ressource sans authentification.

### Quelques Notes

Pour des raisons de sécurité, à partir de la version 2.0.46, les caractères non imprimables et autres caractères spéciaux dans une chaîne de formatage qui peut contenir des données de chaîne arbitraires doivent être échappés à l'aide des séquences `\xhh`, où *hh* est le code hexadécimal du caractère spécial. Comme exceptions à cette règle, les caractères `"` et `\` doivent être échappés par un anti-slash, et tous les "blancs" doivent être écrits selon leur notation de style C (`\n`, `\t`, etc...). Avant la version 2.0.46, aucun échappement n'était effectué sur ces chaînes, et il fallait être très prudent lors de l'exploitation des journaux bruts.

| Format | Description | Échappé |
| --- | --- | --- |
| `%C` | Valeur de Cookie | Oui |
| `%e` | Variable d'environnement | Oui |
| `%f` | Nom de fichier de la requête | Oui |
| `%h` | Nom hôte distant | Oui |
| `%H` | Protocole de la requête | Oui |
| `%i` | En-tête de la requête | Oui |
| `%l` | Nom de connexion distant | Oui |
| `%m` | Méthode de la requête | Oui |
| `%n` | Note | Oui |
| `%o` | En-tête de la réponse | Oui |
| `%q` | Chaîne de paramètres | Oui |
| `%r` | Ligne de la requête | Oui |
| `%R` | Gestionnaire | Oui |
| `%u` | Utilisateur distant | Oui |
| `%U` | URI de la requête | Oui |
| `%v` | Nom d'hôte du serveur | Oui |
| `%V` | Nom canonique du serveur | Oui |
| `%^ti` | Données en fin de requête | Oui |
| `%^to` | Données en fin de réponse | Oui |
| `%a` | Adresse IP distante | Non (adresse IP) |
| `%A` | Adresse IP locale | Non (adresse IP) |
| `%b`, `%B` | Nombre d'octets envoyés | Non (numérique) |
| `%D` | Durée de la requête (microsecondes) | Non (numérique) |
| `%k` | Requêtes en cours | Non (numérique) |
| `%L` | Identifiant de connexion | Non (généré en interne) |
| `%p` | Port du serveur | Non (numérique) |
| `%P` | PID/TID | Non (numérique) |
| `%s` | Code d'état | Non (numérique) |
| `%t` | Moment de la requête | Non (temps formaté) |
| `%T` | Durée de la requête (secondes) | Non (numérique) |
| `%X` | État de la connexion | Non (un seul caractère) |

`%b` et `%B` ne représentent pas le nombre d'octets envoyés au client, mais simplement la taille en octets de la réponse HTTP (les deux étant différents, par exemple, si la connexion est abandonnée, ou si SSL est utilisé). Le format `%O` fourni par [[12-modules/mod_logio|mod_logio]], enregistrera le nombre réel d'octets envoyés sur le réseau.

Note : [[12-modules/mod_cache|mod_cache]] est implémenté en tant que gestionnaire basique et non en tant que gestionnaire standard. C'est pourquoi la chaîne de format `%R` ne renverra pas d'information à propos du gestionnaire lorsqu'une mise en cache de contenu entre en jeu.

### Exemples

Quelques chaînes de format couramment utilisées :

**Format de journal courant (CLF)**

`"%h %l %u %t \"%r\" %>s %b"`

**Format de journal courant avec un serveur virtuel**

`"%v %h %l %u %t \"%r\" %>s %b"`

**Format de journal NCSA étandu/combiné**

`"%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-agent}i\""`

**Format de journal de la page qui contient le lien vers la page concernée (Referer)**

`"%{Referer}i -> %U"`

**Format de journal de l'agent (Navigateur)**

`"%{User-agent}i"`

Vous pouvez utiliser plusieurs fois la directive `%{format}t` pour construire un format de temps utilisant les symboles de format étendus tels que `msec_frac` :

**Format de temps prenant en compte les milisecondes**

`"%{%d/%b/%Y %T}t.%{msec_frac}t %{%z}t"`

## Considérations concernant la sécurité

Voir le document [[11-guides/06-divers/conseils-sur-la-securite|conseils à matière de sécurité]] pour plus de détails sur les raisons pour lesquelles votre sécurité pourrait être compromise, si le répertoire où sont stockés les fichiers journaux sont inscriptibles par tout autre utilisateur que celui qui démarre le serveur.

## Directives

- [[13-directives/bufferedlogs|BufferedLogs]]
- [[13-directives/customlog|CustomLog]]
- [[13-directives/logformat|LogFormat]]
- [[13-directives/transferlog|TransferLog]]
- [[13-directives/globallog|GlobalLog]]

## Voir aussi

- [[11-guides/01-generalites/fichiers-journaux|Les fichiers journaux d'Apache]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
