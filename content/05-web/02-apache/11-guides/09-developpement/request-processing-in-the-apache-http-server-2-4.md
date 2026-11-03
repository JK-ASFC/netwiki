---
title: "Request Processing in the Apache HTTP Server 2.4"
description: "Apache HTTP Server — Request Processing in the Apache HTTP Server 2.4. This document describes how the Apache HTTP Server processes requests internally, covering the full hook sequence from URI translation through content generation and logging. Module authors should understand these phases to correctly insert"
tags: [apache, guide]
icon: book-open
---

> [!NOTE]
> Cette page n’a pas de traduction française officielle : le texte original en anglais est reproduit tel quel.

This document describes how the Apache HTTP Server processes requests internally, covering the full hook sequence from URI translation through content generation and logging. Module authors should understand these phases to correctly insert their processing at the appropriate point in the cycle.

All requests pass through `ap_process_request_internal()` in `server/request.c`, including subrequests and internal redirects. Do not duplicate this logic elsewhere; doing so will break when the request processing API changes.

The first major design principle is that all request processing paths (main requests, subrequests, and redirects) share a single code path. Duplicate code was folded back into `ap_process_request_internal()` in 2.0 to prevent the paths from falling out of sync.

To streamline requests, module authors can take advantage of the [[11-guides/09-developpement/developing-modules-for-the-apache-http-server-2-4|hooks offered]] to drop out of the request cycle early, or to bypass core hooks which are irrelevant (and costly in terms of CPU).

## Hook Overview

The complete request processing cycle involves the following hooks, listed in execution order. Hooks marked with *(request.c)* are implemented in `server/request.c`; others are declared in `http_config.h` or `http_protocol.h` and run from the MPM or protocol layer.

1. **quick\_handler** — Short-circuit before the full request cycle (e.g. cache hits)
2. **create\_request** — Initialize request-specific module data
3. **pre\_translate\_name** — Manipulate URI before decoding/translation
4. **translate\_name** — Map URI to filesystem path
5. **map\_to\_storage** — Merge per-directory config, directory/file walks
6. **post\_perdir\_config** — Act on merged per-directory configuration
7. **header\_parser** — Examine client request headers
8. **access\_checker** — Host-based or environment-based access control
9. **access\_checker\_ex** — Extended access control with auth bypass capability
10. **force\_authn** — Force authentication even when not otherwise required
11. **check\_user\_id** — Authenticate the user (set `r->user`)
12. **auth\_checker** — Authorize the authenticated user
13. **type\_checker** — Determine content type, language, encoding
14. **fixups** — Last chance to adjust request fields before content generation
15. **insert\_filter** — Insert content/protocol filters
16. **handler** — Generate the response content
17. **log\_transaction** — Log the completed transaction

Additionally, the **dirwalk\_stat** hook is called during directory walks to allow modules to emulate or override `apr_stat()` calls.

## The Request Parsing Phase

Before hooks run, the server performs URL normalization:

### Unescapes the URL

The request's `parsed_uri` path is unescaped, once and only once, at the beginning of internal request processing.

This step is bypassed if the proxyreq flag is set, or the `parsed_uri.path` element is unset. The module has no further control of this one-time unescape operation; either failing to unescape or multiply unescaping the URL leads to security repercussions.

### Strips Parent and This Elements from the URI

All `/../` and `/./` elements are removed by `ap_getparents()`, as well as any trailing `/.` or `/..` element. This helps to ensure the path is (nearly) absolute before the request processing continues. (See RFC 1808 section 4 for further discussion.)

This step cannot be bypassed.

### Initial URI Location Walk

Every request is subject to an `ap_location_walk()` call. This ensures that [[13-directives/location|<Location>]] sections are consistently enforced for all requests. If the request is an internal redirect or a sub-request, it may borrow some or all of the processing from the previous or parent request's ap\_location\_walk, so this step is generally very efficient after processing the main request.

## Hook: quick\_handler

The `quick_handler` hook runs *before* any other request processing hooks — before location walks, directory walks, access checking, and authentication. It provides a fast path for modules that can serve content directly from a URI-keyed cache or similar mechanism without needing per-directory configuration.

This hook is declared in `http_config.h` and called from the MPM/protocol layer, not from `ap_process_request_internal()`.

```c
AP_DECLARE_HOOK(int, quick_handler, (request_rec *r, int lookup_uri))
```

The `lookup_uri` parameter is set to 1 when called from `ap_sub_req_lookup_uri()`, indicating the caller only needs metadata (not actual content delivery).

Used by: [[12-modules/mod_cache|mod_cache]]

Return `OK` to indicate the request has been fully handled. Return `DECLINED` to fall through to normal processing.

## Hook: create\_request

Called when a new `request_rec` is created (for main requests, subrequests, and internal redirects). Modules use this hook to initialize per-request module state and set up private data structures attached to the request pool or request notes.

```c
AP_DECLARE_HOOK(int, create_request, (request_rec *r))
```

