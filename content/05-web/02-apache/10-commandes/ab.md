---
title: "ab"
description: "Commande ab d’Apache HTTP Server — ab - L'outil de test des performances du serveur HTTP Apache : syntaxe, options et exemples."
tags: [apache, commande, ab]
icon: terminal
---

*ab - L'outil de test des performances du serveur HTTP Apache*

[[10-commandes/ab|ab]] est un utilitaire qui vous permet de tester les performances de votre serveur HTTP Apache. Il a été conçu pour vous donner une idée du degré de performances de votre installation d'Apache. Il vous permet en particulier de déterminer le nombre de réquêtes que votre installation d'Apache est capable de servir par seconde.

## Syntaxe

`ab [ -A nom-utilisateur:mot-de-passe ] [ -b taille-tampon ] [ -B adresse-locale ] [ -c simultanéité ] [ -C nom-cookie=valeur ] [ -d ] [ -e fichier-csv ] [ -E fichier du certificat client ] [ -f protocole ] [ -g fichier-gnuplot ] [ -h ] [ -H en-tête-personnalisé ] [ -i ] [ -k ] [ -l ] [ -m HTTP-method ] [ -n requêtes ] [ -p fichier-POST ] [ -P nom-utilisateur-mandataire:mot-de-passe ] [ -q ] [ -r ] [ -s timeout ] [ -S ] [ -t limite-de-durée ] [ -T type-de-contenu ] [ -u fichier PUT ] [ -v verbosité] [ -V ] [ -w ] [ -x <table>-attributs ] [ -X mandataire[:port] ] [ -y <tr>-attributs ] [ -z <td>-attributs ] [ -Z algorithme-chiffrement ] [http[s]://]nom-serveur[:port]/chemin`

## Options

**`-A nom-utilisateur:mot-de-passe`**

Fournit le support d'une authentification de base vers le serveur. Les nom-utilisateur et mot-de-passe sont séparés par un seul caractère `:` et transmis sous forme codée base64. La chaîne est envoyée que le serveur en ait besoin ou non (qu'il ait renvoyé un code "401 authentication needed" ou non).

**`-b taille-tampon`**

Taille du tampon d'émission/réception TCP, en octets.

**`-B adresse-locale`**

Adresse à laquelle se rattacher lors des connexions sortantes.

**`-c simultanéité`**

Nombre de requêtes à effectuer simultanément. Par défaut, une seule requête est effectuée à la fois.

**`-C nom-cookie=valeur`**

Ajoute une ligne `Cookie:` à la requête. L'argument se présente en général sous la forme d'une paire `nom=valeur`. Ce champ peut être répété.

**`-d`**

N'affiche pas le "pourcentage servi dans la table XX \[ms\]". (support de l'héritage).

**`-e fichier-csv`**

Enregistre des valeurs séparées par des virgules (CSV) dans un fichier, indiquant pour chaque pourcentage (de 1% à 100 %), le temps (en millisecondes) mis pour servir ce pourcentage de requêtes. Ce fichier est en général plus utile qu'un fichier 'gnuplot', car les résultats sont déjà sous forme binaire.

**`-E fichier du certificat client`**

Utilise le certificat client au format PEM qu'il contient pour s'authentifier auprès du serveur lors d'une connexion à un site web sous SSL. Ce fichier doit contenir le certificat client suivi des certificats intermédiaires et de la clé privé. Disponible à partir de la version 2.4.36 du serveur HTTP Apache.

**`-f protocole`**

Spécifie le protocole SSL/TLS (SSL2, SSL3, TLS1, TLS1.1, TLS1.2, or ALL). TLS1.1 et TLS1.2 sont supportés à partir de la version 2.4.4 du serveur HTTP Apache.

**`-g fichier-gnuplot`**

Enregistre toutes les valeurs mesurées dans un fichier 'gnuplot' ou TSV (valeurs séparées par des tabulations). Ce fichier peut être facilement importé dans des programmes comme Gnuplot, IDL, Mathematica, Igor ou même Excel. La première ligne du fichier contient les noms des valeurs.

