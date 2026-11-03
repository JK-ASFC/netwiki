---
title: "mod_authnz_ldap"
description: "Module Apache mod_authnz_ldap — Permet d'utiliser un annuaire LDAP pour l'authentification HTTP de base. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_authnz_ldap]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Permet d'utiliser un annuaire LDAP pour l'authentification HTTP de base. |
| **Statut** | Extension |
| **Identificateur** | `authnz_ldap_module` |
| **Fichier source** | `mod_authnz_ldap.c` |
| **Compatibilité** | Disponible depuis les versions 2.1 et supérieures d'Apache |

## Sommaire

Ce module permet aux frontaux d'authentification comme [[12-modules/mod_auth_basic|mod_auth_basic]] d'authentifier les utilisateurs via un annuaire ldap.

[[12-modules/mod_authnz_ldap|mod_authnz_ldap]] supporte les fonctionnalités suivantes :

- Support vérifié du [SDK OpenLDAP](http://www.openldap.org/) (versions 1.x et 2.x).
- Implémentation de politiques d'autorisation complexes en les définissant via des filtres LDAP.
- Mise en oeuvre d'une mise en cache des opérations LDAP élaborée via [[12-modules/mod_ldap|mod_ldap]].
- Support de LDAP via SSL/TLS (nécessite le SDK OpenLDAP 2.x).

Lorsqu'on utilise [[12-modules/mod_auth_basic|mod_auth_basic]], ce module est invoqué en affectant la valeur `ldap` à la directive [[13-directives/authbasicprovider|AuthBasicProvider]].

## Sommaire

- Mises en garde à caractère général
- Mode opératoire

  - La phase d'authentification
  - La phase d'autorisation
- Les directives requises

  - Require ldap-user
  - Require ldap-group
  - Require ldap-dn
  - Require ldap-attribute
  - Require ldap-filter
  - Require ldap-search
- Exemples
- Utilisation de TLS
- Utilisation de SSL
- Mise à disposition des informations de connexion
- Utilisation d'Active Directory
- Utilisation de Microsoft FrontPage avec mod\_authnz\_ldap

  - Comment ça marche
  - Mises en garde

## Mises en garde à caractère général

Ce module effectue une mise en cache des résultats du processus d'authentification et d'autorisation en fonction de la configuration du module [[12-modules/mod_ldap|mod_ldap]]. Les modifications effectuées au niveau du serveur LDAP d'arrière-plan comme les verrouillages ou révocations d'utilisateurs, les changements de mot de passe, ou les changements d'appartenance à un groupe (et cette liste n'est pas exhaustive), ne seront pas immédiatement propagées jusqu'au serveur HTTP. Consultez les directives du module [[12-modules/mod_ldap|mod_ldap]] pour plus de détails à propos de la configuration de la mise en cache.

## Mode opératoire

L'utilisateur se voit accorder l'accès selon un processus en deux phases. La première phase est l'authentification, au cours de laquelle le fournisseur d'authentification [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] vérifie que les informations de connexion de l'utilisateur sont valides. Elle est aussi connue sous le nom de phase de *recherche/connexion* (NdT : en anglais ou dans le code source : *search/bind*). La deuxième phase est l'autorisation, au cours de laquelle [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] détermine si l'utilisateur authentifié a la permission d'accéder à la ressource considérée. Elle est aussi connue sous le nom de phase de *comparaison* (*compare*).

[[12-modules/mod_authnz_ldap|mod_authnz_ldap]] comporte un fournisseur d'authentification authn\_ldap et un gestionnaire d'autorisation authz\_ldap. Le fournisseur d'authentification authn\_ldap peut être invoqué en affectant la valeur `ldap` à la directive [[13-directives/authbasicprovider|AuthBasicProvider]]. Le gestionnaire d'autorisation authz\_ldap enrichit la liste des types d'autorisations de la directive [[13-directives/require|Require]] en y ajoutant les valeurs `ldap-user`, `ldap-dn` et `ldap-group`.

### La phase d'authentification

