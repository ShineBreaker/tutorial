# 编辑理论（二）：替换、大小写、计数、文本操作

> 原书来源：Mastering Emacs (Eli Spare)，第 209–234 页。
> 覆盖范围：Search and Replace, Changing Case, Counting, Text Manipulation

## [p.209]
The Theory of Editing
Variable Name
Purpose
comment-style
Style of comment to use
comment-styles
Association list of available
comment styles
comment-start
Character(s) to mark start
of comment
comment-end
Character(s) to mark end of
comment
comment-padding
Padding used (usually a space)
between comment character(s)
and the text
All the variables above are customizable with
M-x
-customize-option. It is unlikely that you will ever have to
change comment-start or comment-end as they are almost
always set by the major mode authors. comment-style is
a must if your team – or personal preference – dictates
one comment style over another. To see a list of com-
ment styles available, you must interrogate the variable
comment-styles by reading its description in Customize or
by using M-x describe-variable (also bound to C-h v).
Search and Replace
When you search for text, you can do so either with regu-
lar expressions (see the next section Regular Expressions) or
without. Replacing text in Emacs is no different, but with
the added benefit of letting you leverage the power of elisp
in the replace portion of search and replace.
209

## [p.210]
The Theory of Editing
In that sense, Emacs is different from other editors: you can
use elisp and regexp capturing groups together — powerful,
if you know elisp. Emacs’s regular expression implementa-
tion is also different from PCrE2 as I will explain later. It
follows the GNU standard for regular expressions with many
additions (and quite a few omissions) to make it suitable for
both package developers and Emacs users.
Emacs’s search and replace commands are:
Key Binding
Purpose
C-M-%
Query regexp search and replace
M-%
Query search and replace
M-x replace-string
Search and replace
M-x replace-regexp
Regexp search and replace
You can also access Emacs’s search and replace from inside
Isearch:
Isearch Key Binding
Purpose
C-M-%
Query regexp search and replace
M-%
Query search and replace
The query commands are interactive and will prompt you
for instruction at every match. Like Isearch, the interface
is rather spartan but utilitarian. It is also divided into two
parts: the prompts for search and replace, which work the
2 PCrE stands for Perl-Compatible Regular Expressions — a style of
regexp invented by the Perl programming language.
210

## [p.211]
The Theory of Editing
same way other prompts do and the interactive part where
you select each match.
When presented with a match, you can choose one of the
following options:
Query Key Binding
Purpose
SPC, y
Replaces one match, then continues
.
Replaces one match, then exits
,
Replace, but stay at current match
RET, q
Exits without replacing match
!
Replaces all matches in buffer
^
Moves point back to previous match
u, U
Undo last / all replacement(s)
Case Folding
In Isearch: Incremental Search, I talked about case folding, a
clever feature in Emacs that intelligently matches string case
insensitively unless you search for a mixed case or uppercase
string, at which point it activates case-sensitive search. It’s a
great feature, and Emacs’s replace mechanism also uses it.
Consider a buffer with the following pseudo-code:
HELLO_WORLD = "Hello, World!"
function hello() {
print(HELLO_WORLD)
}
211

## [p.212]
The Theory of Editing
If we do a query replace with C-M-% for hello -> goodbye,
the result of the buffer above is:
GOODBYE_WORLD = "Goodbye, World!"
function goodbye() {
print(GOODBYE_WORLD)
}
Asyoucan see,Emacs preservedthecaseofeachreplacement
match because we searched for hello and not Hello or HELLO.
If you searched for Hello or HELLO, Emacs would only replace
those literal matches because they contain uppercase charac-
ters.
Regular Expressions
Earlier, I alluded to the differences between PCrE and
Emacs. The long and the short of it is: Emacs’s regexp
engine is nowhere near as user-friendly as it could be. It’s
old, weathered and too entrenched – and heavily modified
to suit Emacs’s peculiar needs – to be easily replaced. For
instance, in PCrE-style engines the characters ( and ) are
meta-characters, meaning the engine will not treat them as
literal characters but as a capturing group. In Emacs, it is
the other way around. They are literal characters until you
escape them with a backslash (\) at which point they assume
the role as meta-characters.
In practical terms, that causes confusion in regexp building
for people unaccustomed to Emacs’s quirky regexp engine.
It’s even worse if you write elisp as you have to escape the
212

