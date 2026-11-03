---
title: "mod_lua"
description: "Module Apache mod_lua — Fournit des points d'entrée Lua dans différentes parties du traitement des requêtes httpd. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_lua]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fournit des points d'entrée Lua dans différentes parties du traitement des requêtes httpd |
| **Statut** | Extension |
| **Identificateur** | `lua_module` |
| **Fichier source** | `mod_lua.c` |
| **Compatibilité** | versions 2.3 et supérieures |

## Sommaire

Ce module permet d'ajouter au serveur des extensions sous forme de scripts écrits dans le langage de programmation Lua. [[12-modules/mod_lua|mod_lua]] fournit de nombreuses extensions (hooks) disponibles avec les modules natifs du serveur HTTP Apache, comme les associations de requêtes à des fichiers, la génération de réponses dynamiques, le contrôle d'accès, l'authentification et l'autorisation.

Vous trouverez davantage d'informations à propos du langage de programmation Lua sur [le site web de Lua](http://www.lua.org/).

> [!WARNING]
> **Avertissement**
>
> Ce module possède une grande capacité d'action sur le fonctrionnement de httpd, ce qui lui confère une grande puissance, mais peut aussi induire un risque de sécurité. Il est déconseillé d'utiliser ce module sur un serveur partagé avec des utilisateurs auxquels vous ne pouvez pas accorder une confiance absolue, car il peut permettre de modifier le fonctionnement interne de httpd.

## Configuration de base

La directive de base pour le chargement du module est

```apache
LoadModule lua_module modules/mod_lua.so
```

[[12-modules/mod_lua|mod_lua]] fournit un gestionnaire nommé `lua-script` qui peut être utilisé avec une directive [[13-directives/addhandler|AddHandler]] ou [[13-directives/sethandler|SetHandler]] :

```apache
<Files "*.lua">
    SetHandler lua-script
</Files>
```

Ceci aura pour effet de faire traiter les requêtes pour les fichiers dont l'extension est `.lua` par [[12-modules/mod_lua|mod_lua]] en invoquant cette fonction de `gestion` de fichier.

Pour plus de détails, voir la directive `LuaMapHandler`.

## Ecrire des gestionnaires

Dans l'API du serveur HTTP Apache, un gestionnaire est une sorte de point d'accroche (hook) spécifique responsable de la génération de la réponse. [[12-modules/mod_proxy|mod_proxy]], [[12-modules/mod_cgi|mod_cgi]] et [[12-modules/mod_status|mod_status]] sont des exemples de modules comportant un gestionnaire.

[[12-modules/mod_lua|mod_lua]] cherche toujours à invoquer une fonction Lua pour le gestionnaire, plutôt que de simplement évaluer le corps d'un script dans le style de CGI. Une fonction de gestionnaire se présente comme suit :

```lua
example.lua
-- exemple de gestionnaire

require "string"

--[[
     Il s'agit du nom de méthode par défaut pour les gestionnaires Lua ;
     voir les noms de fonctions optionnels dans la directive
     LuaMapHandler pour choisir un point d'entrée différent.
--]]
function handle(r)
    r.content_type = "text/plain"

    if r.method == 'GET' then
        r:puts("Hello Lua World!\n")
        for k, v in pairs( r:parseargs() ) do
            r:puts( string.format("%s: %s\n", k, v) )
        end
    elseif r.method == 'POST' then
        r:puts("Hello Lua World!\n")
        for k, v in pairs( r:parsebody() ) do
            r:puts( string.format("%s: %s\n", k, v) )
        end
    else
    elseif r.method == 'PUT' then
-- message d'erreur personnalisé
        r:puts("Unsupported HTTP method " .. r.method)
    r.status = 405
        return apache2.OK
    else
-- message d'erreur ErrorDocument
        return 501
    end
    return apache2.OK
end
```

Ce gestionnaire se contente d'afficher les arguments codés d'un uri ou d'un formulaire dans un page au format texte.

Cela signifie que vous pouvez (et êtes encouragé à) avoir plusieurs gestionnaires (ou points d'entrée, ou filtres) dans le même script.

## Ecriture de fournisseurs d'autorisation

[[12-modules/mod_authz_core|mod_authz_core]] fournit une interface d'autorisation de haut niveau bien plus facile à utiliser que dans les hooks correspondants. Le premier argument de la directive [[13-directives/require|Require]] permet de spécifier le fournisseur d'autorisation à utiliser. Pour chaque directive [[13-directives/require|Require]], [[12-modules/mod_authz_core|mod_authz_core]] appellera le fournisseur d'autorisation spécifié, le reste de la ligne constituant les paramètres. Le fournisseur considéré va alors vérifier les autorisations et fournir le résultat dans une valeur de retour.

En général, le fournisseur authz est appelé avant l'authentification. S'il doit connaître le nom d'utilisateur authentifié (ou si l'utilisateur est appelé à être authentifié), le fournisseur doit renvoyer `apache2.AUTHZ_DENIED_NO_USER`, ce qui va déclancher le processus d'authentification et un deuxième appel du fournisseur authz.

La fonction du fournisseur authz ci-dessous accepte deux arguments, une adresse IP et un nom d'utilisateur. Elle autorise l'accès dans le cas où la requête provient de l'adresse IP spécifiée, ou si l'utilisateur authentifié correspond au second argument :