Au cours de la phase d'authentification, [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] recherche une entrée de l'annuaire LDAP qui correspond au nom d'utilisateur fourni par le client HTTP. Si une correspondance unique est trouvée, [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] tente de se connecter au serveur hébergeant l'annuaire LDAP en utilisant le DN de l'entrée et le mot de passe fourni par le client HTTP. Comme ce processus effectue tout d'abord une recherche, puis une connexion, il est aussi connu sous le nom de phase de recherche/connexion. Voici le détail des étapes constituant la phase de recherche/connexion :

1. Confection d'un filtre de recherche en combinant les attribut et filtre définis par la directive [[13-directives/authldapurl|AuthLDAPURL]] avec le nom d'utilisateur et le mot de passe fournis par le client HTTP.
2. Recherche dans l'annuaire LDAP en utilisant le filtre confectionné précédemment. Si le résultat de la recherche est négatif ou comporte plusieurs entrées, refus ou restriction de l'accès.
3. Extraction du DN (distinguished name) de l'entrée issue du résultat de la recherche, et tentative de connexion au serveur LDAP en utilisant ce DN et le mot de passe fournis par le client HTTP. Si la connexion échoue, refus ou restriction de l'accès.

Les directives utilisées durant la phase de recherche/connexion sont les suivantes :

|   |   |
| --- | --- |
| [[13-directives/authldapurl\|AuthLDAPURL]] | Spécifie le serveur LDAP, le DN de base, l'attribut à utiliser pour la recherche, ainsi que les filtres de recherche supplémentaires. |
| [[13-directives/authldapbinddn\|AuthLDAPBindDN]] | Un DN optionnel pour se connecter durant la phase de recherche. |
| [[13-directives/authldapbindpassword\|AuthLDAPBindPassword]] | Un mot de passe optionnel pour se connecter durant la phase de recherche. |

### La phase d'autorisation

Au cours de la phase d'autorisation, [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] tente de déterminer si l'utilisateur est autorisé à accéder à la ressource considérée. Une grande partie de cette vérification consiste pour [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] en des opérations de comparaison au niveau du serveur LDAP. C'est pourquoi cette phase est aussi connue sous le nom de phase de comparaison. [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] accepte les directives [[13-directives/require|Require]] suivantes pour déterminer si les informations de connexion permettent d'accorder l'accès à l'utilisateur :

- Avec la directive `Require ldap-user`, l'autorisation d'accès est accordée si le nom d'utilisateur spécifié par la directive correspond au nom d'utilisateur fourni par le client.
- Avec la directive `Require ldap-dn`, l'autorisation d'accès est accordée si le DN spécifié par la directive correspond au DN extrait du résultat de la recherche dans l'annuaire LDAP.
- Avec la directive `Require ldap-group`, l'autorisation d'accès est accordée si le DN extrait du résultat de la recherche dans l'annuaire LDAP (ou le nom d'utilisateur fourni par le client) appartient au groupe LDAP spécifié par la directive, ou éventuellement à un de ses sous-groupes.
- Avec la directive `Require ldap-attribute`, l'autorisation d'accès est accordée si la valeur de l'attribut extraite de la recherche dans l'annuaire LDAP correspond à la valeur spécifiée par la directive.
- Avec la directive `Require ldap-filter`, l'autorisation d'accès est accordée si le filtre de recherche renvoie un objet utilisateur unique qui corresponde au DN de l'utilisateur authentifié.
- Avec la directive `Require ldap-search`, l'autorisation d'accès est accordée si le filtre de recherche renvoie avec succès un objet correspondant unique avec n'importe quel DN.
- dans tous les autres cas, refus ou restriction de l'accès.

Sous réserve du chargement de modules d'autorisation supplémentaires, d'autres valeurs de la directive [[13-directives/require|Require]] peuvent être spécifiées.

- L'accès est accordé à tous les utilisateurs authentifiés si une directive `Require valid-user` est présente (nécessite le module [[12-modules/mod_authz_user|mod_authz_user]]).
- Avec la directive `Require group`, l'autorisation d'accès est accordée si le module [[12-modules/mod_authz_groupfile|mod_authz_groupfile]] a été chargé et si la directive [[13-directives/authgroupfile|AuthGroupFile]] a été définie.
- etc...

Durant la phase de comparaison, [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] utilise les directives suivantes :

