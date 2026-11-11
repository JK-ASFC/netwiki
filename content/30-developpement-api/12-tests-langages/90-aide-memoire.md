---
title: Tests BDD, Go, Rust, PHP et Ruby — aide-mémoire
description: Commandes Cucumber, Behave, Ginkgo, go test, cargo test, PHPUnit, Pest, RSpec et Minitest, avec couverture et rapports JUnit.
tags: [aide-mémoire, cucumber, behave, ginkgo, go test, cargo test, phpunit, pest, rspec, minitest]
icon: terminal
---

Explications : [[01-bdd-gotest-cargo|Cucumber, Behave, Ginkgo, go test et cargo test]] · [[02-phpunit-pest-rspec|PHPUnit, Pest, RSpec et Minitest]].

```bash
# BDD
npx cucumber-js                       # JavaScript
behave                                # Python
ginkgo -r --race --cover              # Go

# Go
go test ./... ; go test -race -cover ./... ; go test -bench=. -benchmem

# Rust
cargo test ; cargo nextest run

# PHP
vendor/bin/phpunit --coverage-clover coverage.xml --log-junit resultats.xml
vendor/bin/pest --coverage --min=80 --parallel

# Ruby
rspec --format documentation
rspec --format RspecJunitFormatter --out resultats.xml
ruby -Itest test/xxx_test.rb          # Minitest
```
