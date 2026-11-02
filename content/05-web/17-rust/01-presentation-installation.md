---
title: Présentation, installation et utilisation
description: Rust — langage système sans ramasse-miettes, à la sûreté mémoire vérifiée à la compilation : installation avec rustup (Linux, macOS, Windows avec les outils de compilation MSVC), paquets des distributions, canaux stable/beta/nightly, cargo (new, build, run, test, add, install, update), profils release, cibles et compilation croisée (musl statique, ARM, Windows), clippy, rustfmt, cargo audit et cargo deny, dépôt de crates interne, et déploiement de binaires.
tags: [rust, rustup, cargo, compilation, musl, sécurité mémoire]
icon: info
---

**Rust** (MIT/Apache 2.0) combine les performances du C et la **sûreté mémoire** garantie par le compilateur. On le croise de plus en plus côté infrastructure : outils en ligne de commande (ripgrep, fd), proxys, agents de supervision, composants du noyau Linux, et outils écrits pour remplacer du C exposé au réseau. Une version stable sort toutes les **6 semaines**.

## Installation

| Système | Commande |
| --- | --- |
| Linux, macOS | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` |
| Windows | `winget install Rustlang.Rustup` (ou `rustup-init.exe`) + **Visual Studio Build Tools** (charge « Développement Desktop en C++ ») |
| Debian/Ubuntu | `sudo apt install rustc cargo` (version de la distribution, plus ancienne) |
| RHEL/Fedora | `sudo dnf install rust cargo` |
| Alpine | `sudo apk add rust cargo` |
| macOS | `brew install rustup` puis `rustup-init` |

```bash
rustup show ; rustc --version ; cargo --version
rustup update                                 # mettre à jour la chaîne stable
rustup component add clippy rustfmt rust-analyzer
rustup toolchain install nightly              # canal nightly si un projet l'exige
```

`rustup` s'installe pour l'utilisateur (`~/.cargo/bin`) : sur un serveur de construction, installez-le pour le compte de CI, pas pour root.

## Projet et compilation

```bash
cargo new outil-scan && cd outil-scan
cargo add tokio --features full ; cargo add clap --features derive
cargo build                         # debug, dans target/debug/
cargo build --release               # optimisé, dans target/release/
cargo run -- --cible 10.0.20.0/24
cargo test ; cargo clippy -- -D warnings ; cargo fmt --check
cargo doc --open
```

Compilation croisée et binaire statique :

```bash
rustup target add x86_64-unknown-linux-musl aarch64-unknown-linux-gnu x86_64-pc-windows-gnu
cargo build --release --target x86_64-unknown-linux-musl      # binaire Linux statique
cargo install cross && cross build --release --target aarch64-unknown-linux-gnu   # via conteneurs
```

```toml
# Cargo.toml — profil de production
[profile.release]
lto = true
codegen-units = 1
strip = true
panic = "abort"
```

## Sécurité de la chaîne d'approvisionnement

```bash
cargo install cargo-audit cargo-deny
cargo audit                    # vulnérabilités connues (base RustSec)
cargo deny check               # licences, sources et doublons autorisés
cargo update                   # mettre à jour Cargo.lock dans les limites de Cargo.toml
```

Registre ou miroir interne : `~/.cargo/config.toml` (`[source.crates-io] replace-with = …`, `[registries]`). Commandes : [[90-aide-memoire|aide-mémoire]].