```lua
authz_provider.lua

require 'apache2'

function authz_check_foo(r, ip, user)
    if r.useragent_ip == ip then
        return apache2.AUTHZ_GRANTED
    elseif r.user == nil then
        return apache2.AUTHZ_DENIED_NO_USER
    elseif r.user == user then
        return apache2.AUTHZ_GRANTED
    else
        return apache2.AUTHZ_DENIED
    end
end
```

La configuration suivante enregistre cette fonction en tant que fournisseur `foo`, et la configure por l'URL `/` :

```apache
LuaAuthzProvider foo authz_provider.lua authz_check_foo
<Location "/">
  Require foo 10.1.2.3 john_doe
</Location>
```

## Ecriture de fonctions d'accroche (hooks)

Les fonctions d'accroche déterminent la manière dont les modules (et les scripts Lua) participent au traitement des requêtes. Chaque type d'accroche proposé par le serveur a un rôle spécifique, comme l'association de requêtes au système de fichiers, le contrôle d'accès, ou la définition de types MIME :

| Phase d'accroche | Directive de [[12-modules/mod_lua\|mod_lua]] | Description |
| --- | --- | --- |
| Gestionnaire rapide | [[13-directives/luaquickhandler\|LuaQuickHandler]] | Il s'agit de la première accroche appelée lorsqu'une requête a été associée à un serveur ou un serveur virtuel. |
| Phase de pré-traduction | `LuaHookPreTranslateName` | Cette phase traduit l'URI de la requête en nom de fichier sur le système avant la phase de décodage. Des modules comme [[12-modules/mod_proxy\|mod_proxy]] peuvent agir au cours de cette phase. |
| Phase de traduction | [[13-directives/luahooktranslatename\|LuaHookTranslateName]] | Cette phase traduit l'URI de la requête en nom de fichier sur le système. Ce sont des modules comme [[12-modules/mod_alias\|mod_alias]] et [[12-modules/mod_rewrite\|mod_rewrite]] qui interviennent au cours de cette phase. |
| Choix du lieu de stockage de la ressource | [[13-directives/luahookmaptostorage\|LuaHookMapToStorage]] | Cette phase définit le lieu de stockage de la ressource : physique, en cache ou externe/mandaté. Elle est assurée par les modules de mandat ou de mise en cache. |
| Autorisation d'accès | [[13-directives/luahookaccesschecker\|LuaHookAccessChecker]] | Cette phase vérifie si un client a l'autorisation d'accès à la ressource. Elle s'exécute avant l'authentification de l'utisateur ; il faut donc être prudent. |
| Vérification de l'identifiant utilisateur | [[13-directives/luahookcheckuserid\|LuaHookCheckUserID]] | Cette phase vérifie l'identifiant de l'utilisateur ayant fait l'objet d'une négociation. |
| Vérification de l'autorisation d'accès | [[13-directives/luahookauthchecker\|LuaHookAuthChecker]] ou [[13-directives/luaauthzprovider\|LuaAuthzProvider]] | Cette phase vérifie l'autorisation d'accès d'un utilisateur en fonction des ses paramètres de connexion, comme l'identifiant, le certificat, etc... |
| Vérification du type de la ressource | [[13-directives/luahooktypechecker\|LuaHookTypeChecker]] | Cette phase assigne un type de contenu et un gestionnaire à la ressource. |
| Derniers réglages | [[13-directives/luahookfixups\|LuaHookFixups]] | C'est la dernière phase avant l'activation des gestionnaires de contenu. Toute modification de dernière minute à la requête doit être effectuée ici. |
| Gestionnaire de contenu | fichiers fx. `.lua` ou directive [[13-directives/luamaphandler\|LuaMapHandler]] | C'est durant cette phase que le contenu est traité. Les fichiers sont lus, interprétés, certains sont exécutés, et le résultat obtenu est envoyé au client. |
| Journalisation | [[13-directives/luahooklog\|LuaHookLog]] | Lorsqu'une requête a été traitée, plusieurs phases de journalisation interviennent, et enregistrent leurs résultats dans les fichiers d'erreur ou d'accès. Mod\_lua peut s'intercaler au départ de ce processus et ainsi contrôler la journalisation. |

Les fonctions d'accroche reçoivent l'objet de la requête comme seul argument (sauf LuaAuthzProvider qui reçoit aussi des arguments en provenance de la directive Require). Elles peuvent renvoyer une valeur, selon la fonction, mais il s'agit en général d'un code d'état HTTP ou des valeurs OK, DONE, ou DECLINED, que vous pouvez écrire dans Lua sous la forme `apache2.OK`, `apache2.DONE`, ou `apache2.DECLINED`.

```lua
translate_name.lua
-- exemple d'accroche qui réécrit un URI en chemin du système de fichiers.

require 'apache2'

function translate_name(r)
    if r.uri == "/translate-name" then
        r.filename = r.document_root .. "/find_me.txt"
        return apache2.OK
    end
    -- on ne gère pas cette URL et on donne sa chance à un autre module
    return apache2.DECLINED
end
```

```lua
translate_name2.lua
--[[ exemple d'accroche qui réécrit un URI vers un autre URI. Il renvoie
    un apache2.DECLINED pour permettre à un autre interpréteur d'URL de
    travailler sur la substitution, y compris l'accroche translate_name
    de base dont les tables de correspondances se basent sur DocumentRoot.

     Note: utilisez le drapeau early/late de la directive pour
     l'exécuter avant ou après mod_alias.
--]]

require 'apache2'

function translate_name(r)
    if r.uri == "/translate-name" then
        r.uri = "/find_me.txt"
        return apache2.DECLINED
    end
    return apache2.DECLINED
end
```