|   |   |
| --- | --- |
| [[13-directives/authldapurl\|AuthLDAPURL]] | On utilise l'attribut spécifié dans l'URL pour les opérations de comparaison initiées par la directive `Require ldap-user`. |
| [[13-directives/authldapcomparednonserver\|AuthLDAPCompareDNOnServer]] | Détermine le comportement de la directive `Require ldap-dn`. |
| [[13-directives/authldapgroupattribute\|AuthLDAPGroupAttribute]] | Détermine l'attribut utilisé pour les opérations de comparaison initiées par la directive `Require ldap-group`. |
| [[13-directives/authldapgroupattributeisdn\|AuthLDAPGroupAttributeIsDN]] | Spécifie si l'on doit utiliser le DN ou le nom de l'utilisateur lors des opérations de comparaison initiées par la directive `Require ldap-group`. |
| [[13-directives/authldapmaxsubgroupdepth\|AuthLDAPMaxSubGroupDepth]] | Détermine la profondeur maximale de l'arborescence des sous-groupes qui seront évalués au cours des opérations de comparaisons initiées par la directive `Require ldap-group`. |
| [[13-directives/authldapsubgroupattribute\|AuthLDAPSubGroupAttribute]] | Détermine l'attribut à utiliser lors de l'extraction de membres de sous-groupes du groupe courant au cours des opérations de comparaison initiées par la directive `Require ldap-group`. |
| [[13-directives/authldapsubgroupclass\|AuthLDAPSubGroupClass]] | Spécifie les valeurs de classe d'objet LDAP à utiliser pour déterminer si les objets extraits de l'annuaire sont bien des objets de type groupe (et non des objets de type utilisateur), au cours du traitement des sous-groupes initié par la directive `Require ldap-group`. |

## Les directives requises

Les directives [[13-directives/require|Require]] d'Apache sont utilisées au cours de la phase d'autorisation afin de s'assurer que l'utilisateur est autorisé à accéder à une ressource. mod\_authnz\_ldap enrichit la liste des types d'autorisations avec les valeurs `ldap-user`, `ldap-dn`, `ldap-group`, `ldap-attribute` et `ldap-filter`. D'autres types d'autorisations sont disponibles, sous réserve du chargement de modules d'autorisation supplémentaires.

Depuis la version 2.4.8, les directives require LDAP supportent les [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|expressions]].

### Require ldap-user

