---
title: PHPUnit, Pest, RSpec et Minitest
description: Tests PHP et Ruby — PHPUnit (standard PHP : classes de test, assertions, data providers, doublures, couverture, phpunit.xml), Pest (surcouche expressive de PHPUnit, style fonctionnel, populaire avec Laravel), RSpec (BDD Ruby : describe/it/expect, matchers, doublures, Rails) et Minitest (léger, intégré à Ruby et Rails) ; exécution, couverture et rapports CI.
tags: [phpunit, pest, rspec, minitest, tests, php, ruby, laravel, rails]
icon: flask-conical
---

## PHPUnit

Le **standard** des tests en PHP : classes étendant `TestCase`, méthodes `test*`, assertions, *data providers*, doublures (mocks), couverture (avec Xdebug ou PCOV).

```bash
composer require --dev phpunit/phpunit
```

```php tests/CalculTest.php
use PHPUnit\Framework\TestCase;

final class CalculTest extends TestCase {
    public function testDivision(): void {
        $this->assertSame(3, Calcul::diviser(6, 2));
    }
    public function testDivisionParZero(): void {
        $this->expectException(DivisionByZeroError::class);
        Calcul::diviser(1, 0);
    }
}
```

```bash
vendor/bin/phpunit
vendor/bin/phpunit --filter testDivision
vendor/bin/phpunit --coverage-text --coverage-clover coverage.xml
vendor/bin/phpunit --log-junit resultats.xml
```

La configuration (`phpunit.xml`) décrit les suites, le *bootstrap* et la couverture.

## Pest

**Pest** est une surcouche de PHPUnit au style **expressif et fonctionnel**, très appréciée dans l'écosystème **Laravel**. Compatible avec les tests PHPUnit existants.

```bash
composer require --dev pestphp/pest
```

```php tests/Calcul.php
it('divise', fn () => expect(Calcul::diviser(6, 2))->toBe(3));
it('rejette zéro', fn () => Calcul::diviser(1, 0))->throws(DivisionByZeroError::class);
```

```bash
vendor/bin/pest
vendor/bin/pest --coverage --min=80
vendor/bin/pest --parallel
```

## RSpec

**RSpec** est le framework **BDD** de référence en Ruby (très lié à Rails) : `describe`/`context`/`it`, *matchers* lisibles (`expect(...).to eq(...)`), doublures.

```bash
gem install rspec        # ou dans le Gemfile ; rspec --init
```

```ruby spec/calcul_spec.rb
RSpec.describe Calcul do
  it "divise" do
    expect(Calcul.diviser(6, 2)).to eq(3)
  end
  it "rejette zéro" do
    expect { Calcul.diviser(1, 0) }.to raise_error(ZeroDivisionError)
  end
end
```

```bash
rspec
rspec spec/calcul_spec.rb:10
rspec --format documentation
rspec --format RspecJunitFormatter --out resultats.xml     # gem rspec_junit_formatter
```

## Minitest

**Minitest** est **léger** et **intégré** à Ruby (et à Rails par défaut) : rapide, deux styles (assertions classiques ou *spec* façon RSpec).

```ruby test/calcul_test.rb
require "minitest/autorun"
class CalculTest < Minitest::Test
  def test_division
    assert_equal 3, Calcul.diviser(6, 2)
  end
end
```

```bash
ruby -Itest test/calcul_test.rb
rake test                 # dans un projet Rails
```

## Couverture et CI

- **Couverture** : SimpleCov (Ruby), `--coverage` (Pest) ou PHPUnit + PCOV/Xdebug (PHP).
- **Rapports JUnit** : `--log-junit` (PHPUnit), `rspec_junit_formatter` (RSpec), reporters Minitest, pour l'affichage dans la CI.
- Lancer PHP et Ruby via leurs conteneurs officiels en CI ; isoler les tests qui touchent une base dans une étape dédiée (avec un service de base de données).

## Choisir

| Langage | Frameworks |
| --- | --- |
| PHP | PHPUnit (standard), Pest (expressif, Laravel) |
| Ruby | RSpec (BDD, Rails), Minitest (léger, intégré) |
| Python / JVM / .NET | [[10-tests-unitaires/01-pytest-junit-nunit\|pytest, JUnit, xUnit…]] |
| Go / Rust | [[01-bdd-gotest-cargo\|go test, cargo test]] |

Commandes : [[90-aide-memoire|aide-mémoire]].