## Structures de données

**request\_rec**

request\_rec est considérée en tant que donnée utilisateur. Elle possède une métatable qui vous permet d'accomplir des choses intéressantes. Pour la plus grande partie, elle possède les mêmes champs que la structure request\_rec, la plupart d'entre eux étant accessibles en lecture et écriture (le contenu des champs de la table peut être modifié, mais les champs eux-mêmes ne peuvent pas être établis en tant que tables distinctes).

| **Nom** | **Type Lua** | **Modifiable** | **Description** |
| --- | --- | --- | --- |
| `allowoverrides` | string | non | L'option AllowOverride s'applique à la requête courante. |
| `ap_auth_type` | string | oui | Ce champ contient le type d'authentification effectuée (par exemple `basic`) |
| `args` | string | oui | La chaîne de paramètres de la requête (par exemple `foo=bar&name=johnsmith`) |
| `assbackwards` | boolean | non | contient true s'il s'agit d'une requête de style HTTP/0.9 (par exemple `GET /foo` (sans champs d'en-tête) ) |
| `auth_name` | string | non | La chaîne d'identification utilisée pour la vérification de l'autorisation d'accès (si elle est disponible). |
| `banner` | string | non | La bannière du serveur, par exemple `Apache HTTP Server/2.4.3 openssl/0.9.8c` |
| `basic_auth_pw` | string | non | Le mot de passe pour l'authentification de base envoyé avec la requête, s'il existe |
| `canonical_filename` | string | non | Le nom de fichier canonique de la requête |
| `content_encoding` | string | non | Le type de codage du contenu de la requête courante |
| `content_type` | string | oui | Le type de contenu de la requête courante, tel qu'il a été déterminé au cours de la phase type\_check (par exemple `image/gif` ou `text/html`) |
| `context_prefix` | string | non |   |
| `context_document_root` | string | non |   |
| `document_root` | string | non | La racine des documents du serveur |
| `err_headers_out` | table | non | L'en-tête MIME de l'environnement pour la réponse, écrit même en cas d'erreur et conservé pendant les redirections internes. Une table lua en lecture seule est disponible pour l'itération sous la forme r:err\_headers\_out\_table(). |
| `filename` | string | oui | Le nom de fichier correspondant à la requête, par exemple /www/example.com/foo.txt. Il peut être modifié au cours des phases pre-translate-name, translate-name ou map-to-storage du traitement de la requête pour permettre au gestionnaire par défaut (ou aux gestionnaires de script) de servir une version du fichier autre que celle demandée. |
| `handler` | string | oui | Le nom du [[11-guides/01-generalites/utilisation-des-gestionnaires-d-apache-handlers\|gestionnaire]] qui doit traiter la requête, par exemple `lua-script` si elle doit être traitée par [[12-modules/mod_lua\|mod_lua]]. Cette valeur est en général définie via les directives [[13-directives/addhandler\|AddHandler]] ou [[13-directives/sethandler\|SetHandler]], mais peut aussi l'être via [[12-modules/mod_lua\|mod_lua]] pour permettre à un autre gestionnaire de traiter une requête spécifique qui ne serait pas traitée par défaut par ce dernier. |
| `headers_in` | table | oui | Les en-têtes MIME de l'environnement de la requête. Il s'agit des en-têtes comme `Host, User-Agent, Referer`, etc... Une table lua en lecture seule est disponible pour l'itération sous la forme r:headers\_in\_table(). |
| `headers_out` | table | oui | Les en-têtes MIME de l'environnement de la réponse. Une table lua en lecture seule est disponible pour l'itération sous la forme r:headers\_out\_table(). |
| `hostname` | string | non | Le nom d'hôte, tel que défini par l'en-tête `Host:` ou par un URI complet. |
| `is_https` | boolean | non | Indique si la requête à été faite via HTTPS |
| `is_initial_req` | boolean | non | Indique si la requête courante est la requête initiale ou une sous-requête. |
| `limit_req_body` | number | non | La taille maximale du corps de la requête, ou 0 si aucune limite. |
| `log_id` | string | non | L'identifiant de la requête dans les journaux d'accès ou d'erreur. |
| `method` | string | non | La méthode de la requête, par exemple `GET` ou `POST`. |
| `notes` | table | oui | Une liste de notes qui peuvent être transmises d'un module à l'autre. Une table lua en lecture seule est disponible pour l'itération sous la forme r:notes\_table(). |
| `options` | string | non | La valeur de la directive Options pour la requête courante. |
| `path_info` | string | non | La valeur de PATH\_INFO extraite de la requête. |
| `port` | number | non | Le port du serveur utilisé par la requête. |
| `protocol` | string | non | Le protocole utilisé, par exemple `HTTP/1.1` |
| `proxyreq` | string | oui | Indique s'il s'agit d'une requête mandatée ou non. Cette valeur est en général définie au cours de la phase post\_read\_request/pre\_translate\_name/translate\_name du traitement de la requête. |
| `range` | string | non | Le contenu de l'en-tête `Range:`. |
| `remaining` | number | non | Le nombre d'octets du corps de la requête restant à lire. |
| `server_built` | string | non | La date de compilation du serveur. |
| `server_name` | string | non | Le nom du serveur pour cette requête. |
| `some_auth_required` | boolean | non | Indique si une autorisation est/était requise pour cette requête. |
| `subprocess_env` | table | oui | Le jeu de variables d'environnement pour cette requête. Une table lua en lecture seule est disponible pour l'itération sous la forme r:subprocess\_env\_table(). |
| `started` | number | non | Le moment où le serveur a été (re)démarré, en secondes depuis epoch (1er janvier 1970) |
| `status` | number | oui | Le code de retour (courant) pour cette requête, par exemple `200` ou `404`. |
| `the_request` | string | non | La chaîne de la requête telle qu'elle a été envoyée par le client, par exemple `GET /foo/bar HTTP/1.1`. |
| `unparsed_uri` | string | non | La partie URI non interprétée de la requête |
| `uri` | string | oui | L'URI après interprétation par httpd |
| `user` | string | oui | Si une authentification a été effectuée, nom de l'utilisateur authentifié. |
| `useragent_ip` | string | non | L'adresse IP de l'agent qui a envoyé la requête |

