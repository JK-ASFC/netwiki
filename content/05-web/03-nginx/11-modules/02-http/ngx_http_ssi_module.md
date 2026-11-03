---
title: "ngx_http_ssi_module"
description: "Module nginx ngx_http_ssi_module — Le module ngx_http_ssi_module est un filtre qui traite les commandes SSI (Server Side Includes) des réponses qui le traversent. Actuellement, la liste des commandes SSI prises en charge est incomplète."
tags: [nginx, module, ngx_http_ssi_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

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

  Sets some parameters used during SSI processing, namely:

  - **`errmsg`**

    a string that is output if an error occurs during SSI processing. By default, the following string is output:

    ```nginx
    [an error occurred while processing the directive]
    ```

  - **`timefmt`**

    a format string passed to the `strftime` function used to output date and time. By default, the following format is used:

    ```nginx
    "%A, %d-%b-%Y %H:%M:%S %Z"
    ```

    The “`%s`” format is suitable to output time in seconds.

- **`echo`**

  Outputs the value of a variable. The command has the following parameters:

  - **`var`**

    the variable name.

  - **`encoding`**

    the encoding method. Possible values include `none`, `url`, and `entity`. By default, `entity` is used.

  - **`default`**

    a non-standard parameter that sets a string to be output if a variable is undefined. By default, “`(none)`” is output. The command

    ```nginx
    <!--# echo var="name" default="no" -->
    ```

    replaces the following sequence of commands:

    ```nginx
    <!--# if expr="$name" --><!--# echo var="name" --><!--#
           else -->no<!--# endif -->
    ```

- **`if`**

  Performs a conditional inclusion. The following commands are supported:

  ```nginx
  <!--# if expr="..." -->
  ...
  <!--# elif expr="..." -->
  ...
  <!--# else -->
  ...
  <!--# endif -->
  ```

  Only one level of nesting is currently supported. The command has the following parameter:

  - **`expr`**

    expression. An expression can be:

    - variable existence check:

      ```nginx
      <!--# if expr="$name" -->
      ```
    - comparison of a variable with a text:

      ```nginx
      <!--# if expr="$name = text" -->
      <!--# if expr="$name != text" -->
      ```
    - comparison of a variable with a regular expression:

      ```nginx
      <!--# if expr="$name = /text/" -->
      <!--# if expr="$name != /text/" -->
      ```

    If a *text* contains variables, their values are substituted. A regular expression can contain positional and named captures that can later be used through variables, for example:

    ```nginx
    <!--# if expr="$name = /(.+)@(?P<domain>.+)/" -->
        <!--# echo var="1" -->
        <!--# echo var="domain" -->
    <!--# endif -->
    ```

- **`include`**

  Includes the result of another request into a response. The command has the following parameters:

  - **`file`**

    specifies an included file, for example:

    ```nginx
    <!--# include file="footer.html" -->
    ```

  - **`virtual`**

    specifies an included request, for example:

    ```nginx
    <!--# include virtual="/remote/body.php?argument=value" -->
    ```

    Several requests specified on one page and processed by proxied or FastCGI/uwsgi/SCGI/gRPC servers run in parallel. If sequential processing is desired, the `wait` parameter should be used.

  - **`stub`**

    a non-standard parameter that names the block whose content will be output if the included request results in an empty body or if an error occurs during the request processing, for example:

    ```nginx
    <!--# block name="one" -->&nbsp;<!--# endblock -->
    <!--# include virtual="/remote/body.php?argument=value" stub="one" -->
    ```

    The replacement block content is processed in the included request context.

  - **`wait`**

    a non-standard parameter that instructs to wait for a request to fully complete before continuing with SSI processing, for example:

    ```nginx
    <!--# include virtual="/remote/body.php?argument=value" wait="yes" -->
    ```

  - **`set`**

    a non-standard parameter that instructs to write a successful result of request processing to the specified variable, for example:

    ```nginx
    <!--# include virtual="/remote/body.php?argument=value" set="one" -->
    ```

    The maximum size of the response is set by the [[12-directives/subrequest-output-buffer-size|subrequest_output_buffer_size]] directive (1.13.10):

    ```nginx
    location /remote/ {
        subrequest_output_buffer_size 64k;
        ...
    }
    ```

    Prior to version 1.13.10, only the results of responses obtained using the [[11-modules/02-http/ngx_http_proxy_module|ngx_http_proxy_module]], [[11-modules/02-http/ngx_http_memcached_module|ngx_http_memcached_module]], [[11-modules/02-http/ngx_http_fastcgi_module|ngx_http_fastcgi_module]] (1.5.6), [[11-modules/02-http/ngx_http_uwsgi_module|ngx_http_uwsgi_module]] (1.5.6), and [[11-modules/02-http/ngx_http_scgi_module|ngx_http_scgi_module]] (1.5.6) modules could be written into variables. The maximum size of the response was set with the [[12-directives/proxy-buffer-size-http-proxy|proxy_buffer_size]], [[12-directives/memcached-buffer-size|memcached_buffer_size]], [[12-directives/fastcgi-buffer-size|fastcgi_buffer_size]], [[12-directives/uwsgi-buffer-size|uwsgi_buffer_size]], and [[12-directives/scgi-buffer-size|scgi_buffer_size]] directives.

- **`set`**

  Sets a value of a variable. The command has the following parameters:

  - **`var`**

    the variable name.

  - **`value`**

    the variable value. If an assigned value contains variables, their values are substituted.

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
