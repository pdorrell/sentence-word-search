# Sentence Word Search

## Basic Design

I want to create an online word-search puzzle with the following workflow -

* The user enters a word for an English Wikipedia page
  * (If the word isn't a Wikipedia page, the application will tell the user to try something else.)
* The application uses the Wikipedia JSON API to download the plain text version of the first paragraph
  of that Wikipedia page.
* Use "User-Agent" and "Api-User-Agent" that satisfy Wikipedia requirements:
  * For URL use https://sentence-word-search.thinkinghard.com/about
  * For email use "web@thinkinghard.com"
  * For application name use "Sentence Word Search"  
* The application parses the paragraph into sentences.
* The application UI gives the user an indication of how many sentences there are in the paragraph
  and also which sentence the puzzle is currently on - starting with the 1st sentence.
* The application parses the sentence into words.
* The application populates a word search grid with the words from the sentence. The size of the grid
  is based on what size fits comfortably onto their screen, with a minimum size of 8x8 and maximum of 20x20.
  (This size is determined at the moment that the user enters the topic word, so it won't change
  if the user resizes their screen.)
* All positions in the grid not populated from the sentence words are filled with random letters.
* The application presents the sentence where each word not yet solved by the user is shown as 
  some non-character (eg a large black dot). So, for example, "I like eating cake." is presented as "● ●●●● ●●●●●● ●●●."
* The user attempts to find a word by making a selection that starts with a letter in the grid and
  then moves in a horizontal, vertical or diagonal direction to select the letters of the word.
* If the selection correctly matches a word in the sentence, the application marks that word as solved,
  showing it graphically in the grid and revealing the letters of that word in the displayed sentence.
* When a sentence is completed, the application will move onto the next sentence. However at any time
  the user can choose to start working on a different sentence using the sentence selection/state UI.
* When all the sentences are completed for the word, then the user will have to choose a new word to work on.

The application will provide an "/about" web page that gives a basic description of the application
and how it uses the Wikipedia API.

## Suggested Implementation Technologies

* For sentence parsing and segmentation, use the **compromise** Javascript library.
* For dragging interactions, use @use-gesture/react.

## Algorithmic Issues

### Failure to fully populate

Depending on the length of the sentence and the size of the grid, an algorithm to place all words in
grid might not succeed in placing all the words. The application should handle this situation by
just regard any un-placed words as already solved.

### Repetition of Words in Grid and in Sentence

It is possible that a word may appear more than once in a sentence.

It is also possible that a word may appear in the grid more times than it occurs in the sentence.

For the purposes of determining a "correct" selection, the algorithm will count any selection 
of a word as correct if:

* It is not a selection that has already been made in the grid
* There is still at least one unsolved (ie unrevealed) instance of the word in the sentence that matches 
  the selection.
  
When there is a choice of unsolved instances of the same word to reveal, choose the first of those
that occur in the sentence.
  
For the purposes of placement, it is undesirable for a word selection in the grid to completely
cover another word selection. However it may be difficult to avoid this entirely. (The worst outcome
will be that the display of one or more word selections in the grid could hide or partially hide 
the display of another  word selection made earlier.)

To minimize any overlap or hiding, the application sets a required minimum length of words to populate the puzzle,
which is four letters - unless a sentence happens to consist entirely of words shorter than four
letters, in which case the required minimum is the maximum length of any word in the sentence.
Any such words not placed in the puzzle will be shown as already revealed (the same as for any other words
that cannot be placed because there is no position they can be placed in that is consistent with what is already placed,
or because they are just too long to fit at all).

## Numbers of sentence

In principle the number of sentences in the downloaded extract could be very large. The application will
limit itself to the first ten sentences.

## Saving State

For an initial prototype the application will only run in a current web page as an SPA, and will not
attempt to persist state.

## Detailed UI

The UI for the application consists of five elements the populate the page going down from the top:

* Heading
* Topic Word choice
* Sentence choice & state
* The solution state of the sentence as revealed and unrevealed words
* The word-search grid, showing successful selections and any current selection interaction

### Heading

The heading will be "Sentences Word Search"

### Topic Word choice

Initially this will consist of a row of elements:

* Label: "Wikipedia topic"
* Textual input (20 characters wide)

Once the topic word is entered, the application will attempt to download the initial extract for that
topic.

* If it fails, the UI will show an error message below saying "No such topic: <topic>"
* If it succeeds, the UI will disable the topic word input, and display the other main elements below.

When a topic word has been successfully chosen, the application shows a button on the right end of the
row "New Topic ...". When the user clicks on this, if the user has not successfully completed all the
sentences, the application will ask for confirmation "Do you want to start with a new topic word?"
before then resetting the application back to the state of waiting for the user to input a topic word.

### Sentence choice and state

The downloaded extract will contain one or more sentences, with the application not using more than
ten sentences.

The UI for sentence choice and completion state consists of a row of coloured squares, one for each
sentence.

There are five states to show:

* Current sentence, not yet started - bright yellow
* Current sentence, partially solved - bright orange
* Current sentence, fully solved - bright green
* A non-current sentence, not yet started - darker yellow
* A non-current sentence, partially solved - darker orange
* A non-current sentence, fully solved - darker green

When a given sentence is solved and not all the sentences are yet solved, the user has to manually 
select a different sentence to start work on. Also the user can switch to any other sentence at any time -
even a sentence that has been fully solved (just so they can look at it if they want to).


### Sentence solution display

The next row shows the state of the current sentence that the user is working on. This consists of
words that are revealed and words not yet revealed, showing only the initial characters.

Debugging state - during initial development it will be very helpful to be able to see the actual values
of unsolved words. So actually the unsolved words will be displayed with the letters, but with a difference
background colour (a light red) that indicates those words are unsolved.

### Grid

The grid displays a square of NxN letters.

If will also display user selections -
* Correct selections already made
* Any current selection being made by the user.

In the case where correct selections overlap, the most recent selections are placed on top.

Any current selection must be placed above all others.

Selection states are shown in different background colours:

* Existing correct solutions - light green
* The last correct solution just made, if the user is not currently making a new selection - brighter green
* Current selection being dragged - light orange
* Current selection finished that is wrong - light red, and fades after 1 second (or as soon as the user starts
  a new selection).
  
The actual display of a selection should be a bordered rectangle that covers all the letters that are part
of the selection, but with rounded corners.

## Implementation suggestions

* For parsing a paragraph into sentences and sentences into words, use **compromise** Javascript library.
* For mouse & touch dragging interactions use @use-gesture/react.
* A sample Wikipedia request to get first Wikipedia paragraph for a topic word 
  is action=query&format=json&titles=Elephant&prop=extracts&exintro=1&explaintext=1
* Use mostly HTML DOM for the UI, but for the search grid use SVG, both to display the grid letters
  and also to display the selections.