## Méthodes de l'objet request\_rec

L'objet request\_rec possède (au minimum) les méthodes suivantes :

```lua
r:flush()   -- vide le tampon de sortie
            -- Renvoie true si le vidage a été effectué avec succès,
        -- false dans le cas contraire.

while nous_avons_des_données_à_envoyer do
    r:puts("Bla bla bla\n") -- envoi des données à envoyer vers le tampon
    r:flush() -- vidage du tampon (envoi au client)
    r.usleep(500000) -- mise en attente pendant 0.5 secondes et bouclage
end
```

```lua
r:add_output_filter(filter_name) -- ajoute un filtre en sortie

r:add_output_filter("fooFilter") -- insère le filtre fooFilter dans le flux de sortie
```

```lua
r:sendfile(filename) -- envoie un fichier entier au client en utilisant sendfile s'il est
                     -- supporté par la plateforme :

if use_sendfile_thing then
    r:sendfile("/var/www/large_file.img")
end
```

```lua
r:parseargs() -- renvoie deux tables : une table standard de couples
              -- clé/valeur pour les données GET simples,
              -- et une autre pour les données
              -- multivaluées (par exemple foo=1&foo=2&foo=3) :

local GET, GETMULTI = r:parseargs()
r:puts("Votre nom est : " .. GET['name'] or "Unknown")
```

```lua
r:parsebody()([sizeLimit]) -- interprète le corps de la
                           -- requête en tant que POST et renvoie
                           -- deux tables lua, comme r:parseargs(). Un
                           -- nombre optionnel peut être fourni
                           -- pour spécifier le nombre maximal
                           -- d'octets à interpréter. La
                           -- valeur par défaut est 8192.

local POST, POSTMULTI = r:parsebody(1024*1024)
r:puts("Votre nom est : " .. POST['name'] or "Unknown")
```

```lua
r:puts("bonjour", " le monde", "!") -- affichage dans le corps de la réponse
```

```lua
r:write("une simple chaîne") -- affichage dans le corps de la réponse
```

```lua
r:escape_html("<html>test</html>") -- Echappe le code HTML et renvoie le résultat
```

```lua
r:base64_encode(string) -- Encode une chaîne à l'aide du standard de codage Base64.

local encoded = r:base64_encode("This is a test") -- returns VGhpcyBpcyBhIHRlc3Q=
```

```lua
r:base64_decode(string) -- Décode une chaîne codée en Base64.

local decoded = r:base64_decode("VGhpcyBpcyBhIHRlc3Q=") -- returns 'This is a test'
```

```lua
r:md5(string) -- Calcule et renvoie le condensé MD5 d'une chaîne en mode binaire (binary safe).

local hash = r:md5("This is a test") -- returns ce114e4501d2f4e2dcea3e17b546f339
```

```lua
r:sha1(string) -- Calcule et renvoie le condensé SHA1 d'une chaîne en mode binaire (binary safe).

local hash = r:sha1("This is a test") -- returns a54d88e06612d820bc3be72877c74f257b561b19
```

```lua
r:escape(string) -- Echappe une chaîne de type URL.

local url = "http://foo.bar/1 2 3 & 4 + 5"
local escaped = r:escape(url) -- renvoie 'http%3a%2f%2ffoo.bar%2f1+2+3+%26+4+%2b+5'
```

```lua
r:unescape(string) -- Déséchappe une chaîne de type URL.

local url = "http%3a%2f%2ffoo.bar%2f1+2+3+%26+4+%2b+5"
local unescaped = r:unescape(url) -- renvoie 'http://foo.bar/1 2 3 & 4 + 5'
```

```lua
r:construct_url(string) -- Construit une URL à partir d'un URI

local url = r:construct_url(r.uri)
```

```lua
r.mpm_query(number) -- Interroge le serveur à propos de son module MPM via la requête ap_mpm_query.

local mpm = r.mpm_query(14)
if mpm == 1 then
    r:puts("Ce serveur utilise le MPM Event")
end
```

```lua
r:expr(string) -- Evalue une chaîne de type expr.

if r:expr("%{HTTP_HOST} =~ /^www/") then
    r:puts("Ce nom d'hôte commence par www")
end
```

```lua
r:scoreboard_process(a) -- Interroge le serveur à propos du
                        -- processus à la position a.

local process = r:scoreboard_process(1)
r:puts("Le serveur 1 a comme PID " .. process.pid)
```

