---
title: "Comprendre les objets préchargés"
description: "Nginx — Comprendre les objets préchargés. Pour chaque requête entrante, njs crée une machine virtuelle distincte, ce qui présente de nombreux avantages, comme une consommation de mémoire prévisible ou l'isolement des requêtes. Mais comme toutes les requêtes…"
tags: [nginx, guide]
icon: book-open
---

> [!NOTE]
> Les objets préchargés ne sont pris en charge qu'avec le moteur JavaScript [[10-guides/04-njs/engine|njs]] ; ils ne sont pas disponibles avec le moteur [[10-guides/04-njs/engine|QuickJS]].

Pour chaque requête entrante, njs crée une machine virtuelle distincte, ce qui présente de nombreux avantages, comme une consommation de mémoire prévisible ou l'isolement des requêtes. Mais comme toutes les requêtes sont isolées, un gestionnaire qui a besoin de certaines données doit les lire lui-même, ce qui est inefficace, surtout pour de gros volumes de données.

Pour pallier cette limite, des objets partagés préchargés ont été introduits. Ils sont créés immuables et n'ont pas de chaîne de prototypes : leurs valeurs ne peuvent pas être modifiées, et on ne peut ni ajouter ni supprimer de propriétés.

## Travailler avec les objets préchargés

Voici quelques exemples d'utilisation d'un objet préchargé dans njs :

- accéder aux propriétés par leur nom :

  ```
  preloaded_object.prop_name
  preloaded_object[prop_name]
  ```
- énumérer les propriétés :

  ```c
  for (i in preloaded_object_name) {
      ...
  }
  ```
- appliquer des méthodes intégrées non modifiantes avec `call()` :

  ```
  Array.prototype.filter.call(preloaded_object_name, ...)
  ```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