La directive `Require ldap-user` permet de spécifier les noms des utilisateurs autorisés à accéder à la ressource. Lorsque [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] a extrait un DN unique de l'annuaire LDAP, il effectue une opération de comparaison LDAP en utilisant le nom d'utilisateur spécifié par la directive `Require ldap-user`, pour vérifier si ce nom d'utilisateur correspond à l'entrée LDAP extraite. On peut accorder l'accès à plusieurs utilisateurs en plaçant plusieurs nom d'utilisateurs sur la même ligne séparés par des espaces. Si un nom d'utilisateur contient des espaces, il doit être entouré de guillemets. On peut aussi accorder l'accès à plusieurs utilisateurs en utilisant une directive `Require ldap-user` par utilisateur. Par exemple, avec la directive [[13-directives/authldapurl|AuthLDAPURL]] définie à `ldap://ldap/o=Example?cn` (spécifiant donc que l'attribut `cn` sera utilisé pour les recherches), on pourra utiliser les directives Require suivantes pour restreindre l'accès :

```apache
Require ldap-user "Barbara Jenson"
Require ldap-user "Fred User"
Require ldap-user "Joe Manager"
```

De par la manière dont [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] traite cette directive, Barbara Jenson peut s'authentifier comme `Barbara Jenson`, `Babs Jenson` ou tout autre `cn` sous lequel elle est enregistrée dans l'annuaire LDAP. Une seule ligne `Require ldap-user` suffit pour toutes les valeurs de l'attribut dans l'entrée LDAP de l'utilisateur.

Si l'attribut `uid` avait été spécifié à la place de l'attribut `cn` dans l'URL précédente, les trois lignes ci-dessus auraient pû être condensées en une seule ligne :

```apache
Require ldap-user bjenson fuser jmanager
```

### Require ldap-group

Cette directive permet de spécifier un groupe LDAP dont les membres auront l'autorisation d'accès. Elle prend comme argument le DN du groupe LDAP.

> [!WARNING]
> N'entourez pas de guillemets le nom du groupe. À la différence de `Require ldap-user`, le fournisseur `ldap-group` ne prend pas en charge les valeurs entre guillemets.

Supposons par exemple que l'entrée suivante existait dans l'annuaire LDP :

```
dn: cn=Administrators, o=Example
objectClass: groupOfUniqueNames
uniqueMember: cn=Barbara Jenson, o=Example
uniqueMember: cn=Fred User, o=Example
```

La directive suivante autoriserait alors l'accès à Fred et Barbara :

```apache
Require ldap-group cn=Administrators, o=Example
```

Les membres peuvent aussi se trouver dans les sous-groupes du groupe LDAP spécifié si la directive [[13-directives/authldapmaxsubgroupdepth|AuthLDAPMaxSubGroupDepth]] a été définie à une valeur supérieure à 0. Par exemple, supposons que les entrées suivantes existent dans l'annuaire LDAP :

```
dn: cn=Employees, o=Example
objectClass: groupOfUniqueNames
uniqueMember: cn=Managers, o=Example
uniqueMember: cn=Administrators, o=Example
uniqueMember: cn=Users, o=Example

dn: cn=Managers, o=Example
objectClass: groupOfUniqueNames
uniqueMember: cn=Bob Ellis, o=Example
uniqueMember: cn=Tom Jackson, o=Example

dn: cn=Administrators, o=Example
objectClass: groupOfUniqueNames
uniqueMember: cn=Barbara Jenson, o=Example
uniqueMember: cn=Fred User, o=Example

dn: cn=Users, o=Example
objectClass: groupOfUniqueNames
uniqueMember: cn=Allan Jefferson, o=Example
uniqueMember: cn=Paul Tilley, o=Example
uniqueMember: cn=Temporary Employees, o=Example

dn: cn=Temporary Employees, o=Example
objectClass: groupOfUniqueNames
uniqueMember: cn=Jim Swenson, o=Example
uniqueMember: cn=Elliot Rhodes, o=Example
```

Les directives suivantes autoriseraient alors l'accès à Bob Ellis, Tom Jackson, Barbara Jenson, Fred User, Allan Jefferson, et Paul Tilley, mais l'interdiraient à Jim Swenson, ou Elliot Rhodes (car ils sont situés dans un sous-groupe de niveau de profondeur 2) :

```apache
Require ldap-group cn=Employees, o=Example
AuthLDAPMaxSubGroupDepth 1
```

Le comportement de cette directive est modifié par les directives [[13-directives/authldapgroupattribute|AuthLDAPGroupAttribute]], [[13-directives/authldapgroupattributeisdn|AuthLDAPGroupAttributeIsDN]], [[13-directives/authldapmaxsubgroupdepth|AuthLDAPMaxSubGroupDepth]], [[13-directives/authldapsubgroupattribute|AuthLDAPSubGroupAttribute]], et [[13-directives/authldapsubgroupclass|AuthLDAPSubGroupClass]].

### Require ldap-dn

La directive `Require ldap-dn` permet à l'administrateur d'accorder l'utorisation d'accès en fonction du DN. Elle permet de spécifier un DN pour lequel l'accès est autorisé. Si le DN extrait de l'annuaire correspond au DN spécifié par la directive `Require ldap-dn`, l'autorisation d'accès est accordée.

> [!WARNING]
> N'entourez pas de guillemets le DN. À la différence de `Require ldap-user`, le fournisseur `ldap-dn` ne prend pas en charge les valeurs entre guillemets.

La directive suivante accorderait l'accès à un DN spécifique :

```apache
Require ldap-dn cn=Barbara Jenson, o=Example
```

Le comportement ce cette directive est modifié par la directive [[13-directives/authldapcomparednonserver|AuthLDAPCompareDNOnServer]].

### Require ldap-attribute

La directive `Require ldap-attribute` permet à l'administrateur d'accorder l'autorisation d'accès en fonction des attributs de l'utilisateur authentifié dans l'annuaire LDAP. Si la valeur de l'attribut dans l'annuaire correspond à la valeur spécifiée par la directive, l'autorisation d'accès est accordée.

La directive suivante accorderait l'autorisation d'accès à tout utilisateur dont l'attribut employeeType a pour valeur "actif" :

```apache
Require ldap-attribute employeeType="active"
```

Plusieurs paires attribut/valeur peuvent être spécifiées par une même directive en les séparant par des espaces, ou en définissant plusieurs directives `Require ldap-attribute`. La logique sous-jacente à une liste de paires attribut/valeur est une opération OU. L'autorisation d'accès sera accordée si au moins une paire attribut/valeur de la liste spécifiée correspond à la paire attribut/valeur de l'utilisateur authentifié. Si elle contient des espaces, la valeur, et seulement la valeur, doit être entourée de guillemets.

La directive suivante accorderait l'autorisation d'accès à tout utilisateur dont l'attribut city aurait pour valeur "San Jose", ou donc l'attribut status aurait pour valeur "actif" :

```apache
Require ldap-attribute city="San Jose" status="active"
```

### Require ldap-filter

La directive `Require ldap-filter` permet à l'administrateur d'accorder l'autorisation d'accès en fonction d'un filtre de recherche LDAP complexe. L'autorisation d'accès est accordée si le DN renvoyé par le filtre de recherche correspond au DN de l'utilisateur authentifié.

La directive suivante accorderait l'autorisation d'accès à tout utilisateur possédant un téléphone cellulaire et faisant partie du département "marketing" :

```apache
Require ldap-filter &(cell=*)(department=marketing)
```

Alors que la directive `Require ldap-attribute` se contente d'une simple comparaison d'attributs, la directive `Require ldap-filter` effectue une opération de recherche dans l'annuaire LDAP en utilisant le filtre de recherche spécifié. Si une simple comparaison d'attributs suffit, l'opération de comparaison effectuée par `ldap-attribute` sera plus rapide que l'opération de recherche effectuée par `ldap-filter`, en particulier dans le cas d'un annuaire LDAP de grande taille.

Lorsqu'on utilise une [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|expression]] dans un filtre, il faut s'assurer que les filtres LDAP sont correctement échappés afin de se prémunir contre toute injection LDAP. Pour ce faire, il est possible d'utiliser la fonction **ldap**.

```apache
<LocationMatch ^/dav/(?<SITENAME>[^/]+)/>
  Require ldap-filter (memberOf=cn=%{ldap:%{unescape:%{env:MATCH_SITENAME}},ou=Websites,o=Example)
</LocationMatch>
```

### Require ldap-search

La directive `Require ldap-search` permet à l'administrateur d'autoriser l'accès en fonction d'un filtre de recherche LDAP générique contenant une [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|expression rationnelle]]. Si le filtre de recherche renvoie une et une seule correspondance, l'accès est accordé sans tenir compte du DN.