```lua
r:scoreboard_worker(a, b) -- Interroge le serveur à propos du
                          -- thread b, dans le processus a.

local thread = r:scoreboard_worker(1, 1)
r:puts("L'ID du thread 1 du serveur 1 est " .. thread.tid .. " et son
état est " .. thread.status)
```

```lua
r:clock() -- Renvoie l'heure courante avec une précision d'une microseconde.
```

```lua
r:requestbody(filename) -- Lit et renvoie le corps d'une requête.
                        -- Si 'filename' est spécifié, le
                        -- corps de requête n'est pas
                        -- renvoyé, mais sauvegardé dans
                        -- le fichier correspondant.

local input = r:requestbody()
r:puts("Vous m'avez envoyé le corps de requête suivant :\n")
r:puts(input)
```

```lua
r:add_input_filter(filter_name) -- Ajoute le filtre en entrée 'filter_name'.
```

```lua
r:module_info(module_name) -- Interroge le serveur à propos d'un module.

local mod = r.module_info("mod_lua.c")
if mod then
    for k, v in pairs(mod.commands) do
       r:puts( ("%s: %s\n"):format(k,v)) -- affiche toutes les directives
                                         -- implémentées par ce module.
    end
end
```

```lua
r:loaded_modules() -- Renvoie une liste des modules chargés par httpd.

for k, module in pairs(r:loaded_modules()) do
    r:puts("J'ai chargé le module " .. module .. "\n")
end
```

```lua
r:runtime_dir_relative(filename) -- Génère le nom d'un fichier run-time
                                 -- (par exemple la mémoire partagée
                                 -- "file") relativement au répertoire de run-time.
```

```lua
r:server_info() -- Renvoie une table contenant des informations à
                -- propos du serveur, comme le nom de
                -- l'exécutable httpd, le module mpm utilisé, etc...
```

```lua
r:set_document_root(file_path) -- Définit la racine des documents
                               -- pour la requête à file_path.
```

```lua
r:add_version_component(component_string) -- Ajoute un élément à
                                          -- la bannière du serveur.
```

```lua
r:set_context_info(prefix, docroot) -- Définit le préfixe et la
                                    -- racine des documents du contexte pour une requête.
```

```lua
r:os_escape_path(file_path) -- Convertit un chemin du système de
                            -- fichiers en URL indépendamment du système d'exploitation.
```

```lua
r:escape_logitem(string) -- Echappe une chaîne pour journalisation.
```

```lua
r.strcmp_match(string, pattern) -- Vérifie si 'string' correspond à
                                -- 'pattern' via la fonction strcmp_match (GLOBs). Par exemple, est-ce que
                                -- 'www.example.com' correspond à '*.example.com' ?

local match = r.strcmp_match("foobar.com", "foo*.com")
if match then
    r:puts("foobar.com matches foo*.com")
end
```

```lua
r:set_keepalive() -- Définit l'état de persistance d'une requête.
                  -- Renvoie true dans la mesure du possible, false dans le cas contraire.
```

```lua
r:make_etag() -- Génère et renvoie le etag pour la requête courante.
```

```lua
r:send_interim_response(clear) -- Renvoie une réponse d'intérim (1xx) au
                               -- client. Si 'clear' est vrai, les en-têtes disponibles
                               -- seront envoyés et effacés.
```

```lua
r:custom_response(status_code, string) -- Génère et définit une réponse
                                       -- personnalisée pour un code d'état particulier.
                                       -- Le fonctionnement est très proche de celui de la directive ErrorDocument.

r:custom_response(404, "Baleted!")
```

```lua
r.exists_config_define(string) -- Vérifie si une définition de configuration existe.

if r.exists_config_define("FOO") then
    r:puts("httpd a probablement été lancé avec l'option -DFOO, ou FOO a
    été défini dans la configuration")
end
```

```lua
r:state_query(string) -- Interroge le serveur à propos de son état.
```

```lua
r:stat(filename [,wanted]) -- Exécute stat() sur un fichier, et renvoie une table contenant
                           -- des informations à propos de ce fichier.

local info = r:stat("/var/www/foo.txt")
if info then
    r:puts("Ce fichier existe et a été modifié pour la dernière fois à : " .. info.modified)
end
```

```lua
r:regex(string, pattern [,flags]) -- Exécute une recherche à base d'expression rationnelle
                                  -- sur une chaîne, et renvoie les éventuelles correspondances trouvées.

local matches = r:regex("foo bar baz", [[foo (\w+) (\S*)]])
if matches then
    r:puts("L'expression rationnelle correspond et le dernier mot
    capturé ($2) est : " .. matches[2])
end

-- Exemple avec insensibilité à la casse :
local matches = r:regex("FOO bar BAz", [[(foo) bar]], 1)

-- les drapeaux peuvent être une combibaison bit à bit de :
-- 0x01: insensibilité à la casse
-- 0x02: recherche multiligne
```

```lua
r.usleep(microsecondes) -- Interrompt l'exécution du script pendant le nombre de microsecondes spécifié.
```

```lua
r:dbacquire(dbType[, dbParams]) -- Acquiert une connexion à une base de données et renvoie une classe database.
                                -- Voir 'Connectivité aux bases de données'
                -- pour plus de détails.
```

