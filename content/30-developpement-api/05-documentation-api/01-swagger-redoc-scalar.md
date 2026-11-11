---
title: Swagger UI, Swagger Editor, Redoc, Scalar et Stoplight Elements
description: Rendre une spécification OpenAPI en documentation interactive — OpenAPI en bref, Swagger UI (exploration et essais « Try it out », Docker, intégration), Swagger Editor (édition avec validation en direct), Redoc (documentation statique élégante sur trois colonnes, redoc-cli/redocly build-docs), Scalar (référence moderne avec client d'essai intégré) et Stoplight Elements (composant web intégrable) ; héberger sa doc d'API en interne et sécurité.
tags: [openapi, swagger ui, swagger editor, redoc, scalar, stoplight, documentation api]
icon: file-json
---

Une **spécification OpenAPI** (anciennement Swagger) décrit une API REST dans un fichier **YAML ou JSON** : chemins, paramètres, schémas, réponses, sécurité. Ces outils transforment cette spécification en **documentation interactive** consultable dans le navigateur.

## OpenAPI en bref

```yaml openapi.yaml (extrait)
openapi: 3.1.0
info: { title: API Parc, version: "1.0" }
servers: [ { url: https://api.exemple.fr/v1 } ]
paths:
  /equipements:
    get:
      summary: Lister les équipements
      parameters:
        - { name: site, in: query, schema: { type: string } }
      responses:
        "200":
          description: Liste
          content: { application/json: { schema: { $ref: "#/components/schemas/Equipement" } } }
components:
  schemas:
    Equipement: { type: object, properties: { id: { type: integer }, nom: { type: string } } }
  securitySchemes:
    apiKey: { type: apiKey, in: header, name: X-Api-Key }
```

## Swagger UI

L'outil le plus connu : il affiche les points d'accès et permet de les **essayer** (« Try it out ») directement.

```bash
docker run -d --name swagger-ui -p 127.0.0.1:8080:8080 \
  -e SWAGGER_JSON=/spec/openapi.yaml -v /srv/api/openapi.yaml:/spec/openapi.yaml \
  swaggerapi/swagger-ui
```

On peut aussi inclure Swagger UI dans une page web, ou le servir depuis le cadre applicatif (FastAPI, Springdoc… l'exposent automatiquement sur `/docs` ou `/swagger-ui`).

## Swagger Editor

Éditeur en deux volets (source à gauche, aperçu et **validation en direct** à droite), utile pour rédiger ou corriger une spécification.

```bash
docker run -d --name swagger-editor -p 127.0.0.1:8081:8080 swaggerapi/swagger-editor
```

## Redoc

**Redoc** produit une documentation **statique** élégante sur trois colonnes (navigation, description, exemples), idéale à publier. Pas d'essai interactif par défaut (léger, rapide).

```bash
npx @redocly/cli build-docs openapi.yaml -o docs/api.html     # un seul fichier HTML autonome
npx @redocly/cli lint openapi.yaml                            # vérifier la spécification
# ou le conteneur « redocly/redoc » pour servir dynamiquement
```

## Scalar

**Scalar** est une alternative moderne : documentation soignée **avec un client d'essai intégré** (comme Swagger UI mais plus agréable), thèmes, recherche. Intégrable via un composant web ou servi depuis de nombreux frameworks.

```html
<!doctype html><html><body>
  <script id="api-reference" data-url="/openapi.yaml"></script>
  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body></html>
```

## Stoplight Elements

**Stoplight Elements** est un **composant web** (`<elements-api>`) qui affiche une doc interactive à partir d'une spécification, à insérer dans n'importe quelle page ou documentation.

```html
<elements-api apiDescriptionUrl="/openapi.yaml" router="hash" layout="sidebar"></elements-api>
```

## Héberger sa doc d'API

- Générer la doc en **CI** à partir de la spécification versionnée (Redocly lint + build), publier le HTML sur un serveur web interne.
- Garder **une seule source de vérité** : la spécification OpenAPI, idéalement produite par le code (annotations) pour éviter la dérive.
- **Ne pas exposer** une doc avec « Try it out » pointant vers la production sans authentification : l'essai exécute de vraies requêtes. Limiter à un environnement de test, ou protéger l'accès.

## Choisir

| Besoin | Outil |
| --- | --- |
| Explorer et tester une API | Swagger UI, Scalar |
| Rédiger/valider une spécification | Swagger Editor, Redocly lint |
| Documentation statique à publier | Redoc |
| Intégrer la doc dans une page existante | Stoplight Elements, Scalar, Redoc |

Pour servir des réponses simulées à partir de la spécification, voir [[06-mock-api/01-prism-wiremock-mockserver|Prism et les serveurs de simulation]].

Commandes : [[90-aide-memoire|aide-mémoire]].