La directive suivante accorderait l'accès aux URLs correspondant aux objets spécifiés dans le serveur LDAP :

```apache
<LocationMatch "^/dav/(?<SITENAME>[^/]+)/">
Require ldap-search "(cn=%{ldap:%{unescape:%{env:MATCH_SITENAME}}
Website)"
</LocationMatch>
```

Note : il faut bien s'assurer que les expressions sont correctement échappés afin de se prémunir contre toute injection LDAP. A cet effet, il est possible d'utiliser la fonction **ldap** comme dans l'exemple ci-dessus.

## Exemples

- Accorde l'autorisation d'accès à tout utilisateur présent dans l'annuaire LDAP, en utilisant son UID pour effectuer la recherche :

  ```apache
  AuthLDAPURL "ldap://ldap1.example.com:389/ou=People, o=Example?uid?sub?(objectClass=*)"
  Require valid-user
  ```
- L'exemple suivant est similaire au précédent, mais les champs dont les valeurs par défaut conviennent sont omis. Notez aussi la présence d'un annuaire LDAP redondant :

  ```apache
  AuthLDAPURL "ldap://ldap1.example.com ldap2.example.com/ou=People, o=Example"
  Require valid-user
  ```
- Encore un exemple similaire aux précédents, mais cette fois, c'est l'attribut cn qui est utilisé pour la recherche à la place de l'UID. Notez que ceci peut poser problème si plusieurs utilisateurs de l'annuaire partagent le même `cn`, car une recherche sur le `cn` **doit** retourner une entrée et une seule. C'est pourquoi cette approche n'est pas recommandée : il est préférable de choisir un attribut de votre annuaire dont l'unicité soit garantie, comme `uid`.

  ```apache
  AuthLDAPURL "ldap://ldap.example.com/ou=People, o=Example?cn"
  Require valid-user
  ```
