---
title: Cucumber, Behave, Ginkgo, go test et cargo test
description: Tests comportementaux (BDD) et tests natifs Go et Rust — BDD avec le langage Gherkin (Given/When/Then), Cucumber (multi-langages, fichiers .feature et step definitions), Behave (BDD Python), Ginkgo (BDD Go, Gomega), tests natifs Go (go test, table-driven, couverture, race, benchmarks) et Rust (cargo test, modules tests, doctests, cargo-nextest) ; quand le BDD est pertinent et choix.
tags: [bdd, gherkin, cucumber, behave, ginkgo, go test, cargo test, rust, go]
icon: flask-conical
---

## BDD et Gherkin

Le **BDD** (*Behavior-Driven Development*) décrit le comportement attendu dans un langage lisible par tous, **Gherkin**, avant de le relier au code. Utile quand des **non-développeurs** (métier, QA) participent à la définition des scénarios.

```text fonctionnalites/connexion.feature
# language: fr
Fonctionnalité: Connexion
  Scénario: identifiants valides
    Étant donné un utilisateur "test" avec le mot de passe "secret"
    Quand il se connecte
    Alors il accède au tableau de bord
```

Chaque étape (*step*) est reliée à une fonction qui l'exécute. Le BDD a un **coût** (maintenance des *step definitions*) : le réserver aux parcours métier importants, pas à tout le code.

### Cucumber

Multi-langages (Java, JavaScript, Ruby…), c'est l'implémentation historique du BDD.

```bash
npm install -D @cucumber/cucumber        # variante JavaScript
npx cucumber-js
```

### Behave (Python)

```bash
python3 -m pip install behave
behave                                   # lit features/ et les steps Python
```

```python features/steps/connexion.py
from behave import given, when, then

@when("il se connecte")
def etape(contexte):
    contexte.reponse = connexion(contexte.utilisateur, contexte.mdp)
```

### Ginkgo (Go)

**Ginkgo** apporte un style BDD (`Describe`/`It`) à Go, avec la bibliothèque d'assertions **Gomega**.

```bash
go install github.com/onsi/ginkgo/v2/ginkgo@latest
ginkgo -r --race --cover
```

## go test

Go intègre les tests **nativement** : fichiers `*_test.go`, fonctions `TestXxx`, pas de framework externe. Style **table-driven** idiomatique, détection de *data races*, couverture et **benchmarks** inclus.

```go calcul_test.go
func TestDiviser(t *testing.T) {
    cas := []struct{ a, b, veut int }{{6, 2, 3}, {9, 3, 3}}
    for _, c := range cas {
        if got := Diviser(c.a, c.b); got != c.veut {
            t.Errorf("Diviser(%d,%d)=%d, veut %d", c.a, c.b, got, c.veut)
        }
    }
}
```

```bash
go test ./...                            # tous les paquets
go test -run TestDiviser -v
go test -race ./...                      # détecteur de courses
go test -cover -coverprofile=cov.out ./... && go tool cover -html=cov.out
go test -bench=. -benchmem               # benchmarks
```

## cargo test

Rust intègre aussi les tests : modules `#[cfg(test)]` avec `#[test]`, tests d'intégration dans `tests/`, et **doctests** (exemples de la documentation exécutés).

```rust
pub fn diviser(a: i32, b: i32) -> i32 { a / b }

#[cfg(test)]
mod tests {
    use super::*;
    #[test] fn division() { assert_eq!(diviser(6, 2), 3); }
    #[test] #[should_panic] fn division_zero() { diviser(1, 0); }
}
```

```bash
cargo test                               # unitaires + intégration + doctests
cargo test division -- --nocapture
cargo install cargo-nextest && cargo nextest run   # exécuteur plus rapide et lisible
```

## Choisir

| Besoin | Outil |
| --- | --- |
| Scénarios métier lisibles par tous | Cucumber, Behave (Python), Ginkgo (Go) |
| Tests Go | `go test` (natif), Ginkgo pour un style BDD |
| Tests Rust | `cargo test`, cargo-nextest |
| Python / JVM / .NET | [[10-tests-unitaires/01-pytest-junit-nunit\|pytest, JUnit, xUnit…]] |
| JavaScript | [[11-tests-js/01-vitest-jest-mocha\|Vitest, Jest, Mocha]] |

Commandes : [[90-aide-memoire|aide-mémoire]].
