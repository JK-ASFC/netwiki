---
title: "Modules natifs"
description: "Nginx — Modules natifs. Les modules natifs permettent de charger des bibliothèques partagées écrites en C (fichiers .so) dans NGINX JavaScript, pour des opérations critiques en performances ou des intégrations système. Cette fonction n'est…"
tags: [nginx, guide]
icon: book-open
---

## Présentation

Les modules natifs permettent de charger des bibliothèques partagées écrites en C (fichiers .so) dans NGINX JavaScript, pour des opérations critiques en performances ou des intégrations système. Cette fonction n'est disponible qu'avec le [[10-guides/04-njs/engine|moteur QuickJS]] et n'est pas prise en charge par le moteur natif njs. Elle existe depuis la version 0.9.5.

## Quand utiliser des modules natifs

Les modules natifs sont utiles dans les cas suivants :

- Opérations critiques en performances qui dépassent les capacités de JavaScript
- Intégrations système nécessitant des bibliothèques C
- Réutilisation de code C/C++ existant

Les modules natifs doivent servir à des primitives de bas niveau plutôt qu'à une logique métier complexe : opérations cryptographiques (hachage, chiffrement), compression et décompression de données, analyse de protocoles binaires, opérations rapides sur les chaînes ou calculs mathématiques. La logique applicative complexe doit rester en JavaScript, plus facile à maintenir, déboguer et modifier.

Limites :

- Les modules natifs doivent être compilés pour la même architecture que NGINX
- Les modules natifs s'exécutent avec tous les privilèges du processus et nécessitent une relecture de sécurité attentive

## Charger des modules natifs dans NGINX

Les modules natifs se chargent avec ces directives, indiquées dans le contexte `main` :

- [[12-directives/js-load-http-native-module|js_load_http_native_module]] pour le contexte HTTP
- [[12-directives/js-load-stream-native-module|js_load_stream_native_module]] pour le contexte Stream

Exemple de configuration :

```nginx
js_load_http_native_module /path/to/mylib.so;
js_load_http_native_module /path/to/other.so as myalias;

http {
    js_import main.js;

    server {
        listen 8000;
        location / {
            js_content main.handler;
        }
    }
}
```

Une fois chargé, le module peut être importé dans le code JavaScript :

```nginx
// Import by filename
import * as mylib from 'mylib.so';

// Import by alias
import * as myalias from 'myalias';

function handler(r) {
    let result = mylib.add(5, 10);
    r.return(200, `Result: ${result}\n`);
}

export default { handler };
```

## Compiler des modules natifs

Les modules natifs doivent mettre en œuvre la fonction `js_init_module` comme point d'entrée. QuickJS l'appelle au chargement du module.

Exemple complet d'un module natif simple qui exporte deux fonctions :

```nginx
#include <quickjs.h>

#define countof(x) (sizeof(x) / sizeof((x)[0]))

/* Add two numbers */
static JSValue
js_add(JSContext *ctx, JSValueConst this_val, int argc, JSValueConst *argv)
{
    int a, b;

    if (argc < 2) {
        return JS_ThrowTypeError(ctx, "expected 2 arguments");
    }

    if (JS_ToInt32(ctx, &a, argv[0]) < 0) {
        return JS_EXCEPTION;
    }

    if (JS_ToInt32(ctx, &b, argv[1]) < 0) {
        return JS_EXCEPTION;
    }

    return JS_NewInt32(ctx, a + b);
}

/* Reverse a string */
static JSValue
js_reverse_string(JSContext *ctx, JSValueConst this_val, int argc,
    JSValueConst *argv)
{
    char        *reversed;
    size_t       i, len;
    JSValue      result;
    const char  *str;

    if (argc < 1) {
        return JS_ThrowTypeError(ctx, "expected 1 argument");
    }

    str = JS_ToCStringLen(ctx, &len, argv[0]);
    if (!str) {
        return JS_EXCEPTION;
    }

    reversed = js_malloc(ctx, len + 1);
    if (!reversed) {
        JS_FreeCString(ctx, str);
        return JS_EXCEPTION;
    }

    for (i = 0; i < len; i++) {
        reversed[i] = str[len - 1 - i];
    }
    reversed[len] = '\0';

    result = JS_NewString(ctx, reversed);

    js_free(ctx, reversed);
    JS_FreeCString(ctx, str);

    return result;
}

/* Module function list */
static const JSCFunctionListEntry js_module_funcs[] = {
    JS_CFUNC_DEF("add", 2, js_add),
    JS_CFUNC_DEF("reverseString", 1, js_reverse_string),
};

/* Module initialization */
static int
js_module_init(JSContext *ctx, JSModuleDef *m)
{
    return JS_SetModuleExportList(ctx, m, js_module_funcs,
                                  countof(js_module_funcs));
}

/* Required entry point */
JSModuleDef *
js_init_module(JSContext *ctx, const char *module_name)
{
    JSModuleDef  *m;

    m = JS_NewCModule(ctx, module_name, js_module_init);
    if (!m) {
        return NULL;
    }

    JS_AddModuleExportList(ctx, m, js_module_funcs,
                           countof(js_module_funcs));

    return m;
}
```

Pour compiler le module natif :

```nginx
gcc -fPIC -shared -I/path/to/quickjs -o mymodule.so mymodule.c
```

où `/path/to/quickjs` est le répertoire contenant les fichiers d'en-tête de QuickJS.

> [!NOTE]
> Pour un suivi correct de la mémoire, utilisez toujours les fonctions d'allocation de QuickJS (`js_malloc`, `js_free`) au lieu de celles de la bibliothèque standard (`malloc`, `free`).

## Ressources supplémentaires

Pour en savoir plus sur l'API C de QuickJS :

- [Site officiel de QuickJS](https://bellard.org/quickjs/)
- Le fichier d'en-tête de QuickJS (`quickjs.h`) contient une documentation complète de l'API

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
