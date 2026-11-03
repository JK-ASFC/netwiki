---
title: "mod_authnz_fcgi"
description: "Module Apache mod_authnz_fcgi — Permet à une application d'autorisation FastCGI de gérer l'authentification et l'autorisation httpd. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_authnz_fcgi]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Permet à une application d'autorisation FastCGI de gérer l'authentification et l'autorisation httpd. |
| **Statut** | Extension |
| **Identificateur** | `authnz_fcgi_module` |
| **Fichier source** | `mod_authnz_fcgi.c` |
| **Compatibilité** | Disponible à partir de la version 2.4.10 du serveur HTTP Apache |

## Sommaire

Ce module permet aux applications d'autorisation FastCGI d'authentifier les utilisateurs et de contrôler leur accès aux ressources. Il supporte les systèmes d'autorisation FastCGI génériques qui participent en une seule phase à l'authentification et à l'autorisation, ainsi que les processus d'authentification et d'autorisation spécifiques à Apache httpd qui interviennent en une ou plusieurs phases.

Les processus d'autorisation FastCGI peuvent authentifier un utilisateur via son identificateur et son mot de passe comme dans le processus d'authentification basique, ou via un mécanisme arbitraire.

## Modes d'invocation

Les modes d'invocation des processus d'autorisation FastCGI que ce module supporte se distinguent par deux caractéristiques : le *type* et le *mécanisme* d'authentification.

Le *Type* est simplement `authn` pour l'authentification, `authz` pour l'autorisation et `authnz` l'authentification et l'autorisation.

Le *mécanisme* d'authentification fait référence aux mécanismes d'authentification et aux phases de traitement de la configuration de Apache httpd, et peut être `AuthBasicProvider`, `Require`, ou `check_user_id`. Les deux premiers mécanismes correspondent aux directives utilisées pour participer aux phases de traitement appropriées.

Description de chaque mode:

***Type* `authn`, *mechanism* `AuthBasicProvider`**

Dans ce mode, la variable `FCGI_ROLE` est définie à `AUTHORIZER`, et la variable `FCGI_APACHE_ROLE` à `AUTHENTICATOR`. L'application doit être spécifiée en tant que fournisseur de type *authn* via la directive [[13-directives/authnzfcgidefineprovider|AuthnzFcgiDefineProvider]], et activée via la directive [[13-directives/authbasicprovider|AuthBasicProvider]]. Lorsqu'elle est invoquée, l'application est censée authentifier le client à l'aide de l'identifiant et du mot de passe de l'utilisateur. Exemple d'application :

```perl
#!/usr/bin/perl
use FCGI;
my $request = FCGI::Request();
while ($request->Accept() >= 0) {
    die if $ENV{'FCGI_APACHE_ROLE'} ne "AUTHENTICATOR";
    die if $ENV{'FCGI_ROLE'}        ne "AUTHORIZER";
    die if !$ENV{'REMOTE_PASSWD'};
    die if !$ENV{'REMOTE_USER'};

    print STDERR "This text is written to the web server error log.\n";

    if ( ($ENV{'REMOTE_USER' } eq "foo" || $ENV{'REMOTE_USER'} eq "foo1") &&
        $ENV{'REMOTE_PASSWD'} eq "bar" ) {
        print "Status: 200\n";
        print "Variable-AUTHN_1: authn_01\n";
        print "Variable-AUTHN_2: authn_02\n";
        print "\n";
    }
    else {
        print "Status: 401\n\n";
    }
}
```

Exemple de configuration httpd :

```apache
AuthnzFcgiDefineProvider authn FooAuthn fcgi://localhost:10102/
<Location "/protected/">
  AuthType Basic
  AuthName "Restricted"
  AuthBasicProvider FooAuthn
  Require ...
</Location>
```

***Type* `authz`, *mechanism* `Require`**

Dans ce mode, la variable `FCGI_ROLE` est définie à `AUTHORIZER` et `FCGI_APACHE_ROLE` à `AUTHORIZER`. L'application doit être spécifiée en tant que fournisseur de type *authz* via la directive [[13-directives/authnzfcgidefineprovider|AuthnzFcgiDefineProvider]]. Lorsqu'elle est invoquée, l'application est censée contrôler les accès du client à l'aide de l'identifiant utilisateur et d'autres données contenues dans la requête. Exemple d'application :

```perl
#!/usr/bin/perl
use FCGI;
my $request = FCGI::Request();
while ($request->Accept() >= 0) {
    die if $ENV{'FCGI_APACHE_ROLE'} ne "AUTHORIZER";
    die if $ENV{'FCGI_ROLE'}        ne "AUTHORIZER";
    die if $ENV{'REMOTE_PASSWD'};

    print STDERR "This text is written to the web server error log.\n";

    if ($ENV{'REMOTE_USER'} eq "foo1") {
        print "Status: 200\n";
        print "Variable-AUTHZ_1: authz_01\n";
        print "Variable-AUTHZ_2: authz_02\n";
        print "\n";
    }
    else {
        print "Status: 403\n\n";
    }
}
```

