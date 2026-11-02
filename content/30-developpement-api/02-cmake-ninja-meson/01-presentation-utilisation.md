---
title: Présentation, installation et utilisation
description: CMake, Ninja et Meson — systèmes de construction pour C, C++ et projets multi-langages : rôles (générateurs CMake et Meson, exécuteur Ninja), installation (paquets, pip, winget, Homebrew, Kitware APT), CMakeLists.txt minimal, configuration hors source (cmake -S -B -G Ninja), types de build, options, construction parallèle, ctest, cmake --install et CPack, presets ; Meson (meson.build, meson setup, compile, test, install, options), dépendances (pkg-config, find_package, subprojects), et construire un logiciel depuis ses sources proprement.
tags: [cmake, ninja, meson, build, compilation, c++, ctest]
icon: info
---

| Outil | Rôle |
| --- | --- |
| **CMake** | Générateur de projets le plus répandu (C/C++), produit des fichiers Ninja, Makefile ou Visual Studio |
| **Ninja** | Exécuteur de construction minimal et très rapide (fichiers `build.ninja` générés par CMake ou Meson) |
| **Meson** | Générateur moderne en syntaxe lisible, utilisé par GNOME, systemd, Mesa, QEMU ; s'appuie sur Ninja |

## Installation

| Système | Commande |
| --- | --- |
| Debian/Ubuntu | `sudo apt install cmake ninja-build meson` (CMake récent : dépôt APT de Kitware) |
| RHEL/Fedora | `sudo dnf install cmake ninja-build meson` |
| Alpine | `sudo apk add cmake samurai meson` (samurai remplace ninja) |
| Toutes (Python) | `pipx install cmake ninja meson` |
| Windows | `winget install Kitware.CMake Ninja-build.Ninja` ; Meson : `pip install meson` ou MSI |
| macOS | `brew install cmake ninja meson` |

## CMake

```cmake
# CMakeLists.txt
cmake_minimum_required(VERSION 3.20)
project(sonde VERSION 1.2.0 LANGUAGES C)
find_package(PkgConfig REQUIRED)
pkg_check_modules(PCAP REQUIRED IMPORTED_TARGET libpcap)
add_executable(sonde src/main.c src/capture.c)
target_link_libraries(sonde PRIVATE PkgConfig::PCAP)
target_compile_options(sonde PRIVATE -Wall -Wextra)
install(TARGETS sonde RUNTIME DESTINATION bin)
enable_testing()
add_test(NAME aide COMMAND sonde --aide)
```

```bash
cmake -S . -B build -G Ninja -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=/opt/sonde
cmake --build build -j"$(nproc)"
ctest --test-dir build --output-on-failure
sudo cmake --install build
cmake -LH build | less                     # options disponibles et valeurs
cmake --build build --target clean
```

Construire un logiciel tiers : toujours **hors source** (`-B build`), préfixe dédié (`/opt/<logiciel>` ou `/usr/local`), et garder le dossier `build` pour désinstaller (`xargs rm < build/install_manifest.txt`). Mieux encore : produire un paquet avec **CPack** (`cpack -G DEB` dans `build`).

## Meson

```text
# meson.build
project('sonde', 'c', version : '1.2.0', default_options : ['warning_level=2', 'buildtype=release'])
pcap = dependency('libpcap')
executable('sonde', 'src/main.c', 'src/capture.c', dependencies : pcap, install : true)
```

```bash
meson setup build --prefix=/opt/sonde
meson configure build -Db_lto=true          # lire ou changer les options
meson compile -C build
meson test -C build
sudo meson install -C build
ninja -C build -t targets                   # cibles Ninja générées
```

Commandes : [[90-aide-memoire|aide-mémoire]].
