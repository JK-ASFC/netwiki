---
title: "SSLRequire"
description: "Directive Apache SSLRequire (mod_ssl) — N'autorise l'accès que lorsqu'une expression booléenne complexe et arbitraire est vraie. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | N'autorise l'accès que lorsqu'une expression booléenne complexe et arbitraire est vraie |
| **Syntaxe** | `SSLRequire expression` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |

## Utilisation

> [!NOTE]
> **SSLRequire est obsolète**
>
> `SSLRequire` est obsolète et doit en général être remplacée par l'expression [[12-modules/mod_authz_core|Require]]. La syntaxe [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|ap_expr]] de l'expression `Require` est une extension de la syntaxe de `SSLRequire`, avec les différences suivantes :
>
> Avec `SSLRequire`, les opérateurs de comparaison `<`, `<=`, ... sont strictement équivalents aux opérateurs `lt`, `le`, ... , et fonctionnent selon une méthode qui compare tout d'abord la longueur des deux chaînes, puis l'ordre alphabétique. Les expressions [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|ap_expr]], quant à elles, possèdent deux jeux d'opérateurs de comparaison : les opérateurs `<`, `<=`, ... effectuent une comparaison alphabétique de chaînes, alors que les opérateurs `-lt`, `-le`, ... effectuent une comparaison d'entiers. Ces derniers possèdent aussi des alias sans tiret initial : `lt`, `le`, ...

Cette directive permet de spécifier une condition générale d'accès qui doit être entièrement satisfaite pour que l'accès soit autorisé. C'est une directive très puissante, car la condition d'accès spécifiée est une expression booléenne complexe et arbitraire contenant un nombre quelconque de vérifications quant aux autorisations d'accès.

L'*expression* doit respecter la syntaxe suivante (fournie ici sous la forme d'une notation dans le style de la grammaire BNF) :

> ```
> expr     ::= "true" | "false"
>            | "!" expr
>            | expr "&&" expr
>            | expr "||" expr
>            | "(" expr ")"
>            | comp
>
> comp     ::= word "==" word | word "eq" word
>            | word "!=" word | word "ne" word
>            | word "<"  word | word "lt" word
>            | word "<=" word | word "le" word
>            | word ">"  word | word "gt" word
>            | word ">=" word | word "ge" word
>            | word "in" "{" wordlist "}"
>            | word "in" "PeerExtList(" word ")"
>            | word "=~" regex
>            | word "!~" regex
>
> wordlist ::= word
>            | wordlist "," word
>
> word     ::= digit
>            | cstring
>            | variable
>            | function
>
> digit    ::= [0-9]+
> cstring  ::= "..."
> variable ::= "%{" varname "}"
> function ::= funcname "(" funcargs ")"
> ```

Pour `varname`, toute variable décrite dans Variables d'environnement pourra être utilisée. Pour `funcname`, vous trouverez la liste des fonctions disponibles dans la [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|documentation ap_expr]].

*expression* est interprétée et traduite sous une forme machine interne lors du chargement de la configuration, puis évaluée lors du traitement de la requête. Dans le contexte des fichiers .htaccess, *expression* est interprétée et exécutée chaque fois que le fichier .htaccess intervient lors du traitement de la requête.

**Exemple**

```apache
SSLRequire (    %{SSL_CIPHER} !~ m/^(EXP|NULL)-/                   \
            and %{SSL_CLIENT_S_DN_O} eq "Snake Oil, Ltd."          \
            and %{SSL_CLIENT_S_DN_OU} in {"Staff", "CA", "Dev"}    \
            and %{TIME_WDAY} -ge 1 and %{TIME_WDAY} -le 5          \
            and %{TIME_HOUR} -ge 8 and %{TIME_HOUR} -le 20       ) \
           or %{REMOTE_ADDR} =~ m/^192\.76\.162\.[0-9]+$/
```

La fonction `PeerExtList(identifiant objet)` recherche une instance d'extension de certificat X.509 identifiée par *identifiant objet* (OID) dans le certificat client. L'expression est évaluée à true si la partie gauche de la chaîne correspond exactement à la valeur d'une extension identifiée par cet OID (Si plusieurs extensions possèdent le même OID, l'une d'entre elles au moins doit correspondre).

**Exemple**

```apache
SSLRequire "foobar" in PeerExtList("1.2.3.4.5.6")
```

> [!NOTE]
> **Notes à propos de la fonction PeerExtList**
>
> - L'identifiant objet peut être spécifié soit comme un nom descriptif reconnu par la bibliothèque SSL, tel que `"nsComment"`, soit comme un OID numérique tel que `"1.2.3.4.5.6"`.
> - Les expressions contenant des types connus de la bibliothèque SSL sont transformées en chaînes avant comparaison. Pour les extensions contenant un type non connu de la bibliothèque SSL, mod\_ssl va essayer d'interpréter la valeur s'il s'agit d'un des types ASN.1 primaires UTF8String, IA5String, VisibleString, ou BMPString. Si l'extension correspond à un de ces types, la chaîne sera convertie en UTF-8 si nécessaire, puis comparée avec la partie gauche de l'expression.

## Voir aussi

- [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement|Les variables d'environnement dans le serveur HTTP Apache]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