This is a `RUN_ALL` hook — all registered modules get a chance to run. Return `OK` or `DECLINED`.

Used by: `mod_http` (http\_core.c), `mod_firehose`

## The Translation Phase

### Hook: pre\_translate\_name

Runs before URL decoding happens. Modules can manipulate the raw URI before it is translated to a filesystem path. This is useful for modules that need to operate on the URI before percent-decoding or normalization.

```c
AP_DECLARE_HOOK(int, pre_translate_name, (request_rec *r))
```

Return `DECLINED` to let other modules handle the pre-translation, `OK` if it was handled, `DONE` if no further transformation should happen on the URI, or an HTTP error status code.

Used by: [[12-modules/mod_proxy|mod_proxy]]

### Hook: translate\_name

Modules can determine the file name, or alter the given URI in this step. For example, [[12-modules/mod_vhost_alias|mod_vhost_alias]] will translate the URI's path into the configured virtual host, [[12-modules/mod_alias|mod_alias]] will translate the path to an alias path, and if the request falls back on the core, the [[13-directives/documentroot|DocumentRoot]] is prepended to the request resource.

```c
AP_DECLARE_HOOK(int, translate_name, (request_rec *r))
```

If all modules `DECLINE` this phase, an error 500 is returned to the browser, and a "couldn't translate name" error is logged automatically.

## Hook: map\_to\_storage

After the file or correct URI was determined, the appropriate per-dir configurations are merged together. For example, [[12-modules/mod_proxy|mod_proxy]] compares and merges the appropriate [[13-directives/proxy|<Proxy>]] sections. If the URI is nothing more than a local (non-proxy) `TRACE` request, the core handles the request and returns `DONE`.

```c
AP_DECLARE_HOOK(int, map_to_storage, (request_rec *r))
```

If no module answers this hook with `OK` or `DONE`, the core will run the request filename against the [[13-directives/directory|<Directory>]] and [[13-directives/files|<Files>]] sections. If the request 'filename' isn't an absolute, legal filename, a note is set for later termination.

After `map_to_storage`, a second `ap_location_walk()` call hardens the request by re-applying [[13-directives/location|<Location>]] sections to the translated URI.

## Hook: post\_perdir\_config

This hook fires immediately after per-directory configuration has been merged (after both `map_to_storage` and the second location walk). Modules can use it to act on the fully-merged per-directory configuration before access control runs.

```c
AP_DECLARE_HOOK(int, post_perdir_config, (request_rec *r))
```

Return `OK` to allow processing to continue, `DECLINED` to let later modules decide, or an HTTP error status code to abort.

## Hook: header\_parser

The main request then parses the client's headers. This prepares the remaining request processing steps to better serve the client's request. This hook only runs for the initial request (not subrequests).

## The Security Phase

The security phase in 2.4 uses the provider-based authentication/authorization architecture managed by [[12-modules/mod_auth_basic|mod_auth_basic]], [[12-modules/mod_authz_core|mod_authz_core]], and related modules. The hook execution order depends on the [[13-directives/satisfy|Satisfy]] setting and whether access control is required ([[13-directives/require|Require]] directives).

The hooks execute in this order:

### Hook: access\_checker

Applies additional access control to the resource. This hook runs *before* a user is authenticated, so it is for restrictions independent of user identity (e.g. IP-based access, time-of-day restrictions). It runs independent of [[13-directives/require|Require]] directive usage.

```c
AP_DECLARE_HOOK(int, access_checker, (request_rec *r))
```

This is a `RUN_ALL` hook — all registered modules run. Return `OK` to allow, or an HTTP error status to deny.

Modules should register using `ap_hook_check_access()` rather than hooking `access_checker` directly.

### Hook: access\_checker\_ex

Extended access control that runs after `access_checker` but before user authentication. This hook can also *bypass* authentication entirely by returning `OK` — used by [[12-modules/mod_authz_core|mod_authz_core]] to implement the authorization model where `Require` directives can grant access without credentials (e.g. `Require ip`).

```c
AP_DECLARE_HOOK(int, access_checker_ex, (request_rec *r))
```

Return `OK` to grant access (skipping authn unless `force_authn` overrides), `DECLINED` to require authentication, or an HTTP error status to deny.

Modules should register using `ap_hook_check_access_ex()` rather than hooking `access_checker_ex` directly.

### Hook: force\_authn

Allows a module to force authentication to be required even when `access_checker_ex` has already granted access. This is useful when a module needs the authenticated user identity for purposes beyond authorization (e.g. logging, personalization).

```c
AP_DECLARE_HOOK(int, force_authn, (request_rec *r))
```

Return `OK` to force authentication, or `DECLINED` to let later modules decide.

### Hook: check\_user\_id (authn)

Authenticates the user — analyzes the request headers, validates credentials, and sets `r->user` and `r->ap_auth_type`. This hook only runs when Apache determines that authentication is required for this resource.

