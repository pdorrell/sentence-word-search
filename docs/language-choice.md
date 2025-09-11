# Language Choice

The application defaults to EN as the language and
EN, ES, MI and QU as the selectable languages.

The user can specify a different language by including
it in the URL, for example "/FR" for French.

When the user specifies the language in the URL:

* If it's not in the list of selectable languages, add it to the list
* Select that language.

When selecting a different language, set the URL with that language.

Do not restrict the choice of language code - Wikipedia language codes can be 7 or more letters long.

If the language is invalid, the user will see that in the error message when choosing a word.

The important thing is that a URL can be shared or bookmarked that is specific to the choice of language.

## Filler letters

The 4 languages EN, ES, MI and QU have predefined:

* alphabets, for choosing letters to the fill the grid once all possible words have been placed
* placeholder word, like "eg tiger" for EN.

For any other languages:

* Yse the English placeholder.
* For fill letters, use the set of alphabetic letters found in the sentences retrieved for the topic.
