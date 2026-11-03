---
title: "mod_slotmem_shm"
description: "Module Apache mod_slotmem_shm — Fournisseur de mémoire partagée basée sur les slots. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_slotmem_shm]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fournisseur de mémoire partagée basée sur les slots. |
| **Statut** | Extension |
| **Identificateur** | `slotmem_shm_module` |
| **Fichier source** | `mod_slotmem_shm.c` |

## Sommaire

[[12-modules/mod_slotmem_shm|mod_slotmem_shm]] est un fournisseur de mémoire qui permet la création et l'accès à un segment de mémoire partagée dans lequel les ensembles de données sont organisés en "slots".

L'ensemble de la mémoire partagée est effacé à chaque redémarrage, que ce dernier soit graceful ou non. Les données sont stockées et restituées dans/à partir d'un fichier défini par le paramètre `name` des appels `create` et `attach`. Si son chemin absolu n'est pas spécifié, le chemin du fichier sera relatif au chemin défini par la directive [[13-directives/defaultruntimedir|DefaultRuntimeDir]].

[[12-modules/mod_slotmem_shm|mod_slotmem_shm]] fournit les fonctions d'API suivantes :

```c
/* appelle le callback pour tous les slots actifs */
apr_status_t doall(ap_slotmem_instance_t *s, ap_slotmem_callback_fn_t *func, void *data, apr_pool_t *pool)

/* crée un nouveau slot de mémoire dont chaque taille d'item est
      item_size. 'name' est utilisé pour générer le nom du fichier
      permettant de stocker/restaurer le contenu de la mémoire partagée,
      si elle est configurée. Les valeurs possibles sont :
      "none"                - Mémoire partagée anonyme et pas de stockage permanent
      "file-name"           - [DefaultRuntimeDir]/file-name
      "/absolute-file-name" - Chemin absolu du fichier */
apr_status_t create(ap_slotmem_instance_t **new, const char *name, apr_size_t item_size, unsigned int item_num, ap_slotmem_type_t type, apr_pool_t *pool)

/* attache à un slot de mémoire existant. Voir
      'create' pour la description du paramètre
      'name'. */
apr_status_t attach(ap_slotmem_instance_t **new, const char *name, apr_size_t *item_size, unsigned int *item_num, apr_pool_t *pool)

/* obtient la mémoire associée à ce slot actif. */
apr_status_t dptr(ap_slotmem_instance_t *s, unsigned int item_id, void **mem)

/* lit la mémoire depuis ce slot et la transfert vers dest */
apr_status_t get(ap_slotmem_instance_t *s, unsigned int item_id, unsigned char *dest, apr_size_t dest_len)

/* écrit dans ce slot la mémoire en provenance de src */
apr_status_t put(ap_slotmem_instance_t *slot, unsigned int item_id, unsigned char *src, apr_size_t src_len)

/* renvoie le nombre total de slots contenus dans ce segment */
unsigned int num_slots(ap_slotmem_instance_t *s)

/* renvoie la taille totale des données, en octets, contenues
      dans un slot de ce segment */
apr_size_t slot_size(ap_slotmem_instance_t *s)

/* alloue le premier slot libre et le marque comme utilisé (n'effectue aucune
      copie de données) */
apr_status_t grab(ap_slotmem_instance_t *s, unsigned int *item_id)

/* appropriation ou allocation forcée du slot spécifié et marquage comme
      utilisé (n'effectue aucune copie de données) */
apr_status_t fgrab(ap_slotmem_instance_t *s, unsigned int item_id)

/* libère un slot et le marque comme non utilisé (n'effectue aucune
      copie de données) */
apr_status_t release(ap_slotmem_instance_t *s, unsigned int item_id)
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
