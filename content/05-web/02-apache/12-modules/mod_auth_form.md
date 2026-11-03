---
title: "mod_auth_form"
description: "Module Apache mod_auth_form — Authentification à l'aide d'un formulaire. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_auth_form]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Authentification à l'aide d'un formulaire |
| **Statut** | Base |
| **Identificateur** | `auth_form_module` |
| **Fichier source** | `mod_auth_form.c` |
| **Compatibilité** | Disponible à partir d'Apache 2.3 |

## Sommaire

> [!WARNING]
> **Avertissement**
>
> L'authentification à base de formulaire dépend des modules [[12-modules/mod_session|mod_session]] qui utilisent les cookies HTTP, et en tant que tels s'exposent à des attaques de type Cross Site Scripting, ou risquent de divulguer des informations à caractère privé aux clients. Assurez-vous que ces risques ont bien été pris en compte avant d'activer les sessions sur votre serveur.

Ce module permet de restreindre l'accès en recherchant les utilisateurs dans les fournisseurs spécifiés à l'aide d'un formulaire de connexion HTML. Les formulaires HTML requièrent davantage de configuration que les méthodes d'authentification alternatives, mais ils peuvent s'avérer beaucoup plus conviviaux pour les utilisateurs.

L'authentification HTTP de base est fournie par le module [[12-modules/mod_auth_basic|mod_auth_basic]], et l'authentification HTTP à base de condensé par le module [[12-modules/mod_auth_digest|mod_auth_digest]]. Le module [[12-modules/mod_auth_form|mod_auth_form]] doit être utilisé avec au moins un module d'authentification du style [[12-modules/mod_authn_file|mod_authn_file]] et un module d'autorisation comme [[12-modules/mod_authz_user|mod_authz_user]].

Lorsque l'utilisateur a été authentifié avec succès, ses informations de connexion sont stockés dans une session fournie par le module [[12-modules/mod_session|mod_session]].

## Configuration de base

Pour protéger une URL particulière avec le module [[12-modules/mod_auth_form|mod_auth_form]], vous devez déterminer l'endroit où vous allez stocker votre *session*, ainsi que la méthode d'authentification. Dans cet exemple simple, les informations de connexion sont stockées dans une session à l'aide du module [[12-modules/mod_session_cookie|mod_session_cookie]], et l'authentification utilise un fichier en s'appuyant sur le module [[12-modules/mod_authn_file|mod_authn_file]]. Si l'authentification échoue, l'utilisateur dera redirigé vers la page du formulaire de connexion.

**Exemple simple**

```apache
<Location "/admin">
    AuthFormProvider file
    AuthUserFile "conf/passwd"
    AuthType form
    AuthName "/admin"
    AuthFormLoginRequiredLocation "http://example.com/login.html"

    Session On
    SessionCookieName session path=/

    Require valid-user
</Location>
```

L'authentification [[12-modules/mod_auth_form|mod_auth_form]] est activée en affectant la valeur *form* à la directive [[13-directives/authtype|AuthType]]. Les directives [[13-directives/authformprovider|AuthFormProvider]] et [[13-directives/authuserfile|AuthUserFile]] spécifient que les noms d'utilisateurs et mots de passe seront vérifiés en utilisant le fichier choisi.

Les directives [[13-directives/session|Session]] et [[13-directives/sessioncookiename|SessionCookieName]] créent une session chiffrée stockée dans un cookie HTTP au niveau du navigateur. Pour plus d'informations à propos des différentes options de configuration des sessions, reportez-vous à la documentation du module [[12-modules/mod_session|mod_session]].

Vous pouvez éventuellement ajouter une directive [[13-directives/sessioncryptopassphrase|SessionCryptoPassphrase]] pour créer un cookie de session chiffré. Pour utiliser cette directive, le module [[12-modules/mod_session_crypto|mod_session_crypto]] doit avoir été préalablement chargé.

Dans l'exemple simple ci-dessus, une URL a été protégée par [[12-modules/mod_auth_form|mod_auth_form]], mais on doit maintenant fournir à l'utilisateur un moyen d'entrer un nom et un mot de passe. À cet effet, on peut soit écrire une page de connexion indépendante dédiée, soit inclure le formulaire de connexion dans la page courante.

## Page de connexion dédiée

Le formulaire de connexion peut être contenu dans une page indépendante, ou être inclus dans la page courante.

Lorsque la connexion s'effectue à partir d'une page indépendante et si la tentative d'authentification échoue, l'utilisateur doit être redirigé vers un formulaire de connexion, créé à cet effet sur le site web, en utilisant la directive [[13-directives/authformloginrequiredlocation|AuthFormLoginRequiredLocation]]. En général, la page de connexion contiendra un formulaire HTML demandant à l'utilisateur de fournir un nom et un mot de passe.

**Exemple de formulaire de connexion**

```xml
<form method="POST" action="/dologin.html">
  Username: <input type="text" name="httpd_username" value="" />
  Password: <input type="password" name="httpd_password" value="" />
  <input type="submit" name="login" value="Login" />
</form>
```

