---
title: Présentation, installation et utilisation
description: GCC et Clang/LLVM — compilateurs C, C++ (et Fortran, Go, Ada pour GCC) : installation (build-essential sur Debian/Ubuntu, groupe Development Tools sur RHEL, build-base sur Alpine, Xcode Command Line Tools sur macOS, MSYS2/MinGW-w64, WinLibs ou LLVM et Visual Studio sous Windows), plusieurs versions et update-alternatives, options (-O2, -g, -Wall -Wextra, -std, -static, -fPIC, -march), durcissement (_FORTIFY_SOURCE, -fstack-protector-strong, PIE, RELRO), sanitizers (ASan, UBSan, TSan), compilation croisée ARM et Windows, ccache, outils binaires (ldd, nm, objdump, readelf, strip), GDB et LLDB, clang-tidy et clang-format.
tags: [gcc, clang, llvm, compilateur, c, c++, gdb, build-essential]
icon: info
---

**GCC** (GNU, GPL) et **Clang** (projet LLVM, Apache 2.0) compilent le C et le C++ ; l'administrateur en a besoin pour construire un logiciel depuis ses sources, un module noyau (DKMS), une extension Python/Perl/Ruby native ou un outil absent des dépôts. Clang donne des messages d'erreur plus lisibles et alimente l'outillage (clang-tidy, clangd) ; GCC reste le compilateur de référence des distributions Linux.

## Installation

| Système | GCC | Clang/LLVM |
| --- | --- | --- |
| Debian/Ubuntu | `sudo apt install build-essential gdb` | `sudo apt install clang lld lldb clang-tidy clang-format` |
| RHEL/Rocky/Alma | `sudo dnf group install "Development Tools"` | `sudo dnf install clang lld lldb clang-tools-extra` |
| Alpine | `sudo apk add build-base gdb` | `sudo apk add clang lld` |
| Arch | `sudo pacman -S base-devel` | `sudo pacman -S clang lld lldb` |
| macOS | `xcode-select --install` (fournit Apple Clang ; `gcc` y est un alias de clang) ; vrai GCC : `brew install gcc` | `brew install llvm` (LLVM complet) |
| Windows | **MSYS2** : `pacman -S mingw-w64-ucrt-x86_64-gcc` ; ou WinLibs | `winget install LLVM.LLVM` ; ou MSVC + composant « Clang » de Visual Studio |

Versions supplémentaires : `gcc-14`, `clang-19`… (dépôt `apt.llvm.org` pour les dernières versions de LLVM, *GCC Toolset* `gcc-toolset-14` sur RHEL avec `scl enable gcc-toolset-14 bash`).

```bash
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-14 140 --slave /usr/bin/g++ g++ /usr/bin/g++-14
gcc --version ; clang --version
```

## Options courantes

```bash
gcc -O2 -g -Wall -Wextra -std=c17 -o sonde sonde.c -lpcap          # optimisé + symboles de débogage
g++ -O2 -std=c++20 -o outil main.cpp util.cpp -lpthread
gcc -shared -fPIC -o libmesure.so mesure.c                           # bibliothèque partagée
gcc -static -O2 -o outil-statique outil.c                            # binaire statique (glibc : préférer musl-gcc)
clang -O2 -march=x86-64-v3 -o rapide calcul.c                        # cible CPU (attention à la portabilité)
```

Durcissement (ce que font les paquets des distributions) :

```bash
gcc -O2 -D_FORTIFY_SOURCE=3 -fstack-protector-strong -fstack-clash-protection -fPIE -pie \
    -Wl,-z,relro,-z,now -o service service.c
```

Chercher les erreurs mémoire et comportements indéfinis pendant les tests :

```bash
clang -g -O1 -fsanitize=address,undefined -fno-omit-frame-pointer -o test test.c && ./test
gcc -g -fsanitize=thread -o concurrence concurrence.c
```

## Compilation croisée

```bash
sudo apt install gcc-aarch64-linux-gnu gcc-mingw-w64-x86-64
aarch64-linux-gnu-gcc -O2 -o sonde-arm64 sonde.c                   # Raspberry Pi 64 bits, serveurs ARM
x86_64-w64-mingw32-gcc -O2 -o sonde.exe sonde.c                     # exécutable Windows depuis Linux
clang --target=aarch64-linux-gnu --sysroot=/srv/sysroot-arm64 -fuse-ld=lld -o sonde-arm64 sonde.c
```

## Outils associés

```bash
ccache gcc -O2 -c gros.c                       # cache de compilation (CC="ccache gcc")
ldd ./outil ; nm -D libmesure.so | grep mesure ; readelf -h ./outil ; objdump -d ./outil | less ; strip ./outil
gdb --args ./outil --config test.conf          # run, bt, break main, next, print var
lldb ./outil
clang-tidy src/*.c -- -Iinclude ; clang-format -i src/*.c
```

Construction de projets : [[02-cmake-ninja-meson/01-presentation-utilisation|CMake, Ninja et Meson]]. Commandes : [[90-aide-memoire|aide-mémoire]].
