---
title: Postman et Bruno
description: Tester et documenter des API REST — Postman (collections, environnements, variables, authentification OAuth 2.0, scripts de test, Collection Runner, Newman, espaces de travail cloud et précautions sur les secrets) et Bruno (client libre hors ligne, collections en fichiers texte versionnés dans Git, environnements, secrets, CLI), cas d'usage d'administration (API d'équipements réseau, NetBox, pare-feu, outils de supervision).
tags: [postman, bruno, api, rest, tests, collections, newman, git]
icon: send
---

Les infrastructures modernes se pilotent par **API** : contrôleurs Wi-Fi et SD-WAN, pare-feu (FortiOS, PAN-OS), NetBox, Zabbix, Proxmox, vCenter, Microsoft Graph. **Postman** et **Bruno** permettent d'explorer ces API, de construire et rejouer des requêtes, et de les documenter.

## Postman

**Postman** (commercial, offre gratuite) : application de bureau (Windows, macOS, Linux) et web.

| Notion | Usage |
| --- | --- |
| **Collection** | Ensemble organisé de requêtes (une par API ou produit) |
| **Environnement** | Variables par contexte (`{{url}}`, `{{jeton}}`) : laboratoire, préproduction, production |
| Autorisation | Basic, Bearer, clé d'API, **OAuth 2.0** (obtention et rafraîchissement du jeton), AWS signature… |
| Scripts | *Pre-request* et *Tests* en JavaScript (extraire un jeton, vérifier une réponse) |
| Collection Runner / **Newman** | Exécuter une collection (tests d'API, vérifications après un changement) ; Newman en ligne de commande pour la CI |

```javascript Test Postman : vérifier une réponse et mémoriser une valeur
pm.test("Statut 200", () => pm.response.to.have.status(200));
const donnees = pm.response.json();
pm.test("Équipement actif", () => pm.expect(donnees.status.value).to.eql("active"));
pm.environment.set("device_id", donnees.id);
```

```bash
npm install -g newman
newman run collection-netbox.json -e environnement-preprod.json --reporters cli,junit
```

> [!WARNING]
> Par défaut, Postman **synchronise** collections, environnements et historique dans le cloud de l'éditeur, et des espaces de travail **publics** ont déjà exposé des milliers de jetons d'API. Utilisez des variables de type *secret* et le **coffre local** (*Postman Vault*) pour les jetons, ne mettez jamais de secrets dans les valeurs partagées, vérifiez la visibilité des espaces de travail, et appliquez la politique de l'entreprise (comptes d'entreprise, SSO).

## Bruno

**Bruno** (MIT, avec une édition payante) est un client d'API **hors ligne** : les collections sont des **fichiers texte** (`.bru`) dans un dossier, donc **versionnables dans Git** avec le code ou la documentation, sans compte ni cloud.

```text netbox/Equipements/Lister les équipements actifs.bru
meta {
  name: Lister les équipements actifs
  type: http
  seq: 1
}

get {
  url: {{url}}/api/dcim/devices/?status=active&limit=50
  body: none
  auth: none
}

headers {
  Authorization: Token {{jeton}}
  Accept: application/json
}

tests {
  test("statut 200", function () { expect(res.getStatus()).to.equal(200); });
}
```

```text netbox/environments/preprod.bru
vars {
  url: https://netbox-preprod.corp.exemple.fr
}
vars:secret [
  jeton
]
```

Les variables **secrètes** sont stockées localement (chiffrées), hors des fichiers versionnés. CLI pour la CI :

```bash
npm install -g @usebruno/cli
bru run --env preprod netbox/
```

Installation : `winget install Bruno.Bruno`, `brew install bruno`, paquets Linux (Snap, `.deb`, AppImage).

## Choisir

| Critère | Postman | Bruno |
| --- | --- | --- |
| Stockage | Cloud de l'éditeur (synchronisation) | Fichiers locaux, Git |
| Collaboration | Espaces de travail partagés | Dépôt Git, demandes de fusion |
| Fonctions avancées | Très riches (mocks, moniteurs, documentation publiée, flux) | Essentiel + scripts, tests, CLI |
| Hors ligne / sans compte | Limité | Oui |

Alternatives : **Insomnia**, **Hoppscotch** (auto-hébergeable), extension **REST Client** de VS Code (requêtes dans des fichiers `.http`), et bien sûr `curl` ([[06-dig-mtr-curl|curl]]).
