---
title: TYPO3 et Contao — aide-mémoire des commandes
description: Commandes TYPO3 (composer create-project, typo3 setup, cache:flush, extension:setup, upgrade:run, language:update, scheduler:run) et Contao (managed-edition, contao:migrate, contao:user:create, cache:clear, contao:backup:create) avec exemples.
tags: [aide-mémoire, typo3, contao, composer]
icon: terminal
---

Explications : [[01-typo3|TYPO3]] · [[02-contao|Contao]].

```bash
composer create-project "typo3/cms-base-distribution:^14" portail && cd portail && vendor/bin/typo3 setup
vendor/bin/typo3 cache:flush ; vendor/bin/typo3 extension:setup ; vendor/bin/typo3 language:update
composer require georgringer/news && vendor/bin/typo3 extension:setup
composer update "typo3/*" --with-all-dependencies && vendor/bin/typo3 upgrade:run
vendor/bin/typo3 scheduler:run
composer create-project contao/managed-edition site 5.3 && cd site
vendor/bin/contao-console contao:migrate --no-interaction
vendor/bin/contao-console contao:user:create --username=jk-admin --name="JK" --email=webmaster@corp.exemple.fr --language=fr --admin
vendor/bin/contao-console cache:clear --env=prod ; vendor/bin/contao-console contao:backup:create
```
