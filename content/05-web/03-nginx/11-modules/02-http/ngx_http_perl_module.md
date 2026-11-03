---
title: "ngx_http_perl_module"
description: "Module nginx ngx_http_perl_module — Le module ngx_http_perl_module sert à écrire en Perl des gestionnaires de location et de variables, et à insérer des appels Perl dans les SSI."
tags: [nginx, module, ngx_http_perl_module]
icon: puzzle
---

Le module `ngx_http_perl_module` sert à écrire en Perl des gestionnaires de location et de variables, et à insérer des appels Perl dans les SSI.

Ce module n'est pas compilé par défaut ; il doit être activé avec le paramètre de configuration `--with-http_perl_module`.

> [!NOTE]
> Ce module nécessite [Perl](https://www.perl.org/get.html) 5.6.1 ou plus récent. Le compilateur C doit être compatible avec celui qui a servi à compiler Perl.

## Problèmes connus

Le module est expérimental : à utiliser à vos risques.

Pour que Perl recompile les modules modifiés lors d'une reconfiguration, il doit être compilé avec les paramètres `-Dusemultiplicity=yes` ou `-Dusethreads=yes`. Pour limiter ses fuites de mémoire à l'exécution, il doit aussi être compilé avec `-Dusemymalloc=no`. Pour vérifier ces paramètres sur un Perl déjà compilé (les valeurs préférées figurent dans l'exemple), exécutez :

```nginx
$ perl -V:usemultiplicity -V:usemymalloc
usemultiplicity='define';
usemymalloc='n';
```

Après recompilation de Perl avec les nouveaux paramètres `-Dusemultiplicity=yes` ou `-Dusethreads=yes`, tous les modules Perl binaires doivent aussi être recompilés : ils cesseront simplement de fonctionner avec le nouveau Perl.

Le processus principal, puis les processus de travail, peuvent grossir à chaque reconfiguration. Si le processus principal atteint une taille inacceptable, on peut appliquer la procédure de [[10-guides/01-introduction/control|mise à jour à chaud]] sans changer l'exécutable.

Pendant que le module Perl effectue une opération longue (résolution d'un nom de domaine, connexion à un autre serveur, interrogation d'une base de données…), les autres requêtes affectées au processus de travail courant ne sont pas traitées. Il est donc recommandé de n'effectuer que des opérations à durée courte et prévisible, comme l'accès au système de fichiers local.

## Exemple de configuration

```nginx
http {

    perl_modules perl/lib;
    perl_require hello.pm;

    perl_set $msie6 '

        sub {
            my $r = shift;
            my $ua = $r->header_in("User-Agent");

            return "" if $ua =~ /Opera/;
            return "1" if $ua =~ / MSIE [6-9]\.\d+/;
            return "";
        }

    ';

    server {
        location / {
            perl hello::handler;
        }
    }
```

Le module `perl/lib/hello.pm` :

```nginx
package hello;

use nginx;

sub handler {
    my $r = shift;

    $r->send_http_header("text/html");
    return OK if $r->header_only;

    $r->print("hello!\n<br/>");

    if (-f $r->filename or -d _) {
        $r->print($r->uri, " exists!\n");
    }

    return OK;
}

1;
__END__
```

## Appeler Perl depuis SSI

Une commande SSI qui appelle Perl a le format suivant :

```nginx
<!--# perl sub="module::function" arg="parameter1" arg="parameter2" ...
-->
```

## Méthodes de l'objet requête $r

- **`$r->args`**

  renvoie les arguments de la requête.

- **`$r->filename`**

  renvoie le nom du fichier correspondant à l'URI de la requête.

- **`$r->has_request_body(handler)`**

  renvoie 0 si la requête n'a pas de corps. S'il y en a un, le gestionnaire indiqué est associé à la requête et 1 est renvoyé. Après lecture du corps, nginx appelle ce gestionnaire. La fonction gestionnaire doit être passée par référence. Exemple :

  ```nginx
  package hello;

  use nginx;

  sub handler {
      my $r = shift;

      if ($r->request_method ne "POST") {
          return DECLINED;
      }

      if ($r->has_request_body(\&post)) {
          return OK;
      }

      return HTTP_BAD_REQUEST;
  }

  sub post {
      my $r = shift;

      $r->send_http_header;

      $r->print("request_body: \"", $r->request_body, "\"<br/>");
      $r->print("request_body_file: \"", $r->request_body_file, "\"<br/>\n");

      return OK;
  }

  1;

  __END__
  ```

- **`$r->allow_ranges`**

  active l'utilisation des plages d'octets lors de l'envoi des réponses.

- **`$r->discard_request_body`**

  demande à nginx d'ignorer le corps de la requête.

- **`$r->header_in(field)`**

  renvoie la valeur du champ d'en-tête de requête du client indiqué.

- **`$r->header_only`**

  indique si la réponse entière ou seulement son en-tête doit être envoyée au client.

- **`$r->header_out(field, value)`**

  définit la valeur du champ d'en-tête de réponse indiqué.

- **`$r->internal_redirect(uri)`**

  effectue une redirection interne vers l'*uri* indiqué. La redirection a réellement lieu après la fin de l'exécution du gestionnaire Perl.

  > [!NOTE]
  > Depuis la version 1.17.2, la méthode accepte les URI échappés et prend en charge les redirections vers des blocs location nommés.

- **`$r->log_error(errno, message)`**

  écrit le message (*message*) indiqué dans [[12-directives/error-log|error_log]]. Si *errno* n'est pas nul, un code d'erreur et sa description sont ajoutés au message.

- **`$r->print(text, ...)`**

  transmet des données au client.

- **`$r->request_body`**

  renvoie le corps de la requête du client s'il n'a pas été écrit dans un fichier temporaire. Pour garantir que le corps est en mémoire, limitez sa taille avec [[12-directives/client-max-body-size|client_max_body_size]] et définissez un tampon suffisant avec [[12-directives/client-body-buffer-size|client_body_buffer_size]].

- **`$r->request_body_file`**

  renvoie le nom du fichier contenant le corps de la requête du client. Après le traitement, le fichier doit être supprimé. Pour toujours écrire le corps dans un fichier, activez [[12-directives/client-body-in-file-only|client_body_in_file_only]].

- **`$r->request_method`**

  renvoie la méthode HTTP de la requête du client.

- **`$r->remote_addr`**

  renvoie l'adresse IP du client.

- **`$r->flush`**

  envoie immédiatement les données au client.

- **`$r->sendfile(name[, offset[, length]])`**

  envoie au client le contenu du fichier indiqué. Les paramètres facultatifs indiquent le décalage initial et la longueur des données à transmettre. La transmission a réellement lieu après la fin du gestionnaire Perl.

- **`$r->send_http_header([type])`**

  envoie l'en-tête de réponse au client. Le paramètre facultatif *type* définit la valeur du champ d'en-tête de réponse `Content-Type`. Si la valeur est une chaîne vide, le champ `Content-Type` n'est pas envoyé.

- **`$r->status(code)`**

  définit le code de réponse.

- **`$r->sleep(milliseconds, handler)`**

  associe le gestionnaire indiqué et suspend le traitement de la requête pendant la durée indiquée. Pendant ce temps, nginx continue de traiter les autres requêtes. Une fois la durée écoulée, nginx appelle le gestionnaire. La fonction gestionnaire doit être passée par référence. Pour transmettre des données entre gestionnaires, utilisez `$r->variable()`. Exemple :

  ```nginx
  package hello;

  use nginx;

  sub handler {
      my $r = shift;

      $r->discard_request_body;
      $r->variable("var", "OK");
      $r->sleep(1000, \&next);

      return OK;
  }

  sub next {
      my $r = shift;

      $r->send_http_header;
      $r->print($r->variable("var"));

      return OK;
  }

  1;

  __END__
  ```

- **`$r->unescape(text)`**

  décode un texte encodé sous la forme « %XX ».

- **`$r->uri`**

  renvoie l'URI de la requête.

- **`$r->variable(name[, value])`**

  renvoie ou définit la valeur de la variable indiquée. Les variables sont propres à chaque requête.

## Directives

- [[12-directives/perl|perl]]
- [[12-directives/perl-modules|perl_modules]]
- [[12-directives/perl-require|perl_require]]
- [[12-directives/perl-set|perl_set]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
