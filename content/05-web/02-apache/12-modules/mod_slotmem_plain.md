---
title: "mod_slotmem_plain"
description: "Module Apache mod_slotmem_plain — Fournisseur de mémoire partagée à base de slots. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_slotmem_plain]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fournisseur de mémoire partagée à base de slots. |
| **Statut** | Extension |
| **Identificateur** | `slotmem_plain_module` |
| **Fichier source** | `mod_slotmem_plain.c` |

## Sommaire

[[12-modules/mod_slotmem_plain|mod_slotmem_plain]] est un fournisseur de mémoire qui permet la création et l'utilisation d'un segment de mémoire contigu dans lequel les ensembles de données sont organisés en "slots".

Si la mémoire doit être partagée entre des threads et des processus, il est préférable d'utiliser le fournisseur [[12-modules/mod_slotmem_shm|mod_slotmem_shm]].

[[12-modules/mod_slotmem_plain|mod_slotmem_plain]] fournit une API comprenant les fonctions suivantes :

```c
/* appelle le callback sur tous les slots actifs */
apr_status_t doall(ap_slotmem_instance_t *s, ap_slotmem_callback_fn_t *func, void *data, apr_pool_t *pool)

/* crée un nouveau slot de mémoire dont chaque item aura une taille de item_size. */
apr_status_t create(ap_slotmem_instance_t **new, const char *name, apr_size_t item_size, unsigned int item_num, ap_slotmem_type_t type, apr_pool_t *pool)

/* rattache à un slot de mémoire existant. */
apr_status_t attach(ap_slotmem_instance_t **new, const char *name, apr_size_t *item_size, unsigned int *item_num, apr_pool_t *pool)

/* indique la mémoire associée à ce slot actif. */
apr_status_t dptr(ap_slotmem_instance_t *s, unsigned int item_id, void **mem)

/* lit la mémoire depuis ce slot et la transfert vers dest */
apr_status_t get(ap_slotmem_instance_t *s, unsigned int item_id, unsigned char *dest, apr_size_t dest_len)

/* écrit dans ce slot la mémoire en provenance de src */
apr_status_t put(ap_slotmem_instance_t *slot, unsigned int item_id, unsigned char *src, apr_size_t src_len)

/* renvoie le nombre total de slots contenus dans ce segment */
unsigned int num_slots(ap_slotmem_instance_t *s)

/* renvoie la taille totale des données, en octets, contenues dans un slot de ce segment */
apr_size_t slot_size(ap_slotmem_instance_t *s)

/* alloue le premier slot libre et le marque comme utilisé (n'effectue aucune copie de données) */
apr_status_t grab(ap_slotmem_instance_t *s, unsigned int *item_id)

/* appropriation ou allocation forcée du slot spécifié et marquage comme utilisé (n'effectue aucune copie de données) */
apr_status_t fgrab(ap_slotmem_instance_t *s, unsigned int item_id)

/* libère un slot et le marque comme non utilisé (n'effectue aucune copie de données) */
apr_status_t release(ap_slotmem_instance_t *s, unsigned int item_id)
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
