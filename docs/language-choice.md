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

## "Other" choice in Selector

The user can also choose an alternative language by choosing "Other" in the selector. Choosing this will
active an input field in selector drop-down.

## Filler letters

The 4 languages EN, ES, MI and QU have predefined:

* alphabets, for choosing letters to the fill the grid once all possible words have been placed
* placeholder word, like "eg tiger" for EN.

For any other languages:

* Use the English placeholder.
* For fill letters, use the set of alphabetic letters found in the sentences retrieved for the topic.

## Routing implementation

Do not user react-router to do the routing. The routing should be implemented via a direct interaction
between browser URL & history and the applications mobx state:

* On loading page, read the URL path to determine, if specified, what the language is.
* When a different language is selected, update the current URL path to match.
* Use history.pushState to keep track of URL history.