- Accorde l'autorisation d'accès à tout utilisateur appartenant au groupe Administrateurs. Les utilisateurs doivent s'authentifier en utilisant leur UID :

  ```apache
  AuthLDAPURL ldap://ldap.example.com/o=Example?uid
  Require ldap-group cn=Administrators, o=Example
  ```
- Accorde l'accès à tout utilisateur appartenant au groupe dont le nom correspond au nom d'hôte du serveur virtuel. Dans cet exemple, on utilise une [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|expression]] pour construire le filtre.

  ```apache
  AuthLDAPURL ldap://ldap.example.com/o=Example?uid
  Require ldap-group cn=%{SERVER_NAME}, o=Example
  ```
- Pour l'exemple suivant, on suppose que tout utilisateur de chez Example qui dispose d'un bippeur alphanumérique possèdera un attribut LDAP `qpagePagerID`. Seuls ces utilisateurs (authentifiés via leur UID) se verront accorder l'autorisation d'accès :

  ```apache
  AuthLDAPURL ldap://ldap.example.com/o=Example?uid??(qpagePagerID=*)
  Require valid-user
  ```
- L'exemple suivant illustre la puissance des filtres pour effectuer des requêtes complexes. Sans les filtres, il aurait été nécessaire de créer un nouveau groupe LDAP et de s'assurer de la synchronisation des membres du groupe avec les utilisateurs possédant un bippeur. Tout devient limpide avec les filtres. Nous avons pour but d'accorder l'autorisation d'accès à tout utilisateur disposant d'un bippeur ainsi qu'à Joe Manager qui ne possède pas de bippeur, mais doit tout de même pouvoir accéder à la ressource :

  ```apache
  AuthLDAPURL ldap://ldap.example.com/o=Example?uid??(|(qpagePagerID=*)(uid=jmanager))
  Require valid-user
  ```

  Ce dernier exemple peut sembler confus au premier abord ; en fait, il permet de mieux comprendre à quoi doit ressembler le filtre en fonction de l'utilisateur qui se connecte. Si Fred User se connecte en tant que `fuser`, le filtre devra ressembler à :

  ```
  (&(|(qpagePagerID=*)(uid=jmanager))(uid=fuser))
  ```

  Un recherche avec le filtre ci-dessus ne retournera un résultat positif que si `fuser` dispose d'un bippeur. Si Joe Manager se connecte en tant que `jmanager`, le filtre devra ressembler à :

  ```
  (&(|(qpagePagerID=*)(uid=jmanager))(uid=jmanager))
  ```

  Un recherche avec le filtre ci-dessus retournera un résultat positif que `jmanager` dispose d'un bippeur ou non

## Utilisation de TLS

Pour l'utilisation de TLS, voir les directives du module [[12-modules/mod_ldap|mod_ldap]] [[13-directives/ldaptrustedclientcert|LDAPTrustedClientCert]], [[13-directives/ldaptrustedglobalcert|LDAPTrustedGlobalCert]] et [[13-directives/ldaptrustedmode|LDAPTrustedMode]].

Un second paramètre optionnel peut être ajouté à la directive [[13-directives/authldapurl|AuthLDAPURL]] pour remplacer le type de connexion par défaut défini par la directive [[13-directives/ldaptrustedmode|LDAPTrustedMode]]. Ceci permettra de promouvoir la connexion établie via une URL du type `ldap://` au statut de connection sécurisée sur le même port.

## Utilisation de SSL

Pour l'utilisation de SSL, voir les directives du module [[12-modules/mod_ldap|mod_ldap]] [[13-directives/ldaptrustedclientcert|LDAPTrustedClientCert]], [[13-directives/ldaptrustedglobalcert|LDAPTrustedGlobalCert]] et [[13-directives/ldaptrustedmode|LDAPTrustedMode]].

