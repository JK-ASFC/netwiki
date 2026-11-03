---
title: "Documenting code in Apache 2.4"
description: "Apache HTTP Server — Documenting code in Apache 2.4. Apache 2.4 uses Doxygen(https://www.doxygen.nl/) to document the APIs and global variables in the code. This will explain the basics of how to document using Doxygen."
tags: [apache, guide]
icon: book-open
---

> [!NOTE]
> Cette page n’a pas de traduction française officielle : le texte original en anglais est reproduit tel quel.

Apache 2.4 uses [Doxygen](https://www.doxygen.nl/) to document the APIs and global variables in the code. This will explain the basics of how to document using Doxygen.

## Brief Description

To start a documentation block, use `/**`
To end a documentation block, use `*/`

In the middle of the block, there are multiple tags we can use:

```
Description of this functions purpose
@param parameter_name description
@return description
@deffunc signature of the function
```

The `deffunc` is not always necessary. DoxyGen does not have a full parser in it, so any prototype that use a macro in the return type declaration is too complex for scandoc. Those functions require a `deffunc`. An example (using &gt; rather than \>):

```
    /**
* return the final element of the pathname
* @param pathname The path to get the final element of
* @return the final element of the path
* @tip Examples:
* <pre>
*                 "/foo/bar/gum"   -&gt; "gum"
*                 "/foo/bar/gum/"  -&gt; ""
*                 "gum"            -&gt; "gum"
*                 "wi\\n32\\stuff" -&gt; "stuff"
* </pre>
* @deffunc const char * ap_filename_of_pathname(const char *pathname)
*/
```

At the top of the header file, always include:

```
    /**
* @package Name of library header
*/
```

Doxygen uses a new HTML file for each package. The HTML files are named {Name\_of\_library\_header}.html, so try to be concise with your names.

For a further discussion of the possibilities please refer to [the Doxygen site](https://www.doxygen.nl/).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (texte original en anglais, pas de traduction officielle), © Apache Software Foundation, licence Apache 2.0.*