## [p.213]
The Theory of Editing
escape character as Emacs’s C-style string reader would oth-
erwise trigger on backslashes.
I will not cover regular expressions in great detail since
that is a whole book onto itself. Instead, I will tell you how
Emacs’s regexp engine differs from modern ones.
Backslashed Constructs
The following constructs require backslashes or Emacs will
treat them like literal characters:
Constructs
Description
\|
Alternative
\(, \)
Capturing group
\{, \}
Repetition
Missing Features
Emacs does not support anykind ofnegativeor positivelook-
ahead or look-behind except specific, hard coded constructs.
More obscure regexp features like branch reset groups and
sofortharealsomissing.Formosttextediting,thisisusually
not a huge problem.
One annoyance is the missing shorthand, \d, for the digit
class. You must use [0-9] in lieu of \d or the explicit class
[:digit:].
Emacs-only features
One area where Emacs’s regexp engine does shine is its sup-
port for match constructs and Unicode support:
213

## [p.214]
The Theory of Editing
Constructs
Description
\<, \>
Matches beginning and end of word
\_<, \_>
Matches beginning and end of symbol
\scode
Matches any character whose syntax
table code is code
\Scode
Matches any character whose syntax
table code is not code
Matching symbols and words with \<, \> and \_<, \_> is com-
mon in programming for ad hoc re-factoring. The defini-
tion of a word and symbol is again down to Emacs’s syntax
table and thus major mode-dependent.
Both \s and \S have their place as you can match characters
against a specific syntax class. The naming of each class is
really just a guideline as there is nothing stopping you from
declaring that the number 9 belongs in the whitespace class if
you are a major mode author.
Here is an abridged list of interesting syntax classes:
Whitespace characters (-) Includes, as you would expect,
your humble space but also newlines and usually
Unicode-equivalents like non-breaking space.
Word constituents (w) This is typically all lower- and
upper-case characters, digits, and equivalent Unicode
characters from non-Latin character sets.
Symbol constituents (_) Includes all word constituents
and additional symbols, like ! or _, used most often
in programming languages. This class more than any
214

