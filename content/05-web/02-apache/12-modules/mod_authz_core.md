---
title: "mod_authz_core"
description: "Module Apache mod_authz_core — Socle d'autorisation. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_authz_core]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Socle d'autorisation |
| **Statut** | Base |
| **Identificateur** | `authz_core_module` |
| **Fichier source** | `mod_authz_core.c` |
| **Compatibilité** | Disponible depuis la version 2.3 d'Apache HTTPD |

## Sommaire

Ce module fournit un socle de fonctionnalités d'autorisation permettant d'accorder ou refuser l'accès à certaines zones du site web aux utilisateurs authentifiés. [[12-modules/mod_authz_core|mod_authz_core]] donne la possibilité d'enregistrer divers fournisseurs d'autorisation. Il est en général utilisé avec un module fournisseur d'authentification comme [[12-modules/mod_authn_file|mod_authn_file]], et un module d'autorisation comme [[12-modules/mod_authz_user|mod_authz_user]]. Il permet aussi l'application d'une logique élaborée au déroulement du processus d'autorisation.

## Conteneurs d'autorisation

Les directives de conteneur d'autorisation [[13-directives/requireall|<RequireAll>]], [[13-directives/requireany|<RequireAny>]] et [[13-directives/requirenone|<RequireNone>]] peuvent être combinées entre elles et avec la directive [[13-directives/require|Require]] pour construire une logique d'autorisation complexe.

L'exemple ci-dessous illustre la logique d'autorisation suivante. Pour pouvoir accéder à la ressource, l'utilisateur doit être l'utilisateur `superadmin`, ou appartenir aux deux groupes LDAP `admins` et `Administrateurs` et soit appartenir au groupe `ventes`, soit avoir `ventes` comme valeur de l'attribut LDAP `dept`. De plus, pour pouvoir accéder à la ressource, l'utilisateur ne doit appartenir ni au groupe `temps`, ni au groupe LDAP `Employés temporaires`.

```apache
<Directory "/www/mydocs">
    <RequireAll>
        <RequireAny>
            Require user superadmin
            <RequireAll>
            Require group admins
            Require ldap-group "cn=Administrateurs,o=Airius"
                <RequireAny>
                Require group ventes
                Require ldap-attribute dept="ventes"
                </RequireAny>
            </RequireAll>
        </RequireAny>
        <RequireNone>
            Require group temps
            Require ldap-group "cn=Employés temporaires,o=Airius"
        </RequireNone>
    </RequireAll>
</Directory>
```

## États des résultats d’autorisation

Chaque fournisseur d’autorisation renvoie un résultat parmi trois possibles lorsqu’il évalue une directive [[13-directives/require|Require]] :

**Granted**

Le fournisseur a vérifié que la requête satisfait à ses conditions.

**Denied**

Le fournisseur a déterminé que la requête ne satisfait pas à ses conditions.

**Neutral**

Le fournisseur n’a pas d’opinion à propos de la requête. Cela peut se produire lorsqu’un fournisseur n’est pas pertinent pour la requête (par exemple, une vérification d’appartenance à un groupe alors que la requête n’implique pas d’autorisation basée sur le groupe).

Les directives de conteneur d’autorisation interprètent ces trois résultats comme suit :

| Conteneur | Autorisé si... | Refusé si... | Neutre traité comme... |
| --- | --- | --- | --- |
| [[13-directives/requireany\|<RequireAny>]] | au moins un fournisseur autorise | tous les fournisseurs refusent | refus (ne satisfait pas aux conditions) |
| [[13-directives/requireall\|<RequireAll>]] | aucun fournisseur ne refuse (et au moins un autorise) | tout fournisseur refuse | autorise (ne bloque pas la vérification) |
| [[13-directives/requirenone\|<RequireNone>]] | aucun fournisseur n’autorise | tout fournisseur autorise | autorise (ne bloque pas la vérification) |

Quand une directive `Require` est inversée avec `not` (par exemple, `Require not group temps`), un résultat autorisé est inversé en refusé et vice-versa, mais un résultat neutre reste neutre. Une directive inversée ne peut donc jamais autoriser une requête indépendamment.

## Les directives Require

Le module [[12-modules/mod_authz_core|mod_authz_core]] met à disposition des fournisseurs d'autorisation génériques utilisables avec la directive [[13-directives/require|Require]].

### Require env

Le fournisseur `env` permet de contrôler l'accès au serveur en fonction de l'existence d'une [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement|variable d'environnement]]. Lorsque `Require env env-variable` est spécifié, la requête se voit autoriser l'accès si la variable d'environnement *env-variable* existe. Le serveur permet de définir facilement des variables d'environnement en fonction des caractéristiques de la requête du client via les directives fournies par le module [[12-modules/mod_setenvif|mod_setenvif]]. Cette directive Require env permet donc de contrôler l'accès en fonction des valeurs des en-têtes de la requête HTTP tels que `User-Agent` (type de navigateur), `Referer`, entre autres.

```apache
SetEnvIf User-Agent "^KnockKnock/2\.0" let_me_in
<Directory "/docroot">
    Require env let_me_in
</Directory>
```