Pour spécifier un serveur LDAP sécurisé, utilisez `ldaps://` au lieu de `ldap://` dans la directive [[13-directives/authldapurl|AuthLDAPURL]].

## Mise à disposition des informations de connexion

Au cours du processus d'*authentification*, les attributs LDAP spécifiés par la directive [[13-directives/authldapurl|AuthLDAPURL]] sont enregistrés dans des variables d'environnement préfixées par la chaîne "AUTHENTICATE\_".

Au cours du processus d'*autorisation*, les attributs LDAP spécifiés par la directive [[13-directives/authldapurl|AuthLDAPURL]] sont enregistrés dans des variables d'environnement préfixées par la chaîne "AUTHORIZE\_".

Si les champs attribut contiennent le nom, le CN et le numéro de téléphone d'un utilisateur, un programme CGI pourra accéder à ces informations sans devoir effectuer une autre requête LDAP pour les extraire de l'annuaire.

Ceci a pour effet de simplifier considérablement le code et la configuration nécessaire de certaines applications web.

## Utilisation d'Active Directory

Active Directory peut supporter plusieurs domaines à la fois. Pour faire la distinction entre les utilisateurs de plusieurs domaines, on peut ajouter à l'entrée de l'utilisateur dans l'annuaire un identifiant appelé Nom Principal d'Utilisateur (User Principle Name ou UPN). Cet UPN se compose en général du nom de compte de l'utilisateur, suivi du nom du domaine considéré, par exemple `untel@nz.example.com`.

Vous voudrez probablement configurer le module [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] afin de pouvoir authentifier les utilisateurs de n'importe quel domaine de la forêt Active Directory. Ainsi, `untel@nz.example.com` et `untel@au.example.com` pourront être authentifiés en une seule fois par la même requête.

Pour y parvenir, on utilise le concept de Catalogue Global d'Active Directory. Ce Catalogue Global est une copie en lecture seule des attributs sélectionnés de tous les serveurs de la forêt Active Directory. Une requête vers le Catalogue Global permet donc d'atteindre tous les domaines en une seule fois, sans avoir à se connecter aux différents serveurs, via des liaisons dont certaines peuvent être lentes.

Lorsqu'il est activé, la Catalogue Global est un serveur d'annuaire indépendant accessible sur le port 3268 (3269 pour SSL). Pour rechercher un utilisateur, effectuez une recherche sur l'attribut `userPrincipalName`, avec une base de recherche vide, comme suit :

```apache
AuthLDAPBindDN apache@example.com
AuthLDAPBindPassword password
AuthLDAPURL ldap://10.0.0.1:3268/?userPrincipalName?sub
```

Les utilisateurs devront s'authentifier en entrant leur UPN, de la forme`untel@nz.example.com`.

## Utilisation de Microsoft FrontPage avec mod\_authnz\_ldap

