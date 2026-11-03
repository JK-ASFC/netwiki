---
title: "disable_symlinks"
description: "Directive nginx disable_symlinks (ngx_http_core_module) — Determines how symbolic links should be treated when opening files: - off Symbolic links in the pathname are allowed and not checked. This is the default behavior. - on If any component of the…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `disable_symlinks off;` ou `disable_symlinks on \| if_not_owner [from=part];` |
| **Valeur par défaut** | `disable_symlinks off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.1.15 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Determines how symbolic links should be treated when opening files:

- **`off`**

  Symbolic links in the pathname are allowed and not checked. This is the default behavior.

- **`on`**

  If any component of the pathname is a symbolic link, access to a file is denied.

- **`if_not_owner`**

  Access to a file is denied if any component of the pathname is a symbolic link, and the link and object that the link points to have different owners.

- **`from`=*part***

  When checking symbolic links (parameters `on` and `if_not_owner`), all components of the pathname are normally checked. Checking of symbolic links in the initial part of the pathname may be avoided by specifying additionally the `from`=*part* parameter. In this case, symbolic links are checked only from the pathname component that follows the specified initial part. If the value is not an initial part of the pathname checked, the whole pathname is checked as if this parameter was not specified at all. If the value matches the whole file name, symbolic links are not checked. The parameter value can contain variables.

Example:

```nginx
disable_symlinks on from=$document_root;
```

This directive is only available on systems that have the `openat` and `fstatat` interfaces. Such systems include modern versions of FreeBSD, Linux, and Solaris.

Parameters `on` and `if_not_owner` add a processing overhead.

> [!NOTE]
> On systems that do not support opening of directories only for search, to use these parameters it is required that worker processes have read permissions for all directories being checked.

> [!NOTE]
> The [[11-modules/02-http/ngx_http_autoindex_module|ngx_http_autoindex_module]], [[11-modules/02-http/ngx_http_random_index_module|ngx_http_random_index_module]], and [[11-modules/02-http/ngx_http_dav_module|ngx_http_dav_module]] modules currently ignore this directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