```lua
r:ivm_set("key", value) -- Défini une variable Inter-VM avec une valeur spécifique.
                        -- Ces valeurs sont conservées même si la VM est
            -- arrêtée ou non utilisée, et ne doivent donc être
            -- utilisées que si MaxConnectionsPerChild > 0.
            -- Les valeurs peuvent être de type number, string
            -- ou boolean et sont stockées séparément pour
            -- chaque processus (elles ne seront donc pas d'une
            -- grande utilité si l'on utilise le mpm prefork).

r:ivm_get("key")        -- Lit le contenu d'une variable définie via ivm_set. Renvoie
            -- le contenu de la variable si elle existe, ou nil
            -- dans le cas contraire.

-- Voici un exemple de lecture/écriture qui sauvegarde une variable
-- globale en dehors de la VM :
function handle(r)
    -- La première VM qui effectue l'appel suivant n'obtiendra aucune
    -- valeur, et devra la créer
    local foo = r:ivm_get("cached_data")
    if not foo then
        foo = do_some_calcs() -- simulation de valeurs de retour
        r:ivm_set("cached_data", foo) -- définition globale de la variable
    end
    r:puts("La donnée en cache est : ", foo)
end
```

```lua
r:htpassword(string [,algorithm [,cost]]) -- Génère un hash de mot de passe à partir d'une chaîne.
                                          -- algorithm: 0 = APMD5 (défaut), 1 = SHA, 2 = BCRYPT, 3 = CRYPT.
                                          -- cost: ne s'utilise qu'avec l'algorythme BCRYPT (défaut = 5).
```

```lua
r:mkdir(dir [,mode]) -- Crée un répertoire et définit son mode via le paramètre optionnel mode.
```

```lua
r:mkrdir(dir [,mode]) -- Crée des répertoires de manière récursive et définit
                      -- leur mode via le paramètre optionnel mode.
```

```lua
r:rmdir(dir) -- Supprime un répertoire.
```

```lua
r:touch(file [,mtime]) -- Définit la date de modification d'un fichier à la date courante ou à
                       -- la valeur optionnelle mtime en msec.
```

```lua
r:get_direntries(dir) -- Renvoie une table contenant toutes les entrées de répertoires.

-- Renvoie un chemin sous forme éclatée en chemin, fichier, extension
function handle(r)
  local dir = r.context_document_root
  for _, f in ipairs(r:get_direntries(dir)) do
    local info = r:stat(dir .. "/" .. f)
    if info then
      local mtime = os.date(fmt, info.mtime / 1000000)
      local ftype = (info.filetype == 2) and "[dir] " or "[file]"
      r:puts( ("%s %s %10i %s\n"):format(ftype, mtime, info.size, f) )
    end
  end
end
```

```lua
r.date_parse_rfc(string) -- Interprète une chaîne date/heure et renvoie l'équivalent en secondes depuis epoche.
```

```lua
r:getcookie(key) -- Obtient un cookie HTTP
```

```lua
r:setcookie(key, value, secure, expires) -- Définit un cookie HTTP, par exemple :
r:setcookie("foo", "bar and stuff", false, os.time() + 86400)
```

```lua
r:wsupgrade() -- Met à jour une connexion vers les WebSockets si possible (et si demandé) :
if r:wsupgrade() then -- si la mise à jour est possible :
    r:wswrite("Bienvenue dans les websockets!") -- écrit quelque chose à l'intention du client
    r:wsclose()  -- Au revoir !
end
```

```lua
r:wsread() -- Lit un cadre de websocket depuis une connexion vers websocket mise à jour (voir ci-dessus) :

local line, isFinal = r:wsread() -- isFinal indique s'il s'agit du cadre final.
                                 -- dans le cas contraire, on peut lire les cadres suivants
r:wswrite("Vous avez écrit : " .. line)
```

```lua
r:wswrite(line) -- écrit un cadre vers un client WebSocket :
r:wswrite("Bonjour le Monde !")
```

```lua
r:wsclose() -- ferme une requête WebSocket et l'achève pour httpd :

if r:wsupgrade() then
    r:wswrite("Ecrire quelque chose : ")
    local line = r:wsread() or "nothing"
    r:wswrite("Vous avez écrit : " .. line);
    r:wswrite("Au revoir !")
    r:wsclose()
end
```

## Fonctions de journalisation

```lua
-- exemples de messages de journalisation
r:trace1("Ceci est un message de journalisation de niveau
trace") -- les niveaux valides vont de trace1 à trace8
    r:debug("Ceci est un message de journalisation de niveau debug")
    r:info("Ceci est un message de journalisation de niveau info")
    r:notice("Ceci est un message de journalisation de niveau notice")
    r:warn("Ceci est un message de journalisation de niveau warn")
    r:err("Ceci est un message de journalisation de niveau err")
    r:alert("Ceci est un message de journalisation de niveau alert")
    r:crit("Ceci est un message de journalisation de niveau crit")
    r:emerg("Ceci est un message de journalisation de niveau emerg")
```

## Paquet apache2

Le paquet nommé `apache2` est fourni avec (au minimum) le contenu suivant :

**apache2.OK**

Constante interne OK. Les gestionnaires renverront cette valeur s'ils ont traité la requête.

**apache2.DECLINED**

Constante interne DECLINED. Les gestionnaires renverront cette valeur s'ils n'ont pas l'intention de traiter la requête.

**apache2.DONE**

Constante interne DONE.

**apache2.version**

Chaîne contenant la version du serveur HTTP Apache

**apache2.HTTP\_MOVED\_TEMPORARILY**

Code d'état HTTP

