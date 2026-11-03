---
title: "ngx_http_ssi_module"
description: "Module nginx ngx_http_ssi_module — Le module ngx_http_ssi_module est un filtre qui traite les commandes SSI (Server Side Includes) des réponses qui le traversent. Actuellement, la liste des commandes SSI prises en charge est incomplète."
tags: [nginx, module, ngx_http_ssi_module]
icon: puzzle
---

Le module `ngx_http_ssi_module` est un filtre qui traite les commandes SSI (Server Side Includes) des réponses qui le traversent. Actuellement, la liste des commandes SSI prises en charge est incomplète.

## Exemple de configuration

```nginx
location / {
    ssi on;
    ...
}
```

## Commandes SSI

Les commandes SSI ont le format général suivant :

```nginx
<!--# command parameter1=value1 parameter2=value2 ... -->
```

Les commandes suivantes sont prises en charge :

- **`block`**

  Définit un bloc utilisable comme remplacement dans la commande `include`. Le bloc peut contenir d'autres commandes SSI. La commande accepte le paramètre suivant :

  - **`name`**

    nom du bloc.

  Exemple :

  ```nginx
  <!--# block name="one" -->
  stub
  <!--# endblock -->
  ```

- **`config`**

  Définit certains paramètres du traitement SSI :

  - **`errmsg`**

    chaîne affichée si une erreur survient pendant le traitement SSI. Par défaut, la chaîne suivante est affichée :

    ```nginx
    [an error occurred while processing the directive]
    ```

  - **`timefmt`**

    chaîne de format transmise à la fonction `strftime` pour afficher la date et l'heure. Par défaut, le format suivant est utilisé :

    ```nginx
    "%A, %d-%b-%Y %H:%M:%S %Z"
    ```

    Le format « `%s` » permet d'afficher l'heure en secondes.

- **`echo`**

  Affiche la valeur d'une variable. La commande accepte les paramètres suivants :

  - **`var`**

    le nom de la variable.

  - **`encoding`**

    la méthode d'encodage. Valeurs possibles : `none`, `url` et `entity` (par défaut).

  - **`default`**

    paramètre non standard qui définit la chaîne affichée si la variable n'est pas définie. Par défaut, « `(none)` » est affiché. La commande

    ```nginx
    <!--# echo var="name" default="no" -->
    ```

    remplace la suite de commandes suivante :

    ```nginx
    <!--# if expr="$name" --><!--# echo var="name" --><!--#
           else -->no<!--# endif -->
    ```

- **`if`**

  Effectue une inclusion conditionnelle. Les commandes suivantes sont prises en charge :

  ```nginx
  <!--# if expr="..." -->
  ...
  <!--# elif expr="..." -->
  ...
  <!--# else -->
  ...
  <!--# endif -->
  ```

  Un seul niveau d'imbrication est actuellement pris en charge. La commande accepte le paramètre suivant :

  - **`expr`**

    expression. Une expression peut être :

    - la vérification de l'existence d'une variable :

      ```nginx
      <!--# if expr="$name" -->
      ```
    - la comparaison d'une variable avec un texte :

      ```nginx
      <!--# if expr="$name = text" -->
      <!--# if expr="$name != text" -->
      ```
    - la comparaison d'une variable avec une expression régulière :

      ```nginx
      <!--# if expr="$name = /text/" -->
      <!--# if expr="$name != /text/" -->
      ```

    Si un texte (*text*) contient des variables, leurs valeurs sont substituées. Une expression régulière peut contenir des captures positionnelles et nommées, utilisables ensuite par des variables, par exemple :

    ```nginx
    <!--# if expr="$name = /(.+)@(?P<domain>.+)/" -->
        <!--# echo var="1" -->
        <!--# echo var="domain" -->
    <!--# endif -->
    ```

- **`include`**

  Inclut le résultat d'une autre requête dans la réponse. La commande accepte les paramètres suivants :

  - **`file`**

    indique un fichier inclus, par exemple :

    ```nginx
    <!--# include file="footer.html" -->
    ```

  - **`virtual`**

    indique une requête incluse, par exemple :

    ```nginx
    <!--# include virtual="/remote/body.php?argument=value" -->
    ```

    Plusieurs requêtes indiquées dans une même page et traitées par des serveurs mandatés ou FastCGI/uwsgi/SCGI/gRPC s'exécutent en parallèle. Pour un traitement séquentiel, utilisez le paramètre `wait`.

  - **`stub`**

    paramètre non standard qui nomme le bloc dont le contenu est affiché si la requête incluse donne un corps vide ou si une erreur survient pendant son traitement, par exemple :

    ```nginx
    <!--# block name="one" -->&nbsp;<!--# endblock -->
    <!--# include virtual="/remote/body.php?argument=value" stub="one" -->
    ```

    Le contenu du bloc de remplacement est traité dans le contexte de la requête incluse.

  - **`wait`**

    paramètre non standard qui demande d'attendre la fin complète d'une requête avant de poursuivre le traitement SSI, par exemple :

    ```nginx
    <!--# include virtual="/remote/body.php?argument=value" wait="yes" -->
    ```

  - **`set`**

    paramètre non standard qui demande d'écrire le résultat d'un traitement réussi dans la variable indiquée, par exemple :

    ```nginx
    <!--# include virtual="/remote/body.php?argument=value" set="one" -->
    ```

    La taille maximale de la réponse est définie par la directive [[12-directives/subrequest-output-buffer-size|subrequest_output_buffer_size]] (1.13.10) :

    ```nginx
    location /remote/ {
        subrequest_output_buffer_size 64k;
        ...
    }
    ```

    Avant la version 1.13.10, seuls les résultats des réponses obtenues avec les modules [[11-modules/02-http/ngx_http_proxy_module|ngx_http_proxy_module]], [[11-modules/02-http/ngx_http_memcached_module|ngx_http_memcached_module]], [[11-modules/02-http/ngx_http_fastcgi_module|ngx_http_fastcgi_module]] (1.5.6), [[11-modules/02-http/ngx_http_uwsgi_module|ngx_http_uwsgi_module]] (1.5.6) et [[11-modules/02-http/ngx_http_scgi_module|ngx_http_scgi_module]] (1.5.6) pouvaient être écrits dans des variables. La taille maximale de la réponse était définie par les directives [[12-directives/proxy-buffer-size-http-proxy|proxy_buffer_size]], [[12-directives/memcached-buffer-size|memcached_buffer_size]], [[12-directives/fastcgi-buffer-size|fastcgi_buffer_size]], [[12-directives/uwsgi-buffer-size|uwsgi_buffer_size]] et [[12-directives/scgi-buffer-size|scgi_buffer_size]].

- **`set`**

  Définit la valeur d'une variable. La commande accepte les paramètres suivants :

  - **`var`**

    le nom de la variable.

  - **`value`**

    la valeur de la variable. Si la valeur contient des variables, leurs valeurs sont substituées.

## Directives

- [[12-directives/ssi|ssi]]
- [[12-directives/ssi-last-modified|ssi_last_modified]]
- [[12-directives/ssi-min-file-chunk|ssi_min_file_chunk]]
- [[12-directives/ssi-silent-errors|ssi_silent_errors]]
- [[12-directives/ssi-types|ssi_types]]
- [[12-directives/ssi-value-length|ssi_value_length]]

## Variables intégrées

- [[13-variables/date-local|$date_local]]
- [[13-variables/date-gmt|$date_gmt]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