Normalement, FrontPage utilise des fichiers utilisateur/groupe spécifiques à FrontPage-web (c'est à dire les modules [[12-modules/mod_authn_file|mod_authn_file]] et [[12-modules/mod_authz_groupfile|mod_authz_groupfile]]) pour effectuer toute l'authentification. Malheureusement, il ne suffit pas de modifier l'authentification LDAP en ajoutant les directives appropriées, car ceci corromprait les formulaires de *Permissions* dans le client FrontPage, qui sont censés modifier les fichiers d'autorisation standards au format texte.

Lorsqu'un site web FrontPage a été créé, lui adjoindre l'authentification LDAP consiste à ajouter les directives suivantes à *chaque* fichier `.htaccess` qui sera créé dans le site web :

```apache
AuthLDAPURL       "the url"
AuthGroupFile     "mygroupfile"
Require group     "mygroupfile"
```

### Comment ça marche

FrontPage restreint l'accès à un site web en ajoutant la directive `Require valid-user` aux fichiers `.htaccess`. La directive `Require valid-user` permettra l'accès à tout utilisateur valide *du point de vue LDAP*. Cela signifie que tout utilisateur possédant une entrée dans l'annuaire LDAP sera considéré comme valide, alors que FrontPage ne considère comme valides que les utilisateurs enregistrés dans le fichier des utilisateurs local. En remplaçant l'autorisation par groupe LDAP par une autorisation par fichier de groupe, Apache sera en mesure de consulter le fichier des utilisateurs local (géré par FrontPage) - au lieu de l'annuaire LDAP - lors du processus d'autorisation des utilisateurs.

Une fois les directives ajoutées selon ce qui précède, les utilisateurs FrontPage pourront effectuer toutes les opérations de gestion à partir du client FrontPage.

### Avertissements

- Lors du choix de l'URL LDAP, l'attribut à utiliser pour l'authentification doit aussi être valide pour le fichier des utilisateurs de [[12-modules/mod_authn_file|mod_authn_file]]. A cette fin, l'UID est idéal.
- Lorsqu'ils ajoutent des utilisateurs via FrontPage, les administrateurs de FrontPage doivent choisir des noms d'utilisateurs qui existent déjà dans l'annuaire LDAP (pour des raisons évidentes). De même, le mot de passe que l'administrateur entre dans le formulaire est ignoré, car pour l'authentification, Apache utilise le mot de passe de l'annuaire LDAP, et non le mot de passe enregistré dans le fichier des utilisateurs, ce qui peut semer la confusion parmi les administrateurs web.
- Pour supporter FrontPage, Apache doit être compilé avec [[12-modules/mod_auth_basic|mod_auth_basic]], [[12-modules/mod_authn_file|mod_authn_file]] et [[12-modules/mod_authz_groupfile|mod_authz_groupfile]]. Ceci est dû au fait qu'Apache doit utiliser le fichier de groupes de [[12-modules/mod_authz_groupfile|mod_authz_groupfile]] pour déterminer le niveau d'accès d'un utilisateur au site web FrontPage.
- Les directives doivent être placées dans les fichiers `.htaccess`. Elles ne fonctionneront pas si vous les placez dans une section [[13-directives/location|<Location>]] ou [[13-directives/directory|<Directory>]]. Ceci est dû au fait que pour savoir où se trouve la liste des utilisateurs valides, [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] doit être en mesure d'atteindre la directive [[13-directives/authgroupfile|AuthGroupFile]] qui se trouve dans les fichiers `.htaccess` de FrontPage. Si les directives de [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] ne sont pas situées dans le même fichier `.htaccess` que les directives FrontPage, la configuration ne fonctionnera pas, car [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] ne sera jamais en mesure de traiter le fichier `.htaccess`, et par conséquent ne pourra jamais trouver le fichier des utilisateurs géré par FrontPage.

## Directives

- [[13-directives/authldapauthorizeprefix|AuthLDAPAuthorizePrefix]]
- [[13-directives/authldapbindauthoritative|AuthLDAPBindAuthoritative]]
- [[13-directives/authldapinitialbindasuser|AuthLDAPInitialBindAsUser]]
- [[13-directives/authldapinitialbindpattern|AuthLDAPInitialBindPattern]]
- [[13-directives/authldapbinddn|AuthLDAPBindDN]]
- [[13-directives/authldapbindpassword|AuthLDAPBindPassword]]
- [[13-directives/authldapcharsetconfig|AuthLDAPCharsetConfig]]
- [[13-directives/authldapcompareasuser|AuthLDAPCompareAsUser]]
- [[13-directives/authldapcomparednonserver|AuthLDAPCompareDNOnServer]]
- [[13-directives/authldapdereferencealiases|AuthLDAPDereferenceAliases]]
- [[13-directives/authldapgroupattribute|AuthLDAPGroupAttribute]]
- [[13-directives/authldapgroupattributeisdn|AuthLDAPGroupAttributeIsDN]]
- [[13-directives/authldapmaxsubgroupdepth|AuthLDAPMaxSubGroupDepth]]
- [[13-directives/authldapremoteuserattribute|AuthLDAPRemoteUserAttribute]]
- [[13-directives/authldapremoteuserisdn|AuthLDAPRemoteUserIsDN]]
- [[13-directives/authldapsearchasuser|AuthLDAPSearchAsUser]]
- [[13-directives/authldapsubgroupattribute|AuthLDAPSubGroupAttribute]]
- [[13-directives/authldapsubgroupclass|AuthLDAPSubGroupClass]]
- [[13-directives/authldapurl|AuthLDAPURL]]

## Voir aussi

- [[12-modules/mod_ldap|mod_ldap]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