La partie où s'effectue la connexion proprement dite est traitée par le gestionnaire *form-login-handler*. L'action de ce formulaire doit pointer vers ce gestionnaire, ce que l'on configure dans Apache httpd comme suit :

**Exemple de configuration du gestionnaire de formulaire de connexion**

```apache
<Location "/dologin.html">
    SetHandler form-login-handler
    AuthFormLoginRequiredLocation "http://example.com/login.html"
    AuthFormLoginSuccessLocation "http://example.com/admin/index.html"
    AuthFormProvider file
    AuthUserFile "conf/passwd"
    AuthType form
    AuthName /admin
    Session On
    SessionCookieName session path=/
    SessionCryptoPassphrase secret
</Location>
```

L'URL spécifiée par la directive [[13-directives/authformloginrequiredlocation|AuthFormLoginRequiredLocation]] référencera en général une page expliquant à l'utilisateur que sa tentative de connexion a échoué, et qu'il doit la renouveler. La directive [[13-directives/authformloginsuccesslocation|AuthFormLoginSuccessLocation]] spécifie l'URL vers laquelle l'utilisateur doit être redirigé s'il s'est authentifié avec succès.

Alternativement, l'URL vers laquelle doit être redirigé l'utilisateur s'il s'est authentifié avec succès peut être intégrée dans le formulaire de connexion, comme dans l'exemple ci-dessous. Il en découle que le même gestionnaire *form-login-handler* pourra être utilisé pour différentes zones du site web.

**Exemple de formulaire d'authentification multizone**

```xml
<form method="POST" action="/dologin.html">
  Username: <input type="text" name="httpd_username" value="" />
  Password: <input type="password" name="httpd_password" value="" />
  <input type="submit" name="login" value="Login" />
  <input type="hidden" name="httpd_location" value="http://example.com/success.html" />
</form>
```

## Connexion à la volée

> [!WARNING]
> **Avertissement**
>
> Il existe un risque, dans certaines circonstances, que le formulaire de connexion configuré pour une connexion à la volée soit soumis plusieurs fois, révélant de ce fait les paramètres de connexion à l'application sous-jacente. L'administrateur doit s'assurer que cette dernière est correctement sécurisée afin d'éviter les éventuels abus. En cas de doute, utilisez une page de connexion indépendante dédiée.

Comme alternative à la page de connexion dédiée pour un site web, il est possible de configurer [[12-modules/mod_auth_form|mod_auth_form]] pour authentifier les utilisateurs à la volée, sans les rediriger vers une autre page, ce qui permet de conserver l'état de la page courante au cours de la tentative de connexion. Ceci peut s'avérer utile dans le cas d'une session limitée dans le temps, si le délai de la session a expiré pendant la requête de l'utilisateur. Ce dernier peut alors se réauthentifier à la même place, et poursuivre son activité à partir du point où il en était resté.

Si un utilisateur non authentifié tente d'accéder à une page protégée par [[12-modules/mod_auth_form|mod_auth_form]], et si ce dernier n'est pas configuré avec une directive [[13-directives/authformloginrequiredlocation|AuthFormLoginRequiredLocation]], un code de statut *HTTP\_UNAUTHORIZED* est renvoyé vers le navigateur, indiquant à l'utilisateur qu'il n'est pas autorisé à accéder à cette page.

Pour configurer l'authentification à la volée, l'administrateur remplace le message d'erreur renvoyé par le code de statut *HTTP\_UNAUTHORIZED* par un message d'erreur personnalisé contenant le formulaire de connexion comme suit :

**Exemple simple d'authentification à la volée**

```apache
AuthFormProvider file
ErrorDocument 401 "/login.shtml"
AuthUserFile "conf/passwd"
AuthType form
AuthName realm
Session On
SessionCookieName session path=/
```

La page du message d'erreur doit contenir un formulaire de connexion dont la propriété action est vide, comme dans l'exemple ci-dessous. Ceci a pour effet de soumettre le formulaire à l'URL protégée originale, cette dernière n'ayant pas besoin d'être connue de la page en cours.

**Exemple de formulaire de connexion à la volée**

```xml
<form method="POST" action="">
  Username: <input type="text" name="httpd_username" value="" />
  Password: <input type="password" name="httpd_password" value="" />
  <input type="submit" name="login" value="Login" />
</form>
```

Lorsque l'utilisateur final a entré ses informations de connexion, le formulaire effectue une requête HTTP POST pour l'URL originale protégée par mot de passe. [[12-modules/mod_auth_form|mod_auth_form]] va alors intercepter cette requête POST, et dans le cas où des champs HTML Utilisateur et Mot de passe corrects sont présents, l'utilisateur sera connecté, et l'URL originale protégée par mot de passe lui sera retournée en tant que requête GET.

## Connexion à la volée avec conservation du contenu

Il existe une limite à la technique de connexion à la volée décrite ci-dessus ; si un formulaire HTML POST entraîne une demande d'authentification ou de réauthentification, le contenu du formulaire original envoyé par le navigateur sera perdu. Cela peut s'avérer plus ou moins gênant pour l'utilisateur final selon la fonction du site web.

