---
title: "Optimiser FreeBSD pour une forte charge"
description: "Nginx — Optimiser FreeBSD pour une forte charge. Une fois établie, une connexion est placée dans la file d'écoute du socket d'écoute. Pour voir l'état actuel des files d'écoute, exécutez la commande « netstat -Lan » :"
tags: [nginx, guide]
icon: book-open
---

## Files d'écoute

Une fois établie, une connexion est placée dans la file d'écoute du socket d'écoute. Pour voir l'état actuel des files d'écoute, exécutez la commande « `netstat -Lan` » :

```
Current listen queue sizes (qlen/incqlen/maxqlen)
Proto Listen         Local Address
tcp4  10/0/128       *.80
tcp4  0/0/128        *.22
```

C'est un cas normal : la file d'écoute du port \*:80 ne contient que 10 connexions non acceptées. Si le serveur web ne tient pas la charge, on peut voir quelque chose comme :

```
Current listen queue sizes (qlen/incqlen/maxqlen)
Proto Listen         Local Address
tcp4  192/0/128      *.80
tcp4  0/0/128        *.22
```

Il y a ici 192 connexions non acceptées, et les nouvelles connexions sont très probablement rejetées. Bien que la limite soit de 128 connexions, FreeBSD accepte 1,5 fois la limite avant de commencer à rejeter les nouvelles connexions. On peut augmenter la limite avec

```
sysctl kern.ipc.soacceptqueue=4096
```

La file n'est toutefois qu'un amortisseur pour absorber les pics. Si elle déborde en permanence, il faut améliorer le serveur web plutôt que continuer à augmenter la limite. On peut aussi modifier la taille maximale de la file d'écoute dans la configuration de nginx :

```c
listen  80  backlog=1024;
```

On ne peut cependant pas la régler au-delà de la valeur actuelle de `kern.ipc.soacceptqueue`. Par défaut, nginx utilise la valeur maximale du noyau FreeBSD.

## Tampons des sockets

Lorsqu'un client envoie des données, elles sont d'abord reçues par le noyau, qui les place dans le tampon de réception du socket. Une application comme le serveur web peut ensuite appeler `recv` ou `read` pour les récupérer. Pour envoyer des données, l'application appelle `send` ou `write`, qui les placent dans le tampon d'envoi du socket ; le noyau se charge ensuite de les envoyer au client. Dans les versions récentes de FreeBSD, les tampons de réception et d'envoi font par défaut respectivement 64K et 32K. On peut les modifier à chaud avec les sysctls `net.inet.tcp.recvspace` et `net.inet.tcp.sendspace`. Des tampons plus grands peuvent bien sûr augmenter le débit, car les connexions peuvent utiliser de plus grandes fenêtres glissantes TCP. On trouve sur Internet des conseils pour porter les tampons à un, voire plusieurs mégaoctets. Mais de telles tailles conviennent aux réseaux locaux ou aux réseaux que l'on maîtrise : sur Internet, un client lent peut demander un gros fichier et le télécharger pendant plusieurs minutes, voire des heures, et pendant tout ce temps le tampon d'un mégaoctet reste attaché à ce client lent, alors que quelques kilooctets suffiraient.

Les grands tampons d'envoi ont un autre avantage pour les serveurs web comme Apache, qui utilisent des appels système d'entrée-sortie bloquants : le serveur peut placer toute une réponse volumineuse dans le tampon d'envoi, fermer la connexion et laisser le noyau envoyer la réponse au client lent, tout en étant prêt à servir d'autres requêtes. Il faut décider ce qu'il vaut mieux attacher à un client dans votre cas : un processus Apache/mod\_perl de plusieurs dizaines de mégaoctets ou un tampon d'envoi de quelques centaines de kilooctets. nginx utilise des appels système non bloquants et ne consacre que quelques dizaines de kilooctets aux connexions : il n'a donc pas besoin de grands tampons.

## mbufs, mbuf clusters, etc.

Dans le noyau, les tampons sont stockés sous forme de chaînes de blocs mémoire reliés par des structures *mbuf*. Un mbuf fait 256 octets et peut contenir une petite quantité de données, par exemple un en-tête TCP/IP. Mais les mbufs pointent surtout vers d'autres données stockées dans des *mbuf clusters* ou des *jumbo clusters* : ils ne servent alors que de maillons de chaîne. Un mbuf cluster fait 2K. Un jumbo cluster peut faire la taille d'une page du processeur (4K sur amd64), 9K ou 16K. Les jumbo clusters de 9K et 16K servent surtout dans les réseaux locaux avec des trames Ethernet plus grandes que les 1500 octets habituels ; ils sortent du cadre de cet article. Les jumbo clusters de la taille d'une page servent généralement uniquement à l'envoi, tandis que les mbuf clusters servent à l'envoi et à la réception. Pour voir l'utilisation actuelle des mbufs et clusters et leurs limites, exécutez la commande « `netstat -m` ». Voici un exemple sous FreeBSD 7.2/amd64 avec les réglages par défaut :

```
1477/3773/5250 mbufs in use (current/cache/total)
771/2203/2974/25600 mbuf clusters in use (current/cache/total/max)
771/1969 mbuf+clusters out of packet secondary zone in use
   (current/cache)
296/863/1159/12800 4k (page size) jumbo clusters in use
   (current/cache/total/max)
0/0/0/6400 9k jumbo clusters in use (current/cache/total/max)
0/0/0/3200 16k jumbo clusters in use (current/cache/total/max)
3095K/8801K/11896K bytes allocated to network(current/cache/total)
0/0/0 requests for mbufs denied (mbufs/clusters/mbuf+clusters)
0/0/0 requests for jumbo clusters denied (4k/9k/16k)
0/0/0 sfbufs in use (current/peak/max)
0 requests for sfbufs denied
0 requests for sfbufs delayed
523590 requests for I/O initiated by sendfile
0 calls to protocol drain routines
```

Il y a 12800 jumbo clusters de la taille d'une page : ils ne peuvent donc contenir que 50M de données. Si vous réglez `net.inet.tcp.sendspace` à 1M, seulement 50 clients lents demandant de gros fichiers occuperont tous les jumbo clusters.

On peut augmenter à chaud les limites des clusters avec :

```
sysctl kern.ipc.nmbclusters=200000
sysctl kern.ipc.nmbjumbop=100000
```

La première commande augmente la limite des mbuf clusters, la seconde celle des jumbo clusters de la taille d'une page. Tous les mbuf clusters alloués occupent environ 440M de mémoire physique : (200000 × (2048 + 256)), car chaque mbuf cluster nécessite aussi un mbuf. Tous les jumbo clusters de la taille d'une page alloués occupent encore environ 415M : (100000 × (4096 + 256)). Au total, cela peut atteindre 845M.

Il existe un moyen de ne pas utiliser les jumbo clusters pour servir des fichiers statiques : l'appel système *sendfile()*. Il permet d'envoyer un fichier, ou une partie, directement vers un socket sans le lire dans un tampon de l'application. Il crée une chaîne de mbufs pointant vers les pages du fichier déjà présentes dans le cache mémoire de FreeBSD et transmet cette chaîne à la pile TCP/IP. sendfile réduit ainsi à la fois l'utilisation du processeur, en évitant deux copies en mémoire, et celle de la mémoire, en utilisant les pages de fichier en cache.

## Connexions sortantes

```
net.inet.ip.portrange.randomized=0
net.inet.ip.portrange.first=1024
net.inet.ip.portrange.last=65535
```

## Fermeture des connexions

```
net.inet.tcp.fast_finwait2_recycle=1
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
