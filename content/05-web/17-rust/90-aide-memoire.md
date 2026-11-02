---
title: Rust — aide-mémoire des commandes
description: Commandes rustup et cargo avec exemples — rustup show/update/default/target/component/toolchain/override, cargo new/init/build/run/check/test/bench/doc/clean, add/remove/update/tree, install/uninstall, fmt, clippy, audit, publish, --release, --target, --features, -p dans un espace de travail.
tags: [aide-mémoire, rust, cargo, rustup]
icon: terminal
---

Explications : [[01-presentation-installation|Rust]].

```bash
rustup show ; rustup update ; rustup default stable
rustup target list --installed ; rustup target add wasm32-unknown-unknown
rustup component add clippy rustfmt
rustup override set 1.85.0                     # version imposée pour ce répertoire
rustup toolchain list
cargo new api --bin ; cargo init --lib
cargo check ; cargo build --release ; cargo run --release -- --aide
cargo test -- --nocapture ; cargo bench ; cargo doc --no-deps
cargo add serde --features derive ; cargo remove serde ; cargo update -p tokio ; cargo tree -d
cargo build -p collecteur --features tls      # membre d'un espace de travail
cargo install ripgrep ; cargo install --list ; cargo uninstall ripgrep
cargo fmt ; cargo clippy --all-targets -- -D warnings ; cargo audit
cargo clean
```
