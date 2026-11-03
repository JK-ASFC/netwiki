---
title: "ngx_http_rewrite_module"
description: "Module nginx ngx_http_rewrite_module — The ngx_http_rewrite_module module is used to change request URI using PCRE regular expressions, return redirects, and conditionally select configurations."
tags: [nginx, module, ngx_http_rewrite_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_rewrite_module` module is used to change request URI using PCRE regular expressions, return redirects, and conditionally select configurations.

The [[12-directives/break|break]], [[12-directives/if|if]], [[12-directives/return-http-rewrite|return]], [[12-directives/rewrite|rewrite]], and [[12-directives/set-http-rewrite|set]] directives are processed in the following order:

- the directives of this module specified on the [[12-directives/server-http-core|server]] level are executed sequentially;
- repeatedly:

  - a [[12-directives/location|location]] is searched based on a request URI;
  - the directives of this module specified inside the found location are executed sequentially;
  - the loop is repeated if a request URI was [[12-directives/rewrite|rewritten]], but not more than [[12-directives/internal|10 times]].

## Internal Implementation

The `ngx_http_rewrite_module` module directives are compiled at the configuration stage into internal instructions that are interpreted during request processing. An interpreter is a simple virtual stack machine.

For example, the directives

```nginx
location /download/ {
    if ($forbidden) {
        return 403;
    }

    if ($slow) {
        limit_rate 10k;
    }

    rewrite ^/(download/.*)/media/(.*)\..*$ /$1/mp3/$2.mp3 break;
}
```

will be translated into these instructions:

```nginx
variable $forbidden
check against zero
    return 403
    end of code
variable $slow
check against zero
match of regular expression
copy "/"
copy $1
copy "/mp3/"
copy $2
copy ".mp3"
end of regular expression
end of code
```

Note that there are no instructions for the [[12-directives/limit-rate|limit_rate]] directive above as it is unrelated to the `ngx_http_rewrite_module` module. A separate configuration is created for the [[12-directives/if|if]] block. If the condition holds true, a request is assigned this configuration where `limit_rate` equals to 10k.

The directive

```nginx
rewrite ^/(download/.*)/media/(.*)\..*$ /$1/mp3/$2.mp3 break;
```

can be made smaller by one instruction if the first slash in the regular expression is put inside the parentheses:

```nginx
rewrite ^(/download/.*)/media/(.*)\..*$ $1/mp3/$2.mp3 break;
```

The corresponding instructions will then look like this:

```nginx
match of regular expression
copy $1
copy "/mp3/"
copy $2
copy ".mp3"
end of regular expression
end of code
```

## Directives

- [[12-directives/break|break]]
- [[12-directives/if|if]]
- [[12-directives/return-http-rewrite|return]]
- [[12-directives/rewrite|rewrite]]
- [[12-directives/rewrite-log|rewrite_log]]
- [[12-directives/set-http-rewrite|set]]
- [[12-directives/uninitialized-variable-warn|uninitialized_variable_warn]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