```c
AP_DECLARE_HOOK(int, check_user_id, (request_rec *r))
```

Modules should register using `ap_hook_check_authn()` rather than hooking `check_user_id` directly.

### Hook: auth\_checker (authz)

Checks whether the authenticated user (`r->user`) is authorized to access this resource. Runs after `check_user_id`, and only when a [[13-directives/require|Require]] directive is in effect.

```c
AP_DECLARE_HOOK(int, auth_checker, (request_rec *r))
```

Modules should register using `ap_hook_check_authz()` rather than hooking `auth_checker` directly.

## The Preparation Phase

### Hook: type\_checker

The modules have an opportunity to test the URI or filename against the target resource, and set mime information for the request. Both [[12-modules/mod_mime|mod_mime]] and [[12-modules/mod_mime_magic|mod_mime_magic]] use this phase to compare the file name or contents against the administrator's configuration and set the content type, language, character set and request handler. Some modules may set up their filters or other request handling parameters at this time.

```c
AP_DECLARE_HOOK(int, type_checker, (request_rec *r))
```

If all modules `DECLINE` this phase, an error 500 is returned to the browser, and a "couldn't find types" error is logged automatically.

### Hook: fixups

Many modules are "trounced" by some phase above. The fixups phase is used by modules to reassert their ownership or force the request's fields to their appropriate values. It is the last hook to run before content generation.

```c
AP_DECLARE_HOOK(int, fixups, (request_rec *r))
```

This is a `RUN_ALL` hook — all registered modules get a chance to run. Used by [[12-modules/mod_env|mod_env]], [[12-modules/mod_headers|mod_headers]], and others.

## The Handler Phase

This phase is **not** part of the processing in `ap_process_request_internal()`. After the core or a module calls `ap_process_request_internal()`, it then calls `ap_invoke_handler()` to generate the request.

### Hook: insert\_filter

Modules that transform the content in some way can insert their values and override existing filters, such that if the user configured a more advanced filter out-of-order, then the module can move its order as needed. There is no result code, so actions in this hook must always succeed.

```c
AP_DECLARE_HOOK(void, insert_filter, (request_rec *r))
```

This is a VOID hook — no return value. Used by [[12-modules/mod_deflate|mod_deflate]], [[12-modules/mod_filter|mod_filter]], [[12-modules/mod_ssl|mod_ssl]], and other filter modules to insert themselves into the output filter chain.

### Hook: handler

The module finally has a chance to serve the request in its handler hook. Note that not every prepared request is sent to the handler hook. Many modules, such as [[12-modules/mod_autoindex|mod_autoindex]], will create subrequests for a given URI, and then never serve the subrequest, but simply list it for the user. Remember not to put required teardown from the hooks above into this module, but register pool cleanups against the request pool to free resources as required.

```c
AP_DECLARE_HOOK(int, handler, (request_rec *r))
```

## The Logging Phase

### Hook: log\_transaction

After the response has been sent to the client, modules can perform logging activities. This hook is declared in `http_protocol.h` and runs outside of `ap_process_request_internal()`.

```c
AP_DECLARE_HOOK(int, log_transaction, (request_rec *r))
```

Used by: [[12-modules/mod_log_config|mod_log_config]], [[12-modules/mod_log_forensic|mod_log_forensic]], [[12-modules/mod_logio|mod_logio]]

Return `OK` or `DECLINED`. Errors at this stage do not affect the client response (it has already been sent).

## Hook: dirwalk\_stat

This hook is called during directory walks to allow modules to handle or emulate the `apr_stat()` calls needed to traverse the filesystem. This enables modules to serve content from non-filesystem backends (databases, remote storage, etc.) while still participating in the directory walk mechanism.

```c
AP_DECLARE_HOOK(apr_status_t, dirwalk_stat,
                (apr_finfo_t *finfo, request_rec *r, apr_int32_t wanted))
```

Return an `apr_status_t` value, or `AP_DECLINED` to let later modules (or the default `apr_stat()` call) decide.

## Hook Types and Ordering

Each hook uses one of the following execution strategies:

**`RUN_FIRST`**

Hooks stop at the first module that does *not* return `DECLINED`. Used by: `pre_translate_name`, `translate_name`, `map_to_storage`, `check_user_id`, `type_checker`, `access_checker_ex`, `auth_checker`, `force_authn`, `dirwalk_stat`.

**`RUN_ALL`**

Every registered module runs unless one returns an error. Used by: `fixups`, `access_checker`, `create_request`, `post_perdir_config`.

**`VOID`**

Every registered module runs with no return value. Used by: `insert_filter`.

Modules control their position in the hook chain using the `order`, `predecessors`, and `successors` arguments to the `ap_hook_*` registration functions. See [[11-guides/09-developpement/developing-modules-for-the-apache-http-server-2-4|the module guide]] for details.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (texte original en anglais, pas de traduction officielle), © Apache Software Foundation, licence Apache 2.0.*