Avec cet exemple, les navigateurs dont la chaîne user-agent commence par `KnockKnock/2.0` se verront autoriser l'accès, alors que tous les autres seront rejetés.

Lorsque le serveur cherche un chemin via une sous-requête interne (par exemple la recherche d'un [[13-directives/directoryindex|DirectoryIndex]]), ou lorsqu'il génère un listing du contenu d'un répertoire via le module [[12-modules/mod_autoindex|mod_autoindex]], la sous-requête n'hérite pas des variables d'environnement spécifiques à la requête. En outre, à cause des phases de l'API auxquelles [[12-modules/mod_setenvif|mod_setenvif]] prend part, les directives [[13-directives/setenvif|SetEnvIf]] ne sont pas évaluées séparément dans la sous-requête.

### Require all

Le fournisseur `all` reproduit la fonctionnalité précédemment fournie par les directives 'Allow from all' et 'Deny from all'. Il accepte un argument dont les deux valeurs possibles sont : 'granted' ou 'denied'. Les exemples suivants autorisent ou interdisent l'accès à toutes les requêtes.

```apache
Require all granted
```

```apache
Require all denied
```

### Require method

Le fournisseur `method` permet d'utiliser la méthode HTTP dans le processus d'autorisation. Les méthodes GET et HEAD sont ici considérées comme équivalentes. La méthode TRACE n'est pas supportée par ce fournisseur ; utilisez à la place la directive [[13-directives/traceenable|TraceEnable]].

Dans l'exemple suivant, seules les méthodes GET, HEAD, POST, et OPTIONS sont autorisées :

```apache
Require method GET POST OPTIONS
```

Dans l'exemple suivant, les méthodes GET, HEAD, POST, et OPTIONS sont autorisées sans authentification, alors que toutes les autres méthodes nécessitent un utilisateur valide :

```apache
<RequireAny>
     Require method GET POST OPTIONS
     Require valid-user
</RequireAny>
```

### Require expr

Le fournisseur `expr` permet d'accorder l'autorisation d'accès en fonction d'expressions arbitraires.

```apache
Require expr "%{TIME_HOUR} -ge 9 && %{TIME_HOUR} -le 17"
```

```apache
<RequireAll>
    Require expr "!(%{QUERY_STRING} =~ /secret/)"
    Require expr "%{REQUEST_URI} in { '/example.cgi', '/other.cgi' }"
</RequireAll>
```

```apache
Require expr "!(%{QUERY_STRING} =~ /secret/) && %{REQUEST_URI} in { '/example.cgi', '/other.cgi' }"
```

La syntaxe de l'expression est décrite dans la documentation de [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|ap_expr]]. Avant la version 2.4.16, les doubles-quotes étaient prohibées.

Normalement, l'expression est évaluée avant l'authentification. Cependant, si l'expression renvoie false et se réfère à la variable `%{REMOTE_USER}`, le processus d'authentification sera engagé et l'expression réévaluée.

## Création des alias du fournisseur d'autorisation

Il est possible de créer des fournisseurs d'autorisation étendus dans le fichier de configuration et de leur assigner un nom d'alias. On peut ensuite utiliser ces fournisseurs aliasés dans une directive [[13-directives/require|Require]] de la même manière qu'on le ferait pour des fournisseurs d'autorisation de base. En plus de la possibilité de créer et d'aliaser un fournisseur étendu, le même fournisseur d'autorisation étendu peut être référencé par diverses localisations.

### Exemple

Dans l'exemple suivant, on crée deux alias de fournisseur d'autorisation ldap différents basés sur le fournisseur d'autorisation ldap-group. Il est ainsi possible pour un seul répertoire de vérifier l'appartenance à un groupe dans plusieurs serveurs ldap :

```apache
<AuthzProviderAlias ldap-group ldap-group-alias1 "cn=my-group,o=ctx">
    AuthLDAPBindDN "cn=youruser,o=ctx"
    AuthLDAPBindPassword yourpassword
    AuthLDAPUrl "ldap://ldap.host/o=ctx"
</AuthzProviderAlias>

<AuthzProviderAlias ldap-group ldap-group-alias2 "cn=my-other-group,o=dev">
    AuthLDAPBindDN "cn=yourotheruser,o=dev"
    AuthLDAPBindPassword yourotherpassword
    AuthLDAPUrl "ldap://other.ldap.host/o=dev?cn"
</AuthzProviderAlias>

Alias "/secure" "/webpages/secure"
<Directory "/webpages/secure">
    AuthType Basic
    AuthName "LDAP Protected"
    AuthBasicProvider ldap
    AuthLDAPUrl "ldap://ldap.host/o=ctx"

    #Opération logique implicite : OU inclusif
    Require ldap-group-alias1
    Require ldap-group-alias2
</Directory>
```

## Directives

- [[13-directives/require|Require]]
- [[13-directives/requireall|<RequireAll>]]
- [[13-directives/requireany|<RequireAny>]]
- [[13-directives/requirenone|<RequireNone>]]
- [[13-directives/authmerging|AuthMerging]]
- [[13-directives/authzprovideralias|<AuthzProviderAlias>]]
- [[13-directives/authzsendforbiddenonfailure|AuthzSendForbiddenOnFailure]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