**apache2.PROXYREQ\_NONE, apache2.PROXYREQ\_PROXY, apache2.PROXYREQ\_REVERSE, apache2.PROXYREQ\_RESPONSE**

Constantes internes utilisées par [[12-modules/mod_proxy|mod_proxy]]

**apache2.AUTHZ\_DENIED, apache2.AUTHZ\_GRANTED, apache2.AUTHZ\_NEUTRAL, apache2.AUTHZ\_GENERAL\_ERROR, apache2.AUTHZ\_DENIED\_NO\_USER**

constantes internes utilisées par [[12-modules/mod_authz_core|mod_authz_core]]

Les autres codes d'état HTTP ne sont pas encore implémentés.

## Modification de contenu avec les filtres lua

Les fonctions de filtrage implémentées via les directives [[13-directives/luainputfilter|LuaInputFilter]] ou [[13-directives/luaoutputfilter|LuaOutputFilter]] sont conçues comme des fonctions de 3ème phase non blocantes utilisant des sous-routines pour suspendre et reprendre l'exécution d'une fonction lorsque des paquets de données sont envoyés à la chaîne de filtrage. La structure de base d'une telle fonction est :

```lua
function filter(r)
    -- Nous indiquons tout d'abord que nous sommes prêts à recevoir des
    -- blocs de données.
    -- Avant ceci, nous pouvons définir notre environnement, tester
    -- certaines conditions, et, si nous le jugeons nécessaire, refuser le
    -- filtrage d'une requête :
    if something_bad then
        return -- Le filtrage est sauté
    end
    -- Sans se préoccuper des données que nous devons éventuellement ajouter, un arrêt est réalisé ici.
    -- Noter que les filtres de sortie sont les seuls capables d'ajouter des éléments au début des données.
    -- Les filtres en entrée peuvent ajouter des éléments à la fin des données au stade final.

    coroutine.yield([optional header to be prepended to the content])

    -- Après cet arrêt, nous allons recevoir d'autres blocs de données, un par un ;
    -- nous pouvons les traiter comme il nous plaît et procéder à la réponse.
    -- Ces blocs sont conservés dans la variable globale 'bucket', nous réalisons donc
    -- une boucle pour vérifier que 'bucket' n'est pas vide :
    while bucket ~= nil do
        local output = mangle(bucket) -- Do some stuff to the content
        coroutine.yield(output) -- Return our new content to the filter chain
    end

    -- Une fois les blocs de données épuisés, 'bucket' est positionné à une valeur vide ('nil'),
    -- ce qui va nous faire sortir de cette boucle et nous amener à l'étape suivante.
    -- On peut ajouter ce qu'on veut à la fin des données à cette étape, qui constitue le dernier
    -- arrêt. Les filtres d'entrée comme de sortie peuvent servir à ajouter des éléments à la fin
    --  des données à cette étape.
    coroutine.yield([optional footer to be appended to the content])
end
```

## Connectivité aux bases de données

Mod\_lua implémente une fonctionnalité basique de connexion aux bases de données permettant d'envoyer des requêtes ou d'exécuter des commandes auprès des moteurs de base de données les plus courants (mySQL, PostgreSQL, FreeTDS, ODBC, SQLite, Oracle), ainsi que mod\_dbd.

`dbType`, le premier paramètre de `dbacquire`, est sensible à la casse.

Ses valeurs possibles sont `mysql`, `pgsql`, `freetds`, `odbc`, `sqlite2`, `sqlite3`, `oracle` ou `mod_dbd`.

L'exemple suivant montre comment se connecter à une base de données et extraire des informations d'une table :

```lua
function handle(r)
    -- connexion à la base de données
    local database, err = r:dbacquire("mysql", "server=localhost,user=someuser,pass=somepass,dbname=mydb")
    if not err then
        -- Sélection de certaines informations
        local results, err = database:select(r, "SELECT `name`, `age` FROM `people` WHERE 1")
        if not err then
            local rows = results(0) -- extrait tous les enregistrements en mode synchrone
            for k, row in pairs(rows) do
                r:puts( string.format("Name: %s, Age: %s<br/>", row[1], row[2]) )
            end
        else
            r:puts("Database query error: " .. err)
        end
        database:close()
    else
        r:puts("Connexion à la base de données impossible : " .. err)
    end
end
```

Pour utiliser [[12-modules/mod_dbd|mod_dbd]], spécifiez `mod_dbd` comme type de base de données, ou laissez le champ vide :

```lua
local database = r:dbacquire("mod_dbd")
```

### L'objet database et ses méthodes

L'objet database renvoyé par `dbacquire` possède les méthodes suivantes :

**Sélection normale et requête vers une base de données :**

```lua
-- Exécution d'une requête et renvoie du nombre d'enregistrements
affectés :
local affected, errmsg = database:query(r, "DELETE FROM `tbl` WHERE 1")

-- Exécution d'une requête et renvoie du résultat qui peut être utilisé
en mode synchrone ou asynchrone :
local result, errmsg = database:select(r, "SELECT * FROM `people` WHERE 1")
```

**Utilisation de requêtes préparées (recommandé) :**

```lua
-- Création et exécution d'une requête préparée :
local statement, errmsg = database:prepare(r, "DELETE FROM `tbl` WHERE `age` > %u")
if not errmsg then
    local result, errmsg = statement:query(20) -- exécute la requête pour age > 20
end

-- Extrait une requête préparée depuis une directive DBDPrepareSQL :
local statement, errmsg = database:prepared(r, "someTag")
if not errmsg then
    local result, errmsg = statement:select("John Doe", 123) -- injecte les valeurs "John Doe" et 123 dans la requête
end
```