Comme solution à ce problème, [[12-modules/mod_auth_form|mod_auth_form]] permet d'intégrer la méthode et le contenu de la requête originale dans le formulaire de connexion. Si l'authentification réussit, Apache httpd pourra refaire une tentative avec la méthode et le contenu originaux, tout en conservant l'état de la requête originale.

Pour mettre en oeuvre la conservation du contenu, vous devez ajouter trois champs supplémentaires au formulaire de connexion comme dans l'exemple suivant :

**Exemple de formulaire avec conservation du contenu**

```xml
<form method="POST" action="">
  Username: <input type="text" name="httpd_username" value="" />
  Password: <input type="password" name="httpd_password" value="" />
  <input type="submit" name="login" value="Login" />
     <input type="hidden" name="httpd_method" value="POST" /> <input type="hidden" name="httpd_mimetype" value="application/x-www-form-urlencoded" /> <input type="hidden" name="httpd_body" value="name1=value1&name2=value2" />
</form>
```

La manière dont la méthode, le type MIME et le contenu de la requête originale seront intégrés dans le formulaire de connexion vont dépendre de la plate-forme et de la technologie utilisées au sein du site web.

Une option consiste à utiliser le module [[12-modules/mod_include|mod_include]] en association avec la directive [[13-directives/keptbodysize|KeptBodySize]], ainsi qu'un script CGI adapté pour intégrer les variables dans le formulaire.

Une autre option consiste à présenter le formulaire de connexion en utilisant un script CGI ou une autre technologie dynamique.

**Exemple avec script CGI**

```apache
AuthFormProvider file
ErrorDocument 401 "/cgi-bin/login.cgi"
...
```

## Déconnexion

Pour permettre à un utilisateur de se déconnecter d'une session particulière, vous devez configurer une page pour qu'elle soit traitée par le gestionnaire *form-logout-handler*. Tout accès à cette URL va entraîner la suppression de l'Utilisateur et du Mot de passe de la session courante, ce qui aura pour effet de déconnecter l'utilisateur.

Vous pouvez spécifier une URL vers laquelle le navigateur sera redirigé en cas de déconnection réussie, en définissant la directive [[13-directives/authformlogoutlocation|AuthFormLogoutLocation]]. Cette URL devra expliquer à l'utilisateur qu'il a été déconnecté, et lui donner la possibilité de se connecter à nouveau.

**Exemple simple de configuration de la déconnexion**

```apache
SetHandler form-logout-handler
AuthName realm
AuthFormLogoutLocation "http://example.com/loggedout.html"
Session On
SessionCookieName session path=/
```

Notez que la déconnexion d'un utilisateur ne supprime pas la session ; elle supprime seulement l'utilisateur et le mot de passe de la session. Si la session qui en résulte est vide, elle sera probablement supprimée, mais ce n'est pas garanti. Si vous voulez être sûr que la session sera supprimée, affectez une valeur faible à la directive [[13-directives/sessionmaxage|SessionMaxAge]], par exemple 1 (affecter à cette directive la valeur zéro signifie une session sans limite d'âge).

**Exemple simple avec durée de validité de session limitée**

```apache
SetHandler form-logout-handler
AuthFormLogoutLocation "http://example.com/loggedout.html"
Session On
SessionMaxAge 1
SessionCookieName session path=/
```

## Noms d'utilisateurs et mots de passe

Notez que la soumission d'un formulaire implique l'encodage URL (URLEncoding) des données du formulaire, ici le nom d'utilisateur et le mot de passe. Vous devez donc choisir des noms d'utilisateurs et mots de passe qui ne contiennent pas de caractères susceptibles d'être encodés URL lors de la soumission du formulaire, sous peine d'obtenir des résultats inattendus.

## Directives

- [[13-directives/authformprovider|AuthFormProvider]]
- [[13-directives/authformauthoritative|AuthFormAuthoritative]]
- [[13-directives/authformusername|AuthFormUsername]]
- [[13-directives/authformpassword|AuthFormPassword]]
- [[13-directives/authformlocation|AuthFormLocation]]
- [[13-directives/authformmethod|AuthFormMethod]]
- [[13-directives/authformmimetype|AuthFormMimetype]]
- [[13-directives/authformbody|AuthFormBody]]
- [[13-directives/authformsize|AuthFormSize]]
- [[13-directives/authformloginrequiredlocation|AuthFormLoginRequiredLocation]]
- [[13-directives/authformloginsuccesslocation|AuthFormLoginSuccessLocation]]
- [[13-directives/authformfakebasicauth|AuthFormFakeBasicAuth]]
- [[13-directives/authformlogoutlocation|AuthFormLogoutLocation]]
- [[13-directives/authformdisablenostore|AuthFormDisableNoStore]]
- [[13-directives/authformsitepassphrase|AuthFormSitePassphrase]]

## Voir aussi

- [[12-modules/mod_session|mod_session]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