## [p.215]
The Theory of Editing
other is likely to change depending on your major
mode.
Punctuation characters (.) Includes the usual characters
like . and ;. Text modes and programming modes are
likely to differ greatly.
Open/close parenthesis (( and )) Any set of characters
that form a grouped pair. Most text and programming
modes include (), [] and {}.
String characters (") Includesanysymbolsthatmarkacon-
tiguous block as a string. Double and single quotes, '
and ", are usually among them. Unicode characters
such as left and right versions, guillemots and so on
may also exist in this class.
Open/close comment characters (< and >) Any character,
or pair of characters, that define the boundary of a
comment. Some languages only support line-level
comments, in which case only < is used.
For instance, to match all whitespace characters you should
search for \s-. If you want to match all string quote char-
acters – for example in Python where you can have both
'strings' and "strings" – use \s" to match all quote sym-
bols. That makes it possible to transform (or merely find, as
these commands also work in regexp Isearch or Occur) text
bolstered by Emacs’s understanding of the syntax of your
major mode.
Determining a character’s syntax class
215

## [p.216]
The Theory of Editing
Emacs’s Unicode support is fantastic and as part
of its extensive Unicode support you have the
option of inspecting any character of your liking
using C-u M-x what-cursor-position. To use it,
place your point on a character you want to in-
spect and either run the command or type C-u
C-x =. You will see an array of information in-
cluding syntax class, font lock, Unicode name
and much more.
There are several types of capturing groups available in
Emacs:
Constructs
Description
\1 to \9
Inserts text from group \N
\#1 to \#9
Inserts text from group \N but
cast as an integer
(For use in elisp only)
\?
Prompts for text input from user
\#
Inserts a number incremented from 0
\&
Inserts whole match string
The \#N capturing groups are of little use outside of an elisp
form. \? lets you replace matches with strings that you enter
manually. The \# group inserts a number starting from 0
that increments by 1 after every match. Finally, \& simply
inserts the entire match string.
216

## [p.217]
The Theory of Editing
Invoking Elisp
You can call out to elisp functions from within the replace
portion of the search and replace interface. Whether you
find a use for it depends entirely on how well you know elisp
(or how willing you are to experiment) and how often you
find yourself doing complex search and replace.
To call an elisp form, you use this format:
\,(form ...)
Where form is the name of a function you want to call.
There are some rules you must follow if you want to call out
to elisp:
Capturing groups are string types by default; passing a
string to an elisp function that expects another type,
like an integer, will result in an error.
You don’t need capturing groups if your function does
not require them. It is perfectly possible to replace a
match with the sole output from a function.
You can only call one form so if you want to call more
than one, you must wrap it in something like progn or
prog1 or use functions such as concat to concatenate
the results from multiple functions into one.
Do not quote the capturing groups as they are passed as
literal strings (if you use \N) or numbers (if you use
\#N) to Emacs’s interpreter.
217

## [p.218]
The Theory of Editing
Replace String
Description
\,(upcase \N)
Uppercases capturing group \N
\,(format "%.2f" \#N)
Casts \#N to a number and
formats it as a decimal with two
decimal points
Here are two example replacement forms.
Although it’s a powerful feature, it is situational. Most of
Emacs’s internal functions – just about anything that does
something interesting – operate on buffers and not strings as
I mentioned in The Buffer. That greatly lowers the utility
of this feature as you not only have to find a function that
does what you want, but you have to find one that works on
strings.
When I have needed this feature, I have inevitably resorted
to writing my own specialized functions that transform the
text the way I want. But that assumes a certain level of flu-
ency in elisp. My advice would be to use Emacs’s keyboard
macros – a topic I will cover shortly – as they are far more
suited for complex editing tasks.
Changing Case
Case changing – capitalizing text or turning it into lower or
uppercase – is a common occurrence in both code and text.
Region Commands
Description
C-x C-u
Uppercases the region
218

## [p.219]
The Theory of Editing
Region Commands
Description
C-x C-l
Lowercases the region
M-x upcase-initials-region
Capitalizes the region
There is not much to say about the first two. When your
region is active, you can uppercase or lowercase the region.
Capitalizing the region actually means capitalizing every word
in the region — not just the first word in a sentence, line or
paragraph.
The case commands that act on words are far more interest-
ing:
Key Binding
Description
M-c
Capitalizes the next word
M-u
Uppercases the next word
M-l
Lowercases the next word
First of all, they are mnemonic and bound to what you could
call prime key real estate (easy to reach and type keys.)
They work exactly the same way other word commands
in Emacs work, and they respect the same syntax table
rules as the
forward-word,
mark-word,
kill-word, and
transpose-words commands do.
Both digit arguments and negative arguments work as you
would expect. Like the other word-based commands, I rec-
ommend you commit these to memory. Forget memoriz-
ing the region commands. Unless you do a lot of region-
219

## [p.220]
The Theory of Editing
based casing, you are far more likely to change case word-
by-word.
Maintaining your tempo when you use them is important as
you will typically use them as you write. M-- M-u will upper-
case the last word you wrote, for instance, and M-b M-- M-u
will move back one word and uppercase the word before
that. And of course you should not release meta between
keystrokes. So, with your thumb on the left meta key, your
other fingers are free to type b - u.
Consider this sentence. I want to insert a full stop and capi-
talize the next word:
█Hey how are you?
After typing M-f to move forward a word; . to insert a full
stop, and M-c to capitalize the next word:
Hey. How█are you?
Likewise, here I finished typing an identifier — but it should
be uppercase because it points to a string constant:
print(greeting_string)█
In most major modes, _ is either punctuation or a symbol,
so it breaks the word; ergo, it would take two presses to
go backward with M-b to put the point at the beginning of
greeting_string.
Or you can do M-- M-2 M-u which combines digit and nega-
tive arguments:
220

## [p.221]
The Theory of Editing
print(GREETING_STRING)█
With a bit of practice, you will be able to do it so quickly,
and intuitively, that you won’t even have to think about it.
The other benefit is that it does not move your point; you
are free to continue writing. It may not seem like a huge
time saver, but these things add up.
The case commands also work with non-Latin characters
since Emacs maps most Unicode characters to their correct
Unicode categories. In practical terms, that means Emacs
knows when it encounters a lowercase or uppercase charac-
ter:
Greek: αβψδεφγ -> ΑΒΨΔΕΦΓ
Danish: abcdæøå -> ABCDÆØÅ
Unicode categories
Try M-x describe-categories to see a full list of
all Unicode categories.
Counting Things
There’s no need to call out to wc when you want to count
things as Emacs is perfectly capable of doing that too.
Command
Description
M-x count-lines-region
Counts number of lines in
the region
M-x count-matches
Counts number of patterns
221

## [p.222]
The Theory of Editing
Command
Description
that match in a region
M-x count-words
Counts words, lines and chars
in the buffer
M-x count-words-region, M-=
Counts words, lines and chars
in the region
Although there is more than one way of counting things, the
two worth memorizing are:
M-x count-words as it, unlike its unfortunate name implies,
also counts lines and characters. You may occasionally
want to count things in a region, in which case you can
use M-=.
M-x count-matches counts matches against a regexp pattern
you specify, either from point to the end of buffer if
no region is active, or just in the active region.
Text Manipulation
Text manipulation is one aspect Emacs is especially good at,
and it has a variety of tools to help you. Massaging text files
for further processing or extracting pertinent information
from log files are both common things to do in Emacs. Al-
though Emacs will never fully replace dedicated tools like
awk and sed or languages like Python, it is a fine choice for
small and medium-sized tasks.
222

## [p.223]
The Theory of Editing
Editable Occur
I introduced M-x occur earlier as a way of collating all lines
that match a certain pattern. One feature in occur mode that
I did not talk about is the ability to edit the matches and, after
you finish, commit the changes to their original lines.
To do this, you must first enter the editable occur mode by
typing e. You can then commit the changes you make by
typing C-c C-c. The possibilities are limitless. The feature is
especially great for keyboard macros and search & replace.
Deleting Duplicates
You can delete duplicate lines in Emacs and the best thing
about it is, unlike the command line utility uniq, the lines
don’t have to be adjacent for Emacs to detect duplicates. That
means you can delete duplicates without sorting the text.
Universal Argument
Description
Without
Keeps first duplicate line
C-u
Keeps last duplicate line
C-u C-u
Deletes only adjacent duplicates
C-u C-u C-u
Does not delete adjacent blank
lines
By default, M-x delete-duplicate-lines keeps the first dupli-
cate line it encounters, starting from the top. With a single
universal argument, it instead starts from the bottom, and
therefore keeps the last.
223

## [p.224]
The Theory of Editing
Flushing and Keeping Lines
Sometimes you want to filter lines in a region by a pattern;
whether that is to flush lines that match a pattern, or keep the
ones that do.
Both commands act on the active region, so it is common –
if you want to do this on a whole buffer – to call C-x h to
select the entire buffer first.
Command
Description
M-x flush-lines
Flushes (deletes) all lines in a region
that match a pattern
M-x keep-lines
Keeps all lines in a region that
match a pattern and removes all
non-matches
Both commands accept a regexp pattern. If the pattern
matches against a line it is either kept or flushed — not the
pattern itself (for that, use search & replace.)
I use the commands frequently when I process text. You can
keep lines that match a pattern and use it as a poor man’s
grep, with flush serving the opposite role. Filtering log files
or scrubbing data are two examples where the commands
work well.
Rectangle Commands
Emacs has two methods of operating on rectangles. The sim-
plest one, by toggling rectanglemarkmode with C-x SPC, is one
of them. The other is a handy set of rectangle commands
224

## [p.225]
The Theory of Editing
that don’t require rectangle mark mode at all. The latter set of
commands have been in Emacs since time immemorial, and
they predate the advent of TMM, the visual region feature,
and so they don’t require a region, much less a rectangular
region, to work.
The rectangle commands behave mostly as the rectangular
mark mode does, if you use it, with the mark being the one
corner of the rectangle, and your point the opposite corner,
forming an invisible rectangle.
Rectangle commands occupy that strange intersection of be-
ing useful with both code and prose. Later on, I’ll talk about
aligning text, and the rectangle commands do gel rather well
with them.
The rectangle key bindings only care about the relative posi-
tion of mark and point to each other. Whether you have an
active region or not is of no importance to the rectangle com-
mands. That can be a little bit confusing, because the contigu-
ous nature of the region would imply that they should some-
how act on the whole region, but they do not. I recommend
you engage C-x SPC’s rectangle mark mode for a clearer idea of
what the rectangle commands will act on. Once you’ve got
it locked down, you can skip that step, or even activating the
region altogether, if you so choose, as it only cares about the
location of mark and point.
Some of the rectangle key bindings are more useful than oth-
ers:
Key Binding
Description
C-x r N
Number each line
C-x r c
Clear the rectangle
225

## [p.226]
The Theory of Editing
Key Binding
Description
C-x r d
Delete the rectangle
C-x r k
Kill the rectangle
C-x r o
Open rectangle
C-x r r
Copy rectangle to register
C-x r t
Prefix rectangle with string
C-x r y
Yank rectangle
C-x r M-w
Copy rectangle to kill ring
Start with the commands that remove text. You can clear
(replace with whitespace) the rectangle; delete the text out-
right; or send it to the kill ring. All are useful.
Numbering each line certainly has its uses. Without a pre-
fix argument, it starts numbering from 1. With a prefix ar-
gument, you get to choose not only the starting number,
but also the format string to use. The format function (C-h f
format) is much like the one used in the C programming lan-
guage, though the Emacs documentation string has detailed
notes on its use.
Opening a rectangle with C-x r o inserts whitespace to the
left of the rectangle equal to the width of the rectangle. It
has its uses, but you may prefer C-x r t as it’ll insert any text
you like before the rectangle. It’s interactive, so you can see
the text being inserted as you type, which is useful indeed.
C-x r r sends the rectangle to a register, a feature I talked
about in Bookmarks and Registers.
Hitting the Mark
226

## [p.227]
The Theory of Editing
In Selections and Regions I talked about how
Emacs didn’t used to highlight the region at all,
and how you were expected to just magically re-
member where it was. Luckily that is no longer
the case, but you can still benefit from this fea-
ture.
There’s no real need to learn this, but just think
of it as another way you can use Emacs’s auto-
matic marking to help you.
Because rectangle commands act on everything
between mark and point, you can use that to
quickly carve out a rectangle (or a regular region,
for that matter!) you want to act on.
Here’s how:
1. Use M-< or M-> to go to the beginning
or end of the buffer; manually, with C-x
SPC (twice; once to activate the region,
and again to ensure it’s off ); or perhaps
begin an Isearch with C-s or C-r, as Isearch
will drop a mark where you started your
search.
Any command that emits something akin
to Mark setor Mark savedinyourechoarea
is a good candidate.
2. Move point to the where you want the
other boundary of the rectangle region to
be.
3. Execute a rectangle command and observe
the effects.
227

## [p.228]
The Theory of Editing
The key thing here is that we are using Emacs
to set the mark boundary, either manually with
C-x SPC; or automatically, when it’s command
that whisks you away from where you were, like
Isearch.
You can quickly get into a rhythm of relying
on a commands that set the mark knowing that
where ever your point ends up after that, the re-
gion is the extent between where you were and
where point is now! You can optionally tap C-x
C-x to exchange point and mark (and activate
the region) to see what I mean.
Personally, I use C-x r t, C-x r k and C-x r y most of all.
Inserting text, killing and yanking the rectangle is a practi-
cal trifecta of commands. All you need to remember is that
Emacs can do more than that, and cast a glance at C-x r C-h
if you forget the other rectangle commands.
Duplicating Things
You can instruct Emacs to duplicate the line or the region.
This feature requires Emacs 29 and is not available in earlier
versions of Emacs.
Command
Description
M-x duplicate-dwim
Duplicate DWIM (Emacs 29+)
M-x duplicate-line
Duplicate line (Emacs 29+)
Duplicating respects your numeric argument: pass a num-
228

## [p.229]
The Theory of Editing
ber before the command, and Emacs will duplicate the thing
you ask it to N number of times.
Duplicatingalineisself-explanatory,but M-x duplicate-dwim
deserves closer scrutiny. Without a region active, it’ll be-
have as M-x duplicate-line; but with a region, it will
instead duplicate the region.
One rather spiffy feature is that it supports rectangle regions.
If you activate a region and engage rectangle mark mode with
C-x SPC you can compel Emacs to duplicate the rectangle. Its
content is inserted next to the rectangle.
Copying and Killing Matching Lines
Like the commands to flush and keep lines, you can tell
Emacs that it should instead copy or kill them. They’re new
to Emacs 28, however, so you won’t have them in earlier
versions.
Command
Description
M-x copy-matching-lines
Copies all lines in a region
that match a pattern (Emacs 28+)
M-x kill-matching-lines
Kills all lines in a region that
match a pattern (Emacs 28+)
Joining and Splitting Lines
Unlike the kill commands that act on lines (C-M-<backspace>
and C-k), these commands won’t alter your kill ring. They
are also more specialized, as they insert or remove lines with-
out moving your point.
229

## [p.230]
The Theory of Editing
Key Binding
Description
C-o
Inserts a blank line after point
C-x C-o
Deletes all blank lines after point
C-M-o
Splits a line after point, keeping
the indentation
M-^
Joins the line the point is on with
the one above
Use C-o when you want to insert a newline immediately af-
ter point. Unlike RET, your point will not follow onto the
next line. It will remain in its original position. I use it to
split a paragraph into two, when I don’t want to move the
point also with RET.
Deleting blank lines is a common action. C-x C-o does just
that, but it obeys three rules:
Ignores your current line It will not remove the line the
point is on, even if it is empty. That means if you call
the command on a block of empty lines, it will always
leave exactly one empty line.
Remember this rule as it’s a great way to keep a con-
sistent number of spacing between, say, paragraphs in
text or class and function definitions in code.
Works ahead of the point So, when you call it on a
non-empty line, it will remove blank lines ahead of
the point. Unlike the previous rule, C-x C-o removes
all blank lines.
230

## [p.231]
The Theory of Editing
Lines with only whitespace and tabs are also removed
Best used in languages where you often leave tabs or
whitespace characters alone on empty lines.
C-M-o is a niche command thatyouwon’t use day-to-day.Un-
like C-o that inserts a newline after the point (called opening a
line), C-M-o does the same but it maintains the column offset
for the text.
Consider the difference between C-o and C-M-o:
All the world's a stage, █and all the …
After C-o:
All the world's a stage, █
and all the …
Now consider the original example, but using C-M-o instead:
All the world's a stage, █
and all the …
Note that the point remains in its original position.
Finally, the M-^ command doesthe oppositeof C-o and C-M-o:
it adjoins the current line the point is on with the one right
above. Convenient if you want to collapse sentences into
one large paragraph, or join multi-line function arguments
into one line.
231

## [p.232]
The Theory of Editing
M-^ is clever enough to trim whitespace when you join two
lines together. That is to say, Emacs will trim whitespace so
that at least zero or one remain, depending on whether the
line you are merging with has text on it or not. For blank
lines all whitespace is trimmed, and for lines with text all
but one space is trimmed.
Fill prefix
Typing C-M-o with a fill prefix active will split
the current line and insert the fill prefix on the
new line. Contrarily, M-^ removes fill prefixes
from lines that you join.
Whitespace Commands
Managing whitespace is an issue that recurs often when you
yank text from elsewhere or if you work with languages or
text where whitespace is significant.
Command
Description
M-x delete-trailing-
Deletes all trailing whitespace.
whitespace
M-SPC
Cycles spacing or
Deletes all but 1 space or tab
to the left and right of the point
M-x cycle-spacing
As above but cycles through
all but one, all, and undo
M-\
Deletes whitespace around point
M-x just-one-space
Deletes all but 1 space or tab
to the left and right of the point
232

## [p.233]
The Theory of Editing
M-SPC’s behavior has changed in Emacs 29. It now cycles spac-
ing by default, whereas before it just reduced all the whites-
pace to at most one character.
M-\ does the same, but removes all whitespace characters,
leaving none. M-x cycle-spacing cycles between leaving
one, leaving none, and restoring the original spacing. In
Emacs 29 you can change M-x cycle-spacing’s actions, and
in which order, by customizing cycle-spacing-actions.
Reverting to Just One Space
Emacs 29 changes M-SPC’s defaults, but you can
recover the old default by putting this in your
init file:
(global-set-key [remap cycle-spacing]
'just-one-space)
Whitespace Minor Mode
You can tell Emacs to visibly show you whitespace char-
acters and other typographic snafus, like trailing spaces or
overly long lines, using Emacs’s whitespace mode.
Command
Description
M-x whitespace-mode
Minor mode that highlights all
whitespace characters
M-x whitespace-
Minor mode that displays newline
newline-mode
characters with a $
M-x whitespace-
Displays a toggle menu of all
toggle-options
whitespace-mode options
233

## [p.234]
The Theory of Editing
Emacs’s whitespace minor mode overlays otherwise invisi-
ble whitespace characters with glyphs and colors so you can
tell them apart. It’s great if you want to find trailing whites-
pace, errant tab characters or “empty” lines with whitespace
in them.
Whitespace mode tracks the following: trailing spaces, tabs,
spaces, lines that are longer than whitespace-line-column
(typically 80 characters), newline characters, unicode
spacing, empty lines, indentation (both tabs and spaces),
spaces after tabs and spaces before tabs. Basically, it tracks
every conceivable combination that may cause syntax or
typography errors.
I suggest you customize whitespace mode – particularly the
colors, as they are a bit full-on – by customizing the group
whitespace with M-x customize-group.
You can also use M-x whitespace-toggle-options and toggle
the styles you want whitespace-mode to highlight.
Whitespace Reporting and Cleanup
M-x Command
Description
whitespace-report
Shows whitespace issues
whitespace-report-region
As above but for the region
whitespace-cleanup
Attempts automatic cleanup
whitespace-cleanup-region
As above but for the region
You can generate a report with M-x whitespace-report
(and similarly for regions) and see a succinct list of “issues”
present in your buffer or region. Furthermore, you can ask
234