**Echappement de valeurs, fermeture de la base données, etc...**

```lua
-- Echappe une valeur pour pouvoir l'utiliser dans une requête :
local escaped = database:escape(r, [["'|blabla]])

-- Ferme une base de données et libère les liens vers cette dernière :
database:close()

-- Vérifie si une connexion à une base de données est en service et
opérationnelle :
local connected = database:active()
```

### Travail avec les jeux d'enregistrements renvoyés par les requêtes

Les jeux d'enregistrements renvoyés par `db:select` ou par des requêtes préparées créées par `db:prepare` permettent de sélectionner des enregistrements en mode synchrone ou asynchrone, selon le nombre d'enregistrements spécifié :
`result(0)` sélectionne tous les enregistrements en mode synchrone en renvoyant une table d'enregistrements.
`result(-1)` sélectionne le prochain enregistrement disponible en mode asynchrone.
`result(N)` sélectionne l'enregistrement numéro `N` en mode asynchrone.

```lua
-- extrait un jeu d'enregistrements via une requête régulière :
local result, err = db:select(r, "SELECT * FROM `tbl` WHERE 1")

local rows = result(0) -- sélectionne tous les enregistrements en mode synchrone
local row = result(-1) -- sélectionne le prochain enregistrement disponible en mode asynchrone
local row = result(1234) -- sélectionne l'enregistrement 1234 en mode asynchrone
local row = result(-1, true) -- Lit l'enregistrement suivant en utilisant les noms d'enregistrements comme index.
```

Il est possible de construire une fonction qui renvoie une fonction itérative permettant de traiter tous les enregistrement en mode synchrone ou asynchrone selon la valeur de l'argument async :

```lua
function rows(resultset, async)
    local a = 0
    local function getnext()
        a = a + 1
        local row = resultset(-1)
        return row and a or nil, row
    end
    if not async then
        return pairs(resultset(0))
    else
        return getnext, self
    end
end

local statement, err = db:prepare(r, "SELECT * FROM `tbl` WHERE `age` > %u")
if not err then
     -- sélectionne des enregistrements en mode asynchrone :
    local result, err = statement:select(20)
    if not err then
        for index, row in rows(result, true) do
            ....
        end
    end

     -- sélectionne des enregistrements en mode synchrone :
    local result, err = statement:select(20)
    if not err then
        for index, row in rows(result, false) do
            ....
        end
    end
end
```

### Fermeture d'une connexion à une base de données

Lorsqu'elles ne sont plus utilisées, les connexions aux bases de données doivent être fermées avec `database:close()`. Si vous ne les fermez pas manuellement, [[12-modules/mod_lua|mod_lua]] les fermera peut-être en tant que résidus collectés, mais si ce n'est pas le cas, vous pouvez finir pas avoir trop de connexions vers la base de données inutilisées. Les deux mesures suivantes sont pratiquement identiques :

```lua
-- Méthode 1 : fermeture manuelle de la connexion
local database = r:dbacquire("mod_dbd")
database:close() -- c'est tout

-- Méthode 2 : on laisse le collecteur de résidus la fermer
local database = r:dbacquire("mod_dbd")
database = nil -- on coupe le lien
collectgarbage() -- fermeture de la connexion par le collecteur de résidus
```

### Précautions à prendre lorsque l'on travaille avec les bases de données

Bien que les fonctions `query` et `run` soient toujours disponibles, il est recommandé d'utiliser des requêtes préparées chaque fois que possible, afin d'une part d'optimiser les performances (si votre connexion reste longtemps en vie), et d'autre part minimiser le risque d'attaques par injection SQL. Les fonctions `run` et `query` ne doivent être utilisées que lorsque la requête ne contient pas de variables (requête statique). Dans le cas des requêtes dynamiques, utilisez `db:prepare` ou `db:prepared`.

## Directives

- [[13-directives/luaroot|LuaRoot]]
- [[13-directives/luascope|LuaScope]]
- [[13-directives/luamaphandler|LuaMapHandler]]
- [[13-directives/luapackagepath|LuaPackagePath]]
- [[13-directives/luapackagecpath|LuaPackageCPath]]
- [[13-directives/luacodecache|LuaCodeCache]]
- [[13-directives/luahooktranslatename|LuaHookTranslateName]]
- [[13-directives/luahookpretranslate|LuaHookPreTranslate]]
- [[13-directives/luahookfixups|LuaHookFixups]]
- [[13-directives/luahooklog|LuaHookLog]]
- [[13-directives/luahookmaptostorage|LuaHookMapToStorage]]
- [[13-directives/luahookcheckuserid|LuaHookCheckUserID]]
- [[13-directives/luahooktypechecker|LuaHookTypeChecker]]
- [[13-directives/luahookauthchecker|LuaHookAuthChecker]]
- [[13-directives/luahookaccesschecker|LuaHookAccessChecker]]
- [[13-directives/luahookinsertfilter|LuaHookInsertFilter]]
- [[13-directives/luainherit|LuaInherit]]
- [[13-directives/luaquickhandler|LuaQuickHandler]]
- [[13-directives/luaauthzprovider|LuaAuthzProvider]]
- [[13-directives/luainputfilter|LuaInputFilter]]
- [[13-directives/luaoutputfilter|LuaOutputFilter]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
