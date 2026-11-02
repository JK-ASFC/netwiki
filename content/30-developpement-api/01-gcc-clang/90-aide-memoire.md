---
title: GCC et Clang — aide-mémoire des commandes
description: Commandes GCC, Clang et outils binaires avec exemples — versions, -E, -S, -c, -o, -I, -L, -l, -D, -O0 à -O3, -Os, -g, -Wall, -Werror, -std, -fsanitize, -v et -### pour diagnostiquer, pkg-config, ldd, nm, objdump, readelf, strings, strip, ar, ldconfig, gdb et lldb (run, bt, break, watch), ccache.
tags: [aide-mémoire, gcc, clang, gdb, binutils]
icon: terminal
---

Explications : [[01-presentation-installation|GCC et Clang]].

```bash
gcc --version ; gcc -v ; clang -### -c test.c          # chaîne d'outils et options effectives
gcc -E test.c | less ; gcc -S -O2 test.c ; gcc -c test.c -o test.o
gcc -Iinclude -Llib -o app main.c -lmesure -DDEBUG=1 -O0 -g -Wall -Wextra -Werror
gcc $(pkg-config --cflags --libs libcurl) -o client client.c
echo | gcc -dM -E - | grep -i x86_64                    # macros prédéfinies
ar rcs libmesure.a mesure.o ; sudo ldconfig ; ldconfig -p | grep ssl
ldd ./app ; nm -C ./app | grep main ; readelf -d ./app | grep NEEDED ; objdump -d ./app | head ; strings ./app | grep -i version ; strip ./app
gdb ./app            # (gdb) run --opt ; bt ; break fichier.c:42 ; next ; step ; print x ; watch x ; continue ; quit
gdb -p 1234 ; gdb ./app core                             # processus en cours / fichier core
lldb ./app           # (lldb) run ; bt ; breakpoint set -n main ; frame variable
ccache -s ; ccache -C
```
