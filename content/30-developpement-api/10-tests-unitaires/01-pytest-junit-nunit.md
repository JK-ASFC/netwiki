---
title: pytest, JUnit, TestNG, NUnit, xUnit.net et MSTest
description: Frameworks de tests unitaires — pytest (Python : fonctions de test, assert, fixtures, paramétrage, marqueurs, couverture, pytest-xdist), JUnit 5 (Java : annotations, assertions, cycle de vie, Maven/Gradle), TestNG (Java : groupes, dépendances, data providers), et côté .NET NUnit, xUnit.net et MSTest (attributs, assertions, dotnet test) ; rapports JUnit XML pour la CI et bonnes pratiques.
tags: [pytest, junit, testng, nunit, xunit, mstest, tests unitaires, python, java, dotnet]
icon: flask-conical
---

Les **tests unitaires** vérifient le comportement de petites unités de code, rapidement et automatiquement. Chaque langage a ses frameworks ; tous produisent des rapports exploitables en intégration continue.

## pytest (Python)

Le standard Python : des **fonctions** `test_*`, l'instruction `assert` native, des **fixtures** pour préparer le contexte, le **paramétrage** et un riche écosystème de greffons.

```bash
python3 -m pip install pytest pytest-cov pytest-xdist
```

```python test_calcul.py
import pytest
from mon_module import diviser

@pytest.fixture
def jeu():
    return [1, 2, 3]

@pytest.mark.parametrize("a,b,attendu", [(6, 2, 3), (9, 3, 3)])
def test_diviser(a, b, attendu):
    assert diviser(a, b) == attendu

def test_division_par_zero():
    with pytest.raises(ZeroDivisionError):
        diviser(1, 0)
```

```bash
pytest -q                               # exécuter
pytest -k "diviser and not zero"        # filtrer par nom
pytest --cov=mon_module --cov-report=term-missing    # couverture
pytest -n auto                          # parallèle (pytest-xdist)
pytest --junitxml=resultats.xml         # rapport pour la CI
```

## JUnit et TestNG (JVM)

**JUnit 5** est le framework de référence en Java : annotations `@Test`, `@BeforeEach`, assertions, tests paramétrés.

```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CalculTest {
  @Test void addition() { assertEquals(4, Calcul.ajouter(2, 2)); }
  @Test void exception() { assertThrows(ArithmeticException.class, () -> Calcul.diviser(1, 0)); }
}
```

```bash
mvn test                                # Maven (surefire : rapports dans target/surefire-reports)
./gradlew test                          # Gradle
```

**TestNG** est une alternative appréciée pour les tests d'intégration : **groupes**, **dépendances** entre tests, *data providers*, exécution parallèle fine.

## NUnit, xUnit.net et MSTest (.NET)

Les trois grands frameworks .NET, tous exécutés par `dotnet test` :

| Framework | Attribut de test | Particularité |
| --- | --- | --- |
| **xUnit.net** | `[Fact]`, `[Theory]` | Moderne, favorisé par la communauté .NET |
| **NUnit** | `[Test]`, `[TestCase]` | Très complet, historique |
| **MSTest** | `[TestMethod]` | Intégré à l'écosystème Microsoft |

```csharp
public class CalculTests {
  [Fact] public void Addition() => Assert.Equal(4, Calcul.Ajouter(2, 2));
  [Theory] [InlineData(6,2,3)] [InlineData(9,3,3)]
  public void Division(int a, int b, int r) => Assert.Equal(r, Calcul.Diviser(a, b));
}
```

```bash
dotnet test                             # découvre et exécute
dotnet test --logger "trx;LogFileName=resultats.trx" --collect:"XPlat Code Coverage"
dotnet test --filter "FullyQualifiedName~Division"
```

## En intégration continue

- Produire un rapport **JUnit XML** (natif en JVM ; `--junitxml` pour pytest ; `trx2junit` ou `--logger junit` pour .NET) : la plupart des plates-formes CI l'affichent.
- Mesurer la **couverture** (pytest-cov, JaCoCo, Coverlet) et fixer un seuil, sans en faire une fin en soi.
- Garder les tests **rapides et isolés** (pas de dépendance réseau ni d'ordre) ; isoler les tests lents (intégration) dans une étape séparée.

## Bonnes pratiques

- Un test = un comportement, nom explicite, arrangement/action/assertion clair.
- **Simuler** les dépendances externes (bases, API) avec des doubles ou les outils de [[06-mock-api/01-prism-wiremock-mockserver|simulation d'API]].
- Tests **déterministes** (pas de dépendance à l'horloge, au hasard non maîtrisé, à l'ordre).

## Choisir

| Langage | Frameworks |
| --- | --- |
| Python | pytest (unittest intégré pour l'existant) |
| Java/Kotlin | JUnit 5 (unitaire), TestNG (intégration) |
| .NET | xUnit.net (neuf), NUnit, MSTest |
| JavaScript/TypeScript | [[11-tests-js/01-vitest-jest-mocha\|Vitest, Jest, Mocha]] |
| Go, Rust, PHP, Ruby | [[12-tests-langages/01-gotest-cargo-phpunit-rspec\|go test, cargo test, PHPUnit, RSpec]] |

Commandes : [[90-aide-memoire|aide-mémoire]].
