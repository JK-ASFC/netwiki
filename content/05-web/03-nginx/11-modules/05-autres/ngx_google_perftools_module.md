---
title: "ngx_google_perftools_module"
description: "Module nginx ngx_google_perftools_module — The ngx_google_perftools_module module (0.6.29) enables profiling of nginx worker processes using Google Performance Tools. The module is intended for nginx developers."
tags: [nginx, module, ngx_google_perftools_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_google_perftools_module` module (0.6.29) enables profiling of nginx worker processes using [Google Performance Tools](https://github.com/gperftools/gperftools). The module is intended for nginx developers.

This module is not built by default, it should be enabled with the `--with-google_perftools_module` configuration parameter.

> [!NOTE]
> This module requires the [gperftools](https://github.com/gperftools/gperftools) library.

## Example Configuration

```nginx
google_perftools_profiles /path/to/profile;
```

Profiles will be stored as `/path/to/profile.<worker_pid>`.

## Directives

- [[12-directives/google-perftools-profiles|google_perftools_profiles]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