**`-h`**

Affiche une aide à propos de l'utilisation du programme.

**`-H en-tête-personnalisé`**

Ajoute des en-têtes supplémentaires à la requête. L'argument se présente sous la forme d'une ligne d'en-tête valide, autrement dit une paire champ/valeur séparés par un caractère ':' (par exemple `"Accept-Encoding: zip/zop;8bit"`).

**`-i`**

Effectue des requêtes `HEAD` plutôt que `GET`.

**`-k`**

Active la fonctionnalité des connexions HTTP persistantes (KeepAlive), c'est à dire effectue plusieurs requêtes au cours d'une seule session HTTP. Cette fonctionnalité est désactivée par défaut.

**`-l`**

Ne signale pas les erreurs si la taille de la réponse n'est pas constante. Cette option peut s'avérer utile pour les pages dynamiques. Disponible à partir de la version 2.4.7 du serveur HTTP Apache.

**`-m HTTP-method`**

Méthode HTTP personnalisée à utiliser pour les requêtes. Disponible à partir de la version 2.4.10 du serveur HTTP Apache.

**`-n requêtes`**

Nombre de requêtes à effectuer au cours du test de performances. Par défaut, une seule requête est effectuée, ce qui ne permet pas d'obtenir des résultats représentatifs.

**`-p fichier-POST`**

Fichier contenant les données pour les requêtes POST. Assurez-vous de spécifier aussi le paramètre `-T`.

**`-P nom-utilisateur-mandataire:mot-de-passe`**

Fournit les informations d'authentification basique pour un mandataire en-route. Les nom d'utilisateur et mot de passe sont séparés par un simple caractère `:` et envoyés sur le réseau codés en base64. La chaîne est envoyée, que le mandataire en ait besoin ou non (qu'il ait renvoyé un code "407 proxy authentication needed" ou non).

**`-q`**

Lorsque plus de 150 requêtes sont traitées, [[10-commandes/ab|ab]] affiche la progression du traitement sur `stderr` tous les 10% du nombre total ou toutes les 100 requêtes. Le drapeau `-q` permet de supprimer ces messages.

**`-r`**

Ne s'arrête pas en cas d'erreur de réception du socket.

**`-s timeout`**

Temps maximum d'attente en secondes du socket avant de considérer le délai comme dépassé. La valeur par défaut est de 30 secondes. Disponible à partir de la version 2.4.4 du serveur HTTP Apache.

**`-S`**

N'affiche ni les valeurs de déviation standards et médianes, ni les messages d'erreur et d'avertissement lorsque les valeurs médianes et moyennes sont égales à une ou deux fois la valeur de déviation standard. Par défaut les valeurs mini/moyenne/maxi sont affichées (support de l'héritage).

**`-t limite-durée`**

Durée maximale en secondes du test de performances. Ceci implique un `-n 50000` en interne. Utilisez cette option si vous souhaitez tester les performances du serveur pendant une durée fixée à l'avance. Par défaut, il n'y a pas de limite de durée.

**`-T type-contenu`**

Valeur de l'en-tête Content-type à utiliser pour les données POST/PUT, par exemple `application/x-www-form-urlencoded`. La valeur par défaut est `text/plain`.

**`-u fichier PUT`**

Fichier contenant des données PUT. Ne pas oublier de spécifier aussi `-T`.

**`-v verbosité`**

Définit le niveau de verbosité - les niveaux `4` et supérieurs permettent d'afficher des informations à propos des en-têtes, les niveaux `3` et supérieurs les codes de réponse (404, 200, etc...), et les niveaux `2` et supérieurs les messages d'avertissement et d'information.

**`-V`**

Affiche le numéro de version et s'arrête.

**`-w`**

Affiche les résultats dans des tables HTML. La table par défaut comporte deux colonnes sur fond blanc.

**`-x <table>-attributs`**

La chaîne à utiliser comme attributs pour `<table>`. Les attributs sont insérés `<table ici >`.

**`-X mandataire[:port]`**

