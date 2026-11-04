---
title: "cat"
description: "Bash — cat (Lire & concaténer) : Affiche le contenu d'un ou plusieurs fichiers (ou les concatène)."
tags: [bash, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Lire & concaténer |
| **Commande type** | `cat fichier` |

## Rôle

Affiche le contenu d'un ou plusieurs fichiers (ou les concatène).

## Options

| Option | Rôle |
| --- | --- |
| `-n` | numérote toutes les lignes |
| `-b` | numérote les lignes non vides |
| `-A` | montre les caractères invisibles (tabs, fins de ligne) |
| `-s` | fusionne les lignes vides multiples |
| `(écrire sans éditeur) cat > fichier` | ouvre la saisie au clavier, aucun éditeur n'est lancé |
| `(coller) Ctrl+Maj+V` | raccourci du terminal ; ⌘V sur macOS, Maj+Inser sous PuTTY |
| `(terminer) Ctrl+D` | marque la fin de saisie et referme le fichier |
| `(annuler) Ctrl+C` | interrompt, mais le fichier reste tronqué |
| `(> écrase, >> ajoute)` | le fichier est vidé AVANT que cat ne démarre |

## Exemples

**Lire**

```bash
cat /etc/hosts
```

**Avec numéros**

```bash
cat -n script.sh
```

**Concaténer**

```bash
cat a.txt b.txt > tout.txt
```

## Dans les autres shells

- [[27-commandes/03-macos/10-fichiers-texte/cat|cat (macOS)]]

*Mots-clés : cat afficher lire concaténer fichier contenu texte numeroter*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