Exemple de configuration httpd :

```apache
AuthnzFcgiDefineProvider authz FooAuthz fcgi://localhost:10103/
<Location "/protected/">
  AuthType ...
  AuthName ...
  AuthBasicProvider ...
  Require FooAuthz
</Location>
```

***Type* `authnz`, *mechanism* `AuthBasicProvider` *+* `Require`**

Dans ce mode qui supporte le protocole d'autorisation web server-agnostic FastCGI, la variable `FCGI_ROLE` est définie à `AUTHORIZER` et `FCGI_APACHE_ROLE` n'est pas définie. L'application doit être spécifiée en tant que fournisseur de type *authnz* via la directive [[13-directives/authnzfcgidefineprovider|AuthnzFcgiDefineProvider]]. L'application est censée assurer l'authentification et l'autorisation au cours d'une même invocation à l'aide de l'identifiant et du mot de passe de l'utilisateur et d'autres données contenues dans la requête. L'invocation de l'application intervient au cours de la phase d'authentification de l'API Apache httpd. Si l'application renvoie le code 200, et si le même fournisseur est invoqué au cours de la phase d'autorisation (via une directive `Require`), mod\_authnz\_fcgi renverra un code de type success pour la phase d'autorisation sans invoquer l'application. Exemple d'application :

```perl
#!/usr/bin/perl
use FCGI;
my $request = FCGI::Request();
while ($request->Accept() >= 0) {
    die if $ENV{'FCGI_APACHE_ROLE'};
    die if $ENV{'FCGI_ROLE'} ne "AUTHORIZER";
    die if !$ENV{'REMOTE_PASSWD'};
    die if !$ENV{'REMOTE_USER'};

    print STDERR "This text is written to the web server error log.\n";

    if ( ($ENV{'REMOTE_USER' } eq "foo" || $ENV{'REMOTE_USER'} eq "foo1") &&
        $ENV{'REMOTE_PASSWD'} eq "bar" &&
        $ENV{'REQUEST_URI'} =~ m%/bar/.*%) {
        print "Status: 200\n";
        print "Variable-AUTHNZ_1: authnz_01\n";
        print "Variable-AUTHNZ_2: authnz_02\n";
        print "\n";
    }
    else {
        print "Status: 401\n\n";
    }
}
```

Exemple de configuration httpd :

```apache
AuthnzFcgiDefineProvider authnz FooAuthnz fcgi://localhost:10103/
<Location "/protected/">
  AuthType Basic
  AuthName "Restricted"
  AuthBasicProvider FooAuthnz
  Require FooAuthnz
</Location>
```

***Type* `authn`, *mechanism* `check_user_id`**

Dans ce mode, la variable `FCGI_ROLE` est définie à `AUTHORIZER` et `FCGI_APACHE_ROLE` à `AUTHENTICATOR`. L'application doit être spécifiée en tant que fournisseur de type *authn* via une directive [[13-directives/authnzfcgidefineprovider|AuthnzFcgiDefineProvider]]. La directive [[13-directives/authnzfcgicheckauthnprovider|AuthnzFcgiCheckAuthnProvider]] permet de l'invoquer. Exemple d'application :

```perl
#!/usr/bin/perl
use FCGI;
my $request = FCGI::Request();
while ($request->Accept() >= 0) {
    die if $ENV{'FCGI_APACHE_ROLE'} ne "AUTHENTICATOR";
    die if $ENV{'FCGI_ROLE'} ne "AUTHORIZER";

    # This authorizer assumes that the RequireBasicAuth option of
    # AuthnzFcgiCheckAuthnProvider is On:
    die if !$ENV{'REMOTE_PASSWD'};
    die if !$ENV{'REMOTE_USER'};

    print STDERR "This text is written to the web server error log.\n";

    if ( ($ENV{'REMOTE_USER' } eq "foo" || $ENV{'REMOTE_USER'} eq "foo1") &&
        $ENV{'REMOTE_PASSWD'} eq "bar" ) {
        print "Status: 200\n";
        print "Variable-AUTHNZ_1: authnz_01\n";
        print "Variable-AUTHNZ_2: authnz_02\n";
        print "\n";
    }
    else {
        print "Status: 401\n\n";
        # If a response body is written here, it will be returned to
        # the client.
    }
}
```

Exemple de configuration httpd :

```apache
AuthnzFcgiDefineProvider authn FooAuthn fcgi://localhost:10103/
<Location "/protected/">
  AuthType ...
  AuthName ...
  AuthnzFcgiCheckAuthnProvider FooAuthn \
                               Authoritative On \
                               RequireBasicAuth Off \
                               UserExpr "%{reqenv:REMOTE_USER}"
  Require ...
</Location>
```

## Exemples supplémentaires