Utilise un serveur mandataire pour les requêtes.

**`-y <tr>-attributs`**

La chaîne à utiliser comme attributs pour `<tr>`.

**`-z <td>-attributs`**

La chaîne à utiliser comme attributs pour `<td>`.

**`-Z algorithme-chiffrement`**

Spécifie l'algorithme de chiffrement SSL/TLS (Voir les algorithme de chiffrement openssl).

## Sortie

Vous touverez dans ce qui suit la liste des valeurs retournées par [[10-commandes/ab|ab]] :

**Server Software**

La valeur, si elle existe, de l'en-tête HTTP *server* renvoyée dans la première réponse réussie. Elle comporte tous les caractères de l'en-tête jusqu'à ce qu'un caractère de valeur décimale 32 soit rencontré (le plus souvent un espace ou une fin de ligne).

**Server Hostname**

Le nom DNS ou l'adresse IP fourni dans la ligne de commande.

**Server Port**

Le port auquel ab est connecté. Si la ligne de commande ne spécifie aucun port, le port par défaut sera 80 pour http et 443 pour https.

**SSL/TLS Protocol**

Les paramètres de protocole négociés entre le client et le serveur. Uniquement si SSL est utilisé.

**Document Path**

L'URI de la requête interprété à partir de la chaîne de la ligne de commande.

**Document Length**

Il s'agit de la taille en octets du premier document renvoyé avec succès. Si la taille du document est modifiée au cours du test, la réponse est considérée comme une erreur.

**Concurrency Level**

Le nombre de clients simultanés utilisés au cours du test.

**Time taken for tests**

Il s'agit du temps écoulé entre le moment de la première connexion au socket et la réception de la dernière réponse.

**Complete requests**

Le nombre de réponses reçues avec succès.

**Failed requests**

Le nombre de requêtes considérées comme erronées. Si ce nombre est différent de 0, une ligne supplémentaire indiquera le nombre de requêtes ayant échoué suite à un problème de connexion, de lecture, de taille de contenu erronée ou d'exceptions.

**Write errors**

Le nombre d'erreurs rencontrées en cours d'écriture (broken pipe).

**Non-2xx responses**

Le nombre de réponses dont le code était en dehors de la série 200. Si toutes les réponses appartiennent à la série 200, cette ligne est absente.

**Keep-Alive requests**

Le nombre de connexions promues à l'état de connexions persistantes.

**Total body sent**

Si le test a été configuré dans ce sens, il s'agit du nombre total d'octets envoyés au cours du test. Ce champ est omis si le test ne prévoyait pas d'envoi de corps.

**Total transferred**

Le nombre total d'octets reçus du serveur. Ce nombre correspond à peu près au nombre d'octets envoyés sur la ligne.

**HTML transferred**

Le nombre total d'octets utiles (contenus) reçus du serveur. Ce nombre n'inclut pas les octets correspondant aux en-têtes HTTP.

**Requests per second**

Il s'agit du nombre de requêtes par seconde. Il correspond au nombre de requêtes divisé par la durée totale du traitement.

**Time per request**

La durée moyenne du traitement d'une requête. La première valeur est calculée selon la formule `concurrency * timetaken * 1000 / done`, alors que la seconde valeur est calculée selon la formule `timetaken * 1000 / done`.

**Transfer rate**

Le taux de transfert calculé selon la formule `totalread / 1024 / timetaken`.

## Bogues

De nombreux tampons de taille fixe sont déclarés statiquement. Combiné avec l'interprétation poussive des arguments de la ligne de commande, les en-têtes de réponse du serveur et autres entrées externes, ceci peut vous affecter.

HTTP/1.x n'est pas complètement implémenté ; seules certaines formes de réponses 'attendues' sont acceptées. L'utilisation relativement intense de `strstr(3)` provoque un affichage en tête de profil, ce qui peut faire croire à un problème de performances ; en d'autres termes, vous mesurez les performances de [[10-commandes/ab|ab]] plutôt que celles du serveur.

## Voir aussi

- [[10-commandes/httpd|httpd]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
