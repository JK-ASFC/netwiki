---
title: Tests unitaires (Python, JVM, .NET) — aide-mémoire
description: Commandes pytest (filtres, couverture, parallèle, JUnit XML), Maven/Gradle test (JUnit, TestNG) et dotnet test (NUnit, xUnit, MSTest) avec rapports et couverture.
tags: [aide-mémoire, pytest, junit, testng, nunit, xunit, mstest, dotnet]
icon: terminal
---

Explications : [[01-pytest-junit-nunit|pytest, JUnit, TestNG, NUnit, xUnit.net et MSTest]].

```bash
# pytest (Python)
python3 -m pip install pytest pytest-cov pytest-xdist
pytest -q
pytest -k "nom and not lent"
pytest --cov=paquet --cov-report=term-missing
pytest -n auto
pytest --junitxml=resultats.xml

# JVM
mvn test                      # rapports : target/surefire-reports/*.xml
./gradlew test                # rapports : build/test-results/test/*.xml

# .NET
dotnet test
dotnet test --filter "FullyQualifiedName~Division"
dotnet test --logger "trx;LogFileName=r.trx" --collect:"XPlat Code Coverage"
```

| Rapport CI | Source |
| --- | --- |
| JUnit XML | natif JVM ; `--junitxml` pytest |
| TRX / JUnit | .NET (`--logger`, trx2junit) |
| Couverture | pytest-cov, JaCoCo (JVM), Coverlet (.NET) |
