---
title: CMake, Ninja et Meson — aide-mémoire des commandes
description: Commandes CMake (-S, -B, -G, -D, --build, --target, -j, --install, --preset, -L, --fresh, ctest, cpack), Ninja (-C, -j, -t targets, -t clean, -t graph, -v) et Meson (setup, configure, compile, test, install, introspect, --reconfigure, --wipe) avec exemples.
tags: [aide-mémoire, cmake, ninja, meson]
icon: terminal
---

Explications : [[01-presentation-utilisation|CMake, Ninja et Meson]].

```bash
cmake --version ; cmake --help | grep -A20 Generators
cmake -S . -B build -G Ninja -DCMAKE_BUILD_TYPE=RelWithDebInfo ; cmake --fresh -S . -B build
cmake --build build -j8 --target sonde ; cmake --build build --verbose
cmake --install build --prefix ~/.local ; cmake --list-presets ; cmake --preset release
ctest --test-dir build -j4 --output-on-failure ; cd build && cpack -G DEB
ninja -C build ; ninja -C build -j4 ; ninja -C build -t targets all ; ninja -C build -t clean ; ninja -C build -v
meson setup build ; meson setup --reconfigure build ; meson setup --wipe build
meson configure build ; meson compile -C build ; meson test -C build --print-errorlogs ; meson install -C build --destdir /tmp/paquet
meson introspect build --targets | jq '.[].name'
```
