---
title: "ngx_http_mp4_module"
description: "Module nginx ngx_http_mp4_module — Le module ngx_http_mp4_module fournit côté serveur la prise en charge de la pseudo-diffusion en continu des fichiers MP4. Ces fichiers ont généralement l'extension .mp4, .m4v ou .m4a."
tags: [nginx, module, ngx_http_mp4_module]
icon: puzzle
---

Le module `ngx_http_mp4_module` fournit côté serveur la prise en charge de la pseudo-diffusion en continu des fichiers MP4. Ces fichiers ont généralement l'extension `.mp4`, `.m4v` ou `.m4a`.

La pseudo-diffusion fonctionne avec un lecteur multimédia compatible. Le lecteur envoie au serveur une requête HTTP indiquant l'heure de départ dans un argument de la chaîne de requête (appelé simplement `start`, en secondes), et le serveur répond avec un flux dont la position de départ correspond à l'heure demandée, par exemple :

```nginx
http://example.com/elephants_dream.mp4?start=238.88
```

Cela permet de se déplacer à tout moment dans la vidéo ou de démarrer la lecture au milieu.

Pour permettre ces déplacements, les formats fondés sur H.264 stockent des métadonnées dans un « atome moov », partie du fichier qui contient l'index de tout le fichier.

Pour démarrer la lecture, le lecteur doit d'abord lire les métadonnées, ce qu'il fait en envoyant une requête spéciale avec l'argument `start=0`. Beaucoup de logiciels d'encodage placent les métadonnées à la fin du fichier, ce qui n'est pas optimal pour la pseudo-diffusion : le lecteur doit télécharger tout le fichier avant de commencer. Si les métadonnées sont au début du fichier, il suffit à nginx d'envoyer le contenu du fichier. Si elles sont à la fin, nginx doit lire tout le fichier et préparer un nouveau flux où les métadonnées précèdent les données multimédias, ce qui coûte du processeur, de la mémoire et des entrées-sorties disque. Il vaut donc mieux [préparer le fichier d'origine pour la pseudo-diffusion](https://github.com/flowplayer/flowplayer/wiki/7.1.1-video-file-correction) à l'avance, plutôt que de laisser nginx le faire à chaque requête.

Le module prend aussi en charge l'argument `end` d'une requête HTTP (1.5.13), qui définit le point de fin de lecture. Il peut être indiqué avec `start` ou seul :

```nginx
http://example.com/elephants_dream.mp4?start=238.88&end=555.55
```

Pour une requête correspondante avec un argument `start` ou `end` non nul, nginx lit les métadonnées du fichier, prépare le flux pour la plage de temps demandée et l'envoie au client, avec le même surcoût que ci-dessus.

Si l'argument `start` désigne une image vidéo qui n'est pas une image clé, le début de la vidéo est altéré. Pour corriger cela, on [[12-directives/mp4-start-key-frame|peut]] faire précéder la vidéo de l'image clé située avant le point `start` et de toutes les images intermédiaires ; ces images sont masquées à la lecture grâce à une liste de montage (*edit list*, 1.21.4).

Si une requête correspondante ne contient pas les arguments `start` et `end`, il n'y a aucun surcoût : le fichier est envoyé comme une simple ressource statique. Certains lecteurs prennent aussi en charge les requêtes de plages d'octets et n'ont donc pas besoin de ce module.

Ce module n'est pas compilé par défaut ; il doit être activé avec le paramètre de configuration `--with-http_mp4_module`.

> [!NOTE]
> Si un module mp4 tiers était utilisé auparavant, il doit être désactivé.

Le module [[11-modules/02-http/ngx_http_flv_module|ngx_http_flv_module]] fournit une prise en charge similaire de la pseudo-diffusion pour les fichiers FLV.

## Exemple de configuration

```nginx
location /video/ {
    mp4;
    mp4_buffer_size       1m;
    mp4_max_buffer_size   5m;
    mp4_limit_rate        on;
    mp4_limit_rate_after  30s;
}
```

## Directives

- [[12-directives/mp4|mp4]]
- [[12-directives/mp4-buffer-size|mp4_buffer_size]]
- [[12-directives/mp4-max-buffer-size|mp4_max_buffer_size]]
- [[12-directives/mp4-limit-rate|mp4_limit_rate]]
- [[12-directives/mp4-limit-rate-after|mp4_limit_rate_after]]
- [[12-directives/mp4-start-key-frame|mp4_start_key_frame]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
