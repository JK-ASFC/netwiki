---
title: Documentation d'API — aide-mémoire
description: Déploiement de Swagger UI et Swagger Editor, génération Redoc avec Redocly CLI (build-docs, lint), intégration Scalar et Stoplight Elements.
tags: [aide-mémoire, swagger ui, redoc, scalar, stoplight, openapi]
icon: terminal
---

Explications : [[01-swagger-redoc-scalar|Swagger UI, Redoc, Scalar et Stoplight Elements]].

```bash
# Swagger UI
docker run -d -p 8080:8080 -e SWAGGER_JSON=/spec/openapi.yaml \
  -v /srv/api/openapi.yaml:/spec/openapi.yaml swaggerapi/swagger-ui

# Swagger Editor
docker run -d -p 8081:8080 swaggerapi/swagger-editor

# Redoc (Redocly CLI)
npx @redocly/cli lint openapi.yaml
npx @redocly/cli build-docs openapi.yaml -o docs/api.html

# Validation / aperçu rapides
npx @redocly/cli preview-docs openapi.yaml
```

```html
<!-- Scalar -->
<script id="api-reference" data-url="/openapi.yaml"></script>
<script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>

<!-- Stoplight Elements -->
<elements-api apiDescriptionUrl="/openapi.yaml" router="hash" layout="sidebar"></elements-api>
```