1. Si votre application supporte séparément les rôles d'authentification et d'autorisation (`AUTHENTICATOR` et `AUTHORIZER`), vous pouvez définir des fournisseurs séparés comme suit, même s'ils correspondent à la même application :

   ```apache
   AuthnzFcgiDefineProvider authn  FooAuthn  fcgi://localhost:10102/
   AuthnzFcgiDefineProvider authz  FooAuthz  fcgi://localhost:10102/
   ```

   Spécifie le fournisseur authn via la directive [[13-directives/authbasicprovider|AuthBasicProvider]] et le fournisseur authz via la directive [[13-directives/require|Require]]:

   ```apache
   AuthType Basic
   AuthName "Restricted"
   AuthBasicProvider FooAuthn
   Require FooAuthz
   ```
2. Si votre application supporte le rôle générique `AUTHORIZER` (authentification et autorisation en une seule invocation), vous pouvez définir un fournisseur unique comme suit :

   ```apache
   AuthnzFcgiDefineProvider authnz FooAuthnz fcgi://localhost:10103/
   ```

   Spécifie le fournisseur authnz via les directives `AuthBasicProvider` et `Require` :

   ```apache
   AuthType Basic
   AuthName "Restricted"
   AuthBasicProvider FooAuthnz
   Require FooAuthnz
   ```

## Limitations

Les fonctionnalités suivantes ne sont pas encore implémentées :

**Vérificateur d'accès d'Apache httpd**

La phase *access check* de l'API Apache httpd est distincte des phases d'authentification et d'autorisation. Certaines autres implémentations de FastCGI supportent cette phase et lorsque c'est le cas, la variable `FCGI_APACHE_ROLE` est définie à `ACCESS_CHECKER`.

**Redirections (pipes) ou sockets locaux (Unix)**

Seuls les sockets TCP sont actuellement supportés.

**Support de mod\_authn\_socache**

Le support de l'interaction avec mod\_authn\_socache pour les applications qui interviennent dans le processus d'authentification d'Apache httpd serait souhaitable.

**Support de l'authentification de type digest à l'aide de AuthDigestProvider**

Cette limitation ne sera probablement jamais franchie car il n'existe aucun flux de données d'autorisation capable de lire dans un condensé de type hash.

**Gestion des processus applicatifs**

Cette fonctionnalité restera probablement hors de portée de ce module. Il faudra donc gérer les processus applicatifs d'une autre manière ; par exemple, [[10-commandes/fcgistarter|fcgistarter]] permet de les démarrer.

**AP\_AUTH\_INTERNAL\_PER\_URI**

Tous les fournisseurs sont actuellement enregistrés en tant que AP\_AUTH\_INTERNAL\_PER\_CONF, ce qui signifie que les vérifications ne sont pas effectuées pour les sous-requêtes internes avec la même configuration de contrôle d'accès que la requête initiale.

**Conversion du jeu de caractères des données de protocole**

Si mod\_authnz\_fcgi s'exécute dans un environnement de compilation EBCDIC, toutes les données de protocole FastCGI sont écrites en EBCDIC et doivent être disponibles en EBCDIC.

**Plusieurs requêtes pour une connexion**

Actuellement, la connexion au fournisseur d'autorisation FastCGI est fermée après chaque phase de traitement. Par exemple, si le fournisseur d'autorisation gère séparément les phases *authn* et *authz*, deux connexions seront nécessaires.

**Redirection de certains URIs**

Les URIs en provenance des clients ne peuvent pas être redirigés selon une table de redirection, comme avec la directive `ProxyPass` utilisée avec les répondeurs FastCGI.

## Journalisation

1. Les erreurs de traitement sont journalisées à un niveau `error` ou supérieur.
2. Les messages envoyés par l'application sont journalisés au niveau `warn`.
3. Les messages de deboguage à caractère général sont journalisés au niveau `debug`.
4. Les variables d'environnement transmises à l'application sont journalisées au niveau `trace2`. La valeur de la variable `REMOTE_PASSWD` sera occultée, mais **toute autre donnée sensible sera visible dans le journal**.
5. Toutes les entrées/sorties entre le module et l'application FastCGI, y compris les variables d'environnement, seront journalisées au format imprimable et hexadécimal au niveau `trace5`. **Toutes les données sensibles seront visibles dans le journal.**

La directive [[13-directives/loglevel|LogLevel]] permet de configurer un niveau de journalisation spécifique à mod\_authnz\_fcgi. Par exemple :

```apache
LogLevel info authnz_fcgi:trace8
```

## Directives

- [[13-directives/authnzfcgidefineprovider|AuthnzFcgiDefineProvider]]
- [[13-directives/authnzfcgicheckauthnprovider|AuthnzFcgiCheckAuthnProvider]]

## Voir aussi

- [[11-guides/02-guides-pratiques/authentification-et-autorisation|Authentification, autorisation et contrôle d'accès]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
